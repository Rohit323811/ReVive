/**
 * Dev-server backend for AI analysis (Grok / xAI).
 *
 * Why a proxy: the XAI API key must never reach the browser. Vite middleware
 * exposes POST /api/analyze on the dev origin; the key stays in .env.
 * For production, deploy supabase/functions/grok-proxy (same contract).
 *
 * Requires `.env` (see .env.example):
 *   XAI_API_KEY=xai-...
 */

import { loadEnv, type Connect, type Plugin } from 'vite'

const XAI_URL = 'https://api.x.ai/v1/chat/completions'
/** Current xAI multimodal model (as of Sept 2026). */
const MODEL = 'grok-4.6'

const SYSTEM_PROMPT = `You are the vision engine of ReVive, an upcycling app.
Identify the single main household object in the photo and assess its reuse potential.
Prefer the app's known catalog when it matches: plastic bottle, cardboard box, glass jar,
old t-shirt, tin can, wooden pallet, plastic container.
Answer with STRICT JSON only (no markdown fences, no commentary):
{
  "objectName": string,          // short common name, e.g. "Plastic Bottle"
  "category": string,            // e.g. "Plastic · PET"
  "emoji": string,               // single emoji for the object
  "confidence": number,          // 0-100
  "secondLifeScore": number,     // 0-100 reuse potential
  "tagline": string,             // one punchy sentence about its upcycling potential
  "ideas": [                     // exactly 3 creative reuse ideas, best first
    {
      "title": string,
      "emoji": string,
      "blurb": string,           // one sentence, concrete and motivating
      "difficulty": "Easy" | "Medium" | "Advanced",
      "timeMinutes": number,
      "estimatedCostUsd": number,
      "materials": string[],     // 2-5 items
      "steps": [                 // 4-6 steps for EVERY idea (each idea must be a real guide)
        { "title": string, "detail": string }
      ]
    }
  ],
  "estimatedWasteKg": number,    // realistic mass of the object
  "estimatedSavingsUsd": number  // vs buying the best equivalent new
}`

interface AnalyzeBody {
  imageBase64?: string
  mimeType?: string
}

function json(res: Connect.ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

export function grokProxyPlugin(): Plugin {
  return {
    name: 'revive-grok-proxy',
    configureServer(server) {
      // Vite exposes .env values to the CLIENT via import.meta.env, but does
      // NOT inject them into process.env. Load them here so a plain
      // `XAI_API_KEY=...` in .env works with `npm run dev` — no shell exports.
      const fileEnv = loadEnv(server.config.mode, process.cwd(), '')
      const apiKey = process.env.XAI_API_KEY || fileEnv.XAI_API_KEY

      server.middlewares.use('/api/analyze', (req, res) => {
        void (async () => {
          if (req.method !== 'POST') {
            json(res, 405, { error: 'Method not allowed' })
            return
          }

          if (!apiKey) {
            json(res, 503, { error: 'AI not configured', code: 'NO_API_KEY' })
            return
          }

          let body = ''
          let aborted = false
          req.on('data', (chunk: Buffer) => {
            body += chunk
            if (body.length > 25 * 1024 * 1024) {
              aborted = true
              json(res, 413, { error: 'Image too large (max ~20 MB)' })
            }
          })
          req.on('end', () => {
            if (aborted) return
            void handle(body)
          })
          req.on('error', () => {
            /* client vanished */
          })

          async function handle(raw: string) {
            let imageBase64 = ''
            let mimeType = 'image/jpeg'
            try {
              const parsed = JSON.parse(raw || '{}') as AnalyzeBody
              imageBase64 = parsed.imageBase64 ?? ''
              mimeType = parsed.mimeType ?? 'image/jpeg'
            } catch {
              json(res, 400, { error: 'Invalid JSON body' })
              return
            }
            if (!imageBase64) {
              json(res, 400, { error: 'imageBase64 is required' })
              return
            }

            // Same guards as the Vercel Edge Function (api/analyze.ts) so dev
            // and production behave identically.
            const type = (mimeType ?? 'image/jpeg').toLowerCase()
            if (type !== 'image/jpeg' && type !== 'image/jpg' && type !== 'image/png') {
              json(res, 415, { error: 'Unsupported image format. Use JPG or PNG.' })
              return
            }
            if (imageBase64.length > 16 * 1024 * 1024) {
              json(res, 413, { error: 'Image too large after encoding' })
              return
            }

            try {
              const upstream = await fetch(XAI_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                  model: MODEL,
                  messages: [
                    {
                      role: 'system',
                      content: SYSTEM_PROMPT,
                    },
                    {
                      role: 'user',
                      content: [
                        {
                          type: 'image_url',
                          image_url: {
                            url: `data:${type};base64,${imageBase64}`,
                          },
                        },
                        { type: 'text', text: 'Identify this object and return the JSON.' },
                      ],
                    },
                  ],
                }),
                signal: AbortSignal.timeout(60_000),
              })

              if (!upstream.ok) {
                const detail = await upstream.text().catch(() => '')
                console.error('[grok-proxy] xAI error', upstream.status, detail.slice(0, 300))
                json(res, 502, { error: 'AI provider error', code: 'UPSTREAM_ERROR' })
                return
              }

              const data = (await upstream.json()) as {
                choices?: Array<{
                  message?: { content?: string }
                }>
              }

              const text = data.choices?.[0]?.message?.content ?? ''

              const match = text.match(/\{[\s\S]*\}/)
              if (!match) {
                json(res, 502, { error: 'AI returned no parsable JSON', code: 'BAD_AI_RESPONSE' })
                return
              }

              json(res, 200, { analysis: JSON.parse(match[0]) })
            } catch (err) {
              console.error('[grok-proxy] failed:', err)
              json(res, 502, { error: 'AI request failed', code: 'UPSTREAM_ERROR' })
            }
          }
        })()
      })
    },
  }
}
