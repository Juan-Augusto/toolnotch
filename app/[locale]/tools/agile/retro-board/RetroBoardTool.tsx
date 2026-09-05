'use client'

import { useState, useRef } from 'react'
import { ThumbsUp, Trash2, Plus, Download, RefreshCw } from 'lucide-react'
import ToolWrapper from '@/components/ToolWrapper'
import type { FaqItem } from '@/components/FaqSection'

interface RichContent {
  whatIs: string
  howToUse: string[]
  whyItMatters: string
  proTip: string
}

interface Note {
  id: string
  text: string
  votes: number
}

type ColumnKey = 'wentWell' | 'toImprove' | 'actionItems'

interface Board {
  wentWell: Note[]
  toImprove: Note[]
  actionItems: Note[]
}

interface ColumnConfig {
  key: ColumnKey
  label: string
  accent: string
  headerBg: string
  addBg: string
  voteBg: string
  cardBg: string
  borderColor: string
}

interface Props {
  title: string
  description: string
  faqs: FaqItem[]
  columns: { wentWell: string; toImprove: string; actionItems: string }
  labels: {
    placeholder: string
    addButton: string
    voteAriaLabel: string
    deleteAriaLabel: string
    exportButton: string
    clearButton: string
    clearConfirm: string
    emptyHint: string
    exportHeading: string
    copiedToast: string
  }
  richContent?: RichContent
}

function makeId() {
  return Math.random().toString(36).slice(2, 10)
}

export default function RetroBoardTool({ title, description, faqs, columns, labels, richContent }: Props) {
  const [board, setBoard] = useState<Board>({ wentWell: [], toImprove: [], actionItems: [] })
  const [inputs, setInputs] = useState({ wentWell: '', toImprove: '', actionItems: '' })
  const [toast, setToast] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const COLS: ColumnConfig[] = [
    {
      key: 'wentWell',
      label: columns.wentWell,
      accent: 'text-emerald-700',
      headerBg: 'bg-emerald-50 border-emerald-200',
      addBg: 'bg-emerald-600 hover:bg-emerald-700',
      voteBg: 'hover:bg-emerald-100 text-emerald-700',
      cardBg: 'bg-emerald-50 border-emerald-200',
      borderColor: 'border-emerald-300',
    },
    {
      key: 'toImprove',
      label: columns.toImprove,
      accent: 'text-amber-700',
      headerBg: 'bg-amber-50 border-amber-200',
      addBg: 'bg-amber-500 hover:bg-amber-600',
      voteBg: 'hover:bg-amber-100 text-amber-700',
      cardBg: 'bg-amber-50 border-amber-200',
      borderColor: 'border-amber-300',
    },
    {
      key: 'actionItems',
      label: columns.actionItems,
      accent: 'text-violet-700',
      headerBg: 'bg-violet-50 border-violet-200',
      addBg: 'bg-violet-600 hover:bg-violet-700',
      voteBg: 'hover:bg-violet-100 text-violet-700',
      cardBg: 'bg-violet-50 border-violet-200',
      borderColor: 'border-violet-300',
    },
  ]

  function addNote(col: ColumnKey) {
    const text = inputs[col].trim()
    if (!text) return
    setBoard(b => ({ ...b, [col]: [...b[col], { id: makeId(), text, votes: 0 }] }))
    setInputs(i => ({ ...i, [col]: '' }))
  }

  function deleteNote(col: ColumnKey, id: string) {
    setBoard(b => ({ ...b, [col]: b[col].filter(n => n.id !== id) }))
  }

  function vote(col: ColumnKey, id: string) {
    setBoard(b => ({
      ...b,
      [col]: b[col].map(n => n.id === id ? { ...n, votes: n.votes + 1 } : n),
    }))
  }

  function clearBoard() {
    if (!window.confirm(labels.clearConfirm)) return
    setBoard({ wentWell: [], toImprove: [], actionItems: [] })
    setInputs({ wentWell: '', toImprove: '', actionItems: '' })
  }

  function exportMarkdown() {
    const lines: string[] = [`# ${labels.exportHeading}`, '']
    COLS.forEach(col => {
      lines.push(`## ${col.label}`)
      const notes = board[col.key]
      if (notes.length === 0) {
        lines.push('_No notes_')
      } else {
        notes
          .slice()
          .sort((a, b) => b.votes - a.votes)
          .forEach(n => {
            lines.push(`- ${n.text}${n.votes > 0 ? ` _(👍 ${n.votes})_` : ''}`)
          })
      }
      lines.push('')
    })
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setToast(true)
      if (toastTimer.current) clearTimeout(toastTimer.current)
      toastTimer.current = setTimeout(() => setToast(false), 2500)
    })
  }

  const totalNotes = board.wentWell.length + board.toImprove.length + board.actionItems.length

  return (
    <ToolWrapper
      title={title}
      description={description}
      breadcrumbLabel={title}
      faqs={faqs}
      richContent={richContent}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 justify-end mb-5">
        <button
          onClick={exportMarkdown}
          className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400 bg-card hover:bg-gray-50 text-gray-700 transition-colors"
        >
          <Download size={14} />
          {labels.exportButton}
        </button>
        {totalNotes > 0 && (
          <button
            onClick={clearBoard}
            className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-red-200 hover:border-red-300 bg-card hover:bg-red-50 text-red-600 transition-colors"
          >
            <RefreshCw size={14} />
            {labels.clearButton}
          </button>
        )}
      </div>

      {/* Board columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLS.map(col => (
          <div key={col.key} className={`rounded-xl border ${col.headerBg} flex flex-col overflow-hidden`}>
            {/* Column header */}
            <div className={`px-4 py-3 border-b ${col.headerBg}`}>
              <h2 className={`font-bold text-sm uppercase tracking-wide ${col.accent}`}>
                {col.label}
                {board[col.key].length > 0 && (
                  <span className="ml-2 font-normal text-xs opacity-70">({board[col.key].length})</span>
                )}
              </h2>
            </div>

            {/* Notes */}
            <div className="flex-1 p-3 space-y-2 min-h-[120px]">
              {board[col.key].length === 0 ? (
                <p className="text-xs text-gray-400 text-center pt-6">{labels.emptyHint}</p>
              ) : (
                board[col.key].map(note => (
                  <div
                    key={note.id}
                    className={`rounded-lg border ${col.cardBg} px-3 py-2.5 flex items-start gap-2 group`}
                  >
                    <p className="flex-1 text-sm text-gray-800 leading-snug break-words">{note.text}</p>
                    <div className="flex items-center gap-1 shrink-0 mt-0.5">
                      <button
                        onClick={() => vote(col.key, note.id)}
                        aria-label={labels.voteAriaLabel}
                        className={`flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded transition-colors ${col.voteBg}`}
                      >
                        <ThumbsUp size={12} />
                        {note.votes > 0 && <span>{note.votes}</span>}
                      </button>
                      <button
                        onClick={() => deleteNote(col.key, note.id)}
                        aria-label={labels.deleteAriaLabel}
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add note input */}
            <div className="p-3 border-t border-gray-100 bg-card">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputs[col.key]}
                  onChange={e => setInputs(i => ({ ...i, [col.key]: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') addNote(col.key) }}
                  placeholder={labels.placeholder}
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-violet-300 focus:border-violet-300 min-w-0"
                />
                <button
                  onClick={() => addNote(col.key)}
                  disabled={!inputs[col.key].trim()}
                  aria-label={labels.addButton}
                  className={`${col.addBg} disabled:bg-gray-200 text-white rounded-lg px-3 py-2 transition-colors shrink-0`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg z-50 animate-fade-in">
          {labels.copiedToast}
        </div>
      )}
    </ToolWrapper>
  )
}
