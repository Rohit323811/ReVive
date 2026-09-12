import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { KeyRound, Link2, LogOut, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '../store/auth'
import s from './Account.module.css'

export default function Account() {
  const { mode, user, signIn, signUp, signOut } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [info, setInfo] = useState<string>()
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(undefined)
    setInfo(undefined)
    setBusy(true)
    const res = isSignUp ? await signUp(email, password) : await signIn(email, password)
    setBusy(false)
    if (res.error) {
      setError(res.error)
      return
    }
    if ('needsConfirmation' in res && res.needsConfirmation) {
      setInfo('Check your inbox — confirm your email, then sign in.')
    }
  }

  return (
    <div className={s.account}>
      <div className="page-head">
        <h1>Account</h1>
        <p className="sub">Sync your revivals across devices with a free account.</p>
      </div>

      {mode === 'unconfigured' && (
        <motion.div className={`card ${s.setupPanel}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h2>
            <KeyRound size={16} /> Connect Supabase to enable accounts
          </h2>
          <ol>
            <li>
              Create a free project at <strong>supabase.com</strong>
            </li>
            <li>
              Copy <code>.env.example</code> to <code>.env</code>
            </li>
            <li>
              Paste your <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>
            </li>
            <li>
              Run the SQL in <code>supabase/schema.sql</code> (SQL Editor)
            </li>
            <li>Restart the dev server</li>
          </ol>
        </motion.div>
      )}

      {mode === 'loading' && (
        <p style={{ marginTop: 20, color: 'var(--text-3)' }}>Loading session…</p>
      )}

      {mode === 'signedIn' && user && (
        <motion.div
          className={`card ${s.profile}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className={s.avatar}>{(user.email ?? '?')[0].toUpperCase()}</span>
          <h2>{user.email}</h2>
          <span className={s.muted}>
            <ShieldCheck size={12} /> Signed in securely via Supabase
          </span>
          <div className={s.syncNote}>
            ☁️ Cloud sync: your Revivals currently live on this device. Point the save flow at the{' '}
            <code>revivals</code> table (see <code>supabase/schema.sql</code>) to sync them across
            devices.
          </div>
          <button className="btn btn-ghost" onClick={() => void signOut()}>
            <LogOut size={15} /> Sign out
          </button>
        </motion.div>
      )}

      {mode === 'signedOut' && (
        <motion.form
          className={`card ${s.authCard}`}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>{isSignUp ? 'Create your account' : 'Welcome back'}</h2>

          <div className={s.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={s.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className={s.authError}>{error}</div>}
          {info && <div className={s.authInfo}>{info}</div>}

          <button className="btn btn-primary btn-lg" disabled={busy}>
            <Mail size={16} />
            {busy ? 'Please wait…' : isSignUp ? 'Sign up' : 'Sign in'}
          </button>

          <div className={s.authSwitch}>
            {isSignUp ? 'Already have an account?' : 'New to ReVive?'}{' '}
            <button type="button" onClick={() => setIsSignUp((v) => !v)}>
              {isSignUp ? 'Sign in' : 'Create one'}
            </button>
          </div>

          <div className={s.authSwitch} style={{ fontSize: 12, color: 'var(--text-3)' }}>
            <Link2 size={11} style={{ verticalAlign: '-1px' }} /> Magic links & OAuth can be enabled
            in the Supabase dashboard.
          </div>
        </motion.form>
      )}
    </div>
  )
}
