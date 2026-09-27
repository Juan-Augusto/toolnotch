'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import AppSpinWheel, { getWheelItemColor } from '@/components/fun/AppSpinWheel'
import {
  AppTextarea,
  AppInput,
  AppButton,
  AppSegmentedControl,
} from '@/components/ui'
import { Trophy, Plus, Trash2, Shuffle, RotateCcw } from 'lucide-react'

const DEFAULT_NAMES = {
  pt: ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda'],
  es: ['Alejandro', 'Beatriz', 'Carlos', 'Diana', 'Eduardo', 'Fernanda'],
  en: ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona'],
}

const DEFAULT_OPTIONS = {
  pt: ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4', 'Opção 5', 'Opção 6'],
  es: ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5', 'Opción 6'],
  en: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6'],
}

interface SpinWheelClientProps {
  locale?: string
  mode?: 'names' | 'options'
}

export default function SpinWheelClient({ locale, mode }: SpinWheelClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isPt = locale === 'pt' || pathname?.startsWith('/pt')
  const isEs = locale === 'es' || pathname?.startsWith('/es')
  const isWheelOfNames =
    mode === 'names' ||
    (mode !== 'options' && (pathname?.includes('wheel-of-names') ?? false))

  const langKey = isPt ? 'pt' : isEs ? 'es' : 'en'
  const defaultList = isWheelOfNames ? DEFAULT_NAMES[langKey] : DEFAULT_OPTIONS[langKey]

  const [itemsText, setItemsText] = useState(() => {
    const raw = searchParams?.get('items')
    if (raw) {
      try {
        return decodeURIComponent(raw).split(',').join('\n')
      } catch {
        return defaultList.join('\n')
      }
    }
    return defaultList.join('\n')
  })

  const [entryMode, setEntryMode] = useState<'text' | 'list'>('text')
  const [newItemInput, setNewItemInput] = useState('')
  const [lastWinner, setLastWinner] = useState<string | null>(null)

  const items = itemsText
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  useEffect(() => {
    const encoded = encodeURIComponent(items.join(','))
    router.replace(`${pathname}?items=${encoded}`, { scroll: false })
  }, [itemsText]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddItem = (e?: FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = newItemInput.trim()
    if (!trimmed) return
    const nextList = [...items, trimmed]
    setItemsText(nextList.join('\n'))
    setNewItemInput('')
  }

  const handleRemoveItem = (indexToRemove: number) => {
    const nextList = items.filter((_, idx) => idx !== indexToRemove)
    setItemsText(nextList.join('\n'))
  }

  const handleShuffle = () => {
    const shuffled = [...items]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    setItemsText(shuffled.join('\n'))
  }

  const handleClear = () => {
    setItemsText('')
    setLastWinner(null)
  }

  const handleReset = () => {
    setItemsText(defaultList.join('\n'))
    setLastWinner(null)
  }

  const spinButtonText = isPt
    ? 'GIRAR ROLETA'
    : isEs
      ? 'GIRAR RULETA'
      : 'SPIN WHEEL'
  const spinningButtonText = isPt
    ? 'GIRANDO...'
    : isEs
      ? 'GIRANDO...'
      : 'SPINNING...'
  const resultLabel = isWheelOfNames
    ? isPt
      ? 'Nome sorteado:'
      : isEs
        ? 'Nombre seleccionado:'
        : 'Selected name:'
    : isPt
      ? 'Último resultado:'
      : isEs
        ? 'Último resultado:'
        : 'Last result:'
  const optionsTitle = isWheelOfNames
    ? isPt
      ? 'Nomes da Roleta'
      : isEs
        ? 'Nombres de la Ruleta'
        : 'Wheel Names'
    : isPt
      ? 'Opções da Roleta'
      : isEs
        ? 'Opciones de la Ruleta'
        : 'Wheel Options'
  const countLabel = isWheelOfNames
    ? isPt
      ? `${items.length} ${items.length === 1 ? 'nome configurado' : 'nomes configurados'}`
      : isEs
        ? `${items.length} ${items.length === 1 ? 'nombre configurado' : 'nombres configurados'}`
        : `${items.length} ${items.length === 1 ? 'name configured' : 'names configured'}`
    : isPt
      ? `${items.length} ${items.length === 1 ? 'opção configurada' : 'opções configuradas'}`
      : isEs
        ? `${items.length} ${items.length === 1 ? 'opción configurada' : 'opciones configuradas'}`
        : `${items.length} ${items.length === 1 ? 'option configured' : 'options configured'}`

  const textareaPlaceholder = isWheelOfNames
    ? isPt
      ? 'Digite um nome por linha (ex: Ana, Bruno, Carlos)...'
      : isEs
        ? 'Escribe un nombre por línea (ej: Alejandro, Beatriz, Carlos)...'
        : 'Enter one name per line (e.g. Alice, Bob, Charlie)...'
    : isPt
      ? 'Digite uma opção por linha...'
      : isEs
        ? 'Escribe una opción por línea...'
        : 'Enter one option per line...'

  const inputPlaceholder = isWheelOfNames
    ? isPt
      ? 'Novo nome (ex: Gabriel)...'
      : isEs
        ? 'Nuevo nombre (ej: Gabriel)...'
        : 'New name (e.g. Gabriel)...'
    : isPt
      ? 'Nova opção (ex: Opção 7)...'
      : isEs
        ? 'Nueva opción (ej: Opción 7)...'
        : 'New option (e.g. Option 7)...'

  const emptyMessage = isWheelOfNames
    ? isPt
      ? 'Nenhum nome adicionado. Digite acima para começar.'
      : isEs
        ? 'No hay nombres. Escribe arriba para empezar.'
        : 'No names added. Type above to start.'
    : isPt
      ? 'Nenhuma opção adicionada. Digite acima para começar.'
      : isEs
        ? 'No hay opciones. Escribe arriba para empezar.'
        : 'No options added. Type above to start.'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
      {/* Col 1: Wheel canvas & Spin trigger */}
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center justify-center">
        <AppSpinWheel
          items={items}
          onResult={setLastWinner}
          spinButtonText={spinButtonText}
          spinningButtonText={spinningButtonText}
        />

        {lastWinner && (
          <div className="mt-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4 text-primary shrink-0" />
              <span>{resultLabel}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground tracking-tight break-words max-w-sm">
              {lastWinner}
            </div>
          </div>
        )}
      </div>

      {/* Col 2: Options configuration (open layout, no AppCard) */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-4">
        {/* Header bar: Title & Segmented Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-mono tracking-tight text-foreground">
              {optionsTitle}
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

        {/* Content depending on entry mode */}
        {entryMode === 'text' ? (
          <div className="flex flex-col gap-3">
            <AppTextarea
              rows={9}
              value={itemsText}
              onChange={(e) => setItemsText(e.target.value)}
              placeholder={textareaPlaceholder}
              className="font-mono text-xs sm:text-sm leading-relaxed"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Add single item input */}
            <form onSubmit={handleAddItem} className="flex gap-2 items-center">
              <div className="flex-1">
                <AppInput
                  value={newItemInput}
                  onChange={(e) => setNewItemInput(e.target.value)}
                  placeholder={inputPlaceholder}
                  className="font-mono text-xs sm:text-sm"
                />
              </div>
              <AppButton
                type="submit"
                color="primary"
                small
                disabled={!newItemInput.trim()}
                className="font-mono text-xs whitespace-nowrap h-[42px] px-3.5"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                {isPt ? 'Adicionar' : isEs ? 'Agregar' : 'Add'}
              </AppButton>
            </form>

            {/* List of items */}
            <div className="flex flex-col max-h-[300px] overflow-y-auto divide-y divide-border/40 border border-border/80 rounded-[2px] bg-background/50">
              {items.map((item, idx) => (
                <div
                  key={`${idx}-${item}`}
                  className="flex items-center justify-between px-3 py-2 text-xs sm:text-sm hover:bg-secondary/40 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: getWheelItemColor(idx, items.length) }}
                    />
                    <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">
                      {idx + 1}.
                    </span>
                    <span className="font-mono text-foreground truncate" title={item}>
                      {item}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    aria-label={
                      isPt
                        ? `Remover ${item}`
                        : isEs
                          ? `Eliminar ${item}`
                          : `Remove ${item}`
                    }
                    className="text-muted-foreground hover:text-danger p-1 rounded transition-colors opacity-70 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {items.length === 0 && (
                <div className="p-6 text-center text-xs text-muted-foreground font-mono">
                  {emptyMessage}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action toolbar below options */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-border/40">
          <div className="flex items-center gap-2">
            <AppButton
              small
              color="tertiary"
              onClick={handleShuffle}
              disabled={items.length < 2}
              className="text-xs font-mono"
            >
              <Shuffle className="w-3.5 h-3.5 mr-1" />
              {isPt ? 'Embaralhar' : isEs ? 'Mezclar' : 'Shuffle'}
            </AppButton>
            <AppButton
              small
              color="tertiary"
              onClick={handleClear}
              disabled={items.length === 0}
              className="text-xs font-mono"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              {isPt ? 'Limpar' : isEs ? 'Limpiar' : 'Clear'}
            </AppButton>
            <AppButton
              small
              color="tertiary"
              onClick={handleReset}
              className="text-xs font-mono"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              {isPt ? 'Padrão' : isEs ? 'Por Defecto' : 'Default'}
            </AppButton>
          </div>

          <span className="text-[11px] text-muted-foreground font-mono">
            {isPt
              ? 'URL salva automaticamente'
              : isEs
                ? 'URL guardada automáticamente'
                : 'URL saved automatically'}
          </span>
        </div>
      </div>
    </div>
  )
}
