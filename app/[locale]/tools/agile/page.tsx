import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Columns3,
  Clock,
  CreditCard,
  FileText,
  CalendarDays,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { buildAlternatesForLocale, localizedPath } from '@/lib/i18nMeta'
import {
  buildJsonLd,
  breadcrumbSchema,
  faqSchema,
  webAppSchema,
  buildLocalizedUrl,
} from '@/lib/schema'
import {
  AppBreadcrumb,
  AppCard,
  AppTip,
  AppAccordion,
} from '@/components/ui'
import AppAffiliateStickyBar from '@/components/AppAffiliateStickyBar'

const PATH = '/tools/agile'

interface Props {
  params: Promise<{ locale: string }>
}

const HUB_META = {
  pt: {
    title:
      'Ferramentas Ágeis e Scrum Gratuitas: Retrospectiva, Poker e Standup | ToolNotch',
    description:
      'Conjunto completo de ferramentas para cerimônias ágeis e Scrum: quadro de retrospectiva, planning poker Fibonacci, gerador de standup diário, escritor de user stories e calculadora de sprint. 100% grátis e privado.',
    breadcrumb: 'Metodologias Ágeis',
    headerTitle: 'Ferramentas Ágeis e Scrum Online',
    headerDescription:
      'Otimize o planejamento, as reuniões diárias e as retrospectivas da sua equipe com ferramentas ágeis gratuitas, rápidas e sem necessidade de cadastro. Tudo roda com total privacidade no seu navegador.',
    badges: {
      private: '100% Privado no Navegador',
      free: '100% Gratuito',
      instant: 'Sem Cadastro ou Login',
    },
    openTool: 'Acessar ferramenta',
    popularUsesTitle: 'Casos de Uso Mais Comuns em Equipes Ágeis',
    popularUses: [
      {
        bold: 'Retrospectivas de sprint:',
        text: 'Colete feedbacks construtivos sobre o que correu bem e o que precisa melhorar, com votação por notas e exportação direta em Markdown.',
      },
      {
        bold: 'Planning Poker e estimativas:',
        text: 'Estime a complexidade de histórias de usuário usando a escala Fibonacci sem viés de ancoragem.',
      },
      {
        bold: 'Alinhamento em reuniões diárias:',
        text: 'Formate o que fez ontem, o que fará hoje e os impedimentos para compartilhar no Slack ou Microsoft Teams.',
      },
      {
        bold: 'Redação de histórias com padrão INVEST:',
        text: 'Crie histórias estruturadas no formato Como/Quero/Para que com critérios de aceitação Dado/Quando/Então.',
      },
      {
        bold: 'Planejamento de calendário de sprints:',
        text: 'Calcule as datas exatas de início, fim, dailies em dias úteis, revisão e retrospectiva com um clique.',
      },
    ],
    featuresTitle: 'Por que usar as Ferramentas Ágeis do ToolNotch?',
    features: [
      {
        icon: Lock,
        title: 'Privacidade Total no Navegador',
        desc: 'Suas anotações de retrospectiva, estimativas e tarefas nunca saem do seu computador. Nenhum dado é enviado a servidores externos.',
      },
      {
        icon: Zap,
        title: 'Sem Login e Sem Atrito',
        desc: 'Sem necessidade de criar conta, assinar planos ou configurar permissões de equipe. Abra a ferramenta e comece a cerimônia na hora.',
      },
      {
        icon: Sparkles,
        title: 'Formato Pronto para Exportação',
        desc: 'Copie resumos formatados em Markdown com um clique e cole diretamente no Jira, Linear, Confluence, Trello ou Notion.',
      },
    ],
    proTipTitle: 'Dica Pro de Facilitação Ágil',
    proTipText:
      'Para retrospectivas e reuniões remotas, o facilitador pode compartilhar a tela durante a sessão e anotar os pontos levantados pelo time em tempo real. Ao final, basta clicar em Exportar como Markdown para documentar a cerimônia diretamente no Notion ou Confluence.',
    faqHeading: 'Perguntas Frequentes sobre Ferramentas Ágeis',
    faqs: [
      {
        question: 'As ferramentas ágeis do ToolNotch são realmente gratuitas?',
        answer:
          'Sim! Todas as ferramentas ágeis são 100% gratuitas, sem limites diários, sem planos pagos e sem exigência de login.',
      },
      {
        question: 'Minhas anotações de retrospectiva ou standup são salvas em servidores?',
        answer:
          'Não. Todo o processamento e retenção de dados acontecem exclusivamente na memória do seu navegador. Nada é enviado para qualquer servidor.',
      },
      {
        question: 'Posso usar o Planning Poker com equipes remotas?',
        answer:
          'Esta versão é pensada para facilitação ágil compartilhada. O facilitador ou os membros abrem a ferramenta, fazem a escolha da carta e revelam os pontos simultaneamente na chamada de vídeo.',
      },
      {
        question: 'Onde posso colar as User Stories geradas?',
        answer:
          'A saída gerada é formatada em Markdown padrão, compatível diretamente com Jira, Linear, GitHub Issues, Azure DevOps, Trello e Confluence.',
      },
    ],
  },
  es: {
    title:
      'Herramientas Ágiles y Scrum Gratuitas: Retrospectiva, Poker y Standup | ToolNotch',
    description:
      'Conjunto completo de herramientas para ceremonias ágiles y Scrum: tablero de retrospectiva, planning poker, generador de standup, redactor de user stories y calculadora de sprint. 100% privado.',
    breadcrumb: 'Metodologías Ágiles',
    headerTitle: 'Herramientas Ágiles y Scrum Online',
    headerDescription:
      'Optimiza la planificación, reuniones diarias y retrospectivas de tu equipo con herramientas ágiles gratuitas y sin registro. Todo se ejecuta en tu navegador con total privacidad.',
    badges: {
      private: '100% Privado en Navegador',
      free: '100% Gratuito',
      instant: 'Sin Registro ni Login',
    },
    openTool: 'Abrir herramienta',
    popularUsesTitle: 'Casos de Uso Habituales en Equipos Ágiles',
    popularUses: [
      {
        bold: 'Retrospectivas de sprint:',
        text: 'Recopila feedback constructivo sobre aciertos y mejoras con votación de notas y exportación a Markdown.',
      },
      {
        bold: 'Planning Poker y estimaciones:',
        text: 'Estima la complejidad de historias de usuario con la escala Fibonacci sin sesgo de anclaje.',
      },
      {
        bold: 'Sincronización en standups diarios:',
        text: 'Formatea ayer, hoy y bloqueos para compartir al instante en Slack o Microsoft Teams.',
      },
      {
        bold: 'Redacción de historias INVEST:',
        text: 'Crea historias en formato Como/Quiero/Para con criterios de aceptación Dado/Cuando/Entonces.',
      },
      {
        bold: 'Cálculo de fechas de sprint:',
        text: 'Calcula con precisión las fechas de inicio, fin, standups laborables, revisión y retrospectiva.',
      },
    ],
    featuresTitle: '¿Por qué elegir las Herramientas Ágiles de ToolNotch?',
    features: [
      {
        icon: Lock,
        title: 'Privacidad Absoluta',
        desc: 'Tus notas de retrospectiva y tareas nunca salen de tu dispositivo. Ningún dato se envía a servidores.',
      },
      {
        icon: Zap,
        title: 'Sin Registro ni Fricción',
        desc: 'Sin cuentas, suscripciones ni permisos complicados. Abre la página y comienza tu ceremonia al instante.',
      },
      {
        icon: Sparkles,
        title: 'Listo para Exportar',
        desc: 'Copia resúmenes en Markdown con un clic para pegarlos en Jira, Linear, Confluence, Trello o Notion.',
      },
    ],
    proTipTitle: 'Consejo Pro de Facilitación Ágil',
    proTipText:
      'En retrospectivas remotas, el facilitador puede compartir pantalla y anotar los puntos del equipo en vivo. Al terminar, exporta a Markdown con un clic para guardar las acciones acordadas en Notion o Confluence.',
    faqHeading: 'Preguntas Frecuentes sobre Herramientas Ágiles',
    faqs: [
      {
        question: '¿Son gratuitas estas herramientas ágiles?',
        answer:
          'Sí, todas las herramientas son 100% gratuitas, sin límites de uso ni suscripciones.',
      },
      {
        question: '¿Mis notas quedan guardadas en algún servidor?',
        answer:
          'No. Todos los datos permanecen únicamente en la memoria local de tu navegador.',
      },
      {
        question: '¿Puedo usar Planning Poker en llamadas remotas?',
        answer:
          'Sí, es ideal para que el facilitador comparta pantalla o cada miembro vote y revele sus puntos al mismo tiempo.',
      },
      {
        question: '¿Dónde puedo pegar las historias generadas?',
        answer:
          'El formato Markdown generado es compatible de forma nativa con Jira, Linear, GitHub Issues, Trello y Notion.',
      },
    ],
  },
  en: {
    title:
      'Free Agile & Scrum Ceremony Tools: Retro Board, Poker, Standup | ToolNotch',
    description:
      'Free ceremony tools for agile and Scrum teams: retrospective board, planning poker, daily standup generator, user story writer, and sprint date calculator. 100% private in browser.',
    breadcrumb: 'Agile & Scrum',
    headerTitle: 'Free Agile & Scrum Ceremony Tools',
    headerDescription:
      'Streamline your sprint planning, daily standups, and retrospectives with fast, zero-friction tools. Runs 100% privately in your browser with no login or setup required.',
    badges: {
      private: '100% Client-Side Privacy',
      free: '100% Free Forever',
      instant: 'No Login Required',
    },
    openTool: 'Open tool',
    popularUsesTitle: 'Common Agile Team Workflows',
    popularUses: [
      {
        bold: 'Sprint retrospectives:',
        text: 'Capture what went well and what needs improvement with note dot-voting and one-click Markdown export.',
      },
      {
        bold: 'Planning Poker estimations:',
        text: 'Estimate user story points with standard Fibonacci cards to prevent anchoring bias.',
      },
      {
        bold: 'Daily standup formatting:',
        text: 'Format yesterday, today, and blockers in seconds ready to paste into Slack or Microsoft Teams.',
      },
      {
        bold: 'INVEST user story writing:',
        text: 'Draft user stories with Given/When/Then acceptance criteria ready for backlog grooming.',
      },
      {
        bold: 'Sprint ceremony scheduling:',
        text: 'Calculate exact planning, weekday standups, review, and retro dates across 2, 3, or 4-week sprints.',
      },
    ],
    featuresTitle: 'Why Use ToolNotch Agile Tools?',
    features: [
      {
        icon: Lock,
        title: '100% In-Browser Privacy',
        desc: 'Your retrospectives, estimates, and backlog notes never touch a remote server. Everything stays on your computer.',
      },
      {
        icon: Zap,
        title: 'Instant & Zero Friction',
        desc: 'No account creation, team invites, or subscriptions. Open the tool and start your ceremony immediately.',
      },
      {
        icon: Sparkles,
        title: 'Markdown-Ready Export',
        desc: 'Copy formatted Markdown with one click to paste cleanly into Jira, Linear, Confluence, Trello, or Notion.',
      },
    ],
    proTipTitle: 'Agile Facilitation Pro Tip',
    proTipText:
      'For remote ceremonies, share your screen as facilitator to take notes in real time as teammates speak. When finished, click Export as Markdown to paste the full record into Notion or Confluence immediately.',
    faqHeading: 'Frequently Asked Questions',
    faqs: [
      {
        question: 'Are ToolNotch agile tools completely free?',
        answer:
          'Yes! All agile tools are 100% free with no limits, paywalls, or account requirements.',
      },
      {
        question: 'Is retrospective or standup data stored anywhere?',
        answer:
          'No. All data lives strictly in your browser memory and is never uploaded or tracked.',
      },
      {
        question: 'Can I use Planning Poker in remote video meetings?',
        answer:
          'Yes, it is designed for shared facilitation where team members select and reveal cards simultaneously on a video call.',
      },
      {
        question: 'Where can I paste the generated user stories?',
        answer:
          'The output is standard Markdown, fully compatible with Jira, Linear, GitHub Issues, Azure DevOps, and Notion.',
      },
    ],
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const meta = HUB_META[locale as keyof typeof HUB_META] || HUB_META.en
  const localizedUrl = buildLocalizedUrl(PATH, locale)
  const ogLocale = locale === 'pt' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US'

  return {
    title: meta.title,
    description: meta.description,
    alternates: buildAlternatesForLocale(PATH, locale),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
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
    category: 'productivity',
  }
}

export default async function AgileToolsHubPage({ params }: Props) {
  const { locale } = await params
  const meta = HUB_META[locale as keyof typeof HUB_META] || HUB_META.en
  const prefix = locale === 'en' ? '' : `/${locale}`

  const homeLabel = locale === 'pt' ? 'Início' : locale === 'es' ? 'Inicio' : 'Home'
  const toolsLabel = locale === 'pt' ? 'Ferramentas' : locale === 'es' ? 'Herramientas' : 'Tools'

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath('/', locale) },
      { name: toolsLabel, url: localizedPath('/tools', locale) },
      { name: meta.breadcrumb, url: buildLocalizedUrl(PATH, locale) },
    ]),
    webAppSchema(meta.title, PATH, meta.description, locale, 'BusinessApplication'),
    faqSchema(meta.faqs),
  )

  const toolsList = [
    {
      slug: 'retro-board',
      title:
        locale === 'pt'
          ? 'Quadro de Retrospectiva'
          : locale === 'es'
            ? 'Tablero de Retrospectiva'
            : 'Sprint Retrospective Board',
      desc:
        locale === 'pt'
          ? 'Retrospectiva com 3 colunas (Funcionou Bem, A Melhorar, Ações), votação em notas e exportação em Markdown.'
          : locale === 'es'
            ? 'Retrospectiva con 3 columnas (Funcionó Bien, A Mejorar, Acciones), votación en notas y exportación a Markdown.'
            : '3-column sprint retro board with note voting and instant Markdown export.',
      href: `${prefix}/tools/agile/retro-board`,
      icon: Columns3,
    },
    {
      slug: 'standup-generator',
      title:
        locale === 'pt'
          ? 'Gerador de Standup Diário'
          : locale === 'es'
            ? 'Generador de Standup Diario'
            : 'Daily Standup Generator',
      desc:
        locale === 'pt'
          ? 'Estruture ontem, hoje e bloqueios em um resumo limpo pronto para colar no Slack, Teams ou Jira.'
          : locale === 'es'
            ? 'Estructura ayer, hoy y bloqueos en un resumen limpio listo para copiar en Slack, Teams o Jira.'
            : 'Format yesterday, today, and blockers into a clean summary ready for Slack, Teams, or Jira.',
      href: `${prefix}/tools/agile/standup-generator`,
      icon: Clock,
    },
    {
      slug: 'planning-poker',
      title: 'Planning Poker',
      desc:
        locale === 'pt'
          ? 'Estime story points com a escala Fibonacci e revele votos simultaneamente para evitar ancoragem.'
          : locale === 'es'
            ? 'Estima story points con la escala Fibonacci y revela votos a la vez para evitar anclaje.'
            : 'Estimate story points with Fibonacci cards and reveal simultaneously to prevent anchoring bias.',
      href: `${prefix}/tools/agile/planning-poker`,
      icon: CreditCard,
    },
    {
      slug: 'user-story-writer',
      title:
        locale === 'pt'
          ? 'Escritor de User Story'
          : locale === 'es'
            ? 'Creador de Historias de Usuario'
            : 'User Story Writer',
      desc:
        locale === 'pt'
          ? 'Escreva histórias INVEST no formato Como/Quero/Para com critérios de aceitação Dado/Quando/Então.'
          : locale === 'es'
            ? 'Escribe historias INVEST en formato Como/Quiero/Para con criterios de aceptación Dado/Cuando/Entonces.'
            : 'Draft INVEST user stories with Given/When/Then acceptance criteria for backlog grooming.',
      href: `${prefix}/tools/agile/user-story-writer`,
      icon: FileText,
    },
    {
      slug: 'sprint-date-calculator',
      title:
        locale === 'pt'
          ? 'Calculadora de Datas de Sprint'
          : locale === 'es'
            ? 'Calculadora de Fechas de Sprint'
            : 'Sprint Date Calculator',
      desc:
        locale === 'pt'
          ? 'Calcule automaticamente planejamento, standups em dias úteis, revisão e retrospectiva da sprint.'
          : locale === 'es'
            ? 'Calcula automáticamente planificación, standups en días laborables, revisión y retrospectiva.'
            : 'Calculate exact sprint planning, weekday daily standups, review, and retro ceremony dates.',
      href: `${prefix}/tools/agile/sprint-date-calculator`,
      icon: CalendarDays,
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
        <div className="w-full">
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

          {/* Header */}
          <header className="mb-6 sm:mb-8 md:mb-10 pt-1 sm:pt-2 pb-4 sm:pb-6 border-b border-border/80">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground font-mono mb-2 sm:mb-3">
              {meta.headerTitle}
            </h1>
            <p className="leading-relaxed text-label max-w-3xl text-sm sm:text-base">
              {meta.headerDescription}
            </p>
          </header>

          {/* Tools Grid */}
          <section aria-labelledby="agile-tools-grid-heading" className="mb-8 sm:mb-12">
            <h2 id="agile-tools-grid-heading" className="sr-only">
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
                      hover
                      border
                      cornerAccents
                      className="h-full flex flex-col justify-between p-3.5 sm:p-5 md:p-6 bg-tertiary transition-all"
                    >
                      <div>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[2px] text-primary flex items-center justify-center shrink-0 mb-3 sm:mb-4 group-hover:bg-primary group-hover:text-background transition-colors">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>

                        <h3 className="text-sm sm:text-base font-bold font-mono text-foreground group-hover:text-secondary transition-colors leading-snug mb-2">
                          {tool.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-label leading-relaxed line-clamp-2 sm:line-clamp-3">
                          {tool.desc}
                        </p>
                      </div>

                      <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold uppercase font-mono text-label group-hover:text-secondary transition-colors">
                        <span>{meta.openTool}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </AppCard>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* Popular Uses */}
          <section aria-labelledby="agile-popular-heading" className="mb-8 sm:mb-12">
            <AppCard border cornerAccents className="p-4 sm:p-6 md:p-8 bg-tertiary">
              <h2
                id="agile-popular-heading"
                className="text-base sm:text-lg md:text-xl font-bold font-mono uppercase text-foreground mb-3 sm:mb-4"
              >
                {meta.popularUsesTitle}
              </h2>
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
          <section aria-labelledby="agile-features-heading" className="mb-8 sm:mb-12">
            <h2
              id="agile-features-heading"
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
            aria-labelledby="agile-faq-heading"
            className="max-w-4xl pt-4 sm:pt-6 border-t border-border/80"
          >
            <h2
              id="agile-faq-heading"
              className="text-base sm:text-lg md:text-xl font-bold font-mono uppercase text-foreground mb-3 sm:mb-4 md:mb-6"
            >
              {meta.faqHeading}
            </h2>
            <AppAccordion
              groups={meta.faqs.map((faq, index) => ({
                id: `faq-${index}`,
                name: faq.question,
                content: (
                  <p className="leading-relaxed text-label font-mono text-xs sm:text-sm">
                    {faq.answer}
                  </p>
                ),
              }))}
            />
          </section>
        </div>
      </main>

      <AppAffiliateStickyBar />
    </>
  )
}
