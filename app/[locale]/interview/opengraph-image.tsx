import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function InterviewHubOgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const title =
    locale === "pt"
      ? "Simulados Técnicos de Engenharia de Software"
      : locale === "es"
        ? "Simuladores Técnicos de Ingeniería de Software"
        : "Software Engineering Technical Interview Drills";

  const description =
    locale === "pt"
      ? "30 questões por simulado: TypeScript, Vue, Node.js, Database Design, Kafka, RabbitMQ e Arquitetura de Sistemas."
      : locale === "es"
        ? "30 preguntas por simulador: TypeScript, Vue, Node.js, Database Design, Kafka, RabbitMQ y Arquitectura de Sistemas."
        : "30 questions per drill: TypeScript, Vue, Node.js, Database Design, Kafka, RabbitMQ, and System Architecture.";

  const badgeText =
    locale === "pt"
      ? "8 SIMULADOS TÉCNICOS • 240+ QUESTÕES"
      : locale === "es"
        ? "8 SIMULADORES TÉCNICOS • 240+ PREGUNTAS"
        : "8 TECHNICAL DRILLS • 240+ QUESTIONS";

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
              color: "#22d3ee",
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
              fontSize: "52px",
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
              color: "#22d3ee",
              fontSize: "16px",
              fontWeight: "bold",
              letterSpacing: "1.5px",
            }}
          >
            TOOLNOTCH • INTERVIEW PREP & DRILLS
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
