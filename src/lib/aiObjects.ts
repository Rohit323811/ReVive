/**
 * Session cache for AI-identified objects.
 *
 * Scanned objects are synthesized at runtime (not part of the curated catalog),
 * so Project/ObjectDetail/Revivals/Dashboard need a way to resolve them by id.
 * We persist them to localStorage — surviving refreshes and demo reboots — with
 * an LRU cap so storage never bloats.
 */

import { OBJECTS, type DetectedObject } from '../data/objects'

const KEY = 'revive-ai-objects-v1'
const MAX_OBJECTS = 40

function load(): DetectedObject[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as DetectedObject[]
    return Array.isArray(parsed) ? parsed.filter((o) => o && o.id && Array.isArray(o.ideas)) : []
  } catch {
    return []
  }
}

function save(objects: DetectedObject[]): void {
  try {
    // LRU: newest entries last; drop from the front when over the cap.
    localStorage.setItem(KEY, JSON.stringify(objects.slice(-MAX_OBJECTS)))
  } catch {
    /* storage full or private mode — non-fatal */
  }
}

/** Remember (or refresh) an AI-identified object. */
export function cacheAiObject(object: DetectedObject): void {
  const objects = load().filter((o) => o.id !== object.id)
  objects.push(object)
  save(objects)
}

/** Look up a scanned object by id; undefined when unknown. */
export function getAiObject(id: string): DetectedObject | undefined {
  return load().find((o) => o.id === id)
}

/**
 * Curated catalog entry or remembered AI object — the lookup every page uses.
 * Curated entries win so demo tiles always resolve consistently.
 */
export function findObject(id: string): DetectedObject | undefined {
  return OBJECTS.find((o) => o.id === id) ?? getAiObject(id)
}

/** All remembered AI objects (newest first), for catalog-wide lookups. */
export function listAiObjects(): DetectedObject[] {
  return load().reverse()
}
