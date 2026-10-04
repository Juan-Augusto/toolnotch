'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { AppButton } from '@/components/ui'
import confetti from 'canvas-confetti'

export const SPIN_WHEEL_COLORS = [
  '#2563EB', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#14B8A6', // Teal
]

export function getWheelItemColor(index: number, total: number): string {
  if (total > 1 && index === total - 1 && index % SPIN_WHEEL_COLORS.length === 0) {
    return SPIN_WHEEL_COLORS[1 % SPIN_WHEEL_COLORS.length]
  }
  return SPIN_WHEEL_COLORS[index % SPIN_WHEEL_COLORS.length]
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface SpinWheelProps {
  items: string[]
  onResult: (item: string) => void
  spinButtonText?: string
  spinningButtonText?: string
}

export default function AppSpinWheel({
  items,
  onResult,
  spinButtonText = 'Girar Roleta',
  spinningButtonText = 'Girando...',
}: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotationRef = useRef(0)
  const animFrameRef = useRef<number>(0)
  const [isSpinning, setIsSpinning] = useState(false)

  const draw = useCallback((rotation: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = canvas.offsetWidth || 340
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const outerRadius = size / 2 - 14
    const wheelRadius = outerRadius - 10

    ctx.clearRect(0, 0, size, size)

    if (items.length === 0) {
      ctx.beginPath()
      ctx.arc(cx, cy, wheelRadius, 0, Math.PI * 2)
      ctx.fillStyle = '#e2e8f0'
      ctx.fill()
      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 2
      ctx.stroke()
      return
    }

    const arc = (2 * Math.PI) / items.length

    // 1. Outer Bezel / Rim ring
    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetY = 3
    ctx.beginPath()
    ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#1e293b'
    ctx.fill()
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.restore()

    // 2. Wheel Slices
    items.forEach((item, i) => {
      const angle = rotation + i * arc
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, wheelRadius, angle, angle + arc)
      ctx.closePath()
      ctx.fillStyle = getWheelItemColor(i, items.length)
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()

      // Slice label
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle + arc / 2)
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 3
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1

      const fontSize =
        items.length <= 4 ? 15 : items.length <= 8 ? 13 : items.length <= 16 ? 12 : 10
      ctx.font = `bold ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

      const maxChars = items.length <= 4 ? 18 : items.length <= 8 ? 14 : 10
      const displayText = item.length > maxChars ? item.slice(0, maxChars - 1) + '…' : item

      ctx.fillText(displayText, wheelRadius - 12, 0)
      ctx.restore()
    })

    // 3. Metallic brass pegs on outer rim (they rotate with the wheel!)
    const pegDistance = (wheelRadius + outerRadius) / 2
    items.forEach((_, i) => {
      const angle = rotation + i * arc
      const px = cx + pegDistance * Math.cos(angle)
      const py = cy + pegDistance * Math.sin(angle)

      ctx.beginPath()
      ctx.arc(px, py, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = '#fef08a'
      ctx.fill()
      ctx.strokeStyle = '#ca8a04'
      ctx.lineWidth = 1
      ctx.stroke()
    })

    // 4. Center hub assembly (layered mechanical look)
    // Layer 1: Outer white trim
    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)'
    ctx.shadowBlur = 6
    ctx.beginPath()
    ctx.arc(cx, cy, 22, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.restore()

    // Layer 2: Dark hub disc
    ctx.beginPath()
    ctx.arc(cx, cy, 18, 0, Math.PI * 2)
    ctx.fillStyle = '#0f172a'
    ctx.fill()

    // Layer 3: Center jewel/accent
    ctx.beginPath()
    ctx.arc(cx, cy, 7, 0, Math.PI * 2)
    ctx.fillStyle = '#3b82f6'
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // 5. Inward Needle Pointer (mounted on right rim at angle 0)
    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)'
    ctx.shadowBlur = 6
    ctx.shadowOffsetY = 2

    ctx.beginPath()
    // Needle tip points into the winning slice
    ctx.moveTo(cx + wheelRadius - 4, cy)
    // Base anchors onto the outer rim
    ctx.lineTo(cx + outerRadius + 12, cy - 10)
    ctx.lineTo(cx + outerRadius + 12, cy + 10)
    ctx.closePath()
    ctx.fillStyle = '#ef4444'
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.stroke()

    // Pointer pivot pin
    ctx.beginPath()
    ctx.arc(cx + outerRadius + 8, cy, 3.5, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.restore()
  }, [items])

  useEffect(() => {
    draw(rotationRef.current)
  }, [items, draw])

  const spin = () => {
    if (isSpinning || items.length === 0) return
    setIsSpinning(true)

    const targetIndex = Math.floor(Math.random() * items.length)
    const arc = (2 * Math.PI) / items.length
    const totalSpins = prefersReducedMotion()
      ? 0
      : (Math.floor(Math.random() * 3) + 4) * Math.PI * 2
    const twoPi = Math.PI * 2
    const desiredResting = -(targetIndex * arc + arc / 2)
    let delta = (desiredResting - rotationRef.current) % twoPi
    if (delta < 0) delta += twoPi
    const targetAngle = rotationRef.current + delta + totalSpins

    if (prefersReducedMotion()) {
      rotationRef.current = targetAngle
      draw(targetAngle)
      setIsSpinning(false)
      onResult(items[targetIndex])
      try {
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } })
      } catch {
        // Confetti optional
      }
      return
    }

    const startAngle = rotationRef.current
    const startTime = performance.now()
    const duration = 4000

    const animate = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - t, 4)
      const current = startAngle + (targetAngle - startAngle) * ease

      rotationRef.current = current
      draw(current)

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate)
      } else {
        setIsSpinning(false)
        onResult(items[targetIndex])
        try {
          confetti({ particleCount: 85, spread: 65, origin: { y: 0.6 } })
        } catch {
          // Confetti optional
        }
      }
    }
    animFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => () => cancelAnimationFrame(animFrameRef.current), [])

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-square flex items-center justify-center select-none">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      <AppButton
        onClick={spin}
        disabled={isSpinning || items.length < 2}
        color="primary"
        className="px-8 py-2.5 font-mono text-sm sm:text-base font-bold tracking-wide"
      >
        {isSpinning ? spinningButtonText : spinButtonText}
      </AppButton>
    </div>
  )
}
