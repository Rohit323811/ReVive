import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Clock,
  Hammer,
  Lightbulb,
  Wallet,
  Wrench,
} from 'lucide-react'
import Steps from '../components/Steps'
import { formatMinutes, formatUsd } from '../lib/format'
import { findObject } from '../lib/aiObjects'
import { useRevivals } from '../store/revivals'
import s from './Project.module.css'

export default function Project() {
  const { objectId, ideaId } = useParams()
  const navigate = useNavigate()
  const { addRevival, hasRevival } = useRevivals()

  const object = findObject(objectId ?? '')
  const idea = object?.ideas.find((i) => i.id === ideaId)
  const project = idea?.project

  if (!object || !idea) {
    return (
      <div className={s.projWrap}>
        <div className="empty" style={{ marginTop: 60 }}>
          <div className="icon">🔍</div>
          <h3>Project not found</h3>
          <p>The link may be outdated. Pick an object and start from its results.</p>
          <div style={{ marginTop: 18 }}>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
          </div>
        </div>
      </div>
    )
  }

  const saved = hasRevival(object.id, idea.id)

  // Idea exists but has no full step-by-step guide (e.g. an older AI scan
  // saved before guides were generated for every idea). Show a useful overview
  // instead of a dead end — the idea can still be saved and tracked.
  if (!project) {
    return (
      <div className={s.projWrap}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: 13 }} onClick={() => navigate(-1)}>
            <ArrowLeft size={15} /> Back
          </button>
        </motion.div>

        <motion.header
          className={`card ${s.projHero}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          <div className={s.objLine}>
            {object.emoji} {object.name}
          </div>
          <h1>{idea.title}</h1>
          <p className={s.blurb}>{idea.blurb}</p>
          <div className={s.meta}>
            <span className="chip">
              <Wallet size={12} /> ~{formatUsd(object.baseSavingsUsd * idea.impactFactor)} saved
            </span>
            <span className="chip">💡 Quick idea</span>
          </div>
        </motion.header>

        <motion.div
          className={s.tip}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
        >
          <Lightbulb size={16} />
          <span>
            This idea doesn&apos;t have a detailed step-by-step guide yet. Scan the object again and
            ReVive&apos;s AI will write full instructions for every idea — or start with the
            recommended idea, which always has a complete guide.
          </span>
        </motion.div>

        <motion.div className={s.projCta} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <button className="btn btn-primary grow" onClick={() => addRevival(object, idea)} disabled={saved}>
            {saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
            {saved ? 'Saved to My Revivals ✓' : 'Save this idea'}
          </button>
          <Link to="/scan" className="btn btn-ghost">Scan again</Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={s.projWrap}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: 13 }} onClick={() => navigate(-1)}>
          <ArrowLeft size={15} /> Back
        </button>
      </motion.div>

      <motion.header
        className={`card ${s.projHero}`}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
      >
        <div className={s.objLine}>
          {object.emoji} {object.name}
        </div>
        <h1>{idea.title}</h1>
        <p className={s.blurb}>{idea.blurb}</p>

        <div className={s.meta}>
          <span className="chip chip-brand">
            <Hammer size={12} /> {project.difficulty}
          </span>
          <span className="chip">
            <Clock size={12} /> ~{formatMinutes(project.timeMinutes)}
          </span>
          <span className="chip">
            <Wallet size={12} /> ~{formatUsd(project.estimatedCostUsd)}
          </span>
          <span className="chip">
            <Wrench size={12} /> {project.steps.length} steps
          </span>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
      >
        <div className={s.matGrid}>
          <div className={`card ${s.matCard}`}>
            <h3>🧺 Materials</h3>
            <ul>
              {project.materials.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
          <div className={`card ${s.matCard}`}>
            <h3>🔧 Tools</h3>
            <ul>
              {project.tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.h2
        className={s.sectionTitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        Step by step
      </motion.h2>

      <Steps steps={project.steps} />

      <motion.div
        className={s.tip}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <Lightbulb size={16} />
        <span>
          <strong>Pro tip:</strong> {project.tip}
        </span>
      </motion.div>

      <motion.div className={s.projCta} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <button
          className="btn btn-primary grow"
          onClick={() => addRevival(object, idea)}
          disabled={saved}
        >
          {saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
          {saved ? 'Saved to My Revivals ✓' : 'Mark complete & save'}
        </button>
      </motion.div>

      {saved && (
        <motion.p className={s.doneNote} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Nice work! This revival now counts toward your impact.
        </motion.p>
      )}
    </div>
  )
}
