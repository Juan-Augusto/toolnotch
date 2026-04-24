'use client'

import { useState, useEffect, useCallback } from 'react'
import { NODEJS_FUNDAMENTALS_QUESTIONS } from '@/data/interview/nodejs-fundamentals-questions'
import type { InterviewQuestion, QuizLevel, QuizState, ExplanationTab, UserAnswer } from '@/lib/interviewTypes'

// ── Level metadata ────────────────────────────────────────────────────────────

const LEVEL_META: Record<QuizLevel, { label: string; color: string; bg: string }> = {
  beginner:     { label: 'Beginner',     color: '#22c55e', bg: '#14532d22' },
  intermediate: { label: 'Intermediate', color: '#f59e0b', bg: '#78350f22' },
  advanced:     { label: 'Advanced',     color: '#ef4444', bg: '#7f1d1d22' },
}

// ── Node.js icon ──────────────────────────────────────────────────────────────

function NodeIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hexagon background */}
      <polygon
        points="32,4 56,18 56,46 32,60 8,46 8,18"
        fill="#68a063"
      />
      {/* Node.js "N" mark */}
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fill="#fff"
        fontSize="26"
        fontWeight="800"
        fontFamily="Inter, system-ui, sans-serif"
      >N</text>
    </svg>
  )
}

// ── Level badge ───────────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: QuizLevel }) {
  const { label, color, bg } = LEVEL_META[level]
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      color,
      background: bg,
      border: `1px solid ${color}44`,
    }}>
      {label}
    </span>
  )
}

// ── Home screen ───────────────────────────────────────────────────────────────

const LEVEL_CARDS: { level: QuizLevel; title: string; desc: string; topics: string[] }[] = [
  {
    level: 'beginner',
    title: 'Beginner',
    desc: '10 questions on Node.js fundamentals',
    topics: ['Single Thread', 'require()', 'Callbacks', 'process.env', 'fs Module', 'npm Scripts', 'Node vs Browser'],
  },
  {
    level: 'intermediate',
    title: 'Intermediate',
    desc: '10 questions on runtime internals',
    topics: ['Event Loop Phases', 'setImmediate', 'process.nextTick', 'Streams', 'Cluster Module', 'V8 Heap', 'EventEmitter'],
  },
  {
    level: 'advanced',
    title: 'Advanced',
    desc: '10 questions on V8 and production systems',
    topics: ['GC Algorithms', 'CPU Profiling', 'Memory Leaks', 'Back-pressure', '--max-old-space-size', 'Hidden Classes', 'PM2'],
  },
]

function HomeScreen({ onStart }: { onStart: (level: QuizLevel) => void }) {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '2.5rem 1.25rem', textAlign: 'center' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <NodeIcon size={56} />
      </div>
      <h1 style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
        Node.js Fundamentals Quiz
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2.5rem' }}>
        30 questions across 3 levels — from the event loop and streams to V8 garbage collection, memory leaks, and production profiling.
        Each answer shows <em>runtime output</em> and the production best practice.
      </p>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', textAlign: 'left' }}>
        {LEVEL_CARDS.map(({ level, title, desc, topics }) => {
          const { color } = LEVEL_META[level]
          return (
            <button
              key={level}
              onClick={() => onStart(level)}
              style={{
                background: 'var(--base-surface)',
                border: '1px solid var(--base-border)',
                borderRadius: '12px',
                padding: '1.5rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = color
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--base-border)'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.05rem' }}>{title}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>{desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {topics.map(t => (
                  <span key={t} style={{
                    background: 'var(--base-bg)',
                    color: 'var(--text-muted)',
                    padding: '1px 7px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    border: '1px solid var(--base-border)',
                  }}>{t}</span>
                ))}
              </div>
              <div style={{ marginTop: '1.25rem' }}>
                <span style={{
                  display: 'inline-block',
                  background: color + '22',
                  color,
                  border: `1px solid ${color}55`,
                  padding: '6px 18px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}>Start →</span>
              </div>
            </button>
          )
        })}
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2.5rem' }}>
        Based on Node.js Docs, V8 Blog &amp; common backend interview questions · Keyboard: 1–4 to answer · Enter/→ to advance · Tab to switch tabs
      </p>
    </div>
  )
}

// ── JS/Node.js Code block ─────────────────────────────────────────────────────

type TType = 'kw' | 'cmt' | 'str' | 'num' | 'txt'

const JS_KW = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
  'do', 'switch', 'case', 'break', 'continue', 'new', 'class', 'this', 'super',
  'extends', 'import', 'export', 'default', 'from', 'typeof', 'instanceof',
  'void', 'delete', 'in', 'of', 'throw', 'try', 'catch', 'finally', 'async',
  'await', 'yield', 'static', 'get', 'set', 'true', 'false', 'null', 'undefined',
  'require', 'module', 'exports', 'process', 'console', 'setTimeout', 'setInterval',
  'setImmediate', 'clearTimeout', 'clearInterval', 'clearImmediate', 'Promise',
  'resolve', 'reject', 'then', 'catch', 'finally', 'Buffer', 'global',
])

type Token = { t: TType; v: string }

function tokenizeJS(code: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < code.length) {
    // Line comment
    if (code[i] === '/' && code[i + 1] === '/') {
      let j = i
      while (j < code.length && code[j] !== '\n') j++
      tokens.push({ t: 'cmt', v: code.slice(i, j) })
      i = j
      continue
    }
    // Block comment
    if (code[i] === '/' && code[i + 1] === '*') {
      let j = i + 2
      while (j < code.length - 1 && !(code[j] === '*' && code[j + 1] === '/')) j++
      j += 2
      tokens.push({ t: 'cmt', v: code.slice(i, j) })
      i = j
      continue
    }
    // Template literal
    if (code[i] === '`') {
      let j = i + 1
      while (j < code.length) {
        if (code[j] === '\\') { j += 2; continue }
        if (code[j] === '`') { j++; break }
        j++
      }
      tokens.push({ t: 'str', v: code.slice(i, j) })
      i = j
      continue
    }
    // String literal
    const q = code[i]
    if (q === "'" || q === '"') {
      let j = i + 1
      while (j < code.length) {
        if (code[j] === '\\') { j += 2; continue }
        if (code[j] === q) { j++; break }
        j++
      }
      tokens.push({ t: 'str', v: code.slice(i, j) })
      i = j
      continue
    }
    // Number
    if (/\d/.test(code[i])) {
      let j = i
      while (j < code.length && /[\d._]/.test(code[j])) j++
      tokens.push({ t: 'num', v: code.slice(i, j) })
      i = j
      continue
    }
    // Identifier / keyword
    if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i
      while (j < code.length && /[a-zA-Z0-9_$]/.test(code[j])) j++
      const w = code.slice(i, j)
      tokens.push({ t: JS_KW.has(w) ? 'kw' : 'txt', v: w })
      i = j
      continue
    }
    tokens.push({ t: 'txt', v: code[i] })
    i++
  }
  return tokens
}

const TOKEN_COLOR: Record<TType, string> = {
  kw:  '#82aaff',
  cmt: '#546e7a',
  str: '#c3e88d',
  num: '#f78c6c',
  txt: '#e8eaf0',
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre style={{
      background: '#12151e',
      borderRadius: '8px',
      padding: '1rem',
      overflowX: 'auto',
      fontSize: '0.8rem',
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      lineHeight: '1.7',
      margin: '0',
      border: '1px solid var(--base-border)',
    }}>
      <code>
        {tokenizeJS(code).map((tok, i) => (
          <span key={i} style={{ color: TOKEN_COLOR[tok.t] }}>{tok.v}</span>
        ))}
      </code>
    </pre>
  )
}

// ── Quiz screen ───────────────────────────────────────────────────────────────

const OPTION_LABELS = ['A', 'B', 'C', 'D']
const TABS: { id: ExplanationTab; label: string }[] = [
  { id: 'why',      label: 'Why This Answer' },
  { id: 'compiled', label: 'Runtime Output' },
  { id: 'best',     label: 'Best Practice' },
]

const ACCENT = '#68a063'

interface QuizScreenProps {
  state: QuizState
  onAnswer: (index: number) => void
  onNext: () => void
  onTab: (tab: ExplanationTab) => void
  onBack: () => void
}

function QuizScreen({ state, onAnswer, onNext, onTab, onBack }: QuizScreenProps) {
  const [shaking, setShaking] = useState<number | null>(null)
  const q = state.questions[state.currentIndex]
  const progress = (state.currentIndex / state.questions.length) * 100
  const isLast = state.currentIndex === state.questions.length - 1
  const lastAnswer = state.userAnswers[state.userAnswers.length - 1]

  const handleOptionClick = (index: number) => {
    if (state.answered) return
    if (index !== q.correctIndex) {
      setShaking(index)
      setTimeout(() => setShaking(null), 600)
    }
    onAnswer(index)
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
        >
          ← Back
        </button>
        <LevelBadge level={state.level!} />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: 'auto' }}>
          Q {state.currentIndex + 1} of {state.questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'var(--base-border)', borderRadius: 2, marginBottom: '1.5rem', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: ACCENT,
          borderRadius: 2,
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Topic label */}
      <div style={{ marginBottom: '0.6rem' }}>
        <span style={{ color: ACCENT, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {q.topic}
        </span>
      </div>

      {/* Question */}
      <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.65, marginBottom: '1rem', fontWeight: 500 }}>
        {q.question}
      </p>

      {/* Code snippet */}
      {q.code && (
        <div style={{ marginBottom: '1.25rem' }}>
          <CodeBlock code={q.code} />
        </div>
      )}

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
        {q.options.map((option, i) => {
          const isCorrect = i === q.correctIndex
          const isChosen = lastAnswer?.chosenIndex === i
          let borderColor = 'var(--base-border)'
          let bg = 'var(--base-surface)'
          let textColor = 'var(--text-primary)'
          if (state.answered) {
            if (isCorrect) { borderColor = '#22c55e'; bg = '#14532d22'; textColor = '#22c55e' }
            else if (isChosen && !isCorrect) { borderColor = '#ef4444'; bg = '#7f1d1d22'; textColor = '#ef4444' }
          }
          return (
            <button
              key={i}
              onClick={() => handleOptionClick(i)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                background: bg,
                border: `1px solid ${borderColor}`,
                borderRadius: '8px',
                cursor: state.answered ? 'default' : 'pointer',
                textAlign: 'left',
                color: textColor,
                fontSize: '0.9rem',
                lineHeight: 1.5,
                transition: 'border-color 0.15s, background 0.15s',
                animation: shaking === i ? 'nodeShake 0.55s ease' : 'none',
              }}
            >
              <span style={{
                flexShrink: 0,
                width: 26, height: 26,
                borderRadius: '50%',
                background: state.answered && isCorrect ? '#22c55e' : state.answered && isChosen ? '#ef4444' : 'var(--base-border)',
                color: state.answered ? '#fff' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700,
              }}>
                {OPTION_LABELS[i]}
              </span>
              {option}
            </button>
          )
        })}
      </div>

      {/* Explanation panel */}
      <div style={{
        overflow: 'hidden',
        maxHeight: state.answered ? 700 : 0,
        transition: 'max-height 0.4s ease',
        marginBottom: '1.25rem',
      }}>
        <div style={{ background: 'var(--base-surface)', border: '1px solid var(--base-border)', borderRadius: '10px', overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--base-border)' }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.5rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: state.activeTab === tab.id ? `2px solid ${ACCENT}` : '2px solid transparent',
                  color: state.activeTab === tab.id ? ACCENT : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  transition: 'color 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ padding: '1rem 1.15rem' }}>
            {state.activeTab === 'why' && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                {q.explanation}
              </p>
            )}
            {state.activeTab === 'compiled' && (
              q.compiledJS ? (
                <CodeBlock code={q.compiledJS} />
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontStyle: 'italic', margin: 0 }}>
                  This concept applies at the architecture or configuration level — there is no single runtime snippet that demonstrates it. See the &ldquo;Why This Answer&rdquo; tab for the full explanation.
                </p>
              )
            )}
            {state.activeTab === 'best' && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                {q.bestPractice}
              </p>
            )}
          </div>

          {/* Source */}
          <div style={{ padding: '0.5rem 1.15rem 0.75rem', borderTop: '1px solid var(--base-border)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>📖 {q.source}</span>
          </div>
        </div>
      </div>

      {/* Next button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {state.answered && (
          <button
            onClick={onNext}
            style={{
              background: ACCENT,
              color: '#0f1117',
              border: 'none',
              borderRadius: '8px',
              padding: '0.65rem 1.5rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 700,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            {isLast ? 'See Results →' : 'Next →'}
          </button>
        )}
      </div>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
          1–4 select option · Enter/→ next · Tab switch tabs
        </span>
      </div>
    </div>
  )
}

// ── Results screen ────────────────────────────────────────────────────────────

interface ResultsScreenProps {
  state: QuizState
  onRetry: () => void
  onHome: () => void
}

function ResultsScreen({ state, onRetry, onHome }: ResultsScreenProps) {
  const [animate, setAnimate] = useState(false)
  const score = state.userAnswers.filter(a => a.correct).length
  const pct = Math.round((score / state.questions.length) * 100)
  const circumference = 2 * Math.PI * 54
  const dashOffset = circumference * (1 - score / state.questions.length)
  const ringColor = score >= 8 ? '#22c55e' : score >= 5 ? ACCENT : '#ef4444'
  const verdict = score >= 8 ? 'Excellent work!' : score >= 5 ? 'Good effort!' : 'Keep studying!'

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '2.5rem 1.25rem', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.4rem' }}>
        {verdict}
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        {state.level && LEVEL_META[state.level].label} level · {pct}% correct
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <svg width="140" height="140" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--base-border)" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="54" fill="none"
            stroke={ringColor} strokeWidth="8"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={animate ? dashOffset : circumference}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 1s ease 0.3s' }}
          />
          <text x="60" y="54" textAnchor="middle" fill={ringColor} fontSize="26" fontWeight="700" fontFamily="Inter, sans-serif">
            {score}
          </text>
          <text x="60" y="70" textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontFamily="Inter, sans-serif">
            of {state.questions.length}
          </text>
        </svg>
      </div>

      <div style={{ textAlign: 'left', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {state.questions.map((q, i) => {
          const ua = state.userAnswers.find(a => a.questionIndex === i)
          const correct = ua?.correct ?? false
          return (
            <div key={q.id} style={{
              background: 'var(--base-surface)',
              border: `1px solid ${correct ? '#14532d' : '#7f1d1d'}`,
              borderRadius: '8px',
              padding: '0.65rem 0.9rem',
              display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
            }}>
              <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{correct ? '✓' : '✗'}</span>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.1rem' }}>
                  {q.topic}
                </div>
                {!correct && ua && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    You chose: <span style={{ color: '#ef4444' }}>{q.options[ua.chosenIndex]}</span>
                    {' · '}Correct: <span style={{ color: '#22c55e' }}>{q.options[q.correctIndex]}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={onRetry}
          style={{ background: ACCENT, color: '#0f1117', border: 'none', borderRadius: '8px', padding: '0.65rem 1.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700 }}
        >
          Try Again
        </button>
        <button
          onClick={onHome}
          style={{ background: 'var(--base-surface)', color: 'var(--text-muted)', border: '1px solid var(--base-border)', borderRadius: '8px', padding: '0.65rem 1.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
        >
          Choose Another Level
        </button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const INITIAL_STATE: QuizState = {
  screen: 'home',
  level: null,
  questions: [],
  currentIndex: 0,
  answered: false,
  userAnswers: [],
  activeTab: 'why',
}

export function NodejsFundamentalsQuiz() {
  const [state, setState] = useState<QuizState>(INITIAL_STATE)

  const startQuiz = useCallback((level: QuizLevel) => {
    const pool = NODEJS_FUNDAMENTALS_QUESTIONS.filter(q => q.id[0] === level[0])
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    setState({ screen: 'quiz', level, questions: shuffled, currentIndex: 0, answered: false, userAnswers: [], activeTab: 'why' })
  }, [])

  const handleAnswer = useCallback((chosenIndex: number) => {
    setState(prev => {
      if (prev.answered) return prev
      const q = prev.questions[prev.currentIndex]
      const correct = chosenIndex === q.correctIndex
      const newAnswer: UserAnswer = { questionIndex: prev.currentIndex, chosenIndex, correct }
      return { ...prev, answered: true, userAnswers: [...prev.userAnswers, newAnswer] }
    })
  }, [])

  const handleNext = useCallback(() => {
    setState(prev => {
      if (!prev.answered) return prev
      const isLast = prev.currentIndex === prev.questions.length - 1
      if (isLast) return { ...prev, screen: 'results' }
      return { ...prev, currentIndex: prev.currentIndex + 1, answered: false, activeTab: 'why' }
    })
  }, [])

  const handleTab = useCallback((tab: ExplanationTab) => {
    setState(prev => ({ ...prev, activeTab: tab }))
  }, [])

  const handleTabCycle = useCallback(() => {
    setState(prev => {
      const tabs: ExplanationTab[] = ['why', 'compiled', 'best']
      const idx = tabs.indexOf(prev.activeTab)
      return { ...prev, activeTab: tabs[(idx + 1) % tabs.length] }
    })
  }, [])

  useEffect(() => {
    if (state.screen !== 'quiz') return
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (['1', '2', '3', '4'].includes(e.key) && !state.answered) handleAnswer(parseInt(e.key) - 1)
      if ((e.key === 'Enter' || e.key === 'ArrowRight') && state.answered) { e.preventDefault(); handleNext() }
      if (e.key === 'Tab' && state.answered) { e.preventDefault(); handleTabCycle() }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [state.screen, state.answered, handleAnswer, handleNext, handleTabCycle])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes nodeShake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-6px); }
          40%      { transform: translateX(6px); }
          60%      { transform: translateX(-4px); }
          80%      { transform: translateX(4px); }
        }
      `}} />
      <div style={{ background: 'var(--background)', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', color: 'var(--text-primary)' }}>
        {state.screen === 'home'    && <HomeScreen onStart={startQuiz} />}
        {state.screen === 'quiz'    && <QuizScreen state={state} onAnswer={handleAnswer} onNext={handleNext} onTab={handleTab} onBack={() => setState(INITIAL_STATE)} />}
        {state.screen === 'results' && <ResultsScreen state={state} onRetry={() => startQuiz(state.level!)} onHome={() => setState(INITIAL_STATE)} />}
      </div>
    </>
  )
}
