import type { InterviewQuestion } from '@/lib/interviewTypes'

export const TYPESCRIPT_QUESTIONS_PT: InterviewQuestion[] = [
  // ── Beginner ───────────────────────────────────────────────────────────────
  {
    id: 'b01',
    topic: 'Inferência de Tipos',
    question: 'Qual tipo o TypeScript infere para `x` em `const x = 42`?',
    code: 'const x = 42;\n// hover: const x: 42',
    options: ['number', 'any', '42', 'unknown'],
    correctIndex: 2,
    explanation:
      'O TypeScript infere o tipo literal `42` — e não `number` — porque variáveis declaradas com `const` nunca podem ser reatribuídas. O compilador restringe o tipo ao valor exato. Se você tivesse escrito `let x = 42`, o TypeScript alargaria o tipo para `number`, pois o valor poderia ser alterado posteriormente.',
    compiledJS: 'const x = 42;\n// Idêntico — anotações de tipo são completamente apagadas',
    bestPractice:
      'Prefira `const` em vez de `let` para valores imutáveis. Você ganha inferência de tipos literais gratuitamente, o que viabiliza uniões discriminadas e outros padrões avançados do sistema de tipos.',
    source: 'TypeScript Handbook — Type Inference',
  },
  {
    id: 'b02',
    topic: '`any` vs `unknown`',
    question: 'O que acontece quando você chama `.toUpperCase()` em um valor tipado como `unknown`?',
    code: 'let val: unknown = "hello";\nval.toUpperCase(); // ???',
    options: [
      'Compila normalmente — unknown se comporta como any',
      "Erro de compilação: Object is of type 'unknown'",
      'Compila normalmente — métodos de string funcionam em unknown',
      'Apenas TypeError em tempo de execução — sem erro de compilação',
    ],
    correctIndex: 1,
    explanation:
      '`unknown` é a contraparte com segurança de tipo do `any`. Antes de chamar qualquer método em um valor `unknown`, você deve restringir seu tipo usando `typeof`, `instanceof` ou um predicado de tipo. Já o `any` desativa todas as verificações, tornando-se inseguro.',
    compiledJS: null,
    bestPractice:
      'Use `unknown` em vez de `any` para valores externos — respostas de APIs, `JSON.parse` e entradas de usuário. Faça o estreitamento com `typeof`/`instanceof` antes de usar.',
    source: 'TypeScript Handbook — The unknown type',
  },
  {
    id: 'b03',
    topic: '`interface` vs `type`',
    question: 'Qual recurso é exclusivo de `interface` e não está disponível com apelidos `type`?',
    code: 'interface User { name: string; }\ninterface User { age: number; }\n// Resulta em: { name: string; age: number }',
    options: [
      "Estender tipos de objetos existentes usando a palavra `extends`",
      "Declaration merging — declarações com mesmo nome se fundem em um",
      "Ser referenciado como tipo de parâmetro em chamadas genéricas",
      "Ser implementado diretamente por classes ES6 no código do app"
    ],
    correctIndex: 1,
    explanation:
      'A mesclagem de declarações (Declaration Merging) permite que múltiplas declarações de `interface` com o mesmo nome sejam combinadas automaticamente pelo compilador. Tipos definidos via `type` não podem ser declarados mais de uma vez no mesmo escopo.',
    compiledJS: null,
    bestPractice:
      'Use `interface` para contratos de APIs públicas e formatos de objetos que podem ser estendidos por consumidores da biblioteca. Use `type` para uniões, interseções, tuplas e tipos mapeados.',
    source: 'TypeScript Handbook — Interfaces vs Type Aliases',
  },
  {
    id: 'b04',
    topic: 'Propriedades Opcionais `?`',
    question: 'Qual é o tipo inferido de `config.timeout` no trecho abaixo?',
    code: 'interface Config { timeout?: number; }\nconst config: Config = {};\n// config.timeout é ???',
    options: ['number', 'number | undefined', 'number | null', 'undefined'],
    correctIndex: 1,
    explanation:
      'O modificador `?` torna uma propriedade opcional, indicando que ela pode estar presente (com o tipo `number`) ou ausente (com o valor `undefined`). O TypeScript representa isso internamente como `number | undefined`.',
    compiledJS: 'const config = {};\n// O ? é apagado — nenhuma alteração em runtime',
    bestPractice:
      'Prefira `timeout?: number` em vez de `timeout: number | undefined`. As duas opções expressam tipos equivalentes, mas a sintaxe opcional permite omitir a chave no objeto.',
    source: 'TypeScript Handbook — Optional Properties',
  },
  {
    id: 'b05',
    topic: 'Tipos de União `|`',
    question: 'O que você deve fazer antes de invocar `.toUpperCase()` em um valor `string | number`?',
    code: 'function format(val: string | number) {\n  return val.toUpperCase(); // Error!\n}',
    options: [
      'Nada — o TypeScript trata isso automaticamente',
      'Uma asserção de tipo: `(val as string).toUpperCase()`',
      'Uma guarda de tipo: `if (typeof val === "string")`',
      'Converter val para `any` previamente',
    ],
    correctIndex: 2,
    explanation:
      'O TypeScript exige o estreitamento (narrowing) de união antes de acessar métodos específicos de um ramo. A guarda `typeof val === "string"` comprova em tempo de execução que o valor é uma string.',
    compiledJS:
      'function format(val) {\n  if (typeof val === "string") return val.toUpperCase();\n  // ...\n}',
    bestPractice:
      'Sempre utilize guardas de tipo (`typeof`, `instanceof`, `in`) em vez de casts arbitrários com `as`. Guardas garantem segurança em runtime e em tempo de compilação.',
    source: 'TypeScript Handbook — Narrowing',
  },
  {
    id: 'b06',
    topic: 'Modificador `readonly`',
    question: 'O que acontece em tempo de execução quando você tenta reatribuir uma propriedade `readonly`?',
    code: 'interface Point { readonly x: number; }\nconst p: Point = { x: 10 };\np.x = 20; // ???',
    options: [
      'Lança um TypeError em tempo de execução',
      'É ignorado silenciosamente em tempo de execução',
      'Apenas erro de compilação no TypeScript — sem efeito em runtime',
      'Tanto erro de compilação quanto TypeError em runtime',
    ],
    correctIndex: 2,
    explanation:
      '`readonly` é um modificador exclusivo do sistema de tipos do TypeScript. Ele é completamente removido durante a compilação e não gera código JavaScript para congelar o objeto (como `Object.freeze`).',
    compiledJS: 'const p = { x: 10 };\np.x = 20; // Executa normalmente no JavaScript compilado',
    bestPractice:
      'Lembre-se de que `readonly` é uma garantia em tempo de compilação. Se você precisar de imutabilidade garantida em runtime, utilize `Object.freeze(obj)`.',
    source: 'TypeScript Handbook — Readonly Properties',
  },
  {
    id: 'b07',
    topic: 'Enums Numéricos vs String',
    question: 'Como fica o JavaScript compilado para um enum numérico?',
    code: 'enum Direction {\n  Up,\n  Down,\n}',
    options: [
      'Um objeto simples: `{ Up: 0, Down: 1 }`',
      'Um mapeamento bidirecional: `{ Up: 0, Down: 1, 0: "Up", 1: "Down" }`',
      'É completamente apagado — apenas números inline',
      'Uma classe com propriedades estáticas',
    ],
    correctIndex: 1,
    explanation:
      'Enums numéricos geram um mapeamento bidirecional em tempo de execução no JavaScript compilado. Isso permite converter tanto de nome para número quanto de número para nome.',
    compiledJS:
      'var Direction;\n(function (Direction) {\n  Direction[Direction["Up"] = 0] = "Up";\n  Direction[Direction["Down"] = 1] = "Down";\n})(Direction || (Direction = {}));',
    bestPractice:
      'Prefira objetos com `as const` ou uniões de strings literais (`type Direction = "up" | "down"`) em vez de enums, pois são mais previsíveis e geram menos código.',
    source: 'TypeScript Handbook — Enums',
  },
  {
    id: 'b08',
    topic: 'Tipos Tupla',
    question: 'O que acontece ao acessar o índice `2` em uma tupla tipada como `[string, number]`?',
    code: 'const pair: [string, number] = ["score", 100];\nconst val = pair[2]; // ???',
    options: [
      "undefined — seguindo o comportamento dinâmico de arrays em JS",
      "string | number — TypeScript alarga o tipo para união de itens",
      "any — acessos fora do limite caem no tipo dinâmico any do compilador",
      "Erro de compilação — o índice 2 está fora dos limites desta tupla"
    ],
    correctIndex: 1,
    explanation:
      'Tuplas têm comprimento fixo e tipos de elementos definidos por posição. Acessar um índice fora dos limites declarados resulta em erro imediato do compilador TypeScript.',
    compiledJS: 'const pair = ["score", 100];\nconst val = pair[2]; // JavaScript retorna undefined',
    bestPractice:
      'Use tuplas para retornar múltiplos valores de utilitários e hooks (como `useState` do React), onde a posição de cada valor possui significado semântico fixo.',
    source: 'TypeScript Handbook — Tuple Types',
  },
  {
    id: 'b09',
    topic: 'Tipo `never`',
    question: 'Qual é a finalidade da função `assertExhaustive` no padrão abaixo?',
    code: 'function assertExhaustive(x: never): never {\n  throw new Error("Caso não tratado: " + JSON.stringify(x));\n}',
    options: [
      "Provê um objeto fallback em tempo de execução para evitar que o JavaScript lance exceções ao receber dados novos",
      "Estreita o tipo no branch default para `never`, gerando erro de compilação caso algum caso da união seja omitido",
      "Converte o tipo da união dinamicamente para `any` no bloco default, permitindo acessar propriedades arbitrárias",
      "Funciona como comentário decorativo para desenvolvedores, já que o compilador assegura que o default nunca executa"
    ],
    correctIndex: 1,
    explanation:
      'Quando todos os ramos de uma união discriminada são tratados nos `case`s, a variável no ramo `default` tem tipo `never`. Se uma nova opção for adicionada à união no futuro, o TypeScript emitirá um erro informando que o novo tipo não pode ser atribuído a `never`.',
    compiledJS:
      'function assertExhaustive(x) {\n  throw new Error("Caso não tratado: " + JSON.stringify(x));\n}',
    bestPractice:
      'Sempre utilize verificações exaustivas com `never` em switches sobre uniões discriminadas. Isso previne bugs silenciosos quando o modelo de dados evolui.',
    source: 'TypeScript Handbook — Exhaustiveness checking',
  },
  {
    id: 'b10',
    topic: 'Asserção de Tipo `as`',
    question: 'A palavra-chave `as` realiza alguma verificação ou conversão de tipo em tempo de execução?',
    code: 'const val = ("123" as unknown) as number;\ntypeof val; // ???',
    options: [
      'Sim — converte a string para número em runtime',
      'Sim — lança uma exceção se a conversão falhar',
      'Não — asserções de tipo são completamente apagadas no JS compilado',
      'Sim — valida a estrutura do objeto em tempo de execução',
    ],
    correctIndex: 2,
    explanation:
      'Asserções de tipo com `as` são apenas instruções para o compilador e desaparecem totalmente no JavaScript compilado. No código gerado, `typeof val` continua retornando `"string"`.',
    compiledJS: 'const val = "123";\ntypeof val; // "string" em runtime!',
    bestPractice:
      'Evite o uso de `as` para mascarar discrepâncias de tipos. Sempre valide dados desconhecidos em tempo de execução com bibliotecas de validação (como Zod) antes de asserir seu formato.',
    source: 'TypeScript Handbook — Type Assertions',
  },

  // ── Intermediate ───────────────────────────────────────────────────────────
  {
    id: 'i01',
    topic: 'Generics',
    question: 'Qual é o tipo inferido de `result` na chamada abaixo?',
    code: 'function first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\nconst result = first([1, "two", 3]);',
    options: ['number', 'string', 'number | string', '(number | string)[]'],
    correctIndex: 2,
    explanation:
      'O TypeScript infere o parâmetro de tipo `T` a partir dos elementos do array passado `[1, "two", 3]`, resultando no tipo de união `number | string`. A função retorna `T | undefined`, logo o tipo é `number | string | undefined` (ou `number | string`).',
    compiledJS: 'function first(arr) {\n  return arr[0];\n}\nconst result = first([1, "two", 3]);',
    bestPractice:
      'Deixe o TypeScript inferir os parâmetros de tipo de generics sempre que possível, evitando anotações explícitas desnecessárias como `first<number | string>(...)`.',
    source: 'TypeScript Handbook — Generics',
  },
  {
    id: 'i02',
    topic: '`keyof T` + Acesso Indexado `T[K]`',
    question: 'Qual é o tipo de retorno de `getProp(obj, key)` na chamada abaixo?',
    code: 'function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\nconst user = { id: 1, name: "Alice" };\nconst val = getProp(user, "name");',
    options: [
      "O tipo primitivo `any`",
      "O tipo de topo `unknown`",
      "O tipo indexado `number`",
      "O tipo de união `keyof T`"
    ],
    correctIndex: 1,
    explanation:
      '`keyof T` produz a união das chaves `"id" | "name"`. Ao passar `"name"`, `K` é restrito a `"name"`. O tipo de retorno `T[K]` resolve para o tipo da propriedade indexada: `(typeof user)["name"]`, que é exatamente `string`.',
    compiledJS: 'function getProp(obj, key) {\n  return obj[key];\n}\nconst val = getProp(user, "name");',
    bestPractice:
      'Combine `keyof T` com tipos de acesso indexado `T[K]` para criar utilitários de acesso a propriedades totalmente tipados e seguros contra erros de digitação.',
    source: 'TypeScript Handbook — Indexed Access Types',
  },
  {
    id: 'i03',
    topic: 'Tipos Mapeados',
    question: 'Como fica a expansão de `Readonly<T>` para o tipo `{ name: string; age: number }`?',
    code: 'type Readonly<T> = {\n  readonly [P in keyof T]: T[P];\n};',
    options: [
      '{ name: string; age: number }',
      '{ readonly name: string; readonly age: number }',
      '{ readonly [key: string]: any }',
      'Array<{ key: string; value: any }>',
    ],
    correctIndex: 1,
    explanation:
      'Tipos mapeados iteram sobre cada chave de `keyof T` usando a sintaxe `[P in keyof T]`. O modificador `readonly` adiciona o modificador de somente leitura a cada propriedade individualmente.',
    compiledJS: null,
    bestPractice:
      'Compreender tipos mapeados é a chave para dominar utilitários nativos como `Partial<T>`, `Required<T>`, `Readonly<T>` e `Record<K, V>`.',
    source: 'TypeScript Handbook — Mapped Types',
  },
  {
    id: 'i04',
    topic: 'Predicados de Tipo',
    question: 'O que a anotação de retorno `val is string` faz no ponto de chamada da função?',
    code: 'function isString(val: unknown): val is string {\n  return typeof val === "string";\n}\nif (isString(input)) {\n  input.toUpperCase(); // input tem que tipo aqui?\n}',
    options: [
      'Gera validação em runtime para converter input em string',
      'Informa ao compilador que, no bloco verdadeiro, o tipo de input é estreitado para string',
      'Apenas documenta a intenção sem alterar a checagem de tipos',
      'Força input a ser string mesmo no bloco else',
    ],
    correctIndex: 1,
    explanation:
      'Um predicado de tipo (`param is Type`) transforma uma função booleana em uma guarda de tipo customizada. Quando a função retorna `true`, o compilador estreita o tipo do argumento para o tipo especificado.',
    compiledJS: 'function isString(val) {\n  return typeof val === "string";\n}',
    bestPractice:
      'Utilize funções com predicados de tipo para isolar lógicas complexas de validação de dados em runtime sem perder a segurança em tempo de compilação.',
    source: 'TypeScript Handbook — Using type predicates',
  },
  {
    id: 'i05',
    topic: 'Uniões Discriminadas',
    question: 'Qual propriedade habilita o TypeScript a diferenciar com precisão as variantes no switch abaixo?',
    code: 'type Shape =\n  | { kind: "circle"; radius: number }\n  | { kind: "square"; size: number };\n\nfunction area(s: Shape) {\n  switch (s.kind) {\n    case "circle": return Math.PI * s.radius ** 2;\n    case "square": return s.size ** 2;\n  }\n}',
    options: [
      'A presença de propriedades numéricas',
      'A propriedade comum `kind` com tipos literais distintos em cada variante',
      'A instrução switch-case',
      'O uso do operador pipe `|`',
    ],
    correctIndex: 1,
    explanation:
      'Uma união discriminada possui uma propriedade compartilhada (o discriminante) com um tipo literal único em cada membro. O compilador usa essa propriedade no switch para estreitar a variante ativa.',
    compiledJS: 'function area(s) {\n  switch (s.kind) {\n    case "circle": return Math.PI * s.radius ** 2;\n    case "square": return s.size ** 2;\n  }\n}',
    bestPractice:
      'Sempre modele estados de requisições, eventos de domínio e mensagens assíncronas como uniões discriminadas (ex: `{ status: "loading" } | { status: "success", data } | { status: "error", error }`).',
    source: 'TypeScript Handbook — Discriminated Unions',
  },
  {
    id: 'i06',
    topic: 'Template Literal Types',
    question: 'Qual tipo o TypeScript produz para `EventName` no código abaixo?',
    code: 'type Action = "create" | "update";\ntype Entity = "User" | "Post";\ntype EventName = `on${Action}${Entity}`;',
    options: [
      'string',
      '"onActionEntity"',
      '"onCreateUser" | "onCreatePost" | "onUpdateUser" | "onUpdatePost"',
      'Array<string>',
    ],
    correctIndex: 2,
    explanation:
      'Template Literal Types realizam o produto cartesiano das uniões inseridas. Como `Action` tem 2 variantes e `Entity` tem 2 variantes, o resultado são as 4 combinações possíveis de strings literais.',
    compiledJS: null,
    bestPractice:
      'Template Literal Types são extremamente úteis para tipar barramentos de eventos, nomes de rotas, classes CSS BEM e propriedades aninhadas de objetos.',
    source: 'TypeScript Handbook — Template Literal Types',
  },
  {
    id: 'i07',
    topic: '`Extract` e `Exclude`',
    question: 'Para qual tipo a expressão `Extract<"a" | "b" | "c", "a" | "c">` avalia?',
    code: 'type T = Extract<"a" | "b" | "c", "a" | "c">;',
    options: ['"b"', '"a" | "c"', '"a" | "b" | "c"', 'never'],
    correctIndex: 1,
    explanation:
      '`Extract<T, U>` extrai de `T` todos os tipos que são atribuíveis a `U`. Portanto, `"a" | "c"` são mantidos. Por outro lado, `Exclude<T, U>` remove os membros coincidentes.',
    compiledJS: null,
    bestPractice:
      'Use `Extract` para filtrar variantes permitidas e `Exclude` para subtrair casos indesejados (como `Exclude<T, null | undefined>` na implementação de `NonNullable`).',
    source: 'TypeScript Handbook — Utility Types',
  },
  {
    id: 'i08',
    topic: 'Assinaturas de Índice',
    question: 'Por que a interface abaixo gera um erro de compilação no TypeScript?',
    code: 'interface Mixed {\n  [key: string]: number;\n  name: string; // Error!\n}',
    options: [
      "Assinaturas de índice e propriedades nomeadas não podem coexistir",
      "`name: string` conflita com o tipo `number` da assinatura de índice",
      "Assinaturas de índice exigem chaves numéricas, rejeitando strings",
      "Propriedades nomeadas devem vir antes da assinatura no tipo objeto"
    ],
    correctIndex: 1,
    explanation:
      'Quando uma assinatura de índice `[key: string]: number` é declarada, qualquer acesso por string pode retornar `number`. O TypeScript exige que todas as propriedades nomeadas tenham tipos compatíveis com a assinatura.',
    compiledJS: null,
    bestPractice:
      'Se precisar de tipos diferentes para chaves arbitrárias e campos fixos, use uniões ou separe o dicionário em uma propriedade aninhada (ex: `{ name: string; metadata: Record<string, number> }`).',
    source: 'TypeScript Handbook — Index Signatures',
  },
  {
    id: 'i09',
    topic: '`ReturnType` e `Parameters`',
    question: 'Por que o uso de `typeof myFn` é obrigatório em `ReturnType<typeof myFn>`?',
    code: 'function myFn() { return { count: 42 }; }\ntype MyReturn = ReturnType<typeof myFn>;',
    options: [
      "É sintaxe obsoleta; `ReturnType<myFn>` funciona de forma idêntica hoje",
      "Obtém metadados de tempo de execução de myFn para análise do reflexo",
      "Eleva o valor `myFn` ao espaço de tipos exigido por `ReturnType<T>`",
      "Força o compilador a resolver assinaturas sobrecarregadas na última"
    ],
    correctIndex: 1,
    explanation:
      '`ReturnType<T>` aceita um tipo de função como parâmetro genérico. `myFn` é um identificador de valor de runtime. O operador de tipo `typeof myFn` extrai a assinatura de tipo da função.',
    compiledJS: null,
    bestPractice:
      'Use `ReturnType<typeof fn>` para evitar duplicar tipos de saída complexos que já estão formalizados nas funções correspondentes.',
    source: 'TypeScript Handbook — typeof Type Operator',
  },
  {
    id: 'i10',
    topic: 'Tipos de Interseção `&`',
    question: 'Qual restrição o tipo de interseção `A & B` impõe a um valor?',
    code: 'interface HasId { id: string; }\ninterface HasTimestamp { createdAt: Date; }\ntype Entity = HasId & HasTimestamp;',
    options: [
      "{ name: string } | { age: number } — atender a qualquer objeto é válido",
      "{ name: string } & { age: number } — o valor deve atender a ambos os tipos",
      "{ name: string; age?: number } — propriedades de B se tornam opcionais",
      "any — interseções de formatos distintos de objetos se reduzem a any"
    ],
    correctIndex: 1,
    explanation:
      'Uma interseção (`&`) combina múltiplos tipos em um só. Um objeto tipado como `Entity` deve conter obrigatoriamente tanto `id: string` quanto `createdAt: Date`.',
    compiledJS: null,
    bestPractice:
      'Use interseções para compor contratos reutilizáveis e enriquecer entidades (como IDs, metadados de auditoria e paginação).',
    source: 'TypeScript Handbook — Intersection Types',
  },

  // ── Advanced ───────────────────────────────────────────────────────────────
  {
    id: 'a01',
    topic: 'Tipos Condicionais',
    question: 'Para qual tipo a expressão `NonNullable<string | null | undefined>` avalia?',
    code: 'type NonNullable<T> = T extends null | undefined ? never : T;\ntype Clean = NonNullable<string | null | undefined>;',
    options: ['string | null', 'string', 'never', 'unknown'],
    correctIndex: 1,
    explanation:
      'Tipos condicionais são distributivos sobre uniões nuas. O compilador avalia cada membro individualmente: `string` vira `string`, `null` vira `never` e `undefined` vira `never`. A união `string | never | never` simplifica para `string`.',
    compiledJS: null,
    bestPractice:
      'Entenda a distributividade em tipos condicionais. Envolver o tipo em tupla `[T]` desativa a distribuição quando você precisa avaliar a união como um todo.',
    source: 'TypeScript Handbook — Conditional Types',
  },
  {
    id: 'a02',
    topic: 'Palavra-chave `infer`',
    question: 'O que `infer R` captura no tipo `UnpackPromise<Promise<string>>`?',
    code: 'type UnpackPromise<T> = T extends Promise<infer R> ? R : T;\ntype Result = UnpackPromise<Promise<string>>;',
    options: [
      'O tipo do construtor da Promise',
      'O tipo resolvido contido dentro da Promise (`string`)',
      'O tipo boolean informando se é uma Promise',
      'any',
    ],
    correctIndex: 1,
    explanation:
      'A palavra-chave `infer` declara uma variável de tipo introduzida na cláusula `true` de um tipo condicional. O compilador deduz e captura o argumento genérico contido na Promise (`string`).',
    compiledJS: null,
    bestPractice:
      'Utilize `infer` para desempacotar tipos internos em estruturas aninhadas, como retornos assíncronos, elementos de arrays e parâmetros de funções.',
    source: 'TypeScript Handbook — Inferring Within Conditional Types',
  },
  {
    id: 'a03',
    topic: 'Operador `satisfies` (TS 4.9+)',
    question: 'Qual vantagem o operador `satisfies` oferece em relação a uma anotação de tipo direta?',
    code: 'const palette = {\n  red: [255, 0, 0],\n  green: "#00ff00",\n} satisfies Record<string, string | number[]>;\n\npalette.red.map(v => v); // Válido!\npalette.green.toUpperCase(); // Válido!',
    options: [
      "Valida e impõe contratos de tipagem em runtime no navegador, lançando exceções caso campos obrigatórios faltem no objeto",
      "Valida o valor contra o tipo mantendo o tipo literal inferido mais específico, garantindo autocomplete e tipagem precisa",
      "Congela o objeto recursivamente durante a compilação, tornando todas as suas propriedades somente leitura em runtime",
      "Opera de maneira absolutamente idêntica a uma anotação de tipo com dois-pontos (`:`), sendo apenas variação estética"
    ],
    correctIndex: 1,
    explanation:
      'Uma anotação de tipo direta (`const p: Record<string, string | number[]> = ...`) alarga todas as propriedades para `string | number[]`, impedindo métodos como `.map` em `red`. Com `satisfies`, a conformidade é validada mas os tipos literais exatos são preservados.',
    compiledJS: 'const palette = {\n  red: [255, 0, 0],\n  green: "#00ff00",\n}; // satisfies é apagado',
    bestPractice:
      'Prefira `satisfies` a anotações de tipo ao declarar configurações e mapas de estilos onde você quer validar a estrutura sem perder a precisão dos literais.',
    source: 'TypeScript 4.9 Release Notes — satisfies',
  },
  {
    id: 'a04',
    topic: 'Parâmetros de Tipo `const` (TS 5.0+)',
    question: 'Qual tipo o TypeScript infere para `arr` na chamada abaixo com modificador `const` no generic?',
    code: 'function asConst<const T>(val: T): T {\n  return val;\n}\nconst result = asConst(["admin", "user"]);',
    options: [
      '["admin", "user"]',
      'readonly ["admin", "user"]',
      '["admin" | "user"]',
      'Array<"admin" | "user">',
    ],
    correctIndex: 1,
    explanation:
      'Introduzidos no TypeScript 5.0, parâmetros de tipo prefixados com `const` instruem o compilador a inferir o tipo do argumento como se ele tivesse sido anotado com `as const`, preservando tuplas e literais de string.',
    compiledJS: 'function asConst(val) {\n  return val;\n}\nconst result = asConst(["admin", "user"]);',
    bestPractice:
      'Use `const` type parameters em funções de fábrica e validações para dispensar a necessidade de os usuários escreverem `as const` explicitamente em cada chamada.',
    source: 'TypeScript 5.0 Release Notes — const Type Parameters',
  },
  {
    id: 'a05',
    topic: 'Condicionais Distributivos vs Não-Distributivos',
    question: 'O que o encapsulamento em tupla `[T] extends [string]` impede em comparação com `T extends string`?',
    code: 'type ToArrayDistributive<T> = T extends any ? T[] : never;\ntype ToArrayNonDistributive<T> = [T] extends [any] ? T[] : never;\n\ntype D = ToArrayDistributive<string | number>; // string[] | number[]\ntype ND = ToArrayNonDistributive<string | number>; // ???',
    options: [
      'Impede que a verificação condicional seja executada',
      'Evita que o tipo condicional se distribua individualmente sobre os membros da união, tratando a união como um todo',
      'Gera erro de recursão infinita',
      'Converte todos os membros da união para never',
    ],
    correctIndex: 1,
    explanation:
      'Quando um parâmetro de tipo não está encapsulado, o TypeScript distribui o condicional sobre cada membro da união. Ao envolver ambos os lados em tuplas `[T] extends [U]`, a distributividade é desativada e `ND` vira `(string | number)[]`.',
    compiledJS: null,
    bestPractice:
      'Encapsule tipos em tuplas `[T]` sempre que quiser verificar se uma união completa é atribuível a um tipo alvo ou para verificar adequadamente se `T` é `never`.',
    source: 'TypeScript Handbook — Distributive Conditional Types',
  },
  {
    id: 'a06',
    topic: 'Tipos Recursivos',
    question: 'Por que definições de tipos recursivos exigem um invólucro de objeto ou array para evitar erros de compilação?',
    code: 'type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };',
    options: [
      "Tipos recursivos são estritamente proibidos em qualquer versão do TS",
      "Auto-referência imediata causa expansão infinita; objetos avaliam lazy",
      "É convenção estética; ambas as formas geram tipos idênticos no compilar",
      "Apenas `interface` aceita recursão; `type` aliases rejeitam auto-chamada"
    ],
    correctIndex: 1,
    explanation:
      'Um tipo recursivo precisa de um ponto de indireção (como propriedades de um objeto ou elementos de um array) para adiar a resolução do tipo. Auto-referências circulares puras (`type X = X`) são rejeitadas por criarem profundidades infinitas.',
    compiledJS: null,
    bestPractice:
      'Modele árvores de nós (ASTs), estruturas aninhadas e esquemas JSON usando tipos recursivos apoiados em arrays e objetos.',
    source: 'TypeScript Handbook — Recursive Types',
  },
  {
    id: 'a07',
    topic: 'Tipos de Tupla Variádica (TS 4.0+)',
    question: 'Qual é o tipo de `Result` na concatenação de tuplas variádicas abaixo?',
    code: 'type Prepend<T, U extends unknown[]> = [T, ...U];\ntype Result = Prepend<string, [number, boolean]>;',
    options: [
      '[string, [number, boolean]]',
      '[string, number, boolean]',
      '(string | number | boolean)[]',
      '[string, ...any[]]',
    ],
    correctIndex: 1,
    explanation:
      'Com tuplas variádicas, o operador spread `...U` desempacota a tupla diretamente na posição indicada. O resultado é a tupla achatada `[string, number, boolean]`.',
    compiledJS: null,
    bestPractice:
      'Utilize tuplas variádicas para tipar composições de funções (como `compose`, `pipe` e currying) preservando a exata ordem posicional dos argumentos.',
    source: 'TypeScript 4.0 Release Notes — Variadic Tuple Types',
  },
  {
    id: 'a08',
    topic: 'Module Augmentation',
    question: 'O que a declaração de module augmentation abaixo realiza sem modificar a pasta `node_modules`?',
    code: 'declare module "express-session" {\n  interface SessionData {\n    userId: string;\n  }\n}',
    options: [
      "Cria um módulo substituto que mascara o pacote express original do app",
      "Estende a interface Request do Express com `user` sem alterar pacotes",
      "Converte a interface Request do Express dinamicamente em uma classe ES6",
      "Funciona apenas ao reexportar explicitamente todo o pacote do express"
    ],
    correctIndex: 1,
    explanation:
      'Module Augmentation permite estender módulos de terceiros sem alterar seus arquivos. Como interfaces se mesclam, a interface `SessionData` do módulo passa a incluir `userId: string`.',
    compiledJS: null,
    bestPractice:
      'Coloque arquivos de module augmentation em uma pasta dedicada (como `src/types/`) e configure o `tsconfig.json` para incluí-los nas checagens de tipos da aplicação.',
    source: 'TypeScript Handbook — Module Augmentation',
  },
  {
    id: 'a09',
    topic: 'Predicados `asserts`',
    question: 'Como um predicado `asserts val is string` se diferencia de um predicado de tipo regular `val is string`?',
    code: 'function assertIsString(val: unknown): asserts val is string {\n  if (typeof val !== "string") throw new Error("Não é uma string");\n}\nassertIsString(x);\nx.toUpperCase(); // Válido após a chamada!',
    options: [
      'Predicados regulares estreitam o tipo após a chamada na linha seguinte, sem exigir um bloco if',
      'Predicados `asserts` realizam a checagem no fluxo de execução subsequente lançando erro se a condição falhar, dispensando `if (...)` no ponto de chamada',
      'Predicados `asserts` são executados em Web Workers',
      'Não há diferença entre os dois tipos de predicados',
    ],
    correctIndex: 1,
    explanation:
      'Enquanto predicados normais retornam um booleano e exigem um `if (isString(x))`, funções com `asserts` lançam exceções se a validação falhar. Se a função retornar normalmente, o TypeScript garante que o tipo foi estreitado para todo o fluxo seguinte.',
    compiledJS:
      'function assertIsString(val) {\n  if (typeof val !== "string") throw new Error("Não é uma string");\n}',
    bestPractice:
      'Crie funções utilitárias com assinaturas `asserts` para validação de invariantes, checagens de autenticação e validação de tokens nas primeiras linhas de funções críticas.',
    source: 'TypeScript Handbook — Assertion Functions',
  },
  {
    id: 'a10',
    topic: '`NoInfer<T>` (TS 5.4+)',
    question: 'Qual problema o utilitário `NoInfer<T>` resolve na assinatura de função abaixo?',
    code: 'function createFSM<C extends string>(config: {\n  initial: NoInfer<C>;\n  states: Record<C, StateConfig>;\n}) { ... }\n\ncreateFSM({\n  initial: "stopp", // Erro desejado aqui!\n  states: { start: {}, stop: {} }\n});',
    options: [
      "Nada — funciona de modo idêntico ao uso do parâmetro genérico puro `T`",
      "Impede que `fallback` infira `T`, gerando erro ao passar tipos errados",
      "Força o compilador a inferir `T` apenas de `fallback` ignorando `init`",
      "Torna o argumento `fallback` opcional na chamada da respectiva função"
    ],
    correctIndex: 1,
    explanation:
      'Sem `NoInfer`, o TypeScript incluiria `"stopp"` na união inferida de `C`, não acusando o erro de digitação. Ao encapsular com `NoInfer<C>`, o parâmetro genérico `C` é inferido unicamente através de `states`, e `"stopp"` é validado contra esse conjunto.',
    compiledJS: null,
    bestPractice:
      'Utilize `NoInfer<T>` em assinaturas de funções onde um argumento deve ser estritamente derivado de outro parâmetro sem influenciar na inferência.',
    source: 'TypeScript 5.4 Release Notes — NoInfer Utility Type',
  },
]
