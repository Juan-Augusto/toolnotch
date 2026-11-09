/**
 * Node.js event loop simulator — pure TypeScript, deterministic, client-safe.
 *
 * A lesson is a tiny "program" (see eventLoopLessons.ts) made of ops. `simulate`
 * runs it against a model of Node's loop (libuv phases + nextTick/microtask
 * queues) and returns a list of frames. The UI only replays frames, so the
 * animation can never disagree with the engine.
 *
 * Model simplifications (stated in the UI too):
 *  - virtual clock; script start-up is assumed to take >= 1ms, so
 *    `setTimeout(fn, 0)` (clamped to 1ms) is already due on the first lap
 *  - `io` stands for an async I/O completion (e.g. fs.readFile) delivered in
 *    the poll phase
 *  - pending/idle/close phases are internal and not animated
 */

export type Phase = 'main' | 'timers' | 'poll' | 'check'
export type Drain = 'nextTick' | 'microtask' | null

export interface Callback {
  name: string
  ops: Op[]
}

interface BaseOp {
  /** 1-based line in the lesson's code panel this op belongs to. */
  line: number
}

export type Op =
  | (BaseOp & { t: 'log'; text: string })
  | (BaseOp & { t: 'timeout'; cb: Callback; delay: number })
  | (BaseOp & { t: 'immediate'; cb: Callback })
  | (BaseOp & { t: 'tick'; cb: Callback })
  | (BaseOp & { t: 'then'; cb: Callback })
  | (BaseOp & { t: 'io'; cb: Callback; delay?: number })
  | (BaseOp & { t: 'call'; name: string; ops: Op[] })

export interface QueueItem {
  id: number
  label: string
  /** Timers: virtual ms at which the timer is due. */
  due?: number
}

export type NoteKey =
  | 'start'
  | 'log'
  | 'callEnter'
  | 'callExit'
  | 'schedTimeout'
  | 'schedImmediate'
  | 'schedTick'
  | 'schedThen'
  | 'schedIo'
  | 'run'
  | 'stackEmpty'
  | 'drainTicks'
  | 'drainMicro'
  | 'phaseTimers'
  | 'phasePoll'
  | 'phaseCheck'
  | 'pollWait'
  | 'ioDone'
  | 'done'

export interface Note {
  key: NoteKey
  params: Record<string, string | number>
}

export interface Frame {
  stack: QueueItem[]
  nextTicks: QueueItem[]
  microtasks: QueueItem[]
  timers: QueueItem[]
  poll: QueueItem[]
  check: QueueItem[]
  phase: Phase
  drain: Drain
  clock: number
  output: string[]
  /** Highlighted code line (1-based) or null. */
  line: number | null
  note: Note
}

export interface SimulationResult {
  frames: Frame[]
  output: string[]
}

const MAX_FRAMES = 500
const MAX_LAPS = 25

export function simulate(program: Op[]): SimulationResult {
  let nextId = 1
  let clock = 0
  let phase: Phase = 'main'
  let drain: Drain = null
  let line: number | null = null

  const stack: QueueItem[] = []
  const nextTicks: (QueueItem & { cb: Callback })[] = []
  const microtasks: (QueueItem & { cb: Callback })[] = []
  let timers: (QueueItem & { cb: Callback; seq: number })[] = []
  let ioPending: (QueueItem & { cb: Callback; ready: number })[] = []
  const check: (QueueItem & { cb: Callback })[] = []
  const output: string[] = []
  const frames: Frame[] = []
  let seq = 0

  const strip = (q: QueueItem[]): QueueItem[] =>
    q.map(({ id, label, due }) => (due === undefined ? { id, label } : { id, label, due }))

  const emit = (key: NoteKey, params: Note['params'] = {}) => {
    if (frames.length >= MAX_FRAMES) return
    const sortedTimers = [...timers].sort((a, b) => a.due! - b.due! || a.seq - b.seq)
    frames.push({
      stack: strip(stack),
      nextTicks: strip(nextTicks),
      microtasks: strip(microtasks),
      timers: strip(sortedTimers),
      poll: strip(ioPending.map((p) => ({ ...p, due: p.ready }))),
      check: strip(check),
      phase,
      drain,
      clock,
      output: [...output],
      line,
      note: { key, params },
    })
  }

  const runOps = (ops: Op[]) => {
    for (const op of ops) {
      line = op.line
      switch (op.t) {
        case 'log':
          output.push(op.text)
          emit('log', { text: op.text })
          break
        case 'timeout': {
          const due = clock + Math.max(1, op.delay)
          timers.push({ id: nextId++, label: op.cb.name, due, cb: op.cb, seq: seq++ })
          emit('schedTimeout', { name: op.cb.name, delay: op.delay })
          break
        }
        case 'immediate':
          check.push({ id: nextId++, label: op.cb.name, cb: op.cb })
          emit('schedImmediate', { name: op.cb.name })
          break
        case 'tick':
          nextTicks.push({ id: nextId++, label: op.cb.name, cb: op.cb })
          emit('schedTick', { name: op.cb.name })
          break
        case 'then':
          microtasks.push({ id: nextId++, label: op.cb.name, cb: op.cb })
          emit('schedThen', { name: op.cb.name })
          break
        case 'io': {
          const ready = clock + (op.delay ?? 3)
          ioPending.push({ id: nextId++, label: op.cb.name, due: ready, cb: op.cb, ready })
          emit('schedIo', { name: op.cb.name })
          break
        }
        case 'call':
          stack.push({ id: nextId++, label: op.name })
          emit('callEnter', { name: op.name })
          runOps(op.ops)
          line = op.ops.length ? op.ops[op.ops.length - 1].line : op.line
          stack.pop()
          emit('callExit', { name: op.name })
          break
      }
    }
  }

  const runCallback = (cb: Callback, where: string) => {
    const frame: QueueItem = { id: nextId++, label: cb.name }
    stack.push(frame)
    line = cb.ops[0]?.line ?? null
    emit('run', { name: cb.name, where })
    runOps(cb.ops)
    stack.pop()
    emit('stackEmpty')
  }

  /** process.nextTick queue fully, then microtasks fully, repeat until both empty. */
  const drainQueues = () => {
    while (nextTicks.length || microtasks.length) {
      if (frames.length >= MAX_FRAMES) return
      if (nextTicks.length) {
        drain = 'nextTick'
        line = null
        emit('drainTicks')
        while (nextTicks.length && frames.length < MAX_FRAMES) {
          const item = nextTicks.shift()!
          runCallback(item.cb, 'nextTick')
        }
      }
      if (microtasks.length) {
        drain = 'microtask'
        line = null
        emit('drainMicro')
        while (microtasks.length && frames.length < MAX_FRAMES) {
          const item = microtasks.shift()!
          runCallback(item.cb, 'microtask')
        }
      }
    }
    drain = null
  }

  // ── Main script ──────────────────────────────────────────────────────
  stack.push({ id: nextId++, label: 'main()' })
  emit('start')
  runOps(program)
  stack.pop()
  line = null
  emit('stackEmpty')
  drainQueues()

  // Script start-up cost: assume at least 1ms elapsed before the loop starts.
  clock = Math.max(clock, 1)

  // ── Event loop ───────────────────────────────────────────────────────
  for (let lap = 0; lap < MAX_LAPS; lap++) {
    if (frames.length >= MAX_FRAMES) break
    if (!timers.length && !ioPending.length && !check.length) break

    // timers
    phase = 'timers'
    line = null
    emit('phaseTimers', { clock })
    const dueTimers = timers
      .filter((t) => t.due! <= clock)
      .sort((a, b) => a.due! - b.due! || a.seq - b.seq)
    for (const t of dueTimers) {
      timers = timers.filter((x) => x.id !== t.id)
      runCallback(t.cb, 'timers')
      drainQueues()
    }

    // poll
    phase = 'poll'
    line = null
    emit('phasePoll', { clock })
    const readyIo = ioPending.filter((p) => p.ready <= clock)
    for (const p of readyIo) {
      ioPending = ioPending.filter((x) => x.id !== p.id)
      emit('ioDone', { name: p.label })
      runCallback(p.cb, 'poll')
      drainQueues()
    }
    if (!readyIo.length && !check.length && (timers.length || ioPending.length)) {
      const waits = [...timers.map((t) => t.due!), ...ioPending.map((p) => p.ready)]
      const until = Math.min(...waits)
      if (until > clock) {
        clock = until
        emit('pollWait', { clock })
      }
    }

    // check
    phase = 'check'
    line = null
    emit('phaseCheck', { clock })
    const immediates = check.splice(0, check.length)
    for (const im of immediates) {
      runCallback(im.cb, 'check')
      drainQueues()
    }
  }

  phase = 'main'
  line = null
  drain = null
  emit('done')

  return { frames, output }
}
