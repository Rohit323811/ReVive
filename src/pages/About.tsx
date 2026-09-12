import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Brain, Camera, Heart, Recycle } from 'lucide-react'
import s from './About.module.css'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-20px' },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export default function About() {
  return (
    <div className={s.wrap}>
      <div className="page-head">
        <h1>About ReVive</h1>
        <p className="sub">
          ReVive exists to change one habit: seeing waste as a raw material, not an endpoint.
        </p>
      </div>

      <motion.section className={`card ${s.block}`} {...fadeUp(0)}>
        <Recycle className={s.blockIcon} size={22} />
        <h2>Our mission</h2>
        <p>
          <strong>Don&apos;t just tell people to recycle. Show them what their waste could become.</strong>{' '}
          Recycling rates stall because the bin is abstract and the payoff is invisible. ReVive
          makes the payoff concrete: a photo becomes a project, a project becomes impact you can
          measure in kilograms and dollars.
        </p>
      </motion.section>

      <motion.section className={`card ${s.block}`} {...fadeUp(0.06)}>
        <Camera className={s.blockIcon} size={22} />
        <h2>How it works</h2>
        <p>
          Photograph an object → our vision engine identifies it and scores its reuse potential →
          you get 3–5 creative second lives, a full step-by-step guide for the best one, and an
          honest estimate of waste diverted and money saved. Save it, build it, and your dashboard
          grows.
        </p>
      </motion.section>

      <motion.section className={`card ${s.block}`} {...fadeUp(0.12)}>
        <Brain className={s.blockIcon} size={22} />
        <h2>How scoring works</h2>
        <p>
          The <strong>Second Life Score (0–100)</strong> blends material recyclability, crafting
          difficulty, safety, and how useful the result actually is. A glass jar scores 95 — it&apos;s
          food-safe and endlessly reusable. A plastic container scores 78 — useful, but with
          limits. In this hackathon build, scores come from a curated demo database; the product
          hooks cleanly into a real vision model later.
        </p>
      </motion.section>

      <motion.section className={`card ${s.block}`} {...fadeUp(0.18)}>
        <Heart className={s.blockIcon} size={22} />
        <h2>Demo disclosure</h2>
        <p>
          This is a hackathon MVP. Recognition runs on a predefined set of seven common objects
          (filename matching makes it feel real — try uploading <em>“water_bottle.jpg”</em>). All
          impact numbers are realistic estimates. Everything else — the flow, the guides, the
          dashboard — is exactly what production would do.
        </p>
      </motion.section>

      <motion.div className={s.cta} {...fadeUp(0.24)}>
        <Link to="/scan" className="btn btn-primary">
          Try the demo <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  )
}
