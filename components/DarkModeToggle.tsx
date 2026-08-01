'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Reads DOM class set by the pre-hydration inline script — unavailable during SSR render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains('dark'))
    setMounted(true)
  }, [])

  const toggle = () => {
    const next = !isDark
    const value = next ? 'dark' : 'light'
    if (next) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', value)
    document.cookie = `theme=${value}; path=/; max-age=31536000; SameSite=Lax`
    setIsDark(next)
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        background: 'var(--base-surface)',
        border: `1px solid ${isDark ? 'var(--neon-border)' : 'var(--base-border)'}`,
        boxShadow: isDark ? 'var(--neon-glow-sm)' : 'var(--shadow-sm)',
        color: isDark ? 'var(--neon)' : 'var(--text-secondary)',
        borderRadius: '999px',
        width: '2.25rem',
        height: '2.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'border-color 220ms, box-shadow 220ms, color 220ms, transform 150ms',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px) scale(1.05)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = ''
      }}
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}
