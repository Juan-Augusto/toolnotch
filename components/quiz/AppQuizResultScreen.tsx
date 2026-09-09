import { useState, useMemo } from "react";
import Link from "next/link";
import { RotateCcw, Copy, Check, Download } from "lucide-react";
import AppCard from "@/components/ui/AppCard";
import AppButton from "@/components/ui/AppButton";
import { QuizResult } from "@/lib/quizTypes";
import { TriviaResult } from "@/lib/triviaEngine";
import type { QuizLabels } from "./quizLabels";
import { generateStoryCardDataUrl } from "./quizStoryCard";

export interface AppQuizResultScreenProps {
  quizId: string;
  quizTitle: string;
  isTrivia: boolean;
  triviaResult: TriviaResult | null;
  personalityResult: QuizResult | null;
  currentLocale: string;
  labels: QuizLabels;
  onRetake: () => void;
}

export function AppQuizResultScreen({
  quizId,
  quizTitle,
  isTrivia,
  triviaResult,
  personalityResult,
  currentLocale,
  labels,
  onRetake,
}: AppQuizResultScreenProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const shareMessage = useMemo(() => {
    if (isTrivia && triviaResult) {
      return (
        triviaResult.tier.shareText ||
        `Fiz o quiz "${quizTitle}" e acertei ${triviaResult.score} de ${triviaResult.total}! Teste seus conhecimentos no Toolnotch:`
      );
    }
    if (personalityResult) {
      return (
        personalityResult.shareText ||
        `Meu resultado no quiz "${quizTitle}" foi: ${personalityResult.title}! Descubra o seu no Toolnotch:`
      );
    }
    return `Confira o quiz "${quizTitle}" no Toolnotch:`;
  }, [isTrivia, triviaResult, personalityResult, quizTitle]);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${shareMessage} ${currentUrl}`,
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareMessage,
    )}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch (e) {
      console.error("Could not copy link", e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: quizTitle,
          text: shareMessage,
          url: currentUrl,
        });
      } catch {
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadCard = () => {
    try {
      setIsGeneratingImage(true);
      const dataUrl = generateStoryCardDataUrl({
        quizTitle,
        isTrivia,
        score: triviaResult?.score,
        total: triviaResult?.total,
        percent: triviaResult?.percent,
        tierLabel: triviaResult?.tier.label,
        resultTitle: personalityResult?.title,
        resultDescription: isTrivia
          ? triviaResult?.tier.description
          : personalityResult?.description,
        traits: personalityResult?.traits,
        labels: {
          resultBadge: labels.resultBadge,
          scoreBadge: labels.scoreBadge,
          hits: labels.hits,
          brandFooter: labels.brandFooter,
        },
      });

      const link = document.createElement("a");
      link.download = `${quizId}-story.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generating card image", err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      <AppCard border hover={false} className="p-7 sm:p-10">
          <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-border/50">
            <span className="text-xs font-bold tracking-wider text-secondary uppercase">
              {isTrivia ? labels.scoreBadge : labels.resultBadge}
            </span>
            <span className="text-[11px] text-label uppercase">
              {quizTitle}
            </span>
          </div>

          {isTrivia && triviaResult && (
            <div className="mb-6">
              <div className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-2">
                {triviaResult.score}{" "}
                <span className="text-xl sm:text-2xl text-label font-normal">
                  / {triviaResult.total}
                </span>
              </div>
              <div className="text-xs text-secondary font-bold uppercase tracking-wider">
                {triviaResult.percent}% {labels.hits} • {triviaResult.tier.label}
              </div>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-foreground">
              {isTrivia && triviaResult
                ? triviaResult.tier.label
                : personalityResult?.title}
            </h2>
            <p className="text-xs sm:text-sm text-label/90 leading-relaxed max-w-3xl">
              {isTrivia && triviaResult
                ? triviaResult.tier.description
                : personalityResult?.description}
            </p>
          </div>

          {!isTrivia &&
            personalityResult?.traits &&
            personalityResult.traits.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {personalityResult.traits.map((trait) => (
                  <span
                    key={trait}
                    className="text-xs font-semibold px-2.5 py-1 rounded-[2px] bg-tertiary/80 border border-border text-secondary"
                  >
                    #{trait}
                  </span>
                ))}
              </div>
            )}

          <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AppButton
                color="secondary"
                small
                onClick={onRetake}
                className="w-full sm:w-auto whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>{labels.retake}</span>
              </AppButton>

              <Link
                href={`/${currentLocale}/quizzes`}
                className="w-full sm:w-auto"
              >
                <AppButton
                  color="primary"
                  withArrow
                  small
                  className="w-full sm:w-auto whitespace-nowrap"
                >
                  {labels.moreQuizzes}
                </AppButton>
              </Link>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="text-xs font-medium px-3 py-2 rounded-[2px] bg-tertiary border border-border/70 text-foreground hover:border-secondary hover:text-secondary transition-colors cursor-pointer"
              >
                {labels.shareWhatsApp}
              </button>

              <button
                type="button"
                onClick={handleShareTwitter}
                className="text-xs font-medium px-3 py-2 rounded-[2px] bg-tertiary border border-border/70 text-foreground hover:border-secondary hover:text-secondary transition-colors cursor-pointer"
              >
                {labels.shareTwitter}
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="text-xs font-medium px-3 py-2 rounded-[2px] bg-tertiary border border-border/70 text-foreground hover:border-secondary hover:text-secondary transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-secondary" />
                    <span>{labels.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-label" />
                    <span>{labels.shareCopy}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadCard}
                disabled={isGeneratingImage}
                className="text-xs font-medium px-3 py-2 rounded-[2px] bg-tertiary border border-border/70 text-foreground hover:border-secondary hover:text-secondary transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {isGeneratingImage ? labels.downloading : labels.downloadCard}
                </span>
              </button>
            </div>
          </div>

          {typeof navigator !== "undefined" && "share" in navigator && (
            <div className="pt-3 sm:hidden">
              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full text-xs font-bold uppercase tracking-wider py-2 rounded-[2px] bg-tertiary/40 border border-border/60 text-label hover:text-foreground transition-colors cursor-pointer"
              >
                {labels.shareNative}
              </button>
            </div>
          )}
        </AppCard>
    </div>
  );
}

export default AppQuizResultScreen;
