import { useSyncExternalStore } from 'react'

export type Theme = 'dark' | 'light'

const KEY = 'revive-theme'

function getSnapshot(): Theme {
  return (document.documentElement.dataset.theme as Theme) || 'dark'
}

function getServerSnapshot(): Theme {
  return 'dark'
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}

export function useTheme(): [Theme, () => void] {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* private mode */
    }
  }
  return [theme, toggle]
}
