import { motion } from 'framer-motion'
import type { Step } from '../data/objects'
import s from './Steps.module.css'

interface Props {
  steps: Step[]
}

export default function Steps({ steps }: Props) {
  return (
    <ol className={s.list}>
      {steps.map((step, i) => (
        <motion.li
          key={i}
          className={s.item}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={s.num}>{i + 1}</span>
          <div>
            <div className={s.title}>{step.title}</div>
            <p className={s.detail}>{step.detail}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  )
}
