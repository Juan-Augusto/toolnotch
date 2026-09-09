import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function AboutOgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const title =
    locale === "pt"
      ? "Sobre o ToolNotch"
      : locale === "es"
        ? "Sobre ToolNotch"
        : "About ToolNotch";

  const description =
    locale === "pt"
      ? "Utilitários online rápidos, gratuitos e privados que rodam direto no navegador."
      : locale === "es"
        ? "Herramientas online rápidas, gratuitas y privadas en tu navegador."
        : "Fast, free, and private in-browser online tools with zero sign-up.";

  const badgeText =
    locale === "pt"
      ? "TOOLNOTCH · CLIENT-SIDE & PRIVACIDADE"
      : locale === "es"
        ? "TOOLNOTCH · CLIENT-SIDE Y PRIVACIDAD"
        : "TOOLNOTCH · CLIENT-SIDE & PRIVACY";

  const bullet1 =
    locale === "pt"
      ? "✓ 100% Client-Side"
      : locale === "es"
        ? "✓ 100% Client-Side"
        : "✓ 100% Client-Side";

  const bullet2 =
    locale === "pt"
      ? "✓ Zero Cadastro"
      : locale === "es"
        ? "✓ Sin Registro"
        : "✓ No Sign-Up";

  const bullet3 =
    locale === "pt"
      ? "✓ 70+ Ferramentas"
      : locale === "es"
        ? "✓ 70+ Herramientas"
        : "✓ 70+ Free Tools";

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
            toolnotch.com/about
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
