'use client'

import { useState, useReducer, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { AppButton } from '@/components/ui'
import confetti from 'canvas-confetti'
import { RotateCcw, Volume2, VolumeX, Sparkles, Trophy, Flame } from 'lucide-react'

const AppCoinFlip3D = dynamic(() => import('./AppCoinFlip3D'), { ssr: false })

type Side = 'heads' | 'tails'
type GameMode = 'single' | 'bestOf3'

interface State {
  result: Side | null
  isFlipping: boolean
  history: Side[]
}

type Action =
  | { type: 'FLIP_START' }
  | { type: 'FLIP_END'; result: Side }
  | { type: 'CLEAR_HISTORY' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FLIP_START':
      return { ...state, isFlipping: true }
    case 'FLIP_END':
      return {
        ...state,
        isFlipping: false,
        result: action.result,
        history: [action.result, ...state.history].slice(0, 10),
      }
    case 'CLEAR_HISTORY':
      return {
        ...state,
        result: null,
        history: [],
      }
    default:
      return state
  }
}

// ── Web Audio API sound synthesis (zero external files) ──────────────────────

function playFlickSound() {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'test') return
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1760, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(2640, ctx.currentTime + 0.08)
    osc.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.3)

    gain.gain.setValueAtTime(0.22, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.35)
  } catch {
    // Audio optional
  }
}

function playLandSound() {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'test') return
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(1200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.1)

    gain.gain.setValueAtTime(0.18, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.15)
  } catch {
    // Audio optional
  }
}

// ── Public Component ─────────────────────────────────────────────────────────

interface AppCoinFlipProps {
  locale?: string
}

export default function AppCoinFlip({ locale = 'en' }: AppCoinFlipProps = {}) {
  const [state, dispatch] = useReducer(reducer, {
    result: null,
    isFlipping: false,
    history: [],
  })

  const [pendingResult, setPendingResult] = useState<Side>('heads')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [mode, setMode] = useState<GameMode>('single')
  const [bestOf3Rounds, setBestOf3Rounds] = useState<Side[]>([])

  const isPt = locale === 'pt'
  const isEs = locale === 'es'

  const bo3Heads = bestOf3Rounds.filter((r) => r === 'heads').length
  const bo3Tails = bestOf3Rounds.filter((r) => r === 'tails').length
  const bo3Decided = bo3Heads >= 2 || bo3Tails >= 2
  const bo3AllRoundsPlayed = bestOf3Rounds.length >= 3
  const bo3Complete = bo3AllRoundsPlayed || bo3Decided

  const bo3Winner =
    bo3Heads > bo3Tails
      ? isPt
        ? 'Cara Venceu!'
        : isEs
          ? '¡Cara Ganó!'
          : 'Heads Won!'
      : isPt
        ? 'Coroa Venceu!'
        : isEs
          ? '¡Cruz Ganó!'
          : 'Tails Won!'

  const bo3WinnerFull =
    bo3Heads > bo3Tails
      ? isPt
        ? 'Cara Venceu o Melhor de 3!'
        : isEs
          ? '¡Cara Ganó el Mejor de 3!'
          : 'Heads Won the Best of 3!'
      : isPt
        ? 'Coroa Venceu o Melhor de 3!'
        : isEs
          ? '¡Cruz Ganó el Mejor de 3!'
          : 'Tails Won the Best of 3!'

  const flipButtonText = isPt ? 'Jogar Moeda' : isEs ? 'Lanzar Moneda' : 'Flip Coin'
  const flippingButtonText = isPt ? 'Girando…' : isEs ? 'Girando…' : 'Flipping…'
  const newMatchButtonText = isPt
    ? 'Nova Partida (Melhor de 3)'
    : isEs
      ? 'Nueva Partida (Mejor de 3)'
      : 'New Match (Best of 3)'
  const round3ButtonText = isPt
    ? 'Jogar Rodada 3 (Final)'
    : isEs
      ? 'Lanzar Ronda 3 (Final)'
      : 'Flip Round 3 (Final)'

  let actionButtonText = flipButtonText
  if (state.isFlipping) {
    actionButtonText = flippingButtonText
  } else if (mode === 'bestOf3') {
    if (bo3AllRoundsPlayed) {
      actionButtonText = newMatchButtonText
    } else if (bestOf3Rounds.length === 2 && bo3Decided) {
      actionButtonText = round3ButtonText
    }
  }

  const headsBadge = isPt ? 'CARA' : isEs ? 'CARA' : 'heads'
  const tailsBadge = isPt ? 'COROA' : isEs ? 'CRUZ' : 'tails'
  const headsResult = isPt ? 'Cara!' : isEs ? '¡Cara!' : 'Heads!'
  const tailsResult = isPt ? 'Coroa!' : isEs ? '¡Cruz!' : 'Tails!'

  const historyTitle = isPt
    ? `Histórico (${state.history.length}):`
    : isEs
      ? `Historial (${state.history.length}):`
      : `History (last ${state.history.length}):`

  const flip = useCallback(() => {
    if (state.isFlipping) return

    // If Best of 3 was already completed with all 3 rounds, reset board immediately for the new match
    if (mode === 'bestOf3' && bestOf3Rounds.length >= 3) {
      setBestOf3Rounds([])
    }

    const result: Side = Math.random() < 0.5 ? 'heads' : 'tails'
    setPendingResult(result)
    dispatch({ type: 'FLIP_START' })

    if (soundEnabled) {
      playFlickSound()
    }
  }, [state.isFlipping, soundEnabled, mode, bestOf3Rounds.length])

  // Spacebar keyboard shortcut to flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        flip()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [flip])

  const handleAnimationDone = useCallback(() => {
    dispatch({ type: 'FLIP_END', result: pendingResult })

    if (soundEnabled) {
      playLandSound()
    }

    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
      try {
        confetti({ particleCount: 45, spread: 55, origin: { y: 0.6 } })
      } catch {
        // Confetti optional
      }
    }

    // Best of 3 mode tracking
    if (mode === 'bestOf3') {
      setBestOf3Rounds((prev) => {
        // Reset if previous match had already completed 3 rounds
        const base = prev.length >= 3 ? [] : prev
        const next = [...base, pendingResult]
        const headsCount = next.filter((r) => r === 'heads').length
        const tailsCount = next.filter((r) => r === 'tails').length
        const isComplete = next.length >= 3 || headsCount >= 2 || tailsCount >= 2

        if (isComplete) {
          if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
            try {
              confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } })
            } catch {
              // Confetti optional
            }
          }
        }
        return next
      })
    }
  }, [pendingResult, soundEnabled, mode])

  const displaySide = state.isFlipping ? pendingResult : (state.result ?? 'heads')

  // Calculate streak
  let currentStreak = 0
  if (state.history.length > 0) {
    const first = state.history[0]
    for (const item of state.history) {
      if (item === first) currentStreak++
      else break
    }
  }

  const headsCount = state.history.filter((s) => s === 'heads').length
  const tailsCount = state.history.filter((s) => s === 'tails').length
  const totalFlips = state.history.length
  const headsPercent = totalFlips > 0 ? Math.round((headsCount / totalFlips) * 100) : 50
  const tailsPercent = totalFlips > 0 ? 100 - headsPercent : 50

  return (
    <div className="flex flex-col items-center gap-7 w-full select-none">
      {/* ── Mode Selector Tabs & Sound Toggle ── */}
      <div className="flex items-center justify-between w-full max-w-sm px-1">
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 border border-border rounded-full text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setMode('single')
              setBestOf3Rounds([])
            }}
            className={`px-4 py-1.5 rounded-full font-bold transition-all ${
              mode === 'single'
                ? 'bg-background text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isPt ? 'Padrão (1x)' : isEs ? 'Estándar (1x)' : 'Standard (1x)'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('bestOf3')
              setBestOf3Rounds([])
            }}
            className={`px-4 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition-all ${
              mode === 'bestOf3'
                ? 'bg-background text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>{isPt ? 'Melhor de 3' : isEs ? 'Mejor de 3' : 'Best of 3'}</span>
          </button>
        </div>

        {/* Sound Toggle Button */}
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mudo' : 'Ativar som'}
          className="p-2 rounded-full border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-amber-500" />
          ) : (
            <VolumeX className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* ── Best of 3 Scoreboard (if active) ── */}
      {mode === 'bestOf3' && (
        <div className="flex flex-col items-center gap-2.5 p-3.5 w-full max-w-sm bg-card border-2 border-border rounded-[2px]">
          {/* Header with Title and Reset */}
          <div className="flex items-center justify-between w-full text-xs font-mono font-bold text-muted-foreground pb-1.5 border-b border-border/60">
            <span className="flex items-center gap-1.5 text-foreground">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{isPt ? 'Melhor de 3' : isEs ? 'Mejor de 3' : 'Best of 3'}</span>
            </span>
            <button
              type="button"
              onClick={() => setBestOf3Rounds([])}
              className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
              title={isPt ? 'Reiniciar placar' : isEs ? 'Reiniciar marcador' : 'Reset score'}
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isPt ? 'Reiniciar' : isEs ? 'Reiniciar' : 'Reset'}</span>
            </button>
          </div>

          {/* Score display */}
          <div className="flex items-center justify-between w-full text-xs font-mono font-bold px-1">
            <span className="text-amber-600 dark:text-amber-400">
              {isPt ? 'Cara' : isEs ? 'Cara' : 'Heads'}: {bo3Heads}
            </span>
            <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
              {bestOf3Rounds.length < 3 && !bo3Decided
                ? isPt
                  ? `Rodada ${bestOf3Rounds.length + 1} de 3`
                  : isEs
                    ? `Ronda ${bestOf3Rounds.length + 1} de 3`
                    : `Round ${bestOf3Rounds.length + 1} of 3`
                : isPt
                  ? 'Fim de Jogo'
                  : isEs
                    ? 'Fin del Juego'
                    : 'Match Over'}
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              {isPt ? 'Coroa' : isEs ? 'Cruz' : 'Tails'}: {bo3Tails}
            </span>
          </div>

          {/* 3 Round indicators */}
          <div className="flex gap-3 my-0.5">
            {[0, 1, 2].map((idx) => {
              const r = bestOf3Rounds[idx]
              const isCurrent = idx === bestOf3Rounds.length && !bo3Complete
              const label = r
                ? r === 'heads'
                  ? isPt ? 'C' : isEs ? 'C' : 'H'
                  : isPt ? 'K' : isEs ? 'X' : 'T'
                : `${idx + 1}`

              return (
                <div
                  key={idx}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-black border-2 transition-all ${
                    r === 'heads'
                      ? 'bg-amber-500 text-white border-amber-600'
                      : r === 'tails'
                        ? 'bg-slate-500 text-white border-slate-600'
                        : isCurrent
                          ? 'border-primary text-primary bg-primary/10 animate-pulse'
                          : 'border-border/60 text-muted-foreground/40 bg-muted/30'
                  }`}
                >
                  {label}
                </div>
              )
            })}
          </div>

          {/* Winner announcement & New Match button */}
          {bo3Complete && (
            <div className="flex flex-col items-center gap-1.5 w-full pt-1.5 border-t border-border/50 text-center animate-in fade-in zoom-in-95">
              <div className="text-xs sm:text-sm font-mono font-black text-amber-600 dark:text-amber-400">
                🏆 {bo3AllRoundsPlayed ? bo3WinnerFull : `${bo3Winner} (${bo3Heads} - ${bo3Tails})`}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setBestOf3Rounds([])}
                  className="px-3 py-1 bg-primary text-primary-foreground text-xs font-mono font-bold rounded-[2px] hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {isPt ? 'Nova Partida' : isEs ? 'Nueva Partida' : 'New Match'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Coin Stage (Clean, Open & Tactile) ── */}
      <div className="relative flex flex-col items-center">
        <div
          onClick={flip}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') flip()
          }}
          title={isPt ? 'Clique na moeda para jogar' : isEs ? 'Haz clic en la moneda para lanzar' : 'Click coin to flip'}
          className="relative w-[280px] sm:w-[320px] aspect-square flex items-center justify-center cursor-pointer group select-none transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {/* 3D Coin Canvas */}
          <div className="w-full h-full">
            <AppCoinFlip3D
              side={displaySide}
              flipping={state.isFlipping}
              onDone={handleAnimationDone}
            />
          </div>
        </div>

        {/* Clear prompt below the circle without clipping */}
        <div className="flex flex-col items-center gap-1 mt-3.5 text-center">
          <span className="text-xs sm:text-sm font-mono font-medium text-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {mode === 'bestOf3' && bo3AllRoundsPlayed
                ? isPt
                  ? 'Clique na moeda para iniciar nova partida'
                  : isEs
                    ? 'Haz clic en la moneda para iniciar nueva partida'
                    : 'Click coin to start new match'
                : isPt
                  ? 'Clique na moeda para jogar'
                  : isEs
                    ? 'Haz clic en la moneda para lanzar'
                    : 'Click coin to flip'}
            </span>
          </span>
          <span className="text-xs font-mono text-muted-foreground/75">
            {isPt
              ? 'ou pressione Espaço no teclado'
              : isEs
                ? 'o presiona Espacio en el teclado'
                : 'or press Space on keyboard'}
          </span>
        </div>
      </div>

      {/* ── Result Celebration Display ── */}
      {state.result && !state.isFlipping && (
        <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
          <div
            className={`px-8 py-2.5 border-2 rounded-[2px] font-mono font-bold text-2xl sm:text-3xl tracking-wide uppercase flex items-center gap-2.5 ${
              state.result === 'heads'
                ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400'
                : 'bg-slate-500/15 border-slate-400 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span className="text-xl sm:text-2xl">{state.result === 'heads' ? '🪙' : '🛡️'}</span>
            <span>{state.result === 'heads' ? headsResult : tailsResult}</span>
          </div>

          {/* Streak notification */}
          {currentStreak >= 2 && (
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 border border-amber-500/20 rounded-full animate-in fade-in">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>
                {currentStreak}x{' '}
                {state.result === 'heads'
                  ? isPt
                    ? 'Caras seguidas!'
                    : isEs
                      ? 'Caras seguidas!'
                      : 'Heads in a row!'
                  : isPt
                    ? 'Coroas seguidas!'
                    : isEs
                      ? 'Cruces seguidas!'
                      : 'Tails in a row!'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Main Flip Action Button ── */}
      <AppButton
        onClick={flip}
        disabled={state.isFlipping}
        color="primary"
        className="px-10 py-3 font-mono text-sm sm:text-base font-bold tracking-wider"
      >
        {actionButtonText}
      </AppButton>

      {/* ── Stats & History Dashboard ── */}
      {state.history.length > 0 && (
        <div className="w-full max-w-sm p-4 bg-background border-2 border-border rounded-[2px] space-y-4">
          {/* Dual-color probability bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono font-semibold">
              <span className="text-amber-600 dark:text-amber-400">
                {isPt ? 'Cara' : isEs ? 'Cara' : 'Heads'} {headsPercent}%
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                {isPt ? 'Coroa' : isEs ? 'Cruz' : 'Tails'} {tailsPercent}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-muted rounded-[2px] overflow-hidden flex border border-border/80">
              <div
                className="bg-amber-500 transition-all duration-500"
                style={{ width: `${headsPercent}%` }}
              />
              <div
                className="bg-slate-400 dark:bg-slate-600 transition-all duration-500"
                style={{ width: `${tailsPercent}%` }}
              />
            </div>
          </div>

          {/* Quick counts */}
          <div className="grid grid-cols-2 gap-2 text-center font-mono">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-[2px]">
              <div className="text-muted-foreground font-semibold uppercase text-xs">
                {isPt ? 'Cara (Total)' : isEs ? 'Cara (Total)' : 'Heads Total'}
              </div>
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                {headsCount}
              </div>
            </div>
            <div className="p-2.5 bg-slate-500/10 border border-slate-500/30 rounded-[2px]">
              <div className="text-muted-foreground font-semibold uppercase text-xs">
                {isPt ? 'Coroa (Total)' : isEs ? 'Cruz (Total)' : 'Tails Total'}
              </div>
              <div className="text-xl font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                {tailsCount}
              </div>
            </div>
          </div>

          {/* History header with clear */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold">
              {historyTitle}
            </span>
            <button
              type="button"
              onClick={() => {
                dispatch({ type: 'CLEAR_HISTORY' })
                setBestOf3Rounds([])
              }}
              className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isPt ? 'Limpar' : isEs ? 'Limpiar' : 'Clear'}</span>
            </button>
          </div>

          {/* History badge pills */}
          <div className="flex flex-wrap gap-1.5">
            {state.history.map((side, i) => (
              <span
                key={i}
                className={`px-2.5 py-1 rounded-[2px] text-xs font-mono font-bold uppercase transition-all ${
                  side === 'heads'
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    : 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/30'
                }`}
              >
                {side === 'heads' ? headsBadge : tailsBadge}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
