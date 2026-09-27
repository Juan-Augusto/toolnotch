'use client'

import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { AppButton, AppCheckbox } from '@/components/ui'
import confetti from 'canvas-confetti'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const SEG_COLORS = ['#16a34a', '#dc2626', '#d97706']

interface AppYesNoWheelProps {
  locale?: string
}

export default function AppYesNoWheel({ locale = 'pt' }: AppYesNoWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotationRef = useRef(0)
  const animFrameRef = useRef<number>(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [includeMaybe, setIncludeMaybe] = useState(false)

  const isPt = locale === 'pt'
  const isEs = locale === 'es'

  const yesLabel = isPt ? 'SIM' : isEs ? 'SÍ' : 'YES'
  const noLabel = isPt ? 'NÃO' : isEs ? 'NO' : 'NO'
  const maybeLabel = isPt ? 'TALVEZ' : isEs ? 'QUIZÁS' : 'MAYBE'

  const segments = useMemo(
    () => (includeMaybe ? [yesLabel, noLabel, maybeLabel] : [yesLabel, noLabel]),
    [includeMaybe, yesLabel, noLabel, maybeLabel],
  )

  const draw = useCallback(
    (rotation: number) => {
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

      const arc = (2 * Math.PI) / segments.length

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
      segments.forEach((seg, i) => {
        const angle = rotation + i * arc
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, wheelRadius, angle, angle + arc)
        ctx.closePath()
        ctx.fillStyle = SEG_COLORS[i]
        ctx.fill()
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2.5
        ctx.stroke()

        // Slice label
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(angle + arc / 2)
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
        ctx.shadowBlur = 4
        ctx.shadowOffsetX = 1
        ctx.shadowOffsetY = 1
        ctx.font = '900 18px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
        ctx.fillText(seg, wheelRadius - 18, 0)
        ctx.restore()
      })

      // 3. Metallic brass pegs on outer rim (rotate with the wheel)
      const pegDistance = (wheelRadius + outerRadius) / 2
      const pegCount = segments.length === 2 ? 8 : 9
      const pegArc = (2 * Math.PI) / pegCount
      for (let p = 0; p < pegCount; p++) {
        const angle = rotation + p * pegArc
        const px = cx + pegDistance * Math.cos(angle)
        const py = cy + pegDistance * Math.sin(angle)

        ctx.beginPath()
        ctx.arc(px, py, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = '#fef08a'
        ctx.fill()
        ctx.strokeStyle = '#ca8a04'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // 4. Center hub assembly (layered mechanical look)
      ctx.save()
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)'
      ctx.shadowBlur = 6
      ctx.beginPath()
      ctx.arc(cx, cy, 22, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      ctx.restore()

      ctx.beginPath()
      ctx.arc(cx, cy, 18, 0, Math.PI * 2)
      ctx.fillStyle = '#0f172a'
      ctx.fill()

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
      ctx.moveTo(cx + wheelRadius - 4, cy)
      ctx.lineTo(cx + outerRadius + 12, cy - 10)
      ctx.lineTo(cx + outerRadius + 12, cy + 10)
      ctx.closePath()
      ctx.fillStyle = '#ef4444'
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(cx + outerRadius + 8, cy, 3.5, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      ctx.restore()
    },
    [segments],
  )

  useEffect(() => {
    draw(rotationRef.current)
  }, [draw])

  const spin = () => {
    if (isSpinning) return
    setResult(null)
    setIsSpinning(true)

    const targetIndex = Math.floor(Math.random() * segments.length)
    const arc = (2 * Math.PI) / segments.length
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
      setResult(segments[targetIndex])
      setIsSpinning(false)
      if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } })
        } catch {}
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
        setResult(segments[targetIndex])
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } })
        } catch {}
      }
    }

    animFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => () => cancelAnimationFrame(animFrameRef.current), [])

  const spinButtonLabel = isSpinning
    ? (isPt ? 'Girando…' : isEs ? 'Girando…' : 'Spinning…')
    : (isPt ? 'Girar a Roleta!' : isEs ? '¡Girar la Ruleta!' : 'Spin the Wheel!')

  const includeMaybeText = isPt
    ? 'Incluir "Talvez"'
    : isEs
      ? 'Incluir "Quizás"'
      : 'Include "Maybe"'

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Arcade Wheel Display */}
      <div className="w-full max-w-[340px] aspect-square flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Result Display Banner */}
      {result && (
        <div className="flex flex-col items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            {isPt ? 'Resultado:' : isEs ? 'Resultado:' : 'Result:'}
          </span>
          <div
            className="px-8 py-2.5 border-2 rounded-[2px] font-mono font-black text-3xl sm:text-4xl tracking-wider shadow-xs uppercase"
            style={{
              backgroundColor:
                result === yesLabel
                  ? 'rgba(34, 197, 94, 0.12)'
                  : result === noLabel
                    ? 'rgba(239, 68, 68, 0.12)'
                    : 'rgba(245, 158, 11, 0.12)',
              borderColor:
                result === yesLabel
                  ? '#22c55e'
                  : result === noLabel
                    ? '#ef4444'
                    : '#f59e0b',
              color:
                result === yesLabel
                  ? '#16a34a'
                  : result === noLabel
                    ? '#dc2626'
                    : '#d97706',
            }}
          >
            {result}!
          </div>
        </div>
      )}

      {/* Spin Button */}
      <AppButton
        onClick={spin}
        disabled={isSpinning}
        color="primary"
        className="px-10 py-3 font-mono text-base font-bold"
      >
        {spinButtonLabel}
      </AppButton>

      {/* Include Maybe Toggle */}
      <div className="pt-0.5">
        <AppCheckbox
          checked={includeMaybe}
          onChange={(checked) => {
            setIncludeMaybe(checked)
            setResult(null)
          }}
          label={
            <span className="text-xs sm:text-sm font-mono text-muted-foreground">
              {includeMaybeText}
            </span>
          }
        />
      </div>
    </div>
  )
}
