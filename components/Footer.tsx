import Link from 'next/link'
import { Github } from 'lucide-react'

interface FooterProps {
  locale: string
}

export default function Footer({ locale }: FooterProps) {
  const navLinks = [
    { label: 'Blog', href: `/${locale}/blog` },
    { label: 'About', href: `/${locale}/about` },
    { label: 'Privacy', href: `/${locale}/privacy` },
    { label: 'Terms', href: `/${locale}/terms` },
    { label: 'Contact', href: `/${locale}/contact` },
  ]

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 text-sm text-gray-500 dark:text-gray-400">
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-4">
        {/* Navigation links */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer navigation">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Tagline */}
        <p className="text-center text-gray-400 dark:text-gray-500">
          Free tools that run in your browser. No sign-up. No data stored.
        </p>

        {/* Copyright + social links */}
        <div className="flex items-center gap-4">
          <span>© 2026 ToolNotch · Built by Juan Soares</span>
          <a
            href="https://github.com/Juan-Augusto"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <Github size={16} />
          </a>
        </div>
      </div>
    </footer>
  )
}
