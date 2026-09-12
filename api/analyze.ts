export const config = {
  runtime: 'edge',
  /** Grok vision calls can take a while — allow up to 60 s (Hobby allows 300 s). */
  maxDuration: 60,
}

const XAI_URL = 'https://api.x.ai/v1/chat/completions'
/**
 * Current xAI multimodal model (as of Sept 2026). grok-2-vision-1212 was
 * deprecated Feb 2026 — check https://docs.x.ai/developers/models if this
 * ever stops working.
 */
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

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const apiKey = process.env.XAI_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'AI not configured', code: 'NO_API_KEY' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }

  try {
    const { imageBase64, mimeType } = (await req.json()) as {
      imageBase64?: string
      mimeType?: string
    }

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'imageBase64 is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Reject abuse early: the payload must be a plausible base64 image and the
    // mime type must be one xAI accepts (jpg/jpeg or png).
    const type = (mimeType ?? 'image/jpeg').toLowerCase()
    if (type !== 'image/jpeg' && type !== 'image/jpg' && type !== 'image/png') {
      return new Response(
        JSON.stringify({ error: 'Unsupported image format. Use JPG or PNG.' }),
        {
          status: 415,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
    if (imageBase64.length > 16 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'Image too large after encoding' }),
        {
          status: 413,
          headers: { 'Content-Type': 'application/json' },
        },
      )
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
                  url: `data:${type};base64,${imageBase64}`,
                },
              },
              { type: 'text', text: 'Identify this object and return the JSON.' },
            ],
          },
        ],
      }),
    })

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '')
      console.error('[vercel-api] xAI error', upstream.status, detail.slice(0, 300))
      return new Response(
        JSON.stringify({ error: 'AI provider error', code: 'UPSTREAM_ERROR' }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    const data = (await upstream.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const text = data.choices?.[0]?.message?.content ?? ''

    const match = text.match(/\{[\s\S]*\}/)
    if (!match) {
      return new Response(
        JSON.stringify({ error: 'AI returned no parsable JSON', code: 'BAD_AI_RESPONSE' }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    return new Response(JSON.stringify({ analysis: JSON.parse(match[0]) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[vercel-api] failed:', err)
    return new Response(
      JSON.stringify({ error: 'AI request failed', code: 'UPSTREAM_ERROR' }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
