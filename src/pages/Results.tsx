import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, Leaf, Recycle, Wallet } from 'lucide-react'
import ScoreRing from '../components/ScoreRing'
import { iconFor } from '../lib/icons'
import { formatKg, formatUsd } from '../lib/format'
import type { DetectedObject } from '../data/objects'
import { useRevivals } from '../store/revivals'
import s from './Results.module.css'

interface NavState {
  object: DetectedObject
  confidence?: number
  previewUrl?: string
  /** 'ai' when Grok analyzed the photo, 'demo' for demo tiles or fallback */
  source?: 'ai' | 'demo'
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { state } = location as { state: NavState | null }
  const object = state?.object

  const { addRevival, hasRevival, stats } = useRevivals()
  const saved = object ? hasRevival(object.id, object.ideas[0].id) : false

  if (!object) {
    return (
      <div className={s.resultWrap}>
        <div className="empty" style={{ marginTop: 60 }}>
          <div className="icon">📷</div>
          <h3>Nothing scanned yet</h3>
          <p>Run a scan first and your results will appear here.</p>
          <div style={{ marginTop: 18 }}>
            <Link to="/scan" className="btn btn-primary">Go to Scan</Link>
          </div>
      </div>
        <br />
      </div>
    )
  }

  const best = object.ideas.find((i) => i.project) ?? object.ideas[0]
  const wasteKg = object.baseWasteKg * best.impactFactor
  const savingsUsd = object.baseSavingsUsd * best.impactFactor

  const handleSave = () => {
    if (!saved) addRevival(object, best)
  }

  const goToProject = () => {
    navigate(`/project/${object.id}/${best.id}`)
  }

  return (
    <div className={s.resultWrap}>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: 13 }} onClick={() => navigate(-1)}>
          <ArrowLeft size={15} /> Scan another
        </button>
      </motion.div>

      {/* Object identity */}
      <motion.section className={`card ${s.objHero}`} {...fadeUp(0.05)}>
        <span className={s.category}>{object.category}</span>
        <div className={s.objEmoji} aria-hidden="true">{object.emoji}</div>
        <h1>{object.name}</h1>
        <p className={s.tagline}>{object.tagline}</p>
      </motion.section>

      {/* Score */}
      <motion.section className={`card ${s.scorePanel}`} {...fadeUp(0.18)}>
        <span className={s.scoreLabel}>Second Life Score</span>
        <ScoreRing score={object.score} />
        <div className={s.verdict}>
          {object.score >= 85
            ? 'Excellent reuse potential — this is a maker’s favorite.'
            : object.score >= 65
              ? 'Great potential — a weekend project waiting to happen.'
              : object.score >= 45
                ? 'Worth a try — with a little skill, this lives again.'
                : 'Hard to upcycle — recycling or disposal may be the better call.'}
        </div>
        <p className={s.hint}>
          {state?.source === 'ai'
            ? `Identified with ${state?.confidence ?? 96}% confidence · Grok vision`
            : state?.previewUrl
              ? 'Demo result — the AI couldn\u2019t analyze your photo just now. Please try again.'
              : `Demo object · identified with ${state?.confidence ?? 96}% confidence`}
        </p>
      </motion.section>

      {/* Ideas */}
      <div className={s.ideasHead}>
        <h2>What it could become</h2>
        <span className={s.count}>{object.ideas.length} ideas</span>
      </div>

      <div>
        {object.ideas.map((idea, i) => {
          const Icon = iconFor(idea.emoji)
          const recommended = idea.id === best.id
          return (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/project/${object.id}/${idea.id}`}
                className={`card ${s.ideaCard}`}
              >
                <span className={s.ideaIcon}>
                  <Icon size={22} />
                </span>
                <div className={s.ideaBody}>
                  <div className={s.ideaTitleRow}>
                    <h3>{idea.title}</h3>
                    {recommended && <span className="chip chip-brand">🌱 Recommended</span>}
                  </div>
                  <p className={s.ideaBlurb}>{idea.blurb}</p>
                </div>
                <ArrowRight size={17} style={{ color: 'var(--text-3)', flexShrink: 0, alignSelf: 'center' }} />
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Impact of the recommended idea */}
      <motion.div className={s.impactStrip} {...fadeUp(0.6)}>
        <div className={`card ${s.impactCell}`}>
          <Recycle size={18} style={{ color: 'var(--text-3)' }} />
          <div className={s.val}>{formatKg(wasteKg)}</div>
          <div className={s.lab}>waste diverted</div>
        </div>
        <div className={`card ${s.impactCell}`}>
          <Wallet size={18} style={{ color: 'var(--text-3)' }} />
          <div className={s.val}>{formatUsd(savingsUsd)}</div>
          <div className={s.lab}>est. money saved</div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div className={s.actions} {...fadeUp(0.7)}>
        <button className="btn btn-primary grow" onClick={goToProject}>
          <Leaf size={17} /> Start this project
        </button>
        <button className="btn btn-ghost" onClick={handleSave} disabled={saved}>
          {saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
          {saved ? 'Saved' : 'Save idea'}
        </button>
      </motion.div>

      <motion.p {...fadeUp(0.8)} style={{ marginTop: 12, textAlign: 'center', fontSize: 12.5, color: 'var(--text-3)' }}>
        You&apos;ve revived {stats.itemsRevived} {stats.itemsRevived === 1 ? 'object' : 'objects'} so far — see your{' '}
        <Link to="/dashboard" style={{ color: 'var(--brand-400)' }}>impact</Link>.
      </motion.p>
    </div>
  )
}
