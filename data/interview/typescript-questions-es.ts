import type { InterviewQuestion } from '@/lib/interviewTypes'

export const TYPESCRIPT_QUESTIONS_ES: InterviewQuestion[] = [
  // ── Beginner ───────────────────────────────────────────────────────────────
  {
    id: 'b01',
    topic: 'Inferencia de Tipos',
    question: '¿Qué tipo infiere TypeScript para `x` en `const x = 42`?',
    code: 'const x = 42;\n// hover: const x: 42',
    options: ['number', 'any', '42', 'unknown'],
    correctIndex: 2,
    explanation:
      'TypeScript infiere el tipo literal `42` — y no `number` — porque las variables declaradas con `const` no pueden reasignarse. El compilador acota el tipo al valor exacto. Si hubieras escrito `let x = 42`, TypeScript ensancharía el tipo a `number`, ya que su valor podría cambiar más adelante.',
    compiledJS: 'const x = 42;\n// Idéntico — las anotaciones de tipos se borran por completo',
    bestPractice:
      'Prefiere `const` sobre `let` para valores que no cambian. Obtienes inferencia de tipo literal gratis, lo cual alimenta uniones discriminadas y patrones a nivel de tipos.',
    source: 'TypeScript Handbook — Type Inference',
  },
  {
    id: 'b02',
    topic: '`any` vs `unknown`',
    question: '¿Qué sucede cuando invocas `.toUpperCase()` en un valor tipado como `unknown`?',
    code: 'let val: unknown = "hello";\nval.toUpperCase(); // ???',
    options: [
      'Compila bien — unknown se comporta igual que any',
      "Error de TypeScript: Object is of type 'unknown'",
      'Compila bien — los métodos de string funcionan en unknown',
      'Solo TypeError en tiempo de ejecución — no hay error de compilación',
    ],
    correctIndex: 1,
    explanation:
      '`unknown` es la contraparte segura de `any`. Antes de llamar a cualquier método sobre un valor `unknown`, debes acotar su tipo con `typeof`, `instanceof` o un predicado de tipo. `any` elude todas las comprobaciones, por lo que es inseguro.',
    compiledJS: null,
    bestPractice:
      'Usa `unknown` en vez de `any` para valores procedentes de fuentes externas — respuestas de API, `JSON.parse` y entradas del usuario. Acota con `typeof`/`instanceof` antes de usar.',
    source: 'TypeScript Handbook — The unknown type',
  },
  {
    id: 'b03',
    topic: '`interface` vs `type`',
    question: '¿Qué característica es exclusiva de `interface` y no está disponible con alias `type`?',
    code: 'interface User { name: string; }\ninterface User { age: number; }\n// Se fusiona en: { name: string; age: number }',
    options: [
      "Extender tipos de objetos existentes usando la palabra `extends`",
      "Declaration merging — declaraciones con mismo nombre se fusionan",
      "Ser referenciado como tipo de parámetro en funciones genéricas",
      "Ser implementado directamente por clases ES6 en código de la app"
    ],
    correctIndex: 1,
    explanation:
      'La fusión de declaraciones (Declaration Merging) permite que múltiples declaraciones de `interface` con el mismo nombre se combinen de forma automática. Los alias `type` no pueden redeclararse en el mismo ámbito.',
    compiledJS: null,
    bestPractice:
      'Usa `interface` para contratos de APIs públicas y formas de objetos donde los consumidores puedan necesitar extender la interfaz. Usa `type` para uniones, intersecciones y tipos mapeados.',
    source: 'TypeScript Handbook — Interfaces vs Type Aliases',
  },
  {
    id: 'b04',
    topic: 'Propiedades Opcionales `?`',
    question: '¿Cuál es el tipo inferido de `config.timeout` en el fragmento siguiente?',
    code: 'interface Config { timeout?: number; }\nconst config: Config = {};\n// config.timeout es ???',
    options: ['number', 'number | undefined', 'number | null', 'undefined'],
    correctIndex: 1,
    explanation:
      'El modificador `?` hace que una propiedad sea opcional, indicando que puede estar presente (tipo `number`) o ausente (`undefined`). TypeScript representa esto internamente como `number | undefined`.',
    compiledJS: 'const config = {};\n// El ? se borra — no hay cambio en runtime',
    bestPractice:
      'Prefiere `timeout?: number` sobre `timeout: number | undefined`. Ambos son equivalentes, pero la sintaxis opcional permite omitir la clave por completo al instanciar el objeto.',
    source: 'TypeScript Handbook — Optional Properties',
  },
  {
    id: 'b05',
    topic: 'Tipos de Unión `|`',
    question: '¿Qué debes hacer antes de llamar a `.toUpperCase()` en un valor `string | number`?',
    code: 'function format(val: string | number) {\n  return val.toUpperCase(); // Error!\n}',
    options: [
      'Nada — TypeScript lo gestiona automáticamente',
      'Una aserción de tipo: `(val as string).toUpperCase()`',
      'Una guarda de tipo: `if (typeof val === "string")`',
      'Convertir val a `any` primero',
    ],
    correctIndex: 2,
    explanation:
      'TypeScript exige un estrechamiento (narrowing) antes de poder invocar métodos específicos de una rama de la unión. La guarda `typeof val === "string"` verifica el tipo en tiempo de ejecución.',
    compiledJS:
      'function format(val) {\n  if (typeof val === "string") return val.toUpperCase();\n  // ...\n}',
    bestPractice:
      'Estrecha siempre las uniones con guardas de tipo (`typeof`, `instanceof`, `in`) en lugar de forzar con casts `as`. Las aserciones ocultan errores; las guardas los previenen.',
    source: 'TypeScript Handbook — Narrowing',
  },
  {
    id: 'b06',
    topic: 'Modificador `readonly`',
    question: '¿Qué ocurre en tiempo de ejecución si intentas reasignar una propiedad `readonly`?',
    code: 'interface Point { readonly x: number; }\nconst p: Point = { x: 10 };\np.x = 20; // ???',
    options: [
      'Lanza un TypeError en tiempo de ejecución',
      'Se ignora silenciosamente en tiempo de ejecución',
      'Solo error de compilación en TypeScript — no hay efecto en runtime',
      'Tanto error de compilación como TypeError en runtime',
    ],
    correctIndex: 2,
    explanation:
      '`readonly` es puramente una garantía en tiempo de compilación. No genera código JavaScript para congelar el objeto (como `Object.freeze`), por lo que en tiempo de ejecución la propiedad se reasigna sin error.',
    compiledJS: 'const p = { x: 10 };\np.x = 20; // Se ejecuta normalmente en JavaScript',
    bestPractice:
      'Recuerda que `readonly` solo protege en compilación. Si necesitas inmutabilidad real en tiempo de ejecución, aplica `Object.freeze(obj)`.',
    source: 'TypeScript Handbook — Readonly Properties',
  },
  {
    id: 'b07',
    topic: 'Enums Numéricos vs String',
    question: '¿Cómo se ve el JavaScript compilado para un enum numérico?',
    code: 'enum Direction {\n  Up,\n  Down,\n}',
    options: [
      'Un objeto simple: `{ Up: 0, Down: 1 }`',
      'Un mapeo bidireccional: `{ Up: 0, Down: 1, 0: "Up", 1: "Down" }`',
      'Se borra por completo — solo números insertados directamente',
      'Una clase con propiedades estáticas',
    ],
    correctIndex: 1,
    explanation:
      'Los enums numéricos generan un mapeo bidireccional en tiempo de ejecución en el código compilado, permitiendo obtener el nombre a partir del número y viceversa.',
    compiledJS:
      'var Direction;\n(function (Direction) {\n  Direction[Direction["Up"] = 0] = "Up";\n  Direction[Direction["Down"] = 1] = "Down";\n})(Direction || (Direction = {}));',
    bestPractice:
      'Prefiere objetos `as const` o uniones de strings literais (`type Direction = "up" | "down"`) frente a enums para generar código más predecible y liviano.',
    source: 'TypeScript Handbook — Enums',
  },
  {
    id: 'b08',
    topic: 'Tipos Tupla',
    question: '¿Qué sucede al acceder al índice `2` en una tupla tipada como `[string, number]`?',
    code: 'const pair: [string, number] = ["score", 100];\nconst val = pair[2]; // ???',
    options: [
      "undefined — siguiendo el comportamiento dinámico de arrays en JS",
      "string | number — TypeScript amplía el tipo a la unión de ítems",
      "any — accesos fuera de rango caen en el tipo dinámico any del motor",
      "Error de compilación — el índice 2 está fuera de límites de la tupla"
    ],
    correctIndex: 1,
    explanation:
      'Las tuplas en TypeScript tienen una longitud fija y tipos conocidos por posición. Intentar acceder a un índice fuera del rango declarado produce un error inmediato del compilador.',
    compiledJS: 'const pair = ["score", 100];\nconst val = pair[2]; // JS retorna undefined',
    bestPractice:
      'Usa tuplas para devolver pares o ternas de valores con significado posicional explícito (como en hooks tipo `useState`).',
    source: 'TypeScript Handbook — Tuple Types',
  },
  {
    id: 'b09',
    topic: 'Tipo `never`',
    question: '¿Cuál es el propósito de `assertExhaustive` en el patrón siguiente?',
    code: 'function assertExhaustive(x: never): never {\n  throw new Error("Caso no manejado: " + JSON.stringify(x));\n}',
    options: [
      "Provee un objeto fallback en tiempo de ejecución para evitar que JavaScript lance excepciones ante datos inesperados",
      "Estrecha el tipo en la rama default a `never`, generando error de compilación si se omite algún caso de la unión",
      "Convierte el tipo de la unión de forma dinámica a `any` en el default, permitiendo leer propiedades arbitrarias",
      "Opera como comentario decorativo para programadores, ya que el compilador asegura que el default nunca se ejecuta"
    ],
    correctIndex: 1,
    explanation:
      'En un switch exhaustivo, cuando todas las ramas válidas de una unión han sido comprobadas, el tipo restante en `default` es `never`. Si en el futuro se añade una nueva variante a la unión, TypeScript marcará error.',
    compiledJS:
      'function assertExhaustive(x) {\n  throw new Error("Caso no manejado: " + JSON.stringify(x));\n}',
    bestPractice:
      'Aplica siempre comprobaciones exhaustivas con `never` en ramas `default`. Evita errores silenciosos al evolucionar tipos de unión en el código.',
    source: 'TypeScript Handbook — Exhaustiveness checking',
  },
  {
    id: 'b10',
    topic: 'Aserción de Tipo `as`',
    question: '¿La palabra clave `as` realiza alguna comprobación o conversión en tiempo de ejecución?',
    code: 'const val = ("123" as unknown) as number;\ntypeof val; // ???',
    options: [
      'Sí — convierte el string a número en runtime',
      'Sí — lanza un error si la conversión no es posible',
      'No — las aserciones de tipo se eliminan por completo en el JS compilado',
      'Sí — valida la estructura en tiempo de ejecución',
    ],
    correctIndex: 2,
    explanation:
      'Las aserciones de tipo con `as` son instrucciones exclusivas para el compilador. Se eliminan completamente durante la compilación; en tiempo de ejecución `typeof val` sigue siendo `"string"`.',
    compiledJS: 'const val = "123";\ntypeof val; // "string" en runtime!',
    bestPractice:
      'No uses `as` para eludir advertencias de tipo. Valida datos externos en runtime (con Zod u otras librerías) antes de asumir su estructura.',
    source: 'TypeScript Handbook — Type Assertions',
  },

  // ── Intermediate ───────────────────────────────────────────────────────────
  {
    id: 'i01',
    topic: 'Generics',
    question: '¿Cuál es el tipo inferido de `result` en la llamada siguiente?',
    code: 'function first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\nconst result = first([1, "two", 3]);',
    options: ['number', 'string', 'number | string', '(number | string)[]'],
    correctIndex: 2,
    explanation:
      'TypeScript infiere el parámetro genérico `T` a partir de los elementos del array `[1, "two", 3]`, obteniendo la unión `number | string`. La función retorna `T | undefined`, por lo que el tipo es `number | string | undefined` (o `number | string`).',
    compiledJS: 'function first(arr) {\n  return arr[0];\n}\nconst result = first([1, "two", 3]);',
    bestPractice:
      'Permite que TypeScript infiera los tipos genéricos automáticamente siempre que sea factible, evitando anotaciones redundantes.',
    source: 'TypeScript Handbook — Generics',
  },
  {
    id: 'i02',
    topic: '`keyof T` + Acceso Indexado `T[K]`',
    question: '¿Cuál es el tipo de retorno de `getProp(obj, key)` en la llamada siguiente?',
    code: 'function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\nconst user = { id: 1, name: "Alice" };\nconst val = getProp(user, "name");',
    options: [
      "El tipo primitivo `any`",
      "El tipo de tope `unknown`",
      "El tipo indexado `number`",
      "El tipo de unión `keyof T`"
    ],
    correctIndex: 1,
    explanation:
      '`keyof T` genera la unión `"id" | "name"`. Al suministrar `"name"`, `K` queda acotado a `"name"`. El tipo de retorno `T[K]` resuelve a `user["name"]`, que es `string`.',
    compiledJS: 'function getProp(obj, key) {\n  return obj[key];\n}\nconst val = getProp(user, "name");',
    bestPractice:
      'Combina `keyof T` con `T[K]` para crear funciones de acceso a propiedades seguras frente a fallos tipográficos.',
    source: 'TypeScript Handbook — Indexed Access Types',
  },
  {
    id: 'i03',
    topic: 'Tipos Mapeados',
    question: '¿Cómo se expande `Readonly<T>` para el tipo `{ name: string; age: number }`?',
    code: 'type Readonly<T> = {\n  readonly [P in keyof T]: T[P];\n};',
    options: [
      '{ name: string; age: number }',
      '{ readonly name: string; readonly age: number }',
      '{ readonly [key: string]: any }',
      'Array<{ key: string; value: any }>',
    ],
    correctIndex: 1,
    explanation:
      'Los tipos mapeados iteran sobre las claves de `keyof T` con `[P in keyof T]`. El modificador `readonly` antepuesto hace que cada propiedad sea inmutable a nivel de tipos.',
    compiledJS: null,
    bestPractice:
      'Dominar tipos mapeados permite entender cómo se implementan utilidades esenciales como `Partial<T>`, `Required<T>`, `Readonly<T>` y `Record<K, V>`.',
    source: 'TypeScript Handbook — Mapped Types',
  },
  {
    id: 'i04',
    topic: 'Predicados de Tipo',
    question: '¿Qué efecto tiene la anotación de retorno `val is string` en el punto de llamada?',
    code: 'function isString(val: unknown): val is string {\n  return typeof val === "string";\n}\nif (isString(input)) {\n  input.toUpperCase(); // ¿qué tipo tiene input aquí?\n}',
    options: [
      'Genera validación en runtime para convertir input en string',
      'Informa al compilador de que en la rama verdadera el tipo de input se estrecha a string',
      'Solo documenta el código sin alterar la comprobación de tipos',
      'Fuerza a input a ser string incluso en la rama else',
    ],
    correctIndex: 1,
    explanation:
      'Un predicado de tipo (`param is Type`) convierte una función booleana en una guarda de tipo personalizada. Cuando retorna `true`, TypeScript acota el tipo del argumento en ese bloque.',
    compiledJS: 'function isString(val) {\n  return typeof val === "string";\n}',
    bestPractice:
      'Utiliza predicados de tipo para encapsular lógica de comprobación reutilizable manteniendo una estrecha seguridad en compilación.',
    source: 'TypeScript Handbook — Using type predicates',
  },
  {
    id: 'i05',
    topic: 'Uniones Discriminadas',
    question: '¿Qué propiedad permite a TypeScript distinguir con precisión las variantes en el switch siguiente?',
    code: 'type Shape =\n  | { kind: "circle"; radius: number }\n  | { kind: "square"; size: number };\n\nfunction area(s: Shape) {\n  switch (s.kind) {\n    case "circle": return Math.PI * s.radius ** 2;\n    case "square": return s.size ** 2;\n  }\n}',
    options: [
      'La presencia de propiedades numéricas',
      'La propiedad común `kind` con tipos literales distintos en cada variante',
      'La sentencia switch-case',
      'El uso del operador pipe `|`',
    ],
    correctIndex: 1,
    explanation:
      'Una unión discriminada contiene una propiedad compartida (el discriminante) con un tipo literal exclusivo en cada miembro. El compilador usa esta propiedad en estructuras condicionales para acotar la variante.',
    compiledJS: 'function area(s) {\n  switch (s.kind) {\n    case "circle": return Math.PI * s.radius ** 2;\n    case "square": return s.size ** 2;\n  }\n}',
    bestPractice:
      'Modela estados de carga, respuestas de red y eventos mediante uniones discriminadas (ej: `{ status: "idle" } | { status: "success", data } | { status: "error", error }`).',
    source: 'TypeScript Handbook — Discriminated Unions',
  },
  {
    id: 'i06',
    topic: 'Template Literal Types',
    question: '¿Qué tipo produce TypeScript para `EventName` en el código siguiente?',
    code: 'type Action = "create" | "update";\ntype Entity = "User" | "Post";\ntype EventName = `on${Action}${Entity}`;',
    options: [
      'string',
      '"onActionEntity"',
      '"onCreateUser" | "onCreatePost" | "onUpdateUser" | "onUpdatePost"',
      'Array<string>',
    ],
    correctIndex: 2,
    explanation:
      'Los template literal types calculan el producto cartesiano de las uniones interpoladas. Al haber 2 acciones y 2 entidades, el resultado son las 4 combinaciones posibles de cadenas literales.',
    compiledJS: null,
    bestPractice:
      'Los template literal types son ideales para tipar enrutamiento de eventos, clases CSS compuestas y rutas anidadas con total seguridad.',
    source: 'TypeScript Handbook — Template Literal Types',
  },
  {
    id: 'i07',
    topic: '`Extract` y `Exclude`',
    question: '¿A qué tipo evalúa la expresión `Extract<"a" | "b" | "c", "a" | "c">`?',
    code: 'type T = Extract<"a" | "b" | "c", "a" | "c">;',
    options: ['"b"', '"a" | "c"', '"a" | "b" | "c"', 'never'],
    correctIndex: 1,
    explanation:
      '`Extract<T, U>` extrae de `T` los miembros asignables a `U`. Por ende, `"a" | "c"` se mantienen. Por contraposición, `Exclude<T, U>` elimina las variantes coincidentes.',
    compiledJS: null,
    bestPractice:
      'Aplica `Extract` para filtrar variantes permitidas y `Exclude` para sustraer valores nulos o tipos indeseados.',
    source: 'TypeScript Handbook — Utility Types',
  },
  {
    id: 'i08',
    topic: 'Firmas de Índice',
    question: '¿Por qué la interfaz siguiente genera un error en TypeScript?',
    code: 'interface Mixed {\n  [key: string]: number;\n  name: string; // Error!\n}',
    options: [
      "Firmas de índice y propiedades con nombre no pueden coexistir nunca",
      "`name: string` entra en conflicto con el tipo `number` de la firma",
      "Firmas de índice exigen claves numéricas, rechazando tipos string",
      "Propiedades con nombre deben preceder a la firma en el tipo objeto"
    ],
    correctIndex: 1,
    explanation:
      'Una firma de índice `[key: string]: number` declara que cualquier clave string puede retornar `number`. TypeScript exige que todas las propiedades con nombre respeten ese tipo de retorno.',
    compiledJS: null,
    bestPractice:
      'Si necesitas campos fijos con tipos heterogéneos junto a un diccionario arbitrario, usa una propiedad anidada (ej: `{ name: string; metadata: Record<string, number> }`).',
    source: 'TypeScript Handbook — Index Signatures',
  },
  {
    id: 'i09',
    topic: '`ReturnType` y `Parameters`',
    question: '¿Por qué es obligatorio usar `typeof myFn` en `ReturnType<typeof myFn>`?',
    code: 'function myFn() { return { count: 42 }; }\ntype MyReturn = ReturnType<typeof myFn>;',
    options: [
      "Es sintaxis obsoleta; `ReturnType<myFn>` opera de forma idéntica hoy",
      "Obtiene metadatos de tiempo de ejecución de myFn para inspección",
      "Eleva el valor `myFn` al espacio de tipos exigido por `ReturnType<T>`",
      "Fuerza al compilador a resolver firmas sobrecargadas en la última"
    ],
    correctIndex: 1,
    explanation:
      '`ReturnType<T>` espera como argumento un tipo de función. `myFn` es un identificador de valor de tiempo de ejecución. El operador `typeof myFn` extrae su firma de tipo.',
    compiledJS: null,
    bestPractice:
      'Usa `ReturnType<typeof fn>` para evitar duplicar definiciones de tipos de retorno complejos que ya están representados en las funciones.',
    source: 'TypeScript Handbook — typeof Type Operator',
  },
  {
    id: 'i10',
    topic: 'Tipos de Intersección `&`',
    question: '¿Qué restricción impone el tipo de intersección `A & B` a un valor?',
    code: 'interface HasId { id: string; }\ninterface HasTimestamp { createdAt: Date; }\ntype Entity = HasId & HasTimestamp;',
    options: [
      "{ name: string } | { age: number } — cumplir cualquiera de ellos es válido",
      "{ name: string } & { age: number } — el valor debe satisfacer ambas formas",
      "{ name: string; age?: number } — propiedades de B se vuelven opcionales",
      "any — intersecciones de formas distintas de objeto se reducen a any"
    ],
    correctIndex: 1,
    explanation:
      'Una intersección (`&`) fusiona múltiples tipos. Cualquier objeto de tipo `Entity` debe incluir necesariamente tanto `id: string` como `createdAt: Date`.',
    compiledJS: null,
    bestPractice:
      'Aplica intersecciones para componer modelos de datos modulares (añadiendo identificadores, marcas temporales o estados de paginación).',
    source: 'TypeScript Handbook — Intersection Types',
  },

  // ── Advanced ───────────────────────────────────────────────────────────────
  {
    id: 'a01',
    topic: 'Tipos Condicionales',
    question: '¿A qué tipo evalúa `NonNullable<string | null | undefined>`?',
    code: 'type NonNullable<T> = T extends null | undefined ? never : T;\ntype Clean = NonNullable<string | null | undefined>;',
    options: ['string | null', 'string', 'never', 'unknown'],
    correctIndex: 1,
    explanation:
      'Los tipos condicionales son distributivos sobre uniones desnudas. Cada miembro se evalúa individualmente: `string` produce `string`, `null` produce `never` y `undefined` produce `never`. La unión resultante simplifica a `string`.',
    compiledJS: null,
    bestPractice:
      'Recuerda que encapsular en tupla `[T]` desactiva la distributividad cuando necesites evaluar una unión como un bloque indivisible.',
    source: 'TypeScript Handbook — Conditional Types',
  },
  {
    id: 'a02',
    topic: 'Palabra clave `infer`',
    question: '¿Qué captura `infer R` en `UnpackPromise<Promise<string>>`?',
    code: 'type UnpackPromise<T> = T extends Promise<infer R> ? R : T;\ntype Result = UnpackPromise<Promise<string>>;',
    options: [
      'El tipo del constructor de Promise',
      'El tipo resuelto contenido en la Promise (`string`)',
      'Un valor booleano que indica si es una Promise',
      'any',
    ],
    correctIndex: 1,
    explanation:
      '`infer` declara una variable de tipo dentro de la cláusula condicional. El compilador deduce y captura el tipo genérico con el que la Promise fue instanciada.',
    compiledJS: null,
    bestPractice:
      'Emplea `infer` para desenvolver tipos en estructuras anidadas, como respuestas asíncronas, arrays y argumentos de funciones.',
    source: 'TypeScript Handbook — Inferring Within Conditional Types',
  },
  {
    id: 'a03',
    topic: 'Operador `satisfies` (TS 4.9+)',
    question: '¿Qué ventaja tiene `satisfies` frente a una anotación de tipo ordinaria?',
    code: 'const palette = {\n  red: [255, 0, 0],\n  green: "#00ff00",\n} satisfies Record<string, string | number[]>;\n\npalette.red.map(v => v); // Válido!\npalette.green.toUpperCase(); // Válido!',
    options: [
      "Valida y exige contratos de tipado en runtime en el navegador, lanzando excepciones si faltan campos obligatorios",
      "Valida el valor contra el tipo conservando el tipo literal inferido más específico, asegurando autocomplete exacto",
      "Congela el objeto de forma recursiva en la compilación, volviendo todas sus propiedades de solo lectura en runtime",
      "Opera de forma absolutamente idéntica a una anotación de tipo con dos puntos (`:`), siendo mera variación estética"
    ],
    correctIndex: 1,
    explanation:
      'Una anotación directa ensancha todas las propiedades a `string | number[]`, impidiendo llamar a `.map` en `red`. `satisfies` valida la estructura pero retiene el tipo literal exacto de cada miembro.',
    compiledJS: 'const palette = {\n  red: [255, 0, 0],\n  green: "#00ff00",\n}; // satisfies se borra',
    bestPractice:
      'Prefiere `satisfies` para configuraciones, paletas y esquemas donde quieras verificar validez sin perder la precisión de los literales.',
    source: 'TypeScript 4.9 Release Notes — satisfies',
  },
  {
    id: 'a04',
    topic: 'Parámetros de Tipo `const` (TS 5.0+)',
    question: '¿Qué tipo infiere TypeScript para `arr` en la llamada con modificador `const` en el generic?',
    code: 'function asConst<const T>(val: T): T {\n  return val;\n}\nconst result = asConst(["admin", "user"]);',
    options: [
      '["admin", "user"]',
      'readonly ["admin", "user"]',
      '["admin" | "user"]',
      'Array<"admin" | "user">',
    ],
    correctIndex: 1,
    explanation:
      'Introducidos en TypeScript 5.0, los parámetros de tipo marcados con `const` hacen que el compilador infiera el argumento como si se hubiera usado `as const`, conservando tuplas y cadenas literales.',
    compiledJS: 'function asConst(val) {\n  return val;\n}\nconst result = asConst(["admin", "user"]);',
    bestPractice:
      'Usa parámetros de tipo `const` en librerías y utilitarios para que los usuarios no tengan que añadir `as const` en cada invocación.',
    source: 'TypeScript 5.0 Release Notes — const Type Parameters',
  },
  {
    id: 'a05',
    topic: 'Condicionales Distributivos vs No Distributivos',
    question: '¿Qué evita envolver los tipos en tuplas `[T] extends [string]` en comparación con `T extends string`?',
    code: 'type ToArrayDistributive<T> = T extends any ? T[] : never;\ntype ToArrayNonDistributive<T> = [T] extends [any] ? T[] : never;\n\ntype D = ToArrayDistributive<string | number>; // string[] | number[]\ntype ND = ToArrayNonDistributive<string | number>; // ???',
    options: [
      'Impide que la comprobación condicional se ejecute',
      'Evita que el condicional se distribuya sobre cada miembro de la unión, evaluándola como una sola unidad',
      'Provoca un fallo de recursión infinita',
      'Convierte todos los miembros a never',
    ],
    correctIndex: 1,
    explanation:
      'Cuando el tipo no está envuelto, TypeScript distribuye la comprobación sobre cada rama de la unión. Al envolver con tuplas `[T] extends [any]`, la distributividad se desactiva y el resultado es `(string | number)[]`.',
    compiledJS: null,
    bestPractice:
      'Envuelve en tuplas `[T]` cuando necesites comprobar si una unión completa es asignable a un tipo o para comprobar si `T` es `never`.',
    source: 'TypeScript Handbook — Distributive Conditional Types',
  },
  {
    id: 'a06',
    topic: 'Tipos Recursivos',
    question: '¿Por qué las definiciones de tipos recursivos requieren un contenedor como array u objeto?',
    code: 'type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };',
    options: [
      "Tipos recursivos están prohibidos en cualquier versión de TypeScript",
      "Auto-referencia directa causa expansión infinita; objetos evalúan lazy",
      "Es convención estética; ambas formas generan tipos idénticos al compilar",
      "Solo `interface` acepta recursión; `type` aliases rechazan auto-llamadas"
    ],
    correctIndex: 1,
    explanation:
      'Un tipo recursivo requiere un punto de indirección (como propiedades de un objeto o elementos de un array) para diferir la resolución. Una autorreferencia directa (`type X = X`) produce un bucle infinito en el compilador.',
    compiledJS: null,
    bestPractice:
      'Modela árboles (ASTs), esquemas JSON y jerarquías organizativas mediante tipos recursivos apoyados en arrays y objetos.',
    source: 'TypeScript Handbook — Recursive Types',
  },
  {
    id: 'a07',
    topic: 'Tuplas Variádicas (TS 4.0+)',
    question: '¿Cuál es el tipo de `Result` en la concatenación de tuplas variádicas siguiente?',
    code: 'type Prepend<T, U extends unknown[]> = [T, ...U];\ntype Result = Prepend<string, [number, boolean]>;',
    options: [
      '[string, [number, boolean]]',
      '[string, number, boolean]',
      '(string | number | boolean)[]',
      '[string, ...any[]]',
    ],
    correctIndex: 1,
    explanation:
      'Las tuplas variádicas permiten que el operador spread `...U` expanda la tupla directamente en la posición indicada, produciendo la tupla aplanada `[string, number, boolean]`.',
    compiledJS: null,
    bestPractice:
      'Usa tuplas variádicas para tipar funciones de composición (`pipe`, `compose`) preservando el orden exacto de los argumentos.',
    source: 'TypeScript 4.0 Release Notes — Variadic Tuple Types',
  },
  {
    id: 'a08',
    topic: 'Module Augmentation',
    question: '¿Qué consigue la declaración de module augmentation siguiente sin alterar `node_modules`?',
    code: 'declare module "express-session" {\n  interface SessionData {\n    userId: string;\n  }\n}',
    options: [
      "Crea un módulo sustituto que enmascara el paquete express original",
      "Extiende la interfaz Request de Express con `user` sin tocar archivos",
      "Convierte la interfaz Request de Express dinámicamente en una clase ES6",
      "Opera solo si se reexporta de forma explícita todo el paquete express"
    ],
    correctIndex: 1,
    explanation:
      'Module Augmentation permite extender tipos de librerías externas. Dado que las interfaces con el mismo nombre se fusionan, `SessionData` pasa a incluir `userId: string`.',
    compiledJS: null,
    bestPractice:
      'Organiza tus declaraciones de module augmentation en archivos dedicados (`src/types/`) e inclúyelos en tu `tsconfig.json`.',
    source: 'TypeScript Handbook — Module Augmentation',
  },
  {
    id: 'a09',
    topic: 'Predicados `asserts`',
    question: '¿En qué se diferencia un predicado `asserts val is string` de uno estándar `val is string`?',
    code: 'function assertIsString(val: unknown): asserts val is string {\n  if (typeof val !== "string") throw new Error("No es un string");\n}\nassertIsString(x);\nx.toUpperCase(); // Válido tras la llamada!',
    options: [
      'Los predicados estándar estrechan el tipo tras la llamada sin requerir if',
      'Los predicados `asserts` lanzan un error si la condición no se cumple y acotan el tipo para el flujo subsiguiente sin requerir `if` en el punto de llamada',
      'Los predicados `asserts` se ejecutan en Web Workers',
      'No existe diferencia técnica entre ambos',
    ],
    correctIndex: 1,
    explanation:
      'Los predicados normales retornan un booleano y obligan a envolver con `if (isString(x))`. Las funciones con `asserts` lanzan excepción si la aserción falla; si retornan con éxito, TypeScript acota el tipo para todo el código subsiguiente.',
    compiledJS:
      'function assertIsString(val) {\n  if (typeof val !== "string") throw new Error("No es un string");\n}',
    bestPractice:
      'Utiliza funciones `asserts` para comprobar invariantes, validar tokens y verificar permisos al inicio de operaciones críticas.',
    source: 'TypeScript Handbook — Assertion Functions',
  },
  {
    id: 'a10',
    topic: '`NoInfer<T>` (TS 5.4+)',
    question: '¿Qué problema soluciona el utilitario `NoInfer<T>` en la firma siguiente?',
    code: 'function createFSM<C extends string>(config: {\n  initial: NoInfer<C>;\n  states: Record<C, StateConfig>;\n}) { ... }\n\ncreateFSM({\n  initial: "stopp", // Error deseado aquí!\n  states: { start: {}, stop: {} }\n});',
    options: [
      "Nada — opera de modo idéntico al uso del parámetro genérico puro `T`",
      "Evita que `fallback` infiera `T`, dando error ante tipos incompatibles",
      "Fuerza al compilador a inferir `T` solo de `fallback` ignorando `init`",
      "Vuelve el argumento `fallback` opcional en la llamada de dicha función"
    ],
    correctIndex: 1,
    explanation:
      'Sin `NoInfer`, TypeScript añadiría `"stopp"` a la unión inferida para `C`, ocultando el error tipográfico. Con `NoInfer<C>`, `C` se deduce exclusivamente de `states` y `"stopp"` se valida contra las claves válidas.',
    compiledJS: null,
    bestPractice:
      'Emplea `NoInfer<T>` cuando un parámetro deba inferirse exclusivamente desde un argumento principal y solo validarse en argumentos secundarios.',
    source: 'TypeScript 5.4 Release Notes — NoInfer Utility Type',
  },
]
