/**
 * Client-side analyze pipeline.
 *
 * 1. If the backend proxy is configured (XAI_API_KEY set), send the photo to
 *    /api/analyze → Grok vision → structured analysis.
 * 2. If the proxy is missing, errors, or the request fails, fall back to the
 *    curated demo database so the app is ALWAYS usable offline.
 *
 * AI-analyzed objects are synthesized into the same DetectedObject shape the
 * whole UI already understands — zero UI changes needed for real AI.
 */

import type { DetectedObject, Idea, Project } from '../data/objects'
import { OBJECTS, pickObject } from '../data/objects'
import { ANALYSIS_STAGES } from './stages'
import { cacheAiObject } from './aiObjects'
import { prepareImage } from './image'

export interface AiAnalysis {
  objectName: string
  category: string
  emoji: string
  confidence: number
  secondLifeScore: number
  tagline: string
  ideas: Array<{
    title: string
    emoji: string
    blurb: string
    difficulty?: 'Easy' | 'Medium' | 'Advanced'
    timeMinutes?: number
    estimatedCostUsd?: number
    materials?: string[]
    steps?: Array<{ title: string; detail: string }>
  }>
  estimatedWasteKg?: number
  estimatedSavingsUsd?: number
}

export interface RecognitionResult {
  object: DetectedObject
  confidence: number
  durationMs: number
  source: 'ai' | 'demo'
}

/** Persisted scan counter gives a deterministic but rotating demo experience. */
function getScanCount(): number {
  try {
    return Number(localStorage.getItem('revive-scan-count') ?? '0')
  } catch {
    return 0
  }
}

function bumpScanCount(): void {
  try {
    localStorage.setItem('revive-scan-count', String(getScanCount() + 1))
  } catch {
    /* ignore */
  }
}

/** Match a filename against the demo catalog (used by demo tiles + fallback). */
function matchByFilename(fileName: string): DetectedObject | undefined {
  const name = fileName.toLowerCase()
  return OBJECTS.find((o) =>
    [o.id, ...o.aliases].some((needle) => name.includes(needle.replace(/[^a-z]/g, ''))),
  )
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

/** Map the AI's difficulty string to the curated scale (default: Easy). */
function toDifficulty(d?: string): DifficultySafe {
  return d === 'Medium' || d === 'Advanced' ? d : 'Easy'
}
type DifficultySafe = 'Easy' | 'Medium' | 'Advanced'

/** Convert a raw Grok JSON response into the app-wide DetectedObject shape. */
export function analysisToObject(a: AiAnalysis): DetectedObject {
  const ideas: Idea[] = (a.ideas ?? []).slice(0, 3).map((idea, idx) => {
    const steps = idea.steps ?? []
    const project: Project | undefined =
      steps.length > 0
        ? {
            ideaId: `ai-${idx}`,
            materials: idea.materials ?? ['The identified object'],
            tools: ['Basic household tools'],
            difficulty: toDifficulty(idea.difficulty),
            timeMinutes: Math.max(5, Math.round(idea.timeMinutes ?? 30)),
            estimatedCostUsd: Math.max(0, idea.estimatedCostUsd ?? 0),
            steps,
            tip: 'Work safe: clean the object thoroughly and mind sharp edges before you start.',
          }
        : undefined
    return {
      id: `ai-${idx}`,
      emoji: idea.emoji?.slice(0, 3) || '✨',
      title: idea.title,
      blurb: idea.blurb,
      impactFactor: 1,
      project,
    }
  })

  const bestIdea = ideas.find((i) => i.project) ?? ideas[0]
  const wasteKg = Math.max(0.01, a.estimatedWasteKg ?? 0.1)
  const savingsUsd = Math.max(1, Math.round(a.estimatedSavingsUsd ?? 5))

  return {
    id: `ai-${slugify(a.objectName || 'object')}`,
    name: a.objectName || 'Unknown object',
    emoji: a.emoji?.slice(0, 3) || '✨',
    aliases: [],
    category: a.category || 'Identified by AI',
    tagline: a.tagline || 'Identified by ReVive AI.',
    score: Math.min(100, Math.max(0, Math.round(a.secondLifeScore ?? 70))),
    baseWasteKg: wasteKg / (bestIdea?.impactFactor ?? 1),
    baseSavingsUsd: savingsUsd / (bestIdea?.impactFactor ?? 1),
    sourceHint: `Identified with ${Math.round(a.confidence ?? 90)}% confidence by Grok vision.`,
    ideas: ideas.length > 0 ? ideas : OBJECTS[0].ideas,
  }
}

/**
 * Ask the backend proxy to analyze the image. Throws on any failure —
 * callers fall back to the demo database.
 */
export async function analyzeWithGrok(
  imageBase64: string,
  mimeType: string,
): Promise<AiAnalysis> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType }),
    signal: AbortSignal.timeout(70_000),
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { code?: string }
    throw new Error(body.code ?? `HTTP ${res.status}`)
  }
  const data = (await res.json()) as { analysis?: AiAnalysis }
  if (!data.analysis) throw new Error('EMPTY_ANALYSIS')
  return data.analysis
}

export interface ScanInput {
  /** Raw File when the user uploaded/took a photo; null for demo tiles */
  file?: File | null
  fileName: string
}

/** Total staged duration, same feel as before (1.8–2.8 s). */
function totalDuration(): number {
  return Math.round(1800 + Math.random() * 1000)
}

/**
 * The one entry point the Scan page calls. Keeps the old sync signature for
 * demo tiles (file === null) and awaits the AI when a real photo is present.
 */
export async function recognize(input: ScanInput): Promise<RecognitionResult> {
  bumpScanCount()
  const durationMs = totalDuration()
  const { file, fileName } = input

  if (file) {
    try {
      // Downscale + re-encode client-side: keeps payloads under the Vercel
      // request-body limit and strips EXIF from camera photos.
      const { imageBase64, mimeType } = await prepareImage(file)

      // Run the fetch and the staged-animation delay in parallel; animation
      // always plays at least durationMs so the UX never flashes.
      const [analysis] = await Promise.all([
        analyzeWithGrok(imageBase64, mimeType),
        new Promise((r) => setTimeout(r, durationMs)),
      ])
      const object = analysisToObject(analysis)
      cacheAiObject(object)

      return {
        object,
        confidence: Math.round(analysis.confidence ?? 90),
        durationMs,
        source: 'ai',
      }
    } catch (err) {
      console.warn('[revive] AI analyze failed, using demo fallback:', err)
      // fall through to demo behavior
    }
  }

  // Demo tile or AI-unavailable path: deterministic curated result.
  const object = matchByFilename(fileName) ?? pickObject(getScanCount())
  return {
    object,
    confidence: Math.round(94 + Math.random() * 5),
    durationMs,
    source: 'demo',
  }
}

export { ANALYSIS_STAGES }
