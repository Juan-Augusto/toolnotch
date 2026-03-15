'use client'

import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useState, useRef, useEffect } from 'react'
import { Languages } from 'lucide-react'

const LANGS = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'pt', label: 'Português', short: 'PT' },
  { code: 'es', label: 'Español',   short: 'ES' },
]

const ALL_LOCALE_PREFIXES = ['en', 'pt', 'es']

// Strip any locale prefix then prepend target locale.
// 'en' gets no prefix (localePrefix: 'as-needed').
function buildLocalePath(pathname: string, to: string): string {
  const segment = pathname.split('/')[1]
  const clean = ALL_LOCALE_PREFIXES.includes(segment)
    ? pathname.replace(`/${segment}`, '') || '/'
    : pathname
  return to !== 'en' ? `/${to}${clean}` : clean
}

export default function LanguageSwitcher() {
  const pathname = usePathname()
  const locale = useLocale()
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
    // Set cookie so next-intl middleware uses the chosen locale instead of
    // re-detecting from the browser's Accept-Language header (which would
    // redirect back to the previous locale when navigating to '/').
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; SameSite=Lax`
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = buildLocalePath(pathname, code)
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
