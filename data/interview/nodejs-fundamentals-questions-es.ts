import type { InterviewQuestion } from '@/lib/interviewTypes'

export const NODEJS_FUNDAMENTALS_QUESTIONS_ES: InterviewQuestion[] = [
  {
    "id": "b01",
    "topic": "Single Thread",
    "question": "Node.js se describe como 'single-threaded'. ¿Qué significa esto principalmente en el contexto de la ejecución de JavaScript?",
    "code": null,
    "options": [
      "Solo puede procesar una solicitud HTTP a la vez",
      "El código JavaScript se ejecuta en una única pila de llamadas en un solo hilo",
      "Utiliza solo un núcleo de CPU para todas las operaciones",
      "No puede ejecutar múltiples procesos de Node.js en la misma máquina"
    ],
    "correctIndex": 1,
    "explanation": "Node.js ejecuta JavaScript en una única pila de llamadas (el hilo principal), pero delega las operaciones de E/S al grupo de hilos de libuv, lo que permite concurrencia no bloqueante.",
    "compiledJS": "// The single call stack in action\nconsole.log(\"1 — sync start\");\n\nsetTimeout(() => console.log(\"3 — timer callback\"), 0);\n\nconsole.log(\"2 — sync end\");\n\n// Output:\n// 1 — sync start\n// 2 — sync end\n// 3 — timer callback\n//\n// The timer fires AFTER sync code finishes — the event\n// loop can only pick up callbacks when the call stack is empty.",
    "bestPractice": "Never run CPU-intensive work synchronously on the main thread in a production server — it blocks ALL requests. Offload heavy computation to worker_threads or child_process, or use a task queue. Keep each event loop tick short (sub-millisecond ideally, never more than a few ms).",
    "source": "Node.js Docs — The Node.js Event Loop"
  },
  {
    "id": "b02",
    "topic": "require()",
    "question": "¿Qué hace `require('fs')` en un módulo de Node.js?",
    "code": null,
    "options": [
      "Descarga el paquete 'fs' del registro npm público en tiempo de ejecución",
      "Carga el módulo nativo de archivos y devuelve su objeto de exports",
      "Instancia un sistema de archivos aislado solo para el módulo en curso",
      "Registra un listener global de eventos de archivo en el loop principal"
    ],
    "correctIndex": 1,
    "explanation": "`require()` busca el módulo en la caché o lo carga del disco y lo compila, retornando luego su objeto `module.exports`. Las llamadas posteriores devuelven la copia almacenada en caché.",
    "compiledJS": "const fs = require('fs');\n\n// Under the hood, Node wraps your file in:\n// (function(exports, require, module, __filename, __dirname) {\n//   const fs = require('fs');\n//   // ... your module code\n// });\n\nconsole.log(require.resolve('fs')); // Output: 'fs'\nconsole.log(typeof require.cache['fs']); // undefined — built-ins live outside the cache object\n\nconst a = require('./myModule');\nconst b = require('./myModule');\nconsole.log(a === b); // true — same cached reference",
    "bestPractice": "Avoid circular `require()` chains — they result in partially-initialised modules being returned, which is a common source of `undefined` errors that are hard to trace. Use dependency injection or restructure shared utilities into a separate leaf module that no one else imports.",
    "source": "Node.js Docs — Modules: CommonJS modules"
  },
  {
    "id": "b03",
    "topic": "package.json",
    "question": "¿Qué campo en `package.json` especifica el archivo de punto de entrada que Node.js carga cuando tu paquete es importado con `require()`?",
    "code": null,
    "options": [
      "start",
      "index",
      "main",
      "entry"
    ],
    "correctIndex": 2,
    "explanation": "El campo `main` en `package.json` apunta al archivo que Node.js resuelve cuando otro módulo importa tu paquete; por defecto es `index.js` si se omite.",
    "compiledJS": "// package.json\n// {\n//   \"name\": \"my-lib\",\n//   \"main\": \"./dist/index.js\",\n//   \"exports\": {\n//     \"require\": \"./dist/index.cjs\",\n//     \"import\":  \"./dist/index.mjs\"\n//   }\n// }\n\n// Consumer:\nconst lib = require('my-lib');\n// Node checks: exports.require → ./dist/index.cjs\n// Falls back to \"main\" only if \"exports\" is absent",
    "bestPractice": "For libraries, always define both `main` (CJS fallback) and `exports` (conditional exports for ESM/CJS) to support all modern Node versions. Use `\"type\": \"module\"` only in app packages, not libraries, unless you are prepared to drop CJS consumers.",
    "source": "Node.js Docs — Packages: package.json \"main\" field"
  },
  {
    "id": "b04",
    "topic": "Sync vs Async",
    "question": "¿Cuál es la principal diferencia entre `fs.readFileSync()` y `fs.readFile()` en Node.js?",
    "code": null,
    "options": [
      "`readFileSync` lee archivos mayores; `readFile` tiene un tope de 1 megabyte",
      "`readFileSync` bloquea el event loop; `readFile` es asíncrono y no bloqueante",
      "`readFile` ha sido descontinuado; `readFileSync` es el estándar moderno",
      "Ambos métodos son idénticos; el sufijo 'Sync' es mero adorno sintáctico"
    ],
    "correctIndex": 1,
    "explanation": "`readFileSync` bloquea todo el event loop hasta que finaliza la lectura, mientras que `readFile` delega la E/S a libuv e invoca el callback al terminar.",
    "compiledJS": "const fs = require('fs');\n\n// BLOCKING — event loop stalls here\nconst data = fs.readFileSync('/etc/hostname', 'utf8');\nconsole.log('sync result:', data.trim());\n\n// NON-BLOCKING — returns immediately\nfs.readFile('/etc/hostname', 'utf8', (err, data) => {\n  if (err) throw err;\n  console.log('async result:', data.trim());\n});\n\nconsole.log('this prints BEFORE the async result');\n// Output order:\n// sync result: hostname\n// this prints BEFORE the async result\n// async result: hostname",
    "bestPractice": "Only use `*Sync` APIs at process startup (e.g., loading config files before the server begins listening). In all request handlers use the async variants or, better yet, the Promise-based `fs.promises.*` API with `async/await` for cleaner error handling.",
    "source": "Node.js Docs — File system: fs.readFile()"
  },
  {
    "id": "b05",
    "topic": "Callbacks",
    "question": "En Node.js, ¿qué es un callback?",
    "code": null,
    "options": [
      "Una clase de error nativa para capturar fallos en flujos asíncronos",
      "Una función pasada a otra función, ejecutada al concluir una acción asíncrona",
      "Un wrapper síncrono que simula Promises en versiones legadas de Node.js",
      "Un método especial de ciclo de vida nativo de la clase EventEmitter"
    ],
    "correctIndex": 1,
    "explanation": "El patrón de callback es la primitiva asíncrona fundamental de Node.js: pasas una función que Node ejecuta con `(error, result)` una vez finalizada la operación.",
    "compiledJS": "const fs = require('fs');\n\n// Error-first callback convention\nfs.readFile('./data.json', 'utf8', function(err, content) {\n  if (err) {\n    console.error('Read failed:', err.message);\n    return; // always return to prevent \"fall-through\" execution\n  }\n  console.log('File content:', content);\n});\n\n// Promisify a callback API:\nconst { promisify } = require('util');\nconst readFileP = promisify(fs.readFile);\nreadFileP('./data.json', 'utf8')\n  .then(content => console.log(content))\n  .catch(err => console.error(err));",
    "bestPractice": "Always handle the error argument — unhandled errors silently swallow failures. If you are wrapping legacy callback code, use `util.promisify()` or the `fs.promises.*` variants rather than writing new callback code. Avoid \"callback hell\" by decomposing nested callbacks into named functions or converting to async/await.",
    "source": "Node.js Docs — Asynchronous programming & callbacks"
  },
  {
    "id": "b06",
    "topic": "process.env",
    "question": "¿Cómo se lee una variable de entorno llamada `PORT` en un proceso de Node.js?",
    "code": null,
    "options": [
      "`env.get('PORT')`",
      "`process.env.PORT`",
      "`os.env('PORT')`",
      "`global.PORT`"
    ],
    "correctIndex": 1,
    "explanation": "`process.env` es un objeto que contiene las variables de entorno del proceso; acceder a `process.env.PORT` devuelve su valor en string o `undefined`.",
    "compiledJS": "// Start the process with: PORT=3000 node server.js\n\nconst port = parseInt(process.env.PORT ?? '3000', 10);\nconsole.log(typeof process.env.PORT); // \"string\"\nconsole.log(port);                    // 3000 (number)\n\n// Defensive pattern for required vars:\nconst dbUrl = process.env.DATABASE_URL;\nif (!dbUrl) {\n  console.error('Missing DATABASE_URL env var');\n  process.exit(1);\n}",
    "bestPractice": "Validate and parse all `process.env` values at startup using a schema validator (e.g., `zod`, `envalid`, or a simple guard block) rather than reading them inline throughout the code. Fail fast with a clear error message if required variables are missing — never silently fall back to `undefined`.",
    "source": "Node.js Docs — process.env"
  },
  {
    "id": "b07",
    "topic": "path Module",
    "question": "¿Qué módulo nativo de Node.js usarías para unir dos segmentos de ruta de manera segura y multiplataforma?",
    "code": null,
    "options": [
      "`fs`",
      "`url`",
      "`path`",
      "`os`"
    ],
    "correctIndex": 2,
    "explanation": "El módulo `path` proporciona `path.join()` y `path.resolve()`, que gestionan automáticamente los separadores específicos de cada plataforma (`/` frente a `\\`).",
    "compiledJS": "const path = require('path');\n\nconsole.log(path.join('users', 'photos', 'avatar.png'));\n// POSIX:   users/photos/avatar.png\n// Windows: users\\photos\\avatar.png\n\nconsole.log(path.resolve('.', 'src', 'index.ts'));\n// Returns absolute path from CWD\n\nconsole.log(path.extname('bundle.min.js')); // .js\nconsole.log(path.basename('/usr/bin/node')); // node",
    "bestPractice": "Always use `path.join()` or `path.resolve()` instead of string concatenation for file paths. Use `__dirname` (CJS) or `new URL('.', import.meta.url).pathname` (ESM) as the base rather than `process.cwd()`, which changes when the process is started from a different directory.",
    "source": "Node.js Docs — Path module"
  },
  {
    "id": "b08",
    "topic": "npm Scripts",
    "question": "¿Qué ejecuta el comando `npm run build`?",
    "code": null,
    "options": [
      "Descarga e instala todos los paquetes listados en `dependencies`",
      "Ejecuta el script `build` definido bajo la clave `scripts` en `package.json`",
      "Compila todos los archivos `.ts` a `.js` usando el compilador nativo de Node",
      "Crea un paquete de producción y lo sube a npm"
    ],
    "correctIndex": 1,
    "explanation": "`npm run <nombre>` ejecuta el comando de terminal mapeado con ese nombre en la sección `scripts` de `package.json`, agregando `node_modules/.bin` al PATH.",
    "compiledJS": "// package.json\n// {\n//   \"scripts\": {\n//     \"build\": \"tsc --project tsconfig.json\",\n//     \"start\": \"node dist/index.js\",\n//     \"test\":  \"jest --runInBand\"\n//   }\n// }\n\n// npm run build  →  executes: tsc --project tsconfig.json\n//                   with node_modules/.bin in PATH\n\n// Lifecycle hooks run automatically:\n// prebuild  → runs before \"build\"\n// postbuild → runs after  \"build\"",
    "bestPractice": "Define `build`, `start`, `test`, `lint`, and `dev` scripts consistently across all your projects so engineers do not need to read documentation just to run the server. Use the `pre`/`post` hook convention (`prebuild`, `posttest`) for setup/teardown rather than manually chaining commands with `&&`.",
    "source": "npm Docs — scripts"
  },
  {
    "id": "b09",
    "topic": "Stack Traces",
    "question": "En una traza de pila (stack trace) de Node.js, ¿qué indica la línea `at Object.<anonymous> (app.js:42:15)`?",
    "code": null,
    "options": [
      "Se exportó un objeto anónimo desde `app.js`",
      "El error se originó en la línea 42, columna 15 de `app.js`",
      "El archivo `app.js` tiene 42 exportaciones",
      "El uso de memoria del proceso en el momento del error"
    ],
    "correctIndex": 1,
    "explanation": "Cada marco de la pila muestra el nombre de la función, el archivo, el número de línea y el número de columna, permitiendo localizar con exactitud el punto del código fuente donde ocurrió la llamada.",
    "compiledJS": "function outer() {\n  function inner() {\n    throw new Error('something went wrong');\n  }\n  inner();\n}\n\nouter();\n\n// Stack trace output:\n// Error: something went wrong\n//     at inner (app.js:3:11)   ← line 3, col 11\n//     at outer (app.js:5:3)\n//     at Object.<anonymous> (app.js:8:1)  ← top-level call",
    "bestPractice": "Enable source maps in production (`--enable-source-maps` flag in Node 14+, or `source-map-support` package) so stack traces point to TypeScript source lines. Structure errors with meaningful messages and include a `cause` field for wrapped errors — `new Error('DB query failed', { cause: pgError })` — so logging shows the full chain.",
    "source": "Node.js Docs — V8 Stack Trace API"
  },
  {
    "id": "b10",
    "topic": "Node vs Browser",
    "question": "¿Cuál de los siguientes elementos está disponible en el entorno JavaScript de un navegador, pero NO en Node.js por defecto?",
    "code": null,
    "options": [
      "`setTimeout`",
      "`Promise`",
      "`window`",
      "`Array.prototype.map`"
    ],
    "correctIndex": 2,
    "explanation": "El objeto global `window` (y APIs específicas del navegador como `document` o `localStorage`) no existen en Node.js; en su lugar, Node dispone de `global`, `process` y sus propias APIs de E/S.",
    "compiledJS": "// In Node.js:\nconsole.log(typeof window);   // \"undefined\"\nconsole.log(typeof global);   // \"object\"\nconsole.log(typeof process);  // \"object\"\nconsole.log(typeof document); // \"undefined\"\n\n// These WORK in Node:\nconsole.log(typeof setTimeout); // \"function\"\nconsole.log(typeof Promise);    // \"function\"\nconsole.log(typeof fetch);      // \"function\" (Node 18+)",
    "bestPractice": "Never write library code that assumes `window` or `document` exist without a guard — it breaks server-side rendering. Use feature detection (`typeof window !== 'undefined'`) or a universal abstraction. Prefer the Node `https` module or `fetch` (Node 18+) over libraries that polyfill browser XMLHttpRequest.",
    "source": "Node.js Docs — Global objects"
  },
  {
    "id": "i01",
    "topic": "Event Loop Phases",
    "question": "¿Cuál es el orden correcto de ejecución para el siguiente código?\n```js\nsetTimeout(() => console.log('A'), 0);\nsetImmediate(() => console.log('B'));\nprocess.nextTick(() => console.log('C'));\nconsole.log('D');\n```",
    "code": "setTimeout(() => console.log('A'), 0);\nsetImmediate(() => console.log('B'));\nprocess.nextTick(() => console.log('C'));\nconsole.log('D');",
    "options": [
      "D → A → B → C",
      "D → C → A → B",
      "D → C → B → A",
      "A → B → C → D"
    ],
    "correctIndex": 2,
    "explanation": "El código síncrono se ejecuta primero (D), seguido por la cola de microtareas/nextTick (C); luego la fase de temporizadores (timers) dispara setTimeout (A) y la fase check ejecuta setImmediate (B). Fuera de un ciclo de E/S, el orden entre setTimeout(0) y setImmediate es no determinista; en un script principal el orden típico observado es D→C→A→B o D→C→B→A.",
    "compiledJS": "// Run this and observe:\nsetTimeout(() => console.log('A'), 0);\nsetImmediate(() => console.log('B'));\nprocess.nextTick(() => console.log('C'));\nconsole.log('D');\n\n// Guaranteed order:\n// D  (sync, call stack)\n// C  (nextTick queue — drains before event loop phases)\n// B or A  (non-deterministic: check vs timers race)\n//\n// Inside an I/O callback the order becomes deterministic:\n// require('fs').readFile(__filename, () => {\n//   setTimeout(() => console.log('timeout'), 0);\n//   setImmediate(() => console.log('immediate'));\n// });\n// Output: immediate → timeout  (always)",
    "bestPractice": "Never rely on the relative ordering of `setTimeout(fn, 0)` vs `setImmediate` at the top level — it is a race condition. Inside I/O callbacks, prefer `setImmediate` when you need to defer work to after the current poll phase. Use `process.nextTick` sparingly for truly urgent deferred initialisation — overusing it starves the I/O event loop.",
    "source": "Node.js Docs — The Event Loop: setImmediate() vs setTimeout()"
  },
  {
    "id": "i02",
    "topic": "setImmediate",
    "question": "¿En qué fase del event loop de Node.js se ejecuta `setImmediate()`?",
    "code": null,
    "options": [
      "Fase de timers",
      "Fase de poll",
      "Fase de check",
      "Fase de close callbacks"
    ],
    "correctIndex": 2,
    "explanation": "Las fases del event loop son: timers → pending callbacks → idle/prepare → poll → check → close callbacks. Los callbacks de `setImmediate` se ejecutan en la fase check.",
    "compiledJS": "// Visualising the six phases:\nconst net = require('net');\n\nconst server = net.createServer((socket) => {\n  // We are now inside an I/O callback (poll phase)\n  setImmediate(() => console.log('CHECK phase'));\n  setTimeout(() => console.log('TIMERS phase (next tick)'), 0);\n  // Output:\n  // CHECK phase  ← always first inside I/O callbacks\n  // TIMERS phase (next tick)\n});\nserver.listen(0);",
    "bestPractice": "Use `setImmediate` instead of `setTimeout(fn, 0)` when you want to defer work until after the current I/O phase — it is more predictable and semantically clearer. If you need to break up a long synchronous loop to yield to I/O between chunks, `setImmediate` is the right primitive.",
    "source": "Node.js Docs — The Node.js Event Loop: setImmediate()"
  },
  {
    "id": "i03",
    "topic": "process.nextTick",
    "question": "¿Cuál de las siguientes opciones tiene la mayor prioridad de ejecución en la planificación asíncrona de Node.js?",
    "code": null,
    "options": [
      "`setTimeout(fn, 0)`",
      "`setImmediate(fn)`",
      "`process.nextTick(fn)`",
      "Callbacks de `.then()` en una `Promise` resuelta"
    ],
    "correctIndex": 2,
    "explanation": "Los callbacks de `process.nextTick` se procesan por completo antes que cualquier callback de microtarea (Promise), y estas últimas se procesan antes de que inicie la siguiente fase del event loop.",
    "compiledJS": "Promise.resolve().then(() => console.log('Promise'));\nprocess.nextTick(() => console.log('nextTick'));\nsetImmediate(() => console.log('setImmediate'));\nsetTimeout(() => console.log('setTimeout'), 0);\n\n// Output (guaranteed):\n// nextTick\n// Promise\n// setTimeout  (or setImmediate — race at top level)\n// setImmediate",
    "bestPractice": "Reserve `process.nextTick` for correcting async/sync API contracts — e.g., ensuring a constructor's \"ready\" event always fires asynchronously even when all data is already available. Do not use it for general deferred work. Prefer `queueMicrotask()` if you only need microtask-level priority without the nextTick ordering guarantee.",
    "source": "Node.js Docs — process.nextTick()"
  },
  {
    "id": "i04",
    "topic": "Streams",
    "question": "¿Qué tipo de stream de Node.js usarías para leer y escribir datos Y transformar los datos en tránsito (por ejemplo, un compresor gzip)?",
    "code": null,
    "options": [
      "Stream Readable",
      "Stream Writable",
      "Stream Duplex",
      "Stream Transform"
    ],
    "correctIndex": 3,
    "explanation": "Un stream Transform es un tipo de Duplex donde la salida se calcula a partir de la entrada; `zlib.createGzip()` es el ejemplo canónico. Un Duplex simple mantiene extremos de lectura y escritura independientes.",
    "compiledJS": "const { Transform } = require('stream');\nconst { createGzip } = require('zlib');\nconst fs = require('fs');\n\n// Built-in Transform: gzip compression\nconst gzip = createGzip();\nconst source = fs.createReadStream('input.txt');\nconst dest   = fs.createWriteStream('input.txt.gz');\n\nsource.pipe(gzip).pipe(dest);\n\n// Custom Transform — uppercase everything:\nconst upperCase = new Transform({\n  transform(chunk, _enc, callback) {\n    this.push(chunk.toString().toUpperCase());\n    callback();\n  },\n});\n\nprocess.stdin.pipe(upperCase).pipe(process.stdout);",
    "bestPractice": "Always use `stream.pipeline()` (not `pipe()`) in production code — it properly propagates errors and cleans up all streams in the chain when any stream errors or closes. Pass an error-handling callback as the last argument to `pipeline()`.",
    "source": "Node.js Docs — Stream: stream.Transform"
  },
  {
    "id": "i05",
    "topic": "Cluster Module",
    "question": "¿Cuál es el propósito principal del módulo `cluster` en Node.js?",
    "code": null,
    "options": [
      "Distribuir paquetes npm entre máquinas de cómputo del cluster",
      "Crear procesos workers que comparten puertos para usar varias CPUs",
      "Generar procesos hijos aislados ejecutando scripts sin estado común",
      "Crear pools de threads dedicados para tareas síncronas pesadas"
    ],
    "correctIndex": 1,
    "explanation": "El módulo `cluster` bifurca procesos secundarios (que comparten puertos mediante round-robin del SO o paso de descriptores por el proceso maestro), permitiendo que una aplicación Node escale entre los núcleos de CPU.",
    "compiledJS": "const cluster = require('cluster');\nconst http = require('http');\nconst os = require('os');\n\nif (cluster.isPrimary) {\n  const numCPUs = os.cpus().length;\n  console.log(`Forking ${numCPUs} workers`);\n  for (let i = 0; i < numCPUs; i++) cluster.fork();\n\n  cluster.on('exit', (worker, code) => {\n    console.log(`Worker ${worker.process.pid} died (${code}) — reforking`);\n    cluster.fork();\n  });\n} else {\n  http.createServer((req, res) => {\n    res.end(`Handled by PID ${process.pid}\\n`);\n  }).listen(3000);\n  console.log(`Worker ${process.pid} started`);\n}",
    "bestPractice": "In production, prefer PM2 cluster mode over manual `cluster` code — PM2 handles worker death, zero-downtime reloads, and logging out of the box. If you use raw `cluster`, always re-fork on worker exit to prevent CPU core under-utilisation after crashes.",
    "source": "Node.js Docs — Cluster module"
  },
  {
    "id": "i06",
    "topic": "worker_threads",
    "question": "¿En qué se diferencia `worker_threads` de `child_process` en Node.js?",
    "code": null,
    "options": [
      "`worker_threads` comparten memoria; `child_process` crea procesos del SO",
      "`child_process` es más veloz en CPU al usar threads nativos del sistema",
      "`worker_threads` no pueden comunicarse con el hilo principal del proceso",
      "Ambos módulos son idénticos y comparten el mismo motor interno de Node"
    ],
    "correctIndex": 0,
    "explanation": "Los worker threads se ejecutan en el mismo proceso y pueden compartir memoria (SharedArrayBuffer/Atomics), mientras que child_process bifurca procesos independientes del SO con heaps de V8 aisladas.",
    "compiledJS": "const { Worker, isMainThread, workerData, parentPort } = require('worker_threads');\n\nif (isMainThread) {\n  // Shared memory — zero copy!\n  const sharedBuffer = new SharedArrayBuffer(4);\n  const arr = new Int32Array(sharedBuffer);\n  arr[0] = 42;\n\n  const worker = new Worker(__filename, { workerData: { sharedBuffer } });\n  worker.on('message', msg => console.log('Worker says:', msg));\n} else {\n  const arr = new Int32Array(workerData.sharedBuffer);\n  console.log('Shared value:', arr[0]); // 42 — no serialisation!\n  parentPort.postMessage('done');\n}",
    "bestPractice": "Use `worker_threads` for CPU-intensive computation in a web server (image resizing, PDF rendering, complex JSON transforms). Use `child_process` for running external binaries, isolating untrusted code, or when crash isolation is required. Always limit the number of concurrent workers to `os.cpus().length` to avoid thrashing.",
    "source": "Node.js Docs — worker_threads"
  },
  {
    "id": "i07",
    "topic": "V8 Heap",
    "question": "¿Para qué se utiliza el 'New Space' (Generación Joven) en la distribución de la heap de V8?",
    "code": null,
    "options": [
      "Almacenar código máquina compilado para funciones optimizadas por JIT",
      "Objetos de vida corta que se espera sean recolectados rápidamente",
      "Objetos grandes de más de 1 MB que no caben en páginas normales",
      "La pila de llamadas y los marcos de variables locales"
    ],
    "correctIndex": 1,
    "explanation": "V8 divide la heap en New Space (objetos jóvenes de vida corta recolectados por Scavenge) y Old Space (objetos de larga duración recolectados por Mark-Sweep/Mark-Compact).",
    "compiledJS": "// Inspect heap segments with --expose-gc and v8 module:\nconst v8 = require('v8');\n\nconst stats = v8.getHeapSpaceStatistics();\nstats.forEach(s => {\n  console.log(`${s.space_name}: ${Math.round(s.space_used_size / 1024)} KB used`);\n});\n// Typical output:\n// new_space: 1024 KB used\n// old_space: 8200 KB used\n// code_space: 560 KB used\n// large_object_space: 0 KB used\n// map_space: 312 KB used",
    "bestPractice": "Allocate objects that will live for the entire process lifetime (singletons, caches) at startup so they promote to Old Space quickly and stop generating GC pressure. Avoid patterns that continually promote objects to Old Space unnecessarily — e.g., using closures in tight loops that capture large outer variables.",
    "source": "V8 Blog — Trash talk: the Orinoco garbage collector"
  },
  {
    "id": "i08",
    "topic": "Module Caching",
    "question": "¿Qué sucede cuando un módulo de Node.js se importa con `require()` por segunda vez?",
    "code": null,
    "options": [
      "El archivo del módulo se vuelve a leer de disco y se ejecuta en memoria",
      "Se lanza un error de inicialización para evitar carga duplicada de código",
      "El objeto `exports` cacheado de la primera carga se devuelve al instante",
      "Una nueva instancia aislada de ejecución se crea para el módulo local"
    ],
    "correctIndex": 2,
    "explanation": "El sistema de módulos de Node almacena cada módulo resuelto en `require.cache`; las llamadas posteriores a `require()` para el mismo archivo devuelven el `exports` en caché sin volver a ejecutar el código.",
    "compiledJS": "// counter.js\nlet count = 0;\nmodule.exports = { increment: () => ++count, get: () => count };\n\n// app.js\nconst a = require('./counter');\nconst b = require('./counter');\n\na.increment();\nconsole.log(b.get()); // 1 — same object!\nconsole.log(a === b);  // true\n\n// Delete cache to force reload:\ndelete require.cache[require.resolve('./counter')];\nconst c = require('./counter');\nconsole.log(c.get()); // 0 — fresh instance",
    "bestPractice": "Rely on module caching as the singleton mechanism — it is simpler than manual singleton implementations. In unit tests, reset the cache between tests (`jest.resetModules()`) to avoid shared state bleed between test cases.",
    "source": "Node.js Docs — Modules: Caching"
  },
  {
    "id": "i09",
    "topic": "EventEmitter",
    "question": "¿Qué método de `EventEmitter` registra un escuchador que se ejecuta solo una vez y se elimina automáticamente después?",
    "code": null,
    "options": [
      "`emitter.on(event, listener)`",
      "`emitter.once(event, listener)`",
      "`emitter.addOnceListener(event, listener)`",
      "`emitter.emit(event, { once: true })`"
    ],
    "correctIndex": 1,
    "explanation": "`emitter.once()` envuelve el escuchador para que se desregistre tras la primera emisión, evitando ejecuciones repetidas sin necesidad de limpieza manual mediante `removeListener`.",
    "compiledJS": "const EventEmitter = require('events');\nconst ee = new EventEmitter();\n\nee.on('data', d => console.log('on:', d));     // fires every time\nee.once('data', d => console.log('once:', d)); // fires once then removes itself\n\nee.emit('data', 'first');\n// on: first\n// once: first\n\nee.emit('data', 'second');\n// on: second\n// (once listener is gone)\n\nconsole.log(ee.listenerCount('data')); // 1",
    "bestPractice": "Always balance `on()` with `removeListener()` (or use `once()` when appropriate) in long-running services. In Express middleware or socket.io handlers, if you add a listener inside a request handler, remove it when the request ends — otherwise every request leaks a listener that retains a closure over the request/response objects.",
    "source": "Node.js Docs — Events: emitter.once()"
  },
  {
    "id": "i10",
    "topic": "libuv",
    "question": "¿Cuál es la función de libuv en Node.js?",
    "code": null,
    "options": [
      "El motor de JavaScript que compila y ejecuta código JS a binario nativo",
      "La biblioteca C que provee el event loop, thread pool y capa de I/O en SO",
      "El gestor de paquetes que resuelve dependencias y árboles de módulos",
      "El módulo de protocolo que implementa streams y tramas de HTTP/2 en red"
    ],
    "correctIndex": 1,
    "explanation": "libuv es la biblioteca en C que subyace a Node.js y que implementa el event loop, el grupo de hilos (para E/S de archivos, DNS, etc.) y las abstracciones de red específicas de cada plataforma.",
    "compiledJS": "// Thread pool size affects parallel file I/O throughput\n// Set before starting Node:\n// UV_THREADPOOL_SIZE=8 node server.js\n\nconst { execSync } = require('child_process');\nconsole.log(process.env.UV_THREADPOOL_SIZE ?? '4 (default)');\n\n// DNS resolution uses the thread pool too:\nconst dns = require('dns');\nconsole.time('dns');\ndns.lookup('toolnotch.com', (err, addr) => {\n  console.timeEnd('dns');\n  console.log(addr);\n});",
    "bestPractice": "For workloads that perform many concurrent file I/O operations (e.g., reading thousands of files on startup), increase `UV_THREADPOOL_SIZE` beyond the default 4. Monitor libuv thread pool saturation using `clinic.js` or the `blocked-at` module — if the pool is saturated, threads queue up and `async` operations appear slow despite low CPU.",
    "source": "libuv Documentation — Design overview"
  },
  {
    "id": "a01",
    "topic": "GC Algorithms",
    "question": "¿Qué algoritmo de recolección de basura (garbage collection) utiliza V8 para la Generación Joven (New Space)?",
    "code": null,
    "options": [
      "Generational Mark-Sweep",
      "Concurrent Mark-Compact",
      "Scavenge (copia semi-space)",
      "Ciclo de Reference counting"
    ],
    "correctIndex": 2,
    "explanation": "V8 utiliza Scavenge, un recolector por copia semi-space, para la Generación Joven debido a que la mayoría de los objetos mueren jóvenes, agilizando la evacuación de los supervivientes.",
    "compiledJS": "// Observe GC with --trace_gc flag:\n// node --trace_gc --max_old_space_size=64 script.js\n\n// Sample output:\n// [9312:0x...] Scavenge 2.5 (3.0) -> 1.2 (4.0) MB, 1.2 ms\n//              ^^^^^^^^ Young Gen GC — fast, sub-ms\n// [9312:0x...] Mark-sweep 45.0 (60.0) -> 30.0 (60.0) MB, 50 ms\n//              ^^^^^^^^^^ Old Gen GC — slower, stop-the-world\n\n// Force GC in debug mode:\n// node --expose-gc -e \"global.gc(); console.log('GC complete')\"",
    "bestPractice": "Design your object lifecycles so that short-lived request-scoped objects die in the Young Generation. Objects that escape into closures, caches, or module-level variables get promoted to Old Space, increasing Mark-Sweep frequency. Profile with `node --heap-prof` to identify objects that are surviving longer than expected.",
    "source": "V8 Blog — Trash talk: the Orinoco garbage collector"
  },
  {
    "id": "a02",
    "topic": "GC Latency",
    "question": "¿Por qué un ciclo completo de GC Mark-Compact puede provocar picos de latencia notables en un servidor Node.js?",
    "code": null,
    "options": [
      "Duplica temporalmente el uso de memoria al copiar toda la heap",
      "Ejecuta pausas Stop-The-World mientras compacta el Old Space, bloqueando el event loop",
      "Recompila todas las funciones optimizadas por JIT para liberar memoria de la caché de código",
      "Vacía el grupo de hilos de libuv y reinicia todas las operaciones de E/S pendientes"
    ],
    "correctIndex": 1,
    "explanation": "Mark-Compact requiere pausas Stop-The-World (STW) para mover objetos y actualizar todos los punteros con seguridad, intervalo durante el cual el event loop no puede procesar nuevas solicitudes.",
    "compiledJS": "// Monitor GC pauses using perf_hooks:\nconst { PerformanceObserver, constants } = require('perf_hooks');\n\nconst obs = new PerformanceObserver(list => {\n  list.getEntries().forEach(entry => {\n    if (entry.detail.kind === constants.NODE_PERFORMANCE_GC_MAJOR) {\n      console.log(`Major GC: ${entry.duration.toFixed(1)} ms`);\n      // Spikes > 50 ms will cause p99 latency issues\n    }\n  });\n});\n\nobs.observe({ entryTypes: ['gc'] });",
    "bestPractice": "Keep the Old Space heap small by not retaining unnecessary long-lived objects (caches, global maps). Use `--max-old-space-size` to set a hard limit so the process crashes with an OOM rather than GC-thrashing. Monitor GC pause times with `perf_hooks` and alert when major GC pauses exceed 50 ms in production.",
    "source": "V8 Blog — Orinoco: young generation garbage collection"
  },
  {
    "id": "a03",
    "topic": "CPU Profiling",
    "question": "Ejecutas `node --prof app.js` y luego `node --prof-process isolate-*.log`. ¿Qué tipo de salida genera esto?",
    "code": null,
    "options": [
      "Una instantánea de la heap en formato JSON compatible con Chrome DevTools",
      "Un perfil estadístico de CPU legible que muestra las funciones más activas y sus porcentajes de llamada",
      "Una cronología de todas las pausas de GC con sus duraciones en milisegundos",
      "Un diagrama de cascada de red de todas las solicitudes HTTP realizadas durante la ejecución"
    ],
    "correctIndex": 1,
    "explanation": "`--prof` genera un perfil de muestreo basado en ticks de V8; `--prof-process` procesa este log generando un informe que detalla qué funciones consumieron mayor tiempo de CPU.",
    "compiledJS": "// Step 1: Profile\n// node --prof server.js\n// (run load test, then SIGINT)\n\n// Step 2: Process the log\n// node --prof-process isolate-0x*.log > profile.txt\n\n// Sample output excerpt:\n// [JavaScript]:\n//    ticks  total  nonlib   name\n//     1234   45.2%   67.8%  JSON.parse\n//      456   16.7%   25.1%  Router.handle\n//      123    4.5%    6.9%  MyService.processItem\n//\n// [C++]:\n//    ticks  total  nonlib   name\n//      890   32.6%          node::contextify::...",
    "bestPractice": "Run `--prof` under realistic load (use `autocannon` or `k6`) for at least 30 seconds to collect statistically significant samples. For continuous production profiling, consider `0x` for flame graphs or Clinic.js's Doctor and Flame tools, which are designed for production use. Focus optimisation on functions with high \"self\" ticks — those are the actual bottlenecks, not just callers.",
    "source": "Node.js Docs — Profiling Node.js Applications"
  },
  {
    "id": "a04",
    "topic": "Memory Leaks",
    "question": "¿Cuál de los siguientes patrones es la causa más común de fugas de memoria en servidores Node.js de larga duración?",
    "code": null,
    "options": [
      "Declarar variables inmutables con `const` en lugar de `let` en el scope raíz",
      "Acumular listeners en EventEmitter sin llamar `removeListener` para limpiar",
      "Llamar `JSON.parse` repetidamente sobre cargas en formato de string",
      "Adoptar sintaxis de `async/await` en lugar de callbacks con patrón de error"
    ],
    "correctIndex": 1,
    "explanation": "Cada llamada a `emitter.on()` añade una referencia que impide la recolección de basura del listener y de cualquier elemento en su clausura; sin limpieza se acumulan indefinidamente, un patrón clásico de fuga en Node.js.",
    "compiledJS": "// LEAK: listener added per request, never removed\nconst EventEmitter = require('events');\nconst bus = new EventEmitter();\n\nfunction handleRequest(req) {\n  // BUG: this listener is added on every request\n  bus.on('shutdown', () => req.socket.destroy());\n}\n\n// FIX 1: use once()\nfunction handleRequestFixed(req) {\n  bus.once('shutdown', () => req.socket.destroy());\n}\n\n// FIX 2: explicit cleanup\nfunction handleRequestFixed2(req) {\n  const cleanup = () => req.socket.destroy();\n  bus.on('shutdown', cleanup);\n  req.on('close', () => bus.removeListener('shutdown', cleanup));\n}",
    "bestPractice": "Use `clinic heapsampler` or `node --heap-prof` weekly on production snapshots to detect unexpected Old Space growth. For every `emitter.on()` in request-scoped or connection-scoped code, ensure a matching `removeListener()` or convert to `once()`. Set `emitter.setMaxListeners(0)` only after confirming the pattern is intentional, not as a way to silence warnings.",
    "source": "Node.js Docs — Common Memory Leaks"
  },
  {
    "id": "a05",
    "topic": "--max-old-space-size",
    "question": "¿Qué controla la opción de Node.js `--max-old-space-size=4096`?",
    "code": null,
    "options": [
      "El número máximo de archivos abiertos simultáneamente",
      "El tamaño del grupo de hilos de libuv en megabytes",
      "El límite superior de la heap Old Space de V8 en megabytes antes de lanzar un error de falta de memoria",
      "El tamaño máximo permitido para un payload JSON procesado con `JSON.parse`"
    ],
    "correctIndex": 2,
    "explanation": "`--max-old-space-size` establece el tamaño máximo de heap para la Old Generation de V8; superarlo provoca un GC final y luego un error fatal de memoria insuficiente (OOM).",
    "compiledJS": "// Start with 4 GB Old Space limit:\n// node --max-old-space-size=4096 server.js\n\n// Monitor current heap usage:\nconst v8 = require('v8');\nconst stats = v8.getHeapStatistics();\nconsole.log({\n  heap_size_limit:  Math.round(stats.heap_size_limit / 1024 / 1024) + ' MB',\n  used_heap_size:   Math.round(stats.used_heap_size  / 1024 / 1024) + ' MB',\n  total_heap_size:  Math.round(stats.total_heap_size / 1024 / 1024) + ' MB',\n});\n// { heap_size_limit: '4096 MB', used_heap_size: '42 MB', total_heap_size: '70 MB' }",
    "bestPractice": "In Kubernetes, set `--max-old-space-size` to 75–80% of the container's memory limit to leave headroom for the libuv thread pool, native bindings, and OS overhead. Pair with `--max-semi-space-size` (New Space control) and monitor `process.memoryUsage().heapUsed` in your metrics to catch gradual leaks before they hit the limit.",
    "source": "Node.js Docs — CLI options: --max-old-space-size"
  },
  {
    "id": "a06",
    "topic": "Poll Phase Blocking",
    "question": "Un bucle síncrono con uso intensivo de CPU que tarda 2 segundos se incluye accidentalmente en un manejador de solicitudes HTTP. ¿Cuál es la descripción más precisa del impacto?",
    "code": "// In an HTTP handler:\nfor (let i = 0; i < 2_000_000_000; i++) { /* busy wait */ }",
    "options": [
      "Solo esa petición se demora; los demás clientes continúan sin problemas",
      "La fase de poll se traba, deteniendo todas las peticiones y temporizadores",
      "Libuv mueve el bucle al pool de threads evitando el bloqueo del proceso",
      "El proceso maestro del cluster detecta la pausa y reinicia el worker activo"
    ],
    "correctIndex": 1,
    "explanation": "JavaScript es single-threaded: un bucle síncrono de CPU ocupa por completo el event loop, impidiendo procesar callbacks de E/S, temporizadores o nuevas solicitudes hasta su finalización.",
    "compiledJS": "const http = require('http');\n\nhttp.createServer((req, res) => {\n  if (req.url === '/slow') {\n    // This blocks ALL requests for 2 seconds\n    const start = Date.now();\n    while (Date.now() - start < 2000) { /* busy wait */ }\n    res.end('done');\n  } else {\n    res.end('fast');\n  }\n}).listen(3000);\n\n// Test:\n// curl http://localhost:3000/slow &\n// curl http://localhost:3000/fast   ← this also takes ~2s!",
    "bestPractice": "Never run CPU-bound loops in request handlers. Move heavy computation to worker_threads. If the algorithm is inherently synchronous, break it into chunks using `setImmediate` to yield control between iterations: `for (let i = 0; i < N; i += CHUNK) { processChunk(i); await new Promise(r => setImmediate(r)); }`. Monitor event loop lag with `perf_hooks.monitorEventLoopDelay()` and alert on values over 10 ms.",
    "source": "Node.js Docs — Don't Block the Event Loop"
  },
  {
    "id": "a07",
    "topic": "Back-pressure",
    "question": "¿Qué es la contrapresión (back-pressure) en streams de Node.js y qué rol cumple `highWaterMark`?",
    "code": null,
    "options": [
      "Back-pressure es límite de HTTP; `highWaterMark` define el tope de RPS",
      "Back-pressure indica búfer lleno; `highWaterMark` define el límite de write",
      "Back-pressure indica pausa de GC; `highWaterMark` activa compactación heap",
      "Back-pressure no se usa en streams; aplica solo a sockets TCP de red"
    ],
    "correctIndex": 1,
    "explanation": "Cuando el buffer interno de un Writable supera los bytes de `highWaterMark`, `write()` devuelve `false` (señal de contrapresión); los productores deben pausar hasta que se emita el evento `drain` para evitar un consumo desmedido de memoria.",
    "compiledJS": "const fs = require('fs');\nconst readable = fs.createReadStream('big-file.bin');\nconst writable = fs.createWriteStream('out.bin', { highWaterMark: 64 * 1024 }); // 64 KB\n\n// CORRECT: manual back-pressure handling\nreadable.on('data', chunk => {\n  const canContinue = writable.write(chunk);\n  if (!canContinue) {\n    readable.pause();\n    writable.once('drain', () => readable.resume());\n  }\n});\n\n// EASIER: pipeline handles this automatically\nconst { pipeline } = require('stream');\npipeline(readable, writable, err => {\n  if (err) console.error(err);\n  else console.log('Done');\n});",
    "bestPractice": "Always use `stream.pipeline()` for production stream chains — it manages back-pressure, propagates errors, and destroys all streams on completion or error. If writing custom readable implementations, override `_read()` and only push data when downstream signals it is ready. Never ignore a `false` return value from `write()`.",
    "source": "Node.js Docs — Streams: Backpressuring in Streams"
  },
  {
    "id": "a08",
    "topic": "N-API",
    "question": "¿Cuál es la principal ventaja de N-API (ahora Node-API) sobre las interfaces previas de complementos nativos (addons)?",
    "code": null,
    "options": [
      "Permite desarrollar addons nativos en Python en lugar de código en C/C++",
      "Ofrece estabilidad de ABI para no recompilar addons en cada versión de Node",
      "Brinda acceso directo a punteros de memoria interna del motor V8 del proceso",
      "Paraleliza de forma automática rutinas del addon entre todos los núcleos"
    ],
    "correctIndex": 1,
    "explanation": "N-API expone una capa de ABI estable que abstrae los componentes internos de V8, lo que significa que un addon nativo compilado una vez funciona entre distintas versiones principales de Node.js sin recompilar.",
    "compiledJS": "// binding.gyp — N-API addon descriptor\n// {\n//   \"targets\": [{\n//     \"target_name\": \"myaddon\",\n//     \"sources\": [\"src/addon.c\"],\n//     \"defines\": [\"NAPI_VERSION=8\"]\n//   }]\n// }\n\n// Node.js consumer:\nconst addon = require('./build/Release/myaddon');\n// Works on Node 14, 16, 18, 20, 22 without recompile\n// as long as NAPI_VERSION ≤ runtime's supported N-API version\n\nconsole.log(process.versions.napi); // e.g. \"8\"",
    "bestPractice": "When publishing npm packages with native addons, ship precompiled binaries for all supported Node versions and platforms using `node-pre-gyp` or `prebuildify`. Set `\"napi_versions\": [8]` in binding.gyp so the addon declares its minimum N-API version. Include a fallback compile-from-source step for unsupported platforms.",
    "source": "Node.js Docs — Node-API (N-API)"
  },
  {
    "id": "a09",
    "topic": "Hidden Classes",
    "question": "¿Cómo mejoran el rendimiento de los objetos JavaScript las clases ocultas de V8 ('hidden classes', también llamadas 'shapes' o 'maps')?",
    "code": null,
    "options": [
      "Comprimen claves de objetos en memoria usando diccionarios compartidos",
      "Permiten a V8 generar código optimizado rastreando el layout de propiedades",
      "Ocultan miembros privados de clases de la fase de marca del garbage collector",
      "Asignan previamente bloques fijos de memoria en heap por cada constructor"
    ],
    "correctIndex": 1,
    "explanation": "V8 asocia una clase oculta (shape/map) a cada objeto según la estructura de sus propiedades; los objetos que comparten la misma estructura aprovechan inline caches compiladas por JIT, agilizando el acceso a propiedades.",
    "compiledJS": "// GOOD: both objects share the same hidden class\nclass Point {\n  constructor(x, y) {\n    this.x = x; // always set in same order\n    this.y = y;\n  }\n}\nconst a = new Point(1, 2);\nconst b = new Point(3, 4);\n// a and b have identical hidden class → monomorphic IC → FAST\n\n// BAD: different property addition order → different hidden classes\nconst c = {}; c.x = 1; c.y = 2; // hidden class: {x, y}\nconst d = {}; d.y = 2; d.x = 1; // hidden class: {y, x} — DIFFERENT!\n// Accessing c.x and d.x goes through different ICs → slower",
    "bestPractice": "Always initialise all object properties in the constructor in a consistent order. Avoid adding or deleting properties after object creation in hot paths. Never use `delete obj.prop` — it degrades the hidden class. Use TypeScript classes or factory functions with a fixed property shape to guarantee monomorphic access patterns.",
    "source": "V8 Blog — What's up with monomorphism?"
  },
  {
    "id": "a10",
    "topic": "PM2",
    "question": "Al usar PM2 para lograr reinicios sin tiempo de inactividad (`pm2 reload`), ¿qué mecanismo utiliza PM2?",
    "code": null,
    "options": [
      "Pausa balanceadores, reinicia todos los nodos juntos y luego reanuda tráfico",
      "Crea un nuevo worker, espera señal de listo, migra tráfico y cierra el viejo",
      "Aplica parches en binario en memoria sin tener que crear nuevos subprocesos",
      "Depende de swaps de memoria en el kernel del SO para cambiar el código activo"
    ],
    "correctIndex": 1,
    "explanation": "El reload de PM2 realiza un reinicio progresivo (rolling restart): inicia un nuevo worker, espera a que emita `process.send('ready')`, le envía el tráfico y detiene de forma limpia el worker anterior, garantizando cero tiempo de inactividad.",
    "compiledJS": "// server.js — signal PM2 when server is ready\nconst http = require('http');\n\nconst server = http.createServer((req, res) => {\n  res.end(`Hello from PID ${process.pid}\\n`);\n});\n\nserver.listen(3000, () => {\n  console.log(`Worker ${process.pid} ready`);\n  if (process.send) process.send('ready'); // ← tells PM2 \"I am up\"\n});\n\n// Graceful shutdown on SIGTERM:\nprocess.on('SIGTERM', () => {\n  server.close(() => {\n    console.log(`Worker ${process.pid} closed`);\n    process.exit(0);\n  });\n});\n\n// pm2 start server.js -i max --wait-ready\n// pm2 reload server  ← zero-downtime rolling restart",
    "bestPractice": "Always implement graceful shutdown: on SIGTERM, stop accepting new connections (`server.close()`), finish in-flight requests, close database pools, then call `process.exit(0)`. Set `kill_timeout` in your PM2 ecosystem config to give workers enough time to drain before PM2 force-kills them. Test your graceful shutdown path in staging — it is often broken by connection pooling libraries that do not emit a close event.",
    "source": "PM2 Docs — Graceful Shutdown & Zero Downtime Reload"
  }
]
