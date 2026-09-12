/** Staged labels shown while the "AI" (or the real AI) analyzes a photo. */

export interface AnalysisStage {
  label: string
  /** Weight of total time spent in this stage */
  weight: number
}

export const ANALYSIS_STAGES: AnalysisStage[] = [
  { label: 'Isolating the object…', weight: 0.2 },
  { label: 'Identifying materials…', weight: 0.3 },
  { label: 'Matching reuse projects…', weight: 0.3 },
  { label: 'Calculating impact…', weight: 0.2 },
]
