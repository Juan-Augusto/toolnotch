import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Disc,
  Disc3,
  HelpCircle,
  Coins,
  Dice5,
  UserCheck,
  GraduationCap,
  Gift,
  Binary,
  Users,
  Keyboard,
  ArrowRight,
  Sparkles,
  Lock,
  Globe2,
  CheckCircle2,
} from 'lucide-react'
import { buildAlternatesForLocale } from '@/lib/i18nMeta'
import {
  buildJsonLd,
  breadcrumbSchema,
  faqSchema,
  buildLocalizedUrl,
} from '@/lib/schema'
import {
  AppBreadcrumb,
  AppCard,
  AppTip,
  AppAccordion,
} from '@/components/ui'

const PATH = '/tools/fun'

interface Props {
  params: Promise<{ locale: string }>
}

const HUB_META = {
  pt: {
    title:
      'Ferramentas de Diversão e Sorteios Online Grátis: Roleta, Moeda, Dados e Nomes | ToolNotch',
    description:
      'Coleção completa de ferramentas de sorteio e aleatoriedade: roleta de decisões, sorteador de nomes, cara ou coroa 3D, rolador de dados RPG, gerador de números e equipes. 100% grátis e seguro.',
    breadcrumb: 'Diversão & Aleatório',
    headerTitle: 'Ferramentas de Diversão e Sorteios Online',
    headerDescription:
      'Tome decisões justas, realize sorteios transparentes e anime jogos ou aulas com nossa coleção de ferramentas aleatórias. Resultados matematicamente imparciais, executados diretamente no seu navegador sem cadastro.',
    badges: {
      fair: '100% Imparcial (Sem Viés)',
      free: '100% Gratuito',
      instant: 'Processamento no Navegador',
    },
    openTool: 'Abrir ferramenta',
    editorialHeading: 'Como a Aleatoriedade Transforma Decisões e Atividades em Grupo',
    editorialP1:
      'Ferramentas de randomização e sorteio são utilizadas diariamente em uma variedade surpreendente de contextos. Professores recorrem a sorteadores de nomes para incentivar a participação dos alunos de forma justa e sem favoritos. Organizadores de eventos e empresas utilizam a roleta de decisões para distribuir brindes, tarefas e dinâmicas de integração. Famílias e amigos contam com o rolador de dados e o cara ou coroa para desempatar partidas em noites de jogos de tabuleiro.',
    editorialP2:
      'O grande valor da seleção aleatória digital está na eliminação da percepção de viés e na geração de expectativa compartilhada. Quando uma pessoa escolhe manualmente, mesmo com a melhor das intenções, pode surgir a dúvida de favorecimento. Uma roleta girando até parar ou uma moeda voando em 3D remove qualquer desconfiança, tornando o resultado indiscutivelmente transparente para quem assiste.',
    popularUsesHeading: 'Principais Aplicações Práticas',
    popularUses: [
      {
        bold: 'Salas de aula e dinâmicas pedagógicas:',
        text: 'Chame estudantes de forma equitativa, monte duplas de leitura e organize grupos para trabalhos em segundos.',
      },
      {
        bold: 'Sorteios e promoções em redes sociais:',
        text: 'Realize sorteios de brindes e premiações em transmissões ao vivo com total transparência para os participantes.',
      },
      {
        bold: 'Jogos de mesa e sessões de RPG:',
        text: 'Role dados poliédricos padrão (d4 a d100) e fórmulas compostas para campanhas sem precisar de dados físicos.',
      },
      {
        bold: 'Divisão de times esportivos e projetos:',
        text: 'Distribua elencos e turmas em equipes perfeitamente balanceadas sem brigas ou desequilíbrios.',
      },
      {
        bold: 'Decisões do dia a dia e quebra de impasses:',
        text: 'Escolha onde almoçar, qual filme assistir ou qual tarefa priorizar quando a indecisão bater.',
      },
    ],
    featuresTitle: 'Por que usar as Ferramentas de Sorteio do ToolNotch?',
    features: [
      {
        icon: Sparkles,
        title: 'Aleatoriedade Justa e Auditável',
        desc: 'Algoritmos matemáticos consolidados (Fisher-Yates e Math.random criptográfico) garantem probabilidades perfeitamente equitativas para cada item, nome ou número sorteado.',
      },
      {
        icon: Lock,
        title: 'Privacidade Total no Navegador',
        desc: 'Seus nomes, listas e dados confidenciais nunca saem do seu computador ou celular. Todo o sorteio roda 100% no seu dispositivo, sem envio para servidores externos.',
      },
      {
        icon: Globe2,
        title: 'Sem Contas e Compartilhável',
        desc: 'Livre de cadastros, assinaturas ou limites diários. Suas roletas e configurações podem ser compartilhadas instantaneamente por link direto salvo na própria URL.',
      },
    ],
    proTipTitle: 'Dica Pro de Produtividade',
    proTipText:
      'Para listas ou turmas recorrentes, configure suas opções na ferramenta (como Girar a Roleta ou Sorteador de Nomes) e adicione a página aos seus favoritos. A URL salva todas as suas opções automaticamente, permitindo reabrir sua configuração completa em um clique.',
    faqHeading: 'Perguntas Frequentes sobre Ferramentas de Sorteio',
    faqs: [
      {
        question: 'As ferramentas de sorteio e diversão são realmente gratuitas?',
        answer:
          'Sim! Todas as 11 ferramentas são 100% gratuitas, sem limites diários de uso, sem necessidade de cadastro e sem cobranças ocultas.',
      },
      {
        question: 'O resultado da roleta e dos sorteios é verdadeiramente aleatório?',
        answer:
          'Sim. Nossos componentes utilizam algoritmos matemáticos como o Fisher-Yates e geradores pseudoaleatórios padronizados do navegador. A animação visual é sincronizada com o sorteio já realizado, garantindo total imparcialidade.',
      },
      {
        question: 'Minha lista de nomes ou participantes é salva em servidores externos?',
        answer:
          'Não. Todas as listas e configurações residem unicamente na memória do seu navegador ou nos parâmetros da URL compartilhável. Nenhum dado de participante é gravado em servidores.',
      },
      {
        question: 'Posso utilizar as ferramentas no smartphone ou tablet?',
        answer:
          'Sim! Todas as 11 ferramentas possuem design responsivo com controles por toque otimizados para Android, iPhone e iPad.',
      },
    ],
  },
  es: {
    title:
      'Herramientas de Azar y Sorteos Online Gratis — Ruleta, Moneda, Dados y Nombres | ToolNotch',
    description:
      'Colección completa de herramientas de azar y sorteo: ruleta de decisiones, selector de nombres, cara o cruz 3D, lanzador de dados de rol, generador de números y equipos. 100% gratis y seguro.',
    breadcrumb: 'Diversión y Azar',
    headerTitle: 'Herramientas de Azar y Sorteos Online',
    headerDescription:
      'Toma decisiones justas, realiza sorteos transparentes y dinamiza juegos o clases con nuestras herramientas aleatorias. Resultados matemáticamente imparciales, directamente en tu navegador y sin registro.',
    badges: {
      fair: '100% Imparcial (Sin Sesgo)',
      free: '100% Gratis',
      instant: 'Procesamiento en el Navegador',
    },
    openTool: 'Abrir herramienta',
    editorialHeading: 'Cómo el Azar Transforma Decisiones y Actividades Grupales',
    editorialP1:
      'Las herramientas de aleatoriedad se utilizan a diario en una sorprendente variedad de contextos. Docentes recurren a selectores de nombres para fomentar la participación estudiantil de forma justa y equitativa. Organizadores de eventos y empresas usan la ruleta para asignar premios y dinámicas de integración. Familias y amigos confían en los dados y la moneda virtual para desempatar partidas en noches de juegos.',
    editorialP2:
      'El gran valor de la selección digital radica en eliminar cualquier percepción de favoritismo y crear anticipación compartida. Ver una ruleta frenar o una moneda girar en 3D disipa dudas, haciendo que el resultado sea indiscutible y emocionante para todos los participantes.',
    popularUsesHeading: 'Usos Populares y Prácticos',
    popularUses: [
      {
        bold: 'Actividades escolares y dinamización:',
        text: 'Llama a estudiantes de forma equitativa y arma equipos para proyectos en segundos.',
      },
      {
        bold: 'Sorteos en vivo y redes sociales:',
        text: 'Elige ganadores de concursos y dinámicas con absoluta transparencia para tu audiencia.',
      },
      {
        bold: 'Juegos de mesa y rol:',
        text: 'Lanza dados poliédricos clásicos (d4 a d100) y tiradas personalizadas para tus partidas de RPG.',
      },
      {
        bold: 'Generación de equipos deportivos:',
        text: 'Divide listas de jugadores en grupos balanceados sin discusiones.',
      },
      {
        bold: 'Decisiones cotidianas:',
        text: 'Rompe bloqueos creativos o decide dónde comer y qué película ver al instante.',
      },
    ],
    featuresTitle: '¿Por qué usar las Herramientas de Azar de ToolNotch?',
    features: [
      {
        icon: Sparkles,
        title: 'Aleatoriedad Justa y Auditable',
        desc: 'Algoritmos matemáticos consolidados (Fisher-Yates y Math.random criptográfico) garantizan probabilidades equitativas para cada opción o participante.',
      },
      {
        icon: Lock,
        title: 'Privacidad Total en el Navegador',
        desc: 'Tus nombres y listas nunca se transmiten a servidores externos. Todo el proceso corre al 100% en tu propio dispositivo.',
      },
      {
        icon: Globe2,
        title: 'Sin Cuentas y Compartible por Enlace',
        desc: 'Sin inicios de sesión, suscripciones ni límites diarios. Guarda y comparte tus ruletas y configuraciones al instante mediante URL.',
      },
    ],
    proTipTitle: 'Consejo Pro de Productividad',
    proTipText:
      'Para listas recurrentes de clase o sorteos semanales, configura tus opciones y guarda la URL en tus marcadores. Toda la configuración se guarda en el enlace para cargarla en un solo clic.',
    faqHeading: 'Preguntas Frecuentes sobre Herramientas de Azar',
    faqs: [
      {
        question: '¿Las herramientas de azar de ToolNotch son gratuitas?',
        answer:
          '¡Sí! Las 11 herramientas son 100% gratuitas, sin límites diarios y sin necesidad de crear cuenta ni ingresar tarjetas.',
      },
      {
        question: '¿El resultado de la ruleta y los sorteos es verdaderamente imparcial?',
        answer:
          'Sí. Empleamos algoritmos como el barajado Fisher-Yates y generadores criptográficos de navegador que aseguran idénticas probabilidades para todos los elementos.',
      },
      {
        question: '¿Mis listas de nombres se guardan en algún servidor?',
        answer:
          'No. Tus datos se mantienen exclusivamente en la memoria de tu navegador o en los parámetros de la URL que elijas compartir.',
      },
      {
        question: '¿Funcionan en teléfonos móviles y tablets?',
        answer:
          '¡Sí! Toda la interfaz cuenta con diseño responsive y soporte táctil para dispositivos Android y iOS.',
      },
    ],
  },
  en: {
    title:
      'Free Fun & Random Tools — Spin Wheel, Coin Flip, Dice Roller & Pickers | ToolNotch',
    description:
      'Complete suite of free random selection tools: decision wheels, random name pickers, 3D coin toss, RPG dice roller, team splitters, and number generators. 100% free with no signup.',
    breadcrumb: 'Fun & Random',
    headerTitle: 'Free Fun & Random Decision Tools',
    headerDescription:
      'Make fair decisions, run transparent giveaways, and energize classrooms or games with our browser-based randomization suite. Provably unbiased results running client-side with no signup required.',
    badges: {
      fair: '100% Provably Fair',
      free: '100% Free',
      instant: 'Client-Side in Browser',
    },
    openTool: 'Open tool',
    editorialHeading: 'How Random Selection Elevates Group Decisions and Activities',
    editorialP1:
      'Randomization tools solve everyday decision challenges across education, business, and entertainment. Educators reach for random name pickers to engage students equitably without perceived favoritism. Event coordinators spin prize wheels to distribute giveaways transparently. Families and gamers rely on polyhedral dice and virtual coin flips to settle board game rules.',
    editorialP2:
      'The true power of visible digital randomness is transparency and shared excitement. When a person picks by hand, unconscious bias is always suspected. A rotating wheel slowing to a stop or a 3D coin tumbling through the air removes doubt, turning ordinary choices into memorable, trustworthy moments.',
    popularUsesHeading: 'Popular Applications for Random Tools',
    popularUses: [
      {
        bold: 'Classroom participation:',
        text: 'Call on students fairly, assign reading partners, and split study groups with zero friction.',
      },
      {
        bold: 'Livestream giveaways & contests:',
        text: 'Select prize winners transparently in front of your audience with instant proof.',
      },
      {
        bold: 'Tabletop & RPG gaming:',
        text: 'Roll d4 through d100 with support for complex modifiers (e.g. 2d6+3) anytime, anywhere.',
      },
      {
        bold: 'Sports and team selection:',
        text: 'Evenly distribute players into balanced teams based on team count or roster size.',
      },
      {
        bold: 'Everyday decisions & creative blocks:',
        text: 'Pick dinner options, movie choices, or topic prompts when decision fatigue sets in.',
      },
    ],
    featuresTitle: 'Why Use ToolNotch Random Decision Tools?',
    features: [
      {
        icon: Sparkles,
        title: 'Auditable & Unbiased Randomness',
        desc: 'Mathematical algorithms (Fisher-Yates shuffle and cryptographic Math.random) guarantee exact, equal probability for every slice, name, or number.',
      },
      {
        icon: Lock,
        title: '100% Client-Side Privacy',
        desc: 'Your participant names, rosters, and entries never leave your device. All calculations run strictly in your web browser.',
      },
      {
        icon: Globe2,
        title: 'Free & Effortlessly Shareable',
        desc: 'Zero subscriptions, artificial limits, or account barriers. Bookmark and share custom wheel configurations directly via URL.',
      },
    ],
    proTipTitle: 'Pro Tip',
    proTipText:
      'For recurring classroom rosters or weekly team draws, configure your entries once and bookmark the resulting URL. Your full list is encoded in the link and loads instantly on any computer or phone.',
    faqHeading: 'Frequently Asked Questions',
    faqs: [
      {
        question: 'Are ToolNotch fun and random tools completely free?',
        answer:
          'Yes! All 11 tools are 100% free with no daily limits, subscriptions, or login requirements.',
      },
      {
        question: 'Is the wheel spin and random generation truly fair?',
        answer:
          'Yes. All tools rely on established random algorithms like the Fisher-Yates shuffle and browser-standard PRNGs, ensuring mathematically equal probabilities.',
      },
      {
        question: 'Are my participant lists or names stored on remote servers?',
        answer:
          'No. Your entries exist only in your browser memory and within the shareable URL parameters you choose to distribute.',
      },
      {
        question: 'Do these tools work on mobile phones and tablets?',
        answer:
          'Yes! All tools are fully responsive and touch-optimized for smooth performance on Android and iOS devices.',
      },
    ],
  },
}

const FUN_TOOLS_REGISTRY = [
  {
    slug: 'spin-the-wheel',
    icon: Disc,
    titles: {
      pt: 'Girar a Roleta',
      es: 'Girar la Ruleta',
      en: 'Spin the Wheel',
    },
    descs: {
      pt: 'Roleta personalizável com modo 1 por linha e lista 1 a 1. Salve e compartilhe decisões via link.',
      es: 'Ruleta personalizable con modo 1 por línea y lista 1 a 1. Guarda y comparte decisiones vía enlace.',
      en: 'Customizable decision wheel with 1-per-line and 1-by-1 list modes. Save and share via URL.',
    },
  },
  {
    slug: 'wheel-of-names',
    icon: Disc3,
    titles: {
      pt: 'Wheel of Names',
      es: 'Ruleta de Nombres',
      en: 'Wheel of Names',
    },
    descs: {
      pt: 'Alternativa gratuita ao Wheel of Names para sorteios, aulas e decisões rápidas sem cadastro.',
      es: 'Alternativa gratuita a Wheel of Names para sorteos, clases y decisiones sin registro.',
      en: 'Free Wheel of Names alternative for raffles, classrooms, and quick picks without an account.',
    },
  },
  {
    slug: 'yes-or-no-wheel',
    icon: HelpCircle,
    titles: {
      pt: 'Roleta Sim ou Não',
      es: 'Ruleta Sí o No',
      en: 'Yes or No Wheel',
    },
    descs: {
      pt: 'Tome decisões binárias instantâneas entre Sim, Não ou Talvez com animação de giro e física realista.',
      es: 'Toma decisiones binarias al instante entre Sí, No o Quizás con giro visual y física realista.',
      en: 'Make instant binary decisions between Yes, No, or Maybe with realistic spin animation.',
    },
  },
  {
    slug: 'coin-flip',
    icon: Coins,
    titles: {
      pt: 'Cara ou Coroa',
      es: 'Cara o Cruz',
      en: 'Coin Flip',
    },
    descs: {
      pt: 'Lançamento de moeda virtual realista em 3D com histórico ao vivo de jogadas e física 50/50 justa.',
      es: 'Lanzamiento de moneda virtual en 3D con historial en vivo y física imparcial 50/50.',
      en: 'Realistic 3D virtual coin toss with live flip history and provably fair 50/50 randomness.',
    },
  },
  {
    slug: 'dice-roller',
    icon: Dice5,
    titles: {
      pt: 'Rolador de Dados',
      es: 'Lanzador de Dados',
      en: 'Dice Roller',
    },
    descs: {
      pt: 'Role dados poliédricos (d4 a d100) e fórmulas RPG personalizadas (como 2d6+3) instantaneamente.',
      es: 'Lanza dados poliédricos (d4 a d100) y fórmulas de rol personalizadas (como 2d6+3) al instante.',
      en: 'Roll polyhedral dice (d4 through d100) and custom RPG formulas like 3d6+5 instantly.',
    },
  },
  {
    slug: 'random-name-picker',
    icon: UserCheck,
    titles: {
      pt: 'Sorteador de Nomes',
      es: 'Selector de Nombres',
      en: 'Random Name Picker',
    },
    descs: {
      pt: 'Escolha vencedores aleatórios de qualquer lista de nomes com animação visual e opção sem repetição.',
      es: 'Elige ganadores aleatorios de cualquier lista con animación visual y opción sin repetición.',
      en: 'Pick random winners from any list with animated reels and optional without-replacement draws.',
    },
  },
  {
    slug: 'classroom-name-picker',
    icon: GraduationCap,
    titles: {
      pt: 'Sorteador Escolar',
      es: 'Sorteador para Clase',
      en: 'Classroom Name Picker',
    },
    descs: {
      pt: 'Chame alunos de forma justa e transparente para leitura e respostas, garantindo a participação de todos.',
      es: 'Llama a estudiantes de forma equitativa y transparente para lectura y participación en clase.',
      en: 'Call on students fairly and transparently for reading and questions, ensuring equal participation.',
    },
  },
  {
    slug: 'giveaway-picker',
    icon: Gift,
    titles: {
      pt: 'Sorteador de Prêmios',
      es: 'Sorteador de Premios',
      en: 'Giveaway Picker',
    },
    descs: {
      pt: 'Realize sorteios imparciais para promoções, transmissões e redes sociais com total transparência.',
      es: 'Realiza sorteos imparciales para promociones, transmisiones y redes con total transparencia.',
      en: 'Run impartial giveaways for promotions, live streams, and social media with transparent draws.',
    },
  },
  {
    slug: 'random-number-generator',
    icon: Binary,
    titles: {
      pt: 'Gerador de Números',
      es: 'Generador de Números',
      en: 'Random Number Generator',
    },
    descs: {
      pt: 'Gere números aleatórios em qualquer intervalo (mín. e máx.), em lotes de até 1.000, com ou sem repetição.',
      es: 'Genera números aleatorios en cualquier intervalo, en lotes de hasta 1.000, con o sin duplicados.',
      en: 'Generate random numbers across any min/max bounds in batches up to 1,000, with deduplication.',
    },
  },
  {
    slug: 'random-team-generator',
    icon: Users,
    titles: {
      pt: 'Gerador de Equipes',
      es: 'Generador de Equipos',
      en: 'Random Team Generator',
    },
    descs: {
      pt: 'Divida grupos e turmas em times equilibrados por quantidade de equipes ou membros por time.',
      es: 'Divide grupos y clases en equipos equilibrados por número de equipos o miembros por equipo.',
      en: 'Split groups into balanced teams by team count or group size using Fisher-Yates distribution.',
    },
  },
  {
    slug: 'typing-test',
    icon: Keyboard,
    titles: {
      pt: 'Teste de Digitação',
      es: 'Test de Mecanografía',
      en: 'Typing Speed Test',
    },
    descs: {
      pt: 'Meça suas Palavras Por Minuto (WPM), precisão e erros em desafios dinâmicos de 15s a 120s.',
      es: 'Mide tus Palabras Por Minuto (WPM), precisión y errores en desafíos de 15s a 120s.',
      en: 'Measure your Words Per Minute (WPM), accuracy, and keystroke errors in 15s to 120s challenges.',
    },
  },
]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const currentLocale = locale === 'pt' || locale === 'es' ? locale : 'en'
  const meta = HUB_META[currentLocale]
  const localizedUrl = buildLocalizedUrl(PATH, locale)
  const ogLocale = locale === 'pt' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US'

  return {
    title: meta.title,
    description: meta.description,
    alternates: buildAlternatesForLocale(PATH, locale),
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: localizedUrl,
      siteName: 'ToolNotch',
      locale: ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
  }
}

export default async function FunToolsHubPage({ params }: Props) {
  const { locale } = await params
  const currentLocale = locale === 'pt' || locale === 'es' ? locale : 'en'
  const meta = HUB_META[currentLocale]
  const homeLabel = locale === 'pt' ? 'Início' : locale === 'es' ? 'Inicio' : 'Home'
  const toolsLabel = locale === 'pt' ? 'Ferramentas' : locale === 'es' ? 'Herramientas' : 'Tools'
  const prefix = locale === 'en' ? '' : `/${locale}`
  const localizedUrl = buildLocalizedUrl(PATH, locale)
  const localizedToolsUrl = buildLocalizedUrl('/tools', locale)

  const toolsList = FUN_TOOLS_REGISTRY.map((tool) => ({
    ...tool,
    title: tool.titles[currentLocale],
    desc: tool.descs[currentLocale],
    href: `${prefix}/tools/fun/${tool.slug}`,
  }))

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: prefix || '/' },
      { name: toolsLabel, url: localizedToolsUrl },
      { name: meta.breadcrumb, url: localizedUrl },
    ]),
    {
      '@type': 'ItemList',
      name: meta.title,
      description: meta.description,
      url: localizedUrl,
      numberOfItems: toolsList.length,
      itemListElement: toolsList.map((tool, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: tool.title,
        url: buildLocalizedUrl(`/tools/fun/${tool.slug}`, locale),
      })),
    },
    faqSchema([...meta.faqs]),
  )

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="w-full pb-2 sm:pb-3">
        <AppBreadcrumb
          items={[
            { label: homeLabel, href: prefix || '/' },
            { label: toolsLabel, href: `${prefix}/tools` },
            { label: meta.breadcrumb, current: true },
          ]}
        />
      </div>

      {/* Hero Header */}
      <header className="mb-6 sm:mb-8 md:mb-10 pt-1 sm:pt-2 pb-3.5 sm:pb-5 border-b border-border/80">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-mono">
          {meta.headerTitle}
        </h1>
        <p className="text-xs sm:text-sm text-label leading-relaxed mt-1.5 sm:mt-2 max-w-3xl">
          {meta.headerDescription}
        </p>
      </header>

      {/* Grid of 11 Fun & Random Tools */}
      <section aria-labelledby="fun-tools-grid-heading" className="mb-8 sm:mb-12">
        <h2 id="fun-tools-grid-heading" className="sr-only">
          {meta.headerTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {toolsList.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.slug}
                href={tool.href}
                className="group block h-full select-none"
              >
                <AppCard
                  border
                  cornerAccents={false}
                  className="p-4 sm:p-5 bg-tertiary group-hover:border-secondary/60 transition-colors h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <Icon className="w-5 h-5 text-secondary shrink-0" />
                      <h3 className="text-sm sm:text-base font-bold font-mono text-foreground group-hover:text-secondary transition-colors">
                        {tool.title}
                      </h3>
                    </div>

                    <p className="text-xs text-label leading-relaxed font-mono line-clamp-2">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-secondary font-semibold mt-4 pt-3 border-t border-border/50 font-mono">
                    <span>{meta.openTool}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </AppCard>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Editorial Content & Popular Use Cases */}
      <section aria-labelledby="fun-editorial-heading" className="mb-8 sm:mb-12">
        <AppCard border cornerAccents className="p-4 sm:p-6 md:p-8 bg-tertiary">
          <h2
            id="fun-editorial-heading"
            className="text-base sm:text-lg md:text-xl font-bold font-mono uppercase text-foreground mb-3 sm:mb-4"
          >
            {meta.editorialHeading}
          </h2>
          <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-label leading-relaxed mb-6">
            <p>{meta.editorialP1}</p>
            <p>{meta.editorialP2}</p>
          </div>

          <h3 className="text-sm sm:text-base font-bold font-mono uppercase text-foreground mb-3 pt-4 border-t border-border/60">
            {meta.popularUsesHeading}
          </h3>
          <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-label leading-relaxed">
            {meta.popularUses.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground font-semibold">{item.bold} </strong>
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </AppCard>
      </section>

      {/* Features & Guarantees */}
      <section aria-labelledby="fun-features-heading" className="mb-8 sm:mb-12">
        <h2
          id="fun-features-heading"
          className="text-base sm:text-lg md:text-xl font-bold font-mono uppercase text-foreground mb-3 sm:mb-5"
        >
          {meta.featuresTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {meta.features.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <AppCard
                key={idx}
                border
                cornerAccents
                className="p-3.5 sm:p-5 bg-tertiary"
              >
                <div className="w-8 h-8 rounded-[2px] text-secondary flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold font-mono uppercase text-foreground mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-label leading-relaxed">
                  {feat.desc}
                </p>
              </AppCard>
            )
          })}
        </div>
      </section>

      {/* Pro Tip */}
      <div className="mb-8 sm:mb-12 max-w-4xl">
        <AppTip title={meta.proTipTitle}>{meta.proTipText}</AppTip>
      </div>

      {/* FAQs */}
      <section
        aria-labelledby="fun-faq-heading"
        className="max-w-4xl pt-4 sm:pt-6 border-t border-border/80"
      >
        <h2
          id="fun-faq-heading"
          className="text-base sm:text-lg md:text-xl font-bold font-mono uppercase text-foreground mb-3 sm:mb-4 md:mb-6"
        >
          {meta.faqHeading}
        </h2>
        <AppAccordion
          groups={meta.faqs.map((faq, index) => ({
            id: `faq-${index}`,
            name: faq.question,
            content: (
              <p className="leading-relaxed text-label text-xs sm:text-sm">
                {faq.answer}
              </p>
            ),
          }))}
        />
      </section>
    </main>
  )
}

