import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Camera, Sparkles, TrendingDown } from 'lucide-react'
import { OBJECTS } from '../data/objects'
import s from './Home.module.css'

const FLOATERS = [
  { emoji: '🧴', left: '2%', top: 10, delay: 0 },
  { emoji: '📦', left: '22%', top: 44, delay: 0.7 },
  { emoji: '🫙', left: '44%', top: 4, delay: 1.4 },
  { emoji: '👕', left: '66%', top: 40, delay: 2.1 },
  { emoji: '🥫', left: '86%', top: 8, delay: 2.8 },
]

const HOW = [
  { icon: Camera, title: '1 · Point & snap', text: 'Photograph any object you were about to throw away. No signup, no clutter — just the camera.' },
  { icon: Sparkles, title: '2 · Discover', text: 'ReVive identifies it and shows what it could become, with a Second Life Score out of 100.' },
  { icon: TrendingDown, title: '3 · Revive & track', text: 'Follow the guide, save the project, and watch your personal impact grow on the dashboard.' },
]

export default function Home() {
  return (
    <div>
      <motion.section
        className={s.hero}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className={s.kicker}>
          <Sparkles size={13} />
          Not another recycling app
        </span>

        <h1>
          Don&apos;t throw it away.
          <br />
          <span className={s.grad}>Give it another life.</span>
        </h1>

        <p className={s.lede}>
          Snap a photo of something you were about to toss, and ReVive shows you what it could
          become — with clear steps, real numbers, and zero guilt-tripping.
        </p>

        <div className={s.cta}>
          <Link to="/scan" className="btn btn-primary btn-lg">
            Give It a Second Life <ArrowRight size={18} />
          </Link>
          <span className={s.micro}>Free · No signup · Works offline in the demo</span>
        </div>

        <div className={s.floaters} aria-hidden="true">
          {FLOATERS.map((f) => (
            <motion.span
              key={f.emoji}
              className={s.floater}
              style={{ left: f.left, top: f.top }}
              animate={{ y: [0, -9, 0, 7, 0], rotate: [-2, 2, -1, 1, -2] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: f.delay }}
            >
              {f.emoji}
            </motion.span>
          ))}
        </div>
      </motion.section>

      <section className={s.how}>
        {HOW.map((h, i) => (
          <motion.div
            key={h.title}
            className={`card ${s.howCard}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.45, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={s.howNum}>
              <h.icon size={17} />
            </span>
            <div>
              <h3>{h.title}</h3>
              <p>{h.text}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <motion.section
        className={s.band}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className={s.quote}>
          Don&apos;t just tell people to recycle. <em>Show them what their waste could become.</em>
        </p>
        <p className={s.sub}>
          Recycling is a chore. Reinvention is a thrill. ReVive turns waste into a weekend project —
          and every project into measurable impact.
        </p>
      </motion.section>

      <section className={s.gallery}>
        <h2>Objects the demo already knows</h2>
        <div className={s.galleryRow}>
          {OBJECTS.map((o) => (
            <Link key={o.id} to={`/object/${o.id}`} className={s.demoChip}>
              <span className={s.em}>{o.emoji}</span> {o.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
