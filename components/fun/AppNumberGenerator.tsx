'use client'

import { useState } from 'react'
import { randomInt } from '@/lib/random'
import { AppButton, AppInput, AppCheckbox } from '@/components/ui'
import { Binary, Copy, Check } from 'lucide-react'

interface AppNumberGeneratorProps {
  locale?: string
}

export default function AppNumberGenerator({ locale = 'en' }: AppNumberGeneratorProps) {
  const isPt = locale === 'pt'
  const isEs = locale === 'es'

  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [count, setCount] = useState(1)
  const [allowDuplicates, setAllowDuplicates] = useState(true)
  const [sortResults, setSortResults] = useState(false)
  const [results, setResults] = useState<number[]>([])
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const minLabel = isPt ? 'Mínimo' : isEs ? 'Mínimo' : 'Min'
  const maxLabel = isPt ? 'Máximo' : isEs ? 'Máximo' : 'Max'
  const countLabel = isPt ? 'Quantidade' : isEs ? 'Cantidad' : 'Count'
  const allowDuplicatesLabel = isPt
    ? 'Permitir duplicados'
    : isEs
      ? 'Permitir duplicados'
      : 'Allow duplicates'
  const sortResultsLabel = isPt
    ? 'Ordenar resultados'
    : isEs
      ? 'Ordenar resultados'
      : 'Sort results'
  const generateBtnText = isPt ? 'Gerar Números' : isEs ? 'Generar Números' : 'Generate'
  const copyAllText = isPt ? 'Copiar todos' : isEs ? 'Copiar todos' : 'Copy all'
  const copiedText = isPt ? 'Copiado!' : isEs ? '¡Copiado!' : 'Copied!'

  const getResultsHeader = (total: number) => {
    if (isPt) {
      return `${total} número${total !== 1 ? 's' : ''} gerado${total !== 1 ? 's' : ''}`
    }
    if (isEs) {
      return `${total} número${total !== 1 ? 's' : ''} generado${total !== 1 ? 's' : ''}`
    }
    return `${total} number${total !== 1 ? 's' : ''} generated`
  }

  const generate = () => {
    setError('')
    if (min >= max) {
      setError(
        isPt
          ? 'O valor mínimo deve ser menor que o máximo.'
          : isEs
            ? 'El valor mínimo debe ser menor que el máximo.'
            : 'Min must be less than max.',
      )
      return
    }
    if (count < 1 || count > 1000) {
      setError(
        isPt
          ? 'A quantidade deve estar entre 1 e 1000.'
          : isEs
            ? 'La cantidad debe estar entre 1 y 1000.'
            : 'Count must be between 1 and 1000.',
      )
      return
    }

    const range = max - min + 1
    if (!allowDuplicates && count > range) {
      setError(
        isPt
          ? `Não é possível gerar ${count} números únicos no intervalo de ${min} a ${max}.`
          : isEs
            ? `No se pueden generar ${count} números únicos en el rango de ${min} a ${max}.`
            : `Cannot generate ${count} unique numbers in range ${min}–${max}.`,
      )
      return
    }

    let generated: number[]
    if (allowDuplicates) {
      generated = Array.from({ length: count }, () => randomInt(min, max))
    } else {
      const pool = Array.from({ length: range }, (_, i) => min + i)
      const shuffled = [...pool].sort(() => Math.random() - 0.5)
      generated = shuffled.slice(0, count)
    }

    if (sortResults) generated.sort((a, b) => a - b)
    setResults(generated)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(results.join(', '))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 w-full select-none">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <AppInput
          label={minLabel}
          type="number"
          value={isNaN(min) ? '' : min}
          onChange={(e) => setMin(parseInt(e.target.value, 10))}
          className="font-mono text-sm"
        />
        <AppInput
          label={maxLabel}
          type="number"
          value={isNaN(max) ? '' : max}
          onChange={(e) => setMax(parseInt(e.target.value, 10))}
          className="font-mono text-sm"
        />
        <AppInput
          label={countLabel}
          type="number"
          min={1}
          max={1000}
          value={isNaN(count) ? '' : count}
          onChange={(e) => setCount(parseInt(e.target.value, 10))}
          className="font-mono text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-5 text-xs sm:text-sm font-medium pt-1">
        <AppCheckbox
          checked={allowDuplicates}
          onChange={(checked) => setAllowDuplicates(checked)}
          label={<span className="text-muted-foreground hover:text-foreground transition-colors">{allowDuplicatesLabel}</span>}
        />
        <AppCheckbox
          checked={sortResults}
          onChange={(checked) => setSortResults(checked)}
          label={<span className="text-muted-foreground hover:text-foreground transition-colors">{sortResultsLabel}</span>}
        />
      </div>

      {error && <p className="text-red-500 font-mono text-xs">{error}</p>}

      <AppButton
        onClick={generate}
        color="primary"
        className="w-full font-mono font-bold tracking-wide"
      >
        <Binary className="w-4 h-4 mr-2" />
        {generateBtnText}
      </AppButton>

      {results.length > 0 && (
        <div className="p-4 sm:p-5 bg-background border-2 border-border rounded-[2px] shadow-xs space-y-3 animate-in fade-in duration-200">
          <div className="flex justify-between items-center pb-2 border-b border-border/60">
            <span className="text-sm font-semibold text-foreground">
              {getResultsHeader(results.length)}
            </span>
            <button
              onClick={copy}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-primary" />
                  <span>{copiedText}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copyAllText}</span>
                </>
              )}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-60 overflow-y-auto pt-1">
            {results.map((n, i) => (
              <span
                key={i}
                className="bg-muted border border-border rounded-[2px] px-3 py-1.5 text-xs sm:text-sm font-mono font-bold text-foreground shadow-xs"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
