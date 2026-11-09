/**
 * Learning path for the Node.js event loop visualizer.
 * Language-neutral data only (code + programs). All prose lives in
 * messages/*.json under `eventLoop.lessons.<id>`.
 */
import type { Callback, Op } from './eventLoop'

export type LessonLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Lesson {
  id: string
  level: LessonLevel
  code: string[]
  program: Op[]
  /** Wrong-but-plausible console orders for the "predict the output" step. */
  distractors: string[][]
}

const cb = (name: string, ...ops: Op[]): Callback => ({ name, ops })

// Recursive microtask chain: each microtask logs, then queues the next one.
function microChain(n: number): Callback {
  const name = `micro ${n}`
  if (n === 1) return cb(name, { t: 'log', line: 4, text: name })
  return cb(name, { t: 'log', line: 4, text: name }, { t: 'then', line: 4, cb: microChain(n - 1) })
}

export const LESSONS: Lesson[] = [
  {
    id: 'call-stack',
    level: 'beginner',
    code: [
      "function third()  { console.log('third') }",
      'function second() { third() }',
      'function first()  { second() }',
      "console.log('start')",
      'first()',
      "console.log('end')",
    ],
    program: [
      { t: 'log', line: 4, text: 'start' },
      {
        t: 'call',
        line: 5,
        name: 'first()',
        ops: [
          {
            t: 'call',
            line: 3,
            name: 'second()',
            ops: [
              {
                t: 'call',
                line: 2,
                name: 'third()',
                ops: [{ t: 'log', line: 1, text: 'third' }],
              },
            ],
          },
        ],
      },
      { t: 'log', line: 6, text: 'end' },
    ],
    distractors: [
      ['start', 'end', 'third'],
      ['third', 'start', 'end'],
    ],
  },
  {
    id: 'timers',
    level: 'beginner',
    code: [
      "console.log('start')",
      "setTimeout(() => console.log('timeout'), 0)",
      "console.log('end')",
    ],
    program: [
      { t: 'log', line: 1, text: 'start' },
      { t: 'timeout', line: 2, delay: 0, cb: cb('timeout cb', { t: 'log', line: 2, text: 'timeout' }) },
      { t: 'log', line: 3, text: 'end' },
    ],
    distractors: [
      ['start', 'timeout', 'end'],
      ['timeout', 'start', 'end'],
    ],
  },
  {
    id: 'microtasks',
    level: 'beginner',
    code: [
      "console.log('start')",
      "setTimeout(() => console.log('timeout'), 0)",
      "Promise.resolve().then(() => console.log('promise'))",
      "console.log('end')",
    ],
    program: [
      { t: 'log', line: 1, text: 'start' },
      { t: 'timeout', line: 2, delay: 0, cb: cb('timeout cb', { t: 'log', line: 2, text: 'timeout' }) },
      { t: 'then', line: 3, cb: cb('promise cb', { t: 'log', line: 3, text: 'promise' }) },
      { t: 'log', line: 4, text: 'end' },
    ],
    distractors: [
      ['start', 'end', 'timeout', 'promise'],
      ['start', 'promise', 'end', 'timeout'],
    ],
  },
  {
    id: 'next-tick',
    level: 'intermediate',
    code: [
      "setTimeout(() => console.log('timeout'), 0)",
      "Promise.resolve().then(() => console.log('promise'))",
      "process.nextTick(() => console.log('nextTick'))",
      "console.log('sync')",
    ],
    program: [
      { t: 'timeout', line: 1, delay: 0, cb: cb('timeout cb', { t: 'log', line: 1, text: 'timeout' }) },
      { t: 'then', line: 2, cb: cb('promise cb', { t: 'log', line: 2, text: 'promise' }) },
      { t: 'tick', line: 3, cb: cb('nextTick cb', { t: 'log', line: 3, text: 'nextTick' }) },
      { t: 'log', line: 4, text: 'sync' },
    ],
    distractors: [
      ['sync', 'promise', 'nextTick', 'timeout'],
      ['sync', 'timeout', 'promise', 'nextTick'],
    ],
  },
  {
    id: 'poll-check',
    level: 'intermediate',
    code: [
      'fs.readFile(__filename, () => {',
      "  setTimeout(() => console.log('timeout'), 0)",
      "  setImmediate(() => console.log('immediate'))",
      "  console.log('file read')",
      '})',
      "console.log('start')",
    ],
    program: [
      {
        t: 'io',
        line: 1,
        cb: cb(
          'readFile cb',
          { t: 'timeout', line: 2, delay: 0, cb: cb('timeout cb', { t: 'log', line: 2, text: 'timeout' }) },
          { t: 'immediate', line: 3, cb: cb('immediate cb', { t: 'log', line: 3, text: 'immediate' }) },
          { t: 'log', line: 4, text: 'file read' },
        ),
      },
      { t: 'log', line: 6, text: 'start' },
    ],
    distractors: [
      ['start', 'file read', 'timeout', 'immediate'],
      ['file read', 'start', 'immediate', 'timeout'],
    ],
  },
  {
    id: 'starvation',
    level: 'advanced',
    code: [
      "setTimeout(() => console.log('timeout'), 0)",
      'function loop(n) {',
      '  if (n === 0) return',
      "  Promise.resolve().then(() => { console.log('micro ' + n); loop(n - 1) })",
      '}',
      'loop(3)',
    ],
    program: [
      { t: 'timeout', line: 1, delay: 0, cb: cb('timeout cb', { t: 'log', line: 1, text: 'timeout' }) },
      { t: 'call', line: 6, name: 'loop(3)', ops: [{ t: 'then', line: 4, cb: microChain(3) }] },
    ],
    distractors: [
      ['micro 3', 'timeout', 'micro 2', 'micro 1'],
      ['timeout', 'micro 3', 'micro 2', 'micro 1'],
    ],
  },
  {
    id: 'boss',
    level: 'advanced',
    code: [
      "console.log('script')",
      'setTimeout(() => {',
      "  console.log('timeout')",
      "  Promise.resolve().then(() => console.log('promise in timeout'))",
      '}, 0)',
      "setImmediate(() => console.log('immediate'))",
      'Promise.resolve().then(() => {',
      "  console.log('promise')",
      "  process.nextTick(() => console.log('tick in promise'))",
      '})',
      "process.nextTick(() => console.log('nextTick'))",
      "console.log('end')",
    ],
    program: [
      { t: 'log', line: 1, text: 'script' },
      {
        t: 'timeout',
        line: 2,
        delay: 0,
        cb: cb(
          'timeout cb',
          { t: 'log', line: 3, text: 'timeout' },
          { t: 'then', line: 4, cb: cb('promise cb 2', { t: 'log', line: 4, text: 'promise in timeout' }) },
        ),
      },
      { t: 'immediate', line: 6, cb: cb('immediate cb', { t: 'log', line: 6, text: 'immediate' }) },
      {
        t: 'then',
        line: 7,
        cb: cb(
          'promise cb 1',
          { t: 'log', line: 8, text: 'promise' },
          { t: 'tick', line: 9, cb: cb('nextTick cb 2', { t: 'log', line: 9, text: 'tick in promise' }) },
        ),
      },
      { t: 'tick', line: 11, cb: cb('nextTick cb 1', { t: 'log', line: 11, text: 'nextTick' }) },
      { t: 'log', line: 12, text: 'end' },
    ],
    distractors: [
      ['script', 'end', 'promise', 'nextTick', 'tick in promise', 'timeout', 'immediate', 'promise in timeout'],
      ['script', 'end', 'nextTick', 'promise', 'tick in promise', 'timeout', 'immediate', 'promise in timeout'],
    ],
  },
]

export const LESSON_IDS = LESSONS.map((l) => l.id)
