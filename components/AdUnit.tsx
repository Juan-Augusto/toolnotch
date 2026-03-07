'use client'

import { useEffect, useRef } from 'react'

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
    if (!AD_CLIENT || pushed.current) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // adsbygoogle not loaded yet
    }
  }, [])

  if (!AD_CLIENT) {
    return (
      <div
        className={`bg-zinc-100 border-2 border-dashed border-zinc-200 rounded-lg flex items-center justify-center text-zinc-400 text-xs h-20 ${className}`}
      >
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
