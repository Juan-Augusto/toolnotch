import type { InterviewQuestion } from '@/lib/interviewTypes'

export const NODEJS_FUNDAMENTALS_QUESTIONS: InterviewQuestion[] = [
  // ── Beginner ───────────────────────────────────────────────────────────────
  {
    id: 'b01',
    topic: 'Single Thread',
    question: 'Node.js is described as "single-threaded". What does this primarily mean in the context of JavaScript execution?',
    code: null,
    options: [
      'It can only handle one HTTP request at a time',
      'JavaScript code runs on a single call stack in one thread',
      'It uses only one CPU core for all operations',
      'It cannot run multiple Node.js processes on the same machine',
    ],
    correctIndex: 1,
    explanation:
      'Node.js executes JavaScript on a single call stack — the main V8 thread. There is only one JavaScript context, so two JS callbacks can never run concurrently. However, blocking I/O is delegated to libuv\'s thread pool (4 threads by default), so the event loop stays free while disk reads, DNS lookups, and crypto operations are in flight. This is fundamentally different from multi-threaded servers: instead of blocking a thread per request, Node queues I/O completion callbacks and processes them one at a time. The single-threaded model eliminates entire classes of concurrency bugs (data races, deadlocks on shared state) at the cost of making CPU-bound work dangerous.',
    compiledJS:
      '// The single call stack in action\nconsole.log("1 — sync start");\n\nsetTimeout(() => console.log("3 — timer callback"), 0);\n\nconsole.log("2 — sync end");\n\n// Output:\n// 1 — sync start\n// 2 — sync end\n// 3 — timer callback\n//\n// The timer fires AFTER sync code finishes — the event\n// loop can only pick up callbacks when the call stack is empty.',
    bestPractice:
      'Never run CPU-intensive work synchronously on the main thread in a production server — it blocks ALL requests. Offload heavy computation to worker_threads or child_process, or use a task queue. Keep each event loop tick short (sub-millisecond ideally, never more than a few ms).',
    source: 'Node.js Docs — The Node.js Event Loop',
  },
  {
    id: 'b02',
    topic: 'require()',
    question: 'What does `require(\'fs\')` do in a Node.js module?',
    code: null,
    options: [
      'Fetches the \'fs\' package from the npm registry at runtime',
      'Loads and caches the built-in file system module, returning its exports object',
      'Creates a new file system instance for the current module only',
      'Registers a file system event listener on the process object',
    ],
    correctIndex: 1,
    explanation:
      '`require()` is the CommonJS module loader. When called, Node first checks `require.cache` using the fully resolved file path as the key. If the module is already cached, the previously-computed `module.exports` object is returned immediately without re-executing any code. If not cached, Node reads and compiles the file, wraps it in a module wrapper function `(function(exports, require, module, __filename, __dirname) { ... })`, executes it, stores the result in the cache, and returns `module.exports`. Built-in modules like `fs` are compiled into the Node binary itself and always resolve before any node_modules lookup.',
    compiledJS:
      'const fs = require(\'fs\');\n\n// Under the hood, Node wraps your file in:\n// (function(exports, require, module, __filename, __dirname) {\n//   const fs = require(\'fs\');\n//   // ... your module code\n// });\n\nconsole.log(require.resolve(\'fs\')); // Output: \'fs\'\nconsole.log(typeof require.cache[\'fs\']); // undefined — built-ins live outside the cache object\n\nconst a = require(\'./myModule\');\nconst b = require(\'./myModule\');\nconsole.log(a === b); // true — same cached reference',
    bestPractice:
      'Avoid circular `require()` chains — they result in partially-initialised modules being returned, which is a common source of `undefined` errors that are hard to trace. Use dependency injection or restructure shared utilities into a separate leaf module that no one else imports.',
    source: 'Node.js Docs — Modules: CommonJS modules',
  },
  {
    id: 'b03',
    topic: 'package.json',
    question: 'Which field in `package.json` specifies the entry point file that Node.js loads when your package is `require()`-d?',
    code: null,
    options: [
      'start',
      'index',
      'main',
      'entry',
    ],
    correctIndex: 2,
    explanation:
      'The `main` field tells the Node.js module resolver which file to load when another package does `require(\'your-package\')`. If `main` is omitted, Node falls back to `index.js` in the package root. For modern packages that want to support both CommonJS and ES Modules, the `exports` field (added in Node 12) takes precedence over `main` and allows conditional exports per environment. The `start` field does not exist in Node\'s resolution algorithm — it is a custom scripts key.',
    compiledJS:
      '// package.json\n// {\n//   "name": "my-lib",\n//   "main": "./dist/index.js",\n//   "exports": {\n//     "require": "./dist/index.cjs",\n//     "import":  "./dist/index.mjs"\n//   }\n// }\n\n// Consumer:\nconst lib = require(\'my-lib\');\n// Node checks: exports.require → ./dist/index.cjs\n// Falls back to "main" only if "exports" is absent',
    bestPractice:
      'For libraries, always define both `main` (CJS fallback) and `exports` (conditional exports for ESM/CJS) to support all modern Node versions. Use `"type": "module"` only in app packages, not libraries, unless you are prepared to drop CJS consumers.',
    source: 'Node.js Docs — Packages: package.json "main" field',
  },
  {
    id: 'b04',
    topic: 'Sync vs Async',
    question: 'What is the key difference between `fs.readFileSync()` and `fs.readFile()` in Node.js?',
    code: null,
    options: [
      '`readFileSync` reads larger files; `readFile` is limited to 1 MB',
      '`readFileSync` blocks the event loop until the file is read; `readFile` is non-blocking and uses a callback',
      '`readFile` is deprecated; `readFileSync` is the modern API',
      'They are identical — the \'Sync\' suffix is cosmetic',
    ],
    correctIndex: 1,
    explanation:
      '`fs.readFileSync()` calls the underlying OS `read()` syscall on the main thread and does not return until the entire file is in memory — no other JavaScript can execute during that time. `fs.readFile()` queues the read to libuv\'s thread pool, returns immediately, and invokes the callback on the event loop once the OS completes the read. In a web server, calling `readFileSync` on every request is catastrophic because a single slow disk read blocks every pending connection. The synchronous variants are only appropriate in startup scripts or CLI tools that do not serve concurrent users.',
    compiledJS:
      'const fs = require(\'fs\');\n\n// BLOCKING — event loop stalls here\nconst data = fs.readFileSync(\'/etc/hostname\', \'utf8\');\nconsole.log(\'sync result:\', data.trim());\n\n// NON-BLOCKING — returns immediately\nfs.readFile(\'/etc/hostname\', \'utf8\', (err, data) => {\n  if (err) throw err;\n  console.log(\'async result:\', data.trim());\n});\n\nconsole.log(\'this prints BEFORE the async result\');\n// Output order:\n// sync result: hostname\n// this prints BEFORE the async result\n// async result: hostname',
    bestPractice:
      'Only use `*Sync` APIs at process startup (e.g., loading config files before the server begins listening). In all request handlers use the async variants or, better yet, the Promise-based `fs.promises.*` API with `async/await` for cleaner error handling.',
    source: 'Node.js Docs — File system: fs.readFile()',
  },
  {
    id: 'b05',
    topic: 'Callbacks',
    question: 'In Node.js, what is a callback?',
    code: null,
    options: [
      'A built-in error type for async failures',
      'A function passed as an argument to another function, invoked when an async operation completes',
      'A synchronous wrapper around a Promise',
      'A special method on the EventEmitter class',
    ],
    correctIndex: 1,
    explanation:
      'The callback pattern is Node\'s foundational async primitive. A function is passed as the last argument to an async operation; Node calls it back with the signature `(error, result)` once the operation finishes. By convention, the first argument is `null` on success or an `Error` object on failure — this is called "error-first" or "Node.js-style" callbacks. While modern Node code prefers Promises and async/await, understanding callbacks is essential because the entire built-in module surface area (fs, http, dns, crypto) was designed around them, and many third-party libraries still expose callback APIs.',
    compiledJS:
      'const fs = require(\'fs\');\n\n// Error-first callback convention\nfs.readFile(\'./data.json\', \'utf8\', function(err, content) {\n  if (err) {\n    console.error(\'Read failed:\', err.message);\n    return; // always return to prevent "fall-through" execution\n  }\n  console.log(\'File content:\', content);\n});\n\n// Promisify a callback API:\nconst { promisify } = require(\'util\');\nconst readFileP = promisify(fs.readFile);\nreadFileP(\'./data.json\', \'utf8\')\n  .then(content => console.log(content))\n  .catch(err => console.error(err));',
    bestPractice:
      'Always handle the error argument — unhandled errors silently swallow failures. If you are wrapping legacy callback code, use `util.promisify()` or the `fs.promises.*` variants rather than writing new callback code. Avoid "callback hell" by decomposing nested callbacks into named functions or converting to async/await.',
    source: 'Node.js Docs — Asynchronous programming & callbacks',
  },
  {
    id: 'b06',
    topic: 'process.env',
    question: 'How do you read an environment variable named `PORT` in a Node.js process?',
    code: null,
    options: [
      '`env.get(\'PORT\')`',
      '`process.env.PORT`',
      '`os.env(\'PORT\')`',
      '`global.PORT`',
    ],
    correctIndex: 1,
    explanation:
      '`process.env` is a plain JavaScript object that is populated from the process\'s environment variables at startup by libuv. Every key and value is a string — numeric vars like `PORT` must be parsed with `parseInt()` or `Number()` before arithmetic. The object is live: writing to `process.env.FOO = \'bar\'` changes it for the current process but does not propagate to child processes spawned before the assignment. Environment variables are the canonical 12-Factor App mechanism for injecting configuration without hardcoding secrets in source code.',
    compiledJS:
      '// Start the process with: PORT=3000 node server.js\n\nconst port = parseInt(process.env.PORT ?? \'3000\', 10);\nconsole.log(typeof process.env.PORT); // "string"\nconsole.log(port);                    // 3000 (number)\n\n// Defensive pattern for required vars:\nconst dbUrl = process.env.DATABASE_URL;\nif (!dbUrl) {\n  console.error(\'Missing DATABASE_URL env var\');\n  process.exit(1);\n}',
    bestPractice:
      'Validate and parse all `process.env` values at startup using a schema validator (e.g., `zod`, `envalid`, or a simple guard block) rather than reading them inline throughout the code. Fail fast with a clear error message if required variables are missing — never silently fall back to `undefined`.',
    source: 'Node.js Docs — process.env',
  },
  {
    id: 'b07',
    topic: 'path Module',
    question: 'Which built-in Node.js module would you use to join two path segments in a cross-platform safe way?',
    code: null,
    options: [
      '`fs`',
      '`url`',
      '`path`',
      '`os`',
    ],
    correctIndex: 2,
    explanation:
      'The `path` module provides `path.join()` and `path.resolve()` which handle platform-specific separators automatically: `/` on POSIX systems and `\\` on Windows. String concatenation with `/` works on macOS and Linux but breaks on Windows. `path.join(__dirname, \'..\', \'config.json\')` correctly produces `C:\\Users\\user\\config.json` on Windows and `/home/user/config.json` on Linux from the same source. `path.resolve()` returns an absolute path by resolving from right to left, and `path.basename()` / `path.extname()` extract filename parts without brittle string splitting.',
    compiledJS:
      'const path = require(\'path\');\n\nconsole.log(path.join(\'users\', \'photos\', \'avatar.png\'));\n// POSIX:   users/photos/avatar.png\n// Windows: users\\photos\\avatar.png\n\nconsole.log(path.resolve(\'.\', \'src\', \'index.ts\'));\n// Returns absolute path from CWD\n\nconsole.log(path.extname(\'bundle.min.js\')); // .js\nconsole.log(path.basename(\'/usr/bin/node\')); // node',
    bestPractice:
      'Always use `path.join()` or `path.resolve()` instead of string concatenation for file paths. Use `__dirname` (CJS) or `new URL(\'.\', import.meta.url).pathname` (ESM) as the base rather than `process.cwd()`, which changes when the process is started from a different directory.',
    source: 'Node.js Docs — Path module',
  },
  {
    id: 'b08',
    topic: 'npm Scripts',
    question: 'What does `npm run build` execute?',
    code: null,
    options: [
      'Downloads and installs all packages listed in `dependencies`',
      'Runs the `build` script defined under the `scripts` key in `package.json`',
      'Compiles all `.ts` files to `.js` using Node\'s built-in compiler',
      'Creates a production bundle and uploads it to npm',
    ],
    correctIndex: 1,
    explanation:
      '`npm run <name>` looks up the `scripts` object in `package.json` and executes the associated shell command in a temporary shell that has `node_modules/.bin` prepended to PATH. This means local binary installs (e.g., `tsc`, `esbuild`, `jest`) are available by their short name without a global install. `npm install` (no `run`) downloads dependencies; `npm publish` uploads to the registry. Node has no built-in TypeScript compiler — `tsc` is a separate npm package.',
    compiledJS:
      '// package.json\n// {\n//   "scripts": {\n//     "build": "tsc --project tsconfig.json",\n//     "start": "node dist/index.js",\n//     "test":  "jest --runInBand"\n//   }\n// }\n\n// npm run build  →  executes: tsc --project tsconfig.json\n//                   with node_modules/.bin in PATH\n\n// Lifecycle hooks run automatically:\n// prebuild  → runs before "build"\n// postbuild → runs after  "build"',
    bestPractice:
      'Define `build`, `start`, `test`, `lint`, and `dev` scripts consistently across all your projects so engineers do not need to read documentation just to run the server. Use the `pre`/`post` hook convention (`prebuild`, `posttest`) for setup/teardown rather than manually chaining commands with `&&`.',
    source: 'npm Docs — scripts',
  },
  {
    id: 'b09',
    topic: 'Stack Traces',
    question: 'In a Node.js stack trace, what does the line `at Object.<anonymous> (app.js:42:15)` tell you?',
    code: null,
    options: [
      'An anonymous object was exported from `app.js`',
      'The error originated at line 42, column 15 of `app.js`',
      'The file `app.js` has 42 exports',
      'Process memory usage at the time of the error',
    ],
    correctIndex: 1,
    explanation:
      'Each frame in a Node.js stack trace shows: the function name (or `<anonymous>` for top-level IIFE/module code), the file path, the line number, and the column offset within that line. The format is `at <function> (<file>:<line>:<col>)`. V8 captures this by walking the call stack at the moment the `Error` object is constructed. With source maps enabled (TypeScript, transpiled code), `source-map-support` will rewrite frames to point to the original `.ts` source rather than the compiled `.js`.',
    compiledJS:
      'function outer() {\n  function inner() {\n    throw new Error(\'something went wrong\');\n  }\n  inner();\n}\n\nouter();\n\n// Stack trace output:\n// Error: something went wrong\n//     at inner (app.js:3:11)   ← line 3, col 11\n//     at outer (app.js:5:3)\n//     at Object.<anonymous> (app.js:8:1)  ← top-level call',
    bestPractice:
      'Enable source maps in production (`--enable-source-maps` flag in Node 14+, or `source-map-support` package) so stack traces point to TypeScript source lines. Structure errors with meaningful messages and include a `cause` field for wrapped errors — `new Error(\'DB query failed\', { cause: pgError })` — so logging shows the full chain.',
    source: 'Node.js Docs — V8 Stack Trace API',
  },
  {
    id: 'b10',
    topic: 'Node vs Browser',
    question: 'Which of the following is available in a browser\'s JavaScript runtime but NOT in Node.js by default?',
    code: null,
    options: [
      '`setTimeout`',
      '`Promise`',
      '`window`',
      '`Array.prototype.map`',
    ],
    correctIndex: 2,
    explanation:
      'The `window` global (and browser-exclusive APIs like `document`, `localStorage`, `navigator`, `fetch` in pre-18 Node, `XMLHttpRequest`) do not exist in Node.js. Node provides its own globals: `global` (the global object equivalent of `window`), `process`, `Buffer`, `__dirname`, and `__filename`. `setTimeout`, `Promise`, and `Array.prototype.map` are all part of the JavaScript language or the Web Timers API and exist in both environments. Since Node 18, `fetch` is available globally, bridging a major gap.',
    compiledJS:
      '// In Node.js:\nconsole.log(typeof window);   // "undefined"\nconsole.log(typeof global);   // "object"\nconsole.log(typeof process);  // "object"\nconsole.log(typeof document); // "undefined"\n\n// These WORK in Node:\nconsole.log(typeof setTimeout); // "function"\nconsole.log(typeof Promise);    // "function"\nconsole.log(typeof fetch);      // "function" (Node 18+)',
    bestPractice:
      'Never write library code that assumes `window` or `document` exist without a guard — it breaks server-side rendering. Use feature detection (`typeof window !== \'undefined\'`) or a universal abstraction. Prefer the Node `https` module or `fetch` (Node 18+) over libraries that polyfill browser XMLHttpRequest.',
    source: 'Node.js Docs — Global objects',
  },

  // ── Intermediate ──────────────────────────────────────────────────────────
  {
    id: 'i01',
    topic: 'Event Loop Phases',
    question: 'What is the correct execution order for the following code?\n```js\nsetTimeout(() => console.log(\'A\'), 0);\nsetImmediate(() => console.log(\'B\'));\nprocess.nextTick(() => console.log(\'C\'));\nconsole.log(\'D\');\n```',
    code: "setTimeout(() => console.log('A'), 0);\nsetImmediate(() => console.log('B'));\nprocess.nextTick(() => console.log('C'));\nconsole.log('D');",
    options: [
      'D → A → B → C',
      'D → C → A → B',
      'D → C → B → A',
      'A → B → C → D',
    ],
    correctIndex: 2,
    explanation:
      'Synchronous code runs first, so `D` prints immediately. After the call stack empties, Node drains the `process.nextTick` queue before advancing the event loop — so `C` fires next. The event loop then begins: in the timers phase `setTimeout(fn, 0)` fires if the 1ms threshold has passed (it usually has), printing `A`. The check phase runs `setImmediate`, printing `B`. The order of `A` and `B` is technically non-deterministic at the top level of a script (timer threshold vs check phase race), but when run inside an I/O callback `setImmediate` always fires before `setTimeout(fn, 0)`. The most commonly observed top-level order is `D → C → B → A` or `D → C → A → B`.',
    compiledJS:
      '// Run this and observe:\nsetTimeout(() => console.log(\'A\'), 0);\nsetImmediate(() => console.log(\'B\'));\nprocess.nextTick(() => console.log(\'C\'));\nconsole.log(\'D\');\n\n// Guaranteed order:\n// D  (sync, call stack)\n// C  (nextTick queue — drains before event loop phases)\n// B or A  (non-deterministic: check vs timers race)\n//\n// Inside an I/O callback the order becomes deterministic:\n// require(\'fs\').readFile(__filename, () => {\n//   setTimeout(() => console.log(\'timeout\'), 0);\n//   setImmediate(() => console.log(\'immediate\'));\n// });\n// Output: immediate → timeout  (always)',
    bestPractice:
      'Never rely on the relative ordering of `setTimeout(fn, 0)` vs `setImmediate` at the top level — it is a race condition. Inside I/O callbacks, prefer `setImmediate` when you need to defer work to after the current poll phase. Use `process.nextTick` sparingly for truly urgent deferred initialisation — overusing it starves the I/O event loop.',
    source: 'Node.js Docs — The Event Loop: setImmediate() vs setTimeout()',
  },
  {
    id: 'i02',
    topic: 'setImmediate',
    question: 'In what phase of the Node.js event loop does `setImmediate()` fire?',
    code: null,
    options: [
      'Timers phase',
      'Poll phase',
      'Check phase',
      'Close callbacks phase',
    ],
    correctIndex: 2,
    explanation:
      'The Node.js event loop runs through six phases per iteration: (1) timers — executes `setTimeout` and `setInterval` callbacks whose thresholds have expired; (2) pending callbacks — deferred I/O errors; (3) idle/prepare — internal use; (4) poll — retrieves new I/O events and executes their callbacks; (5) check — executes `setImmediate` callbacks; (6) close callbacks — `socket.on(\'close\')` etc. `setImmediate` was designed to fire after the poll phase completes, giving it a predictable slot relative to I/O callbacks without the timer threshold uncertainty of `setTimeout(fn, 0)`.',
    compiledJS:
      '// Visualising the six phases:\nconst net = require(\'net\');\n\nconst server = net.createServer((socket) => {\n  // We are now inside an I/O callback (poll phase)\n  setImmediate(() => console.log(\'CHECK phase\'));\n  setTimeout(() => console.log(\'TIMERS phase (next tick)\'), 0);\n  // Output:\n  // CHECK phase  ← always first inside I/O callbacks\n  // TIMERS phase (next tick)\n});\nserver.listen(0);',
    bestPractice:
      'Use `setImmediate` instead of `setTimeout(fn, 0)` when you want to defer work until after the current I/O phase — it is more predictable and semantically clearer. If you need to break up a long synchronous loop to yield to I/O between chunks, `setImmediate` is the right primitive.',
    source: 'Node.js Docs — The Node.js Event Loop: setImmediate()',
  },
  {
    id: 'i03',
    topic: 'process.nextTick',
    question: 'Which of the following has the highest execution priority in Node.js\'s async scheduling?',
    code: null,
    options: [
      '`setTimeout(fn, 0)`',
      '`setImmediate(fn)`',
      '`process.nextTick(fn)`',
      'Resolved `Promise` `.then()` callbacks',
    ],
    correctIndex: 2,
    explanation:
      '`process.nextTick` callbacks drain completely before the event loop advances to the next phase and before any microtask (Promise) callbacks. The execution order is: synchronous code → `process.nextTick` queue → microtask queue (Promise `.then` / `queueMicrotask`) → event loop phase (timers, poll, check…). This means a recursive `process.nextTick` can completely starve the event loop, which is why the Node.js docs warn against it. `setTimeout(fn, 0)` waits for the timers phase, and `setImmediate` waits for the check phase — both come after microtasks.',
    compiledJS:
      'Promise.resolve().then(() => console.log(\'Promise\'));\nprocess.nextTick(() => console.log(\'nextTick\'));\nsetImmediate(() => console.log(\'setImmediate\'));\nsetTimeout(() => console.log(\'setTimeout\'), 0);\n\n// Output (guaranteed):\n// nextTick\n// Promise\n// setTimeout  (or setImmediate — race at top level)\n// setImmediate',
    bestPractice:
      'Reserve `process.nextTick` for correcting async/sync API contracts — e.g., ensuring a constructor\'s "ready" event always fires asynchronously even when all data is already available. Do not use it for general deferred work. Prefer `queueMicrotask()` if you only need microtask-level priority without the nextTick ordering guarantee.',
    source: 'Node.js Docs — process.nextTick()',
  },
  {
    id: 'i04',
    topic: 'Streams',
    question: 'What type of Node.js stream would you use to both read from and write to, AND transform the data in transit (e.g., a gzip compressor)?',
    code: null,
    options: [
      'Readable stream',
      'Writable stream',
      'Duplex stream',
      'Transform stream',
    ],
    correctIndex: 3,
    explanation:
      'Node.js has four stream types: (1) Readable — produces data (file reads, HTTP responses); (2) Writable — consumes data (file writes, HTTP requests); (3) Duplex — both reads and writes but the two sides are independent (TCP sockets); (4) Transform — a Duplex where output is derived from input. `zlib.createGzip()`, `zlib.createDeflate()`, and `crypto.createCipher()` are all Transform streams. The distinction between Duplex and Transform is that in a Duplex the readable and writable buffers are separate, whereas a Transform has a single processing step that converts written input into readable output.',
    compiledJS:
      'const { Transform } = require(\'stream\');\nconst { createGzip } = require(\'zlib\');\nconst fs = require(\'fs\');\n\n// Built-in Transform: gzip compression\nconst gzip = createGzip();\nconst source = fs.createReadStream(\'input.txt\');\nconst dest   = fs.createWriteStream(\'input.txt.gz\');\n\nsource.pipe(gzip).pipe(dest);\n\n// Custom Transform — uppercase everything:\nconst upperCase = new Transform({\n  transform(chunk, _enc, callback) {\n    this.push(chunk.toString().toUpperCase());\n    callback();\n  },\n});\n\nprocess.stdin.pipe(upperCase).pipe(process.stdout);',
    bestPractice:
      'Always use `stream.pipeline()` (not `pipe()`) in production code — it properly propagates errors and cleans up all streams in the chain when any stream errors or closes. Pass an error-handling callback as the last argument to `pipeline()`.',
    source: 'Node.js Docs — Stream: stream.Transform',
  },
  {
    id: 'i05',
    topic: 'Cluster Module',
    question: 'What is the primary purpose of the Node.js `cluster` module?',
    code: null,
    options: [
      'To distribute npm packages across multiple machines',
      'To fork multiple worker processes that share the same server port, utilizing multiple CPU cores',
      'To spawn child processes that run independent scripts with no shared state',
      'To create thread pools for CPU-intensive synchronous tasks',
    ],
    correctIndex: 1,
    explanation:
      'The `cluster` module allows a Node.js application to utilise all CPU cores by forking multiple worker processes that all listen on the same port. The master process uses a round-robin strategy (on Linux) or delegates socket distribution to the OS (Windows) to load-balance incoming connections across workers. Each worker is a full Node.js process with its own V8 heap, so shared memory is not possible — inter-process communication uses IPC messaging. This is fundamentally different from `worker_threads` (shared memory, same process) and `child_process` (arbitrary subprocess, no port sharing).',
    compiledJS:
      'const cluster = require(\'cluster\');\nconst http = require(\'http\');\nconst os = require(\'os\');\n\nif (cluster.isPrimary) {\n  const numCPUs = os.cpus().length;\n  console.log(`Forking ${numCPUs} workers`);\n  for (let i = 0; i < numCPUs; i++) cluster.fork();\n\n  cluster.on(\'exit\', (worker, code) => {\n    console.log(`Worker ${worker.process.pid} died (${code}) — reforking`);\n    cluster.fork();\n  });\n} else {\n  http.createServer((req, res) => {\n    res.end(`Handled by PID ${process.pid}\\n`);\n  }).listen(3000);\n  console.log(`Worker ${process.pid} started`);\n}',
    bestPractice:
      'In production, prefer PM2 cluster mode over manual `cluster` code — PM2 handles worker death, zero-downtime reloads, and logging out of the box. If you use raw `cluster`, always re-fork on worker exit to prevent CPU core under-utilisation after crashes.',
    source: 'Node.js Docs — Cluster module',
  },
  {
    id: 'i06',
    topic: 'worker_threads',
    question: 'How does `worker_threads` differ from `child_process` in Node.js?',
    code: null,
    options: [
      '`worker_threads` share memory via `SharedArrayBuffer`; `child_process` spawns fully isolated OS processes',
      '`child_process` is faster for CPU tasks because it uses native threads',
      '`worker_threads` cannot communicate with the main thread',
      'They are interchangeable; the names are aliases',
    ],
    correctIndex: 0,
    explanation:
      '`worker_threads` creates additional V8 isolates within the same OS process. Workers can share memory using `SharedArrayBuffer` and `Atomics`, enabling zero-copy data passing for large buffers. `child_process.fork()` spawns a completely separate OS process with its own V8 heap, libuv instance, and file descriptor table — data is serialised with `JSON.stringify` over an IPC pipe. Worker threads are better for CPU-bound tasks that share large datasets (e.g., image processing, crypto). Child processes are better for running separate scripts or providing process isolation (a crashing child does not take down the parent).',
    compiledJS:
      'const { Worker, isMainThread, workerData, parentPort } = require(\'worker_threads\');\n\nif (isMainThread) {\n  // Shared memory — zero copy!\n  const sharedBuffer = new SharedArrayBuffer(4);\n  const arr = new Int32Array(sharedBuffer);\n  arr[0] = 42;\n\n  const worker = new Worker(__filename, { workerData: { sharedBuffer } });\n  worker.on(\'message\', msg => console.log(\'Worker says:\', msg));\n} else {\n  const arr = new Int32Array(workerData.sharedBuffer);\n  console.log(\'Shared value:\', arr[0]); // 42 — no serialisation!\n  parentPort.postMessage(\'done\');\n}',
    bestPractice:
      'Use `worker_threads` for CPU-intensive computation in a web server (image resizing, PDF rendering, complex JSON transforms). Use `child_process` for running external binaries, isolating untrusted code, or when crash isolation is required. Always limit the number of concurrent workers to `os.cpus().length` to avoid thrashing.',
    source: 'Node.js Docs — worker_threads',
  },
  {
    id: 'i07',
    topic: 'V8 Heap',
    question: 'In V8\'s heap layout, what is the "New Space" (Young Generation) used for?',
    code: null,
    options: [
      'Storing compiled machine code for JIT-compiled functions',
      'Short-lived objects that are expected to be collected quickly',
      'Large objects over 1 MB that cannot fit in regular pages',
      'The call stack and local variable frames',
    ],
    correctIndex: 1,
    explanation:
      'V8 divides the heap into several spaces. New Space (Young Generation) holds recently allocated objects and is collected by the fast Scavenge algorithm. Objects that survive two Scavenge collections are promoted to Old Space (Old Generation), which is collected by the slower Mark-Sweep/Mark-Compact algorithms. Large Object Space holds objects over half a V8 page (typically ~512 KB) and is never moved. Code Space stores compiled machine code. The call stack is not on the V8 heap — it lives in the OS thread\'s stack memory.',
    compiledJS:
      '// Inspect heap segments with --expose-gc and v8 module:\nconst v8 = require(\'v8\');\n\nconst stats = v8.getHeapSpaceStatistics();\nstats.forEach(s => {\n  console.log(`${s.space_name}: ${Math.round(s.space_used_size / 1024)} KB used`);\n});\n// Typical output:\n// new_space: 1024 KB used\n// old_space: 8200 KB used\n// code_space: 560 KB used\n// large_object_space: 0 KB used\n// map_space: 312 KB used',
    bestPractice:
      'Allocate objects that will live for the entire process lifetime (singletons, caches) at startup so they promote to Old Space quickly and stop generating GC pressure. Avoid patterns that continually promote objects to Old Space unnecessarily — e.g., using closures in tight loops that capture large outer variables.',
    source: 'V8 Blog — Trash talk: the Orinoco garbage collector',
  },
  {
    id: 'i08',
    topic: 'Module Caching',
    question: 'When a Node.js module is `require()`-d a second time, what happens?',
    code: null,
    options: [
      'The module file is re-read from disk and re-executed',
      'An error is thrown to prevent duplicate initialization',
      'The cached `exports` object from the first load is returned immediately',
      'A new isolated module instance is created',
    ],
    correctIndex: 2,
    explanation:
      'Node stores each resolved module in `require.cache` keyed by its absolute file path. The second `require()` call hits the cache and returns the same `module.exports` reference without reading the file or executing any module code. This means module-level state (database connections, singletons, event emitter instances) is naturally shared across all files that require the same module — which is a useful pattern but also a source of test pollution if you do not clear the cache between tests. You can manually delete `require.cache[require.resolve(\'./myModule\')]` to force a fresh load.',
    compiledJS:
      '// counter.js\nlet count = 0;\nmodule.exports = { increment: () => ++count, get: () => count };\n\n// app.js\nconst a = require(\'./counter\');\nconst b = require(\'./counter\');\n\na.increment();\nconsole.log(b.get()); // 1 — same object!\nconsole.log(a === b);  // true\n\n// Delete cache to force reload:\ndelete require.cache[require.resolve(\'./counter\')];\nconst c = require(\'./counter\');\nconsole.log(c.get()); // 0 — fresh instance',
    bestPractice:
      'Rely on module caching as the singleton mechanism — it is simpler than manual singleton implementations. In unit tests, reset the cache between tests (`jest.resetModules()`) to avoid shared state bleed between test cases.',
    source: 'Node.js Docs — Modules: Caching',
  },
  {
    id: 'i09',
    topic: 'EventEmitter',
    question: 'Which `EventEmitter` method registers a listener that fires only once and then automatically removes itself?',
    code: null,
    options: [
      '`emitter.on(event, listener)`',
      '`emitter.once(event, listener)`',
      '`emitter.addOnceListener(event, listener)`',
      '`emitter.emit(event, { once: true })`',
    ],
    correctIndex: 1,
    explanation:
      '`emitter.once()` internally wraps the provided listener in a one-shot wrapper that calls `emitter.removeListener()` on itself before invoking the original listener. This prevents repeated calls without requiring manual cleanup. In contrast, `emitter.on()` adds a persistent listener that fires on every emission and accumulates if you call it multiple times — the common source of the "possible memory leak" warning when the listener count exceeds `emitter.getMaxListeners()` (default 10). `addOnceListener` and `emit` with an options object are not part of the Node.js EventEmitter API.',
    compiledJS:
      'const EventEmitter = require(\'events\');\nconst ee = new EventEmitter();\n\nee.on(\'data\', d => console.log(\'on:\', d));     // fires every time\nee.once(\'data\', d => console.log(\'once:\', d)); // fires once then removes itself\n\nee.emit(\'data\', \'first\');\n// on: first\n// once: first\n\nee.emit(\'data\', \'second\');\n// on: second\n// (once listener is gone)\n\nconsole.log(ee.listenerCount(\'data\')); // 1',
    bestPractice:
      'Always balance `on()` with `removeListener()` (or use `once()` when appropriate) in long-running services. In Express middleware or socket.io handlers, if you add a listener inside a request handler, remove it when the request ends — otherwise every request leaks a listener that retains a closure over the request/response objects.',
    source: 'Node.js Docs — Events: emitter.once()',
  },
  {
    id: 'i10',
    topic: 'libuv',
    question: 'What is libuv\'s role in Node.js?',
    code: null,
    options: [
      'It is the JavaScript engine that compiles and executes JS code',
      'It provides the cross-platform async I/O event loop, thread pool, and OS abstraction layer',
      'It manages npm package downloads and caching',
      'It implements the HTTP/2 protocol for Node\'s `http2` module',
    ],
    correctIndex: 1,
    explanation:
      'libuv is the C library at the heart of Node.js\'s async I/O model. It implements the event loop, a fixed-size thread pool (4 threads by default, tunable via `UV_THREADPOOL_SIZE`), and OS-level wrappers for file system operations, DNS resolution, crypto, and compression. Network I/O uses the OS\'s native async facilities (epoll on Linux, kqueue on macOS, IOCP on Windows) and does not use the thread pool. File system operations, which lack universal async OS support, use thread pool threads. V8 is the JavaScript engine; libuv is the async runtime underneath it.',
    compiledJS:
      '// Thread pool size affects parallel file I/O throughput\n// Set before starting Node:\n// UV_THREADPOOL_SIZE=8 node server.js\n\nconst { execSync } = require(\'child_process\');\nconsole.log(process.env.UV_THREADPOOL_SIZE ?? \'4 (default)\');\n\n// DNS resolution uses the thread pool too:\nconst dns = require(\'dns\');\nconsole.time(\'dns\');\ndns.lookup(\'toolnotch.com\', (err, addr) => {\n  console.timeEnd(\'dns\');\n  console.log(addr);\n});',
    bestPractice:
      'For workloads that perform many concurrent file I/O operations (e.g., reading thousands of files on startup), increase `UV_THREADPOOL_SIZE` beyond the default 4. Monitor libuv thread pool saturation using `clinic.js` or the `blocked-at` module — if the pool is saturated, threads queue up and `async` operations appear slow despite low CPU.',
    source: 'libuv Documentation — Design overview',
  },

  // ── Advanced ──────────────────────────────────────────────────────────────
  {
    id: 'a01',
    topic: 'GC Algorithms',
    question: 'Which garbage collection algorithm does V8 use for the Young Generation (New Space)?',
    code: null,
    options: [
      'Mark-Sweep',
      'Mark-Compact',
      'Scavenge (Cheney\'s semi-space copying)',
      'Reference counting',
    ],
    correctIndex: 2,
    explanation:
      'V8 uses Scavenge — specifically Cheney\'s semi-space copying algorithm — for the Young Generation. New Space is divided into two equal halves: "from-space" (where allocations happen) and "to-space" (empty). During a Scavenge, V8 copies all live objects from from-space to to-space, then swaps the roles of the two spaces. Objects that survive two Scavenges are promoted to Old Space. Scavenge is fast because it only touches live objects and compacts automatically by copying, but it wastes half the allocated memory for New Space. Reference counting is not used by V8 — it cannot handle circular references without additional cycle detection.',
    compiledJS:
      '// Observe GC with --trace_gc flag:\n// node --trace_gc --max_old_space_size=64 script.js\n\n// Sample output:\n// [9312:0x...] Scavenge 2.5 (3.0) -> 1.2 (4.0) MB, 1.2 ms\n//              ^^^^^^^^ Young Gen GC — fast, sub-ms\n// [9312:0x...] Mark-sweep 45.0 (60.0) -> 30.0 (60.0) MB, 50 ms\n//              ^^^^^^^^^^ Old Gen GC — slower, stop-the-world\n\n// Force GC in debug mode:\n// node --expose-gc -e "global.gc(); console.log(\'GC complete\')"',
    bestPractice:
      'Design your object lifecycles so that short-lived request-scoped objects die in the Young Generation. Objects that escape into closures, caches, or module-level variables get promoted to Old Space, increasing Mark-Sweep frequency. Profile with `node --heap-prof` to identify objects that are surviving longer than expected.',
    source: 'V8 Blog — Trash talk: the Orinoco garbage collector',
  },
  {
    id: 'a02',
    topic: 'GC Latency',
    question: 'Why can a full Mark-Compact GC cycle cause observable latency spikes in a Node.js server?',
    code: null,
    options: [
      'It temporarily doubles memory usage by copying the entire heap',
      'It runs stop-the-world pauses while compacting the Old Space, blocking the event loop',
      'It recompiles all JIT-optimized functions to free code cache memory',
      'It flushes the libuv thread pool and restarts all pending I/O operations',
    ],
    correctIndex: 1,
    explanation:
      'Mark-Compact is a stop-the-world (STW) collector. While it is running, the V8 thread cannot execute JavaScript — the event loop is completely frozen. The pause duration scales with the number of live objects in Old Space. V8\'s Orinoco GC project has progressively reduced pause times through incremental marking (spreading marking work across multiple small pauses) and concurrent sweeping (doing sweep work on background threads). However, the compaction step — which physically moves objects to reduce heap fragmentation — still requires STW pauses. On heaps larger than a few hundred MB, these pauses can be tens to hundreds of milliseconds.',
    compiledJS:
      '// Monitor GC pauses using perf_hooks:\nconst { PerformanceObserver, constants } = require(\'perf_hooks\');\n\nconst obs = new PerformanceObserver(list => {\n  list.getEntries().forEach(entry => {\n    if (entry.detail.kind === constants.NODE_PERFORMANCE_GC_MAJOR) {\n      console.log(`Major GC: ${entry.duration.toFixed(1)} ms`);\n      // Spikes > 50 ms will cause p99 latency issues\n    }\n  });\n});\n\nobs.observe({ entryTypes: [\'gc\'] });',
    bestPractice:
      'Keep the Old Space heap small by not retaining unnecessary long-lived objects (caches, global maps). Use `--max-old-space-size` to set a hard limit so the process crashes with an OOM rather than GC-thrashing. Monitor GC pause times with `perf_hooks` and alert when major GC pauses exceed 50 ms in production.',
    source: 'V8 Blog — Orinoco: young generation garbage collection',
  },
  {
    id: 'a03',
    topic: 'CPU Profiling',
    question: 'You run `node --prof app.js` and then `node --prof-process isolate-*.log`. What kind of output does this produce?',
    code: null,
    options: [
      'A heap snapshot in JSON format compatible with Chrome DevTools',
      'A human-readable statistical CPU profile showing hot functions and their call percentages',
      'A timeline of all GC pauses with their durations in milliseconds',
      'A network waterfall diagram of all HTTP requests made during the run',
    ],
    correctIndex: 1,
    explanation:
      '`--prof` enables V8\'s built-in tick-based sampling profiler, which samples the call stack at regular intervals (every 1ms by default) and writes raw samples to an `isolate-*.log` file. `--prof-process` post-processes this binary log into a human-readable report organized by JavaScript, C++, and GC sections, showing each function\'s "self" time and "total" time as a percentage of ticks. This identifies CPU hotspots with very low overhead. For a graphical flame graph, the `0x` or `clinic flame` tools wrap `--prof` and generate an interactive SVG. Heap snapshots require `--heapsnapshot-signal` or the `v8.writeHeapSnapshot()` API.',
    compiledJS:
      '// Step 1: Profile\n// node --prof server.js\n// (run load test, then SIGINT)\n\n// Step 2: Process the log\n// node --prof-process isolate-0x*.log > profile.txt\n\n// Sample output excerpt:\n// [JavaScript]:\n//    ticks  total  nonlib   name\n//     1234   45.2%   67.8%  JSON.parse\n//      456   16.7%   25.1%  Router.handle\n//      123    4.5%    6.9%  MyService.processItem\n//\n// [C++]:\n//    ticks  total  nonlib   name\n//      890   32.6%          node::contextify::...',
    bestPractice:
      'Run `--prof` under realistic load (use `autocannon` or `k6`) for at least 30 seconds to collect statistically significant samples. For continuous production profiling, consider `0x` for flame graphs or Clinic.js\'s Doctor and Flame tools, which are designed for production use. Focus optimisation on functions with high "self" ticks — those are the actual bottlenecks, not just callers.',
    source: 'Node.js Docs — Profiling Node.js Applications',
  },
  {
    id: 'a04',
    topic: 'Memory Leaks',
    question: 'Which of the following patterns is the most common cause of memory leaks in long-running Node.js servers?',
    code: null,
    options: [
      'Using `const` instead of `let` for module-level variables',
      'Accumulating listeners on an EventEmitter without ever calling `removeListener`',
      'Calling `JSON.parse` on large strings repeatedly',
      'Using `async/await` instead of raw callbacks',
    ],
    correctIndex: 1,
    explanation:
      'Each `emitter.on()` call stores a reference to the listener function in the emitter\'s internal listener array. The listener typically closes over the surrounding scope — request objects, database connection references, large data structures. Without a corresponding `removeListener()` or `once()`, these references accumulate indefinitely, preventing garbage collection of anything the listeners close over. Node.js will emit a `MaxListenersExceededWarning` when a single event exceeds 10 listeners, but this warning is easy to miss. Other common leak sources include: global variables that grow unboundedly, interval handles that are never cleared, and cached Promises that never resolve.',
    compiledJS:
      '// LEAK: listener added per request, never removed\nconst EventEmitter = require(\'events\');\nconst bus = new EventEmitter();\n\nfunction handleRequest(req) {\n  // BUG: this listener is added on every request\n  bus.on(\'shutdown\', () => req.socket.destroy());\n}\n\n// FIX 1: use once()\nfunction handleRequestFixed(req) {\n  bus.once(\'shutdown\', () => req.socket.destroy());\n}\n\n// FIX 2: explicit cleanup\nfunction handleRequestFixed2(req) {\n  const cleanup = () => req.socket.destroy();\n  bus.on(\'shutdown\', cleanup);\n  req.on(\'close\', () => bus.removeListener(\'shutdown\', cleanup));\n}',
    bestPractice:
      'Use `clinic heapsampler` or `node --heap-prof` weekly on production snapshots to detect unexpected Old Space growth. For every `emitter.on()` in request-scoped or connection-scoped code, ensure a matching `removeListener()` or convert to `once()`. Set `emitter.setMaxListeners(0)` only after confirming the pattern is intentional, not as a way to silence warnings.',
    source: 'Node.js Docs — Common Memory Leaks',
  },
  {
    id: 'a05',
    topic: '--max-old-space-size',
    question: 'What does the Node.js flag `--max-old-space-size=4096` control?',
    code: null,
    options: [
      'The maximum number of files that can be open simultaneously',
      'The size of libuv\'s thread pool in megabytes',
      'The upper limit of V8\'s Old Space heap in megabytes before OOM is thrown',
      'The maximum allowed size of a single JSON payload parsed with `JSON.parse`',
    ],
    correctIndex: 2,
    explanation:
      '`--max-old-space-size` sets the ceiling for V8\'s Old Generation heap in megabytes. When the heap approaches this limit, V8 performs increasingly aggressive GC. If GC cannot free enough memory, Node throws a fatal `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory` and the process exits. By default V8 sizes the heap based on available system memory (roughly 1.5 GB on 64-bit systems). This flag should be set explicitly in container deployments to prevent the process from consuming all container memory (which triggers an OOM kill from the kernel).',
    compiledJS:
      '// Start with 4 GB Old Space limit:\n// node --max-old-space-size=4096 server.js\n\n// Monitor current heap usage:\nconst v8 = require(\'v8\');\nconst stats = v8.getHeapStatistics();\nconsole.log({\n  heap_size_limit:  Math.round(stats.heap_size_limit / 1024 / 1024) + \' MB\',\n  used_heap_size:   Math.round(stats.used_heap_size  / 1024 / 1024) + \' MB\',\n  total_heap_size:  Math.round(stats.total_heap_size / 1024 / 1024) + \' MB\',\n});\n// { heap_size_limit: \'4096 MB\', used_heap_size: \'42 MB\', total_heap_size: \'70 MB\' }',
    bestPractice:
      'In Kubernetes, set `--max-old-space-size` to 75–80% of the container\'s memory limit to leave headroom for the libuv thread pool, native bindings, and OS overhead. Pair with `--max-semi-space-size` (New Space control) and monitor `process.memoryUsage().heapUsed` in your metrics to catch gradual leaks before they hit the limit.',
    source: 'Node.js Docs — CLI options: --max-old-space-size',
  },
  {
    id: 'a06',
    topic: 'Poll Phase Blocking',
    question: 'A synchronous CPU-bound loop running for 2 seconds is accidentally placed in an HTTP request handler. What is the most accurate description of the impact?',
    code: "// In an HTTP handler:\nfor (let i = 0; i < 2_000_000_000; i++) { /* busy wait */ }",
    options: [
      'Only that specific request is delayed; other requests continue normally',
      'The event loop poll phase is blocked for 2 seconds, stalling ALL other incoming requests and timers',
      'Node automatically offloads the loop to libuv\'s thread pool to prevent blocking',
      'The cluster master process detects the block and restarts the worker',
    ],
    correctIndex: 1,
    explanation:
      'JavaScript is single-threaded. A synchronous loop in a request handler runs on the main V8 thread and cannot be interrupted. While the loop executes, the event loop is frozen in whatever phase it was in — typically the poll phase waiting for I/O. No I/O callbacks fire, no timers tick, no other HTTP requests are accepted or processed. After 2 seconds the loop finishes, the event loop resumes, and the backlog of pending connections is processed. libuv does not automatically offload JS code to its thread pool — only C-level operations (file I/O, crypto, dns) are offloaded.',
    compiledJS:
      'const http = require(\'http\');\n\nhttp.createServer((req, res) => {\n  if (req.url === \'/slow\') {\n    // This blocks ALL requests for 2 seconds\n    const start = Date.now();\n    while (Date.now() - start < 2000) { /* busy wait */ }\n    res.end(\'done\');\n  } else {\n    res.end(\'fast\');\n  }\n}).listen(3000);\n\n// Test:\n// curl http://localhost:3000/slow &\n// curl http://localhost:3000/fast   ← this also takes ~2s!',
    bestPractice:
      'Never run CPU-bound loops in request handlers. Move heavy computation to worker_threads. If the algorithm is inherently synchronous, break it into chunks using `setImmediate` to yield control between iterations: `for (let i = 0; i < N; i += CHUNK) { processChunk(i); await new Promise(r => setImmediate(r)); }`. Monitor event loop lag with `perf_hooks.monitorEventLoopDelay()` and alert on values over 10 ms.',
    source: 'Node.js Docs — Don\'t Block the Event Loop',
  },
  {
    id: 'a07',
    topic: 'Back-pressure',
    question: 'What is back-pressure in Node.js streams, and what role does `highWaterMark` play?',
    code: null,
    options: [
      'Back-pressure is an HTTP rate-limit; `highWaterMark` sets the requests-per-second ceiling',
      'Back-pressure is the signal that a writable stream\'s buffer is full; `highWaterMark` sets the buffer size threshold at which `write()` returns `false`',
      'Back-pressure is a V8 GC pause; `highWaterMark` triggers early GC when heap exceeds this fraction',
      'Back-pressure is unused in Node.js streams; it is only relevant to TCP sockets',
    ],
    correctIndex: 1,
    explanation:
      'Back-pressure occurs when a writable stream\'s consumer cannot keep up with the producer. When you call `writable.write(chunk)`, Node appends the chunk to an internal buffer. Once the buffered data exceeds `highWaterMark` bytes (default 16 KB for byte streams, 16 objects for object-mode streams), `write()` returns `false`. This is the back-pressure signal: the producer should stop calling `write()` and wait for the `drain` event before resuming. Ignoring back-pressure causes unbounded memory growth because the buffer accumulates indefinitely. `stream.pipe()` and `stream.pipeline()` handle back-pressure automatically.',
    compiledJS:
      'const fs = require(\'fs\');\nconst readable = fs.createReadStream(\'big-file.bin\');\nconst writable = fs.createWriteStream(\'out.bin\', { highWaterMark: 64 * 1024 }); // 64 KB\n\n// CORRECT: manual back-pressure handling\nreadable.on(\'data\', chunk => {\n  const canContinue = writable.write(chunk);\n  if (!canContinue) {\n    readable.pause();\n    writable.once(\'drain\', () => readable.resume());\n  }\n});\n\n// EASIER: pipeline handles this automatically\nconst { pipeline } = require(\'stream\');\npipeline(readable, writable, err => {\n  if (err) console.error(err);\n  else console.log(\'Done\');\n});',
    bestPractice:
      'Always use `stream.pipeline()` for production stream chains — it manages back-pressure, propagates errors, and destroys all streams on completion or error. If writing custom readable implementations, override `_read()` and only push data when downstream signals it is ready. Never ignore a `false` return value from `write()`.',
    source: 'Node.js Docs — Streams: Backpressuring in Streams',
  },
  {
    id: 'a08',
    topic: 'N-API',
    question: 'What is the primary advantage of N-API (now Node-API) over previous native addon interfaces?',
    code: null,
    options: [
      'It allows writing native addons in Python instead of C/C++',
      'It provides an ABI-stable interface so native addons do not need to be recompiled for every new Node.js version',
      'It gives native addons direct access to V8\'s garbage collector to manage their own memory',
      'It automatically parallelizes native addon execution across all CPU cores',
    ],
    correctIndex: 1,
    explanation:
      'Before N-API, native addons used V8\'s C++ API directly (`v8::`, `nan`). Each Node.js major release changes V8 internals, breaking the ABI — addon maintainers had to release new binaries for every Node version. N-API exposes a stable C API layer that abstracts V8 and libuv internals. As long as the N-API version the addon targets is available in the Node runtime, the precompiled binary works across multiple Node.js major versions without recompilation. This dramatically simplifies distribution for packages like `sharp`, `bcrypt`, and SQLite bindings.',
    compiledJS:
      '// binding.gyp — N-API addon descriptor\n// {\n//   "targets": [{\n//     "target_name": "myaddon",\n//     "sources": ["src/addon.c"],\n//     "defines": ["NAPI_VERSION=8"]\n//   }]\n// }\n\n// Node.js consumer:\nconst addon = require(\'./build/Release/myaddon\');\n// Works on Node 14, 16, 18, 20, 22 without recompile\n// as long as NAPI_VERSION ≤ runtime\'s supported N-API version\n\nconsole.log(process.versions.napi); // e.g. "8"',
    bestPractice:
      'When publishing npm packages with native addons, ship precompiled binaries for all supported Node versions and platforms using `node-pre-gyp` or `prebuildify`. Set `"napi_versions": [8]` in binding.gyp so the addon declares its minimum N-API version. Include a fallback compile-from-source step for unsupported platforms.',
    source: 'Node.js Docs — Node-API (N-API)',
  },
  {
    id: 'a09',
    topic: 'Hidden Classes',
    question: 'How do V8 "hidden classes" (also called "shapes" or "maps") improve JavaScript object performance?',
    code: null,
    options: [
      'They compress object keys using a dictionary to reduce memory per object',
      'They allow V8 to generate optimized machine code by tracking object property layouts and reusing them across instances with the same shape',
      'They hide private class fields from the garbage collector to prevent premature collection',
      'They pre-allocate a fixed heap page per constructor function',
    ],
    correctIndex: 1,
    explanation:
      'V8 assigns a hidden class (internally called a "Map") to every object based on its property structure: which properties exist and in what order they were added. Objects that share the same property layout share the same hidden class, enabling V8\'s JIT compiler to generate monomorphic inline caches — fast property accesses that skip dictionary lookups. If you add properties to objects in different orders or delete/add properties conditionally, each object gets a unique hidden class (polymorphic or megamorphic access), disabling the fast path and forcing expensive dictionary-style lookups. This is why constructors should always initialise all properties in the same order.',
    compiledJS:
      '// GOOD: both objects share the same hidden class\nclass Point {\n  constructor(x, y) {\n    this.x = x; // always set in same order\n    this.y = y;\n  }\n}\nconst a = new Point(1, 2);\nconst b = new Point(3, 4);\n// a and b have identical hidden class → monomorphic IC → FAST\n\n// BAD: different property addition order → different hidden classes\nconst c = {}; c.x = 1; c.y = 2; // hidden class: {x, y}\nconst d = {}; d.y = 2; d.x = 1; // hidden class: {y, x} — DIFFERENT!\n// Accessing c.x and d.x goes through different ICs → slower',
    bestPractice:
      'Always initialise all object properties in the constructor in a consistent order. Avoid adding or deleting properties after object creation in hot paths. Never use `delete obj.prop` — it degrades the hidden class. Use TypeScript classes or factory functions with a fixed property shape to guarantee monomorphic access patterns.',
    source: 'V8 Blog — What\'s up with monomorphism?',
  },
  {
    id: 'a10',
    topic: 'PM2',
    question: 'When using PM2 to achieve zero-downtime restarts (`pm2 reload`), what mechanism does PM2 use?',
    code: null,
    options: [
      'It pauses the load balancer, restarts all workers simultaneously, then resumes traffic',
      'It creates a new worker, waits for it to signal readiness, routes traffic to it, then gracefully kills the old worker — one at a time',
      'It patches the running process in memory without spawning a new one',
      'It relies on the OS kernel\'s live-patching feature to swap code pages atomically',
    ],
    correctIndex: 1,
    explanation:
      'PM2 reload performs a rolling restart using the cluster module under the hood. For each worker: PM2 forks a new worker process; the new worker initialises (loads modules, connects to databases) and signals readiness by calling `process.send(\'ready\')` or by the `listen_timeout` expiring; PM2 then routes new connections to the new worker and sends SIGTERM to the old worker; the old worker finishes its in-flight requests and exits. At no point are all workers down simultaneously. The `--wait-ready` and `--listen-timeout` PM2 flags control how long PM2 waits for the readiness signal before force-killing the old worker.',
    compiledJS:
      '// server.js — signal PM2 when server is ready\nconst http = require(\'http\');\n\nconst server = http.createServer((req, res) => {\n  res.end(`Hello from PID ${process.pid}\\n`);\n});\n\nserver.listen(3000, () => {\n  console.log(`Worker ${process.pid} ready`);\n  if (process.send) process.send(\'ready\'); // ← tells PM2 "I am up"\n});\n\n// Graceful shutdown on SIGTERM:\nprocess.on(\'SIGTERM\', () => {\n  server.close(() => {\n    console.log(`Worker ${process.pid} closed`);\n    process.exit(0);\n  });\n});\n\n// pm2 start server.js -i max --wait-ready\n// pm2 reload server  ← zero-downtime rolling restart',
    bestPractice:
      'Always implement graceful shutdown: on SIGTERM, stop accepting new connections (`server.close()`), finish in-flight requests, close database pools, then call `process.exit(0)`. Set `kill_timeout` in your PM2 ecosystem config to give workers enough time to drain before PM2 force-kills them. Test your graceful shutdown path in staging — it is often broken by connection pooling libraries that do not emit a close event.',
    source: 'PM2 Docs — Graceful Shutdown & Zero Downtime Reload',
  },
]
