'use client'
import { useRef, useEffect, useState, useCallback } from 'react'

const COLORS = ['#3b82f6','#ef4444','#22c55e','#f59e0b','#8b5cf6','#ec4899','#14b8a6','#f97316','#6366f1','#84cc16']

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface SpinWheelProps {
  items: string[]
  onResult: (item: string) => void
}

export default function SpinWheel({ items, onResult }: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotationRef = useRef(0)
  const animFrameRef = useRef<number>(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)

  const draw = useCallback((rotation: number) => {
    const canvas = canvasRef.current
    if (!canvas || items.length === 0) return
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    const size = canvas.offsetWidth
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const radius = size / 2 - 8
    const arc = (2 * Math.PI) / items.length

    items.forEach((item, i) => {
      const angle = rotation + i * arc
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, angle, angle + arc)
      ctx.fillStyle = COLORS[i % COLORS.length]
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle + arc / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#fff'
      ctx.font = `bold ${Math.min(14, Math.floor(180 / items.length))}px sans-serif`
      ctx.fillText(item.length > 12 ? item.slice(0, 12) + '…' : item, radius - 8, 4)
      ctx.restore()
    })

    // Center circle
    ctx.beginPath()
    ctx.arc(cx, cy, 16, 0, Math.PI * 2)
    ctx.fillStyle = '#1e293b'
    ctx.fill()

    // Pointer
    ctx.beginPath()
    ctx.moveTo(cx + radius + 6, cy)
    ctx.lineTo(cx + radius - 10, cy - 10)
    ctx.lineTo(cx + radius - 10, cy + 10)
    ctx.fillStyle = '#1e293b'
    ctx.fill()
  }, [items])

  useEffect(() => { draw(rotationRef.current) }, [items, draw])

  const spin = () => {
    if (isSpinning || items.length === 0) return
    setWinner(null)
    setIsSpinning(true)

    const targetIndex = Math.floor(Math.random() * items.length)
    const arc = (2 * Math.PI) / items.length
    const totalSpins = prefersReducedMotion() ? 0 : (Math.floor(Math.random() * 3) + 4) * Math.PI * 2
    const targetAngle = rotationRef.current - (targetIndex * arc + arc / 2) - Math.PI / 2 + totalSpins

    if (prefersReducedMotion()) {
      rotationRef.current = targetAngle
      draw(targetAngle)
      setWinner(items[targetIndex])
      setIsSpinning(false)
      onResult(items[targetIndex])
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
        setWinner(items[targetIndex])
        onResult(items[targetIndex])
      }
    }
    animFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => () => cancelAnimationFrame(animFrameRef.current), [])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-xs">
        <canvas ref={canvasRef} className="w-full aspect-square" />
      </div>
      {winner && (
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Winner!</div>
          <div className="text-2xl font-bold text-gray-900">{winner}</div>
        </div>
      )}
      <button
        onClick={spin}
        disabled={isSpinning || items.length < 2}
        className="px-10 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all"
      >
        {isSpinning ? 'Spinning...' : 'Spin!'}
      </button>
    </div>
  )
}
