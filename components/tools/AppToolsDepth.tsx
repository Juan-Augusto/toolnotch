import React from "react";
import AppCard from "@/components/ui/AppCard";
import AppTip from "@/components/ui/AppTip";
import { ShieldCheck, Zap, Lock, Cpu } from "lucide-react";

export interface AppToolsDepthProps {
  locale: string;
}

interface DepthContent {
  heading: string;
  subheading: string;
  pillars: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    desc: string;
  }[];
  categoriesTitle: string;
  categories: {
    name: string;
    description: string;
  }[];
  faqTitle: string;
  faqs: {
    question: string;
    answer: string;
  }[];
  tipTitle: string;
  tipContent: string;
}

const DEPTH_CONTENT: Record<string, DepthContent> = {
  pt: {
    heading: "Processamento Moderno e Seguro no Seu Navegador",
    subheading:
      "Todas as ferramentas do ToolNotch foram projetadas para funcionar com máxima privacidade e velocidade, executando cálculos e manipulações diretamente no seu dispositivo.",
    pillars: [
      {
        icon: Lock,
        title: "Privacidade Garantida",
        desc: "Seus arquivos PDF, imagens e dados financeiros são processados localmente. Nada é salvo em bancos de dados ou enviado para servidores de terceiros.",
      },
      {
        icon: Zap,
        title: "Velocidade Instantânea",
        desc: "Sem tempo de espera para upload ou download de servidores. O processamento ocorre na hora aproveitando o poder do seu próprio computador ou celular.",
      },
      {
        icon: ShieldCheck,
        title: "100% Gratuito e Sem Cadastro",
        desc: "Acesso livre a todas as utilidades sem necessidade de login, senhas, cartões de crédito ou limites arbitrários de uso diário.",
      },
      {
        icon: Cpu,
        title: "Tecnologia de Ponta",
        desc: "Desenvolvido com padrões modernos da web, WebAssembly e bibliotecas client-side de alto desempenho para máxima fidelidade e precisão matemática.",
      },
    ],
    categoriesTitle: "Categorias em Destaque",
    categories: [
      {
        name: "PDF & Documentos",
        description:
          "Mescle múltiplos PDFs, divida relatórios em páginas específicas, reduza o tamanho de arquivos pesados e converta entre PDF e imagens JPG com total segurança.",
      },
      {
        name: "Finanças & Negócios",
        description:
          "Simule parcelas de financiamento imobiliário e veicular, tabelas de amortização completas (SAC e Price), planeje quitação de dívidas e gere recibos e faturas profissionais.",
      },
      {
        name: "Texto & Redação",
        description:
          "Analise métricas completas de escrita, conte palavras e caracteres, avalie pontuações de legibilidade Flesch-Kincaid e calcule o tempo estimado de leitura de artigos.",
      },
      {
        name: "Conversores & Matemática",
        description:
          "Faça conversões instantâneas entre centenas de unidades de medida (comprimento, temperatura, peso), calcule porcentagens e verifique cotações atualizadas de mais de 150 moedas.",
      },
      {
        name: "Produtividade Ágil & Scrum",
        description:
          "Ferramentas essenciais para times ágeis: quadros de retrospectiva interativos, salas de Planning Poker, geradores de pautas para reuniões diárias e estimativas de sprint.",
      },
      {
        name: "Saúde, Educação & Lazer",
        description:
          "Calculadoras de GPA acadêmico, estimativas de IMC e TDEE para saúde diária, além de roletas interativas e sorteios para eventos, aulas e dinâmicas de grupo.",
      },
    ],
    faqTitle: "Perguntas Frequentes",
    faqs: [
      {
        question: "Meus arquivos enviados para o PDF ou conversor ficam salvos na internet?",
        answer:
          "Não. Todas as ferramentas de manipulação de PDF, compactação de imagens e texto funcionam exclusivamente no navegador do seu navegador (client-side). Seus arquivos nunca são enviados a servidores externos.",
      },
      {
        question: "Preciso pagar ou criar uma conta para usar as calculadoras?",
        answer:
          "Todas as calculadoras e ferramentas do ToolNotch são 100% gratuitas, ilimitadas e não requerem nenhum tipo de cadastro ou instalação.",
      },
      {
        question: "As cotações do conversor de moedas são atualizadas?",
        answer:
          "Sim. O conversor de moedas consulta taxas de câmbio de fontes financeiras globais confiáveis para garantir conversões precisas para mais de 150 moedas internacionais.",
      },
      {
        question: "As ferramentas funcionam em celulares e tablets?",
        answer:
          "Sim. A interface do ToolNotch é totalmente responsiva e foi otimizada para oferecer uma experiência ágil e intuitiva em smartphones, tablets e computadores.",
      },
    ],
    tipTitle: "Dica de Produtividade",
    tipContent:
      "Você pode adicionar o ToolNotch aos favoritos do seu navegador ou criar um atalho na tela inicial do seu celular para acessar qualquer calculadora ou utilitário com apenas um toque.",
  },
  es: {
    heading: "Procesamiento Moderno y Seguro en tu Navegador",
    subheading:
      "Todas las herramientas de ToolNotch están diseñadas para funcionar con la máxima privacidad y rapidez, ejecutando cálculos y operaciones directamente en tu dispositivo.",
    pillars: [
      {
        icon: Lock,
        title: "Privacidad Garantizada",
        desc: "Tus archivos PDF, imágenes y datos se procesan localmente. Nada se guarda en bases de datos ni se envía a servidores externos.",
      },
      {
        icon: Zap,
        title: "Velocidad Instantánea",
        desc: "Sin tiempos de espera de subida o descarga. El procesamiento es inmediato aprovechando la potencia de tu propio equipo.",
      },
      {
        icon: ShieldCheck,
        title: "100% Gratis y Sin Registro",
        desc: "Acceso libre e ilimitado a todas las utilidades sin necesidad de iniciar sesión, tarjetas de crédito ni suscripciones.",
      },
      {
        icon: Cpu,
        title: "Tecnología Avanzada",
        desc: "Desarrollado con estándares web modernos, WebAssembly y librerías client-side optimizadas para máxima precisión matemática.",
      },
    ],
    categoriesTitle: "Categorías Destacadas",
    categories: [
      {
        name: "PDF y Documentos",
        description:
          "Combina múltiples archivos PDF, divide por rangos de páginas, comprime documentos pesados y convierte entre PDF e imágenes JPG sin salir del navegador.",
      },
      {
        name: "Finanzas y Negocios",
        description:
          "Calcula cuotas de préstamos e hipotecas, tablas de amortización detalladas, planificación de deudas y generadores de facturas y recibos listos para imprimir.",
      },
      {
        name: "Texto y Redacción",
        description:
          "Analiza métricas de redacción en tiempo real, contador de palabras y caracteres, pruebas de legibilidad y estimaciones de tiempo de lectura.",
      },
      {
        name: "Conversores y Matemáticas",
        description:
          "Conversiones inmediatas de unidades de medida (longitud, masa, temperatura), cálculo de porcentajes y cotizaciones en vivo para más de 150 divisas.",
      },
      {
        name: "Productividad Ágil y Scrum",
        description:
          "Tableros de retrospectiva interactivos, sesiones de Planning Poker, plantillas para reuniones diarias (standups) y calendarios de sprint.",
      },
      {
        name: "Salud, Educación y Juegos",
        description:
          "Calculadoras de GPA y notas universitarias, fórmulas de IMC y TDEE para salud y bienestar, además de ruletas y sorteadores aleatorios.",
      },
    ],
    faqTitle: "Preguntas Frecuentes",
    faqs: [
      {
        question: "¿Mis archivos procesados quedan guardados en servidores?",
        answer:
          "No. El procesamiento de archivos PDF e imágenes se realiza íntegramente en tu navegador. Tus documentos nunca abandonan tu dispositivo.",
      },
      {
        question: "¿Hay algún límite de uso diario o costo oculto?",
        answer:
          "Ninguno. Todas las herramientas son totalmente gratuitas y de uso ilimitado.",
      },
      {
        question: "¿Funcionan bien en teléfonos móviles?",
        answer:
          "Sí, todo el portal ToolNotch cuenta con diseño responsivo optimizado para una navegación fluida en teléfonos móviles y tablets.",
      },
    ],
    tipTitle: "Consejo Útil",
    tipContent:
      "Guarda ToolNotch en los marcadores de tu navegador para tener acceso instantáneo a cualquier calculadora o conversor en tu día a día.",
  },
  en: {
    heading: "Fast, Private, and Browser-Native Tools",
    subheading:
      "Every ToolNotch utility is engineered for maximum speed and privacy, executing calculations and file manipulations directly on your client device.",
    pillars: [
      {
        icon: Lock,
        title: "Guaranteed Privacy",
        desc: "Your PDFs, images, and data are processed locally. Files are never stored on servers or shared with third parties.",
      },
      {
        icon: Zap,
        title: "Instant Performance",
        desc: "Zero upload or download server bottlenecks. Operations execute immediately using your device's native capabilities.",
      },
      {
        icon: ShieldCheck,
        title: "100% Free & No Sign-up",
        desc: "Unlimited access to all utilities with no account creation, passwords, paywalls, or usage caps.",
      },
      {
        icon: Cpu,
        title: "Cutting-Edge Web Tech",
        desc: "Built with modern client-side libraries and WebAssembly for mathematical precision and document processing fidelity.",
      },
    ],
    categoriesTitle: "Featured Categories",
    categories: [
      {
        name: "PDF & Documents",
        description:
          "Merge multiple PDFs into a clean document, split specific page ranges, compress bulky files, and convert between PDF and JPG formats.",
      },
      {
        name: "Finance & Math",
        description:
          "Model mortgages, auto loans, amortization schedules, debt payoff timelines, and create professional invoices and receipts.",
      },
      {
        name: "Text & Editing",
        description:
          "Inspect word and character counts, measure reading times, test readability scores, and analyze keyword densities in real time.",
      },
      {
        name: "Converters & Rates",
        description:
          "Convert metric and imperial units across length, weight, and temperature, plus live currency conversions across 150+ international currencies.",
      },
      {
        name: "Agile & Product Management",
        description:
          "Interactive sprint retro boards, Planning Poker estimation rooms, automated daily standup generators, and sprint date calculators.",
      },
      {
        name: "Health, Education & Fun",
        description:
          "Academic GPA and grade calculators, BMI and TDEE fitness metrics, plus randomized team generators and decision wheels for classrooms and games.",
      },
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        question: "Are my uploaded documents uploaded to a remote server?",
        answer:
          "No. ToolNotch processes PDFs and images client-side directly within your browser session. Your documents never leave your computer or phone.",
      },
      {
        question: "Is there any charge or subscription needed?",
        answer:
          "All ToolNotch tools are completely free to use with no hidden fees, subscriptions, or credit card requirements.",
      },
      {
        question: "Can I use these tools on my mobile device?",
        answer:
          "Yes. All interfaces are responsive and work smoothly across modern smartphones, tablets, and desktop computers.",
      },
    ],
    tipTitle: "Productivity Tip",
    tipContent:
      "Bookmark ToolNotch in your browser bar for instantaneous access to calculations and conversions whenever you need them.",
  },
};

export function AppToolsDepth({ locale = "pt" }: AppToolsDepthProps) {
  const content = DEPTH_CONTENT[locale] || DEPTH_CONTENT.pt;

  return (
    <section
      aria-label="Editorial depth and tool guide"
      className="mt-16 pt-12 border-t-dashed-5"
    >
      <div className="space-y-12 max-w-4xl">
        <header className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold uppercase text-foreground">
            {content.heading}
          </h2>
          <p className="text-label leading-relaxed">
            {content.subheading}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {content.pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <AppCard
                key={pillar.title}
                border
                className="p-5 sm:p-6 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-[2px] bg-primary/10 text-primary">
                      <Icon className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm sm:text-base font-bold uppercase text-foreground">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-label/85 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </AppCard>
            );
          })}
        </div>

        <div className="pt-4">
          <AppTip>
            <p className="font-semibold text-foreground mb-1">{content.tipTitle}</p>
            <p className="text-xs sm:text-sm text-label leading-relaxed">
              {content.tipContent}
            </p>
          </AppTip>
        </div>

        <div className="space-y-6 pt-4">
          <h2 className="text-lg sm:text-xl font-bold uppercase text-foreground">
            {content.categoriesTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.categories.map((cat) => (
              <div
                key={cat.name}
                className="p-5 rounded-[2px] border border-border/60 bg-tertiary/40 space-y-1.5"
              >
                <h3 className="text-sm font-bold uppercase text-foreground">
                  {cat.name}
                </h3>
                <p className="text-xs text-label leading-relaxed">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 pt-4">
          <h2 className="text-lg sm:text-xl font-bold uppercase text-foreground">
            {content.faqTitle}
          </h2>
          <div className="space-y-4">
            {content.faqs.map((faq) => (
              <div
                key={faq.question}
                className="p-5 rounded-[2px] border border-border/50 bg-tertiary/30 space-y-2"
              >
                <h3 className="text-sm sm:text-base font-semibold text-foreground">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-label leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AppToolsDepth;
