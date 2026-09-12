import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  CircleUserRound,
  Home,
  LayoutGrid,
  Moon,
  Recycle,
  ScanLine,
  Sun,
} from 'lucide-react'
import { useTheme } from '../lib/theme'
import { useAuth } from '../store/auth'
import s from './AppShell.module.css'

const TOP_LINKS = [
  { to: '/dashboard', label: 'Impact', icon: BarChart3 },
  { to: '/revivals', label: 'My Revivals', icon: LayoutGrid },
  { to: '/about', label: 'About', icon: BookOpen },
]

const TABS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/revivals', label: 'Revivals', icon: LayoutGrid },
  { to: '/scan', label: 'Scan', icon: ScanLine },
  { to: '/dashboard', label: 'Impact', icon: BarChart3 },
]

export default function AppShell() {
  const [theme, toggle] = useTheme()
  const location = useLocation()
  const { mode, user } = useAuth()
  const signedIn = mode === 'signedIn' && !!user

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <>
      <header className={s.topnav}>
        <div className={s.topnavInner}>
          <NavLink to="/" className={s.brand}>
            <span className={s.brandBadge}>
              <Recycle size={18} />
            </span>
            ReVive
          </NavLink>

          <nav className={s.topLinks}>
            {TOP_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `${s.topLink} ${isActive ? s.active : ''}`}
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className={s.spacer} />

          <NavLink
            to="/account"
            className={s.iconBtn}
            aria-label={signedIn ? 'Your account' : 'Sign in'}
            title={signedIn ? user?.email : 'Sign in'}
            style={signedIn ? { color: 'var(--brand-400)', borderColor: 'var(--brand-500)' } : undefined}
          >
            <CircleUserRound size={18} />
          </NavLink>

          <button className={s.iconBtn} onClick={toggle} aria-label="Toggle dark or light mode">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <nav className={s.tabbar} aria-label="Primary">
        {TABS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `${s.tab} ${isActive ? s.active : ''}`}
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
