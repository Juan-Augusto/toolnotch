import type { Metadata } from "next";
import Link from "next/link";
import {
  Minimize2,
  RefreshCw,
  Maximize2,
  Crop,
  EyeOff,
  Sparkles,
  FileImage,
  ArrowRight,
} from "lucide-react";
import { buildAlternatesForLocale, localizedPath } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  breadcrumbSchema,
  webAppSchema,
  buildLocalizedUrl,
} from "@/lib/schema";
import { AppBreadcrumb, AppCard } from "@/components/ui";

const PATH = "/tools/image";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const title =
    locale === "pt"
      ? "Ferramentas de Imagem Online Gratuitas: Comprimir, Converter e Redimensionar | ToolNotch"
      : locale === "es"
        ? "Herramientas de Imagen Online Gratuitas: Comprimir, Convertir y Redimensionar | ToolNotch"
        : "Free Online Image Tools: Compress, Convert & Resize Images | ToolNotch";

  const description =
    locale === "pt"
      ? "Suite completa de ferramentas de imagem gratuitas: compressor de PNG/JPG/WebP, conversor de formatos, redimensionador, corte, censura/desfoque e gerador de favicons. 100% no navegador."
      : locale === "es"
        ? "Suite completa de herramientas gratuitas de imagen: compresor de PNG/JPG/WebP, convertidor de formatos, redimensionador, recorte, desenfoque y generador de favicon. 100% en el navegador."
        : "Complete suite of free online image tools: PNG/JPG/WebP image compressor, format converter, resizer, crop, blur/censor, and favicon generator. 100% client-side in your browser.";

  return {
    title,
    description,
    alternates: buildAlternatesForLocale(PATH, locale),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: localizedUrl,
      locale: ogLocale,
      siteName: "ToolNotch",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ImageToolsHubPage({ params }: Props) {
  const { locale } = await params;
  const prefix = locale === "en" ? "" : `/${locale}`;

  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const imageLabel =
    locale === "pt" ? "Imagens" : locale === "es" ? "Imágenes" : "Images";

  const tools = [
    {
      href: `${prefix}/tools/image/image-compressor`,
      title:
        locale === "pt"
          ? "Compressor de Imagens"
          : locale === "es"
            ? "Compresor de Imágenes"
            : "Image Compressor",
      desc:
        locale === "pt"
          ? "Reduza o peso de PNG, JPG e WebP em até 80% mantendo alta fidelidade visual sem upload para servidores."
          : locale === "es"
            ? "Reduce el tamaño de PNG, JPG y WebP hasta un 80% manteniendo la máxima calidad visual."
            : "Reduce PNG, JPG, and WebP file sizes by up to 80% with zero quality loss directly in your browser.",
      icon: <Minimize2 className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/image/image-converter`,
      title:
        locale === "pt"
          ? "Conversor de Imagens"
          : locale === "es"
            ? "Conversor de Imágenes"
            : "Image Converter",
      desc:
        locale === "pt"
          ? "Converta imagens entre os formatos JPG, PNG, WebP, AVIF e BMP instantaneamente."
          : locale === "es"
            ? "Convierte imágenes entre formatos JPG, PNG, WebP, AVIF y BMP al instante."
            : "Convert images between JPG, PNG, WebP, AVIF, and BMP formats instantly.",
      icon: <RefreshCw className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/image/image-resizer`,
      title:
        locale === "pt"
          ? "Redimensionador de Imagens"
          : locale === "es"
            ? "Redimensionador de Imágenes"
            : "Image Resizer",
      desc:
        locale === "pt"
          ? "Ajuste dimensões em pixels ou porcentagem com preservação da proporção e predefinições para redes sociais."
          : locale === "es"
            ? "Ajusta dimensiones en píxeles o porcentaje conservando la proporción y con presets para redes."
            : "Resize images by exact pixel dimensions or percentage with aspect ratio lock and social presets.",
      icon: <Maximize2 className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/image/crop-image`,
      title:
        locale === "pt"
          ? "Cortar Imagem"
          : locale === "es"
            ? "Recortar Imagen"
            : "Crop Image",
      desc:
        locale === "pt"
          ? "Corte imagens com proporções livres ou fixas (1:1, 16:9, 4:3) e exportação em alta qualidade."
          : locale === "es"
            ? "Recorta imágenes con proporciones libres o fijas (1:1, 16:9, 4:3) y exportación en alta calidad."
            : "Crop images with freeform or fixed aspect ratios (1:1, 16:9, 4:3) with high-quality export.",
      icon: <Crop className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/image/censor-image`,
      title:
        locale === "pt"
          ? "Censurar / Desfocar Imagem"
          : locale === "es"
            ? "Censurar / Desenfocar Imagen"
            : "Censor & Blur Image",
      desc:
        locale === "pt"
          ? "Oculte dados sensíveis, rostos e documentos com desfoque gaussiano ou tarja preta com total privacidade."
          : locale === "es"
            ? "Oculta información confidencial, rostros y documentos con desenfoque o barra negra."
            : "Hide sensitive data, faces, and documents with Gaussian blur or solid black bars privately.",
      icon: <EyeOff className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/image/favicon-generator`,
      title:
        locale === "pt"
          ? "Gerador de Favicon"
          : locale === "es"
            ? "Generador de Favicon"
            : "Favicon Generator",
      desc:
        locale === "pt"
          ? "Gere pacotes completos de ícones e arquivos .ico nos tamanhos 16x16, 32x32 e 48x48 para seu site."
          : locale === "es"
            ? "Genera paquetes completos de favicons y archivos .ico en tamaños 16x16, 32x32 y 48x48."
            : "Generate complete favicon packs and .ico files in 16x16, 32x32, and 48x48 for your website.",
      icon: <Sparkles className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/image/convert-png-to-webp`,
      title:
        locale === "pt"
          ? "Converter PNG para WebP"
          : locale === "es"
            ? "Convertir PNG a WebP"
            : "PNG to WebP Converter",
      desc:
        locale === "pt"
          ? "Converta imagens PNG com transparência para o formato WebP moderno e ultra leve."
          : locale === "es"
            ? "Convierte imágenes PNG transparentes al formato moderno y ligero WebP."
            : "Convert transparent PNG images to lightweight, modern WebP format for fast web pages.",
      icon: <FileImage className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/image/convert-webp-to-png`,
      title:
        locale === "pt"
          ? "Converter WebP para PNG"
          : locale === "es"
            ? "Convertir WebP a PNG"
            : "WebP to PNG Converter",
      desc:
        locale === "pt"
          ? "Converta imagens WebP para PNG de alta compatibilidade preservando canal alfa e nitidez."
          : locale === "es"
            ? "Convierte imágenes WebP a PNG de máxima compatibilidad manteniendo la transparencia."
            : "Convert WebP images to highly compatible lossless PNGs preserving transparency.",
      icon: <FileImage className="w-5 h-5 text-secondary shrink-0" />,
    },
    {
      href: `${prefix}/tools/image/convert-heic-to-jpg`,
      title:
        locale === "pt"
          ? "Converter HEIC para JPG"
          : locale === "es"
            ? "Convertir HEIC a JPG"
            : "HEIC to JPG Converter",
      desc:
        locale === "pt"
          ? "Converta fotos HEIC de iPhone e iPad para JPG universal diretamente no seu navegador."
          : locale === "es"
            ? "Convierte fotos HEIC de iPhone y iPad a formato JPG universal en tu navegador."
            : "Convert Apple HEIC photos from iPhone and iPad to universal JPG format in seconds.",
      icon: <FileImage className="w-5 h-5 text-secondary shrink-0" />,
    },
  ];

  const localizedUrl = buildLocalizedUrl(PATH, locale);

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: toolsLabel, url: localizedPath("/tools", locale) },
      { name: imageLabel, url: localizedUrl },
    ]),
    webAppSchema(
      imageLabel,
      PATH,
      locale === "pt"
        ? "Ferramentas online gratuitas para edição, conversão e compressão de imagens."
        : locale === "es"
          ? "Herramientas online gratuitas para edición, conversión y compresión de imágenes."
          : "Free online tools for image editing, conversion, and compression.",
      locale,
      "PhotoApplication"
    )
  );

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full">
        <div className="w-full pb-2 sm:pb-3">
          <AppBreadcrumb
            items={[
              { label: homeLabel, href: prefix || "/" },
              { label: toolsLabel, href: `${prefix}/tools` },
              { label: imageLabel, current: true },
            ]}
          />
        </div>

        <header className="mb-6 sm:mb-8 pt-1 sm:pt-2 pb-3.5 sm:pb-5 border-b border-border/80">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono break-words">
            {locale === "pt"
              ? "Ferramentas de Imagem"
              : locale === "es"
                ? "Herramientas de Imagen"
                : "Image Tools"}
          </h1>
          <p className="leading-relaxed text-label mt-1.5 sm:mt-2 max-w-3xl text-xs sm:text-sm">
            {locale === "pt"
              ? "Comprima, converta, redimensione e edite imagens com total privacidade. Processamento 100% local no seu navegador - nenhum arquivo é enviado a servidores externos."
              : locale === "es"
                ? "Comprime, convierte, redimensiona y edita imágenes con total privacidad. Procesamiento 100% local en tu navegador sin subida a servidores."
                : "Compress, convert, resize, and edit images with complete client-side privacy. 100% in-browser processing with zero server uploads."}
          </p>
        </header>

        <section aria-label="Image Tools" className="mb-10 sm:mb-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group block h-full">
                <AppCard
                  border
                  cornerAccents={false}
                  className="p-4 sm:p-5 bg-tertiary group-hover:border-secondary/60 transition-colors h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      {tool.icon}
                      <h2 className="text-sm sm:text-base font-bold text-foreground group-hover:text-secondary transition-colors font-mono">
                        {tool.title}
                      </h2>
                    </div>
                    <p className="text-xs text-label leading-relaxed font-mono line-clamp-2">
                      {tool.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-secondary font-semibold mt-4 pt-3 border-t border-border/50 font-mono">
                    <span>
                      {locale === "pt"
                        ? "Acessar ferramenta"
                        : locale === "es"
                          ? "Abrir herramienta"
                          : "Open tool"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </AppCard>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
