import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, Check, ImagePlus, ScanLine } from 'lucide-react'
import { OBJECTS, type DetectedObject } from '../data/objects'
import { ANALYSIS_STAGES } from '../lib/stages'
import { recognize, type RecognitionResult } from '../lib/analyze'
import s from './Scan.module.css'

interface Analyzing {
  fileName: string
  previewUrl?: string
  /** Resolves to the AI (or fallback) result; never rejects. */
  result: Promise<RecognitionResult>
}

/** Minimum staged-animation window; real AI may take longer and that's fine. */
const MIN_ANALYSIS_MS = 2000

export default function Scan() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const [analyzing, setAnalyzing] = useState<Analyzing | null>(null)
  const [stage, setStage] = useState(0)

  const startAnalysis = useCallback(
    (fileName: string, previewUrl: string | undefined, file: File | null) => {
      setStage(0)
      setAnalyzing({
        fileName,
        previewUrl,
        result: recognize({ file, fileName }),
      })
    },
    [],
  )

  // Drive the staged progress, then navigate when both the result and the
  // minimum animation window are done (AI latency hidden behind the stages).
  useEffect(() => {
    if (!analyzing) return
    let cancelled = false

    const timers: number[] = []
    let elapsed = 0
    ANALYSIS_STAGES.forEach((st, i) => {
      elapsed += st.weight * MIN_ANALYSIS_MS
      timers.push(window.setTimeout(() => setStage(i + 1), elapsed))
    })

    const minWindow = new Promise((r) => setTimeout(r, MIN_ANALYSIS_MS))

    void Promise.all([analyzing.result, minWindow]).then(([result]) => {
      if (cancelled) return
      navigate('/result', {
        state: {
          object: result.object,
          confidence: result.confidence,
          previewUrl: analyzing.previewUrl,
          source: result.source,
        },
      })
    })

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [analyzing, navigate])

  function handleFile(file: File | undefined) {
    if (!file) return
    const url = URL.createObjectURL(file)
    startAnalysis(file.name, url, file)
  }

  const pickDemo = (object: DetectedObject) => {
    startAnalysis(`${object.id}.jpg`, undefined, null)
  }

  const stageDone = (i: number) => analyzing && stage > i
  const stageActive = (i: number) => analyzing && stage === i

  return (
    <div className={s.scanWrap}>
      <div className="page-head">
        <h1>Scan an object</h1>
        <p className="sub">
          Take a photo or upload an image of something you were about to throw away.
        </p>
      </div>

      <label
        className={`${s.dropzone} ${drag ? s.drag : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDrag(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
      >
        {analyzing?.previewUrl && (
          <img src={analyzing.previewUrl} alt="" className={s.previewImg} aria-hidden="true" />
        )}

        <span className={s.dzIcon}>
          {analyzing ? <ScanLine size={28} /> : <ImagePlus size={28} />}
        </span>
        <h2>{analyzing ? 'Analyzing your object…' : 'Drop a photo here'}</h2>
        <p>
          {analyzing
            ? 'Our vision engine is looking for reuse potential.'
            : 'JPG or PNG. Snap it now or pick from your gallery — or try a demo object below.'}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>

      <div className="row" style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <button className="btn btn-primary grow" onClick={() => fileInputRef.current?.click()}>
          <ImagePlus size={18} /> Upload photo
        </button>
        <button
          className="btn btn-ghost"
          aria-label="Take a photo with camera"
          onClick={() => cameraInputRef.current?.click()}
        >
          <Camera size={18} />
        </button>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {analyzing?.previewUrl && (
        <div className={s.previewChip}>
          <ImagePlus size={15} />
          <span className={s.name}>{analyzing.fileName}</span>
        </div>
      )}

      <AnimatePresence>
        {analyzing && (
          <motion.div
            key="analyze"
            className={`card ${s.analyze}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className={s.analyzeHead}>
              <span className={s.spinner} aria-hidden="true" />
              Analyzing…
            </div>

            <div className={s.stage}>
              {ANALYSIS_STAGES.map((s2, i) => (
                <div key={s2.label} className={`${s.stageRow} ${stageDone(i) ? s.done : ''} ${stageActive(i) ? s.active : ''}`}>
                  <span className={s.stageDot}>
                    {stageDone(i) && <Check size={12} />}
                  </span>
                  {s2.label}
                </div>
              ))}
            </div>

            <div className={s.progress}>
              <div
                className={s.progressBar}
                style={{
                  width: `${Math.min(100, (stage / ANALYSIS_STAGES.length) * 100 + (stageActive(ANALYSIS_STAGES.length - 1) ? 12 : 0))}%`,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!analyzing && (
        <div className={s.demoPick}>
          <h3>No object handy? Try the demo with:</h3>
          <div className={s.demoGrid}>
            {OBJECTS.map((o) => (
              <button key={o.id} className={s.demoTile} onClick={() => pickDemo(o)}>
                <span className={s.em}>{o.emoji}</span>
                {o.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
