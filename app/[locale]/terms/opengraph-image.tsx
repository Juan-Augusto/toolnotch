import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TermsOgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const title =
    locale === "pt"
      ? "Termos de Uso"
      : locale === "es"
        ? "Términos de Servicio"
        : "Terms of Service";

  const description =
    locale === "pt"
      ? "Condições de navegação, isenções legais e diretrizes de uso livre das ferramentas."
      : locale === "es"
        ? "Condiciones de navegación, exenciones legales y pautas de uso libre de las herramientas."
        : "Browsing conditions, legal disclaimers, and open usage guidelines for our free tools.";

  const badgeText =
    locale === "pt"
      ? "TOOLNOTCH · TERMOS E DIRETRIZES"
      : locale === "es"
        ? "TOOLNOTCH · TÉRMINOS Y DIRECTRICES"
        : "TOOLNOTCH · TERMS & GUIDELINES";

  const bullet1 =
    locale === "pt"
      ? "✓ 100% Gratuito"
      : locale === "es"
        ? "✓ 100% Gratis"
        : "✓ 100% Free";

  const bullet2 =
    locale === "pt"
      ? "✓ Uso Pessoal e Educacional"
      : locale === "es"
        ? "✓ Uso Personal y Educativo"
        : "✓ Personal & Educational Use";

  const bullet3 =
    locale === "pt"
      ? "✓ Execução Local no Navegador"
      : locale === "es"
        ? "✓ Ejecución Local en Navegador"
        : "✓ Local In-Browser Processing";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0f172a",
          padding: "70px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "8px",
            height: "100%",
            background: "#c3e652",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "#c3e652",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "24px",
                color: "#0f172a",
              }}
            >
              T
            </div>
            <span
              style={{
                color: "#ffffff",
                fontSize: "26px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
              }}
            >
              ToolNotch
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(195, 230, 82, 0.15)",
              border: "1px solid rgba(195, 230, 82, 0.4)",
              borderRadius: "4px",
              padding: "6px 16px",
              color: "#c3e652",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            {badgeText}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "1000px",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-1px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#94a3b8",
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(148, 163, 184, 0.2)",
            paddingTop: "24px",
            color: "#64748b",
            fontSize: "16px",
          }}
        >
          <div style={{ display: "flex", gap: "24px" }}>
            <span>{bullet1}</span>
            <span>{bullet2}</span>
            <span>{bullet3}</span>
          </div>
          <span style={{ color: "#c3e652", fontWeight: 600 }}>
            toolnotch.com/terms
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
