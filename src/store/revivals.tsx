/**
 * Global store for saved revivals and derived sustainability stats.
 *
 * Plain React context — no state library needed for this scope. Everything
 * persists to localStorage so the demo survives a refresh (and a demo reboot).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { OBJECTS, type DetectedObject, type Idea } from '../data/objects'

export interface Revival {
  id: string
  objectId: string
  ideaId: string
  title: string
  emoji: string
  savedAt: number
  /** Impact snapshot captured at save time (works for AI-identified objects). */
  wasteKg?: number
  savingsUsd?: number
}

interface RevivalsContextValue {
  revivals: Revival[]
  addRevival: (object: DetectedObject, idea: Idea) => void
  removeRevival: (id: string) => void
  hasRevival: (objectId: string, ideaId: string) => boolean
  stats: Stats
}

export interface Stats {
  itemsRevived: number
  wasteKg: number
  savingsUsd: number
  streak: number
}

const KEY = 'revive-revivals-v1'

const RevivalsContext = createContext<RevivalsContextValue | null>(null)

function load(): Revival[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Revival[]
    return Array.isArray(parsed) ? parsed.filter((r) => r && r.id) : []
  } catch {
    return []
  }
}

/** Consecutive-day streak counting distinct days with a saved revival. */
function computeStreak(revivals: Revival[]): number {
  const days = new Set(revivals.map((r) => new Date(r.savedAt).toDateString()))
  if (days.size === 0) return 0

  let streak = 0
  const cursor = new Date()
  // A streak survives as long as the most recent day is today or yesterday.
  if (!days.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1)
    if (!days.has(cursor.toDateString())) return 0
  }
  while (days.has(cursor.toDateString())) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function RevivalsProvider({ children }: { children: ReactNode }) {
  // Lazy initializer: first render already holds persisted data, so the
  // persist effect below can never wipe it with an empty initial state
  // (StrictMode runs mount effects twice — a load-in-effect pattern loses
  // that race; a lazy initializer does not).
  const [revivals, setRevivals] = useState<Revival[]>(() => load())

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(revivals))
    } catch {
      /* ignore */
    }
  }, [revivals])

  const addRevival = useCallback((object: DetectedObject, idea: Idea) => {
    setRevivals((prev) => {
      if (prev.some((r) => r.objectId === object.id && r.ideaId === idea.id)) return prev
      const revival: Revival = {
        id: `${object.id}-${idea.id}-${Date.now()}`,
        objectId: object.id,
        ideaId: idea.id,
        title: idea.title,
        emoji: idea.emoji,
        savedAt: Date.now(),
        wasteKg: object.baseWasteKg * idea.impactFactor,
        savingsUsd: object.baseSavingsUsd * idea.impactFactor,
      }
      return [revival, ...prev]
    })
  }, [])

  const removeRevival = useCallback((id: string) => {
    setRevivals((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const hasRevival = useCallback(
    (objectId: string, ideaId: string) =>
      revivals.some((r) => r.objectId === objectId && r.ideaId === ideaId),
    [revivals],
  )

  const stats = useMemo<Stats>(() => {
    const objectsById = new Map(OBJECTS.map((o) => [o.id, o]))
    let wasteKg = 0
    let savingsUsd = 0
    for (const r of revivals) {
      // Prefer the snapshot captured at save time; fall back to catalog math
      // for legacy entries.
      if (r.wasteKg != null || r.savingsUsd != null) {
        wasteKg += r.wasteKg ?? 0
        savingsUsd += r.savingsUsd ?? 0
        continue
      }
      const object = objectsById.get(r.objectId)
      if (!object) continue
      const idea = object.ideas.find((i) => i.id === r.ideaId)
      const factor = idea?.impactFactor ?? 1
      wasteKg += object.baseWasteKg * factor
      savingsUsd += object.baseSavingsUsd * factor
    }
    return {
      itemsRevived: revivals.length,
      wasteKg,
      savingsUsd,
      streak: computeStreak(revivals),
    }
  }, [revivals])

  const value = useMemo<RevivalsContextValue>(
    () => ({ revivals, addRevival, removeRevival, hasRevival, stats }),
    [revivals, addRevival, removeRevival, hasRevival, stats],
  )

  return <RevivalsContext.Provider value={value}>{children}</RevivalsContext.Provider>
}

export function useRevivals(): RevivalsContextValue {
  const ctx = useContext(RevivalsContext)
  if (!ctx) throw new Error('useRevivals must be used within <RevivalsProvider>')
  return ctx
}
