'use client'

import { useState, type FormEvent } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useAnimate } from 'framer-motion'
import confetti from 'canvas-confetti'
import { pickRandom, shuffleArray } from '@/lib/random'
import {
  AppTextarea,
  AppInput,
  AppCheckbox,
  AppButton,
  AppBadge,
  AppSegmentedControl,
} from '@/components/ui'
import { Trophy, RotateCcw, Shuffle, Plus, Trash2, Sparkles, UserCheck } from 'lucide-react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const SAMPLE_NAMES = {
  pt: ['Alice', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda'],
  es: ['Alejandro', 'Beatriz', 'Carlos', 'Diana', 'Eduardo', 'Florencia'],
  en: ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona'],
}

interface AppNamePickerProps {
  locale?: string
}

export default function AppNamePicker({ locale }: AppNamePickerProps) {
  const pathname = usePathname()
  const activeLocale =
    locale ||
    (pathname?.startsWith('/pt')
      ? 'pt'
      : pathname?.startsWith('/es')
        ? 'es'
        : 'en')
  const isPt = activeLocale === 'pt'
  const isEs = activeLocale === 'es'

  const currentLang = isPt ? 'pt' : isEs ? 'es' : 'en'

  const [namesText, setNamesText] = useState('')
  const [entryMode, setEntryMode] = useState<'text' | 'list'>('text')
  const [newNameInput, setNewNameInput] = useState('')
  const [winner, setWinner] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [remaining, setRemaining] = useState<string[] | null>(null)
  const [removeOnPick, setRemoveOnPick] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [reelNames, setReelNames] = useState<string[]>([])
  const [reelScope, animateReel] = useAnimate()

  const getNames = () =>
    namesText
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0)

  const namesList = getNames()
  const pool = removeOnPick ? (remaining ?? namesList) : namesList

  const handleAddName = (e?: FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = newNameInput.trim()
    if (!trimmed) return
    const next = [...namesList, trimmed]
    setNamesText(next.join('\n'))
    setNewNameInput('')
    setRemaining(null)
  }

  const handleRemoveName = (indexToRemove: number) => {
    const next = namesList.filter((_, idx) => idx !== indexToRemove)
    setNamesText(next.join('\n'))
    setRemaining(null)
  }

  const handleShuffle = () => {
    const shuffled = shuffleArray(namesList)
    setNamesText(shuffled.join('\n'))
    setRemaining(null)
  }

  const handleClear = () => {
    setNamesText('')
    setRemaining(null)
    setWinner(null)
  }

  const handleLoadSample = () => {
    setNamesText(SAMPLE_NAMES[currentLang].join('\n'))
    setRemaining(null)
    setWinner(null)
  }

  const pick = async () => {
    if (isAnimating) return
    const currentPool = removeOnPick ? (remaining ?? getNames()) : getNames()
    if (currentPool.length === 0) return

    const [picked] = pickRandom(currentPool)

    if (prefersReducedMotion()) {
      setWinner(picked)
      setHistory((h) => [picked, ...h].slice(0, 8))
      if (removeOnPick) setRemaining(currentPool.filter((n) => n !== picked))
      return
    }

    // Build reel sequence: cycling random names landing on winner
    const all = getNames()
    const cycles = 18
    const shuffledReel = shuffleArray(all)
    const sequence = Array.from({ length: cycles }, (_, i) => {
      if (i === cycles - 1) return picked
      return shuffledReel[i % shuffledReel.length] || picked
    })
    setReelNames(sequence)
    setIsAnimating(true)
    setWinner(null)

    const ITEM_HEIGHT = 68
    const total = sequence.length * ITEM_HEIGHT

    await animateReel(
      reelScope.current,
      { y: -total + ITEM_HEIGHT },
      {
        duration: 1.6,
        ease: [0.25, 0.1, 0.05, 1],
      }
    )

    setIsAnimating(false)
    setWinner(picked)
    setHistory((h) => [picked, ...h].slice(0, 8))
    if (removeOnPick) setRemaining(currentPool.filter((n) => n !== picked))

    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } })
    } catch {
      // Confetti optional
    }

    if (reelScope.current) {
      animateReel(reelScope.current, { y: 0 }, { duration: 0 })
    }
  }

  const reset = () => {
    setRemaining(null)
    setWinner(null)
    setHistory([])
    setReelNames([])
  }

  // Localized copy
  const sectionTitle = isPt
    ? 'Lista de Nomes'
    : isEs
      ? 'Lista de Nombres'
      : 'Name List'
  const countLabel = isPt
    ? `${pool.length} ${pool.length === 1 ? 'nome configurado' : 'nomes configurados'}`
    : isEs
      ? `${pool.length} ${pool.length === 1 ? 'nombre configurado' : 'nombres configurados'}`
      : `${pool.length} ${pool.length === 1 ? 'name configured' : 'names configured'}`

  const removeCheckboxLabel = isPt
    ? 'Remover nomes sorteados (sorteio sem repetição)'
    : isEs
      ? 'Eliminar nombres sorteados (sorteo sin repetición)'
      : 'Remove picked names (pick without replacement)'

  const pickButtonText = isAnimating
    ? isPt
      ? 'Sorteando…'
      : isEs
        ? 'Sorteando…'
        : 'Picking…'
    : removeOnPick && pool.length === 0 && namesList.length > 0
      ? isPt
        ? 'Nenhum nome restante'
        : isEs
          ? 'No quedan nombres'
          : 'No names left'
      : isPt
        ? 'Sortear Nome'
        : isEs
          ? 'Sortear Nombre'
          : 'Pick Name'

  const resetListText = isPt
    ? 'Restaurar Lista'
    : isEs
      ? 'Restablecer Lista'
      : 'Reset Pool'

  const winnerLabel = isPt
    ? 'Vencedor Sorteado!'
    : isEs
      ? '¡Ganador Sorteado!'
      : 'Winner Picked!'

  const recentPicksLabel = isPt
    ? 'Últimos Sorteados:'
    : isEs
      ? 'Últimos Seleccionados:'
      : 'Recent Picks:'

  return (
    <div className="space-y-6 w-full">
      {/* Header bar: Title & Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" />
            <span>{sectionTitle}</span>
          </h2>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            {countLabel}
          </p>
        </div>

        <div className="w-full sm:w-auto min-w-[210px]">
          <AppSegmentedControl
            size="sm"
            options={[
              {
                label: isPt ? '1 por Linha' : isEs ? '1 por Línea' : '1 per Line',
                value: 'text',
              },
              {
                label: isPt ? 'Lista (1 por 1)' : isEs ? 'Lista (1 por 1)' : 'List (1 by 1)',
                value: 'list',
              },
            ]}
            value={entryMode}
            onChange={(val) => setEntryMode(val as 'text' | 'list')}
          />
        </div>
      </div>

      {/* Mode Content: Bulk Textarea OR 1-by-1 List */}
      {entryMode === 'text' ? (
        <div className="flex flex-col gap-2">
          <AppTextarea
            rows={7}
            value={namesText}
            onChange={(e) => {
              setNamesText(e.target.value)
              setRemaining(null)
            }}
            placeholder={
              isPt
                ? 'Digite um nome por linha (ex: Alice, Bruno, Carlos)...'
                : isEs
                  ? 'Escribe un nombre por línea (ej: Alejandro, Beatriz, Carlos)...'
                  : 'Enter one name per line (e.g. Alice, Bob, Charlie)...'
            }
            className="font-mono text-xs sm:text-sm leading-relaxed"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Add single name input */}
          <form onSubmit={handleAddName} className="flex gap-2 items-center">
            <div className="flex-1">
              <AppInput
                value={newNameInput}
                onChange={(e) => setNewNameInput(e.target.value)}
                placeholder={
                  isPt
                    ? 'Digite um nome...'
                    : isEs
                      ? 'Escribe un nombre...'
                      : 'Enter a name...'
                }
                className="font-mono text-xs sm:text-sm"
              />
            </div>
            <AppButton
              type="submit"
              color="primary"
              small
              disabled={!newNameInput.trim()}
              className="font-mono text-xs whitespace-nowrap h-[42px] px-3.5"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              {isPt ? 'Adicionar' : isEs ? 'Agregar' : 'Add'}
            </AppButton>
          </form>

          {/* Interactive names list */}
          <div className="flex flex-col max-h-[260px] overflow-y-auto divide-y divide-border/40 border border-border/80 rounded-[2px] bg-background/50">
            {namesList.map((name, idx) => (
              <div
                key={`${idx}-${name}`}
                className="flex items-center justify-between px-3 py-2 text-xs sm:text-sm hover:bg-secondary/30 transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="text-xs font-mono text-muted-foreground w-6 shrink-0">
                    {idx + 1}.
                  </span>
                  <span className="font-mono text-foreground truncate" title={name}>
                    {name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveName(idx)}
                  aria-label={
                    isPt
                      ? `Remover ${name}`
                      : isEs
                        ? `Eliminar ${name}`
                        : `Remove ${name}`
                  }
                  className="text-muted-foreground hover:text-danger p-1 rounded transition-colors opacity-70 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {namesList.length === 0 && (
              <div className="p-6 text-center text-xs text-muted-foreground font-mono">
                {isPt
                  ? 'Nenhum nome adicionado. Digite acima ou cole sua lista.'
                  : isEs
                    ? 'No hay nombres. Escribe arriba o pega tu lista.'
                    : 'No names added yet. Type above or paste your list.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Action Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2 mt-4 pt-3.5 sm:pt-4 border-t border-border/60">
        <div className="flex items-center gap-2">
          <AppButton
            small
            color="tertiary"
            onClick={handleShuffle}
            disabled={namesList.length < 2}
            className="text-xs font-mono"
          >
            <Shuffle className="w-3.5 h-3.5 mr-1" />
            {isPt ? 'Embaralhar' : isEs ? 'Mezclar' : 'Shuffle'}
          </AppButton>
          <AppButton
            small
            color="tertiary"
            onClick={handleClear}
            disabled={namesList.length === 0}
            className="text-xs font-mono"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            {isPt ? 'Limpar' : isEs ? 'Limpiar' : 'Clear'}
          </AppButton>
          <AppButton
            small
            color="tertiary"
            onClick={handleLoadSample}
            className="text-xs font-mono"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            {isPt ? 'Exemplo' : isEs ? 'Ejemplo' : 'Sample'}
          </AppButton>
        </div>

        <span className="text-[11px] text-muted-foreground font-mono">
          {removeOnPick
            ? isPt
              ? `${pool.length} restantes`
              : isEs
                ? `${pool.length} restantes`
                : `${pool.length} remaining`
            : isPt
              ? `${namesList.length} total`
              : isEs
                ? `${namesList.length} total`
                : `${namesList.length} total`}
        </span>
      </div>

      {/* Without replacement checkbox */}
      <div className="pt-2">
        <AppCheckbox
          checked={removeOnPick}
          onChange={(checked) => {
            setRemoveOnPick(checked)
            setRemaining(null)
          }}
          label={
            <span className="text-xs sm:text-sm font-mono text-foreground font-medium select-none">
              {removeCheckboxLabel}
            </span>
          }
        />
      </div>

      {/* Trigger Buttons */}
      <div className="flex gap-2.5 pt-1">
        <AppButton
          onClick={pick}
          disabled={isAnimating || pool.length === 0}
          color="primary"
          className="flex-1 font-mono font-bold text-sm sm:text-base py-3 tracking-wide shadow-xs"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          {pickButtonText}
        </AppButton>

        {removeOnPick && history.length > 0 && (
          <AppButton
            onClick={reset}
            color="tertiary"
            className="font-mono text-xs sm:text-sm px-4"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            {resetListText}
          </AppButton>
        )}
      </div>

      {/* Slot machine reel animation */}
      {isAnimating && reelNames.length > 0 && (
        <div
          className="bg-secondary/10 border-2 border-primary rounded-[2px] overflow-hidden flex items-center justify-center shadow-inner"
          style={{ height: 68 }}
        >
          <div ref={reelScope} className="will-change-transform">
            {reelNames.map((name, i) => (
              <div
                key={i}
                className="flex items-center justify-center font-bold font-mono text-2xl text-primary"
                style={{ height: 68 }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Winner reveal: Open layout without enclosing card */}
      <AnimatePresence>
        {winner && !isAnimating && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="py-5 px-4 text-center animate-in fade-in zoom-in-95 duration-200 border-y border-border/80 bg-secondary/5"
          >
            <div className="inline-flex mb-2">
              <AppBadge
                bg="bg-primary"
                text="text-background"
                icon={<Trophy className="w-3.5 h-3.5" />}
              >
                {winnerLabel}
              </AppBadge>
            </div>
            <div className="text-3xl sm:text-5xl font-black font-mono text-foreground break-words tracking-tight">
              {winner}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent picks history */}
      {history.length > 0 && (
        <div className="pt-3 border-t border-border/60">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{recentPicksLabel}</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {history.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="px-2.5 py-1 bg-secondary/15 border border-border/80 rounded-[2px] text-xs font-mono font-medium text-foreground"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

