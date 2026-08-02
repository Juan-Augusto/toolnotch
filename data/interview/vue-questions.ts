import type { InterviewQuestion } from '@/lib/interviewTypes'

export const VUE_QUESTIONS: InterviewQuestion[] = [
  // ── Beginner ───────────────────────────────────────────────────────────────
  {
    id: 'b01',
    topic: 'createApp',
    question: 'In Vue 3, what does `createApp(App).mount(\'#app\')` do?',
    code: null,
    options: [
      'It downloads the Vue runtime from a CDN and injects it into the page',
      'It creates a new, isolated app instance from the root component and mounts it to the DOM element matching the selector',
      'It compiles all `.vue` files in the project into a single bundle',
      'It registers `App` as a global component available in every other component',
    ],
    correctIndex: 1,
    explanation:
      '`createApp()` is the Vue 3 application factory — it returns an app instance scoped to that call, unlike Vue 2\'s single global `Vue` constructor. Each app instance has its own configuration (global components, directives, plugins) that does not leak into other app instances on the same page, which matters for micro-frontends or embedding multiple Vue widgets. `.mount()` takes the app instance, compiles/renders the root component tree, and replaces the target DOM element\'s content with the rendered output. The element itself is not replaced — its attributes are merged onto the root component\'s root element.',
    compiledJS:
      "import { createApp } from 'vue'\nimport App from './App.vue'\n\nconst app = createApp(App)\napp.mount('#app')\n\n// Multiple isolated apps on one page:\nconst app2 = createApp(OtherRoot)\napp2.mount('#widget')\n// app and app2 share no global config — registering a\n// component on `app` does NOT make it available in `app2`.",
    bestPractice:
      'Register global plugins, directives, and components on the `app` instance before calling `.mount()` — anything registered after mount still works, but front-loading configuration keeps startup code predictable. Avoid creating multiple `createApp()` instances unless you are genuinely embedding independent widgets; a single root app with routing is the norm for full applications.',
    source: 'Vue.js Docs — Creating a Vue Application',
  },
  {
    id: 'b02',
    topic: 'Template Interpolation',
    question: 'What does `{{ message }}` render inside a Vue template?',
    code: null,
    options: [
      'The literal string "message"',
      'The current value of the `message` reactive property, re-rendered automatically whenever it changes',
      'A reference to the DOM node, not its value',
      'It only renders once at mount and never updates',
    ],
    correctIndex: 1,
    explanation:
      'Double-curly "mustache" syntax is text interpolation — Vue evaluates `message` as a JavaScript expression against the component\'s reactive state and inserts the resulting string into the DOM as text (not HTML). Because `message` is tracked by Vue\'s reactivity system, any component-triggered mutation to it schedules a re-render of just the parts of the DOM that depend on it, not the whole component. Interpolation always HTML-escapes its output — to render raw HTML you need the `v-html` directive, which explicitly opts out of that safety.',
    compiledJS:
      "<script setup>\nimport { ref } from 'vue'\nconst message = ref('Hello Vue!')\n</script>\n\n<template>\n  <p>{{ message }}</p>\n  <!-- renders: <p>Hello Vue!</p> -->\n  <button @click=\"message = 'Updated!'\">Change</button>\n  <!-- clicking re-renders only the <p> text node -->\n</template>",
    bestPractice:
      'Never use `v-html` with user-supplied content — it bypasses Vue\'s automatic escaping and is a direct XSS vector. Keep template expressions simple (property access, ternaries); move non-trivial logic into a `computed` property so templates stay readable and the logic is testable in isolation.',
    source: 'Vue.js Docs — Template Syntax: Text Interpolation',
  },
  {
    id: 'b03',
    topic: 'v-bind Shorthand',
    question: 'What is the shorthand syntax for `v-bind:href="url"`?',
    code: null,
    options: [
      '`@href="url"`',
      '`:href="url"`',
      '`#href="url"`',
      '`.href="url"`',
    ],
    correctIndex: 1,
    explanation:
      '`v-bind` binds an HTML attribute or DOM property to a reactive expression, and its shorthand is a leading colon: `:href="url"`. This is distinct from `v-on`, whose shorthand is `@` (e.g. `@click="handler"`). `#` is the shorthand for `v-slot` (used on `<template>` for named/scoped slots), and `.` is not a directive shorthand — it is used as a modifier suffix (e.g. `@click.stop`). Mixing these up is a common beginner error: `@href` would try to listen for an "href" DOM event, which does not exist and silently does nothing.',
    compiledJS:
      "<template>\n  <!-- Full syntax -->\n  <a v-bind:href=\"url\">Link</a>\n\n  <!-- Shorthand (identical behavior) -->\n  <a :href=\"url\">Link</a>\n\n  <!-- Dynamic argument -->\n  <a :[attributeName]=\"url\">Link</a>\n  <!-- if attributeName === 'href', same as :href -->\n</template>",
    bestPractice:
      'Use the shorthand (`:` and `@`) consistently across a codebase — mixing full and shorthand syntax for no reason hurts scanability. Reserve dynamic arguments (`:[attr]`) for genuinely dynamic cases; hardcode the attribute name whenever it is known ahead of time for better readability and IDE tooling support.',
    source: 'Vue.js Docs — Template Syntax: v-bind Shorthand',
  },
  {
    id: 'b04',
    topic: 'v-if vs v-show',
    question: 'What is the key behavioral difference between `v-if` and `v-show`?',
    code: null,
    options: [
      'They are functionally identical — `v-show` is just deprecated syntax for `v-if`',
      '`v-if` actually adds/removes the element (and its component) from the DOM; `v-show` always renders the element but toggles `display: none`',
      '`v-if` only works on `<template>` tags; `v-show` works on any element',
      '`v-show` triggers component lifecycle hooks (mounted/unmounted); `v-if` does not',
    ],
    correctIndex: 1,
    explanation:
      '`v-if` is "real" conditional rendering: when the condition is false, Vue destroys the element and any child components entirely — lifecycle hooks like `unmounted` fire, and event listeners are cleaned up. Toggling it back to true re-creates everything from scratch, including running `mounted` again and resetting local component state. `v-show` always renders the element into the DOM and merely toggles the CSS `display` property, so initial render cost is paid once regardless of the condition, and no lifecycle hooks fire on toggle. `v-if` also supports `v-else-if`/`v-else` chains; `v-show` does not.',
    compiledJS:
      "<template>\n  <!-- v-if: element is added/removed from the DOM -->\n  <ExpensiveWidget v-if=\"showWidget\" />\n  <!-- toggling showWidget re-mounts the whole component -->\n\n  <!-- v-show: element always exists, display is toggled -->\n  <ExpensiveWidget v-show=\"showWidget\" />\n  <!-- style=\"display: none\" when showWidget is false -->\n  <!-- mounted() only fires ONCE regardless of toggles -->\n</template>",
    bestPractice:
      'Use `v-show` for elements that toggle frequently (tabs, dropdowns) since it avoids the re-mount cost. Use `v-if` for content that rarely changes visibility or where you genuinely want the component destroyed (to reset its internal state, stop timers, or avoid rendering expensive content that is rarely shown at all).',
    source: 'Vue.js Docs — Conditional Rendering: v-if vs v-show',
  },
  {
    id: 'b05',
    topic: 'v-for and :key',
    question: 'Why does Vue require (or strongly recommend) a `:key` binding on elements rendered with `v-for`?',
    code: null,
    options: [
      '`:key` is purely cosmetic and only affects the value returned by `element.dataset.key`',
      'It gives Vue a stable identity per item so it can correctly track, reorder, and reuse DOM nodes/component instances across re-renders instead of patching by index',
      'It is required only for `<template>` elements, never for regular HTML tags',
      '`:key` improves network performance by caching the API response for that list item',
    ],
    correctIndex: 1,
    explanation:
      'Vue\'s virtual DOM diffing algorithm, by default, tries to patch existing DOM nodes in place for efficiency. Without a `key`, Vue falls back to in-place patching by index, which can cause it to reuse the wrong DOM node or component instance when the list is reordered, filtered, or has items inserted/removed from the middle — leading to bugs like form inputs retaining stale values or transition animations misfiring. A stable `:key` (typically an item ID, never the array index for mutable lists) lets Vue\'s diff algorithm match old and new nodes by identity, correctly moving, creating, or destroying only what actually changed.',
    compiledJS:
      "<template>\n  <!-- BAD: index as key breaks on reorder/insert/delete -->\n  <li v-for=\"(item, index) in items\" :key=\"index\">\n    {{ item.name }}\n  </li>\n\n  <!-- GOOD: stable identity from the data itself -->\n  <li v-for=\"item in items\" :key=\"item.id\">\n    {{ item.name }}\n  </li>\n</template>\n\n<!-- Symptom without proper keys: inserting an item at\n     index 0 causes Vue to think item[0] changed value,\n     not that a new item was added — any local component\n     state (e.g. an open <details> or input value) stays\n     attached to the wrong row. -->",
    bestPractice:
      'Always use a unique, stable ID from your data as `:key` — never the array index unless the list is strictly static and never reordered/filtered/mutated. When items lack a natural ID, generate one when the data is fetched or created, not on every render (a `Math.random()` key defeats the purpose entirely by changing every re-render).',
    source: 'Vue.js Docs — List Rendering: Maintaining State with key',
  },
  {
    id: 'b06',
    topic: 'ref()',
    question: 'What does `ref()` do in the Vue 3 Composition API, and why must you access its value via `.value` in `<script setup>`?',
    code: null,
    options: [
      '`ref()` creates a plain DOM element reference, identical to `document.querySelector`',
      '`ref()` wraps a value in a reactive object with a `.value` property, because primitives (numbers, strings, booleans) cannot be made reactive directly — only objects can be observed via Proxy',
      '`.value` is only needed for TypeScript type-checking and has no runtime purpose',
      '`ref()` is a legacy Vue 2 API kept only for backward compatibility',
    ],
    correctIndex: 1,
    explanation:
      'Vue 3\'s reactivity system is built on JavaScript `Proxy`, which can only intercept property access on objects — it cannot make a raw primitive like `let count = 0` reactive, because reassigning `count = 1` is just a variable rebind with no way for Vue to intercept it. `ref()` solves this by always wrapping the value in an object `{ value: ... }`, so `count.value = 1` is a property write that the Proxy can detect and use to trigger updates. In `<script setup>` templates, Vue automatically unwraps top-level refs so you write `{{ count }}` instead of `{{ count.value }}` — but inside `<script>` code you must always use `.value` explicitly.',
    compiledJS:
      "<script setup>\nimport { ref } from 'vue'\n\nconst count = ref(0)\nconsole.log(count)        // RefImpl { value: 0, ... }\nconsole.log(count.value)  // 0\n\nfunction increment() {\n  count.value++  // must use .value inside <script>\n}\n</script>\n\n<template>\n  <!-- auto-unwrapped in template — no .value needed -->\n  <button @click=\"increment\">{{ count }}</button>\n</template>",
    bestPractice:
      'Use `ref()` for primitives and for values you plan to reassign wholesale (e.g. `data.value = newArray`). Use `reactive()` for objects you will mutate property-by-property. Never destructure a `reactive()` object\'s properties directly (it loses reactivity) — use `toRefs()` if you need to destructure while preserving reactivity.',
    source: 'Vue.js Docs — Reactivity Fundamentals: ref()',
  },
  {
    id: 'b07',
    topic: 'computed()',
    question: 'What is the primary advantage of a `computed` property over calling a plain method in a template?',
    code: null,
    options: [
      'Computed properties execute on the server only, reducing client bundle size',
      'Computed properties cache their result and only re-evaluate when one of their reactive dependencies actually changes; a method re-runs on every single re-render',
      'There is no difference — `computed` is purely stylistic sugar around `methods`',
      'Computed properties can accept arguments, while methods cannot',
    ],
    correctIndex: 1,
    explanation:
      'A `computed` property is a reactive value derived from other reactive state. Vue tracks exactly which reactive properties it reads during evaluation and caches the result — subsequent accesses return the cached value instantly until one of those tracked dependencies changes, at which point it re-evaluates lazily (on next access, not immediately). A method called in a template (e.g. `{{ getFullName() }}`) re-executes on every single component re-render regardless of whether its inputs changed, because templates re-run the entire render function on each update. For expensive derivations, this caching difference is significant — and it is also the opposite of methods, which cannot take arguments in the caching sense that matters here.',
    compiledJS:
      "<script setup>\nimport { ref, computed } from 'vue'\n\nconst firstName = ref('Ada')\nconst lastName = ref('Lovelace')\n\n// Cached — only recomputes when firstName/lastName change\nconst fullName = computed(() => {\n  console.log('computing fullName')\n  return `${firstName.value} ${lastName.value}`\n})\n\n// Re-runs on EVERY render, even for unrelated state changes\nfunction getFullNameMethod() {\n  console.log('calling method')\n  return `${firstName.value} ${lastName.value}`\n}\n</script>\n\n<template>\n  <!-- logs 'computing fullName' only when names change -->\n  <p>{{ fullName }}</p>\n  <!-- logs 'calling method' on every re-render -->\n  <p>{{ getFullNameMethod() }}</p>\n</template>",
    bestPractice:
      'Default to `computed` for any value derived purely from other reactive state — it is both faster and more declarative. Reach for a `method` only when the operation has side effects, needs to run on a specific event (like a click), or genuinely needs per-call arguments that vary independently of reactive state.',
    source: 'Vue.js Docs — Computed Properties',
  },
  {
    id: 'b08',
    topic: 'Props Declaration',
    question: 'How do you declare that a child component accepts a required `title` prop of type `String` using `<script setup>`?',
    code: null,
    options: [
      '`const props = ref({ title: String })`',
      '`defineProps({ title: { type: String, required: true } })`',
      '`export const title = String`',
      '`this.props.title = String`',
    ],
    correctIndex: 1,
    explanation:
      '`defineProps()` is a compiler macro available only inside `<script setup>` — it does not need to be imported and is compiled away, replaced with the actual props declaration. Passing an object with `type` and `required` (or `default`) gives Vue runtime prop validation: in development mode, Vue logs a console warning if a required prop is missing or if the passed value does not match the declared type. Props declared this way are automatically exposed to the template and are read-only from the child\'s perspective — attempting to mutate `props.title` directly is a Vue anti-pattern that triggers a warning, since props should flow down and events should flow up.',
    compiledJS:
      "<script setup>\ndefineProps({\n  title: {\n    type: String,\n    required: true,\n  },\n  count: {\n    type: Number,\n    default: 0,\n  },\n})\n</script>\n\n<template>\n  <h2>{{ title }}</h2>\n  <p>Count: {{ count }}</p>\n</template>\n\n<!-- Parent usage: -->\n<!-- <ChildCard title=\"Hello\" :count=\"5\" /> -->\n<!-- Omitting title logs a dev warning: -->\n<!-- [Vue warn]: Missing required prop: \"title\" -->",
    bestPractice:
      'Always declare `type` and `required`/`default` explicitly rather than using the array shorthand (`defineProps([\'title\'])`) — the object form gives you runtime validation and much better editor autocompletion. In TypeScript projects, prefer the type-based syntax `defineProps<{ title: string }>()` so validation is enforced at compile time as well.',
    source: 'Vue.js Docs — Component Basics: Props',
  },
  {
    id: 'b09',
    topic: 'emit()',
    question: 'In a child component using `<script setup>`, what is the correct way to notify the parent that a "submit" event occurred, optionally passing a payload?',
    code: null,
    options: [
      '`this.$parent.onSubmit(payload)`',
      "const emit = defineEmits(['submit']); emit('submit', payload)",
      '`window.dispatchEvent(new CustomEvent(\'submit\', payload))`',
      '`props.onSubmit(payload)`',
    ],
    correctIndex: 1,
    explanation:
      '`defineEmits()` is the compiler macro that declares which custom events a component can emit — analogous to `defineProps()` for inbound data. Calling the returned `emit()` function triggers the event, and any extra arguments become the event payload, which the parent receives as arguments to its `@submit` handler. This is Vue\'s one-way-data-flow convention: props flow down from parent to child, and events flow up from child to parent — the child never directly calls a method on `$parent` (which tightly couples components and breaks if the component hierarchy changes) or reaches for browser-global `CustomEvent`, which bypasses Vue\'s component event system entirely.',
    compiledJS:
      "<!-- ChildForm.vue -->\n<script setup>\nconst emit = defineEmits(['submit'])\n\nfunction handleClick() {\n  emit('submit', { name: 'Ada', email: 'ada@example.com' })\n}\n</script>\n\n<template>\n  <button @click=\"handleClick\">Submit</button>\n</template>\n\n<!-- ParentForm.vue -->\n<template>\n  <ChildForm @submit=\"onSubmit\" />\n</template>\n<script setup>\nfunction onSubmit(payload) {\n  console.log(payload) // { name: 'Ada', email: 'ada@example.com' }\n}\n</script>",
    bestPractice:
      'Always declare emitted events explicitly with `defineEmits([\'eventName\'])` (or the object form for payload validation) — undeclared emits still work but lose documentation value and IDE support, and Vue cannot warn you about typos. Name events in kebab-case in templates (`@my-event`) even though you emit them in camelCase in script, matching native HTML attribute conventions.',
    source: 'Vue.js Docs — Component Basics: Listening to Events',
  },
  {
    id: 'b10',
    topic: 'Single-File Components',
    question: 'What are the three top-level blocks that make up a standard Vue Single-File Component (`.vue` file)?',
    code: null,
    options: [
      '`<head>`, `<body>`, `<footer>`',
      '`<template>`, `<script>`, `<style>`',
      '`<html>`, `<js>`, `<css>`',
      '`<render>`, `<data>`, `<methods>`',
    ],
    correctIndex: 1,
    explanation:
      'A `.vue` Single-File Component (SFC) co-locates a component\'s markup, logic, and styling in one file using three optional-but-conventional top-level blocks: `<template>` holds the HTML-like markup that compiles to a render function; `<script>` (or `<script setup>`) holds the JavaScript/TypeScript logic; `<style>` holds CSS, which can be scoped to just that component with the `scoped` attribute to avoid leaking styles globally. Build tooling (Vite, Vue CLI with `vue-loader`) compiles these blocks at build time — browsers never receive raw `.vue` files. This co-location is a deliberate design choice: instead of splitting a component across separate HTML/JS/CSS files (organized by file type), Vue groups by feature/component, which scales better as an app grows.',
    compiledJS:
      "<!-- UserCard.vue -->\n<template>\n  <div class=\"user-card\">{{ user.name }}</div>\n</template>\n\n<script setup>\nimport { defineProps } from 'vue'\nconst props = defineProps({ user: Object })\n</script>\n\n<style scoped>\n.user-card {\n  padding: 1rem;\n  border-radius: 8px;\n}\n/* scoped: compiles to a unique data-v-xxxxx attribute\n   selector so these styles never leak to other components */\n</style>",
    bestPractice:
      'Use `scoped` styles by default to prevent CSS from one component bleeding into another. For truly shared/global styles (resets, design tokens), put them in a separate non-scoped stylesheet imported once at the app root rather than duplicating them across many SFCs. Keep `<script setup>` at the top of the file (before `<template>`) — it is the conventional ordering that most style guides and linters enforce.',
    source: 'Vue.js Docs — Single-File Components',
  },

  // ── Intermediate ──────────────────────────────────────────────────────────
  {
    id: 'i01',
    topic: 'ref vs reactive',
    question: 'What is the main practical difference between `ref({ count: 0 })` and `reactive({ count: 0 })`, and why does replacing the whole object matter?',
    code: null,
    options: [
      'They are functionally identical in every scenario — `ref` is just a deprecated alias',
      "`reactive()` returns a Proxy directly, so `state.count` works without `.value`, but reassigning the whole object (`state = newObj`) breaks reactivity because it replaces the Proxy reference; `ref()`'s `.value` can be reassigned wholesale because `.value` itself is the reactive binding point",
      '`ref` only works with primitives; `reactive` only works with objects, and they throw errors if used incorrectly',
      '`reactive()` is synchronous while `ref()` is asynchronous and requires `await`',
    ],
    correctIndex: 1,
    explanation:
      '`reactive()` wraps an object in a Proxy and returns that Proxy directly — property access/writes go through the Proxy traps, giving you ergonomic dot-notation without `.value`. But the reactivity lives in the Proxy object itself: if you do `let state = reactive({ count: 0 }); state = { count: 5 }`, you have just pointed the `state` variable at a brand-new plain object, completely disconnected from Vue\'s tracking — any template or effect still watching the original Proxy sees no update. `ref()` sidesteps this by always keeping a stable wrapper object `{ value }`; reassigning `.value` is a tracked property write on that stable wrapper, so `myRef.value = newObject` works correctly and triggers updates. This is why many style guides recommend `ref()` even for objects — it is harder to accidentally break.',
    compiledJS:
      "import { ref, reactive } from 'vue'\n\n// reactive() — breaks if reassigned\nlet state = reactive({ count: 0 })\nstate = { count: 5 } // BUG: disconnects from Vue's tracking\n// any watcher/template bound to the original `state` is now stale\n\n// ref() — safe to reassign wholesale\nconst stateRef = ref({ count: 0 })\nstateRef.value = { count: 5 } // WORKS: .value is the tracked binding\n\n// Correct way to \"replace\" a reactive object in place:\nconst state2 = reactive({ count: 0 })\nObject.assign(state2, { count: 5 }) // mutates in place, stays reactive",
    bestPractice:
      'Prefer `ref()` for values that might be reassigned as a whole (fetched API responses, swapped-out arrays) and for primitives. Reserve `reactive()` for object state you will only ever mutate property-by-property and never reassign. Never destructure a `reactive()` object directly — use `toRefs()` first, or the destructured variables lose their reactive connection.',
    source: 'Vue.js Docs — Reactivity Fundamentals: Limitations of reactive()',
  },
  {
    id: 'i02',
    topic: 'computed vs watch',
    question: 'When should you reach for `watch()` instead of a `computed` property?',
    code: null,
    options: [
      '`watch` should always be preferred — `computed` is a legacy Vue 2 API',
      'When you need to perform a side effect (an API call, a DOM manipulation, logging) in response to a reactive value changing, rather than deriving a new value to render',
      'They are interchangeable in all cases with no meaningful difference',
      '`watch` is required whenever more than one reactive dependency is involved',
    ],
    correctIndex: 1,
    explanation:
      '`computed` is for pure, synchronous derivation — take some reactive state, return a new value, with no side effects. It is lazy (only recomputes when accessed after a dependency changes) and cached. `watch` is for reacting to change with a side effect: fetching data when a route param changes, persisting a value to localStorage, imperatively animating something, or calling `console.log` for debugging. `watch` gives you both the old and new value, lets you control timing (`immediate`, `flush: \'post\'` to run after the DOM updates), and can be deep (`{ deep: true }`) for nested object mutations. Using `computed` to trigger a side effect (e.g. calling `fetch()` inside the computed getter) is an anti-pattern because computed getters should be pure and free of side effects — Vue may call them more or fewer times than you expect during dependency tracking.',
    compiledJS:
      "import { ref, computed, watch } from 'vue'\n\nconst searchQuery = ref('')\nconst results = ref([])\n\n// GOOD: computed for pure derivation\nconst queryLength = computed(() => searchQuery.value.length)\n\n// GOOD: watch for a side effect (API call)\nwatch(searchQuery, async (newQuery, oldQuery) => {\n  if (!newQuery) { results.value = []; return }\n  const res = await fetch(`/api/search?q=${newQuery}`)\n  results.value = await res.json()\n}, { immediate: false })\n\n// BAD: side effect inside computed — do not do this\nconst badResults = computed(() => {\n  fetch(`/api/search?q=${searchQuery.value}`) // impure!\n  return []\n})",
    bestPractice:
      'Ask: "am I deriving a value to display, or am I reacting to a change with an effect?" — the former is `computed`, the latter is `watch` (or `watchEffect`). Always clean up side effects a watcher starts (timers, subscriptions) either by returning a cleanup or using `onCleanup` in `watchEffect`, so stale effects do not pile up across re-runs.',
    source: 'Vue.js Docs — Computed Properties vs. Watchers',
  },
  {
    id: 'i03',
    topic: 'watchEffect',
    question: 'How does `watchEffect(fn)` decide which reactive sources to track, compared to `watch(source, fn)`?',
    code: null,
    options: [
      'It requires you to pass an explicit array of dependencies, just like React\'s `useEffect`',
      'It automatically tracks every reactive property accessed synchronously during its first run, with no explicit source list needed, and re-runs whenever any of those tracked properties change',
      'It never re-runs — it only executes once, at component mount',
      'It only tracks `ref()` values, never `reactive()` object properties',
    ],
    correctIndex: 1,
    explanation:
      '`watchEffect` runs its callback immediately (unlike `watch`, which is lazy by default) and, during that run, Vue automatically records every reactive property the function read — no explicit dependency array required, similar in spirit to how `computed` auto-tracks, but for side effects instead of pure derivation. On any subsequent change to any tracked dependency, the whole function re-runs and dependency tracking happens again (so conditionally-accessed dependencies can change between runs, unlike `computed`\'s implicit stability). This automatic tracking is convenient but also a footgun: if a dependency is only read inside an `if` branch that is not taken on the first run, it will not be tracked until it actually gets read.',
    compiledJS:
      "import { ref, watchEffect } from 'vue'\n\nconst id = ref(1)\nconst includeDetails = ref(false)\n\nwatchEffect(() => {\n  console.log('fetching for id', id.value)\n  if (includeDetails.value) {\n    console.log('also fetching details') // only tracked once this branch runs\n  }\n})\n// Runs immediately: logs 'fetching for id 1'\n// (includeDetails NOT yet tracked — branch never executed)\n\nid.value = 2\n// Re-runs: logs 'fetching for id 2' — tracked correctly\n\nincludeDetails.value = true\n// Re-runs (includeDetails IS tracked now, from the last run)\n// logs 'fetching for id 2' then 'also fetching details'",
    bestPractice:
      'Use `watchEffect` for effects whose dependencies are naturally discovered by reading them (e.g. syncing several related values to an API call). Use explicit `watch(source, fn)` when you need the old value, want lazy execution (no immediate run), or want to watch a specific property without accidentally tracking everything else the function happens to touch.',
    source: 'Vue.js Docs — Watchers: watchEffect()',
  },
  {
    id: 'i04',
    topic: 'Composition vs Options API',
    question: 'What is the core structural difference between the Options API and the Composition API in Vue 3?',
    code: null,
    options: [
      'The Options API is faster at runtime; Composition API is only for smaller components',
      'Options API organizes code by option type (data, methods, computed all in separate blocks); Composition API organizes code by logical concern, letting related state, computed values, and functions for one feature live together and be extracted into reusable composables',
      'The Composition API cannot access component lifecycle hooks',
      'They compile to completely different, incompatible virtual DOM formats',
    ],
    correctIndex: 1,
    explanation:
      'In the Options API, a component\'s logic is split across fixed sections — all reactive state in `data()`, all derived values in `computed`, all functions in `methods`, all side effects in lifecycle hooks like `mounted()`. For a component with several unrelated features, this means the code for a single feature is scattered across multiple sections of the file. The Composition API (`setup()` or `<script setup>`) instead lets you group all the code for one feature — its state, computed values, watchers, and functions — together in one place, and that group can be extracted into a standalone "composable" function (e.g. `useMousePosition()`) and reused across components with zero mixin-related naming collisions. Both APIs compile to the same underlying reactivity system and virtual DOM — this is a code-organization difference, not a runtime architecture difference.',
    compiledJS:
      "// Options API — logic split by option type\nexport default {\n  data() {\n    return { count: 0, name: '' }\n  },\n  computed: {\n    doubled() { return this.count * 2 }\n  },\n  methods: {\n    increment() { this.count++ }\n  },\n  mounted() {\n    console.log('mounted')\n  },\n}\n\n// Composition API — logic grouped by feature\nimport { ref, computed, onMounted } from 'vue'\n\nexport default {\n  setup() {\n    // 'counter' feature, all together\n    const count = ref(0)\n    const doubled = computed(() => count.value * 2)\n    function increment() { count.value++ }\n\n    onMounted(() => console.log('mounted'))\n\n    return { count, doubled, increment }\n  },\n}",
    bestPractice:
      'For small, simple components, the Options API remains perfectly valid and arguably more readable. Reach for the Composition API when a component has multiple distinct concerns that would benefit from extraction into composables, or when you need better TypeScript inference — the Composition API infers types far more reliably than Options API `this`.',
    source: 'Vue.js Docs — Composition API FAQ',
  },
  {
    id: 'i05',
    topic: 'provide/inject',
    question: 'What problem does `provide()`/`inject()` solve that plain props cannot solve cleanly?',
    code: null,
    options: [
      'It replaces Vuex/Pinia entirely and is the recommended way to manage all application state',
      'It lets an ancestor component pass data directly to any descendant, no matter how deeply nested, without manually threading props through every intermediate component ("prop drilling")',
      'It allows sibling components to communicate directly without a common parent',
      '`provide`/`inject` only work between a component and its immediate children, same as props',
    ],
    correctIndex: 1,
    explanation:
      'Without `provide`/`inject`, passing data from a top-level component to a deeply nested descendant requires every intermediate component to accept the value as a prop and re-pass it down, even if those intermediate components have no use for the data themselves — this is "prop drilling," and it makes intermediate components more coupled to data they do not care about. `provide(key, value)` in an ancestor makes `value` available to `inject(key)` in any descendant, at any depth, without any component in between needing to know about it. Vue 3\'s `provide`/`inject` is reactive by default when the provided value is a `ref` or `reactive` object, so descendants see updates. It is not a full state-management replacement — for complex cross-cutting app state with devtools, time-travel debugging, and structured mutations, Pinia is still the recommended tool.',
    compiledJS:
      "// GrandParent.vue\n<script setup>\nimport { provide, ref } from 'vue'\nconst theme = ref('dark')\nprovide('theme', theme) // key + reactive value\n</script>\n<template><Parent /></template>\n\n// Parent.vue — has ZERO knowledge of 'theme'\n<template><Child /></template>\n\n// Child.vue — several levels deep\n<script setup>\nimport { inject } from 'vue'\nconst theme = inject('theme', 'light') // 2nd arg = default fallback\n</script>\n<template><div :class=\"theme\">{{ theme }}</div></template>",
    bestPractice:
      'Use string constants (or better, Symbols) as injection keys shared via a dedicated file to avoid typos and key collisions across a large app. Provide a default value as inject\'s second argument so components can still render meaningfully outside the expected provider tree (useful for component libraries and testing in isolation).',
    source: 'Vue.js Docs — Provide / Inject',
  },
  {
    id: 'i06',
    topic: 'Slots',
    question: 'What is the difference between a default slot and a named slot in a Vue component?',
    code: null,
    options: [
      'There is no difference — "named" slots are just an alternate syntax for the same mechanism with no behavior change',
      'A default slot receives any content placed directly inside the component tags with no `v-slot` target; a named slot lets a component expose multiple distinct content injection points, each addressed via `<template #slotName>`',
      'Named slots can only pass static text, never dynamic reactive content',
      'A component can only have one slot total — either default or named, never both',
    ],
    correctIndex: 1,
    explanation:
      'Slots are Vue\'s mechanism for content distribution — letting a parent inject markup into specific locations within a child component\'s template, analogous to React\'s `children` prop but far more flexible. The default slot (`<slot />` in the child) captures any content the parent places between the component\'s opening/closing tags without an explicit target. Named slots (`<slot name="header" />` in the child, `<template #header>` in the parent) let a single component expose multiple distinct injection points — e.g. a `Card` component with separate `header`, `default`, and `footer` slots. Scoped slots additionally let the child pass data back up to the parent\'s slot content via slot props, useful for components like a data table that renders each row but lets the parent customize per-cell markup.',
    compiledJS:
      "<!-- Card.vue -->\n<template>\n  <div class=\"card\">\n    <header><slot name=\"header\">Default Header</slot></header>\n    <main><slot /></main>\n    <!-- ^ default slot -->\n    <footer><slot name=\"footer\" /></footer>\n  </div>\n</template>\n\n<!-- Usage -->\n<Card>\n  <template #header>\n    <h2>Custom Title</h2>\n  </template>\n\n  <p>This goes into the default slot.</p>\n\n  <template #footer>\n    <button>Close</button>\n  </template>\n</Card>",
    bestPractice:
      'Provide sensible fallback content inside `<slot>` tags (as with the header example above) so components remain usable without every slot being filled. Use scoped slots when a child needs to expose internal iteration data (like row items) to customizable parent-provided markup, rather than forcing the parent to duplicate the child\'s data-fetching logic.',
    source: 'Vue.js Docs — Slots',
  },
  {
    id: 'i07',
    topic: 'Lifecycle Hooks',
    question: 'In the Composition API, which hook runs after the component has been mounted and its DOM elements are accessible, making it the right place to, e.g., initialize a third-party DOM library?',
    code: null,
    options: [
      '`onBeforeMount`',
      '`onMounted`',
      '`onCreated`',
      '`onUpdated`',
    ],
    correctIndex: 1,
    explanation:
      '`onMounted` fires after the component\'s initial render has been committed to the actual DOM — template refs are populated and any DOM library that needs a real element to attach to (chart libraries, date pickers, video players) can safely be initialized here. `onBeforeMount` fires just before the initial render, so the DOM does not exist yet. There is no `onCreated` hook in the Composition API at all — code that would go in Options API\'s `created()` simply runs as plain top-level code in `setup()`/`<script setup>`, since `setup()` itself already runs after props resolution but before rendering. `onUpdated` fires after a re-render caused by a reactive data change, not after the initial mount, and firing DOM library initialization there on every update would re-initialize it repeatedly, which is almost always a bug.',
    compiledJS:
      "<script setup>\nimport { ref, onMounted, onUpdated, onBeforeMount } from 'vue'\n\nconst chartEl = ref(null) // template ref\n\nonBeforeMount(() => {\n  console.log(chartEl.value) // null — DOM not created yet\n})\n\nonMounted(() => {\n  console.log(chartEl.value) // <div> — real DOM element!\n  // safe to initialize a chart library here:\n  // new Chart(chartEl.value, { ... })\n})\n\nonUpdated(() => {\n  console.log('DOM re-rendered after a reactive change')\n})\n</script>\n\n<template>\n  <div ref=\"chartEl\"></div>\n</template>",
    bestPractice:
      'Always pair DOM/resource initialization in `onMounted` with cleanup in `onUnmounted` (destroy chart instances, remove event listeners, clear intervals) to avoid memory leaks when the component is later removed. Avoid heavy synchronous work in `onUpdated` — since it fires on every re-render, expensive work there can cause visible jank.',
    source: 'Vue.js Docs — Lifecycle Hooks',
  },
  {
    id: 'i08',
    topic: 'Custom v-model',
    question: 'What must a component do internally to support `v-model` binding from its parent (e.g. `<CustomInput v-model="text" />`)?',
    code: null,
    options: [
      'Nothing — `v-model` works automatically on any component with no configuration',
      'Accept a `modelValue` prop and emit an `update:modelValue` event with the new value; `v-model` is syntactic sugar that expands to `:modelValue` + `@update:modelValue`',
      'Import a special `useVModel()` composable from Vue Router',
      'Declare the component with `defineModel: true` in its options',
    ],
    correctIndex: 1,
    explanation:
      'On a component, `v-model="text"` is compiler sugar that expands to `:modelValue="text" @update:modelValue="text = $event"`. For a component to participate correctly, it needs to accept a prop named `modelValue` (displaying/using that value internally) and emit an `update:modelValue` event with the new value whenever the user interacts with it — typically wiring its own internal `<input>`\'s native `input`/`change` event to re-emit `update:modelValue`. Vue 3.4+ also offers the `defineModel()` compiler macro, which generates this prop+emit pair automatically and returns a ref you can bind directly, removing most of the boilerplate. You can also support multiple named `v-model`s on one component (`v-model:title`, `v-model:content`) by using a matching prop/event name instead of the default `modelValue`.',
    compiledJS:
      "<!-- CustomInput.vue — manual approach -->\n<script setup>\ndefineProps(['modelValue'])\ndefineEmits(['update:modelValue'])\n</script>\n<template>\n  <input\n    :value=\"modelValue\"\n    @input=\"$emit('update:modelValue', $event.target.value)\"\n  />\n</template>\n\n<!-- CustomInput.vue — Vue 3.4+ defineModel() shortcut -->\n<script setup>\nconst model = defineModel()\n</script>\n<template>\n  <input v-model=\"model\" />\n</template>\n\n<!-- Parent usage (identical for both): -->\n<!-- <CustomInput v-model=\"text\" /> -->",
    bestPractice:
      'Prefer `defineModel()` in Vue 3.4+ projects — it eliminates the manual prop/emit wiring and reduces bugs from mismatched event names. For components needing multiple independent two-way bindings, use named model arguments (`defineModel(\'title\')`, bound as `v-model:title`) rather than cramming multiple concerns into one `modelValue`.',
    source: 'Vue.js Docs — Component v-model',
  },
  {
    id: 'i09',
    topic: 'Teleport',
    question: 'What problem does the `<Teleport>` built-in component solve?',
    code: null,
    options: [
      'It lazy-loads a component only when it scrolls into the viewport',
      "It renders a component's content at a different location in the actual DOM tree (e.g. as a direct child of <body>) while keeping it logically part of the component that declared it, which is essential for modals/tooltips that need to escape a parent's overflow:hidden or z-index stacking context",
      'It is Vue\'s built-in solution for server-side rendering hydration',
      'It replaces `v-if` for conditionally rendering content',
    ],
    correctIndex: 1,
    explanation:
      'Modals, tooltips, and dropdowns often need to render outside their logical parent\'s DOM position to avoid being clipped by an ancestor\'s `overflow: hidden` or trapped under a lower `z-index` stacking context. Before `<Teleport>`, working around this required directly manipulating the DOM outside Vue\'s control, breaking Vue\'s declarative model. `<Teleport to="body">` moves its slot content to the specified target element in the actual DOM at render time, while keeping the component instance logically nested where it was declared — so it still has access to the parent\'s props, injected values, and participates in the same component tree for devtools and event propagation purposes. Only the DOM location changes, not the logical component hierarchy.',
    compiledJS:
      "<template>\n  <div class=\"card\" style=\"overflow: hidden;\">\n    <button @click=\"showModal = true\">Open Modal</button>\n\n    <!-- Without Teleport, this modal would be clipped by\n         the card's overflow: hidden -->\n    <Teleport to=\"body\">\n      <div v-if=\"showModal\" class=\"modal-overlay\">\n        <div class=\"modal\">\n          <p>I render as a direct child of &lt;body&gt;,\n             escaping the card's clipping context.</p>\n          <button @click=\"showModal = false\">Close</button>\n        </div>\n      </div>\n    </Teleport>\n  </div>\n</template>",
    bestPractice:
      'Always pair `<Teleport>` with `v-if` (not just relying on the teleport target being hidden) to avoid rendering invisible-but-present modal markup that could still trap focus or be reachable via keyboard tabbing. Use a dedicated, stable target element (e.g. `<div id="modal-root">` in your `index.html`) rather than teleporting directly to `body` when you need more control over stacking or need multiple teleport targets.',
    source: 'Vue.js Docs — Teleport',
  },
  {
    id: 'i10',
    topic: 'KeepAlive',
    question: 'What does wrapping a dynamic component in `<KeepAlive>` accomplish?',
    code: null,
    options: [
      'It prevents the component from ever being garbage collected, causing an intentional memory leak for caching purposes only',
      'It caches inactive component instances instead of destroying them, so switching back to a previously visited component restores its previous state instantly without re-running its full mount lifecycle',
      'It keeps a component\'s network requests alive in the background even when the component is not rendered',
      'It is required for `<Transition>` animations to work at all',
    ],
    correctIndex: 1,
    explanation:
      'By default, when a dynamic component (via `<component :is="...">`) or a `v-if`-toggled component is switched away from, Vue destroys the old instance entirely — losing all local state, scroll position, and form input values, and running `unmounted` cleanup. `<KeepAlive>` intercepts this: instead of destroying, it deactivates the component (removing it from the DOM but keeping the instance alive in memory) and caches it. Switching back reactivates the cached instance, restoring exactly the state it had when deactivated, and firing `activated`/`deactivated` hooks instead of the full `mounted`/`unmounted` cycle. This is commonly used for tabbed interfaces where switching tabs should preserve scroll position and form state, or multi-step wizards where going back to a previous step should not reset it.',
    compiledJS:
      "<template>\n  <KeepAlive>\n    <component :is=\"activeTabComponent\" />\n  </KeepAlive>\n</template>\n\n<script setup>\nimport { ref, onActivated, onDeactivated } from 'vue'\nconst activeTabComponent = ref(TabA)\n</script>\n\n<!-- Inside TabA.vue: -->\n<script setup>\nimport { ref, onActivated, onDeactivated } from 'vue'\nconst scrollPos = ref(0)\n\nonActivated(() => {\n  window.scrollTo(0, scrollPos.value) // restore state\n})\nonDeactivated(() => {\n  scrollPos.value = window.scrollY // save state before hiding\n})\n</script>",
    bestPractice:
      'Use `<KeepAlive :include="[\'TabA\', \'TabB\']">` (or `:exclude`) to limit caching to specific named components rather than caching everything indiscriminately, which can grow memory usage unbounded in apps with many dynamic views. Use `activated`/`deactivated` hooks instead of `mounted`/`unmounted` for setup/teardown logic in components that live inside a `KeepAlive`, since `mounted` only fires once for the instance\'s entire cached lifetime.',
    source: 'Vue.js Docs — KeepAlive',
  },

  // ── Advanced ──────────────────────────────────────────────────────────────
  {
    id: 'a01',
    topic: 'Reactivity Internals',
    question: 'How does Vue 3\'s reactivity system detect that a component needs to re-render when a reactive property changes, at a mechanical level?',
    code: null,
    options: [
      'Vue polls all reactive objects on a timer (e.g. every 16ms) and diffs their JSON representation against the previous snapshot',
      'A `Proxy` intercepts property get/set operations; during a component\'s render, every reactive property read is recorded as a dependency of that render\'s "effect," and when a `set` trap fires on a tracked property, Vue re-runs every effect that depends on it',
      'Every reactive object maintains a linked list of every component in the entire application and re-renders all of them on any change',
      'Vue relies entirely on the browser\'s native `MutationObserver` API to detect DOM changes and infer what data changed',
    ],
    correctIndex: 1,
    explanation:
      'Vue 3\'s reactivity core wraps reactive objects in a `Proxy` with `get`/`set` traps. Every reactive computation — a component\'s render function, a `computed`, a `watchEffect` — runs inside a tracked "effect." While the effect function executes, every property `get` that passes through the Proxy calls `track()`, which records that this specific property (on this specific object) is a dependency of the currently-running effect, using a global "targetMap" (WeakMap of objects → Map of property keys → Set of effects). When a `set` trap fires on a tracked property, Vue calls `trigger()`, which looks up exactly which effects depend on that specific property and only re-runs those — not the whole app. This fine-grained, per-property dependency tracking is what allows Vue to update only the DOM parts that actually depend on the changed data, without a full virtual-DOM diff of the entire tree on every single mutation (though the affected component\'s render function itself still produces and diffs a new vnode tree).',
    compiledJS:
      "// Simplified mental model of Vue's reactivity core:\nconst targetMap = new WeakMap() // object -> Map<key, Set<effect>>\nlet activeEffect = null\n\nfunction track(target, key) {\n  if (!activeEffect) return\n  let depsMap = targetMap.get(target)\n  if (!depsMap) targetMap.set(target, (depsMap = new Map()))\n  let dep = depsMap.get(key)\n  if (!dep) depsMap.set(key, (dep = new Set()))\n  dep.add(activeEffect)\n}\n\nfunction trigger(target, key) {\n  const dep = targetMap.get(target)?.get(key)\n  dep?.forEach(effect => effect())\n}\n\nfunction reactive(obj) {\n  return new Proxy(obj, {\n    get(target, key) {\n      track(target, key)\n      return target[key]\n    },\n    set(target, key, value) {\n      target[key] = value\n      trigger(target, key) // only re-runs effects that read THIS key\n      return true\n    },\n  })\n}",
    bestPractice:
      'Understand that reactivity tracking only happens for properties accessed synchronously inside a tracked effect — accessing a reactive property inside a `setTimeout` or after an `await` inside a `computed` will not be tracked, a common source of "my computed isn\'t updating" bugs. Avoid destructuring reactive objects outside of `toRefs()`, since destructured primitives are copies that lose their Proxy connection and can never trigger `track`/`trigger` again.',
    source: 'Vue.js Docs — Reactivity in Depth',
  },
  {
    id: 'a02',
    topic: 'Composables',
    question: 'What makes a well-designed Vue composable (e.g. `useMouse()`) different from just a regular utility function?',
    code: null,
    options: [
      'Composables must be class-based and use the `extends Composable` pattern',
      'A composable is a function that uses Composition API primitives (ref, computed, watch, lifecycle hooks) to encapsulate and reuse stateful, reactive logic — returning reactive refs that stay live-connected to the composable\'s internal state, unlike a plain function that only returns static values',
      'Composables can only be called once per application, similar to a singleton',
      'Composables must always return a Promise, since they represent async operations exclusively',
    ],
    correctIndex: 1,
    explanation:
      'A plain utility function takes inputs and returns a static output — call it again and you get a fresh, disconnected result. A composable is specifically a function that leverages Vue\'s Composition API primitives internally (`ref`, `computed`, `watch`, `onMounted`/`onUnmounted` for setup/teardown) to manage *stateful* reactive logic, and it returns reactive references that remain live-connected to internal state changes over time — e.g. `useMouse()` returns `{ x, y }` refs that keep updating as the mouse moves, for as long as the calling component is mounted. Composables follow a `use`-prefixed naming convention by community consensus (mirroring React hooks, though the underlying mechanics are different — composables have no "rules of hooks" restriction on conditional calling since they are just regular functions using regular reactive primitives). Multiple components can call the same composable independently and each gets its own isolated reactive state, unless the composable is deliberately written to share a single reactive source (a common pattern for global stores built without Pinia).',
    compiledJS:
      "// useMouse.js — a composable\nimport { ref, onMounted, onUnmounted } from 'vue'\n\nexport function useMouse() {\n  const x = ref(0)\n  const y = ref(0)\n\n  function update(event) {\n    x.value = event.pageX\n    y.value = event.pageY\n  }\n\n  onMounted(() => window.addEventListener('mousemove', update))\n  onUnmounted(() => window.removeEventListener('mousemove', update))\n  // ^ cleanup tied to the CALLING component's lifecycle\n\n  return { x, y } // live reactive refs, not static values\n}\n\n// Usage — each component gets its own isolated { x, y }\n<script setup>\nimport { useMouse } from './useMouse'\nconst { x, y } = useMouse()\n</script>\n<template><p>{{ x }}, {{ y }}</p></template>",
    bestPractice:
      'Always tie side-effect setup (`addEventListener`, `setInterval`, subscriptions) inside a composable to `onMounted`/`onUnmounted` so cleanup automatically happens when the calling component unmounts — a composable used inside a component that gets destroyed and re-created many times (like a list item) will otherwise leak listeners rapidly. Name composables with a `use` prefix consistently and keep each one focused on a single concern for maximum reusability.',
    source: 'Vue.js Docs — Composables',
  },
  {
    id: 'a03',
    topic: 'Suspense',
    question: 'What does the `<Suspense>` built-in component coordinate in Vue 3?',
    code: null,
    options: [
      'It suspends all reactive updates in the app until a button is manually clicked',
      'It renders fallback content while one or more nested descendant components are resolving async dependencies (e.g. an async `setup()` awaiting a fetch), then swaps to the real content once everything resolves',
      'It is a replacement for `<KeepAlive>` with identical behavior but a different name',
      'It automatically retries failed network requests up to 3 times',
    ],
    correctIndex: 1,
    explanation:
      '`<Suspense>` coordinates async dependencies in a component tree — most commonly, a component whose `<script setup>` contains a top-level `await` (making the whole component an "async component"), or components loaded via `defineAsyncComponent`. While any nested async dependency is still pending, `<Suspense>` renders the content in its `#fallback` slot (e.g. a spinner); once ALL async dependencies inside its default slot have resolved, it swaps to rendering the real `#default` slot content in one atomic transition, rather than having each async piece pop in independently at different times. This is conceptually similar to React\'s `<Suspense>` for lazy-loaded components, though Vue\'s version is still officially marked experimental and its API may still change between minor versions.',
    compiledJS:
      "<!-- UserProfile.vue — async setup with top-level await -->\n<script setup>\nconst res = await fetch(`/api/user/${props.id}`)\nconst user = await res.json()\n</script>\n<template><div>{{ user.name }}</div></template>\n\n<!-- Parent.vue -->\n<template>\n  <Suspense>\n    <template #default>\n      <UserProfile :id=\"1\" />\n    </template>\n    <template #fallback>\n      <p>Loading user...</p>\n    </template>\n  </Suspense>\n</template>\n<!-- 'Loading user...' shows until the fetch + json() both\n     resolve, THEN the real UserProfile content appears -->",
    bestPractice:
      'Combine `<Suspense>` with an `onErrorCaptured` handler or an error boundary pattern in the parent, since `<Suspense>` on its own does not handle rejected promises gracefully — an unhandled rejection in an async setup will surface as an uncaught error. Because the API is still experimental, avoid relying on it for critical production UX without thoroughly testing across your target Vue minor version, and check the changelog before upgrading.',
    source: 'Vue.js Docs — Built-in Components: Suspense',
  },
  {
    id: 'a04',
    topic: 'Render Functions',
    question: 'What does calling `h(\'div\', { class: \'box\' }, \'Hello\')` produce, and when would you use `h()` instead of a `<template>`?',
    code: null,
    options: [
      'It immediately inserts a real `<div>` DOM element into the document',
      'It creates a virtual DOM node (VNode) description — a plain JS object describing what to render — used directly when you need full programmatic control over rendering logic that templates cannot express cleanly, such as deeply dynamic/recursive structures',
      '`h()` is a shorthand for `history.pushState()` used in Vue Router internals',
      'It is only usable inside `.jsx` files, never in plain `.js`/`.ts`',
    ],
    correctIndex: 1,
    explanation:
      '`h()` (short for "hyperscript," a convention from the virtual-DOM ecosystem) is the low-level function that creates VNodes — plain JavaScript objects describing tag/component, props, and children, which Vue\'s renderer later turns into real DOM operations. `<template>` syntax is compiled by Vue\'s compiler into calls to `h()` under the hood at build time — so template-based and render-function-based components ultimately produce the same VNode structures and go through the identical runtime rendering pipeline. You reach for `h()` directly (in a `render()` option or a functional component) when the rendering logic is too dynamic or programmatic to express cleanly in template syntax — for example, a component that recursively renders an arbitrarily deep tree structure, or a wrapper component that needs to inspect and transform its `slots` children programmatically.',
    compiledJS:
      "import { h } from 'vue'\n\n// Recursive tree renderer — awkward in <template>, natural with h()\nfunction TreeNode(props) {\n  return h('li', {}, [\n    props.node.label,\n    props.node.children?.length\n      ? h('ul', {}, props.node.children.map(child =>\n          h(TreeNode, { node: child })\n        ))\n      : null,\n  ])\n}\n\n// Equivalent to what <template> compiles to:\n// <template>\n//   <li>{{ node.label }}\n//     <ul v-if=\"node.children?.length\">\n//       <TreeNode v-for=\"c in node.children\" :key=\"c.id\" :node=\"c\" />\n//     </ul>\n//   </li>\n// </template>",
    bestPractice:
      'Default to `<template>` — it is more readable, gets compile-time optimizations (static hoisting, patch flags) automatically, and is what the vast majority of the Vue ecosystem (linters, IDE tooling, other developers) expects. Reach for `h()`/render functions only for the specific cases where template syntax genuinely cannot express the logic cleanly, and isolate that render-function component narrowly rather than converting an entire large component.',
    source: 'Vue.js Docs — Render Functions & JSX',
  },
  {
    id: 'a05',
    topic: 'Custom Directives',
    question: 'What is a Vue custom directive used for, and which hook would you implement to run logic immediately after the bound element is inserted into the DOM?',
    code: null,
    options: [
      'Custom directives can only be used to add CSS classes — `mounted` is the only available hook',
      'Custom directives encapsulate reusable low-level DOM access/manipulation logic (focus management, tooltips, click-outside detection); the `mounted(el, binding)` hook runs after the bound element is inserted into the DOM, analogous to the component lifecycle hook of the same name',
      'Directives are a legacy Vue 2 feature fully removed in Vue 3',
      'Directives can only be applied to native HTML elements, never to components',
    ],
    correctIndex: 1,
    explanation:
      'Custom directives (`v-my-directive`) exist for cases where you need direct, low-level access to a DOM element that reusable component abstractions do not fit well — auto-focusing an input, implementing a click-outside handler, lazy-loading images on intersection, or integrating a non-Vue-aware DOM library at the element level rather than the component level. A directive definition is an object with lifecycle hooks that mirror component lifecycle timing: `created`, `beforeMount`, `mounted`, `beforeUpdate`, `updated`, `beforeUnmount`, `unmounted` — each receiving the raw DOM element (`el`) and a `binding` object containing the directive\'s bound value, arguments, and modifiers. `mounted` is the hook that runs once the element actually exists in the DOM, making it the right place for `el.focus()` or attaching a native event listener that needs a real element.',
    compiledJS:
      "// v-focus custom directive\nconst vFocus = {\n  mounted(el, binding) {\n    el.focus()\n  },\n}\n\n// Registered locally in <script setup>:\n<script setup>\nconst vFocus = { mounted: (el) => el.focus() }\n</script>\n<template>\n  <input v-focus placeholder=\"Auto-focused on mount\" />\n</template>\n\n// Registered globally (main.js):\napp.directive('focus', {\n  mounted(el) { el.focus() },\n})\n// usable anywhere as v-focus without importing",
    bestPractice:
      'Reserve custom directives for genuine low-level DOM concerns — most reusable UI logic is better expressed as a component or a composable, both of which compose more predictably and are easier to test than directives. Always clean up anything a directive sets up in `mounted` (event listeners, observers) inside the matching `unmounted` hook to avoid leaks.',
    source: 'Vue.js Docs — Custom Directives',
  },
  {
    id: 'a06',
    topic: 'Router Navigation Guards',
    question: 'In Vue Router, what is the difference between a global `beforeEach` guard and a per-route `beforeEnter` guard?',
    code: null,
    options: [
      'They are identical — `beforeEnter` is simply a deprecated alias for `beforeEach`',
      '`beforeEach` runs on every single navigation across the entire app (e.g. for global auth checks); `beforeEnter` is defined on a specific route record and only runs when navigating TO that particular route',
      '`beforeEnter` runs before the component is even defined, at build time',
      '`beforeEach` can cancel navigation; `beforeEnter` cannot',
    ],
    correctIndex: 1,
    explanation:
      'Vue Router\'s navigation guards run at different scopes. `router.beforeEach((to, from, next) => {...})` is registered globally on the router instance and fires for every navigation anywhere in the app — the standard place for cross-cutting concerns like authentication checks or analytics tracking, since you only write it once. `beforeEnter` is defined directly on an individual route\'s configuration object and only triggers when navigating to (not away from, and not through, if using nested routes without re-entering) that specific route — useful for guards that only apply to one particular page, like an admin-only route, without cluttering the global guard with route-specific conditionals. Both can call `next(false)` to cancel navigation, `next(\'/other-path\')` to redirect, or `next()` to proceed — in Vue Router 4, guards can also simply `return` a value (false, a route location, or nothing) instead of calling `next()`, which is the more modern recommended style.',
    compiledJS:
      "// Global guard — main.js, runs for EVERY navigation\nrouter.beforeEach((to, from) => {\n  const isAuthenticated = checkAuth()\n  if (to.meta.requiresAuth && !isAuthenticated) {\n    return { name: 'login', query: { redirect: to.fullPath } }\n  }\n  // implicit return undefined = allow navigation\n})\n\n// Per-route guard — only runs for THIS route\nconst routes = [\n  {\n    path: '/admin',\n    component: AdminPanel,\n    beforeEnter: (to, from) => {\n      if (!currentUser.isAdmin) return '/forbidden'\n    },\n  },\n]",
    bestPractice:
      'Use `beforeEach` for concerns that apply app-wide (auth, page-title updates, analytics) to avoid duplicating logic across many routes. Use `beforeEnter` sparingly for route-specific logic that genuinely does not belong globally. Prefer route `meta` fields (`meta: { requiresAuth: true }`) combined with a single global guard over scattering `beforeEnter` across dozens of routes, which keeps the auth logic centralized and easier to audit.',
    source: 'Vue Router Docs — Navigation Guards',
  },
  {
    id: 'a07',
    topic: 'Pinia',
    question: 'What is the main advantage of Pinia stores over manually sharing a `reactive()` object between components as a homegrown state management solution?',
    code: null,
    options: [
      'Pinia is functionally identical to a shared reactive object — it is purely a stylistic wrapper with no additional capability',
      'Pinia provides devtools integration (state inspection, time-travel debugging), SSR-safe store instances (avoiding cross-request state leakage on the server), a structured actions/getters API, and official TypeScript support for auto-completion across the whole store',
      'Pinia stores can only hold primitive values, never nested objects or arrays',
      'Pinia replaces Vue Router entirely, merging routing and state management into one API',
    ],
    correctIndex: 1,
    explanation:
      'A hand-rolled shared `reactive()` singleton module technically works for simple cases, but it is missing structure and tooling that matters as an app grows: Pinia stores show up in Vue Devtools with full state inspection and time-travel debugging, they integrate with SSR frameworks (Nuxt) in a way that correctly creates a fresh store instance per server request — a naive shared singleton module would leak state between concurrent requests on the server, a serious bug. Pinia also gives you a structured API (`state`, `getters` as computed-like cached derivations, `actions` as methods that can be sync or async) with excellent TypeScript inference out of the box, plugin support (persistence, undo/redo), and the ability to compose multiple stores together cleanly. It replaced Vuex as Vue\'s officially recommended state library because it maps naturally onto the Composition API mental model — a Pinia store defined with the "setup store" syntax is written almost identically to a composable.',
    compiledJS:
      "// stores/counter.js — Pinia store (setup syntax)\nimport { defineStore } from 'pinia'\nimport { ref, computed } from 'vue'\n\nexport const useCounterStore = defineStore('counter', () => {\n  const count = ref(0)\n  const doubled = computed(() => count.value * 2)\n  function increment() { count.value++ }\n\n  return { count, doubled, increment }\n})\n\n// Any component:\n<script setup>\nimport { useCounterStore } from '@/stores/counter'\nconst counter = useCounterStore()\n</script>\n<template>\n  <button @click=\"counter.increment\">{{ counter.count }}</button>\n</template>\n<!-- Shows up in Vue Devtools, SSR-safe, fully typed -->",
    bestPractice:
      'Prefer the "setup store" syntax (a function returning refs/computed/actions, mirroring composables) over the "options store" syntax (an object with state/getters/actions) for consistency with the rest of a Composition API codebase and slightly more flexibility. Keep stores focused on one domain each (a `useUserStore`, a `useCartStore`) rather than one giant catch-all store, mirroring the single-responsibility principle applied to composables.',
    source: 'Pinia Docs — Introduction',
  },
  {
    id: 'a08',
    topic: 'Performance Primitives',
    question: 'What does `shallowRef()` change compared to a regular `ref()`, and when is that tradeoff worthwhile?',
    code: null,
    options: [
      '`shallowRef()` makes the value immutable and throws an error on any mutation attempt',
      '`shallowRef()` only tracks reactivity on the `.value` reassignment itself, NOT on nested properties inside the object it holds — it skips deep reactive conversion, which is valuable for large data structures (huge arrays, class instances, immutable data from a library) where deep reactivity tracking on every nested property would be wasted overhead',
      '`shallowRef()` is a synonym for `ref()` with no actual behavior difference, kept only for naming symmetry with `shallowReactive`',
      '`shallowRef()` can only hold primitive values, never objects',
    ],
    correctIndex: 1,
    explanation:
      'A regular `ref(someObject)` recursively converts `someObject` into a deeply reactive structure — every nested property, at every depth, gets wrapped so mutations anywhere in the tree are tracked. For very large objects (a big normalized dataset, a large parsed AST, a class instance with many internal fields you will never bind to in a template) this deep conversion has real memory and CPU cost at creation time, and most of it is wasted if you only ever replace the whole value rather than mutating nested fields. `shallowRef()` skips deep conversion entirely — only reassigning `.value` itself is tracked; mutating a nested property (`myShallowRef.value.deepProp = x`) will NOT trigger reactivity or re-renders. This trade-off is worthwhile specifically when a value is treated as immutable and swapped wholesale (e.g. replacing an entire large dataset after a fetch) rather than incrementally mutated.',
    compiledJS:
      "import { ref, shallowRef, triggerRef } from 'vue'\n\n// Regular ref — deeply reactive, expensive for huge objects\nconst deep = ref({ nested: { value: 1 } })\ndeep.value.nested.value = 2 // triggers reactivity (deep tracking)\n\n// shallowRef — only top-level .value reassignment is tracked\nconst shallow = shallowRef({ nested: { value: 1 } })\nshallow.value.nested.value = 2 // does NOT trigger a re-render\nshallow.value = { nested: { value: 2 } } // DOES trigger (whole reassignment)\n\n// Force a manual update if you must mutate a shallowRef's internals:\nshallow.value.nested.value = 3\ntriggerRef(shallow) // manually notify watchers/renders",
    bestPractice:
      'Reach for `shallowRef`/`shallowReactive` only after profiling shows deep reactivity conversion is an actual bottleneck (e.g. very large lists, big immutable data from a charting library) — premature use makes state harder to reason about since nested mutations silently do not trigger updates. Combine with `markRaw()` for values that should never be made reactive at all (class instances from third-party libraries that manage their own internal state).',
    source: 'Vue.js Docs — Reactivity API: Advanced (shallowRef)',
  },
  {
    id: 'a09',
    topic: 'SSR Hydration',
    question: 'What causes a "hydration mismatch" warning in a server-rendered Vue application, and why is it dangerous to ignore?',
    code: null,
    options: [
      'It only ever appears in development mode and has zero effect on the production build',
      'The HTML Vue generates on the client during hydration differs from the HTML the server actually sent, typically because a component read browser-only state (window size, localStorage, Date.now(), Math.random()) during its initial render — Vue then has to discard and re-render the mismatched DOM, causing visible flicker and losing the performance benefit of SSR',
      'It means the Vue Router failed to resolve the current URL',
      'It is caused exclusively by CSS class mismatches and has no relation to component data',
    ],
    correctIndex: 1,
    explanation:
      'Server-side rendering pre-generates HTML on the server and sends it to the browser for a fast first paint; the client-side Vue app then "hydrates" that existing HTML — attaching event listeners and reactivity — rather than re-rendering from scratch, which is the whole performance point of SSR. Hydration assumes the client\'s first render produces DOM identical to what the server sent. If a component\'s render output depends on something only available in the browser (`window.innerWidth`, `localStorage`, the current time, a random value, or a `typeof window !== \'undefined\'` branch), the server and client computed different output, and Vue detects the DOM mismatch during hydration. When this happens, Vue has to discard the mismatched portion of the pre-rendered DOM and re-render it client-side to fix the discrepancy — this causes visible flicker and forfeits SSR\'s fast-first-paint advantage for that section, in addition to logging a console warning that flags a real correctness bug, not just noise.',
    compiledJS:
      "<!-- BAD: server renders based on 'undefined' window,\n     client renders based on the real window -->\n<script setup>\nconst isMobile = typeof window !== 'undefined' && window.innerWidth < 768\n</script>\n<template>\n  <div>{{ isMobile ? 'Mobile' : 'Desktop' }}</div>\n  <!-- Server: always 'Desktop' (no window) -->\n  <!-- Client hydration: real value — MISMATCH if actually mobile -->\n</template>\n\n<!-- FIX: render the SSR-safe default first, then update\n     the value AFTER mount (post-hydration), same pattern\n     as React's SSR-safe two-phase render -->\n<script setup>\nimport { ref, onMounted } from 'vue'\nconst isMobile = ref(false) // matches server output exactly\nonMounted(() => {\n  isMobile.value = window.innerWidth < 768 // safe: runs post-hydration\n})\n</script>",
    bestPractice:
      'Never branch on `typeof window` (or read any browser-only API) during a component\'s initial synchronous render path in an SSR app — always render an SSR-safe default first and update it in `onMounted`, which only runs client-side after hydration completes. Use Nuxt\'s `<ClientOnly>` (or an equivalent conditional wrapper) for components that are fundamentally impossible to render consistently on the server, rather than fighting the mismatch warning.',
    source: 'Vue.js Docs — Server-Side Rendering: Hydration Mismatch',
  },
  {
    id: 'a10',
    topic: 'Compiler Optimizations',
    question: 'What are "patch flags" in Vue 3\'s compiled render output, and how do they speed up re-renders compared to Vue 2\'s virtual DOM diffing?',
    code: null,
    options: [
      'Patch flags are runtime feature flags that let you A/B test different rendering strategies in production',
      "The compiler statically analyzes a template at build time and annotates each dynamic VNode with a flag describing exactly WHAT kind of binding is dynamic (e.g. TEXT, CLASS, PROPS) so the runtime diff can skip comparing static content entirely and jump straight to comparing only the specific dynamic parts, instead of doing a full deep vnode-tree diff like Vue 2's default algorithm",
      'Patch flags disable Vue\'s reactivity system entirely for performance-critical components',
      'They are a debugging tool only, stripped out and functionally inert in production builds',
    ],
    correctIndex: 1,
    explanation:
      "Vue 2's virtual DOM diffing algorithm was fully dynamic — it recursively compared old and new VNode trees with no prior knowledge of which parts of a template were static versus dynamic, doing real (if optimized) tree diffing work every render. Vue 3's compiler performs static analysis of `<template>` at build time: it knows exactly which elements have bindings and precisely which KIND of binding each one is (a dynamic text node, a dynamic class, a dynamic style, a set of dynamic props, or a full dynamic key set for v-for children). Each dynamic VNode is annotated with a numeric \"patch flag\" bitmask encoding this information. At runtime, the diff algorithm reads these flags and, for a VNode flagged e.g. `TEXT` only, skips comparing props/class/style entirely and jumps straight to just the text content — turning what was a generic tree diff into a much cheaper, targeted comparison. Static, unchanging vnodes (flagged during compilation as having no dynamic bindings at all) are \"hoisted\" outside the render function entirely and reused across every render without being recreated or diffed at all.",
    compiledJS:
      "<!-- Template -->\n<div class=\"static\">\n  <span>Static text, never changes</span>\n  <p>{{ dynamicMessage }}</p>\n</div>\n\n// Compiled render output (simplified):\nimport { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from \"vue\"\n\n// Hoisted — created ONCE, reused every render, never diffed\nconst _hoisted_1 = /*#__PURE__*/_createElementVNode(\"span\", null, \"Static text, never changes\", -1 /* HOISTED */)\n\nexport function render(_ctx) {\n  return (_openBlock(), _createElementBlock(\"div\", { class: \"static\" }, [\n    _hoisted_1,\n    _createElementVNode(\"p\", null, _toDisplayString(_ctx.dynamicMessage), 1 /* TEXT patch flag */)\n    //                                                                    ^ only diff text content, skip everything else\n  ]))\n}",
    bestPractice:
      'Write templates so the compiler can statically analyze them wherever possible — avoid `v-bind="dynamicObjectOfProps"` on hot-path elements when the actual prop set is known ahead of time, since fully dynamic prop spreading forces the compiler to fall back to the slower `FULL_PROPS` patch flag. Rely on `<template>` (not hand-written `h()` render functions) for performance-sensitive UI specifically because these compiler optimizations only apply to compiled templates, not manually authored render functions.',
    source: 'Vue.js Docs — Rendering Mechanism: Compiler-Informed Virtual DOM',
  },
]
