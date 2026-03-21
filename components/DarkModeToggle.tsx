'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Read the class the blocking script already set — no flash, no delay
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
    // Cookie lets the server render <html class="dark"> directly — no flash on navigation
    document.cookie = `theme=${value}; path=/; max-age=31536000; SameSite=Lax`
    setIsDark(next)
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg text-gray-700 dark:text-gray-300 transition-all hover:scale-105"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
