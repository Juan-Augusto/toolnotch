'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Languages } from 'lucide-react'

const LANGS = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'pt', label: 'Português', short: 'PT' },
  { code: 'es', label: 'Español',   short: 'ES' },
]

function buildLocalePath(pathname: string, from: string, to: string): string {
  // Strip current locale prefix (EN has none; PT/ES have /{locale})
  const base = from !== 'en' ? pathname.replace(`/${from}`, '') || '/' : pathname
  // Add target locale prefix
  return to !== 'en' ? `/${to}${base}` : base
}

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function switchTo(code: string) {
    setOpen(false)
    if (code === locale) return
    router.push(buildLocalePath(pathname, locale, code))
  }

  const current = LANGS.find(l => l.code === locale) ?? LANGS[0]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Change language"
        aria-expanded={open}
        className="flex items-center gap-1.5 px-3 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg text-gray-700 dark:text-gray-300 text-xs font-semibold transition-all hover:scale-105"
      >
        <Languages size={15} />
        {current.short}
      </button>

      {open && (
        <div className="absolute bottom-12 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden min-w-[130px]">
          {LANGS.map(lang => (
            <button
              key={lang.code}
              onClick={() => switchTo(lang.code)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700
                ${lang.code === locale
                  ? 'font-semibold text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300'}`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
