"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export default function AppDarkModeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
    setMounted(true)
  }, [])

  const toggle = () => {
    const next = !isDark
    const value = next ? "dark" : "light"
    if (next) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("theme", value)
    document.cookie = `theme=${value}; path=/; max-age=31536000; SameSite=Lax`
    setIsDark(next)
  }

  if (!mounted) return <div className="w-[18px] h-[18px]" />

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="text-foreground hover:text-primary transition-colors focus:outline-none flex items-center justify-center"
    >
      {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
    </button>
  )
}
