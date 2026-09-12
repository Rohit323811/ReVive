import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, PiggyBank, Recycle, ShoppingBasket, Sparkles } from 'lucide-react'
import { OBJECTS } from '../data/objects'
import { listAiObjects } from '../lib/aiObjects'
import { formatKg, formatUsd } from '../lib/format'
import { useRevivals } from '../store/revivals'
import s from './Dashboard.module.css'

const card = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-20px' },
}

export default function Dashboard() {
  const { stats, revivals } = useRevivals()

  // Group by object; curated and remembered AI objects keep their real names,
  // anything unknown falls back to the title captured at save time.
  const objectsById = new Map([...OBJECTS, ...listAiObjects()].map((o) => [o.id, o]))
  const groups = new Map<string, { id: string; name: string; emoji: string; count: number }>()
  for (const r of revivals) {
    const cat = objectsById.get(r.objectId)
    const g =
      groups.get(r.objectId) ??
      { id: r.objectId, name: cat?.name ?? r.title, emoji: cat?.emoji ?? r.emoji, count: 0 }
    g.count += 1
    groups.set(r.objectId, g)
  }
  const breakdown = [...groups.values()].sort((a, b) => b.count - a.count)

  const maxCount = Math.max(1, ...breakdown.map((b) => b.count))

  return (
    <div>
      <div className="page-head">
        <h1>Your impact</h1>
        <p className="sub">
          Small revivals, compounding results. This is what your hands kept out of landfill.
        </p>
      </div>

      {stats.itemsRevived === 0 ? (
        <motion.div className="empty" {...card} transition={{ duration: 0.45 }}>
          <div className="icon">📊</div>
          <h3>Your impact story starts here</h3>
          <p>
            Revive your first object and watch this dashboard come alive — waste diverted, money
            saved, streaks earned.
          </p>
          <div style={{ marginTop: 18 }}>
            <Link to="/scan" className="btn btn-primary">Scan your first object</Link>
          </div>
        </motion.div>
      ) : (
        <>
          <div className={s.grid}>
            <motion.div className={`card ${s.statCard}`} {...card} transition={{ duration: 0.45, delay: 0 }}>
              <span className={`${s.statIcon} ${s.green}`}>
                <Recycle size={20} />
              </span>
              <div className={s.val}>{stats.itemsRevived}</div>
              <div className={s.lab}>Items revived</div>
            </motion.div>

            <motion.div className={`card ${s.statCard}`} {...card} transition={{ duration: 0.45, delay: 0.07 }}>
              <span className={`${s.statIcon} ${s.blue}`}>
                <ShoppingBasket size={20} />
              </span>
              <div className={s.val}>{formatKg(stats.wasteKg)}</div>
              <div className={s.lab}>Waste diverted</div>
            </motion.div>

            <motion.div className={`card ${s.statCard}`} {...card} transition={{ duration: 0.45, delay: 0.14 }}>
              <span className={`${s.statIcon} ${s.gold}`}>
                <PiggyBank size={20} />
              </span>
              <div className={s.val}>{formatUsd(stats.savingsUsd)}</div>
              <div className={s.lab}>Money saved</div>
            </motion.div>

            <motion.div className={`card ${s.statCard}`} {...card} transition={{ duration: 0.45, delay: 0.21 }}>
              <span className={`${s.statIcon} ${s.orange}`}>
                <Flame size={20} />
              </span>
              <div className={s.val}>
                {stats.streak}
                <span className={s.valUnit}>day{stats.streak === 1 ? '' : 's'}</span>
              </div>
              <div className={s.lab}>Reuse streak</div>
            </motion.div>
          </div>

          <motion.section className={`card ${s.breakdown}`} {...card} transition={{ duration: 0.45, delay: 0.28 }}>
            <h2 className={s.bdTitle}>
              <Sparkles size={15} /> What you revive most
            </h2>
            {breakdown.map((b, i) => (
              <div key={b.id} className={s.bdRow}>
                <span className={s.bdLabel}>
                  {b.emoji} {b.name}
                </span>
                <div className={s.bdBarTrack}>
                  <motion.div
                    className={s.bdBar}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(b.count / maxCount) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <span className={s.bdCount}>×{b.count}</span>
              </div>
            ))}
          </motion.section>

          <motion.p className={s.footerNote} {...card} transition={{ duration: 0.45, delay: 0.34 }}>
            💡 Estimates use typical material weights and replacement costs. Real impact varies —
            the habit is what counts.
          </motion.p>
        </>
      )}
    </div>
  )
}
