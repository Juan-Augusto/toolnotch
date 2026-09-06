'use client'

import { useEffect, useRef } from 'react'
import { AD_PROVIDER } from '@/lib/adSlots'

interface Props {
  slot: string
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? ''

export default function AdUnit({ slot, className = '' }: Props) {
  const pushed = useRef(false)

  useEffect(() => {
    if (AD_PROVIDER !== 'adsense' || !AD_CLIENT || pushed.current) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // adsbygoogle not loaded yet
    }
  }, [])

  // Hard kill switch — render nothing.
  if (AD_PROVIDER === 'none') return null

  // Fallback display network (Adsterra / Monetag). The per-zone async script is
  // injected globally in the layout once NEXT_PUBLIC_AD_PROVIDER=adsterra and
  // real zone IDs are set in lib/adSlots.ts; until then this is a labelled
  // placeholder that reserves layout space.
  if (AD_PROVIDER === 'adsterra') {
    return (
      <div
        className={`ad-placeholder ${className}`}
        data-ad-network="adsterra"
        data-ad-slot={slot}
      >
        Ad slot ({slot}) — set Adsterra zones in lib/adSlots.ts to activate
      </div>
    )
  }

  // Default: Google AdSense.
  if (!AD_CLIENT) {
    return (
      <div className={`ad-placeholder ${className}`}>
        Ad unit — set NEXT_PUBLIC_ADSENSE_CLIENT to activate
      </div>
    )
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block' }}
      data-ad-client={AD_CLIENT}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
