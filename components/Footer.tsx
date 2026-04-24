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
    <footer
      style={{
        background: 'var(--base-surface)',
        borderTop: '1px solid var(--base-border)',
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col items-center gap-5">

        <div
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--neon)', letterSpacing: '0.12em', fontFamily: 'var(--font-display)' }}
        >
          ToolNotch
        </div>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer navigation">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="link-hover text-sm"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div
          className="text-xs text-center max-w-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          Free tools that run in your browser. No sign-up. No data stored.
        </div>

        <div
          className="flex items-center gap-4 text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          <span>© 2026 ToolNotch · Built by Juan Soares</span>
          <a
            href="https://github.com/Juan-Augusto"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="link-hover transition-colors"
          >
            <Github size={14} />
          </a>
        </div>

      </div>
    </footer>
  )
}
