"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  Hash,
  FileCode2,
} from "lucide-react";
import { AppAccordion, AppTip } from "@/components/ui";
import type { FaqItem } from "@/components/AppFaqSection";
import AppAffiliateOffers from "@/components/AppAffiliateOffers";
import AppAffiliateStickyBar from "@/components/AppAffiliateStickyBar";

export interface RichContent {
  whatIs?: string;
  howToUse?: string[];
  whyItMatters?: string;
  proTip?: string;
  sections?: { heading: string; body: string }[];
}

interface DevToolContentProps {
  currentToolSlug?: string;
  richContent?: RichContent;
  faqs?: FaqItem[];
  locale: string;
  extraContent?: React.ReactNode;
}

export default function DevToolContent({
  currentToolSlug,
  richContent,
  faqs = [],
  locale,
  extraContent,
}: DevToolContentProps) {
  const prefix = locale === "en" ? "" : `/${locale}`;

  const allTools = [
    {
      slug: "cpf-generator",
      title:
        locale === "pt"
          ? "Gerador de CPF"
          : locale === "es"
            ? "Generador de CPF"
            : "CPF Generator",
      desc:
        locale === "pt"
          ? "Gere CPFs válidos com pontuação, por estado/região ou em lote para testes de software."
          : locale === "es"
            ? "Genera CPFs válidos con formato y por estado para pruebas de software."
            : "Generate valid Brazilian CPFs with mask, state region filtering, and bulk support for testing.",
      href: `${prefix}/tools/dev/cpf-generator`,
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    },
    {
      slug: "cnpj-generator",
      title:
        locale === "pt"
          ? "Gerador de CNPJ"
          : locale === "es"
            ? "Generador de CNPJ"
            : "CNPJ Generator",
      desc:
        locale === "pt"
          ? "Gere CNPJs válidos e dados completos de empresas fictícias (Razão Social, IE, Endereço, CNAE)."
          : locale === "es"
            ? "Genera CNPJs válidos y datos completos de empresas ficticias para pruebas."
            : "Generate valid Brazilian CNPJs with realistic mock company profiles (Trade Name, Tax ID, Address, CNAE).",
      href: `${prefix}/tools/dev/cnpj-generator`,
      icon: <Building2 className="w-5 h-5 text-primary" />,
    },
    {
      slug: "address-generator",
      title:
        locale === "pt"
          ? "Gerador de Endereço & CEP"
          : locale === "es"
            ? "Generador de Direcciones & CEP"
            : "Address & CEP Generator",
      desc:
        locale === "pt"
          ? "Gere endereços brasileiros reais e completos com CEP, rua, bairro, cidade, UF e DDD."
          : locale === "es"
            ? "Genera direcciones brasileñas completas con CEP, calle, barrio, ciudad y estado."
            : "Generate complete Brazilian mock addresses with valid postal codes (CEP), street, city, state, and DDD.",
      href: `${prefix}/tools/dev/address-generator`,
      icon: <MapPin className="w-5 h-5 text-primary" />,
    },
    {
      slug: "uuid-generator",
      title:
        locale === "pt"
          ? "Gerador de UUID / GUID"
          : locale === "es"
            ? "Generador de UUID / GUID"
            : "UUID / GUID Generator",
      desc:
        locale === "pt"
          ? "Gere UUIDs v4 (aleatório), v7 (ordenado por tempo) e v1 em lote com opções de formatação."
          : locale === "es"
            ? "Genera UUIDs v4, v7 y v1 en lote con opciones avanzadas de formato."
            : "Generate UUID v4, v7 (RFC 9562 time-ordered), and v1 in bulk with custom casing, hyphens, and formats.",
      href: `${prefix}/tools/dev/uuid-generator`,
      icon: <Hash className="w-5 h-5 text-primary" />,
    },
    {
      slug: "json-formatter",
      title:
        locale === "pt"
          ? "Formatador e Validador de JSON"
          : locale === "es"
            ? "Formateador y Validador de JSON"
            : "JSON Formatter & Validator",
      desc:
        locale === "pt"
          ? "Formate, minifique, valide e analise código JSON instantaneamente com identificador de erros."
          : locale === "es"
            ? "Formatea, minifica, valida y analiza código JSON al instante con detección de errores."
            : "Format, minify, validate, and analyze JSON in real time with precise line/column syntax error detection.",
      href: `${prefix}/tools/dev/json-formatter`,
      icon: <FileCode2 className="w-5 h-5 text-primary" />,
    },
    {
      slug: "jwt-decoder",
      title:
        locale === "pt"
          ? "Decodificador e Inspetor de JWT"
          : locale === "es"
            ? "Decodificador e Inspector de JWT"
            : "JWT Decoder & Inspector",
      desc:
        locale === "pt"
          ? "Decodifique Header, Payload e Assinatura com status de expiração em tempo real e tokens de exemplo."
          : locale === "es"
            ? "Decodifica Header, Payload y Firma con estado de expiración en tiempo real."
            : "Decode JWT header, payload, and signature with real-time expiration countdown and sample tokens.",
      href: `${prefix}/tools/dev/jwt-decoder`,
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    },
    {
      slug: "base64-converter",
      title:
        locale === "pt"
          ? "Conversor Base64 (Texto, Hex e Arquivos)"
          : locale === "es"
            ? "Conversor Base64 (Texto, Hex y Archivos)"
            : "Base64 Encoder & Decoder",
      desc:
        locale === "pt"
          ? "Codifique e decodifique texto, hexadecimal e imagens para Base64/Data URI com suporte a URL-Safe."
          : locale === "es"
            ? "Codifica y decodifica texto, hex e imágenes a Base64 con soporte URL-Safe."
            : "Encode and decode text, hex, and images to Base64/Data URI with UTF-8 and URL-safe support.",
      href: `${prefix}/tools/dev/base64-converter`,
      icon: <FileCode2 className="w-5 h-5 text-primary" />,
    },
    {
      slug: "hash-generator",
      title:
        locale === "pt"
          ? "Gerador de Hashes & Checksum"
          : locale === "es"
            ? "Generador de Hashes & Checksum"
            : "Hash & Checksum Generator",
      desc:
        locale === "pt"
          ? "Gere hashes MD5, SHA-1, SHA-256, SHA-512, CRC-32 e HMAC simultaneamente com comparador de integridade."
          : locale === "es"
            ? "Genera hashes MD5, SHA-256, SHA-512 y HMAC con verificador de checksum."
            : "Generate MD5, SHA-1, SHA-256, SHA-512, CRC-32, and HMAC hashes with live checksum comparator.",
      href: `${prefix}/tools/dev/hash-generator`,
      icon: <Hash className="w-5 h-5 text-primary" />,
    },
    {
      slug: "url-parser",
      title:
        locale === "pt"
          ? "Parser e Editor de URL / Query String"
          : locale === "es"
            ? "Analizador y Editor de URL / Query String"
            : "URL & Query String Parser",
      desc:
        locale === "pt"
          ? "Analise URLs, edite parâmetros de busca em tempo real e remova tags de rastreamento (UTMs) com 1 clique."
          : locale === "es"
            ? "Analiza URLs, edita parámetros de consulta y elimina tags UTM al instante."
            : "Parse URLs, interactively edit query parameters, and strip tracking tags (UTM) in one click.",
      href: `${prefix}/tools/dev/url-parser`,
      icon: <MapPin className="w-5 h-5 text-primary" />,
    },
    {
      slug: "regex-tester",
      title:
        locale === "pt"
          ? "Testador e Analisador de Regex"
          : locale === "es"
            ? "Probador y Analizador de Regex"
            : "Regex Tester & Matcher",
      desc:
        locale === "pt"
          ? "Teste expressões regulares com destaque de grupos de captura, substituição e presets brasileiros e web."
          : locale === "es"
            ? "Prueba expresiones regulares con grupos de captura, reemplazo y biblioteca de presets."
            : "Test regular expressions with visual capture group inspector, replacement tool, and preset library.",
      href: `${prefix}/tools/dev/regex-tester`,
      icon: <FileCode2 className="w-5 h-5 text-primary" />,
    },
  ];

  const relatedTools = allTools.filter((t) => t.slug !== currentToolSlug);

  return (
    <>
      <div className="max-w-4xl mx-auto w-full mt-10 sm:mt-14">
        <AppAffiliateOffers />

        {extraContent && (
          <div className="mb-8 sm:mb-10 w-full">{extraContent}</div>
        )}

        {richContent && (
          <article className="space-y-6 sm:space-y-8 md:space-y-10 mb-6 sm:mb-8 md:mb-10 w-full">
            {richContent.howToUse && richContent.howToUse.length > 0 && (
              <section aria-labelledby="how-to-use-heading">
                <h2
                  id="how-to-use-heading"
                  className="text-base sm:text-lg font-bold uppercase text-foreground font-mono mb-2.5 sm:mb-3.5"
                >
                  {locale === "pt"
                    ? "Como Usar"
                    : locale === "es"
                      ? "Cómo Usar"
                      : "How to Use"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {richContent.howToUse.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 bg-tertiary border border-border rounded-[2px] flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-[2px] bg-primary text-background font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <p className="leading-relaxed text-foreground text-sm">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {richContent.whatIs && (
              <section aria-labelledby="what-is-heading">
                <h2
                  id="what-is-heading"
                  className="text-base sm:text-lg font-bold uppercase text-foreground font-mono mb-2 sm:mb-2.5"
                >
                  {locale === "pt"
                    ? "O Que É Esta Ferramenta?"
                    : locale === "es"
                      ? "¿Qué Es Esta Herramienta?"
                      : "What Is This Tool?"}
                </h2>
                <p className="leading-relaxed text-label text-sm">
                  {richContent.whatIs}
                </p>
              </section>
            )}

            {richContent.whyItMatters && (
              <section aria-labelledby="why-it-matters-heading">
                <h2
                  id="why-it-matters-heading"
                  className="text-base sm:text-lg font-bold uppercase text-foreground font-mono mb-2 sm:mb-2.5"
                >
                  {locale === "pt"
                    ? "Por Que Isso Importa?"
                    : locale === "es"
                      ? "¿Por Qué Importa?"
                      : "Why It Matters"}
                </h2>
                <p className="leading-relaxed text-label text-sm">
                  {richContent.whyItMatters}
                </p>
              </section>
            )}

            {richContent.sections &&
              richContent.sections.map((sec, i) => (
                <section key={i}>
                  <h2 className="text-base sm:text-lg font-bold uppercase text-foreground font-mono mb-2 sm:mb-2.5">
                    {sec.heading}
                  </h2>
                  <p className="leading-relaxed text-label text-sm">
                    {sec.body}
                  </p>
                </section>
              ))}

            {richContent.proTip && (
              <AppTip
                title={
                  locale === "pt"
                    ? "Dica de Desenvolvimento"
                    : locale === "es"
                      ? "Consejo de Desarrollo"
                      : "Developer Tip"
                }
              >
                <span className="text-sm leading-relaxed">
                  {richContent.proTip}
                </span>
              </AppTip>
            )}
          </article>
        )}

        {faqs && faqs.length > 0 && (
          <section
            aria-labelledby="faqs-heading"
            className="mb-6 sm:mb-8 md:mb-12 w-full"
          >
            <h2
              id="faqs-heading"
              className="text-base sm:text-lg font-bold uppercase text-foreground font-mono mb-3 sm:mb-4"
            >
              {locale === "pt"
                ? "Perguntas Frequentes"
                : locale === "es"
                  ? "Preguntas Frecuentes"
                  : "Frequently Asked Questions"}
            </h2>
            <AppAccordion
              groups={faqs.map((faq, index) => ({
                id: `faq-${index}`,
                name: faq.question,
                content: (
                  <p className="leading-relaxed text-label text-sm">
                    {faq.answer}
                  </p>
                ),
              }))}
            />
          </section>
        )}

        <section
          aria-labelledby="related-tools-heading"
          className="mb-6 sm:mb-8 md:mb-12 w-full font-mono"
        >
          <h2
            id="related-tools-heading"
            className="text-base sm:text-lg font-bold uppercase text-foreground mb-3 sm:mb-4"
          >
            {locale === "pt"
              ? "Ferramentas para Devs Relacionadas"
              : locale === "es"
                ? "Herramientas para Desarrolladores Relacionadas"
                : "Related Developer Tools"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {relatedTools.map((tool, idx) => (
              <Link key={idx} href={tool.href} className="group block">
                <div className="p-4 sm:p-5 bg-tertiary border border-border hover:border-foreground/20 hover:bg-tertiary/80 rounded-[2px] transition-colors h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      {tool.icon}
                      <h3 className="text-sm font-bold uppercase text-foreground group-hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-label leading-relaxed line-clamp-2">
                      {tool.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-primary font-semibold mt-3 pt-2">
                    <span>
                      {locale === "pt"
                        ? "Acessar ferramenta"
                        : locale === "es"
                          ? "Ir a la herramienta"
                          : "Open tool"}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <AppAffiliateStickyBar />
    </>
  );
}
