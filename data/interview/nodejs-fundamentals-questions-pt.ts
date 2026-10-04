import type { InterviewQuestion } from '@/lib/interviewTypes'

export const NODEJS_FUNDAMENTALS_QUESTIONS_PT: InterviewQuestion[] = [
  {
    "id": "b01",
    "topic": "Single Thread",
    "question": "O Node.js é descrito como 'single-threaded'. O que isso significa principalmente no contexto de execução do JavaScript?",
    "code": null,
    "options": [
      "Ele só consegue processar uma requisição HTTP por vez",
      "O código JavaScript é executado em uma única pilha de chamadas em uma thread",
      "Ele usa apenas um núcleo de CPU para todas as operações",
      "Não é possível executar múltiplos processos Node.js na mesma máquina"
    ],
    "correctIndex": 1,
    "explanation": "O Node.js executa o JavaScript em uma única pilha de chamadas (a thread principal), mas delega operações de E/S para o pool de threads da libuv, permitindo concorrência não bloqueante.",
    "compiledJS": "// The single call stack in action\nconsole.log(\"1 — sync start\");\n\nsetTimeout(() => console.log(\"3 — timer callback\"), 0);\n\nconsole.log(\"2 — sync end\");\n\n// Output:\n// 1 — sync start\n// 2 — sync end\n// 3 — timer callback\n//\n// The timer fires AFTER sync code finishes — the event\n// loop can only pick up callbacks when the call stack is empty.",
    "bestPractice": "Never run CPU-intensive work synchronously on the main thread in a production server — it blocks ALL requests. Offload heavy computation to worker_threads or child_process, or use a task queue. Keep each event loop tick short (sub-millisecond ideally, never more than a few ms).",
    "source": "Node.js Docs — The Node.js Event Loop"
  },
  {
    "id": "b02",
    "topic": "require()",
    "question": "O que o `require('fs')` faz em um módulo Node.js?",
    "code": null,
    "options": [
      "Baixa o pacote 'fs' do registro npm público em tempo de execução",
      "Carrega o módulo nativo de arquivos e retorna seu objeto de exports",
      "Instancia um sistema de arquivos isolado apenas para o módulo atual",
      "Registra um ouvinte global de eventos de arquivo no loop do processo"
    ],
    "correctIndex": 1,
    "explanation": "O `require()` busca o módulo no cache ou o carrega do disco e o compila, retornando então seu objeto `module.exports`. Chamadas subsequentes retornam a cópia em cache.",
    "compiledJS": "const fs = require('fs');\n\n// Under the hood, Node wraps your file in:\n// (function(exports, require, module, __filename, __dirname) {\n//   const fs = require('fs');\n//   // ... your module code\n// });\n\nconsole.log(require.resolve('fs')); // Output: 'fs'\nconsole.log(typeof require.cache['fs']); // undefined — built-ins live outside the cache object\n\nconst a = require('./myModule');\nconst b = require('./myModule');\nconsole.log(a === b); // true — same cached reference",
    "bestPractice": "Avoid circular `require()` chains — they result in partially-initialised modules being returned, which is a common source of `undefined` errors that are hard to trace. Use dependency injection or restructure shared utilities into a separate leaf module that no one else imports.",
    "source": "Node.js Docs — Modules: CommonJS modules"
  },
  {
    "id": "b03",
    "topic": "package.json",
    "question": "Qual campo no `package.json` especifica o arquivo de ponto de entrada que o Node.js carrega quando seu pacote é importado com `require()`?",
    "code": null,
    "options": [
      "start",
      "index",
      "main",
      "entry"
    ],
    "correctIndex": 2,
    "explanation": "O campo `main` no `package.json` aponta para o arquivo que o Node.js resolve quando outro módulo requer o seu pacote. O padrão é `index.js` caso seja omitido.",
    "compiledJS": "// package.json\n// {\n//   \"name\": \"my-lib\",\n//   \"main\": \"./dist/index.js\",\n//   \"exports\": {\n//     \"require\": \"./dist/index.cjs\",\n//     \"import\":  \"./dist/index.mjs\"\n//   }\n// }\n\n// Consumer:\nconst lib = require('my-lib');\n// Node checks: exports.require → ./dist/index.cjs\n// Falls back to \"main\" only if \"exports\" is absent",
    "bestPractice": "For libraries, always define both `main` (CJS fallback) and `exports` (conditional exports for ESM/CJS) to support all modern Node versions. Use `\"type\": \"module\"` only in app packages, not libraries, unless you are prepared to drop CJS consumers.",
    "source": "Node.js Docs — Packages: package.json \"main\" field"
  },
  {
    "id": "b04",
    "topic": "Sync vs Async",
    "question": "Qual é a principal diferença entre `fs.readFileSync()` e `fs.readFile()` no Node.js?",
    "code": null,
    "options": [
      "`readFileSync` lê arquivos maiores; `readFile` é limitado a 1 megabyte",
      "`readFileSync` bloqueia o event loop; `readFile` é não bloqueante e assíncrono",
      "`readFile` foi descontinuado; `readFileSync` é o método moderno padrão",
      "Ambos os métodos são idênticos; o sufixo 'Sync' é puramente cosmético"
    ],
    "correctIndex": 1,
    "explanation": "O `readFileSync` bloqueia todo o event loop até que a leitura seja concluída, enquanto o `readFile` delega a E/S para a libuv e invoca o callback quando terminar.",
    "compiledJS": "const fs = require('fs');\n\n// BLOCKING — event loop stalls here\nconst data = fs.readFileSync('/etc/hostname', 'utf8');\nconsole.log('sync result:', data.trim());\n\n// NON-BLOCKING — returns immediately\nfs.readFile('/etc/hostname', 'utf8', (err, data) => {\n  if (err) throw err;\n  console.log('async result:', data.trim());\n});\n\nconsole.log('this prints BEFORE the async result');\n// Output order:\n// sync result: hostname\n// this prints BEFORE the async result\n// async result: hostname",
    "bestPractice": "Only use `*Sync` APIs at process startup (e.g., loading config files before the server begins listening). In all request handlers use the async variants or, better yet, the Promise-based `fs.promises.*` API with `async/await` for cleaner error handling.",
    "source": "Node.js Docs — File system: fs.readFile()"
  },
  {
    "id": "b05",
    "topic": "Callbacks",
    "question": "No Node.js, o que é um callback?",
    "code": null,
    "options": [
      "Uma classe de erro nativa para capturar falhas em fluxos assíncronos",
      "Uma função passada a outra função, executada ao concluir uma ação assíncrona",
      "Um wrapper síncrono que simula Promises em versões legadas do Node.js",
      "Um método especial de ciclo de vida nativo da classe EventEmitter"
    ],
    "correctIndex": 1,
    "explanation": "O padrão de callback é a primitiva assíncrona fundamental do Node.js: passa-se uma função que o Node chama de volta com `(error, result)` assim que a operação termina.",
    "compiledJS": "const fs = require('fs');\n\n// Error-first callback convention\nfs.readFile('./data.json', 'utf8', function(err, content) {\n  if (err) {\n    console.error('Read failed:', err.message);\n    return; // always return to prevent \"fall-through\" execution\n  }\n  console.log('File content:', content);\n});\n\n// Promisify a callback API:\nconst { promisify } = require('util');\nconst readFileP = promisify(fs.readFile);\nreadFileP('./data.json', 'utf8')\n  .then(content => console.log(content))\n  .catch(err => console.error(err));",
    "bestPractice": "Always handle the error argument — unhandled errors silently swallow failures. If you are wrapping legacy callback code, use `util.promisify()` or the `fs.promises.*` variants rather than writing new callback code. Avoid \"callback hell\" by decomposing nested callbacks into named functions or converting to async/await.",
    "source": "Node.js Docs — Asynchronous programming & callbacks"
  },
  {
    "id": "b06",
    "topic": "process.env",
    "question": "Como você lê uma variável de ambiente chamada `PORT` em um processo Node.js?",
    "code": null,
    "options": [
      "`env.get('PORT')`",
      "`process.env.PORT`",
      "`os.env('PORT')`",
      "`global.PORT`"
    ],
    "correctIndex": 1,
    "explanation": "O `process.env` é um objeto preenchido com as variáveis de ambiente do processo. Acessar `process.env.PORT` retorna seu valor em string ou `undefined`.",
    "compiledJS": "// Start the process with: PORT=3000 node server.js\n\nconst port = parseInt(process.env.PORT ?? '3000', 10);\nconsole.log(typeof process.env.PORT); // \"string\"\nconsole.log(port);                    // 3000 (number)\n\n// Defensive pattern for required vars:\nconst dbUrl = process.env.DATABASE_URL;\nif (!dbUrl) {\n  console.error('Missing DATABASE_URL env var');\n  process.exit(1);\n}",
    "bestPractice": "Validate and parse all `process.env` values at startup using a schema validator (e.g., `zod`, `envalid`, or a simple guard block) rather than reading them inline throughout the code. Fail fast with a clear error message if required variables are missing — never silently fall back to `undefined`.",
    "source": "Node.js Docs — process.env"
  },
  {
    "id": "b07",
    "topic": "path Module",
    "question": "Qual módulo nativo do Node.js você usaria para unir dois segmentos de caminho de forma segura e multiplataforma?",
    "code": null,
    "options": [
      "`fs`",
      "`url`",
      "`path`",
      "`os`"
    ],
    "correctIndex": 2,
    "explanation": "O módulo `path` fornece `path.join()` e `path.resolve()`, que lidam automaticamente com separadores específicos de cada plataforma (`/` vs `\\`).",
    "compiledJS": "const path = require('path');\n\nconsole.log(path.join('users', 'photos', 'avatar.png'));\n// POSIX:   users/photos/avatar.png\n// Windows: users\\photos\\avatar.png\n\nconsole.log(path.resolve('.', 'src', 'index.ts'));\n// Returns absolute path from CWD\n\nconsole.log(path.extname('bundle.min.js')); // .js\nconsole.log(path.basename('/usr/bin/node')); // node",
    "bestPractice": "Always use `path.join()` or `path.resolve()` instead of string concatenation for file paths. Use `__dirname` (CJS) or `new URL('.', import.meta.url).pathname` (ESM) as the base rather than `process.cwd()`, which changes when the process is started from a different directory.",
    "source": "Node.js Docs — Path module"
  },
  {
    "id": "b08",
    "topic": "npm Scripts",
    "question": "O que o comando `npm run build` executa?",
    "code": null,
    "options": [
      "Baixa e instala todos os pacotes listados em `dependencies`",
      "Executa o script `build` definido sob a chave `scripts` no `package.json`",
      "Compila todos os arquivos `.ts` para `.js` usando o compilador nativo do Node",
      "Cria um bundle de produção e faz upload para o npm"
    ],
    "correctIndex": 1,
    "explanation": "`npm run <nome>` executa o comando de terminal mapeado para aquele nome na seção `scripts` do `package.json`, adicionando `node_modules/.bin` ao PATH.",
    "compiledJS": "// package.json\n// {\n//   \"scripts\": {\n//     \"build\": \"tsc --project tsconfig.json\",\n//     \"start\": \"node dist/index.js\",\n//     \"test\":  \"jest --runInBand\"\n//   }\n// }\n\n// npm run build  →  executes: tsc --project tsconfig.json\n//                   with node_modules/.bin in PATH\n\n// Lifecycle hooks run automatically:\n// prebuild  → runs before \"build\"\n// postbuild → runs after  \"build\"",
    "bestPractice": "Define `build`, `start`, `test`, `lint`, and `dev` scripts consistently across all your projects so engineers do not need to read documentation just to run the server. Use the `pre`/`post` hook convention (`prebuild`, `posttest`) for setup/teardown rather than manually chaining commands with `&&`.",
    "source": "npm Docs — scripts"
  },
  {
    "id": "b09",
    "topic": "Stack Traces",
    "question": "Em um rastreamento de pilha (stack trace) do Node.js, o que a linha `at Object.<anonymous> (app.js:42:15)` indica?",
    "code": null,
    "options": [
      "Um objeto anônimo foi exportado de `app.js`",
      "O erro originou-se na linha 42, coluna 15 de `app.js`",
      "O arquivo `app.js` possui 42 exportações",
      "O uso de memória do processo no momento do erro"
    ],
    "correctIndex": 1,
    "explanation": "Cada frame da pilha mostra o nome da função, o arquivo, o número da linha e da coluna, permitindo identificar com precisão o local do código-fonte onde a chamada foi feita.",
    "compiledJS": "function outer() {\n  function inner() {\n    throw new Error('something went wrong');\n  }\n  inner();\n}\n\nouter();\n\n// Stack trace output:\n// Error: something went wrong\n//     at inner (app.js:3:11)   ← line 3, col 11\n//     at outer (app.js:5:3)\n//     at Object.<anonymous> (app.js:8:1)  ← top-level call",
    "bestPractice": "Enable source maps in production (`--enable-source-maps` flag in Node 14+, or `source-map-support` package) so stack traces point to TypeScript source lines. Structure errors with meaningful messages and include a `cause` field for wrapped errors — `new Error('DB query failed', { cause: pgError })` — so logging shows the full chain.",
    "source": "Node.js Docs — V8 Stack Trace API"
  },
  {
    "id": "b10",
    "topic": "Node vs Browser",
    "question": "Qual dos itens a seguir está disponível no ambiente JavaScript de um navegador, mas NÃO no Node.js por padrão?",
    "code": null,
    "options": [
      "`setTimeout`",
      "`Promise`",
      "`window`",
      "`Array.prototype.map`"
    ],
    "correctIndex": 2,
    "explanation": "O objeto global `window` (e APIs específicas de navegador como `document` e `localStorage`) não existem no Node.js. Em seu lugar, o Node possui `global`, `process` e suas próprias APIs de E/S.",
    "compiledJS": "// In Node.js:\nconsole.log(typeof window);   // \"undefined\"\nconsole.log(typeof global);   // \"object\"\nconsole.log(typeof process);  // \"object\"\nconsole.log(typeof document); // \"undefined\"\n\n// These WORK in Node:\nconsole.log(typeof setTimeout); // \"function\"\nconsole.log(typeof Promise);    // \"function\"\nconsole.log(typeof fetch);      // \"function\" (Node 18+)",
    "bestPractice": "Never write library code that assumes `window` or `document` exist without a guard — it breaks server-side rendering. Use feature detection (`typeof window !== 'undefined'`) or a universal abstraction. Prefer the Node `https` module or `fetch` (Node 18+) over libraries that polyfill browser XMLHttpRequest.",
    "source": "Node.js Docs — Global objects"
  },
  {
    "id": "i01",
    "topic": "Event Loop Phases",
    "question": "Qual é a ordem correta de execução para o código a seguir?\n```js\nsetTimeout(() => console.log('A'), 0);\nsetImmediate(() => console.log('B'));\nprocess.nextTick(() => console.log('C'));\nconsole.log('D');\n```",
    "code": "setTimeout(() => console.log('A'), 0);\nsetImmediate(() => console.log('B'));\nprocess.nextTick(() => console.log('C'));\nconsole.log('D');",
    "options": [
      "D → A → B → C",
      "D → C → A → B",
      "D → C → B → A",
      "A → B → C → D"
    ],
    "correctIndex": 2,
    "explanation": "O código síncrono executa primeiro (D), seguido pela fila de microtarefas/nextTick (C); depois a fase de timers dispara o setTimeout (A) e finalmente a fase check dispara o setImmediate (B). Fora de um ciclo de E/S, a ordem entre setTimeout(0) e setImmediate é não determinística; em um script de nível superior, as ordens mais observadas são D→C→A→B ou D→C→B→A.",
    "compiledJS": "// Run this and observe:\nsetTimeout(() => console.log('A'), 0);\nsetImmediate(() => console.log('B'));\nprocess.nextTick(() => console.log('C'));\nconsole.log('D');\n\n// Guaranteed order:\n// D  (sync, call stack)\n// C  (nextTick queue — drains before event loop phases)\n// B or A  (non-deterministic: check vs timers race)\n//\n// Inside an I/O callback the order becomes deterministic:\n// require('fs').readFile(__filename, () => {\n//   setTimeout(() => console.log('timeout'), 0);\n//   setImmediate(() => console.log('immediate'));\n// });\n// Output: immediate → timeout  (always)",
    "bestPractice": "Never rely on the relative ordering of `setTimeout(fn, 0)` vs `setImmediate` at the top level — it is a race condition. Inside I/O callbacks, prefer `setImmediate` when you need to defer work to after the current poll phase. Use `process.nextTick` sparingly for truly urgent deferred initialisation — overusing it starves the I/O event loop.",
    "source": "Node.js Docs — The Event Loop: setImmediate() vs setTimeout()"
  },
  {
    "id": "i02",
    "topic": "setImmediate",
    "question": "Em qual fase do event loop do Node.js o `setImmediate()` é disparado?",
    "code": null,
    "options": [
      "Fase de timers",
      "Fase de poll",
      "Fase de check",
      "Fase de close callbacks"
    ],
    "correctIndex": 2,
    "explanation": "As fases do event loop são: timers → pending callbacks → idle/prepare → poll → check → close callbacks. Os callbacks de `setImmediate` rodam na fase check.",
    "compiledJS": "// Visualising the six phases:\nconst net = require('net');\n\nconst server = net.createServer((socket) => {\n  // We are now inside an I/O callback (poll phase)\n  setImmediate(() => console.log('CHECK phase'));\n  setTimeout(() => console.log('TIMERS phase (next tick)'), 0);\n  // Output:\n  // CHECK phase  ← always first inside I/O callbacks\n  // TIMERS phase (next tick)\n});\nserver.listen(0);",
    "bestPractice": "Use `setImmediate` instead of `setTimeout(fn, 0)` when you want to defer work until after the current I/O phase — it is more predictable and semantically clearer. If you need to break up a long synchronous loop to yield to I/O between chunks, `setImmediate` is the right primitive.",
    "source": "Node.js Docs — The Node.js Event Loop: setImmediate()"
  },
  {
    "id": "i03",
    "topic": "process.nextTick",
    "question": "Qual das alternativas a seguir possui a maior prioridade de execução no agendamento assíncrono do Node.js?",
    "code": null,
    "options": [
      "`setTimeout(fn, 0)`",
      "`setImmediate(fn)`",
      "`process.nextTick(fn)`",
      "Callbacks de `.then()` de uma `Promise` resolvida"
    ],
    "correctIndex": 2,
    "explanation": "Os callbacks de `process.nextTick` são esvaziados por completo antes de qualquer callback de microtarefa (Promise), que por sua vez se esvaziam antes que a próxima fase do event loop se inicie.",
    "compiledJS": "Promise.resolve().then(() => console.log('Promise'));\nprocess.nextTick(() => console.log('nextTick'));\nsetImmediate(() => console.log('setImmediate'));\nsetTimeout(() => console.log('setTimeout'), 0);\n\n// Output (guaranteed):\n// nextTick\n// Promise\n// setTimeout  (or setImmediate — race at top level)\n// setImmediate",
    "bestPractice": "Reserve `process.nextTick` for correcting async/sync API contracts — e.g., ensuring a constructor's \"ready\" event always fires asynchronously even when all data is already available. Do not use it for general deferred work. Prefer `queueMicrotask()` if you only need microtask-level priority without the nextTick ordering guarantee.",
    "source": "Node.js Docs — process.nextTick()"
  },
  {
    "id": "i04",
    "topic": "Streams",
    "question": "Que tipo de stream do Node.js você usaria para ler e escrever dados E transformar esses dados em trânsito (por exemplo, um compressor gzip)?",
    "code": null,
    "options": [
      "Stream Readable",
      "Stream Writable",
      "Stream Duplex",
      "Stream Transform"
    ],
    "correctIndex": 3,
    "explanation": "Uma stream Transform é um tipo de Duplex cujo output é computado a partir do input; `zlib.createGzip()` é o exemplo canônico. Uma stream Duplex comum possui canais de leitura e escrita independentes.",
    "compiledJS": "const { Transform } = require('stream');\nconst { createGzip } = require('zlib');\nconst fs = require('fs');\n\n// Built-in Transform: gzip compression\nconst gzip = createGzip();\nconst source = fs.createReadStream('input.txt');\nconst dest   = fs.createWriteStream('input.txt.gz');\n\nsource.pipe(gzip).pipe(dest);\n\n// Custom Transform — uppercase everything:\nconst upperCase = new Transform({\n  transform(chunk, _enc, callback) {\n    this.push(chunk.toString().toUpperCase());\n    callback();\n  },\n});\n\nprocess.stdin.pipe(upperCase).pipe(process.stdout);",
    "bestPractice": "Always use `stream.pipeline()` (not `pipe()`) in production code — it properly propagates errors and cleans up all streams in the chain when any stream errors or closes. Pass an error-handling callback as the last argument to `pipeline()`.",
    "source": "Node.js Docs — Stream: stream.Transform"
  },
  {
    "id": "i05",
    "topic": "Cluster Module",
    "question": "Qual é o objetivo principal do módulo `cluster` no Node.js?",
    "code": null,
    "options": [
      "Distribuir pacotes npm entre máquinas de computação do cluster",
      "Criar processos workers compartilhando portas para usar várias CPUs",
      "Gerar processos filhos isolados executando scripts sem estado comum",
      "Criar pools de threads dedicadas para tarefas síncronas pesadas"
    ],
    "correctIndex": 1,
    "explanation": "O módulo `cluster` bifurca processos filhos (todos compartilhando portas via round-robin do SO ou repasse de handles pelo processo mestre), permitindo que o aplicativo Node escale através dos núcleos da CPU.",
    "compiledJS": "const cluster = require('cluster');\nconst http = require('http');\nconst os = require('os');\n\nif (cluster.isPrimary) {\n  const numCPUs = os.cpus().length;\n  console.log(`Forking ${numCPUs} workers`);\n  for (let i = 0; i < numCPUs; i++) cluster.fork();\n\n  cluster.on('exit', (worker, code) => {\n    console.log(`Worker ${worker.process.pid} died (${code}) — reforking`);\n    cluster.fork();\n  });\n} else {\n  http.createServer((req, res) => {\n    res.end(`Handled by PID ${process.pid}\\n`);\n  }).listen(3000);\n  console.log(`Worker ${process.pid} started`);\n}",
    "bestPractice": "In production, prefer PM2 cluster mode over manual `cluster` code — PM2 handles worker death, zero-downtime reloads, and logging out of the box. If you use raw `cluster`, always re-fork on worker exit to prevent CPU core under-utilisation after crashes.",
    "source": "Node.js Docs — Cluster module"
  },
  {
    "id": "i06",
    "topic": "worker_threads",
    "question": "Como o `worker_threads` se diferencia de `child_process` no Node.js?",
    "code": null,
    "options": [
      "`worker_threads` compartilham memória; `child_process` cria processos no SO",
      "`child_process` é mais veloz em CPU por usar threads nativas do sistema",
      "`worker_threads` não conseguem trocar mensagens com a thread principal",
      "Ambos os módulos são idênticos e compartilham o mesmo motor interno"
    ],
    "correctIndex": 0,
    "explanation": "As worker threads rodam dentro do mesmo processo e podem compartilhar memória (SharedArrayBuffer/Atomics), enquanto `child_process` cria processos distintos do sistema operacional com heaps V8 isoladas.",
    "compiledJS": "const { Worker, isMainThread, workerData, parentPort } = require('worker_threads');\n\nif (isMainThread) {\n  // Shared memory — zero copy!\n  const sharedBuffer = new SharedArrayBuffer(4);\n  const arr = new Int32Array(sharedBuffer);\n  arr[0] = 42;\n\n  const worker = new Worker(__filename, { workerData: { sharedBuffer } });\n  worker.on('message', msg => console.log('Worker says:', msg));\n} else {\n  const arr = new Int32Array(workerData.sharedBuffer);\n  console.log('Shared value:', arr[0]); // 42 — no serialisation!\n  parentPort.postMessage('done');\n}",
    "bestPractice": "Use `worker_threads` for CPU-intensive computation in a web server (image resizing, PDF rendering, complex JSON transforms). Use `child_process` for running external binaries, isolating untrusted code, or when crash isolation is required. Always limit the number of concurrent workers to `os.cpus().length` to avoid thrashing.",
    "source": "Node.js Docs — worker_threads"
  },
  {
    "id": "i07",
    "topic": "V8 Heap",
    "question": "Na organização da heap da V8, para que serve o 'New Space' (Geração Jovem)?",
    "code": null,
    "options": [
      "Armazenar código de máquina compilado para funções compiladas via JIT",
      "Objetos de vida curta que devem ser coletados rapidamente",
      "Objetos grandes com mais de 1 MB que não cabem em páginas comuns",
      "A pilha de chamadas e frames de variáveis locais"
    ],
    "correctIndex": 1,
    "explanation": "A V8 divide a heap em New Space (objetos jovens de vida curta, coletados pelo Scavenge) e Old Space (objetos de vida longa, coletados por Mark-Sweep/Mark-Compact).",
    "compiledJS": "// Inspect heap segments with --expose-gc and v8 module:\nconst v8 = require('v8');\n\nconst stats = v8.getHeapSpaceStatistics();\nstats.forEach(s => {\n  console.log(`${s.space_name}: ${Math.round(s.space_used_size / 1024)} KB used`);\n});\n// Typical output:\n// new_space: 1024 KB used\n// old_space: 8200 KB used\n// code_space: 560 KB used\n// large_object_space: 0 KB used\n// map_space: 312 KB used",
    "bestPractice": "Allocate objects that will live for the entire process lifetime (singletons, caches) at startup so they promote to Old Space quickly and stop generating GC pressure. Avoid patterns that continually promote objects to Old Space unnecessarily — e.g., using closures in tight loops that capture large outer variables.",
    "source": "V8 Blog — Trash talk: the Orinoco garbage collector"
  },
  {
    "id": "i08",
    "topic": "Module Caching",
    "question": "Quando um módulo Node.js é importado via `require()` uma segunda vez, o que acontece?",
    "code": null,
    "options": [
      "O arquivo do módulo é relido do disco e reexecutado na memória do app",
      "Um erro de inicialização é lançado para evitar carregamento duplicado",
      "O objeto `exports` em cache do primeiro carregamento retorna no ato",
      "Uma nova instância isolada de execução é criada para o módulo local"
    ],
    "correctIndex": 2,
    "explanation": "O sistema de módulos do Node armazena cada módulo resolvido em `require.cache`. Chamadas subsequentes a `require()` para o mesmo arquivo retornam o `exports` em cache sem reexecutar o código do módulo.",
    "compiledJS": "// counter.js\nlet count = 0;\nmodule.exports = { increment: () => ++count, get: () => count };\n\n// app.js\nconst a = require('./counter');\nconst b = require('./counter');\n\na.increment();\nconsole.log(b.get()); // 1 — same object!\nconsole.log(a === b);  // true\n\n// Delete cache to force reload:\ndelete require.cache[require.resolve('./counter')];\nconst c = require('./counter');\nconsole.log(c.get()); // 0 — fresh instance",
    "bestPractice": "Rely on module caching as the singleton mechanism — it is simpler than manual singleton implementations. In unit tests, reset the cache between tests (`jest.resetModules()`) to avoid shared state bleed between test cases.",
    "source": "Node.js Docs — Modules: Caching"
  },
  {
    "id": "i09",
    "topic": "EventEmitter",
    "question": "Qual método do `EventEmitter` registra um listener que dispara apenas uma vez e se remove automaticamente em seguida?",
    "code": null,
    "options": [
      "`emitter.on(event, listener)`",
      "`emitter.once(event, listener)`",
      "`emitter.addOnceListener(event, listener)`",
      "`emitter.emit(event, { once: true })`"
    ],
    "correctIndex": 1,
    "explanation": "`emitter.once()` envolve o listener de forma que ele se desregistre após a primeira emissão, evitando execuções repetidas sem a necessidade de limpeza manual com `removeListener`.",
    "compiledJS": "const EventEmitter = require('events');\nconst ee = new EventEmitter();\n\nee.on('data', d => console.log('on:', d));     // fires every time\nee.once('data', d => console.log('once:', d)); // fires once then removes itself\n\nee.emit('data', 'first');\n// on: first\n// once: first\n\nee.emit('data', 'second');\n// on: second\n// (once listener is gone)\n\nconsole.log(ee.listenerCount('data')); // 1",
    "bestPractice": "Always balance `on()` with `removeListener()` (or use `once()` when appropriate) in long-running services. In Express middleware or socket.io handlers, if you add a listener inside a request handler, remove it when the request ends — otherwise every request leaks a listener that retains a closure over the request/response objects.",
    "source": "Node.js Docs — Events: emitter.once()"
  },
  {
    "id": "i10",
    "topic": "libuv",
    "question": "Qual é o papel da libuv no Node.js?",
    "code": null,
    "options": [
      "O motor de JavaScript que compila e executa código JS para binário nativo",
      "A biblioteca C que provê o event loop, thread pool e camada de I/O no SO",
      "O gerenciador de pacotes que resolve dependências e árvores de módulos",
      "O módulo de protocolo que implementa streams e enquadramento de HTTP/2"
    ],
    "correctIndex": 1,
    "explanation": "A libuv é a biblioteca em C sobre a qual o Node.js é construído, responsável por implementar o event loop, o pool de threads (para E/S de arquivos, DNS, etc.) e as abstrações de rede específicas de cada plataforma.",
    "compiledJS": "// Thread pool size affects parallel file I/O throughput\n// Set before starting Node:\n// UV_THREADPOOL_SIZE=8 node server.js\n\nconst { execSync } = require('child_process');\nconsole.log(process.env.UV_THREADPOOL_SIZE ?? '4 (default)');\n\n// DNS resolution uses the thread pool too:\nconst dns = require('dns');\nconsole.time('dns');\ndns.lookup('toolnotch.com', (err, addr) => {\n  console.timeEnd('dns');\n  console.log(addr);\n});",
    "bestPractice": "For workloads that perform many concurrent file I/O operations (e.g., reading thousands of files on startup), increase `UV_THREADPOOL_SIZE` beyond the default 4. Monitor libuv thread pool saturation using `clinic.js` or the `blocked-at` module — if the pool is saturated, threads queue up and `async` operations appear slow despite low CPU.",
    "source": "libuv Documentation — Design overview"
  },
  {
    "id": "a01",
    "topic": "GC Algorithms",
    "question": "Qual algoritmo de coleta de lixo (garbage collection) a V8 utiliza para a Geração Jovem (New Space)?",
    "code": null,
    "options": [
      "Generational Mark-Sweep",
      "Concurrent Mark-Compact",
      "Scavenge (cópia semi-space)",
      "Ciclo de Reference counting"
    ],
    "correctIndex": 2,
    "explanation": "A V8 utiliza o Scavenge, um coletor por cópia semi-space, para a Geração Jovem porque a maioria dos objetos morre jovem, tornando rápida a evacuação dos sobreviventes.",
    "compiledJS": "// Observe GC with --trace_gc flag:\n// node --trace_gc --max_old_space_size=64 script.js\n\n// Sample output:\n// [9312:0x...] Scavenge 2.5 (3.0) -> 1.2 (4.0) MB, 1.2 ms\n//              ^^^^^^^^ Young Gen GC — fast, sub-ms\n// [9312:0x...] Mark-sweep 45.0 (60.0) -> 30.0 (60.0) MB, 50 ms\n//              ^^^^^^^^^^ Old Gen GC — slower, stop-the-world\n\n// Force GC in debug mode:\n// node --expose-gc -e \"global.gc(); console.log('GC complete')\"",
    "bestPractice": "Design your object lifecycles so that short-lived request-scoped objects die in the Young Generation. Objects that escape into closures, caches, or module-level variables get promoted to Old Space, increasing Mark-Sweep frequency. Profile with `node --heap-prof` to identify objects that are surviving longer than expected.",
    "source": "V8 Blog — Trash talk: the Orinoco garbage collector"
  },
  {
    "id": "a02",
    "topic": "GC Latency",
    "question": "Por que um ciclo completo de GC Mark-Compact pode causar picos de latência observáveis em um servidor Node.js?",
    "code": null,
    "options": [
      "Ele dobra temporariamente o uso de memória ao copiar toda a heap",
      "Ele executa pausas Stop-The-World enquanto compacta o Old Space, bloqueando o event loop",
      "Ele recompila todas as funções otimizadas por JIT para liberar memória do cache de código",
      "Ele esvazia o pool de threads da libuv e reinicia todas as operações de E/S pendentes"
    ],
    "correctIndex": 1,
    "explanation": "O Mark-Compact exige pausas Stop-The-World (STW) para mover objetos e atualizar todos os ponteiros com segurança, período no qual o event loop não consegue processar novas requisições.",
    "compiledJS": "// Monitor GC pauses using perf_hooks:\nconst { PerformanceObserver, constants } = require('perf_hooks');\n\nconst obs = new PerformanceObserver(list => {\n  list.getEntries().forEach(entry => {\n    if (entry.detail.kind === constants.NODE_PERFORMANCE_GC_MAJOR) {\n      console.log(`Major GC: ${entry.duration.toFixed(1)} ms`);\n      // Spikes > 50 ms will cause p99 latency issues\n    }\n  });\n});\n\nobs.observe({ entryTypes: ['gc'] });",
    "bestPractice": "Keep the Old Space heap small by not retaining unnecessary long-lived objects (caches, global maps). Use `--max-old-space-size` to set a hard limit so the process crashes with an OOM rather than GC-thrashing. Monitor GC pause times with `perf_hooks` and alert when major GC pauses exceed 50 ms in production.",
    "source": "V8 Blog — Orinoco: young generation garbage collection"
  },
  {
    "id": "a03",
    "topic": "CPU Profiling",
    "question": "Você executa `node --prof app.js` e depois `node --prof-process isolate-*.log`. Que tipo de saída isso produz?",
    "code": null,
    "options": [
      "Um snapshot de heap em formato JSON compatível com o Chrome DevTools",
      "Um perfil estatístico de CPU legível por humanos mostrando funções críticas e suas porcentagens de chamada",
      "Uma linha do tempo de todas as pausas de GC com suas durações em milissegundos",
      "Um diagrama em cascata de rede de todas as requisições HTTP feitas durante a execução"
    ],
    "correctIndex": 1,
    "explanation": "A flag `--prof` gera um perfil de amostragem baseado em ticks da V8; `--prof-process` processa esse log em um relatório detalhando quais funções consumiram mais tempo de CPU.",
    "compiledJS": "// Step 1: Profile\n// node --prof server.js\n// (run load test, then SIGINT)\n\n// Step 2: Process the log\n// node --prof-process isolate-0x*.log > profile.txt\n\n// Sample output excerpt:\n// [JavaScript]:\n//    ticks  total  nonlib   name\n//     1234   45.2%   67.8%  JSON.parse\n//      456   16.7%   25.1%  Router.handle\n//      123    4.5%    6.9%  MyService.processItem\n//\n// [C++]:\n//    ticks  total  nonlib   name\n//      890   32.6%          node::contextify::...",
    "bestPractice": "Run `--prof` under realistic load (use `autocannon` or `k6`) for at least 30 seconds to collect statistically significant samples. For continuous production profiling, consider `0x` for flame graphs or Clinic.js's Doctor and Flame tools, which are designed for production use. Focus optimisation on functions with high \"self\" ticks — those are the actual bottlenecks, not just callers.",
    "source": "Node.js Docs — Profiling Node.js Applications"
  },
  {
    "id": "a04",
    "topic": "Memory Leaks",
    "question": "Qual dos seguintes padrões é a causa mais comum de vazamentos de memória em servidores Node.js de longa duração?",
    "code": null,
    "options": [
      "Declarar variáveis imutáveis com `const` em vez de `let` no escopo raiz",
      "Acumular listeners no EventEmitter sem chamar `removeListener` para limpar",
      "Chamar `JSON.parse` repetidamente sobre payloads em formato de string",
      "Adotar sintaxe de `async/await` no lugar de callbacks com padrão de erro"
    ],
    "correctIndex": 1,
    "explanation": "Cada chamada a `emitter.on()` adiciona uma referência que impede a coleta de lixo do listener e de tudo capturado em seu closure; sem limpeza, eles se acumulam indefinidamente, um vazamento clássico no Node.js.",
    "compiledJS": "// LEAK: listener added per request, never removed\nconst EventEmitter = require('events');\nconst bus = new EventEmitter();\n\nfunction handleRequest(req) {\n  // BUG: this listener is added on every request\n  bus.on('shutdown', () => req.socket.destroy());\n}\n\n// FIX 1: use once()\nfunction handleRequestFixed(req) {\n  bus.once('shutdown', () => req.socket.destroy());\n}\n\n// FIX 2: explicit cleanup\nfunction handleRequestFixed2(req) {\n  const cleanup = () => req.socket.destroy();\n  bus.on('shutdown', cleanup);\n  req.on('close', () => bus.removeListener('shutdown', cleanup));\n}",
    "bestPractice": "Use `clinic heapsampler` or `node --heap-prof` weekly on production snapshots to detect unexpected Old Space growth. For every `emitter.on()` in request-scoped or connection-scoped code, ensure a matching `removeListener()` or convert to `once()`. Set `emitter.setMaxListeners(0)` only after confirming the pattern is intentional, not as a way to silence warnings.",
    "source": "Node.js Docs — Common Memory Leaks"
  },
  {
    "id": "a05",
    "topic": "--max-old-space-size",
    "question": "O que a flag do Node.js `--max-old-space-size=4096` controla?",
    "code": null,
    "options": [
      "O número máximo de arquivos que podem ser abertos simultaneamente",
      "O tamanho do pool de threads da libuv em megabytes",
      "O limite superior da heap Old Space da V8 em megabytes antes que um erro de falta de memória seja lançado",
      "O tamanho máximo permitido para uma carga útil JSON analisada com `JSON.parse`"
    ],
    "correctIndex": 2,
    "explanation": "`--max-old-space-size` define o tamanho máximo de heap para a Old Generation da V8; ultrapassar esse limite dispara uma coleta de lixo final e, em seguida, um erro fatal de falta de memória (OOM).",
    "compiledJS": "// Start with 4 GB Old Space limit:\n// node --max-old-space-size=4096 server.js\n\n// Monitor current heap usage:\nconst v8 = require('v8');\nconst stats = v8.getHeapStatistics();\nconsole.log({\n  heap_size_limit:  Math.round(stats.heap_size_limit / 1024 / 1024) + ' MB',\n  used_heap_size:   Math.round(stats.used_heap_size  / 1024 / 1024) + ' MB',\n  total_heap_size:  Math.round(stats.total_heap_size / 1024 / 1024) + ' MB',\n});\n// { heap_size_limit: '4096 MB', used_heap_size: '42 MB', total_heap_size: '70 MB' }",
    "bestPractice": "In Kubernetes, set `--max-old-space-size` to 75–80% of the container's memory limit to leave headroom for the libuv thread pool, native bindings, and OS overhead. Pair with `--max-semi-space-size` (New Space control) and monitor `process.memoryUsage().heapUsed` in your metrics to catch gradual leaks before they hit the limit.",
    "source": "Node.js Docs — CLI options: --max-old-space-size"
  },
  {
    "id": "a06",
    "topic": "Poll Phase Blocking",
    "question": "Um loop síncrono intensivo de CPU com duração de 2 segundos é inserido acidentalmente em um handler de requisição HTTP. Qual é a descrição mais precisa do impacto?",
    "code": "// In an HTTP handler:\nfor (let i = 0; i < 2_000_000_000; i++) { /* busy wait */ }",
    "options": [
      "Apenas aquela requisição atrasa; os outros clientes continuam normais",
      "A fase de poll é travada, paralisando todas as requisições e temporizadores",
      "A libuv move o loop para a thread pool evitando o bloqueio do processo",
      "O processo mestre do cluster detecta a pausa e reinicia o worker ativo"
    ],
    "correctIndex": 1,
    "explanation": "O JavaScript é single-threaded: um loop síncrono de CPU ocupa todo o event loop, impedindo que callbacks de E/S, timers ou novas requisições sejam processados até que ele termine.",
    "compiledJS": "const http = require('http');\n\nhttp.createServer((req, res) => {\n  if (req.url === '/slow') {\n    // This blocks ALL requests for 2 seconds\n    const start = Date.now();\n    while (Date.now() - start < 2000) { /* busy wait */ }\n    res.end('done');\n  } else {\n    res.end('fast');\n  }\n}).listen(3000);\n\n// Test:\n// curl http://localhost:3000/slow &\n// curl http://localhost:3000/fast   ← this also takes ~2s!",
    "bestPractice": "Never run CPU-bound loops in request handlers. Move heavy computation to worker_threads. If the algorithm is inherently synchronous, break it into chunks using `setImmediate` to yield control between iterations: `for (let i = 0; i < N; i += CHUNK) { processChunk(i); await new Promise(r => setImmediate(r)); }`. Monitor event loop lag with `perf_hooks.monitorEventLoopDelay()` and alert on values over 10 ms.",
    "source": "Node.js Docs — Don't Block the Event Loop"
  },
  {
    "id": "a07",
    "topic": "Back-pressure",
    "question": "O que é contrapressão (back-pressure) em streams do Node.js e qual o papel do `highWaterMark`?",
    "code": null,
    "options": [
      "Back-pressure é limite de HTTP; `highWaterMark` define o teto de RPS",
      "Back-pressure indica buffer cheio; `highWaterMark` define limite do write",
      "Back-pressure indica pausa de GC; `highWaterMark` ativa compactação de heap",
      "Back-pressure não é usado em streams; vale apenas para sockets TCP brutos"
    ],
    "correctIndex": 1,
    "explanation": "Quando o buffer interno de uma stream Writable excede o limite em bytes de `highWaterMark`, `write()` retorna `false` (sinal de contrapressão). Os produtores devem pausar até que o evento `drain` seja emitido para evitar crescimento descontrolado de memória.",
    "compiledJS": "const fs = require('fs');\nconst readable = fs.createReadStream('big-file.bin');\nconst writable = fs.createWriteStream('out.bin', { highWaterMark: 64 * 1024 }); // 64 KB\n\n// CORRECT: manual back-pressure handling\nreadable.on('data', chunk => {\n  const canContinue = writable.write(chunk);\n  if (!canContinue) {\n    readable.pause();\n    writable.once('drain', () => readable.resume());\n  }\n});\n\n// EASIER: pipeline handles this automatically\nconst { pipeline } = require('stream');\npipeline(readable, writable, err => {\n  if (err) console.error(err);\n  else console.log('Done');\n});",
    "bestPractice": "Always use `stream.pipeline()` for production stream chains — it manages back-pressure, propagates errors, and destroys all streams on completion or error. If writing custom readable implementations, override `_read()` and only push data when downstream signals it is ready. Never ignore a `false` return value from `write()`.",
    "source": "Node.js Docs — Streams: Backpressuring in Streams"
  },
  {
    "id": "a08",
    "topic": "N-API",
    "question": "Qual é a principal vantagem da N-API (agora Node-API) sobre as interfaces anteriores de addons nativos?",
    "code": null,
    "options": [
      "Permite desenvolver addons nativos em Python no lugar de código em C/C++",
      "Oferece estabilidade de ABI para não recompilar addons a cada versão do Node",
      "Dá acesso direto a ponteiros de memória interna do motor V8 do processo",
      "Paraleliza automaticamente rotinas do addon entre todos os núcleos de CPU"
    ],
    "correctIndex": 1,
    "explanation": "A N-API expõe uma camada de ABI estável que abstrai aspectos internos da V8, o que significa que um addon nativo compilado uma única vez funciona entre versões principais do Node.js sem necessidade de recompilação.",
    "compiledJS": "// binding.gyp — N-API addon descriptor\n// {\n//   \"targets\": [{\n//     \"target_name\": \"myaddon\",\n//     \"sources\": [\"src/addon.c\"],\n//     \"defines\": [\"NAPI_VERSION=8\"]\n//   }]\n// }\n\n// Node.js consumer:\nconst addon = require('./build/Release/myaddon');\n// Works on Node 14, 16, 18, 20, 22 without recompile\n// as long as NAPI_VERSION ≤ runtime's supported N-API version\n\nconsole.log(process.versions.napi); // e.g. \"8\"",
    "bestPractice": "When publishing npm packages with native addons, ship precompiled binaries for all supported Node versions and platforms using `node-pre-gyp` or `prebuildify`. Set `\"napi_versions\": [8]` in binding.gyp so the addon declares its minimum N-API version. Include a fallback compile-from-source step for unsupported platforms.",
    "source": "Node.js Docs — Node-API (N-API)"
  },
  {
    "id": "a09",
    "topic": "Hidden Classes",
    "question": "Como as classes ocultas da V8 ('hidden classes', também chamadas de 'shapes' ou 'maps') melhoram o desempenho de objetos JavaScript?",
    "code": null,
    "options": [
      "Comprimem chaves de objetos na memória usando dicionários compartilhados",
      "Permitem ao V8 gerar código otimizado rastreando o layout das propriedades",
      "Ocultam membros privados de classes da fase de marcação do garbage collector",
      "Alocam previamente páginas fixas de memória na heap por função construtora"
    ],
    "correctIndex": 1,
    "explanation": "A V8 associa uma classe oculta (shape/map) a cada objeto com base na estrutura de suas propriedades; objetos que compartilham a mesma forma podem reutilizar inline caches compilados via JIT, permitindo acesso veloz às propriedades.",
    "compiledJS": "// GOOD: both objects share the same hidden class\nclass Point {\n  constructor(x, y) {\n    this.x = x; // always set in same order\n    this.y = y;\n  }\n}\nconst a = new Point(1, 2);\nconst b = new Point(3, 4);\n// a and b have identical hidden class → monomorphic IC → FAST\n\n// BAD: different property addition order → different hidden classes\nconst c = {}; c.x = 1; c.y = 2; // hidden class: {x, y}\nconst d = {}; d.y = 2; d.x = 1; // hidden class: {y, x} — DIFFERENT!\n// Accessing c.x and d.x goes through different ICs → slower",
    "bestPractice": "Always initialise all object properties in the constructor in a consistent order. Avoid adding or deleting properties after object creation in hot paths. Never use `delete obj.prop` — it degrades the hidden class. Use TypeScript classes or factory functions with a fixed property shape to guarantee monomorphic access patterns.",
    "source": "V8 Blog — What's up with monomorphism?"
  },
  {
    "id": "a10",
    "topic": "PM2",
    "question": "Ao utilizar o PM2 para obter reinicializações sem tempo de inatividade (`pm2 reload`), qual mecanismo o PM2 emprega?",
    "code": null,
    "options": [
      "Pausa balanceadores, reinicia todos os nós juntos e então reabre o tráfego",
      "Cria um novo worker, aguarda sinal de pronto, move tráfego e encerra o antigo",
      "Aplica patches no binário em memória sem precisar criar novos subprocessos",
      "Depende de swaps de memória no kernel do SO para trocar o código em execução"
    ],
    "correctIndex": 1,
    "explanation": "O reload do PM2 realiza uma reinicialização progressiva (rolling restart): cria um novo worker, aguarda que ele envie `process.send('ready')`, direciona o tráfego para ele e encerra o worker antigo de forma suave, garantindo zero indisponibilidade.",
    "compiledJS": "// server.js — signal PM2 when server is ready\nconst http = require('http');\n\nconst server = http.createServer((req, res) => {\n  res.end(`Hello from PID ${process.pid}\\n`);\n});\n\nserver.listen(3000, () => {\n  console.log(`Worker ${process.pid} ready`);\n  if (process.send) process.send('ready'); // ← tells PM2 \"I am up\"\n});\n\n// Graceful shutdown on SIGTERM:\nprocess.on('SIGTERM', () => {\n  server.close(() => {\n    console.log(`Worker ${process.pid} closed`);\n    process.exit(0);\n  });\n});\n\n// pm2 start server.js -i max --wait-ready\n// pm2 reload server  ← zero-downtime rolling restart",
    "bestPractice": "Always implement graceful shutdown: on SIGTERM, stop accepting new connections (`server.close()`), finish in-flight requests, close database pools, then call `process.exit(0)`. Set `kill_timeout` in your PM2 ecosystem config to give workers enough time to drain before PM2 force-kills them. Test your graceful shutdown path in staging — it is often broken by connection pooling libraries that do not emit a close event.",
    "source": "PM2 Docs — Graceful Shutdown & Zero Downtime Reload"
  }
]
