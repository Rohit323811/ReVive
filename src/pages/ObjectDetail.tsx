import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Leaf } from 'lucide-react'
import ScoreRing from '../components/ScoreRing'
import { findObject } from '../lib/aiObjects'
import { iconFor } from '../lib/icons'
import { formatKg, formatUsd } from '../lib/format'
import { useRevivals } from '../store/revivals'
import s from './Results.module.css'

export default function ObjectDetail() {
  const { objectId } = useParams<{ objectId: string }>()
  const navigate = useNavigate()
  const { addRevival, hasRevival } = useRevivals()

  const object = findObject(objectId ?? '')

  if (!object) {
    return (
      <div className={s.resultWrap}>
        <div className="empty" style={{ marginTop: 60 }}>
          <div className="icon">🔍</div>
          <h3>Object not found</h3>
          <p>That object isn&apos;t in the demo catalog.</p>
          <div style={{ marginTop: 18 }}>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
          </div>
        </div>
      </div>
    )
  }

  const best = object.ideas.find((i) => i.project) ?? object.ideas[0]
  const saved = hasRevival(object.id, best.id)

  return (
    <div className={s.resultWrap}>
      <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: 13 }} onClick={() => navigate(-1)}>
        <ArrowLeft size={15} /> Back
      </button>

      <section className={`card ${s.objHero}`}>
        <span className={s.category}>{object.category}</span>
        <div className={s.objEmoji} aria-hidden="true">{object.emoji}</div>
        <h1>{object.name}</h1>
        <p className={s.tagline}>{object.sourceHint}</p>
      </section>

      <section className={`card ${s.scorePanel}`}>
        <span className={s.scoreLabel}>Second Life Score</span>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <ScoreRing score={object.score} />
        </motion.div>
      </section>

      <div className={s.ideasHead}>
        <h2>What it could become</h2>
        <span className={s.count}>{object.ideas.length} ideas</span>
      </div>

      <div>
        {object.ideas.map((idea) => {
          const Icon = iconFor(idea.emoji)
          const recommended = idea.id === best.id
          return (
            <Link key={idea.id} to={`/project/${object.id}/${idea.id}`} className={`card ${s.ideaCard}`}>
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
          )
        })}
      </div>

      <div className={s.impactStrip}>
        <div className={`card ${s.impactCell}`}>
          <div className={s.val}>{formatKg(object.baseWasteKg * best.impactFactor)}</div>
          <div className={s.lab}>waste diverted</div>
        </div>
        <div className={`card ${s.impactCell}`}>
          <div className={s.val}>{formatUsd(object.baseSavingsUsd * best.impactFactor)}</div>
          <div className={s.lab}>est. money saved</div>
        </div>
      </div>

      <div className={s.actions}>
        <button className="btn btn-primary grow" onClick={() => addRevival(object, best)} disabled={saved}>
          <Leaf size={17} /> {saved ? 'Saved to My Revivals' : 'Save best idea'}
        </button>
      </div>
    </div>
  )
}
