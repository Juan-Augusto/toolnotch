import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Layers,
  Scissors,
  Minimize2,
  FileStack,
  Trash2,
  Image,
  FileText,
  Type,
  ImageIcon,
  ShieldCheck,
  Sparkles,
  Zap,
  ArrowRight,
  Lock,
  Globe2,
} from "lucide-react";
import { buildAlternatesForLocale } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  breadcrumbSchema,
  faqSchema,
  buildLocalizedUrl,
} from "@/lib/schema";
import {
  AppBreadcrumb,
  AppBadge,
  AppCard,
  AppTip,
  AppAccordion,
} from "@/components/ui";

const PATH = "/tools/pdf";

interface Props {
  params: Promise<{ locale: string }>;
}

const HUB_META = {
  pt: {
    title:
      "Ferramentas PDF Online Grátis — Juntar, Dividir, Comprimir e Organizar | ToolNotch",
    description:
      "Suite completa de ferramentas gratuitas para PDF: juntar, dividir, comprimir, converter para JPG, imagens para PDF, organizar e remover páginas. 100% no navegador e seguro.",
    breadcrumb: "Ferramentas PDF",
    headerTitle: "Ferramentas PDF Online Grátis",
    headerDescription:
      "Junte, divida, comprima, organize e converta arquivos PDF com total privacidade. Suas páginas são processadas localmente no seu navegador — nenhum arquivo é enviado para servidores externos.",
    badges: {
      noUpload: "100% Privado (Sem Upload)",
      free: "100% Gratuito",
      instant: "Processamento no Navegador",
    },
    openTool: "Abrir ferramenta",
    featuresTitle: "Por que usar as Ferramentas de PDF do ToolNotch?",
    features: [
      {
        icon: Lock,
        title: "Privacidade e Segurança Total",
        desc: "Todo o processamento roda localmente no seu computador ou celular. Seus documentos sigilosos nunca saem do seu dispositivo nem passam por servidores externos.",
      },
      {
        icon: Sparkles,
        title: "Totalmente Gratuito e Sem Limites",
        desc: "Sem assinaturas, sem cobranças ocultas, sem filas de espera e sem marcas d'água inseridas no seu arquivo final. Use quantas vezes precisar.",
      },
      {
        icon: Globe2,
        title: "Compatível com Qualquer Dispositivo",
        desc: "Funciona direto no Chrome, Safari, Firefox ou Edge, seja no Windows, Mac, Linux, Android ou iOS sem necessidade de instalar programas ou plugins.",
      },
    ],
    proTipTitle: "Dica Pro",
    proTipText:
      "Ao trabalhar com múltiplos arquivos, execute a ferramenta Comprimir PDF após mesclar ou organizar suas páginas. Isso otimiza o peso final para anexos de e-mail e envio no WhatsApp.",
    faqHeading: "Perguntas Frequentes sobre Ferramentas PDF",
    faqs: [
      {
        question: "As ferramentas de PDF do ToolNotch são realmente gratuitas?",
        answer:
          "Sim! Todas as 9 ferramentas de PDF são 100% gratuitas, sem limites diários de uso e sem necessidade de criar conta ou informar cartão de crédito.",
      },
      {
        question: "Meus arquivos confidenciais são enviados para algum servidor?",
        answer:
          "Não. Todas as conversões, cortes, junções e compressões são executadas diretamente pelo seu navegador através de bibliotecas JavaScript modernas. Seus arquivos nunca trafegam pela internet.",
      },
      {
        question: "Existe limite de tamanho para os arquivos PDF?",
        answer:
          "Como o processamento usa a memória do seu próprio dispositivo, você pode processar arquivos grandes sem restrições ou bloqueios de servidor.",
      },
      {
        question: "As ferramentas funcionam no celular e tablet?",
        answer:
          "Sim. Toda a interface foi projetada com design responsivo e toques intuitivos, funcionando perfeitamente em smartphones Android e iPhones.",
      },
    ],
  },
  es: {
    title:
      "Herramientas PDF Online Gratis — Unir, Dividir, Comprimir y Organizar | ToolNotch",
    description:
      "Suite completa de herramientas gratuitas para PDF: unir, dividir, comprimir, convertir a JPG, imágenes a PDF, organizar y eliminar páginas. 100% privado en tu navegador.",
    breadcrumb: "Herramientas PDF",
    headerTitle: "Herramientas PDF Online Gratis",
    headerDescription:
      "Une, divide, comprime, organiza y convierte archivos PDF con total privacidad. Tus documentos se procesan localmente en tu navegador — ningún archivo se sube a servidores externos.",
    badges: {
      noUpload: "100% Privado (Sin Subidas)",
      free: "100% Gratis",
      instant: "Procesamiento en el Navegador",
    },
    openTool: "Abrir herramienta",
    featuresTitle: "¿Por qué usar las Herramientas de PDF de ToolNotch?",
    features: [
      {
        icon: Lock,
        title: "Privacidad y Seguridad Total",
        desc: "A diferencia de otros servicios, todo el procesamiento se realiza localmente en tu navegador mediante bibliotecas modernas. Tus documentos confidenciales nunca salen de tu dispositivo.",
      },
      {
        icon: Sparkles,
        title: "Completamente Gratis y Sin Límites",
        desc: "Sin suscripciones, sin límites diarios, sin marcas de agua y sin esperas. Úsalo tantas veces como lo necesites.",
      },
      {
        icon: Globe2,
        title: "Compatible con Cualquier Dispositivo",
        desc: "Funciona directamente en Chrome, Safari, Firefox o Edge, ya sea en Windows, Mac, Linux, Android o iOS sin instalar nada.",
      },
    ],
    proTipTitle: "Consejo Pro",
    proTipText:
      "Al trabajar con varios documentos, utiliza la herramienta Comprimir PDF después de unirlos u organizarlos para reducir el peso del archivo final antes de enviarlo.",
    faqHeading: "Preguntas Frecuentes sobre Herramientas PDF",
    faqs: [
      {
        question: "¿Las herramientas de PDF de ToolNotch son realmente gratuitas?",
        answer:
          "¡Sí! Todas las herramientas son 100% gratuitas, sin límites de uso diario y sin necesidad de registrarse ni ingresar datos de pago.",
      },
      {
        question: "¿Mis archivos se suben a algún servidor?",
        answer:
          "No. Todas las tareas se procesan en tu propio navegador. Tus archivos nunca viajan por internet ni se almacenan en servidores externos.",
      },
      {
        question: "¿Hay límite de tamaño para los documentos PDF?",
        answer:
          "Dado que el proceso utiliza la memoria de tu dispositivo, puedes trabajar con archivos grandes sin bloqueos de servidor.",
      },
      {
        question: "¿Puedo usar estas herramientas en mi teléfono celular?",
        answer:
          "Sí, toda la plataforma está adaptada con controles táctiles para smartphones y tabletas.",
      },
    ],
  },
  en: {
    title:
      "Free PDF Tools Online — Merge, Split, Compress & Organize | ToolNotch",
    description:
      "Comprehensive suite of free online PDF tools: merge, split, compress, convert PDF to JPG, images to PDF, organize, and delete pages. 100% private, client-side in your browser.",
    breadcrumb: "PDF Tools",
    headerTitle: "Free Online PDF Tools",
    headerDescription:
      "Merge, split, compress, organize, and convert PDF files with complete privacy. All processing runs client-side in your web browser — your documents never leave your device.",
    badges: {
      noUpload: "100% Private (No Upload)",
      free: "100% Free",
      instant: "Browser-Based Processing",
    },
    openTool: "Open tool",
    featuresTitle: "Why Use ToolNotch Browser-Based PDF Tools?",
    features: [
      {
        icon: Lock,
        title: "Guaranteed Privacy & Security",
        desc: "Unlike services that upload your PDFs to remote cloud servers, ToolNotch processes documents entirely in your browser. Confidential files never leave your machine.",
      },
      {
        icon: Sparkles,
        title: "Unlimited & 100% Free",
        desc: "No paid subscriptions, no daily processing limits, no account registration, and no intrusive watermarks stamped on your documents.",
      },
      {
        icon: Globe2,
        title: "Works on Any Device",
        desc: "Use Chrome, Safari, Edge, or Firefox on macOS, Windows, Linux, Android, or iOS. No software downloads or browser extensions required.",
      },
    ],
    proTipTitle: "Pro Tip",
    proTipText:
      "When working with multi-document workflows, run the Compress PDF tool after merging or organizing your pages to ensure lightweight files for email attachments.",
    faqHeading: "Frequently Asked Questions about PDF Tools",
    faqs: [
      {
        question: "Are ToolNotch PDF tools completely free to use?",
        answer:
          "Yes! All 9 PDF tools are 100% free with no daily limits, hidden subscriptions, or account requirements.",
      },
      {
        question: "Are my confidential files uploaded to any server?",
        answer:
          "No. All conversions, page extraction, merging, and compression run client-side in your web browser. Your files never touch a remote server.",
      },
      {
        question: "Is there any file size limit for PDFs?",
        answer:
          "Because processing occurs locally in your browser memory, there are no artificial cloud upload limits. Typical files up to 100 MB process in just seconds.",
      },
      {
        question: "Do these PDF tools work on smartphones and tablets?",
        answer:
          "Yes. The entire user interface is responsive with touch-optimized controls for iOS and Android devices.",
      },
    ],
  },
};

const PDF_TOOLS = [
  { slug: "merge-pdf", ns: "merge", icon: Layers },
  { slug: "split-pdf", ns: "split", icon: Scissors },
  { slug: "compress-pdf", ns: "compress", icon: Minimize2 },
  { slug: "organize-pdf", ns: "organize", icon: FileStack },
  { slug: "delete-pdf-pages", ns: "deletePages", icon: Trash2 },
  { slug: "pdf-to-jpg", ns: "pdfToJpg", icon: Image },
  { slug: "jpg-to-pdf", ns: "jpgToPdf", icon: FileText },
  { slug: "pdf-to-text", ns: "pdfToText", icon: Type },
  { slug: "extract-pdf-images", ns: "extractImages", icon: ImageIcon },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "pt" || locale === "es" ? locale : "en";
  const meta = HUB_META[currentLocale];
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  return {
    title: meta.title,
    description: meta.description,
    alternates: buildAlternatesForLocale(PATH, locale),
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: localizedUrl,
      siteName: "ToolNotch",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function PdfToolsHubPage({ params }: Props) {
  const { locale } = await params;
  const currentLocale = locale === "pt" || locale === "es" ? locale : "en";
  const meta = HUB_META[currentLocale];
  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const prefix = locale === "en" ? "" : `/${locale}`;
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const localizedToolsUrl = buildLocalizedUrl("/tools", locale);

  const tPdf = await getTranslations({ locale, namespace: "pdf" });

  const toolsList = PDF_TOOLS.map((item) => {
    const title = tPdf(`${item.ns}.title`);
    const desc = tPdf(`${item.ns}.description`);
    const href = `${prefix}/tools/pdf/${item.slug}`;

    return {
      ...item,
      title,
      desc,
      href,
    };
  });

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: prefix || "/" },
      { name: toolsLabel, url: localizedToolsUrl },
      { name: meta.breadcrumb, url: localizedUrl },
    ]),
    {
      "@type": "ItemList",
      name: meta.title,
      description: meta.description,
      url: localizedUrl,
      numberOfItems: toolsList.length,
      itemListElement: toolsList.map((tool, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: tool.title,
        url: buildLocalizedUrl(`/tools/pdf/${tool.slug}`, locale),
      })),
    },
    faqSchema([...meta.faqs]),
  );

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
            { label: homeLabel, href: prefix || "/" },
            { label: toolsLabel, href: `${prefix}/tools` },
            { label: meta.breadcrumb, current: true },
          ]}
        />
      </div>

      {/* Hero Header */}
      <header className="mb-6 sm:mb-8 md:mb-10 pt-1 sm:pt-2 pb-3.5 sm:pb-5 border-b border-border/80">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          {meta.headerTitle}
        </h1>
        <p className="text-xs sm:text-sm text-label leading-relaxed mt-1.5 sm:mt-2 max-w-3xl">
          {meta.headerDescription}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2.5 sm:mt-3.5">
          <AppBadge
            bg="bg-primary"
            text="text-background"
            icon={<ShieldCheck className="w-3.5 h-3.5 shrink-0" />}
          >
            {meta.badges.noUpload}
          </AppBadge>
          <AppBadge
            bg="bg-secondary"
            text="text-background"
            icon={<Sparkles className="w-3.5 h-3.5 shrink-0" />}
          >
            {meta.badges.free}
          </AppBadge>
          <AppBadge
            bg="bg-foreground"
            text="text-background"
            icon={<Zap className="w-3.5 h-3.5 shrink-0" />}
          >
            {meta.badges.instant}
          </AppBadge>
        </div>
      </header>

      {/* Grid of 9 PDF Tools */}
      <section aria-labelledby="pdf-tools-grid-heading" className="mb-8 sm:mb-12">
        <h2 id="pdf-tools-grid-heading" className="sr-only">
          {meta.headerTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {toolsList.map((tool) => {
            const Icon = tool.icon;
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

                    <h3 className="text-sm sm:text-base font-bold uppercase text-foreground group-hover:text-secondary transition-colors leading-snug mb-2">
                      {tool.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-label leading-relaxed line-clamp-2 sm:line-clamp-3">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold uppercase text-label group-hover:text-secondary transition-colors">
                    <span>{meta.openTool}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </AppCard>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features & Security */}
      <section aria-labelledby="pdf-features-heading" className="mb-8 sm:mb-12">
        <h2
          id="pdf-features-heading"
          className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground mb-3 sm:mb-5"
        >
          {meta.featuresTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {meta.features.map((feat, idx) => {
            const Icon = feat.icon;
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
                <h3 className="text-xs sm:text-sm font-bold uppercase text-foreground mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-label leading-relaxed">
                  {feat.desc}
                </p>
              </AppCard>
            );
          })}
        </div>
      </section>

      {/* Pro Tip */}
      <div className="mb-8 sm:mb-12 max-w-4xl">
        <AppTip title={meta.proTipTitle}>{meta.proTipText}</AppTip>
      </div>

      {/* FAQs */}
      <section aria-labelledby="pdf-faq-heading" className="max-w-4xl pt-4 sm:pt-6 border-t border-border/80">
        <h2
          id="pdf-faq-heading"
          className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground mb-3 sm:mb-4 md:mb-6"
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
  );
}
