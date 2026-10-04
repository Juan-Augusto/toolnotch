import type { InterviewQuestion } from '@/lib/interviewTypes'

export const VUE_QUESTIONS_ES: InterviewQuestion[] = [
  {
    "id": "b01",
    "topic": "createApp",
    "question": "En Vue 3, ¿qué hace `createApp(App).mount('#app')`?",
    "code": null,
    "options": [
      "Descarga el runtime de Vue desde un CDN y lo inyecta en la página",
      "Crea una nueva instancia aislada de aplicación a partir del componente raíz y la monta en el elemento del DOM que coincide con el selector",
      "Compila todos los archivos `.vue` del proyecto en un único bundle",
      "Registra `App` como un componente global disponible en cualquier otro componente"
    ],
    "correctIndex": 1,
    "explanation": "`createApp()` es la fábrica de aplicaciones de Vue 3 — devuelve una instancia de aplicación con su propio ámbito, a diferencia del constructor global único `Vue` de Vue 2. Cada instancia tiene sus propias configuraciones (componentes globales, directivas, plugins) que no interfieren con otras instancias en la misma página, lo cual es esencial para micro-frontends o widgets independientes. `.mount()` toma la instancia, compila y renderiza el árbol de componentes raíz, reemplazando el contenido del elemento objetivo del DOM con la salida renderizada. El elemento en sí no se reemplaza — sus atributos se combinan con el elemento raíz del componente.",
    "compiledJS": "import { createApp } from 'vue'\nimport App from './App.vue'\n\nconst app = createApp(App)\napp.mount('#app')\n\n// Múltiples aplicaciones aisladas en una sola página:\nconst app2 = createApp(OtherRoot)\napp2.mount('#widget')\n// app y app2 no comparten configuración global — registrar\n// un componente en `app` NO lo hace disponible en `app2`.",
    "bestPractice": "Registra plugins, directivas y componentes globales en la instancia `app` antes de llamar a `.mount()`. Realizar la configuración antes del montaje mantiene el inicio de la app predecible. Evita crear múltiples instancias de `createApp()` salvo que estés incrustando widgets genuinamente independientes.",
    "source": "Vue.js Docs — Creating a Vue Application"
  },
  {
    "id": "b02",
    "topic": "Interpolación de Plantillas",
    "question": "¿Qué renderiza `{{ message }}` dentro de una plantilla de Vue?",
    "code": null,
    "options": [
      "La cadena literal \"message\"",
      "El valor actual de la propiedad reactiva `message`, re-renderizado automáticamente cuando cambia",
      "Una referencia al nodo del DOM, no su valor",
      "Solo se renderiza una vez al montar y nunca se actualiza"
    ],
    "correctIndex": 1,
    "explanation": "La sintaxis de llaves dobles (\"mustache\") es la interpolación de texto — Vue evalúa `message` como una expresión JavaScript sobre el estado reactivo del componente e inserta la cadena resultante en el DOM como texto (no HTML). Al estar rastreada por el sistema de reactividad de Vue, cualquier mutación desencadena una actualización dirigida únicamente a las partes del DOM que dependen de ella. La interpolación siempre escapa el HTML automáticamente — para renderizar HTML sin escapar se requiere la directiva `v-html`, que desactiva explícitamente esa protección.",
    "compiledJS": "<script setup>\nimport { ref } from 'vue'\nconst message = ref('¡Hola Vue!')\n</script>\n\n<template>\n  <p>{{ message }}</p>\n  <!-- renderiza: <p>¡Hola Vue!</p> -->\n  <button @click=\"message = '¡Actualizado!'\">Cambiar</button>\n  <!-- al hacer clic, solo se re-renderiza el nodo de texto <p> -->\n</template>",
    "bestPractice": "Nunca uses `v-html` con contenido proporcionado por usuarios — elude el escape automático y representa un vector directo de vulnerabilidad XSS. Mantén las expresiones de plantilla simples (acceso a propiedades, ternarios); traslada la lógica compleja a propiedades `computed`.",
    "source": "Vue.js Docs — Template Syntax: Text Interpolation"
  },
  {
    "id": "b03",
    "topic": "Abreviatura v-bind",
    "question": "¿Cuál es la sintaxis abreviada para `v-bind:href=\"url\"`?",
    "code": null,
    "options": [
      "`@href=\"url\"`",
      "`:href=\"url\"`",
      "`#href=\"url\"`",
      "`.href=\"url\"`"
    ],
    "correctIndex": 1,
    "explanation": "`v-bind` vincula un atributo HTML o propiedad del DOM a una expresión reactiva, y su abreviatura es el signo de dos puntos: `:href=\"url\"`. Esto es distinto de `v-on`, cuya abreviatura es `@` (ej.: `@click=\"handler\"`). El símbolo `#` es la abreviatura de `v-slot` (usado en `<template>` para slots con nombre o scoped slots), y `.` se usa como modificador (ej.: `@click.stop`). Confundirlos es un error habitual: `@href` intentaría escuchar un evento DOM inexistente llamado \"href\".",
    "compiledJS": "<template>\n  <!-- Sintaxis completa -->\n  <a v-bind:href=\"url\">Enlace</a>\n\n  <!-- Abreviatura (comportamiento idéntico) -->\n  <a :href=\"url\">Enlace</a>\n\n  <!-- Argumento dinámico -->\n  <a :[attributeName]=\"url\">Enlace</a>\n  <!-- si attributeName === 'href', equivale a :href -->\n</template>",
    "bestPractice": "Utiliza la abreviatura (`:` y `@`) de manera uniforme en todo el proyecto — mezclar sintaxis completa y abreviada sin necesidad perjudica la legibilidad. Reserva los argumentos dinámicos (`:[attr]`) únicamente para casos verdaderamente dinámicos.",
    "source": "Vue.js Docs — Template Syntax: v-bind Shorthand"
  },
  {
    "id": "b04",
    "topic": "v-if vs v-show",
    "question": "¿Cuál es la principal diferencia de comportamiento entre `v-if` y `v-show`?",
    "code": null,
    "options": [
      "`v-if` monta y desmonta nodos del DOM físicamente; `v-show` renderiza el nodo y alterna el CSS `display: none`",
      "`v-show` monta y desmonta nodos del DOM físicamente; `v-if` renderiza el nodo y alterna el CSS `display: none`",
      "`v-if` opera únicamente sobre inputs de formularios; `v-show` opera solo sobre componentes personalizados",
      "Ambas directivas generan el mismo código en DOM, siendo `v-show` un simple atajo sintáctico de `v-if`"
    ],
    "correctIndex": 1,
    "explanation": "`v-if` es un renderizado condicional \"real\": cuando la condición es falsa, Vue destruye por completo el elemento y sus componentes hijos — se ejecutan hooks de ciclo de vida como `unmounted` y se limpian los listeners. Al volver a true, todo se recrea desde cero (disparando `mounted` nuevamente). En cambio, `v-show` siempre renderiza el elemento en el DOM y simplemente conmuta la propiedad CSS `display: none`, asumiendo el costo inicial una sola vez y sin disparar hooks de desmontaje. Además, solo `v-if` soporta encadenamiento con `v-else-if`/`v-else`.",
    "compiledJS": "<template>\n  <!-- v-if: el elemento se añade/elimina del DOM -->\n  <ExpensiveWidget v-if=\"showWidget\" />\n  <!-- alternar showWidget vuelve a montar todo el componente -->\n\n  <!-- v-show: el elemento siempre existe, solo cambia el display -->\n  <ExpensiveWidget v-show=\"showWidget\" />\n  <!-- style=\"display: none\" cuando showWidget es falso -->\n  <!-- mounted() solo se dispara UNA vez -->\n</template>",
    "bestPractice": "Utiliza `v-show` para elementos que alternan su visibilidad frecuentemente (pestañas, menús desplegables) para evitar el costo de re-montaje. Utiliza `v-if` para contenido que rara vez cambia o cuando realmente desees destruir el componente para restablecer su estado interno.",
    "source": "Vue.js Docs — Conditional Rendering: v-if vs v-show"
  },
  {
    "id": "b05",
    "topic": "v-for y :key",
    "question": "¿Por qué Vue requiere (o recomienda fuertemente) un enlace `:key` en elementos renderizados con `v-for`?",
    "code": null,
    "options": [
      "`:key` es puramente cosmético y solo afecta al valor devuelto por `element.dataset.key`",
      "Proporciona una identidad estable para que Vue rastree, reordene y reutilice nodos DOM en el diffing",
      "Solo se requiere para elementos `<template>`, nunca para etiquetas HTML normales",
      "`:key` mejora el rendimiento de red almacenando en caché la respuesta de API para ese elemento"
    ],
    "correctIndex": 1,
    "explanation": "El algoritmo de diffing del DOM virtual de Vue intenta, por defecto, reutilizar nodos existentes en la misma posición por eficiencia. Sin una `key`, Vue actualiza los nodos según su índice, lo que provoca errores al reordenar, filtrar o insertar elementos intermedios — los estados locales de componentes o valores de inputs pueden permanecer en la fila equivocada. Un `:key` estable e individual (como el ID del modelo) permite a Vue identificar qué elemento se movió, insertó o eliminó con exactitud.",
    "compiledJS": "<template>\n  <!-- MAL: el índice como key falla al ordenar o eliminar -->\n  <li v-for=\"(item, index) in items\" :key=\"index\">\n    {{ item.name }}\n  </li>\n\n  <!-- BIEN: identidad estable a partir de los datos -->\n  <li v-for=\"item in items\" :key=\"item.id\">\n    {{ item.name }}\n  </li>\n</template>",
    "bestPractice": "Usa siempre un identificador único y estable de tus datos como `:key` — nunca uses el índice del array en listas mutables. Si los elementos no poseen un ID natural, genéralo al recibir o crear los datos, no en cada renderizado (usar `Math.random()` en la plantilla invalida el propósito del diffing).",
    "source": "Vue.js Docs — List Rendering: Maintaining State with key"
  },
  {
    "id": "b06",
    "topic": "ref()",
    "question": "¿Qué hace `ref()` en la Composition API de Vue 3 y por qué se debe acceder a su valor mediante `.value` dentro de `<script setup>`?",
    "code": null,
    "options": [
      "Crea una referencia directa a elementos del DOM real, usando `.value` para leer el valor nativo del HTML",
      "Encapsula el valor en un objeto reactivo con getter/setter en `.value`, permitiendo rastrear primitivos con Proxy",
      "Instancia una copia inmutable de estado donde `.value` devuelve clones profundos para evitar mutaciones directas",
      "Envuelve el dato en una Promise donde `.value` actúa como desempaquetador de tipos exigido por TypeScript"
    ],
    "correctIndex": 1,
    "explanation": "El sistema de reactividad de Vue 3 se basa en `Proxy` de JavaScript, el cual intercepta el acceso y modificación de propiedades en objetos. Los tipos primitivos (números, strings, booleanos) se pasan por valor y no pueden ser interceptados directamente. `ref()` soluciona esto envolviendo el valor dentro de un objeto `{ value: ... }`. En las plantillas de `<script setup>`, Vue desenvuelve automáticamente las refs de primer nivel (permitiendo `{{ count }}`), pero en el código de `<script>` siempre debes acceder o modificar `count.value` explícitamente.",
    "compiledJS": "<script setup>\nimport { ref } from 'vue'\n\nconst count = ref(0)\nconsole.log(count)        // RefImpl { value: 0, ... }\nconsole.log(count.value)  // 0\n\nfunction increment() {\n  count.value++  // se debe usar .value dentro de <script>\n}\n</script>\n\n<template>\n  <!-- desenvuelto automáticamente en la plantilla -->\n  <button @click=\"increment\">{{ count }}</button>\n</template>",
    "bestPractice": "Usa `ref()` para valores primitivos y para aquellos que planeas reasignar completamente (como arrays u objetos procedentes de peticiones HTTP). Usa `reactive()` para objetos donde modificarás propiedades individuales sin reasignar la variable principal. Usa `toRefs()` al desestructurar objetos reactivos.",
    "source": "Vue.js Docs — Reactivity Fundamentals: ref()"
  },
  {
    "id": "b07",
    "topic": "computed()",
    "question": "¿Cuál es la principal ventaja de una propiedad `computed` sobre llamar a un método normal en la plantilla?",
    "code": null,
    "options": [
      "Métodos almacenan retorno en caché; propiedades computadas recalculan en cada ciclo de renderizado del componente",
      "Propiedades computadas almacenan resultado en caché reactivo, recalculando solo cuando sus dependencias cambian",
      "Propiedades computadas ejecutan en Web Workers asíncronos; métodos comunes corren en el hilo principal del browser",
      "No hay diferencia — métodos en template y propiedades computadas poseen rendimiento y ciclo de vida idénticos"
    ],
    "correctIndex": 1,
    "explanation": "Una propiedad `computed` representa un valor reactivo derivado de otros estados. Vue registra qué dependencias reactivas se leen durante su evaluación y almacena en caché el resultado — las lecturas posteriores devuelven el valor cacheado al instante, recalculándose de forma perezosa solo cuando cambia una dependencia. Por contra, un método invocado en la plantilla (ej.: `{{ getFullName() }}`) se vuelve a ejecutar en cada ciclo de renderizado del componente, incluso si las variables involucradas no sufrieron modificaciones.",
    "compiledJS": "<script setup>\nimport { ref, computed } from 'vue'\n\nconst firstName = ref('Ada')\nconst lastName = ref('Lovelace')\n\n// Cacheado — solo recalcula cuando firstName o lastName cambian\nconst fullName = computed(() => {\n  console.log('calculando fullName')\n  return `${firstName.value} ${lastName.value}`\n})\n\n// Se ejecuta en CADA renderizado del componente\nfunction getFullNameMethod() {\n  console.log('llamando método')\n  return `${firstName.value} ${lastName.value}`\n}\n</script>\n\n<template>\n  <p>{{ fullName }}</p>\n  <p>{{ getFullNameMethod() }}</p>\n</template>",
    "bestPractice": "Elige `computed` por defecto para cualquier valor derivado de otro estado reactivo — es más rápido y declarativo. Reserva los métodos para responder a eventos del usuario (como clics) o funciones con efectos secundarios.",
    "source": "Vue.js Docs — Computed Properties"
  },
  {
    "id": "b08",
    "topic": "Declaración de Props",
    "question": "¿Cómo se declara que un componente hijo acepta una prop obligatoria `title` de tipo `String` usando `<script setup>`?",
    "code": null,
    "options": [
      "`const props = ref({ title: String })`",
      "`defineProps({ title: { type: String, required: true } })`",
      "`export const title = String`",
      "`this.props.title = String`"
    ],
    "correctIndex": 1,
    "explanation": "`defineProps()` es una macro del compilador disponible dentro de `<script setup>` — no necesita importación y se procesa en tiempo de compilación. Pasar un objeto con `type` y `required: true` activa la validación en runtime: en modo de desarrollo, Vue emitirá una advertencia en la consola si falta la prop o el tipo no coincide. Las props son de solo lectura para el componente hijo; intentar mutarlas directamente va en contra del flujo unidireccional de Vue.",
    "compiledJS": "<script setup>\ndefineProps({\n  title: {\n    type: String,\n    required: true,\n  },\n  count: {\n    type: Number,\n    default: 0,\n  },\n})\n</script>\n\n<template>\n  <h2>{{ title }}</h2>\n  <p>Conteo: {{ count }}</p>\n</template>",
    "bestPractice": "Declara siempre `type` y `required`/`default` explícitamente en lugar de la forma abreviada por array (`defineProps(['title'])`). En proyectos con TypeScript, utiliza la sintaxis basada en tipos `defineProps<{ title: string; count?: number }>()` para validación estática precisa.",
    "source": "Vue.js Docs — Component Basics: Props"
  },
  {
    "id": "b09",
    "topic": "emit()",
    "question": "En un componente hijo con `<script setup>`, ¿cuál es la forma correcta de notificar al padre que ocurrió un evento \"submit\", pasando opcionalmente un payload?",
    "code": null,
    "options": [
      "`this.$parent.onSubmit(payload)`",
      "const emit = defineEmits(['submit']); emit('submit', payload)",
      "`window.dispatchEvent(new CustomEvent('submit', payload))`",
      "`props.onSubmit(payload)`"
    ],
    "correctIndex": 1,
    "explanation": "`defineEmits()` es la macro del compilador que declara qué eventos personalizados puede emitir un componente. La función retornada `emit` recibe el nombre del evento y argumentos adicionales que conformarán el payload recibido por el padre en su manejador `@submit`. Esto respeta el principio de flujo unidireccional de datos: las props bajan del padre al hijo, y los eventos suben del hijo al padre.",
    "compiledJS": "<!-- ChildForm.vue -->\n<script setup>\nconst emit = defineEmits(['submit'])\n\nfunction handleClick() {\n  emit('submit', { name: 'Ada', email: 'ada@example.com' })\n}\n</script>\n\n<template>\n  <button @click=\"handleClick\">Enviar</button>\n</template>\n\n<!-- ParentForm.vue -->\n<template>\n  <ChildForm @submit=\"onSubmit\" />\n</template>\n<script setup>\nfunction onSubmit(payload) {\n  console.log(payload)\n}\n</script>",
    "bestPractice": "Declara siempre los eventos emitidos con `defineEmits` — esto documenta el componente, permite autocompletado en el IDE y facilita la validación en tiempo de desarrollo.",
    "source": "Vue.js Docs — Component Basics: Listening to Events"
  },
  {
    "id": "b10",
    "topic": "Single-File Components",
    "question": "¿Cuáles son los tres bloques de nivel superior que componen un Single-File Component estándar de Vue (archivo `.vue`)?",
    "code": null,
    "options": [
      "`<head>`, `<body>`, `<footer>`",
      "`<template>`, `<script>`, `<style>`",
      "`<html>`, `<js>`, `<css>`",
      "`<render>`, `<data>`, `<methods>`"
    ],
    "correctIndex": 1,
    "explanation": "Un Single-File Component (SFC) de Vue agrupa el marcado, la lógica y los estilos en un único archivo mediante tres bloques principales: `<template>` (el HTML compilado a función de render), `<script>` o `<script setup>` (la lógica JavaScript/TypeScript) y `<style>` (el CSS, que puede aislarse con el atributo `scoped`). Herramientas como Vite compilan estos bloques en tiempo de construcción para generar código consumible por los navegadores.",
    "compiledJS": "<!-- UserCard.vue -->\n<template>\n  <div class=\"user-card\">{{ user.name }}</div>\n</template>\n\n<script setup>\nimport { defineProps } from 'vue'\nconst props = defineProps({ user: Object })\n</script>\n\n<style scoped>\n.user-card {\n  padding: 1rem;\n  border-radius: 8px;\n}\n/* scoped: genera un atributo data-v-xxxxx único para aislar estilos */\n</style>",
    "bestPractice": "Utiliza estilos `scoped` por defecto para prevenir colisiones de clases CSS en la aplicación. Coloca `<script setup>` en la parte superior del archivo (antes de `<template>`), siguiendo la recomendación oficial y las guías de estilo predominantes.",
    "source": "Vue.js Docs — Single-File Components"
  },
  {
    "id": "i01",
    "topic": "ref vs reactive",
    "question": "¿Cuál es la principal diferencia práctica entre `ref({ count: 0 })` y `reactive({ count: 0 })`, y por qué importa reemplazar el objeto completo?",
    "code": null,
    "options": [
      "`ref()` es exclusivo para objetos y arrays; `reactive()` es obligatorio para números, strings y booleanos",
      "`reactive()` devuelve un Proxy que pierde reactividad si se reasigna; `ref()` admite reasignación en `.value`",
      "`ref()` realiza rastreo profundo de dependencias; `reactive()` es superficial y vigila solo claves principales",
      "`ref()` opera solo dentro de Options API; `reactive()` está restringido exclusivamente a `<script setup>`"
    ],
    "correctIndex": 1,
    "explanation": "`reactive()` envuelve un objeto en un Proxy y lo devuelve directamente. Si realizas `state = { count: 5 }`, la variable pasa a apuntar a un nuevo objeto común, desconectándose del Proxy original que Vue estaba rastreando — cualquier plantilla o watcher vinculado al Proxy anterior dejará de recibir actualizaciones. En cambio, `ref()` mantiene un contenedor estable `{ value: ... }`; al asignar `stateRef.value = newObj`, la operación pasa por el setter reactivo de `.value`, notificando correctamente a todos los observadores.",
    "compiledJS": "import { ref, reactive } from 'vue'\n\n// reactive() — falla si se reasigna la variable\nlet state = reactive({ count: 0 })\nstate = { count: 5 } // ERROR: se pierde el rastreo reactivo\n\n// ref() — seguro para reasignación completa\nconst stateRef = ref({ count: 0 })\nstateRef.value = { count: 5 } // FUNCIONA: .value es el punto rastreado\n\n// Forma adecuada de mutar reactive() en el lugar:\nconst state2 = reactive({ count: 0 })\nObject.assign(state2, { count: 5 }) // muta el objeto manteniendo el Proxy",
    "bestPractice": "Favorece el uso uniforme de `ref()` en tus componentes, incluso para objetos y listas que puedan sustituirse tras peticiones asíncronas. Limita `reactive()` a modelos con mutaciones estrictamente internas donde la referencia del objeto nunca se reasigne.",
    "source": "Vue.js Docs — Reactivity Fundamentals: Limitations of reactive()"
  },
  {
    "id": "i02",
    "topic": "computed vs watch",
    "question": "¿Cuándo deberías recurrir a `watch()` en lugar de una propiedad `computed`?",
    "code": null,
    "options": [
      "Siempre se debe preferir `watch` — `computed` es una API heredada de Vue 2",
      "Cuando se requiere ejecutar un efecto secundario (APIs, DOM, logs) en respuesta a cambios de estado",
      "Son intercambiables en todos los casos sin diferencia significativa",
      "Se requiere `watch` siempre que haya más de una dependencia reactiva involucrada"
    ],
    "correctIndex": 1,
    "explanation": "`computed` está diseñado para derivaciones puras y síncronas — toma datos reactivos y genera un nuevo valor calculado sin efectos secundarios, aprovechando el almacenamiento en caché. `watch` está diseñado para reaccionar a cambios ejecutando efectos secundarios: realizar peticiones a la API cuando cambia un parámetro de ruta, persistir información en `localStorage` o disparar animaciones imperativas. Ejecutar efectos secundarios dentro de un getter `computed` es un anti-patrón.",
    "compiledJS": "import { ref, computed, watch } from 'vue'\n\nconst searchQuery = ref('')\nconst results = ref([])\n\n// CORRECTO: computed para derivación pura\nconst queryLength = computed(() => searchQuery.value.length)\n\n// CORRECTO: watch para efecto secundario (llamada a API)\nwatch(searchQuery, async (newQuery) => {\n  if (!newQuery) { results.value = []; return }\n  const res = await fetch(`/api/search?q=${newQuery}`)\n  results.value = await res.json()\n})",
    "bestPractice": "Pregúntate: \"¿estoy calculando un valor derivado para mostrar o estoy reaccionando a un cambio con una acción externa?\". En el primer caso usa `computed`; en el segundo, `watch` o `watchEffect`. Limpia siempre temporizadores o suscripciones al re-ejecutar o destruir watchers.",
    "source": "Vue.js Docs — Computed Properties vs. Watchers"
  },
  {
    "id": "i03",
    "topic": "watchEffect",
    "question": "¿Cómo decide `watchEffect(fn)` qué fuentes reactivas rastrear, en comparación con `watch(source, fn)`?",
    "code": null,
    "options": [
      "Exige pasar un array explícito de dependencias reactivas, exactamente igual al hook `useEffect` de la librería React",
      "Rastrea automáticamente todas las propiedades leídas de forma síncrona en el callback, sin requerir array de dependencias",
      "Nunca vuelve a ejecutarse tras el montaje inicial — corre una sola vez en el ciclo de vida y luego se desconecta",
      "Rastrea estrictamente variables creadas con `ref()`, ignorando cambios hechos en objetos envueltos en `reactive()`"
    ],
    "correctIndex": 1,
    "explanation": "`watchEffect` ejecuta su función inmediatamente al registrarse e identifica de forma automática todas las propiedades reactivas que se leen de manera síncrona durante esa ejecución. Siempre que alguna de esas propiedades varíe, el efecto se re-ejecutará. En contraste, `watch` exige indicar explícitamente qué variables observar y su ejecución es perezosa por defecto (no corre inicialmente a menos que se use `{ immediate: true }`).",
    "compiledJS": "import { ref, watchEffect } from 'vue'\n\nconst id = ref(1)\nconst includeDetails = ref(false)\n\nwatchEffect(() => {\n  console.log('consultando id:', id.value)\n  if (includeDetails.value) {\n    console.log('consultando detalles adicionales')\n  }\n})\n// Se ejecuta de inmediato rastreando id\nid.value = 2 // Dispara re-ejecución automática",
    "bestPractice": "Usa `watchEffect` cuando el efecto consuma múltiples propiedades reactivas de manera natural en su flujo interno. Usa `watch` explícito cuando necesites comparar el valor nuevo con el anterior (`newVal`, `oldVal`) o quieras posponer la ejecución hasta el primer cambio.",
    "source": "Vue.js Docs — Watchers: watchEffect()"
  },
  {
    "id": "i04",
    "topic": "Composition vs Options API",
    "question": "¿Cuál es la diferencia estructural central entre la Options API y la Composition API en Vue 3?",
    "code": null,
    "options": [
      "Options API tiene mayor rendimiento en runtime; Composition API compila bundles de JavaScript mayores en producción",
      "Options API organiza código por tipo de opción (data, methods); Composition API agrupa por funcionalidad con composables",
      "Options API fue descontinuada en Vue 3 y genera errores salvo que se active el modo compatibilidad de migración",
      "Options API permite compartir estado entre pantallas; Composition API restringe el estado al alcance de un componente"
    ],
    "correctIndex": 1,
    "explanation": "En la Options API, el código se fragmenta en opciones predeterminadas (`data`, `methods`, `computed`, `watch`), lo que dispersa la lógica de una misma funcionalidad a lo largo de varias secciones del archivo. Con la Composition API, es posible agrupar todo el estado reactivo, valores computados y métodos asociados a una funcionalidad en un solo bloque coherente. Esto facilita la extracción hacia funciones composables reutilizables (`useFeature()`) sin los conflictos de nombres de los antiguos mixins.",
    "compiledJS": "// Options API — lógica separada por tipo de opción\nexport default {\n  data() { return { count: 0 } },\n  computed: { doubled() { return this.count * 2 } },\n  methods: { inc() { this.count++ } },\n}\n\n// Composition API — lógica agrupada por funcionalidad\nimport { ref, computed } from 'vue'\nexport default {\n  setup() {\n    const count = ref(0)\n    const doubled = computed(() => count.value * 2)\n    function inc() { count.value++ }\n    return { count, doubled, inc }\n  },\n}",
    "bestPractice": "Para componentes de mediana o alta complejidad, estandariza en la Composition API con `<script setup>` para obtener mejor inferencia en TypeScript, bundles más pequeños y mayor facilidad de reutilización.",
    "source": "Vue.js Docs — Composition API FAQ"
  },
  {
    "id": "i05",
    "topic": "provide/inject",
    "question": "¿Qué problema resuelve `provide()`/`inject()` que las props normales no pueden resolver limpiamente?",
    "code": null,
    "options": [
      "Sustituye a Pinia en toda la aplicación sincronizando estado entre componentes hermanos sin requerir ancestro común",
      "Transmite datos y métodos de un ancestro a descendientes profundos sin necesidad de prop drilling en intermediarios",
      "Permite que componentes hijos modifiquen el estado de padres directamente sin emitir eventos ni usar hooks reactivos",
      "Funciona estrictamente entre un componente y sus hijos directos, forzando validación de tipos TypeScript en runtime"
    ],
    "correctIndex": 1,
    "explanation": "`provide`/`inject` soluciona el problema de \"prop drilling\", donde componentes intermedios deben recibir y reenviar propiedades que no utilizan, solo para abastecer a un componente profundamente anidado. Con `provide('clave', valor)` en un ancestro, cualquier componente descendiente puede acceder a él mediante `inject('clave')`. Si el valor provisto es una `ref` o un objeto `reactive`, las actualizaciones se reflejan reactivamente en los consumidores.",
    "compiledJS": "// GrandParent.vue\n<script setup>\nimport { provide, ref } from 'vue'\nconst theme = ref('dark')\nprovide('theme', theme)\n</script>\n\n// Child.vue (varios niveles abajo, sin pasar por el componente intermedio)\n<script setup>\nimport { inject } from 'vue'\nconst theme = inject('theme', 'light') // 'light' como valor por defecto\n</script>\n<template><div :class=\"theme\">{{ theme }}</div></template>",
    "bestPractice": "Usa claves de inyección basadas en `InjectionKey<T>` de tipo `Symbol` para evitar colisiones de nombres y asegurar type-safety en TypeScript. Especifica siempre un valor por defecto en el segundo argumento de `inject`.",
    "source": "Vue.js Docs — Provide / Inject"
  },
  {
    "id": "i06",
    "topic": "Slots",
    "question": "¿Cuál es la diferencia entre un slot predeterminado (default) y un slot nombrado (named slot) en un componente Vue?",
    "code": null,
    "options": [
      "No hay diferencia — los slots con nombre son solo sintaxis alternativa sin cambio de comportamiento",
      "El slot por defecto recibe contenido no dirigido, mientras que slots nombrados crean puntos de inyección vía <template #nombre>",
      "Los slots nombrados solo pueden pasar texto estático, nunca contenido reactivo dinámico",
      "Un componente solo puede tener un slot en total — predeterminado o nombrado, nunca ambos"
    ],
    "correctIndex": 1,
    "explanation": "Los slots son el mecanismo de distribución de contenido de Vue, permitiendo que un componente padre inyecte nodos en la plantilla de un componente hijo. El slot por defecto (`<slot />`) captura cualquier elemento que no especifique un destino concreto. Los slots nombrados (`<slot name=\"header\" />`) permiten definir múltiples áreas de inserción independientes (ej.: cabecera, cuerpo, pie), que el padre llena usando `<template #header>`.",
    "compiledJS": "<!-- Card.vue -->\n<template>\n  <div class=\"card\">\n    <header><slot name=\"header\">Título por Defecto</slot></header>\n    <main><slot /></main>\n    <footer><slot name=\"footer\" /></footer>\n  </div>\n</template>\n\n<!-- Uso en el padre -->\n<Card>\n  <template #header><h2>Título Personalizado</h2></template>\n  <p>Contenido para el slot principal.</p>\n  <template #footer><button>Cerrar</button></template>\n</Card>",
    "bestPractice": "Define contenido de respaldo (fallback) razonable dentro de las etiquetas `<slot>` en el componente hijo para que funcione de forma autónoma aun cuando el padre no provea contenido.",
    "source": "Vue.js Docs — Slots"
  },
  {
    "id": "i07",
    "topic": "Hooks del Ciclo de Vida",
    "question": "En la Composition API, ¿qué hook se ejecuta después de montar el componente cuando sus elementos DOM son accesibles, siendo el lugar ideal para inicializar bibliotecas DOM de terceros?",
    "code": null,
    "options": [
      "`onBeforeMount`",
      "`onMounted`",
      "`onCreated`",
      "`onUpdated`"
    ],
    "correctIndex": 1,
    "explanation": "`onMounted` se dispara tras haberse completado la renderización inicial y haber insertado los nodos en el DOM real. En este punto, las referencias de plantilla (`ref=\"el\"`) están disponibles y es seguro inicializar librerías de gráficos, editores o mapas. En la Composition API no existe `onCreated`: cualquier instrucción colocada en la raíz de `<script setup>` se ejecuta naturalmente antes del montaje.",
    "compiledJS": "<script setup>\nimport { ref, onMounted, onUnmounted } from 'vue'\n\nconst canvasRef = ref(null)\nlet chart = null\n\nonMounted(() => {\n  // El DOM existe y canvasRef.value está poblado\n  chart = new Chart(canvasRef.value, { /* opciones */ })\n})\n\nonUnmounted(() => {\n  chart?.destroy()\n})\n</script>\n\n<template>\n  <canvas ref=\"canvasRef\"></canvas>\n</template>",
    "bestPractice": "Empareja siempre las inicializaciones en `onMounted` con la limpieza correspondiente en `onUnmounted` (destruir instancias, retirar listeners de ventanas o timers) para evitar fugas de memoria.",
    "source": "Vue.js Docs — Lifecycle Hooks"
  },
  {
    "id": "i08",
    "topic": "v-model Personalizado",
    "question": "¿Qué debe hacer un componente internamente para soportar el enlace `v-model` de su componente padre (ej.: `<CustomInput v-model=\"text\" />`)?",
    "code": null,
    "options": [
      "Nada — `v-model` funciona automáticamente en cualquier componente sin configuración",
      "Aceptar la prop modelValue y emitir el evento update:modelValue cuando el valor cambie",
      "Importar un composable especial `useVModel()` de Vue Router",
      "Declarar el componente con `defineModel: true` en sus opciones"
    ],
    "correctIndex": 1,
    "explanation": "En componentes de Vue, `v-model=\"text\"` se expande a `:modelValue=\"text\"` junto con el listener `@update:modelValue=\"text = $event\"`. Para participar en este enlace, el componente hijo debe aceptar la prop `modelValue` y emitir el evento `update:modelValue` con el valor actualizado cada vez que el usuario interactúe. Desde Vue 3.4, la macro `defineModel()` automatiza esta correspondencia facilitando enormemente su uso.",
    "compiledJS": "<!-- Vue 3.4+ con defineModel() -->\n<script setup>\nconst model = defineModel()\n</script>\n<template>\n  <input v-model=\"model\" />\n</template>\n\n<!-- Enfoque clásico -->\n<script setup>\ndefineProps(['modelValue'])\ndefineEmits(['update:modelValue'])\n</script>\n<template>\n  <input :value=\"modelValue\" @input=\"$emit('update:modelValue', $event.target.value)\" />\n</template>",
    "bestPractice": "Prefiere la macro `defineModel()` en proyectos que utilicen Vue 3.4+. Para múltiples enlaces bidireccionales en el mismo componente, usa modelos nombrados como `defineModel('title')`, consumidos con `v-model:title`.",
    "source": "Vue.js Docs — Component v-model"
  },
  {
    "id": "i09",
    "topic": "Teleport",
    "question": "¿Qué problema resuelve el componente nativo `<Teleport>`?",
    "code": null,
    "options": [
      "Carga bundles de scripts de componentes bajo demanda en cuanto entran en el área visible del viewport del navegador",
      "Renderiza el marcado en otro nodo del DOM físico manteniendo el alcance reactivo y la jerarquía lógica del componente",
      "Coordina la reconciliación de hidratación en SSR entre el HTML generado en Node.js y el Virtual DOM del cliente",
      "Provee animaciones de transición de ruta al navegar entre pantallas en aplicaciones web creadas con Vue Router"
    ],
    "correctIndex": 1,
    "explanation": "Elementos flotantes como modales, alertas o tooltips suelen quedar recortados si un elemento ancestro tiene `overflow: hidden` o contextos de apilamiento `z-index` restrictivos. `<Teleport to=\"body\">` transfiere el nodo DOM resultante directamente al elemento objetivo especificado, mientras conserva intacta la jerarquía lógica de Vue — el componente teleportado sigue teniendo acceso a las props, inyecciones y eventos de su componente origen.",
    "compiledJS": "<template>\n  <div class=\"card\" style=\"overflow: hidden;\">\n    <button @click=\"isOpen = true\">Abrir Modal</button>\n\n    <!-- Teleport traslada el marcado al final del body -->\n    <Teleport to=\"body\">\n      <div v-if=\"isOpen\" class=\"modal-overlay\">\n        <div class=\"modal-content\">\n          <p>Libre del recorte por overflow del contenedor padre.</p>\n          <button @click=\"isOpen = false\">Cerrar</button>\n        </div>\n      </div>\n    </Teleport>\n  </div>\n</template>",
    "bestPractice": "Combina siempre `<Teleport>` con `v-if` para evitar que nodos invisibles permanezcan en el DOM entorpeciendo la navegación por teclado. Define un contenedor específico (ej.: `<div id=\"modal-root\"></div>`) cuando requieras mayor control sobre el apilamiento.",
    "source": "Vue.js Docs — Teleport"
  },
  {
    "id": "i10",
    "topic": "KeepAlive",
    "question": "¿Qué logra envolver un componente dinámico en `<KeepAlive>`?",
    "code": null,
    "options": [
      "Mantiene componentes montados de forma permanente en el DOM real, alternando su visibilidad con `display: none`",
      "Guarda instancias inactivas en caché de memoria sin destruirlas, preservando su estado al regresar a la vista",
      "Graba el estado reactivo en `localStorage` del navegador para conservarlo ante recargas de página y reinicios",
      "Evita que componentes hijos se rendericen cuando el componente padre actualiza, funcionando como React.memo"
    ],
    "correctIndex": 1,
    "explanation": "Al alternar componentes dinámicos (`<component :is=\"...\">`) o cambiar de vista con `v-if`, Vue destruye la instancia anterior descartando todo su estado local (campos de formulario, scroll, selecciones). Con `<KeepAlive>`, Vue no destruye la instancia, sino que la desactiva y guarda en memoria. Al volver a ella, se reactiva de inmediato con su estado intacto y dispara los hooks `onActivated` y `onDeactivated` en lugar de `onMounted` y `onUnmounted`.",
    "compiledJS": "<template>\n  <KeepAlive :include=\"['TabA', 'TabB']\">\n    <component :is=\"currentTab\" />\n  </KeepAlive>\n</template>\n\n<script setup>\nimport { ref, onActivated, onDeactivated } from 'vue'\n// En las vistas contenidas:\nonActivated(() => { console.log('Componente reactivado') })\nonDeactivated(() => { console.log('Componente desactivado en caché') })\n</script>",
    "bestPractice": "Utiliza las propiedades `include`, `exclude` o `max` en `<KeepAlive>` para limitar qué vistas se retienen en caché, evitando un consumo de memoria desmedido en aplicaciones con muchas pantallas dinámicas.",
    "source": "Vue.js Docs — KeepAlive"
  },
  {
    "id": "a01",
    "topic": "Mecanismos Internos de Reactividad",
    "question": "A nivel mecánico, ¿cómo detecta el sistema de reactividad de Vue 3 que un componente necesita re-renderizarse cuando cambia una propiedad reactiva?",
    "code": null,
    "options": [
      "Traps get/set en Proxy registran effects activos en la lectura, reactivando renderizado solo en propiedades modificadas",
      "Un proceso en el event loop compara snapshots JSON de los datos cada 16 milisegundos para detectar diferencias de estado",
      "Cada mutación dispara la cola de actualización del DOM del navegador de forma síncrona, saltándose el Virtual DOM",
      "El compilador TypeScript transforma variables reactivas en instancias EventEmitter que emiten eventos globales"
    ],
    "correctIndex": 1,
    "explanation": "En Vue 3, los objetos reactivos se envuelven mediante instancias de `Proxy`. Toda función de renderizado se ejecuta dentro de un \"efecto reactivo\" activo. Durante la ejecución, el trap `get` del Proxy invoca `track()`, asociando la propiedad y el objeto a ese efecto en un mapa global (`targetMap`). Cuando se modifica la propiedad, el trap `set` ejecuta `trigger()`, buscando y reejecutando con precisión quirúrgica solo aquellos efectos que dependían de esa propiedad particular.",
    "compiledJS": "// Representación conceptual del núcleo de reactividad:\nconst targetMap = new WeakMap()\nlet activeEffect = null\n\nfunction track(target, key) {\n  if (!activeEffect) return\n  let depsMap = targetMap.get(target)\n  if (!depsMap) targetMap.set(target, (depsMap = new Map()))\n  let dep = depsMap.get(key)\n  if (!dep) depsMap.set(key, (dep = new Set()))\n  dep.add(activeEffect)\n}\n\nfunction trigger(target, key) {\n  const dep = targetMap.get(target)?.get(key)\n  dep?.forEach(effect => effect())\n}",
    "bestPractice": "Recuerda que el rastreo reactivo solo ocurre para accesos sincrónicos durante la ejecución del efecto. Leer propiedades reactivas dentro de temporizadores o tras un `await` no siempre quedará registrado dentro del efecto del render.",
    "source": "Vue.js Docs — Reactivity in Depth"
  },
  {
    "id": "a02",
    "topic": "Composables",
    "question": "¿Qué diferencia a un composable de Vue bien diseñado (ej.: `useMouse()`) de una simple función de utilidad?",
    "code": null,
    "options": [
      "Los composables deben basarse en clases y usar el patrón `extends Composable`",
      "Una función que usa primitivas de Composition API para encapsular y devolver lógica reactiva con estado",
      "Los composables solo pueden invocarse una vez por aplicación, como un singleton",
      "Los composables siempre deben devolver una Promise, ya que representan operaciones asíncronas"
    ],
    "correctIndex": 1,
    "explanation": "Una función de utilidad normal recibe entradas y devuelve valores estáticos. Un composable encapsula lógica reactiva con estado utilizando las primitivas de Vue (`ref`, `computed`, `watch`, hooks de ciclo de vida). Devuelve referencias reactivas que se mantienen conectadas a los cambios en el tiempo y se limpian automáticamente al desmontarse el componente que las llamó.",
    "compiledJS": "// useMouse.ts — composable con estado reactivo\nimport { ref, onMounted, onUnmounted } from 'vue'\n\nexport function useMouse() {\n  const x = ref(0)\n  const y = ref(0)\n\n  function update(event: MouseEvent) {\n    x.value = event.pageX\n    y.value = event.pageY\n  }\n\n  onMounted(() => window.addEventListener('mousemove', update))\n  onUnmounted(() => window.removeEventListener('mousemove', update))\n\n  return { x, y }\n}",
    "bestPractice": "Limpia siempre los listeners de eventos o suscripciones creados dentro de un composable en su hook `onUnmounted`, evitando fugas de memoria al destruir componentes.",
    "source": "Vue.js Docs — Composables"
  },
  {
    "id": "a03",
    "topic": "Suspense",
    "question": "¿Qué coordina el componente nativo `<Suspense>` en Vue 3?",
    "code": null,
    "options": [
      "Pausa el ciclo de vida de los componentes hasta que un evento explícito de clic o gesto del usuario autorice el montaje",
      "Muestra un fallback mientras dependencias asíncronas hijas se resuelven, montando el árbol final de forma atómica",
      "Reemplaza a `<KeepAlive>` guardando instancias asíncronas en memoria para restauración instantánea en cambios de ruta",
      "Ejecuta reintentos automáticos con retroceso exponencial si componentes asíncronos fallan al cargarse de la red"
    ],
    "correctIndex": 1,
    "explanation": "`<Suspense>` coordina componentes asíncronos en el árbol de Vue — específicamente aquellos cuyo `<script setup>` contiene un `await` en el nivel superior o componentes cargados mediante `defineAsyncComponent`. Mientras haya promesas pendientes en sus hijos, muestra el slot `#fallback`. Una vez resueltas todas, realiza una transición atómica al slot principal `#default`.",
    "compiledJS": "<template>\n  <Suspense>\n    <template #default>\n      <AsyncUserProfile :id=\"userId\" />\n    </template>\n    <template #fallback>\n      <div class=\"skeleton-loader\">Cargando perfil...</div>\n    </template>\n  </Suspense>\n</template>",
    "bestPractice": "Combina `<Suspense>` con el hook `onErrorCaptured` en el componente padre para capturar y manejar promesas rechazadas adecuadamente.",
    "source": "Vue.js Docs — Built-in Components: Suspense"
  },
  {
    "id": "a04",
    "topic": "Funciones de Renderizado (Render Functions)",
    "question": "¿Qué produce la llamada `h('div', { class: 'box' }, 'Hello')` y cuándo usarías `h()` en lugar de un `<template>`?",
    "code": null,
    "options": [
      "Inserta un elemento `<div>` concreto en el DOM del navegador de forma síncrona, devolviendo su referencia HTMLElement",
      "Devuelve un nodo de virtual DOM (VNode) para renderizado programático cuando la sintaxis de template no es suficiente",
      "Opera como un utilitario interno que ejecuta llamadas `history.pushState()` durante la navegación de Vue Router",
      "Está restringido exclusivamente a archivos compilados con JSX/TSX, no pudiendo invocarse en código TypeScript estándar"
    ],
    "correctIndex": 1,
    "explanation": "`h()` (abreviatura de hyperscript) genera VNodes — objetos JavaScript que describen la etiqueta, props y descendientes para que el runtime de Vue calcule las mutaciones del DOM real. Las plantillas de Vue se compilan a llamadas de `h()` en tiempo de construcción. Se recurre directamente a `h()` cuando la lógica de la interfaz es demasiado dinámica para la sintaxis de plantillas (ej.: generadores recursivos de árboles complejos o componentes de orden superior).",
    "compiledJS": "import { h } from 'vue'\n\n// Renderizado recursivo de árbol — engorroso en plantillas, natural con h()\nfunction TreeNode(props) {\n  return h('li', {}, [\n    props.node.label,\n    props.node.children?.length\n      ? h('ul', {}, props.node.children.map(child => h(TreeNode, { node: child })))\n      : null,\n  ])\n}",
    "bestPractice": "Usa `<template>` por defecto en la inmensa mayoría de los casos — las optimizaciones estáticas del compilador (patch flags, hoisting de VNodes estáticos) solo operan sobre plantillas compiladas, no sobre funciones de renderizado manuales.",
    "source": "Vue.js Docs — Render Functions & JSX"
  },
  {
    "id": "a05",
    "topic": "Directivas Personalizadas",
    "question": "¿Para qué sirve una directiva personalizada en Vue y qué hook implementarías para ejecutar lógica inmediatamente después de insertar el elemento en el DOM?",
    "code": null,
    "options": [
      "Sirven únicamente para añadir clases CSS dinámicas a elementos; `mounted` es el único hook disponible en la API",
      "Encapsulan lógica reutilizable de manipulación directa del DOM; `mounted(el, binding)` corre cuando el elemento entra al DOM",
      "Directivas personalizadas fueron descontinuadas en Vue 2 y reemplazadas por hooks de Composition API en Vue 3",
      "Se aplican exclusivamente a componentes personalizados de Vue y fallan si se declaran en etiquetas HTML nativas"
    ],
    "correctIndex": 1,
    "explanation": "Las directivas personalizadas (`v-mi-directiva`) permiten encapsular manipulaciones directas de bajo nivel sobre elementos del DOM (como enfocar un campo, formatear entradas o escuchar clics externos). Sus hooks de ciclo de vida replican los del componente: `mounted(el, binding)` se ejecuta inmediatamente después de que el elemento ha sido insertado en el DOM real, siendo el punto propicio para invocar `el.focus()` o registrar observadores.",
    "compiledJS": "// Directiva v-focus para auto-enfoque\nconst vFocus = {\n  mounted: (el) => el.focus(),\n}\n\n// Uso local:\n// <input v-focus />",
    "bestPractice": "Reserva las directivas para interacciones directas con el DOM. Si la lógica involucra estado o renderizado estructurado, opta por componentes o composables. Asegúrate de limpiar listeners creados en `mounted` dentro del hook `unmounted` de la directiva.",
    "source": "Vue.js Docs — Custom Directives"
  },
  {
    "id": "a06",
    "topic": "Guardas de Navegación del Router",
    "question": "En Vue Router, ¿cuál es la diferencia entre una guardia global `beforeEach` y una guardia por ruta `beforeEnter`?",
    "code": null,
    "options": [
      "`beforeEnter` ejecuta en todos los cambios globales de ruta; `beforeEach` corre solo en rutas específicas configuradas",
      "`beforeEach` corre globalmente en cada navegación; `beforeEnter` se dispara solo al entrar al registro de ruta puntual",
      "`beforeEnter` corre en tiempo de compilación durante el code splitting; `beforeEach` ejecuta en el navegador en runtime",
      "Ambos guards comparten el mismo alcance, siendo `beforeEnter` un alias descontinuado equivalente a `beforeEach`"
    ],
    "correctIndex": 1,
    "explanation": "`router.beforeEach` se registra globalmente y se dispara en cada cambio de ruta de la aplicación, siendo el sitio estándar para comprobaciones globales de inicio de sesión o analítica. Por el contrario, `beforeEnter` se declara directamente en el objeto de configuración de una ruta individual y solo se invoca cuando el usuario se desplaza hacia esa ruta concreta.",
    "compiledJS": "// Guardia global para autenticación\nrouter.beforeEach((to, from) => {\n  if (to.meta.requiresAuth && !isAuthenticated()) {\n    return { name: 'login', query: { redirect: to.fullPath } }\n  }\n})\n\n// Guardia específica de ruta\nconst routes = [\n  {\n    path: '/admin',\n    component: AdminDashboard,\n    beforeEnter: (to, from) => {\n      if (!currentUser.isAdmin) return '/unauthorized'\n    },\n  },\n]",
    "bestPractice": "Centraliza validaciones de acceso en una sola guardia `beforeEach` utilizando metadatos de ruta (`meta: { requiresAuth: true }`) en vez de dispersar guardias individuales por múltiples rutas.",
    "source": "Vue Router Docs — Navigation Guards"
  },
  {
    "id": "a07",
    "topic": "Pinia",
    "question": "¿Cuál es la principal ventaja de las tiendas Pinia frente a compartir manualmente un objeto `reactive()` entre componentes como solución casera de gestión de estado?",
    "code": null,
    "options": [
      "Pinia es funcionalmente idéntico a un objeto reactivo compartido — solo una envoltura estética",
      "Pinia ofrece soporte para devtools, instancias aisladas seguras para SSR por petición e inferencia TypeScript",
      "Pinia solo puede almacenar valores primitivos, nunca objetos anidados o arrays",
      "Pinia reemplaza completamente a Vue Router unificando rutas y estado"
    ],
    "correctIndex": 1,
    "explanation": "Un objeto reactivo compartido como singleton presenta serios problemas en Server-Side Rendering (SSR), ya que distintas solicitudes de usuarios compartirían el mismo estado en la memoria del servidor. Pinia genera instancias independientes por cada petición en SSR, ofrece integración profunda con Vue Devtools (inspección de estado y time-travel debugging), define una arquitectura clara de estado/acciones/getters y brinda tipado estático perfecto.",
    "compiledJS": "// stores/counter.ts — Pinia con sintaxis de setup\nimport { defineStore } from 'pinia'\nimport { ref, computed } from 'vue'\n\nexport const useCounterStore = defineStore('counter', () => {\n  const count = ref(0)\n  const doubleCount = computed(() => count.value * 2)\n  function increment() { count.value++ }\n\n  return { count, doubleCount, increment }\n})",
    "bestPractice": "Adopta la sintaxis \"setup store\" en Pinia (con funciones que devuelven refs y métodos) para alinearte de forma transparente con la Composition API y componer stores limpiamente.",
    "source": "Pinia Docs — Introduction"
  },
  {
    "id": "a08",
    "topic": "Primitivas de Rendimiento",
    "question": "¿Qué cambia `shallowRef()` en comparación con un `ref()` normal y cuándo vale la pena esa compensación?",
    "code": null,
    "options": [
      "`shallowRef()` hace que el valor sea inmutable y lanza un error ante cualquier mutación",
      "Solo rastrea reactividad al reasignar .value, omitiendo la conversión profunda de propiedades anidadas",
      "Es un sinónimo de `ref()` sin diferencia de comportamiento",
      "Solo puede contener valores primitivos, nunca objetos"
    ],
    "correctIndex": 1,
    "explanation": "Un `ref()` normal convierte cualquier objeto asignado en una estructura profundamente reactiva mediante Proxies en cada nivel. Para conjuntos de datos muy grandes o instancias de bibliotecas externas complejas, esto supone un costo sensible de CPU y memoria. `shallowRef()` solo vigila la reasignación de la propiedad de primer nivel `.value`. Modificar una propiedad interna no activará la reactividad, a menos que se fuerce con `triggerRef()` o se reemplace el objeto completo.",
    "compiledJS": "import { shallowRef, triggerRef } from 'vue'\n\nconst largeData = shallowRef({ items: [/* miles de registros */] })\n\n// No activa re-renderizado:\nlargeData.value.items.push(newItem)\n\n// SÍ activa re-renderizado (reemplazo completo):\nlargeData.value = { ...largeData.value, items: [...largeData.value.items, newItem] }\n\n// O fuerza actualización manual:\ntriggerRef(largeData)",
    "bestPractice": "Emplea `shallowRef` junto a `markRaw` para almacenar estructuras de datos masivas tratadas de forma inmutable o instancias de librerías externas que gestionan su propio ciclo de vida.",
    "source": "Vue.js Docs — Reactivity API: Advanced (shallowRef)"
  },
  {
    "id": "a09",
    "topic": "Hidratación en SSR",
    "question": "¿Qué causa la advertencia de \"hydration mismatch\" en una aplicación Vue renderizada en el servidor y por qué es peligroso ignorarla?",
    "code": null,
    "options": [
      "Representa una advertencia inofensiva de CSS en desarrollo, sin consecuencias sobre eventos o datos en producción",
      "El Virtual DOM generado en cliente difiere del HTML creado por el servidor, forzando a Vue a descartar HTML y rehacer el DOM",
      "Indica que Vue Router falló al encontrar una ruta correspondiente a la URL de la petición en la tabla de rutas cliente",
      "Ocurre exclusivamente cuando stores de Pinia fallan al serializar su estado en etiquetas script durante el proceso de SSR"
    ],
    "correctIndex": 1,
    "explanation": "En SSR, el servidor genera el HTML inicial que el cliente debe \"hidratar\" adjuntando eventos y reactividad. Si el cliente produce un árbol DOM que difiere del HTML entregado por el servidor (por ejemplo, al leer `window.innerWidth`, `localStorage` o fechas locales durante el renderizado inicial síncrono), Vue detecta la discordancia, descarta el tramo afectado y lo re-renderiza en el navegador, perdiendo el beneficio de carga rápida y causando parpadeo visual perceptible.",
    "compiledJS": "<!-- Problemático en SSR (provoca mismatch): -->\n<script setup>\nconst isMobile = typeof window !== 'undefined' && window.innerWidth < 768\n</script>\n\n<!-- Solución: valor inicial seguro para SSR y actualización en mounted -->\n<script setup>\nimport { ref, onMounted } from 'vue'\nconst isMobile = ref(false)\nonMounted(() => {\n  isMobile.value = window.innerWidth < 768\n})\n</script>",
    "bestPractice": "Nunca accedas a APIs exclusivas del navegador dentro del renderizado sincrónico de componentes en SSR. Aplica un valor neutro por defecto y actualiza el estado en el hook `onMounted`, que se ejecuta exclusivamente en el cliente tras completarse la hidratación.",
    "source": "Vue.js Docs — Server-Side Rendering: Hydration Mismatch"
  },
  {
    "id": "a10",
    "topic": "Optimizaciones del Compilador",
    "question": "¿Qué son las \"patch flags\" en la salida compilada de Vue 3 y cómo aceleran el re-renderizado respecto al diffing de virtual DOM de Vue 2?",
    "code": null,
    "options": [
      "Clases CSS especiales inyectadas en nodos dinámicos para activar aceleración por hardware en GPU durante transiciones",
      "Bitmasks numéricas generadas por el compilador en VNodes dinámicos, guiando el diff a inspeccionar solo bindings mutables",
      "Etiquetas de checksum criptográfico que validan si los bundles del cliente coinciden con los artefactos de servidor",
      "Punteros de memoria en runtime que conectan nodos del Virtual DOM directamente a estructuras de layout en C++ de browser"
    ],
    "correctIndex": 1,
    "explanation": "En Vue 2, el algoritmo de reconciliación comparaba recursivamente todo el árbol de VNodes sin saber de antemano qué nodos eran estáticos o dinámicos. El compilador de Vue 3 analiza la plantilla en tiempo de construcción y etiqueta cada VNode dinámico con una \"patch flag\" numérica. Durante las actualizaciones, el diffing consulta esta bandera y examina exclusivamente la parte dinámica (como únicamente el nodo de texto o únicamente las clases), ignorando por completo todo el contenido estático.",
    "compiledJS": "<!-- Plantilla -->\n<div class=\"container\">\n  <span>Texto estático hoisted</span>\n  <p>{{ dynamicText }}</p>\n</div>\n\n<!-- En la función de render compilada, el <span> estático se extrae (hoisted) -->\n<!-- y el <p> recibe la bandera patch flag 1 /* TEXT */: -->\n// _createElementVNode(\"p\", null, _toDisplayString(_ctx.dynamicText), 1 /* TEXT */)",
    "bestPractice": "Usa siempre que sea posible plantillas en lugar de funciones `h()` manuales: las optimizaciones del compilador (hoisting estático, patch flags y block trees) se aplican únicamente sobre plantillas compiladas.",
    "source": "Vue.js Docs — Rendering Mechanism: Compiler-Informed Virtual DOM"
  }
]
