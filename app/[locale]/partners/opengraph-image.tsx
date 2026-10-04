import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function PartnersOgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const title =
    locale === "pt"
      ? "Nossos Parceiros"
      : locale === "es"
        ? "Nuestros Socios"
        : "Our Partners";

  const description =
    locale === "pt"
      ? "Ferramentas complementares que testamos, confiamos e recomendamos."
      : locale === "es"
        ? "Herramientas complementarias que probamos, confiamos y recomendamos."
        : "Complementary tools and services that we test, trust, and recommend.";

  const badgeText =
    locale === "pt"
      ? "TOOLNOTCH · PARCERIAS E TRANSPARÊNCIA"
      : locale === "es"
        ? "TOOLNOTCH · SOCIOS Y TRANSPARENCIA"
        : "TOOLNOTCH · PARTNERS & TRANSPARENCY";

  const bullet1 =
    locale === "pt"
      ? "✓ Critérios Rigorosos"
      : locale === "es"
        ? "✓ Criterios Rigurosos"
        : "✓ Rigorous Standards";

  const bullet2 =
    locale === "pt"
      ? "✓ Independência Editorial"
      : locale === "es"
        ? "✓ Independencia Editorial"
        : "✓ Editorial Independence";

  const bullet3 =
    locale === "pt"
      ? "✓ 100% Sem Paywall"
      : locale === "es"
        ? "✓ 100% Sin Muros de Pago"
        : "✓ 100% Free Tools";

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
            background: "#22d3ee",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "14px",
              background: "#1e293b",
              border: "2px solid #334155",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "32px",
                fontWeight: 900,
                color: "#a3e635",
                fontFamily: "monospace",
              }}
            >
              T
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "24px",
                fontWeight: 900,
                letterSpacing: "0.15em",
                color: "#ffffff",
                fontFamily: "monospace",
              }}
            >
              TOOLNOTCH
            </span>
            <span
              style={{
                fontSize: "12px",
                letterSpacing: "0.2em",
                color: "#22d3ee",
                fontFamily: "monospace",
              }}
            >
              {badgeText}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "950px",
          }}
        >
          <div
            style={{
              fontSize: "50px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.15,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "22px",
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
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #334155",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "24px" }}>
            <span
              style={{
                fontSize: "16px",
                color: "#a3e635",
                fontFamily: "monospace",
                fontWeight: 700,
              }}
            >
              {bullet1}
            </span>
            <span
              style={{
                fontSize: "16px",
                color: "#22d3ee",
                fontFamily: "monospace",
                fontWeight: 700,
              }}
            >
              {bullet2}
            </span>
            <span
              style={{
                fontSize: "16px",
                color: "#cbd5e1",
                fontFamily: "monospace",
                fontWeight: 700,
              }}
            >
              {bullet3}
            </span>
          </div>

          <span
            style={{
              fontSize: "16px",
              color: "#64748b",
              fontFamily: "monospace",
              letterSpacing: "0.1em",
            }}
          >
            toolnotch.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
