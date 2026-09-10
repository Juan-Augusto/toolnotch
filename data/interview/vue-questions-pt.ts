import type { InterviewQuestion } from '@/lib/interviewTypes'

export const VUE_QUESTIONS_PT: InterviewQuestion[] = [
  {
    "id": "b01",
    "topic": "createApp",
    "question": "No Vue 3, o que `createApp(App).mount('#app')` faz?",
    "code": null,
    "options": [
      "Baixa o runtime do Vue via CDN e o injeta na página",
      "Cria uma nova instância isolada de aplicação a partir do componente raiz e a monta no elemento do DOM correspondente ao seletor",
      "Compila todos os arquivos `.vue` do projeto em um único bundle",
      "Registra `App` como um componente global disponível em todos os outros componentes"
    ],
    "correctIndex": 1,
    "explanation": "`createApp()` é a fábrica de aplicações do Vue 3 — ela retorna uma instância de aplicação com escopo próprio, ao contrário do construtor global único `Vue` do Vue 2. Cada instância possui suas próprias configurações (componentes globais, diretivas, plugins) que não vazam para outras instâncias na mesma página, o que é essencial para micro-frontends ou widgets independentes. `.mount()` pega a instância, compila e renderiza a árvore de componentes raiz, substituindo o conteúdo do elemento DOM alvo pelo resultado renderizado. O elemento em si não é removido — seus atributos são mesclados ao elemento raiz do componente.",
    "compiledJS": "import { createApp } from 'vue'\nimport App from './App.vue'\n\nconst app = createApp(App)\napp.mount('#app')\n\n// Múltiplas aplicações isoladas em uma mesma página:\nconst app2 = createApp(OtherRoot)\napp2.mount('#widget')\n// app e app2 não compartilham configurações globais — registrar\n// um componente em `app` NÃO o torna disponível em `app2`.",
    "bestPractice": "Registre plugins, diretivas e componentes globais na instância `app` antes de chamar `.mount()`. Configurações feitas antes da montagem mantêm a inicialização previsível. Evite criar múltiplas instâncias de `createApp()` a menos que esteja incorporando widgets de fato independentes; uma única aplicação raiz com roteamento é o padrão para aplicações completas.",
    "source": "Vue.js Docs — Creating a Vue Application"
  },
  {
    "id": "b02",
    "topic": "Interpolação de Template",
    "question": "O que `{{ message }}` renderiza dentro de um template Vue?",
    "code": null,
    "options": [
      "A string literal \"message\"",
      "O valor atual da propriedade reativa `message`, renderizado automaticamente sempre que ela mudar",
      "Uma referência ao nó DOM, não o seu valor",
      "Renderiza apenas uma vez na montagem e nunca atualiza"
    ],
    "correctIndex": 1,
    "explanation": "A sintaxe de chaves duplas (\"mustache\") é a interpolação de texto — o Vue avalia `message` como uma expressão JavaScript no estado reativo do componente e insere a string resultante no DOM como texto (não HTML). Por estar integrada ao sistema de reatividade do Vue, qualquer alteração no valor agenda uma nova renderização cirúrgica apenas nas partes do DOM dependentes desse valor. A interpolação sempre aplica escape automático de HTML — para renderizar HTML puro, utiliza-se a diretiva `v-html`, que desativa explicitamente essa proteção.",
    "compiledJS": "<script setup>\nimport { ref } from 'vue'\nconst message = ref('Hello Vue!')\n</script>\n\n<template>\n  <p>{{ message }}</p>\n  <!-- renderiza: <p>Hello Vue!</p> -->\n  <button @click=\"message = 'Updated!'\">Alterar</button>\n  <!-- ao clicar, re-renderiza apenas o nó de texto <p> -->\n</template>",
    "bestPractice": "Nunca utilize `v-html` com conteúdo fornecido pelo usuário — ele ignora o escape de caracteres e abre brechas diretas para ataques XSS. Mantenha expressões no template simples (acesso a propriedades, ternários simples); extraia lógicas mais complexas para propriedades `computed` a fim de manter os templates limpos e testáveis.",
    "source": "Vue.js Docs — Template Syntax: Text Interpolation"
  },
  {
    "id": "b03",
    "topic": "Abreviação v-bind",
    "question": "Qual é a sintaxe abreviada para `v-bind:href=\"url\"`?",
    "code": null,
    "options": [
      "`@href=\"url\"`",
      "`:href=\"url\"`",
      "`#href=\"url\"`",
      "`.href=\"url\"`"
    ],
    "correctIndex": 1,
    "explanation": "`v-bind` conecta um atributo HTML ou propriedade do DOM a uma expressão reativa, e seu atalho é o caractere de dois pontos: `:href=\"url\"`. Isso difere de `v-on`, cujo atalho é `@` (ex.: `@click=\"handler\"`). O símbolo `#` é o atalho para `v-slot` (usado em `<template>` para slots nomeados ou scoped), e `.` é usado como sufixo de modificador (ex.: `@click.stop`). Confundir essas sintaxes é um erro comum: `@href` tentaria escutar um evento DOM chamado \"href\", que não existe.",
    "compiledJS": "<template>\n  <!-- Sintaxe completa -->\n  <a v-bind:href=\"url\">Link</a>\n\n  <!-- Abreviação (comportamento idêntico) -->\n  <a :href=\"url\">Link</a>\n\n  <!-- Argumento dinâmico -->\n  <a :[attributeName]=\"url\">Link</a>\n  <!-- se attributeName === 'href', equivale a :href -->\n</template>",
    "bestPractice": "Utilize os atalhos (`:` e `@`) de forma consistente no projeto — mesclar a sintaxe completa com atalhos sem necessidade prejudica a legibilidade. Reserve argumentos dinâmicos (`:[attr]`) para situações genuinamente dinâmicas, mantendo o nome fixo sempre que ele for conhecido previamente para melhor suporte da IDE.",
    "source": "Vue.js Docs — Template Syntax: v-bind Shorthand"
  },
  {
    "id": "b04",
    "topic": "v-if vs v-show",
    "question": "Qual é a principal diferença de comportamento entre `v-if` e `v-show`?",
    "code": null,
    "options": [
      "`v-if` monta e desmonta nós do DOM fisicamente; `v-show` renderiza o nó e alterna o estilo CSS `display: none`",
      "`v-show` monta e desmonta nós do DOM fisicamente; `v-if` renderiza o nó e alterna o estilo CSS `display: none`",
      "`v-if` opera exclusivamente em inputs de formulário; `v-show` opera apenas em componentes customizados",
      "Ambas as diretivas geram o mesmo código no DOM, sendo `v-show` apenas um atalho sintático para o `v-if`"
    ],
    "correctIndex": 1,
    "explanation": "`v-if` é uma renderização condicional \"real\": quando a condição é falsa, o Vue destrói completamente o elemento e os componentes filhos — os hooks de ciclo de vida como `unmounted` são executados e listeners de evento são limpos. Quando volta para verdadeiro, tudo é recriado do zero (disparando `mounted` novamente). Já o `v-show` sempre renderiza o elemento no DOM e apenas alterna a propriedade CSS `display: none`, pagando o custo de renderização inicial uma única vez e sem disparar hooks de desmontagem. Além disso, apenas `v-if` suporta encadeamento com `v-else-if`/`v-else`.",
    "compiledJS": "<template>\n  <!-- v-if: elemento é adicionado/removido do DOM -->\n  <ExpensiveWidget v-if=\"showWidget\" />\n  <!-- alternar showWidget remonta o componente inteiro -->\n\n  <!-- v-show: elemento sempre existe no DOM, display é alternado -->\n  <ExpensiveWidget v-show=\"showWidget\" />\n  <!-- style=\"display: none\" quando showWidget for falso -->\n  <!-- mounted() dispara apenas UMA vez -->\n</template>",
    "bestPractice": "Utilize `v-show` para elementos que alternam de visibilidade com frequência (abas, menus dropdown) para evitar o custo de recriação de nós e componentes. Utilize `v-if` para conteúdos que raramente mudam ou quando for desejável que o componente seja destruído para reiniciar seu estado interno e liberar recursos.",
    "source": "Vue.js Docs — Conditional Rendering: v-if vs v-show"
  },
  {
    "id": "b05",
    "topic": "v-for e :key",
    "question": "Por que o Vue exige (ou recomenda fortemente) uma ligação `:key` em elementos renderizados com `v-for`?",
    "code": null,
    "options": [
      "`:key` é puramente estético e só afeta o valor retornado por `element.dataset.key`",
      "Fornece uma identidade estável para o Vue rastrear, reordenar e reutilizar nós do DOM no diffing",
      "É obrigatório apenas para elementos `<template>`, nunca para tags HTML comuns",
      "`:key` melhora a performance de rede armazenando em cache a resposta da API desse item"
    ],
    "correctIndex": 1,
    "explanation": "O algoritmo de diffing do virtual DOM do Vue busca, por padrão, reaproveitar nós DOM existentes na mesma posição por eficiência. Sem uma `key`, o Vue atualiza os nós pelo índice numérico, o que causa anomalias ao reordenar, filtrar ou inserir itens no meio da lista — estados locais de componentes ou campos de formulário podem permanecer no nó errado. Uma `:key` estável e única (como um ID de banco) permite que o Vue identifique com precisão qual item se moveu, foi inserido ou removido, preservando o estado correto e executando transições fluidas.",
    "compiledJS": "<template>\n  <!-- RUIM: usar índice como key causa falhas ao ordenar/remover -->\n  <li v-for=\"(item, index) in items\" :key=\"index\">\n    {{ item.name }}\n  </li>\n\n  <!-- BOM: identidade estável derivada dos dados -->\n  <li v-for=\"item in items\" :key=\"item.id\">\n    {{ item.name }}\n  </li>\n</template>",
    "bestPractice": "Sempre utilize um identificador único e estável dos dados como `:key` — evite o índice do array em listas mutáveis. Se os itens não tiverem ID natural, gere um ID único no momento em que os dados forem criados ou recebidos da API, e nunca use `Math.random()` diretamente no template.",
    "source": "Vue.js Docs — List Rendering: Maintaining State with key"
  },
  {
    "id": "b06",
    "topic": "ref()",
    "question": "O que `ref()` faz na Composition API do Vue 3 e por que seu valor deve ser acessado via `.value` dentro de `<script setup>`?",
    "code": null,
    "options": [
      "Cria uma referência direta a elementos do DOM real, usando `.value` para ler o valor nativo do HTML",
      "Encapsula o valor em um objeto reativo com getter/setter em `.value`, permitindo rastrear primitivos via Proxy",
      "Instancia um snapshot imutável de estado onde `.value` retorna clones profundos para evitar mutações diretas",
      "Envolve o dado em uma Promise onde `.value` atua como desempacotador de tipos exigido pelo TypeScript"
    ],
    "correctIndex": 1,
    "explanation": "O sistema de reatividade do Vue 3 é baseado em `Proxy` do JavaScript, que intercepta o acesso e a modificação de propriedades de objetos. Tipos primitivos (números, strings, booleanos) são passados por valor e não podem ser interceptados diretamente. `ref()` soluciona isso encapsulando o valor dentro de um objeto `{ value: ... }`. Dentro do `<template>`, o Vue desempacota refs de nível superior automaticamente (permitindo usar `{{ count }}`), mas dentro do bloco `<script setup>` você deve sempre acessar ou modificar explicitamente `count.value`.",
    "compiledJS": "<script setup>\nimport { ref } from 'vue'\n\nconst count = ref(0)\nconsole.log(count)        // RefImpl { value: 0, ... }\nconsole.log(count.value)  // 0\n\nfunction increment() {\n  count.value++  // precisa usar .value dentro de <script>\n}\n</script>\n\n<template>\n  <!-- desempacotado automaticamente no template -->\n  <button @click=\"increment\">{{ count }}</button>\n</template>",
    "bestPractice": "Utilize `ref()` para tipos primitivos e para valores que você pretende reatribuir por completo (ex.: substituir um array ou objeto inteiro com dados de uma API). Utilize `reactive()` para objetos onde mutações ocorrem propriedade por propriedade. Ao desestruturar um objeto `reactive()`, utilize `toRefs()` para não perder a reatividade.",
    "source": "Vue.js Docs — Reactivity Fundamentals: ref()"
  },
  {
    "id": "b07",
    "topic": "computed()",
    "question": "Qual é a principal vantagem de uma propriedade `computed` sobre a chamada de um método comum no template?",
    "code": null,
    "options": [
      "Métodos armazenam retorno em cache; propriedades computadas recalculam a cada ciclo de renderização do componente",
      "Propriedades computadas armazenam resultado em cache reativo, recalculando apenas quando suas dependências mudam",
      "Propriedades computadas executam em Web Workers assíncronos; métodos comuns rodam na thread principal do browser",
      "Não há diferença — métodos no template e propriedades computadas possuem desempenho e ciclo de vida idênticos"
    ],
    "correctIndex": 1,
    "explanation": "Uma propriedade `computed` representa um valor reativo derivado de outros estados. O Vue monitora quais dependências reativas são lidas durante a execução do getter e armazena o resultado em cache — acessos subsequentes retornam o valor em cache instantaneamente, recalculando de forma preguiçosa apenas quando alguma dependência é alterada. Em contraste, uma chamada de método no template (ex.: `{{ getFullName() }}`) é reexecutada a cada ciclo de renderização do componente, mesmo que os dados pertinentes não tenham mudado.",
    "compiledJS": "<script setup>\nimport { ref, computed } from 'vue'\n\nconst firstName = ref('Ada')\nconst lastName = ref('Lovelace')\n\n// Em cache — só recalcula quando firstName ou lastName mudam\nconst fullName = computed(() => {\n  console.log('computando fullName')\n  return `${firstName.value} ${lastName.value}`\n})\n\n// Executa a CADA renderização do componente\nfunction getFullNameMethod() {\n  console.log('chamando método')\n  return `${firstName.value} ${lastName.value}`\n}\n</script>\n\n<template>\n  <p>{{ fullName }}</p>\n  <p>{{ getFullNameMethod() }}</p>\n</template>",
    "bestPractice": "Prefira `computed` para qualquer cálculo ou transformação derivado exclusivamente de outro estado reativo — é mais performático e declarativo. Utilize métodos comuns apenas para ações disparadas por eventos do usuário (como cliques) ou funções que executem efeitos colaterais.",
    "source": "Vue.js Docs — Computed Properties"
  },
  {
    "id": "b08",
    "topic": "Declaração de Props",
    "question": "Como declarar que um componente filho aceita uma prop `title` obrigatória do tipo `String` usando `<script setup>`?",
    "code": null,
    "options": [
      "`const props = ref({ title: String })`",
      "`defineProps({ title: { type: String, required: true } })`",
      "`export const title = String`",
      "`this.props.title = String`"
    ],
    "correctIndex": 1,
    "explanation": "`defineProps()` é uma macro do compilador disponível dentro de `<script setup>` — não precisa ser importada e é processada em tempo de build. Ao passar um objeto com `type` e `required: true`, o Vue ativa a validação em runtime: em modo de desenvolvimento, um aviso é emitido no console caso a prop obrigatória não seja informada ou se o tipo for incorreto. Props são somente leitura para o componente filho; modificá-las diretamente quebra o fluxo unidirecional de dados.",
    "compiledJS": "<script setup>\ndefineProps({\n  title: {\n    type: String,\n    required: true,\n  },\n  count: {\n    type: Number,\n    default: 0,\n  },\n})\n</script>\n\n<template>\n  <h2>{{ title }}</h2>\n  <p>Contagem: {{ count }}</p>\n</template>",
    "bestPractice": "Sempre declare `type` e `required`/`default` explicitamente ao invés da forma abreviada por array (`defineProps(['title'])`). Em projetos com TypeScript, prefira a sintaxe com genérico `defineProps<{ title: string; count?: number }>()` para validação em tempo de compilação com suporte completo a autocompletar.",
    "source": "Vue.js Docs — Component Basics: Props"
  },
  {
    "id": "b09",
    "topic": "emit()",
    "question": "Em um componente filho com `<script setup>`, qual é a forma correta de notificar o componente pai sobre um evento \"submit\", opcionalmente passando dados (payload)?",
    "code": null,
    "options": [
      "`this.$parent.onSubmit(payload)`",
      "const emit = defineEmits(['submit']); emit('submit', payload)",
      "`window.dispatchEvent(new CustomEvent('submit', payload))`",
      "`props.onSubmit(payload)`"
    ],
    "correctIndex": 1,
    "explanation": "`defineEmits()` é a macro do compilador que define os eventos customizados que um componente pode emitir. A função retornada (`emit`) aceita o nome do evento e argumentos opcionais que constituem o payload recebido pelo pai em `@submit=\"handler\"`. Esse mecanismo garante o fluxo unidirecional de dados no Vue: props descem do pai para o filho, e eventos sobem do filho para o pai, evitando acoplamento indevido ou contorno com eventos globais do DOM.",
    "compiledJS": "<!-- ChildForm.vue -->\n<script setup>\nconst emit = defineEmits(['submit'])\n\nfunction handleClick() {\n  emit('submit', { name: 'Ada', email: 'ada@example.com' })\n}\n</script>\n\n<template>\n  <button @click=\"handleClick\">Enviar</button>\n</template>\n\n<!-- ParentForm.vue -->\n<template>\n  <ChildForm @submit=\"onSubmit\" />\n</template>\n<script setup>\nfunction onSubmit(payload) {\n  console.log(payload)\n}\n</script>",
    "bestPractice": "Declare todos os eventos emitidos explicitamente com `defineEmits` — isso melhora a documentação do componente, permite tipagem estática e ajuda ferramentas de desenvolvimento a alertar sobre inconsistências.",
    "source": "Vue.js Docs — Component Basics: Listening to Events"
  },
  {
    "id": "b10",
    "topic": "Single-File Components",
    "question": "Quais são os três blocos de nível superior que compõem um Single-File Component padrão do Vue (arquivo `.vue`)?",
    "code": null,
    "options": [
      "`<head>`, `<body>`, `<footer>`",
      "`<template>`, `<script>`, `<style>`",
      "`<html>`, `<js>`, `<css>`",
      "`<render>`, `<data>`, `<methods>`"
    ],
    "correctIndex": 1,
    "explanation": "Um Single-File Component (SFC) com extensão `.vue` agrupa marcação, lógica e estilização em um único arquivo por meio de três blocos: `<template>` (a marcação HTML compilada para a render function), `<script>` ou `<script setup>` (a lógica JavaScript/TypeScript) e `<style>` (o CSS, que pode ser isolado com o atributo `scoped`). Ferramentas de build como o Vite compilam esses blocos para JavaScript e CSS puros consumíveis pelo navegador.",
    "compiledJS": "<!-- UserCard.vue -->\n<template>\n  <div class=\"user-card\">{{ user.name }}</div>\n</template>\n\n<script setup>\nimport { defineProps } from 'vue'\nconst props = defineProps({ user: Object })\n</script>\n\n<style scoped>\n.user-card {\n  padding: 1rem;\n  border-radius: 8px;\n}\n/* scoped: gera um atributo data-v-xxxxx único para isolar estilos */\n</style>",
    "bestPractice": "Utilize estilos `scoped` por padrão para evitar que regras CSS de um componente afetem outros elementos da aplicação. Mantenha `<script setup>` no topo do arquivo (antes de `<template>`), seguindo as convenções mais comuns de estilo e linters.",
    "source": "Vue.js Docs — Single-File Components"
  },
  {
    "id": "i01",
    "topic": "ref vs reactive",
    "question": "Qual é a principal diferença prática entre `ref({ count: 0 })` e `reactive({ count: 0 })`, e por que reatribuir o objeto inteiro importa?",
    "code": null,
    "options": [
      "`ref()` é exclusivo para objetos e arrays; `reactive()` é obrigatório para números, strings e booleanos",
      "`reactive()` retorna um Proxy que perde reatividade se for reatribuído; `ref()` aceita reatribuição em `.value`",
      "`ref()` faz rastreamento profundo de dependências; `reactive()` é raso e observa apenas chaves de primeiro nível",
      "`ref()` opera apenas dentro da Options API; `reactive()` é restrito exclusivamente ao `<script setup>`"
    ],
    "correctIndex": 1,
    "explanation": "`reactive()` cria e retorna um Proxy do objeto diretamente. Quando você faz `state = { count: 5 }`, a variável passa a apontar para um novo objeto comum em memória, desconectando-se do Proxy que o Vue estava monitorando — qualquer template ou watcher vinculado ao Proxy original deixará de receber atualizações. Já `ref()` mantém uma casca estável `{ value: ... }`; ao atribuir `stateRef.value = newObj`, a reatribuição passa pelo setter reativo da propriedade `.value`, notificando todos os observadores com segurança.",
    "compiledJS": "import { ref, reactive } from 'vue'\n\n// reactive() — quebra se reatribuído diretamente\nlet state = reactive({ count: 0 })\nstate = { count: 5 } // ERRO: perde a ligação reativa com o Vue\n\n// ref() — seguro para reatribuição completa\nconst stateRef = ref({ count: 0 })\nstateRef.value = { count: 5 } // FUNCIONA: .value é o ponto monitorado\n\n// Forma correta de atualizar reactive() sem quebrar:\nconst state2 = reactive({ count: 0 })\nObject.assign(state2, { count: 5 }) // mutação interna preserva o Proxy",
    "bestPractice": "Prefira padronizar o uso de `ref()` em toda a aplicação, inclusive para objetos e arrays que possam ser substituídos integralmente (como retornos de chamadas assíncronas). Reserve `reactive()` para estados complexos onde mutações pontuais em propriedades sejam a regra e a referência permaneça estritamente constante.",
    "source": "Vue.js Docs — Reactivity Fundamentals: Limitations of reactive()"
  },
  {
    "id": "i02",
    "topic": "computed vs watch",
    "question": "Quando você deve escolher `watch()` em vez de uma propriedade `computed`?",
    "code": null,
    "options": [
      "`watch` deve ser sempre preferido — `computed` é uma API legada do Vue 2",
      "Quando é necessário executar um efeito colateral (APIs, DOM, logs) em resposta a mudanças de estado",
      "São intercambiáveis em todos os casos, sem diferença prática",
      "`watch` é obrigatório sempre que mais de uma dependência reativa estiver envolvida"
    ],
    "correctIndex": 1,
    "explanation": "`computed` é destinado a derivações puras e síncronas — a partir de dados reativos existentes, produz-se um novo dado calculado sem efeitos colaterais. `computed` é preguiçoso e faz cache do resultado. `watch` é feito especificamente para reagir a mudanças com efeitos colaterais: disparar chamadas HTTP quando um parâmetro de rota muda, gravar dados no `localStorage`, sincronizar elementos do DOM imperativamente ou disparar logs. Inserir efeitos colaterais ou chamadas assíncronas dentro de um getter `computed` é um anti-padrão grave.",
    "compiledJS": "import { ref, computed, watch } from 'vue'\n\nconst searchQuery = ref('')\nconst results = ref([])\n\n// CORRETO: computed para derivação de estado puro\nconst queryLength = computed(() => searchQuery.value.length)\n\n// CORRETO: watch para efeito colateral (requisição de API)\nwatch(searchQuery, async (newQuery) => {\n  if (!newQuery) { results.value = []; return }\n  const res = await fetch(`/api/search?q=${newQuery}`)\n  results.value = await res.json()\n})",
    "bestPractice": "Pergunte-se: \"estou calculando um valor para exibir no template ou estou executando uma ação como resposta a uma mudança?\". No primeiro caso, use `computed`; no segundo, use `watch` ou `watchEffect`. Limpe recursos alocados pelo watcher (como timers ou inscrições) fornecendo uma função de cleanup.",
    "source": "Vue.js Docs — Computed Properties vs. Watchers"
  },
  {
    "id": "i03",
    "topic": "watchEffect",
    "question": "Como `watchEffect(fn)` decide quais fontes reativas rastrear, em comparação com `watch(source, fn)`?",
    "code": null,
    "options": [
      "Exige a passagem de um array explícito de dependências reativas, exatamente igual ao `useEffect` da biblioteca React",
      "Rastreia automaticamente todas as propriedades lidas de forma síncrona no callback, dispensando array de dependências",
      "Nunca executa novamente após a montagem inicial — roda apenas uma vez no ciclo de vida e depois se desconecta",
      "Rastreia estritamente variáveis criadas com `ref()`, ignorando alterações feitas em objetos criados com `reactive()`"
    ],
    "correctIndex": 1,
    "explanation": "`watchEffect` executa a função de callback imediatamente ao ser registrado e intercepta automaticamente todas as propriedades reativas lidas sincronicamente durante essa execução. Quando qualquer uma dessas dependências mudar no futuro, o efeito será disparado novamente. Em contrapartida, `watch` requer a indicação explícita da fonte (uma ref, getter ou array) e é executado de forma preguiçosa por padrão (não roda na inicialização a menos que `{ immediate: true }` seja configurado).",
    "compiledJS": "import { ref, watchEffect } from 'vue'\n\nconst id = ref(1)\nconst includeDetails = ref(false)\n\nwatchEffect(() => {\n  console.log('buscando id:', id.value)\n  if (includeDetails.value) {\n    console.log('incluindo detalhes adicionais')\n  }\n})\n// Executa de imediato na inicialização rastreando id e (se condicional) includeDetails\nid.value = 2 // Dispara reexecução automaticamente",
    "bestPractice": "Utilize `watchEffect` quando o efeito depender naturalmente de múltiplos valores lidos diretamente no fluxo da lógica. Prefira `watch` explícito quando precisar comparar o valor novo com o valor anterior (`newValue`, `oldValue`) ou quando quiser evitar a execução imediata na montagem.",
    "source": "Vue.js Docs — Watchers: watchEffect()"
  },
  {
    "id": "i04",
    "topic": "Composition vs Options API",
    "question": "Qual é a principal diferença estrutural entre a Options API e a Composition API no Vue 3?",
    "code": null,
    "options": [
      "Options API tem melhor desempenho em runtime; Composition API compila bundles de JavaScript maiores em produção",
      "Options API organiza código por tipo de opção (data, methods); Composition API agrupa por funcionalidade com composables",
      "Options API foi descontinuada no Vue 3 e gera erros de compilação a menos que o modo compatibilidade seja ativado",
      "Options API permite compartilhar estado entre telas; Composition API restringe o estado ao escopo de um só componente"
    ],
    "correctIndex": 1,
    "explanation": "Na Options API, a lógica do componente é dividida por categorias técnicas (`data`, `computed`, `methods`, `watch`), o que faz com que o código de uma funcionalidade fique disperso pelo arquivo. A Composition API permite agrupar todas as variáveis, cálculos e funções relacionadas a um mesmo objetivo de negócio no mesmo bloco, facilitando a compreensão e permitindo extrair blocos de lógica para funções \"composables\" reutilizáveis (`useFeature()`) sem colisões de nomes associadas aos antigos mixins.",
    "compiledJS": "// Options API — lógica separada por tipo de opção\nexport default {\n  data() { return { count: 0 } },\n  computed: { doubled() { return this.count * 2 } },\n  methods: { inc() { this.count++ } },\n}\n\n// Composition API — lógica agrupada por responsabilidade\nimport { ref, computed } from 'vue'\nexport default {\n  setup() {\n    const count = ref(0)\n    const doubled = computed(() => count.value * 2)\n    function inc() { count.value++ }\n    return { count, doubled, inc }\n  },\n}",
    "bestPractice": "Para componentes de média a alta complexidade, padronize a Composition API com `<script setup>`: ela oferece tipagem TypeScript superior, menor tamanho de bundle e melhor reutilização de código entre componentes.",
    "source": "Vue.js Docs — Composition API FAQ"
  },
  {
    "id": "i05",
    "topic": "provide/inject",
    "question": "Qual problema o `provide()`/`inject()` resolve que props comuns não resolvem de forma limpa?",
    "code": null,
    "options": [
      "Substitui o Pinia em toda a aplicação sincronizando estado entre componentes irmãos sem precisar de ancestral comum",
      "Transmite dados e métodos de um ancestral para descendentes profundos sem necessidade de prop drilling intermediário",
      "Permite que componentes filhos alterem o estado dos pais diretamente sem emitir eventos ou acionar hooks reativos",
      "Funciona estritamente entre um componente e seus filhos diretos, impondo validação de tipos TypeScript em runtime"
    ],
    "correctIndex": 1,
    "explanation": "`provide`/`inject` resolve o problema de \"prop drilling\", onde componentes intermediários precisam receber e repassar props apenas para que um componente descendente distante tenha acesso a elas. Com `provide('chave', valor)` em um ancestral, qualquer descendente na árvore pode consumir o valor usando `inject('chave')`. Quando o valor provido é uma `ref` ou objeto `reactive`, as atualizações refletem reativamente nos componentes consumidores.",
    "compiledJS": "// GrandParent.vue\n<script setup>\nimport { provide, ref } from 'vue'\nconst theme = ref('dark')\nprovide('theme', theme)\n</script>\n\n// Child.vue (profundamente aninhado, sem passar pelo intermediário)\n<script setup>\nimport { inject } from 'vue'\nconst theme = inject('theme', 'light') // 'light' como valor padrão fallback\n</script>\n<template><div :class=\"theme\">{{ theme }}</div></template>",
    "bestPractice": "Utilize chaves tipadas com `InjectionKey<T>` do Vue baseadas em `Symbol` para evitar colisões de strings e garantir type-safety em projetos TypeScript. Forneça sempre um valor padrão no segundo argumento de `inject` para que os componentes continuem funcionando caso renderizados fora do provider.",
    "source": "Vue.js Docs — Provide / Inject"
  },
  {
    "id": "i06",
    "topic": "Slots",
    "question": "Qual é a diferença entre um slot padrão (default) e um slot nomeado (named slot) em um componente Vue?",
    "code": null,
    "options": [
      "Não há diferença — slots nomeados são apenas uma sintaxe alternativa para o mesmo mecanismo sem alteração de comportamento",
      "O slot padrão recebe conteúdo não direcionado, enquanto slots nomeados criam pontos de injeção via <template #nome>",
      "Slots nomeados aceitam apenas texto estático, nunca conteúdo reativo dinâmico",
      "Um componente pode ter apenas um slot no total — ou padrão ou nomeado, nunca ambos"
    ],
    "correctIndex": 1,
    "explanation": "Slots constituem o mecanismo de distribuição de conteúdo do Vue, permitindo que um componente pai injete nós e elementos dentro do template de um componente filho. O slot padrão (`<slot />`) recebe o conteúdo geral que não especifica nenhum slot alvo. Já slots nomeados (`<slot name=\"header\" />`) permitem criar múltiplos pontos de encaixe em partes distintas do layout do filho (como cabeçalho, corpo e rodapé), preenchidos pelo pai através de `<template #header>`.",
    "compiledJS": "<!-- Card.vue -->\n<template>\n  <div class=\"card\">\n    <header><slot name=\"header\">Título Padrão</slot></header>\n    <main><slot /></main>\n    <footer><slot name=\"footer\" /></footer>\n  </div>\n</template>\n\n<!-- Uso no pai -->\n<Card>\n  <template #header><h2>Título Customizado</h2></template>\n  <p>Conteúdo do slot padrão.</p>\n  <template #footer><button>Fechar</button></template>\n</Card>",
    "bestPractice": "Forneça conteúdo de fallback sensato dentro das tags `<slot>` no componente filho, para que ele funcione adequadamente mesmo quando o pai não passar conteúdo para aquele slot específico.",
    "source": "Vue.js Docs — Slots"
  },
  {
    "id": "i07",
    "topic": "Hooks de Ciclo de Vida",
    "question": "Na Composition API, qual hook executa após o componente ter sido montado e seus elementos do DOM estarem acessíveis, sendo o local adequado para inicializar bibliotecas DOM de terceiros?",
    "code": null,
    "options": [
      "`onBeforeMount`",
      "`onMounted`",
      "`onCreated`",
      "`onUpdated`"
    ],
    "correctIndex": 1,
    "explanation": "`onMounted` é disparado imediatamente após a renderização inicial do componente ter sido inserida no DOM real. Nesse ponto, referências de template (`ref=\"elemento\"`) já estão populadas com os elementos correspondentes, permitindo inicializar bibliotecas como gráficos, editores de texto ou manipuladores de canvas. Na Composition API não existe o hook `onCreated`: qualquer código no nível superior do `<script setup>` executa naturalmente antes da montagem.",
    "compiledJS": "<script setup>\nimport { ref, onMounted, onUnmounted } from 'vue'\n\nconst canvasEl = ref(null)\nlet chartInstance = null\n\nonMounted(() => {\n  // DOM já existe e canvasEl.value está disponível\n  chartInstance = new Chart(canvasEl.value, { /* config */ })\n})\n\nonUnmounted(() => {\n  chartInstance?.destroy()\n})\n</script>\n\n<template>\n  <canvas ref=\"canvasEl\"></canvas>\n</template>",
    "bestPractice": "Sempre associe inicializações feitas em `onMounted` à limpeza correspondente em `onUnmounted` (destruir instâncias, remover event listeners globais, limpar intervals) para prevenir vazamentos de memória na aplicação.",
    "source": "Vue.js Docs — Lifecycle Hooks"
  },
  {
    "id": "i08",
    "topic": "v-model Customizado",
    "question": "O que um componente precisa fazer internamente para suportar a ligação `v-model` a partir do seu pai (ex.: `<CustomInput v-model=\"text\" />`)?",
    "code": null,
    "options": [
      "Nada — `v-model` funciona automaticamente em qualquer componente sem nenhuma configuração",
      "Aceitar a prop modelValue e emitir o evento update:modelValue quando o valor mudar",
      "Importar um composable especial `useVModel()` do Vue Router",
      "Declarar o componente com `defineModel: true` em suas opções"
    ],
    "correctIndex": 1,
    "explanation": "Em componentes Vue, a sintaxe `v-model=\"text\"` é uma abreviação para `:modelValue=\"text\"` em conjunto com o ouvinte `@update:modelValue=\"text = $event\"`. Para oferecer suporte, o componente filho deve declarar a prop `modelValue` e emitir `update:modelValue` passando o novo valor sempre que o estado interno for alterado. A partir do Vue 3.4, a macro `defineModel()` simplifica esse processo gerenciando a prop e o evento de forma integrada.",
    "compiledJS": "<!-- Vue 3.4+ com defineModel() -->\n<script setup>\nconst model = defineModel()\n</script>\n<template>\n  <input v-model=\"model\" />\n</template>\n\n<!-- Abordagem tradicional explícita -->\n<script setup>\ndefineProps(['modelValue'])\ndefineEmits(['update:modelValue'])\n</script>\n<template>\n  <input :value=\"modelValue\" @input=\"$emit('update:modelValue', $event.target.value)\" />\n</template>",
    "bestPractice": "Adote a macro `defineModel()` em projetos com Vue 3.4 ou superior para reduzir código repetitivo. Para múltiplos bindings bidirecionais no mesmo componente, utilize argumentos nomeados como `defineModel('title')`, consumidos como `v-model:title`.",
    "source": "Vue.js Docs — Component v-model"
  },
  {
    "id": "i09",
    "topic": "Teleport",
    "question": "Qual problema o componente nativo `<Teleport>` resolve?",
    "code": null,
    "options": [
      "Carrega bundles de scripts de componentes sob demanda no momento em que entram na área visível da viewport",
      "Renderiza a marcação em outro nó do DOM físico mantendo o escopo reativo e a hierarquia lógica do componente",
      "Coordena a reconciliação de hidratação no SSR entre o HTML gerado no Node.js e a árvore do Virtual DOM cliente",
      "Provê animações de transição de rota ao navegar entre páginas em Single Page Applications com o Vue Router"
    ],
    "correctIndex": 1,
    "explanation": "Elementos como modais, alertas e tooltips frequentemente sofrem cortes visuais quando contidos dentro de elementos ancestrais que possuem `overflow: hidden` ou contextos de empilhamento `z-index` restritos. O componente `<Teleport to=\"body\">` projeta o nó renderizado diretamente no elemento alvo do DOM real, mas preserva a hierarquia lógica do Vue — o conteúdo continua tendo acesso às props, injeções e eventos do componente original.",
    "compiledJS": "<template>\n  <div class=\"card\" style=\"overflow: hidden;\">\n    <button @click=\"isOpen = true\">Abrir Modal</button>\n\n    <!-- Teleport move a marcação para o final do <body> -->\n    <Teleport to=\"body\">\n      <div v-if=\"isOpen\" class=\"modal-overlay\">\n        <div class=\"modal-content\">\n          <p>Conteúdo livre de cortes de overflow.</p>\n          <button @click=\"isOpen = false\">Fechar</button>\n        </div>\n      </div>\n    </Teleport>\n  </div>\n</template>",
    "bestPractice": "Sempre combine `<Teleport>` com `v-if` para evitar que nós invisíveis continuem presentes na árvore do DOM interferindo na navegação por teclado (acessibilidade). Quando possível, defina um nó alvo dedicado (ex.: `<div id=\"modal-root\"></div>`) no HTML base.",
    "source": "Vue.js Docs — Teleport"
  },
  {
    "id": "i10",
    "topic": "KeepAlive",
    "question": "O que o encapsulamento de um componente dinâmico em `<KeepAlive>` realiza?",
    "code": null,
    "options": [
      "Mantém componentes permanentemente montados no DOM real, alternando sua visibilidade visual via `display: none`",
      "Armazena instâncias inativas em cache na memória sem destruí-las, preservando seu estado ao alternar de volta",
      "Grava o estado reativo no `localStorage` do navegador para resistir a recarregamentos de página e reinícios",
      "Impede que componentes filhos sejam renderizados novamente quando o pai atualiza, funcionando como React.memo"
    ],
    "correctIndex": 1,
    "explanation": "Por padrão, quando um componente dinâmico (`<component :is=\"...\">`) ou uma alternância por `v-if` troca de visualização, a instância antiga é destruída e seu estado interno (campos digitados, scroll, seleções) é descartado. Ao envolver o componente com `<KeepAlive>`, o Vue mantém a instância em memória em estado \"desativado\". Ao retornar, ela é reativada com seu estado perfeitamente preservado, disparando os hooks `onActivated` e `onDeactivated` em vez de `onMounted` e `onUnmounted`.",
    "compiledJS": "<template>\n  <KeepAlive :include=\"['TabA', 'TabB']\">\n    <component :is=\"currentTab\" />\n  </KeepAlive>\n</template>\n\n<script setup>\nimport { ref, onActivated, onDeactivated } from 'vue'\n// Dentro dos componentes das abas:\nonActivated(() => { console.log('Aba visível novamente') })\nonDeactivated(() => { console.log('Aba oculta, mas em cache') })\n</script>",
    "bestPractice": "Utilize as props `include` e `exclude` (ou a prop `max`) para limitar quais componentes são mantidos em cache, impedindo crescimento descontrolado do consumo de memória em telas com muitas abas ou listas dinâmicas.",
    "source": "Vue.js Docs — KeepAlive"
  },
  {
    "id": "a01",
    "topic": "Mecanismos Internos da Reatividade",
    "question": "Em nível mecânico, como o sistema de reatividade do Vue 3 detecta que um componente precisa ser renderizado novamente quando uma propriedade reativa muda?",
    "code": null,
    "options": [
      "Traps get/set no Proxy registram effects ativos na leitura, reexecutando renderizações apenas nas propriedades alteradas",
      "Um daemon no event loop compara snapshots JSON dos dados a cada 16 milissegundos para detectar diferenças no estado",
      "Toda mutação dispara diretamente a fila de atualização do DOM do navegador de forma síncrona, ignorando o Virtual DOM",
      "O compilador TypeScript converte variáveis reativas em instâncias EventEmitter que emitem eventos para toda a tela"
    ],
    "correctIndex": 1,
    "explanation": "No Vue 3, objetos reativos são envolvidos por instâncias de `Proxy`. Toda função de renderização de componente executa dentro de um \"efeito reativo\" ativo. Quando uma propriedade é lida durante a renderização, o trap `get` do Proxy executa `track()`, registrando esse efeito específico como dependente daquela propriedade em um mapa global (`targetMap`). Ao modificar a propriedade, o trap `set` executa `trigger()`, buscando e reexecutando apenas os efeitos que dependem daquela propriedade alterada.",
    "compiledJS": "// Modelo simplificado do núcleo reativo do Vue:\nconst targetMap = new WeakMap()\nlet activeEffect = null\n\nfunction track(target, key) {\n  if (!activeEffect) return\n  let depsMap = targetMap.get(target)\n  if (!depsMap) targetMap.set(target, (depsMap = new Map()))\n  let dep = depsMap.get(key)\n  if (!dep) depsMap.set(key, (dep = new Set()))\n  dep.add(activeEffect)\n}\n\nfunction trigger(target, key) {\n  const dep = targetMap.get(target)?.get(key)\n  dep?.forEach(effect => effect())\n}",
    "bestPractice": "Lembre-se de que o rastreamento só ocorre em propriedades acessadas sincronicamente durante a execução do efeito. Acessos dentro de callbacks assíncronos não resolvidos (como após um `await` solto) podem não ser capturados pelo rastreador.",
    "source": "Vue.js Docs — Reactivity in Depth"
  },
  {
    "id": "a02",
    "topic": "Composables",
    "question": "O que diferencia um composable bem projetado no Vue (ex.: `useMouse()`) de uma função utilitária comum?",
    "code": null,
    "options": [
      "Composables precisam ser baseados em classes usando o padrão `extends Composable`",
      "Uma função que usa primitivas da Composition API para encapsular e retornar lógica reativa com estado",
      "Composables só podem ser chamados uma única vez por aplicação, similar a um singleton",
      "Composables devem sempre retornar uma Promise, pois representam operações assíncronas"
    ],
    "correctIndex": 1,
    "explanation": "Uma função utilitária pura recebe parâmetros e retorna valores estáticos e imutáveis. Um composable encapsula lógica com estado reativo utilizando as APIs do Vue (`ref`, `computed`, `watch`, `onMounted`, etc.). Ele retorna refs vivas que se atualizam no tempo de acordo com eventos do sistema ou de rede, limpando seus recursos automaticamente quando o componente chamador é desmontado.",
    "compiledJS": "// useMouse.ts — exemplo de composable com estado reativo\nimport { ref, onMounted, onUnmounted } from 'vue'\n\nexport function useMouse() {\n  const x = ref(0)\n  const y = ref(0)\n\n  function update(event: MouseEvent) {\n    x.value = event.pageX\n    y.value = event.pageY\n  }\n\n  onMounted(() => window.addEventListener('mousemove', update))\n  onUnmounted(() => window.removeEventListener('mousemove', update))\n\n  return { x, y }\n}",
    "bestPractice": "Sempre amarre o descarte de listeners de evento ou subscrições dentro de um composable ao hook `onUnmounted` do componente que o invocou, garantindo ausência de vazamentos quando componentes são destruídos e recriados.",
    "source": "Vue.js Docs — Composables"
  },
  {
    "id": "a03",
    "topic": "Suspense",
    "question": "O que o componente nativo `<Suspense>` coordena no Vue 3?",
    "code": null,
    "options": [
      "Pausa a execução do ciclo de vida dos componentes até que um evento explícito de clique ou gesto do usuário autorize",
      "Exibe um fallback enquanto dependências assíncronas filhas são resolvidas, renderizando a árvore final de forma atômica",
      "Substitui o `<KeepAlive>` ao armazenar instâncias assíncronas em cache de memória para restauração rápida nas rotas",
      "Executa repetições automáticas com retentativas e backoff exponencial caso componentes assíncronos falhem na rede"
    ],
    "correctIndex": 1,
    "explanation": "`<Suspense>` gerencia componentes assíncronos na árvore do Vue — especificamente componentes cujo `<script setup>` contém um `await` de nível superior ou componentes carregados dinamicamente via `defineAsyncComponent`. Enquanto qualquer promessa descendente estiver pendente, o slot `#fallback` é exibido. Quando todas se resolvem, o Vue faz a transição atômica para o slot padrão (`#default`), evitando renders parciais instáveis.",
    "compiledJS": "<template>\n  <Suspense>\n    <template #default>\n      <AsyncUserProfile :id=\"userId\" />\n    </template>\n    <template #fallback>\n      <div class=\"skeleton-loader\">Carregando perfil...</div>\n    </template>\n  </Suspense>\n</template>",
    "bestPractice": "Combine `<Suspense>` com o hook `onErrorCaptured` no componente pai para tratar eventuais rejeições de Promises de forma elegante, evitando exceções não capturadas no frontend.",
    "source": "Vue.js Docs — Built-in Components: Suspense"
  },
  {
    "id": "a04",
    "topic": "Render Functions (Funções de Renderização)",
    "question": "O que a chamada `h('div', { class: 'box' }, 'Hello')` produz e quando você usaria `h()` em vez de um `<template>`?",
    "code": null,
    "options": [
      "Insere um elemento `<div>` concreto no DOM do navegador de forma síncrona, retornando sua referência HTMLElement",
      "Retorna um nó de virtual DOM (VNode) para renderização programática quando a sintaxe de template não é flexível o bastante",
      "Funciona como um utilitário interno que executa chamadas `history.pushState()` durante a navegação do Vue Router",
      "É restrito exclusivamente a arquivos compilados com JSX/TSX, não podendo ser invocado em código TypeScript comum"
    ],
    "correctIndex": 1,
    "explanation": "`h()` (abreviação de hyperscript) é a função interna que gera nós virtuais (VNodes) — estruturas em JavaScript simples que o mecanismo do Vue utiliza para calcular o diff e aplicar alterações no DOM real. Templates do Vue são compilados para chamadas a `h()` em tempo de build. A criação direta de render functions com `h()` é recomendada quando a lógica é dinâmica demais para templates, como na construção de geradores recursivos de árvores ou componentes utilitários de alta abstração.",
    "compiledJS": "import { h } from 'vue'\n\n// Renderização recursiva de árvore — complexa em template, simples com h()\nfunction TreeNode(props) {\n  return h('li', {}, [\n    props.node.label,\n    props.node.children?.length\n      ? h('ul', {}, props.node.children.map(child => h(TreeNode, { node: child })))\n      : null,\n  ])\n}",
    "bestPractice": "Dê preferência ao uso de `<template>` na grande maioria dos casos — o compilador do Vue aplica otimizações estáticas automáticas (como patch flags e hoisting de nós estáticos) que não estão disponíveis em render functions escritas manualmente.",
    "source": "Vue.js Docs — Render Functions & JSX"
  },
  {
    "id": "a05",
    "topic": "Diretivas Customizadas",
    "question": "Para que serve uma diretiva customizada no Vue e qual hook você implementaria para executar lógica imediatamente após o elemento vinculado ser inserido no DOM?",
    "code": null,
    "options": [
      "Servem apenas para adicionar classes CSS dinâmicas aos elementos; `mounted` é o único hook suportado pela API",
      "Encapsulam lógica reutilizável de manipulação direta do DOM; `mounted(el, binding)` executa assim que o elemento entra no DOM",
      "Diretivas customizadas foram descontinuadas no Vue 2 e substituídas integralmente por hooks da Composition API no Vue 3",
      "Aplicam-se exclusivamente a componentes customizados do Vue e geram erro quando declaradas em tags HTML nativas"
    ],
    "correctIndex": 1,
    "explanation": "Diretivas customizadas (`v-nome`) são indicadas quando há necessidade de manipulação direta e de baixo nível sobre elementos do DOM (como focar um campo de formulário, aplicar máscaras ou detectar cliques fora). Os hooks do ciclo de vida de uma diretiva espelham os do componente: `mounted(el, binding)` é executado no exato instante em que o elemento foi inserido no documento, tornando-se o local ideal para `el.focus()` ou registro de listeners nativos.",
    "compiledJS": "// Diretiva v-focus para focar o input na montagem\nconst vFocus = {\n  mounted: (el) => el.focus(),\n}\n\n// Registro local em <script setup>:\n// <input v-focus />",
    "bestPractice": "Reserve diretivas personalizadas para manipulações estritas do DOM. Quando a lógica envolver gerenciamento de estado da aplicação ou composição de interfaces, prefira criar componentes ou composables. Sempre remova ouvintes criados em `mounted` dentro do hook `unmounted` da diretiva.",
    "source": "Vue.js Docs — Custom Directives"
  },
  {
    "id": "a06",
    "topic": "Guards de Navegação do Router",
    "question": "No Vue Router, qual é a diferença entre um guard global `beforeEach` e um guard por rota `beforeEnter`?",
    "code": null,
    "options": [
      "`beforeEnter` executa em todas as trocas globais de rota; `beforeEach` roda apenas em rotas específicas configuradas",
      "`beforeEach` roda globalmente a cada navegação; `beforeEnter` dispara apenas ao entrar no registro de rota específico",
      "`beforeEnter` roda em tempo de build durante o code splitting; `beforeEach` executa no navegador do cliente em runtime",
      "Ambos os guards compartilham o mesmo escopo, sendo `beforeEnter` apenas um alias descontinuado para `beforeEach`"
    ],
    "correctIndex": 1,
    "explanation": "`router.beforeEach` intercepta absolutamente todas as transições de rota da aplicação, sendo o local padrão para validar tokens de autenticação, permissões globais ou disparar métricas de navegação. Já `beforeEnter` é declarado diretamente no objeto de configuração de uma rota específica, sendo executado exclusivamente quando o usuário tenta acessar essa rota particular, sem sobrecarregar a lógica global.",
    "compiledJS": "// Guard global para autenticação\nrouter.beforeEach((to, from) => {\n  if (to.meta.requiresAuth && !isAuthenticated()) {\n    return { name: 'login', query: { redirect: to.fullPath } }\n  }\n})\n\n// Guard específico de rota\nconst routes = [\n  {\n    path: '/admin',\n    component: AdminDashboard,\n    beforeEnter: (to, from) => {\n      if (!currentUser.isAdmin) return '/unauthorized'\n    },\n  },\n]",
    "bestPractice": "Centralize regras comuns em `beforeEach` combinadas com o campo `meta` das rotas (`meta: { requiresAuth: true }`). Isso mantém a manutenção centralizada e reduz duplicações de código.",
    "source": "Vue Router Docs — Navigation Guards"
  },
  {
    "id": "a07",
    "topic": "Pinia",
    "question": "Qual é a principal vantagem das stores do Pinia em relação a compartilhar manualmente um objeto `reactive()` entre componentes como solução caseira de gerenciamento de estado?",
    "code": null,
    "options": [
      "Pinia é funcionalmente idêntico a um objeto reativo compartilhado — apenas um wrapper estético",
      "O Pinia oferece suporte a devtools, instâncias isoladas seguras para SSR por requisição e inferência TypeScript",
      "Stores do Pinia só podem conter valores primitivos, nunca objetos ou arrays",
      "O Pinia substitui o Vue Router por completo, unificando rotas e estado em uma só API"
    ],
    "correctIndex": 1,
    "explanation": "Embora um objeto `reactive()` isolado funcione como singleton em cenários simples de SPA, ele não previne vazamento de estado em ambientes SSR (Server-Side Rendering), onde múltiplas requisições de usuários distintos compartilhariam a mesma instância em memória do servidor. O Pinia isola as instâncias por requisição em SSR, oferece suporte completo às Vue DevTools (com time-travel debugging e monitoramento de mutations), dispensa mutações síncronas complexas do antigo Vuex e disponibiliza tipagem TypeScript perfeita.",
    "compiledJS": "// stores/counter.ts — Pinia com sintaxe Setup\nimport { defineStore } from 'pinia'\nimport { ref, computed } from 'vue'\n\nexport const useCounterStore = defineStore('counter', () => {\n  const count = ref(0)\n  const doubleCount = computed(() => count.value * 2)\n  function increment() { count.value++ }\n\n  return { count, doubleCount, increment }\n})",
    "bestPractice": "Adote a sintaxe \"setup store\" (definida com função) no Pinia para manter coerência estrutural com a Composition API e usufruir de melhor flexibilidade na definição de composables dentro da store.",
    "source": "Pinia Docs — Introduction"
  },
  {
    "id": "a08",
    "topic": "Primitivas de Performance",
    "question": "O que `shallowRef()` altera em comparação a um `ref()` comum e quando essa troca vale a pena?",
    "code": null,
    "options": [
      "`shallowRef()` torna o valor imutável e lança erro ao tentar modificá-lo",
      "Rastreia reatividade apenas na reatribuição de .value, pulando a conversão profunda de propriedades aninhadas",
      "`shallowRef()` é sinônimo de `ref()` sem diferença de comportamento, mantido apenas por simetria",
      "`shallowRef()` só aceita valores primitivos, nunca objetos"
    ],
    "correctIndex": 1,
    "explanation": "`ref()` comum converte recursivamente qualquer objeto atribuído em uma estrutura profundamente reativa por meio de Proxies aninhados. Para datasets massivos (tabelas com milhares de registros ou instâncias de classes de terceiros como editores e mapas), essa conversão gera overhead considerável de CPU e memória. `shallowRef()` rastreia exclusivamente a reatribuição de `.value`. Modificar propriedades internas não dispara reatividade a menos que `triggerRef()` seja chamado manualmente ou uma nova referência seja atribuída.",
    "compiledJS": "import { shallowRef, triggerRef } from 'vue'\n\nconst largeDataset = shallowRef({ items: [/* milhares de itens */] })\n\n// Não dispara atualização de UI:\nlargeDataset.value.items.push(newItem)\n\n// Dispara atualização de UI (substituição integral):\nlargeDataset.value = { ...largeDataset.value, items: [...largeDataset.value.items, newItem] }\n\n// Ou força a atualização manualmente:\ntriggerRef(largeDataset)",
    "bestPractice": "Utilize `shallowRef` em conjunto com `markRaw` para integrar bibliotecas externas ou armazenar grandes volumes de dados que são tratados de forma imutável (substituídos por completo a cada atualização).",
    "source": "Vue.js Docs — Reactivity API: Advanced (shallowRef)"
  },
  {
    "id": "a09",
    "topic": "Hidratação no SSR",
    "question": "O que causa o aviso de \"hydration mismatch\" em uma aplicação Vue renderizada no servidor e por que é perigoso ignorá-lo?",
    "code": null,
    "options": [
      "Representa um aviso inofensivo de CSS em modo de desenvolvimento, sem qualquer impacto em eventos ou dados em produção",
      "O Virtual DOM gerado no cliente difere do HTML gerado pelo servidor, forçando o Vue a descartar o HTML e recriar o DOM",
      "Indica que o Vue Router falhou ao encontrar uma rota correspondente à URL da requisição na tabela de rotas do cliente",
      "Ocorre exclusivamente quando stores do Pinia falham ao serializar seu estado em tags script durante a renderização no SSR"
    ],
    "correctIndex": 1,
    "explanation": "Em SSR, o servidor gera a marcação HTML estática e a envia ao navegador. No cliente, a hidratação anexa os listeners reativos ao HTML existente pressupondo que a árvore renderizada no cliente seja idêntica à do servidor. Se o componente utiliza APIs do navegador (ex.: `window.innerWidth`, timestamps locais ou `localStorage`) durante a renderização síncrona inicial, o HTML cliente não baterá com o HTML do servidor, obrigando o Vue a descartar o trecho divergente e redesenhá-lo, causando cintilação visual e perda de desempenho.",
    "compiledJS": "<!-- Incorreto no SSR (gera mismatch): -->\n<script setup>\nconst isMobile = typeof window !== 'undefined' && window.innerWidth < 768\n</script>\n\n<!-- Correto: inicialização segura e atualização pós-montagem -->\n<script setup>\nimport { ref, onMounted } from 'vue'\nconst isMobile = ref(false)\nonMounted(() => {\n  isMobile.value = window.innerWidth < 768\n})\n</script>",
    "bestPractice": "Nunca leia APIs exclusivas do navegador no escopo síncrono de renderização de componentes executados em SSR. Inicialize com valores neutros e atualize estados dependentes de cliente dentro do hook `onMounted`, que só é executado no navegador.",
    "source": "Vue.js Docs — Server-Side Rendering: Hydration Mismatch"
  },
  {
    "id": "a10",
    "topic": "Otimizações do Compilador",
    "question": "O que são \"patch flags\" na saída compilada de renderização do Vue 3 e como elas aceleram re-renderizações em comparação com o diff de virtual DOM do Vue 2?",
    "code": null,
    "options": [
      "Classes CSS especiais injetadas em nós dinâmicos para ativar aceleração por hardware na GPU durante transições",
      "Bitmasks numéricas geradas pelo compilador em VNodes dinâmicos, guiando o algoritmo de diff a checar só bindings mutáveis",
      "Tags de checksum criptográfico que validam se os bundles do cliente conferem com os artefatos compilados do servidor",
      "Ponteiros de memória em runtime que conectam nós do Virtual DOM diretamente às estruturas de layout em C++ do browser"
    ],
    "correctIndex": 1,
    "explanation": "No Vue 2, a comparação do virtual DOM percorria recursivamente toda a árvore de nós para identificar o que mudou, inclusive nós estáticos que nunca se alteram. O compilador de templates do Vue 3 analisa a marcação e injeta \"patch flags\" numéricas nos nós dinâmicos. Quando o componente re-renderiza, o algoritmo de reconciliação consulta essa flag e verifica unicamente o que é dinâmico (por exemplo, apenas o texto interno ou apenas a classe CSS), ignorando totalmente todo o restante da estrutura estática.",
    "compiledJS": "<!-- Template -->\n<div class=\"container\">\n  <span>Texto estático hoisted</span>\n  <p>{{ dynamicText }}</p>\n</div>\n\n<!-- No código compilado, o <span> estático é hoisted fora da função de render -->\n<!-- e o <p> recebe a patch flag 1 /* TEXT */: -->\n// _createElementVNode(\"p\", null, _toDisplayString(_ctx.dynamicText), 1 /* TEXT */)",
    "bestPractice": "Prefira utilizar templates em vez de render functions manuais sempre que possível: as otimizações estáticas do compilador (hoisting de nós estáticos, patch flags e block trees) são aplicadas exclusivamente sobre templates compilados.",
    "source": "Vue.js Docs — Rendering Mechanism: Compiler-Informed Virtual DOM"
  }
]
