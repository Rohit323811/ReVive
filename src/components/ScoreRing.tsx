import { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import s from './ScoreRing.module.css'

interface Props {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
}

function scoreColor(score: number): string {
  if (score >= 85) return 'var(--brand-400)'
  if (score >= 70) return '#a3e635'
  return 'var(--amber)'
}

export default function ScoreRing({ score, size = 132, strokeWidth = 10, label = 'Second Life Score' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1400
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 4)
      setDisplay(Math.round(score * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, score])

  const r = (size - strokeWidth) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - display / 100)

  return (
    <div ref={ref} className={s.wrap} style={{ width: size, height: size }} role="img" aria-label={`${label}: ${display} out of 100`}>
      <svg width={size} height={size} className={s.svg}>
        <circle cx={size / 2} cy={size / 2} r={r} className={s.track} strokeWidth={strokeWidth} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className={s.bar}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={scoreColor(score)}
          strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: 'spring', stiffness: 60, damping: 20 }}
        />
      </svg>
      <div className={s.center}>
        <div className={s.score}>{display}</div>
        <div className={s.of}>/100</div>
      </div>
    </div>
  )
}
