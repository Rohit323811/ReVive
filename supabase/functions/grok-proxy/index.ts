/**
 * Supabase Edge Function: grok-proxy
 *
 * Production twin of vite.grok-proxy.ts — same POST contract:
 *   { imageBase64, mimeType } → { analysis }
 *
 * Deploy:
 *   supabase secrets set XAI_API_KEY=xai-...
 *   supabase functions deploy grok-proxy
 *
 * Call from the app (set VITE_PROXY_URL to this function's URL):
 *   POST https://<project>.supabase.co/functions/v1/grok-proxy
 */

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

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  const apiKey = Deno.env.get('XAI_API_KEY')
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'AI not configured', code: 'NO_API_KEY' }), {
      status: 503,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { imageBase64, mimeType } = (await req.json()) as {
      imageBase64?: string
      mimeType?: string
    }
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: 'imageBase64 is required' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

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
                  url: `data:${mimeType ?? 'image/jpeg'};base64,${imageBase64}`,
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
      return new Response(JSON.stringify({ error: 'AI provider error', code: 'UPSTREAM_ERROR' }), {
        status: 502,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    const data = (await upstream.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const text = data.choices?.[0]?.message?.content ?? ''

    const match = text.match(/\{[\s\S]*\}/)
    if (!match) {
      return new Response(JSON.stringify({ error: 'AI returned no parsable JSON', code: 'BAD_AI_RESPONSE' }), {
        status: 502,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ analysis: JSON.parse(match[0]) }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[grok-proxy] failed:', err)
    return new Response(JSON.stringify({ error: 'AI request failed', code: 'UPSTREAM_ERROR' }), {
      status: 502,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }
})
