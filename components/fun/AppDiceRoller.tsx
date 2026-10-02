'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { parseDiceNotation, randomInt } from '@/lib/random'
import { DiceRoll } from '@/lib/randomTypes'
import { AppButton } from '@/components/ui'
import confetti from 'canvas-confetti'
import { RotateCcw, Volume2, VolumeX, Sparkles, Dices, Flame } from 'lucide-react'

const AppDiceRoller3D = dynamic(() => import('./AppDiceRoller3D'), { ssr: false })

const PRESETS = ['1d4', '1d6', '1d8', '1d10', '1d12', '1d20', '1d100', '2d6', '3d6']

// ── Web Audio synthesis for dice rattle and clatter ─────────────────────────

function playDiceSound() {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'test') return
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    // Multi-tap rattle & table bounce
    const delays = [0.0, 0.06, 0.13, 0.45, 0.74]
    delays.forEach((delay, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = idx < 3 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(
        idx < 3 ? 950 + Math.random() * 300 : 380 + Math.random() * 80,
        ctx.currentTime + delay,
      )
      gain.gain.setValueAtTime(idx < 3 ? 0.08 : 0.16, ctx.currentTime + delay)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.07)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + 0.08)
    })
  } catch {
    // Audio optional
  }
}

interface AppDiceRollerProps {
  locale?: string
}

export default function AppDiceRoller({ locale = 'en' }: AppDiceRollerProps = {}) {
  const [notation, setNotation] = useState('1d6')
  const [rolls, setRolls] = useState<DiceRoll[]>([])
  const [isRolling, setIsRolling] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [error, setError] = useState('')
  const [pendingRoll, setPendingRoll] = useState<DiceRoll | null>(null)

  const isPt = locale === 'pt'
  const isEs = locale === 'es'

  const labelNotation = isPt
    ? 'Notação dos Dados'
    : isEs
      ? 'Notación de Dados'
      : 'Dice Notation'

  const placeholderNotation = isPt ? 'ex.: 2d6+3' : isEs ? 'p. ej. 2d6+3' : 'e.g. 2d6+3'
  const rollBtnText = isPt ? 'Rolar' : isEs ? 'Lanzar' : 'Roll'
  const rollingBtnText = isPt ? 'Rolando…' : isEs ? 'Lanzando…' : 'Rolling…'
  const errorNotation = isPt
    ? 'Notação inválida. Tente "2d6" ou "1d20+5".'
    : isEs
      ? 'Notación no válida. Prueba "2d6" o "1d20+5".'
      : 'Invalid notation. Try "2d6" or "1d20+5".'

  const presetsLabel = isPt ? 'Predefinições:' : isEs ? 'Preajustes:' : 'Presets:'
  const historyTitle = isPt
    ? 'Rolagens Anteriores:'
    : isEs
      ? 'Lanzamientos Anteriores:'
      : 'Previous rolls:'
  const clearText = isPt ? 'Limpar' : isEs ? 'Limpiar' : 'Clear'

  const roll = useCallback(() => {
    if (isRolling) return
    const parsed = parseDiceNotation(notation)
    if (!parsed) {
      setError(errorNotation)
      return
    }
    setError('')

    const rollResults = Array.from({ length: parsed.count }, () => randomInt(1, parsed.sides))
    const sum = rollResults.reduce((a, b) => a + b, 0)
    const total = sum + parsed.modifier
    const newRoll: DiceRoll = { notation, rolls: rollResults, sum, total }

    setPendingRoll(newRoll)
    setIsRolling(true)

    if (soundEnabled) {
      playDiceSound()
    }
  }, [isRolling, notation, errorNotation, soundEnabled])

  // Spacebar keyboard shortcut to roll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        roll()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [roll])

  const handleAnimationDone = useCallback(() => {
    if (!pendingRoll) return

    const parsed = parseDiceNotation(pendingRoll.notation)
    const isNat20 = parsed && parsed.sides === 20 && pendingRoll.rolls.includes(20)
    const isAllMax = parsed && pendingRoll.rolls.every((r) => r === parsed.sides)

    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
      if (isNat20 || (isAllMax && parsed && parsed.count <= 6)) {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.55 } })
        } catch {
          // Confetti optional
        }
      }
    }

    setRolls((prev) => [pendingRoll, ...prev].slice(0, 5))
    setIsRolling(false)
    setPendingRoll(null)
  }, [pendingRoll])

  const latest = rolls[0]

  // Build dice array for the 3D scene
  const dice3D = useMemo(() => {
    const current = pendingRoll ?? latest
    if (!current) return []
    const parsed = parseDiceNotation(current.notation)
    if (!parsed) return []
    return current.rolls.slice(0, 6).map((result) => ({
      sides: parsed.sides as 4 | 6 | 8 | 10 | 12 | 20 | 100,
      result: parsed.sides > 20 ? result : Math.min(result, parsed.sides),
    }))
  }, [pendingRoll, latest])

  const parsedLatest = latest ? parseDiceNotation(latest.notation) : null
  const isLatestNat20 = parsedLatest && parsedLatest.sides === 20 && latest?.rolls.includes(20)
  const isLatestAllMax =
    parsedLatest && latest && latest.rolls.length > 0 && latest.rolls.every((r) => r === parsedLatest.sides)

  return (
    <div className="space-y-6 w-full select-none">
      {/* ── Sound toggle & quick utilities ── */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
          <Dices className="w-4 h-4 text-primary" />
          <span>{labelNotation}</span>
        </div>

        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mudo' : 'Ativar som'}
          className="p-1.5 rounded-full border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* ── Input & Action ── */}
      <div>
        <div className="flex gap-2">
          <input
            type="text"
            value={notation}
            onChange={(e) => setNotation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && roll()}
            placeholder={placeholderNotation}
            className="flex-1 px-4 py-2.5 bg-background border border-border rounded-[2px] font-mono text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-colors"
          />
          <AppButton
            onClick={roll}
            disabled={isRolling}
            color="primary"
            className="px-6 sm:px-8 font-mono font-bold tracking-wide"
          >
            {isRolling ? rollingBtnText : rollBtnText}
          </AppButton>
        </div>
        {error && <p className="text-red-500 font-mono text-xs mt-1.5 animate-in fade-in">{error}</p>}
      </div>

      {/* ── Presets ── */}
      <div>
        <span className="block text-xs font-mono uppercase tracking-wider text-muted-foreground/80 mb-1.5 font-semibold">
          {presetsLabel}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setNotation(p)
                setError('')
              }}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-[2px] border transition-all cursor-pointer ${
                notation === p
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3D Viewport with Realistic Bounce Animation ── */}
      {dice3D.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          <div
            onClick={roll}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') roll()
            }}
            title={isPt ? 'Clique nos dados para rolar' : isEs ? 'Haz clic en los dados para lanzar' : 'Click dice to roll'}
            className="w-full flex items-center justify-center cursor-pointer group transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <AppDiceRoller3D
              dice={dice3D}
              rolling={isRolling}
              onAllDone={handleAnimationDone}
            />
          </div>

          {/* Prompt below dice */}
          <div className="flex flex-col items-center gap-0.5 text-center mt-1">
            <span className="text-xs font-mono font-medium text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {isPt
                  ? 'Clique nos dados para rolar'
                  : isEs
                    ? 'Haz clic en los dados para lanzar'
                    : 'Click dice to roll'}
              </span>
            </span>
            <span className="text-[11px] font-mono text-muted-foreground/75">
              {isPt
                ? 'ou pressione Espaço no teclado'
                : isEs
                  ? 'o presiona Espacio en el teclado'
                  : 'or press Space on keyboard'}
            </span>
          </div>
        </div>
      )}

      {/* ── Result Celebration Display ── */}
      {latest && !isRolling && (
        <div className="p-4 sm:p-5 bg-background border-2 border-border rounded-[2px] text-center space-y-2 animate-in fade-in zoom-in-95 duration-200">
          {/* Critical Roll Celebration */}
          {isLatestNat20 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold rounded-full animate-in fade-in">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{isPt ? '20 Natural! Sucesso Crítico!' : isEs ? '¡20 Natural! ¡Éxito Crítico!' : 'Natural 20! Critical Hit!'}</span>
            </div>
          )}

          {!isLatestNat20 && isLatestAllMax && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/15 border border-primary/30 text-primary font-mono text-xs font-bold rounded-full animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>{isPt ? 'Rolagem Máxima!' : isEs ? '¡Tirada Máxima!' : 'Max Roll!'}</span>
            </div>
          )}

          {/* Big Total */}
          <div className="text-4xl sm:text-5xl font-black font-mono text-primary tracking-tight">
            {latest.total}
          </div>

          {/* Individual dice pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {latest.rolls.map((r, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-muted border border-border rounded-[2px] font-mono text-xs font-bold text-foreground"
              >
                🎲 {r}
              </span>
            ))}
          </div>

          {/* Formula breakdown */}
          <div className="text-xs sm:text-sm font-mono text-muted-foreground pt-0.5">
            {latest.notation} = [{latest.rolls.join(' + ')}]
            {latest.total !== latest.sum ? ` ${latest.total > latest.sum ? '+' : '-'} ${Math.abs(latest.total - latest.sum)} = ${latest.total}` : ''}
          </div>
        </div>
      )}

      {/* ── Roll History ── */}
      {rolls.length > 1 && (
        <div className="p-3.5 sm:p-4 bg-background border-2 border-border rounded-[2px] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-semibold text-foreground">
              {historyTitle}
            </span>
            <button
              type="button"
              onClick={() => setRolls([])}
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{clearText}</span>
            </button>
          </div>

          <div className="space-y-1.5 text-xs sm:text-sm">
            {rolls.slice(1).map((r, i) => (
              <div
                key={i}
                className="flex justify-between items-center px-3 py-2 bg-muted/50 rounded-[2px] border border-border/50 text-muted-foreground"
              >
                <span className="font-semibold text-foreground/90">{r.notation}</span>
                <span className="font-bold text-foreground">
                  {r.total} <span className="font-normal text-muted-foreground/70">({r.rolls.join(', ')})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

