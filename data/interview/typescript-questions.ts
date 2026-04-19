import type { InterviewQuestion } from '@/lib/interviewTypes'

export const TYPESCRIPT_QUESTIONS: InterviewQuestion[] = [
  // ── Beginner ───────────────────────────────────────────────────────────────
  {
    id: 'b01',
    topic: 'Type Inference',
    question: 'What type does TypeScript infer for `x` in `const x = 42`?',
    code: 'const x = 42;\n// hover: const x: 42',
    options: ['number', 'any', '42', 'unknown'],
    correctIndex: 2,
    explanation:
      'TypeScript infers the literal type `42` — not `number` — because `const` variables can never be reassigned. The compiler narrows the type to the exact value. Had you written `let x = 42`, TypeScript would widen the type to `number`, since the value could change later.',
    compiledJS: 'const x = 42;\n// Identical — type annotations are fully erased',
    bestPractice:
      'Prefer `const` over `let` for values that never change. You get free literal type narrowing for no extra syntax, which powers discriminated unions and other type-level patterns.',
    source: 'TypeScript Handbook — Type Inference',
  },
  {
    id: 'b02',
    topic: '`any` vs `unknown`',
    question: 'What happens when you call `.toUpperCase()` on a value typed as `unknown`?',
    code: 'let val: unknown = "hello";\nval.toUpperCase(); // ???',
    options: [
      'Compiles fine — unknown behaves like any',
      "TypeScript error: Object is of type 'unknown'",
      'Compiles fine — string methods work on unknown',
      'Runtime TypeError only — no compile error',
    ],
    correctIndex: 1,
    explanation:
      '`unknown` is the type-safe counterpart to `any`. Before calling any method on an `unknown` value, you must narrow its type with `typeof`, `instanceof`, or a type predicate. `any` skips all checks, which is why it is unsafe.',
    compiledJS: null,
    bestPractice:
      'Use `unknown` instead of `any` for values from external sources — API responses, `JSON.parse`, user input. Narrow with `typeof`/`instanceof` before use. Reserve `any` only when migrating untyped legacy code.',
    source: 'TypeScript Handbook — The unknown type',
  },
  {
    id: 'b03',
    topic: '`interface` vs `type`',
    question: 'Which feature is exclusive to `interface` and unavailable with `type` aliases?',
    code: 'interface User { name: string; }\ninterface User { age: number; }\n// Merges to: { name: string; age: number }',
    options: [
      'Extending other types with `extends`',
      'Declaration merging — multiple declarations combine into one type',
      'Being used as a function parameter type',
      'Being implemented by a class',
    ],
    correctIndex: 1,
    explanation:
      "Declaration merging allows multiple `interface` declarations with the same name to be automatically combined by the compiler. `type` aliases cannot be redeclared — attempting it is a duplicate identifier error. This is why libraries often use `interface` for types that consumers may need to augment.",
    compiledJS: null,
    bestPractice:
      'Use `interface` for public API contracts and class shapes where consumers may augment via declaration merging. Use `type` for unions, intersections, mapped types, and utility type aliases.',
    source: 'TypeScript Handbook — Interfaces vs Type Aliases',
  },
  {
    id: 'b04',
    topic: 'Optional Properties `?`',
    question: 'What is the inferred type of `config.timeout` in the snippet below?',
    code: 'interface Config { timeout?: number; }\nconst config: Config = {};\n// config.timeout is ???',
    options: ['number', 'number | undefined', 'number | null', 'undefined'],
    correctIndex: 1,
    explanation:
      'The `?` modifier makes a property optional, meaning it may be present (typed as `number`) or absent (typed as `undefined`). TypeScript represents this as `number | undefined`. Importantly, the `?` modifier is erased during compilation — no runtime representation exists.',
    compiledJS: 'const config = {};\n// The ? is erased — no runtime change',
    bestPractice:
      'Prefer `timeout?: number` over `timeout: number | undefined`. They are equivalent types, but the optional syntax conveys intent more clearly and allows callers to omit the key entirely rather than passing `undefined` explicitly.',
    source: 'TypeScript Handbook — Optional Properties',
  },
  {
    id: 'b05',
    topic: 'Union Types `|`',
    question: 'What must you do before calling `.toUpperCase()` on a `string | number` value?',
    code: 'function format(val: string | number) {\n  return val.toUpperCase(); // Error!\n}',
    options: [
      'Nothing — TypeScript handles it automatically',
      'A type assertion: `(val as string).toUpperCase()`',
      'A type guard: `if (typeof val === "string")`',
      'Cast val to `any` first',
    ],
    correctIndex: 2,
    explanation:
      'TypeScript requires narrowing before you can call type-specific methods on union types. The `typeof` guard tells TypeScript which branch of the union is active. Options A and D bypass type safety; option B is a cast that hides bugs; only option C verifies the type at runtime.',
    compiledJS:
      'function format(val) {\n  if (typeof val === "string") return val.toUpperCase();\n  // ...\n}',
    bestPractice:
      'Always narrow unions with `typeof`/`instanceof`/`in` guards rather than casting. Casting bypasses the type system; narrowing works with it and catches mistakes at compile time.',
    source: 'TypeScript Handbook — Narrowing',
  },
  {
    id: 'b06',
    topic: '`readonly` Modifier',
    question: 'What happens at runtime when you try to reassign a `readonly` property?',
    code: 'interface Point { readonly x: number; }\nconst p: Point = { x: 10 };\np.x = 20; // ???',
    options: [
      'Throws a TypeError at runtime',
      'Silently ignored at runtime',
      'TypeScript compile error only — no runtime effect',
      'Both a compile error and a runtime TypeError',
    ],
    correctIndex: 2,
    explanation:
      '`readonly` is a compile-time-only constraint. The TypeScript compiler rejects the assignment, but after compilation the `readonly` keyword is completely erased. The resulting JavaScript has no readonly enforcement, so `p.x = 20` would succeed at runtime.',
    compiledJS:
      'const p = { x: 10 };\np.x = 20; // Works at runtime — readonly is erased',
    bestPractice:
      'Use `readonly` for immutability intent in type definitions and APIs. For true runtime immutability, use `Object.freeze()`. Note that `freeze` is shallow — nested objects are still mutable.',
    source: 'TypeScript Handbook — The readonly Modifier',
  },
  {
    id: 'b07',
    topic: 'Numeric vs String Enums',
    question: 'What does the compiled JavaScript look like for a numeric enum?',
    code: 'enum Direction { Up, Down, Left, Right }',
    options: [
      'const Direction = { Up: 0, Down: 1, Left: 2, Right: 3 }',
      'An IIFE that creates both name→value and value→name mappings',
      'A frozen object with string keys only',
      'Nothing — enums are erased like interfaces',
    ],
    correctIndex: 1,
    explanation:
      'Numeric enums compile to an IIFE that creates a bidirectional mapping: `Direction[0] === "Up"` and `Direction["Up"] === 0`. This allows reverse lookups by index. String enums, by contrast, compile to a one-way object with no reverse lookup.',
    compiledJS:
      'var Direction;\n(function (Direction) {\n  Direction[Direction["Up"] = 0] = "Up";\n  Direction[Direction["Down"] = 1] = "Down";\n  Direction[Direction["Left"] = 2] = "Left";\n  Direction[Direction["Right"] = 3] = "Right";\n})(Direction || (Direction = {}));',
    bestPractice:
      'Prefer `const enum` (inlined at compile time, zero runtime cost) or string enums (more debuggable) for new code. Avoid plain numeric enums in public APIs — reverse lookup behaviour can be surprising.',
    source: 'TypeScript Handbook — Enums',
  },
  {
    id: 'b08',
    topic: 'Tuple Types',
    question: 'What happens when you access index `2` on a tuple typed as `[string, number]`?',
    code: 'const pair: [string, number] = ["hello", 42];\nconst third = pair[2]; // ???',
    options: [
      'undefined — same as JavaScript array behaviour',
      'string | number — TypeScript widens to the union',
      'any — out-of-bounds accesses return any',
      'TypeScript compile error — index 2 is out of bounds for this tuple',
    ],
    correctIndex: 3,
    explanation:
      'Tuple types have a fixed length enforced by TypeScript. Accessing an index outside the declared bounds is a compile-time error. At runtime, JavaScript arrays happily return `undefined`, but TypeScript catches the mistake before it reaches production.',
    compiledJS:
      'const pair = ["hello", 42];\nconst third = pair[2]; // undefined at runtime',
    bestPractice:
      'Use tuples for fixed-structure return values (e.g. `[value, error]` or React-style `[state, setter]`). Label tuple elements for readability: `[name: string, age: number]`. This preserves the type benefits while making intent explicit.',
    source: 'TypeScript Handbook — Tuple Types',
  },
  {
    id: 'b09',
    topic: '`never` Type',
    question: 'What is the purpose of `assertExhaustive` in the pattern below?',
    code: 'function assertExhaustive(x: never): never {\n  throw new Error("Unhandled case: " + x);\n}\n\nfunction handle(shape: Circle | Square) {\n  switch (shape.kind) {\n    case "circle": return;\n    case "square": return;\n    default: return assertExhaustive(shape);\n  }\n}',
    options: [
      'It provides a runtime fallback for unknown shapes',
      'It narrows the type in the default branch to never, giving a compile error when a new union member is unhandled',
      'It converts the union type to any in the default branch',
      'It is equivalent to a no-op — the default branch is never reached',
    ],
    correctIndex: 1,
    explanation:
      'After handling every member of the union in the switch cases, the remaining type in the `default` branch is `never`. Passing a `never` value to a `never`-accepting parameter is valid — until you add a new union member without a case. Then TypeScript errors at the `default`, forcing you to handle it.',
    compiledJS:
      'function assertExhaustive(x) {\n  throw new Error("Unhandled case: " + x);\n}',
    bestPractice:
      'Add `assertExhaustive(x)` (or `return x satisfies never`) to the `default` case of every switch on a discriminated union. It turns missing-case bugs from runtime crashes into compile-time errors.',
    source: 'TypeScript Handbook — Narrowing — never',
  },
  {
    id: 'b10',
    topic: 'Type Assertion `as`',
    question: 'Does the `as` keyword perform any runtime type check or conversion?',
    code: 'const input = document.getElementById("name") as HTMLInputElement;\nconsole.log(input.value);',
    options: [
      'Yes — it casts the element to HTMLInputElement at runtime',
      'Yes — it throws if the element is not an HTMLInputElement',
      'No — it is fully erased at compile time with no runtime effect',
      'No — but strict mode adds a hidden instanceof check',
    ],
    correctIndex: 2,
    explanation:
      '`as` is a purely compile-time instruction telling TypeScript to treat the value as a specific type. It generates no runtime code. If the assertion is wrong (e.g. `getElementById` returns `null`), you get a runtime error, not a compile error.',
    compiledJS:
      'const input = document.getElementById("name");\nconsole.log(input.value); // as HTMLInputElement is gone',
    bestPractice:
      'Use `instanceof` guards or type predicates for runtime safety. Use `as` only when you have external knowledge TypeScript cannot verify (e.g. querying a specific DOM element by known ID). Prefer `as` over `<Type>` syntax — the latter conflicts with JSX.',
    source: 'TypeScript Handbook — Type Assertions',
  },

  // ── Intermediate ────────────────────────────────────────────────────────────
  {
    id: 'i01',
    topic: 'Generics',
    question: 'What is the inferred type of `result` in the call below?',
    code: 'function identity<T>(arg: T): T {\n  return arg;\n}\n\nconst result = identity("hello");',
    options: [
      'any — generics erase to any at runtime',
      'T — the generic parameter is preserved as-is',
      'string — the argument type is captured and flows through',
      'unknown — generics default to unknown when not constrained',
    ],
    correctIndex: 2,
    explanation:
      'TypeScript infers `T = string` from the call-site argument `"hello"` and substitutes it through the return type, giving `result` the type `string`. This is the key advantage over `any`: the type relationship between input and output is preserved.',
    compiledJS:
      'function identity(arg) {\n  return arg;\n}\n\nconst result = identity("hello");',
    bestPractice:
      'Use generics instead of `any` whenever you need to preserve type relationships. Add constraints (`<T extends object>`) to restrict what T can be while still inferring the exact type at the call site.',
    source: 'TypeScript Handbook — Generics',
  },
  {
    id: 'i02',
    topic: '`keyof T` + Indexed Access `T[K]`',
    question: 'What is the return type of `getProp(obj, key)` for the call below?',
    code: 'function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\nconst val = getProp({ age: 30 }, "age");',
    options: [
      'any',
      'unknown',
      'number — the exact type of { age: number }["age"]',
      'keyof { age: number }',
    ],
    correctIndex: 2,
    explanation:
      '`T[K]` is an indexed access type that resolves to the exact type of property `K` on `T`. Here, `T` is `{ age: number }` and `K` is `"age"`, so `T[K]` resolves to `number`. This is far more precise than returning `any`.',
    compiledJS: 'function getProp(obj, key) {\n  return obj[key];\n}',
    bestPractice:
      'Use `keyof T` + `T[K]` instead of `any` when building property-accessor utilities. This pattern is the foundation of built-in types like `Pick<T, K>` and `Record<K, V>`.',
    source: 'TypeScript Handbook — Indexed Access Types',
  },
  {
    id: 'i03',
    topic: 'Mapped Types',
    question: 'What does `Readonly<T>` expand to for `{ name: string; age: number }`?',
    code: 'type Readonly<T> = { readonly [K in keyof T]: T[K] };\ntype R = Readonly<{ name: string; age: number }>;',
    options: [
      '{ name: string; age: number } — no change',
      '{ readonly name: string; readonly age: number }',
      '{ name: readonly string; age: readonly number }',
      '{ readonly name: readonly string; readonly age: readonly number }',
    ],
    correctIndex: 1,
    explanation:
      'Mapped types use `[K in keyof T]` to iterate over every key in `T` and produce a new type. The `readonly` modifier is applied to each property key (not the value type), resulting in all properties becoming readonly.',
    compiledJS: null,
    bestPractice:
      'Use built-in utility types (`Readonly`, `Partial`, `Required`, `Pick`, `Omit`) before writing your own mapped types. For advanced transformations, use key remapping with `as` (TS 4.1+): `[K in keyof T as Rename<K>]`.',
    source: 'TypeScript Handbook — Mapped Types',
  },
  {
    id: 'i04',
    topic: 'Type Predicates',
    question: 'What does the `val is string` return annotation do at the call site?',
    code: 'function isString(val: unknown): val is string {\n  return typeof val === "string";\n}\n\nif (isString(x)) {\n  x.toUpperCase(); // x is string here\n}',
    options: [
      'Nothing — it is syntax sugar for returning boolean',
      'Narrows val to string in the true branch at every call site',
      'Throws a TypeError if val is not string at runtime',
      'Works only inside if statements, not switch statements',
    ],
    correctIndex: 1,
    explanation:
      'A type predicate `val is string` instructs TypeScript to narrow the type of `val` to `string` in the `true` branch wherever the function is called. The narrowing is a compile-time effect only — the compiled function is an ordinary boolean-returning function.',
    compiledJS:
      'function isString(val) {\n  return typeof val === "string";\n}',
    bestPractice:
      'Use type predicates for reusable guard functions you call in multiple places. The alternative — inline `typeof` checks — is not reusable. For class hierarchies, prefer `instanceof` guards.',
    source: 'TypeScript Handbook — Using type predicates',
  },
  {
    id: 'i05',
    topic: 'Discriminated Unions',
    question: 'Which property enables TypeScript\'s automatic narrowing in the `switch` statement below?',
    code: 'type Shape =\n  | { kind: "circle"; r: number }\n  | { kind: "square"; side: number };\n\nfunction area(shape: Shape) {\n  switch (shape.kind) { /* ... */ }\n}',
    options: [
      'The `kind` property typed as a string literal',
      'The union type `|` itself',
      'The `switch` statement syntax specifically',
      'The fact that both branches have numeric properties',
    ],
    correctIndex: 0,
    explanation:
      'A discriminated union requires a shared property with a literal (string/number/boolean) type — the discriminant. When TypeScript sees `switch (shape.kind)`, it can narrow `shape` to the exact variant in each `case` branch because the literal values are unique identifiers.',
    compiledJS: null,
    bestPractice:
      'Always add a `kind`/`type` literal discriminant to union members used in switch statements. This enables exhaustiveness checking: if you add a new union member and forget a case, TypeScript errors on the `assertExhaustive` call in `default`.',
    source: 'TypeScript Handbook — Discriminated unions',
  },
  {
    id: 'i06',
    topic: 'Template Literal Types',
    question: 'What type does TypeScript produce for `EventName` below?',
    code: 'type Events = "click" | "focus" | "blur";\ntype EventName = `on${Capitalize<Events>}`;',
    options: [
      'string',
      '"onClick" | "onFocus" | "onBlur"',
      '"on" | "click" | "focus" | "blur"',
      'Template literal types are not valid in type positions',
    ],
    correctIndex: 1,
    explanation:
      'Template literal types (TS 4.1+) distribute over union types, combining each member with the surrounding template to produce a new union of string literal types. `Capitalize` is a built-in intrinsic string type that uppercases the first character.',
    compiledJS: null,
    bestPractice:
      'Use template literal types for event name strings, CSS property keys, and any pattern where string shape follows a fixed structure. Combined with mapped types they enable fully type-safe, auto-completing string APIs.',
    source: 'TypeScript Handbook — Template Literal Types',
  },
  {
    id: 'i07',
    topic: '`Extract` / `Exclude`',
    question: 'What does `Extract<"a" | "b" | "c", "a" | "c">` evaluate to?',
    code: 'type Result = Extract<"a" | "b" | "c", "a" | "c">;\n// Result = ???',
    options: ['"a" | "b" | "c"', '"b"', '"a" | "c"', 'never'],
    correctIndex: 2,
    explanation:
      '`Extract<T, U>` keeps only the members of `T` that are assignable to `U`. Since `"a"` and `"c"` are assignable to `"a" | "c"`, they are kept. `"b"` is not assignable to `"a" | "c"`, so it is excluded. `Exclude<T, U>` is the inverse.',
    compiledJS: null,
    bestPractice:
      'Use `Extract` and `Exclude` for set operations on union types. `NonNullable<T>` is implemented as `Exclude<T, null | undefined>`. Prefer these utilities over manually enumerating union subsets.',
    source: 'TypeScript Handbook — Extract, Exclude utility types',
  },
  {
    id: 'i08',
    topic: 'Index Signatures',
    question: 'Why does the following `interface Mixed` produce a TypeScript error?',
    code: 'interface Mixed {\n  [key: string]: number;\n  name: string; // Error!\n}',
    options: [
      'Index signatures and named properties can never coexist',
      '`name: string` is incompatible with the index signature value type `number`',
      'Index signatures require numeric keys, not string keys',
      'Named properties must appear before index signatures',
    ],
    correctIndex: 1,
    explanation:
      'When a string index signature `[key: string]: V` exists, all named properties must be assignable to `V`. Since `name: string` is not assignable to `number`, TypeScript errors. If the index signature were `[key: string]: string | number`, the `name: string` property would be valid.',
    compiledJS: null,
    bestPractice:
      'Use `Record<string, V>` or `Map<string, V>` for purely dynamic stores. Reserve index signatures for APIs where named properties are conceptually part of the same collection. Consider widening the value type to a union if you need mixed values.',
    source: 'TypeScript Handbook — Index Signatures',
  },
  {
    id: 'i09',
    topic: '`ReturnType` / `Parameters`',
    question: 'Why is `typeof myFn` required in `ReturnType<typeof myFn>`?',
    code: 'function myFn(x: number): string {\n  return String(x);\n}\n\ntype R = ReturnType<typeof myFn>; // R = string',
    options: [
      'It is redundant — `ReturnType<myFn>` works the same way',
      'It gets myFn\'s runtime type for reflection',
      'It converts the function value to a function type, which `ReturnType` requires as its type parameter',
      'It narrows overloaded signatures to the last one',
    ],
    correctIndex: 2,
    explanation:
      '`ReturnType` expects a *type* parameter, not a *value*. `myFn` is a value — referencing it without `typeof` in a type position is an error. `typeof myFn` in a type context extracts the function\'s type (`(x: number) => string`), which `ReturnType` can then operate on.',
    compiledJS:
      'function myFn(x) {\n  return String(x);\n}\n// ReturnType and Parameters are erased — type-level only',
    bestPractice:
      'Use `ReturnType<typeof fn>` and `Parameters<typeof fn>` to derive types from existing functions without duplicating them. When a function signature changes, all dependent type aliases update automatically.',
    source: 'TypeScript Handbook — ReturnType utility type',
  },
  {
    id: 'i10',
    topic: 'Intersection Types `&`',
    question: 'What constraint does the intersection type `A & B` place on a value?',
    code: 'type A = { name: string };\ntype B = { age: number };\ntype AB = A & B;\n\nconst merged: AB = { name: "Alice", age: 30 };',
    options: [
      '{ name: string } | { age: number } — either shape is valid',
      '{ name: string } & { age: number } — the value must satisfy both simultaneously',
      '{ name: string; age?: number } — B properties become optional',
      'any — intersection of distinct shapes resolves to any',
    ],
    correctIndex: 1,
    explanation:
      'Intersection types (`&`) require the value to satisfy ALL intersected contracts simultaneously. `merged` must have both `name: string` AND `age: number`. An object missing either property is a compile error.',
    compiledJS:
      'const merged = { name: "Alice", age: 30 };\n// & is erased — just a plain object',
    bestPractice:
      'Use intersections for mixin/composition patterns. Prefer `interface extends` for object type extension — it gives better error messages and performance. Save `&` for combining types from separate sources (e.g. library types + your additions).',
    source: 'TypeScript Handbook — Intersection Types',
  },

  // ── Advanced ────────────────────────────────────────────────────────────────
  {
    id: 'a01',
    topic: 'Conditional Types',
    question: 'What does `NonNullable<string | null | undefined>` evaluate to?',
    code: 'type NonNullable<T> = T extends null | undefined ? never : T;\ntype R = NonNullable<string | null | undefined>;\n// R = ???',
    options: [
      'string | null | undefined',
      'string | never | never',
      'string',
      'never',
    ],
    correctIndex: 2,
    explanation:
      'Conditional types distribute over union members by default. Each member is evaluated separately: `string extends null|undefined` → false → `string`; `null extends null|undefined` → true → `never`; `undefined extends null|undefined` → true → `never`. The result `string | never | never` simplifies to `string` because `never` is the identity element of union types.',
    compiledJS: null,
    bestPractice:
      'Understand distributive conditional types before writing your own utilities. They are the foundation of the entire TypeScript utility type library (`NonNullable`, `Exclude`, `Extract`, `ReturnType`, etc.).',
    source: 'TypeScript Handbook — Conditional Types',
  },
  {
    id: 'a02',
    topic: '`infer` Keyword',
    question: 'What does `infer R` capture in `UnpackPromise<Promise<string>>`?',
    code: 'type UnpackPromise<T> =\n  T extends Promise<infer R> ? R : T;\n\ntype Result = UnpackPromise<Promise<string>>;\n// Result = ???',
    options: [
      'The Promise constructor type',
      'string — the type wrapped inside Promise',
      'Promise<string> — no extraction happens',
      'unknown — infer always resolves to unknown',
    ],
    correctIndex: 1,
    explanation:
      '`infer R` creates a type variable that is bound to the type at a specific position in the conditional type\'s `extends` clause. When `T` matches `Promise<infer R>`, TypeScript captures the wrapped type into `R`. Here, `T = Promise<string>` matches and `R` is bound to `string`.',
    compiledJS: null,
    bestPractice:
      'Use `infer` to extract inner types without re-declaring them. Common patterns: `UnpackArray<T>`, `FirstArg<T>`, and the built-in `ReturnType<T>`. Always check if a built-in utility already does what you need before writing your own.',
    source: 'TypeScript Handbook — Inferring Within Conditional Types',
  },
  {
    id: 'a03',
    topic: '`satisfies` Operator (TS 4.9+)',
    question: 'What advantage does `satisfies` have over a plain type annotation?',
    code: 'const palette = {\n  red: [255, 0, 0],\n  green: "#00ff00",\n} satisfies Record<string, string | number[]>;\n\n// palette.red is number[] — not string | number[]',
    options: [
      'It enforces the type at runtime',
      'It validates against the type while preserving the inferred literal structure for IntelliSense',
      'It makes all properties readonly automatically',
      'It is identical to a type annotation — no practical difference',
    ],
    correctIndex: 1,
    explanation:
      'A regular type annotation widens `palette` to `Record<string, string | number[]>`, losing the specific shape of each property. `satisfies` validates the value against the type but keeps the inferred type of each property (e.g. `palette.red` stays `number[]`, not `string | number[]`).',
    compiledJS:
      'const palette = {\n  red: [255, 0, 0],\n  green: "#00ff00",\n};\n// satisfies is fully erased',
    bestPractice:
      'Use `satisfies` when you want to validate a value against a type but still have precise IntelliSense on its shape — configuration objects, style maps, route definitions, and i18n dictionaries are prime candidates.',
    source: 'TypeScript 4.9 Release Notes — The satisfies Operator',
  },
  {
    id: 'a04',
    topic: '`const` Type Parameters (TS 5.0+)',
    question: 'What type does TypeScript infer for `arr` in the call below?',
    code: 'function toArray<const T>(val: T): T[] {\n  return [val];\n}\n\nconst arr = toArray([1, 2, 3]);\n// arr: ???',
    options: [
      'number[][]',
      '[1, 2, 3][] — literal tuple type is preserved',
      'T[]',
      '(1 | 2 | 3)[][]',
    ],
    correctIndex: 1,
    explanation:
      'Without `const`, TypeScript widens `[1, 2, 3]` to `number[]` during generic inference. With `const T`, TypeScript preserves the literal tuple type `[1, 2, 3]` and infers `T = [1, 2, 3]`, making the return type `[1, 2, 3][]`.',
    compiledJS:
      'function toArray(val) {\n  return [val];\n}\n\nconst arr = toArray([1, 2, 3]);',
    bestPractice:
      'Use `const` type parameters (TS 5.0+) instead of requiring `as const` assertions at call sites. This creates a cleaner API — callers get full literal type inference without needing to know about `as const`.',
    source: 'TypeScript 5.0 Release Notes — const Type Parameters',
  },
  {
    id: 'a05',
    topic: 'Distributive vs Non-Distributive Conditionals',
    question: 'What does wrapping in a tuple `[T] extends [string]` prevent compared to `T extends string`?',
    code: 'type IsString<T> = [T] extends [string] ? true : false;\ntype R1 = IsString<string | number>; // ???\n\ntype IsString2<T> = T extends string ? true : false;\ntype R2 = IsString2<string | number>; // boolean',
    options: [
      'Nothing — both behave identically',
      'Distribution over union members — R1 is false (not boolean)',
      'Distribution over union members — R1 is true (not boolean)',
      'It prevents TypeScript from evaluating the conditional at all',
    ],
    correctIndex: 1,
    explanation:
      'When `T` is a union, a bare `T extends string` distributes: each member is tested separately (`string → true`, `number → false`), giving `true | false` = `boolean`. Wrapping in a tuple `[T] extends [string]` tests the whole union at once — `[string | number] extends [string]` is `false`.',
    compiledJS: null,
    bestPractice:
      'Use the non-distributive form `[T] extends [U]` when testing a union as a whole. This is essential for `IsNever<T>`: `type IsNever<T> = [T] extends [never] ? true : false` — the naked `T extends never` form always evaluates to `never` when `T` is `never`.',
    source: 'TypeScript Handbook — Distributive Conditional Types',
  },
  {
    id: 'a06',
    topic: 'Recursive Types',
    question: 'Why do recursive type aliases require an object or array wrapper to avoid errors?',
    code: '// Works — array hop introduces laziness:\ntype JSONArray = JSONValue[];\ntype JSONValue = string | number | boolean | null | JSONArray | JSONObject;\ntype JSONObject = { [k: string]: JSONValue };',
    options: [
      'Recursive types are not allowed in TypeScript at all',
      'Direct self-reference is evaluated eagerly, causing infinite expansion; object/array types are resolved lazily',
      'It is a formatting convention — both are functionally identical',
      'Only `interface` supports recursion; `type` aliases cannot be self-referential',
    ],
    correctIndex: 1,
    explanation:
      'TypeScript resolves `type` aliases eagerly. A directly self-referential alias with no indirection causes infinite expansion at compile time. Object and array types are resolved lazily (they are structural types, not aliases), which breaks the infinite loop.',
    compiledJS: null,
    bestPractice:
      'Use `interface` for recursive types when possible — interfaces are always lazily resolved. For `type` aliases, add an object or array layer. Since TS 3.7+ many direct recursive aliases work, but the pattern remains important for deeply nested structures.',
    source: 'TypeScript Handbook — Recursive Type Aliases',
  },
  {
    id: 'a07',
    topic: 'Variadic Tuple Types (TS 4.0+)',
    question: 'What is the type of `Result` in the variadic tuple concatenation below?',
    code: 'type Concat<A extends unknown[], B extends unknown[]> =\n  [...A, ...B];\n\ntype Result = Concat<[string, number], [boolean]>;\n// Result = ???',
    options: [
      '(string | number | boolean)[]',
      '[string, number, boolean]',
      '[string, number, ...boolean[]]',
      'string | number | boolean',
    ],
    correctIndex: 1,
    explanation:
      'Variadic tuple types (TS 4.0+) preserve per-element types when spreading tuples. `[...A, ...B]` concatenates the tuple types exactly, giving `[string, number, boolean]`. This is different from spreading arrays, which would produce `(string | number | boolean)[]`.',
    compiledJS: null,
    bestPractice:
      'Use variadic tuples for strongly-typed function argument composition, middleware pipelines, and any API that concatenates typed sequences. They eliminate the overload explosion previously needed for typed concat utilities.',
    source: 'TypeScript 4.0 Release Notes — Variadic Tuple Types',
  },
  {
    id: 'a08',
    topic: 'Declaration Merging / Module Augmentation',
    question: 'What does this module augmentation achieve without editing `node_modules`?',
    code: '// express-augment.d.ts\nimport { User } from "./types";\n\ndeclare module "express-serve-static-core" {\n  interface Request {\n    user?: User;\n  }\n}',
    options: [
      'Creates a new module that replaces the express module',
      'Adds the `user` property to Express\'s Request interface without editing node_modules',
      'Converts the Request interface to a class',
      'Works only if you re-export the entire express module',
    ],
    correctIndex: 1,
    explanation:
      'Module augmentation leverages declaration merging to add properties to existing interfaces in third-party modules. TypeScript merges the augmented `Request` interface with the original, so every usage of `Request` now has a `user` property.',
    compiledJS: null,
    bestPractice:
      'Augment in a `.d.ts` file or a `.ts` file with `export {}` (to be treated as a module). Augment as narrowly as possible — target the specific sub-module (`express-serve-static-core`) rather than the top-level package to avoid unintended merges.',
    source: 'TypeScript Handbook — Declaration Merging — Module Augmentation',
  },
  {
    id: 'a09',
    topic: '`asserts` Predicates',
    question: 'How does an `asserts val is string` predicate differ from a regular type predicate `val is string`?',
    code: 'function assertIsString(val: unknown): asserts val is string {\n  if (typeof val !== "string") throw new Error("Not a string!");\n}\n\nassertIsString(x);\nx.toUpperCase(); // x is string here',
    options: [
      'It returns boolean instead of void',
      'It narrows val only in the true branch at the call site',
      'It narrows all code after the call site when it does not throw',
      'It only works inside class methods',
    ],
    correctIndex: 2,
    explanation:
      'An `asserts` predicate changes the control flow type of all subsequent code at the call site — if the function returns without throwing, TypeScript knows the asserted type holds for everything after the call. A regular predicate (`val is string`) narrows only inside an `if` branch.',
    compiledJS:
      'function assertIsString(val) {\n  if (typeof val !== "string") throw new Error("Not a string!");\n}',
    bestPractice:
      'Use `asserts` predicates for validation functions that throw on failure (`assertNonNull`, `assertEnvVar`, `assertDefined`). They give you type narrowing without wrapping every call in an `if` block.',
    source: 'TypeScript 3.7 Release Notes — Assertion Functions',
  },
  {
    id: 'a10',
    topic: '`NoInfer<T>` (TS 5.4+)',
    question: 'What problem does `NoInfer<T>` solve in the function signature below?',
    code: 'function createStore<T>(\n  initial: T,\n  fallback: NoInfer<T>\n): T {\n  return initial ?? fallback;\n}\n\nconst s = createStore(42, "oops"); // Error!',
    options: [
      'Nothing — it is identical to using `T` directly',
      'Prevents `fallback` from contributing to T\'s inference, so the call errors because "oops" does not match the inferred number',
      'Forces T to be inferred from `fallback` instead of `initial`',
      'Makes `fallback` optional at the call site',
    ],
    correctIndex: 1,
    explanation:
      'Without `NoInfer`, TypeScript would infer `T` from both `initial` (→ `42`, a `number`) and `fallback` (→ `"oops"`, a `string`), widening `T` to `string | number` and suppressing the mistake. `NoInfer<T>` marks `fallback` as a non-inference site: `T` is inferred only from `initial`, so `"oops"` becomes a type error.',
    compiledJS:
      'function createStore(initial, fallback) {\n  return initial ?? fallback;\n}\n// NoInfer is fully erased',
    bestPractice:
      'Use `NoInfer<T>` (TS 5.4+) for parameters that should only *receive* an already-inferred type, not *contribute* to its inference — default values, fallbacks, and second-pass parameters are ideal candidates.',
    source: 'TypeScript 5.4 Release Notes — NoInfer utility type',
  },
]
