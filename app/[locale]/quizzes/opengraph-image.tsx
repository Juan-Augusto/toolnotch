import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function QuizzesHubOgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const title =
    locale === "pt"
      ? "Quizzes e Testes de Personalidade"
      : locale === "es"
        ? "Quizzes y Tests de Personalidad"
        : "Interactive Quizzes & Trivia";

  const description =
    locale === "pt"
      ? "Descubra qual time você é, teste seus conhecimentos de esportes e tecnologia. 100% gratuito."
      : locale === "es"
        ? "Descubre qué equipo eres, pon a prueba tus conocimientos de fútbol y tecnología. 100% gratis."
        : "Discover your personality type, test your football and tech knowledge. 100% free.";

  const badgeText =
    locale === "pt"
      ? "20+ QUIZZES INTERATIVOS"
      : locale === "es"
        ? "20+ QUIZZES INTERACTIVOS"
        : "20+ INTERACTIVE QUIZZES";

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
              background: "#1e293b",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "8px 20px",
              borderRadius: "4px",
              color: "#c3e652",
              fontSize: "18px",
              fontWeight: "bold",
              letterSpacing: "2px",
            }}
          >
            {badgeText}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "20px",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            TOOLNOTCH.COM
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: "56px",
              fontWeight: 900,
              lineHeight: 1.15,
              textTransform: "uppercase",
              letterSpacing: "-0.5px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "24px",
              lineHeight: 1.4,
              maxHeight: "100px",
              overflow: "hidden",
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              color: "#c3e652",
              fontSize: "16px",
              fontWeight: "bold",
              letterSpacing: "1.5px",
            }}
          >
            TOOLNOTCH • FREE INTERACTIVE HUB
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
