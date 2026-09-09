import { ImageResponse } from "next/og";
import { isTriviaQuiz } from "@/lib/quizTypes";
import { getQuizBySlug } from "@/lib/content/quizRepository";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function QuizOgImage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const quiz = await getQuizBySlug(slug, locale);

  const title = quiz?.title ?? "Interactive Quiz";
  const description = quiz?.description ?? "Test your knowledge on ToolNotch";
  const isTrivia = quiz ? isTriviaQuiz(quiz) : false;
  const badgeText = isTrivia
    ? locale === "pt"
      ? "QUIZ DE TRIVIA"
      : locale === "es"
        ? "TRIVIA"
        : "TRIVIA QUIZ"
    : locale === "pt"
      ? "TESTE DE PERSONALIDADE"
      : locale === "es"
        ? "TEST DE PERSONALIDAD"
        : "PERSONALITY QUIZ";

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
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "24px",
          }}
        >
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "18px" }}>
            Free • No registration required • Instant result
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#5ce4dd",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Take Quiz →
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
