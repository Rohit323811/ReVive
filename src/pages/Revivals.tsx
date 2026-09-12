import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Trash2 } from 'lucide-react'
import { findObject } from '../lib/aiObjects'
import { iconFor } from '../lib/icons'
import { useRevivals } from '../store/revivals'
import s from './Revivals.module.css'

export default function Revivals() {
  const { revivals, removeRevival, stats } = useRevivals()

  const objectOf = (id: string) => findObject(id)

  return (
    <div>
      <div className="page-head">
        <h1>My Revivals</h1>
        <p className="sub">
          Projects you&apos;ve brought back to life. Every card here is waste that never made it to the bin.
        </p>
      </div>

      {revivals.length === 0 ? (
        <motion.div
          className="empty"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="icon">🪴</div>
          <h3>Nothing here yet</h3>
          <p>
            Scan your first object and save an idea — your revived items will grow here like a
            well-fed plant.
          </p>
          <div style={{ marginTop: 18 }}>
            <Link to="/scan" className="btn btn-primary">Give It a Second Life</Link>
          </div>
        </motion.div>
      ) : (
        <>
          <motion.div
            className={s.teaser}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span>
              <strong>{stats.itemsRevived}</strong> revived · <strong>{stats.streak}</strong> day
              {stats.streak === 1 ? '' : 's'} streak
            </span>
            <Link to="/dashboard" className={s.teaserLink}>
              Full impact <ArrowRight size={13} />
            </Link>
          </motion.div>

          <AnimatePresence initial={false}>
            {revivals.map((r) => {
              const obj = objectOf(r.objectId)
              const idea = obj?.ideas.find((i) => i.id === r.ideaId)
              const Icon = iconFor(r.emoji)
              return (
                <motion.div
                  key={r.id}
                  layout
                  className={`card ${s.row}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3 }}
                >
                  <span className={s.icon}>
                    <Icon size={21} />
                  </span>
                  <div className={s.body}>
                    <div className={s.title}>{idea?.title ?? r.title}</div>
                    <div className={s.sub}>
                      {obj ? `${obj.emoji} ${obj.name}` : 'Unknown object'} ·{' '}
                      {new Date(r.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  {obj && idea ? (
                    <Link to={`/project/${obj.id}/${idea.id}`} className={s.open}>
                      Guide <ArrowRight size={13} />
                    </Link>
                  ) : null}
                  <button
                    className={s.del}
                    onClick={() => removeRevival(r.id)}
                    aria-label={`Remove ${r.title}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
