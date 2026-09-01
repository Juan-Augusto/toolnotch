'use client'

import { ExternalLink } from 'lucide-react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

interface Props {
  href: string
  label: string
}

/**
 * The primary outbound CTA to TSE's official polling-place lookup.
 * Fires a GA4 `outbound_click` event on click (per PRD success metrics) —
 * this is the page's real "conversion," since there is no on-site tool.
 * A tiny client boundary so the rest of the page can stay a server component.
 */
export default function PollingPlaceOutboundLink({ href, label }: Props) {
  const handleClick = () => {
    try {
      window.gtag?.('event', 'outbound_click', {
        link_url: href,
        link_domain: 'tse.jus.br',
        outbound: true,
      })
    } catch {
      // gtag not loaded — never block navigation on analytics
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="btn-neon"
    >
      {label}
      <ExternalLink size={15} />
    </a>
  )
}
