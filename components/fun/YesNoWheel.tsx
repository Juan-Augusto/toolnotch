'use client'
import { useRef, useEffect, useState, useCallback } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function YesNoWheel() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotationRef = useRef(0)
  const animFrameRef = useRef<number>(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [includeMaybe, setIncludeMaybe] = useState(false)

  const segments = includeMaybe ? ['YES', 'NO', 'MAYBE'] : ['YES', 'NO']
  const segColors = ['#22c55e', '#ef4444', '#f59e0b']

  const draw = useCallback((rotation: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    const size = canvas.offsetWidth
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)
    const cx = size / 2, cy = size / 2, radius = size / 2 - 8
    const arc = (2 * Math.PI) / segments.length

    segments.forEach((seg, i) => {
      const angle = rotation + i * arc
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, angle, angle + arc)
      ctx.fillStyle = segColors[i]
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle + arc / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 22px sans-serif'
      ctx.fillText(seg, radius - 16, 8)
      ctx.restore()
    })

    ctx.beginPath()
    ctx.arc(cx, cy, 18, 0, Math.PI * 2)
    ctx.fillStyle = '#1e293b'
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(cx + radius + 6, cy)
    ctx.lineTo(cx + radius - 12, cy - 12)
    ctx.lineTo(cx + radius - 12, cy + 12)
    ctx.fillStyle = '#1e293b'
    ctx.fill()
  }, [segments, segColors])

  useEffect(() => { draw(rotationRef.current) }, [draw])

  const spin = () => {
    if (isSpinning) return
    setResult(null)
    setIsSpinning(true)
    const idx = Math.floor(Math.random() * segments.length)
    const arc = (2 * Math.PI) / segments.length
    const totalSpins = prefersReducedMotion() ? 0 : (Math.floor(Math.random() * 3) + 4) * Math.PI * 2
    const target = rotationRef.current - (idx * arc + arc / 2) - Math.PI / 2 + totalSpins

    if (prefersReducedMotion()) {
      rotationRef.current = target
      draw(target)
      setResult(segments[idx])
      setIsSpinning(false)
      return
    }

    const start = rotationRef.current, startTime = performance.now(), duration = 4000
    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 4)
      const cur = start + (target - start) * ease
      rotationRef.current = cur
      draw(cur)
      if (t < 1) animFrameRef.current = requestAnimationFrame(animate)
      else { setIsSpinning(false); setResult(segments[idx]) }
    }
    animFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => () => cancelAnimationFrame(animFrameRef.current), [])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-xs">
        <canvas ref={canvasRef} className="w-full aspect-square" />
      </div>
      {result && (
        <div className="text-4xl font-extrabold" style={{ color: result === 'YES' ? '#22c55e' : result === 'NO' ? '#ef4444' : '#f59e0b' }}>
          {result}
        </div>
      )}
      <button
        onClick={spin}
        disabled={isSpinning}
        className="px-10 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {isSpinning ? 'Spinning...' : 'Spin!'}
      </button>
      <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
        <input type="checkbox" checked={includeMaybe} onChange={e => { setIncludeMaybe(e.target.checked); setResult(null) }} className="rounded" />
        Include &quot;Maybe&quot;
      </label>
    </div>
  )
}
