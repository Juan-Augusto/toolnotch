"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, AlertTriangle, RotateCcw, Target } from "lucide-react";
import { calculateGradeNeeded } from "@/lib/gpaMath";
import { AppButton, AppInput, AppBadge } from "@/components/ui";

interface Props {
  locale?: string;
}

export default function AppGradeCalculator({ locale = "pt" }: Props) {
  const t = useTranslations("gpaCalculator");

  const [currentGrade, setCurrentGrade] = useState("");
  const [earnedWeight, setEarnedWeight] = useState("");
  const [targetGrade, setTargetGrade] = useState("");

  const cg = parseFloat(currentGrade);
  const ew = parseFloat(earnedWeight);
  const tg = parseFloat(targetGrade);

  const ready =
    !isNaN(cg) && !isNaN(ew) && !isNaN(tg) && ew >= 0 && ew <= 100;

  let needed: number | null = null;
  let status: "normal" | "impossible" | "achieved" = "normal";

  if (ready) {
    const result = calculateGradeNeeded(cg, ew, tg);
    if (isNaN(result) || result > 100) {
      status = "impossible";
    } else if (result <= 0) {
      status = "achieved";
    } else {
      needed = result;
      status = "normal";
    }
  }

  const currentPoints = ready ? Math.round(((cg * ew) / 100) * 10) / 10 : 0;
  const remainingWeight = ready ? 100 - ew : 0;
  const maxPossiblePoints = ready
    ? Math.round((currentPoints + remainingWeight) * 10) / 10
    : 0;
  const neededPoints =
    ready && tg > currentPoints
      ? Math.round((tg - currentPoints) * 10) / 10
      : 0;
  const progressPercent =
    ready && tg > 0
      ? Math.min(100, Math.max(0, Math.round((currentPoints / tg) * 100)))
      : 0;

  function getFeasibilityInfo(n: number) {
    if (n <= 50) {
      return {
        label:
          locale === "pt"
            ? "Cenário Confortável"
            : locale === "es"
              ? "Meta Accesible"
              : "Comfortable Goal",
        badgeBg: "bg-emerald-500/10",
        badgeText: "text-emerald-600 dark:text-emerald-400",
        message:
          locale === "pt"
            ? "Você tem uma boa margem de segurança. Com uma nota regular na prova final você alcançará o objetivo."
            : locale === "es"
              ? "Tienes un buen margen de seguridad. Con una nota regular en el examen final alcanzarás el objetivo."
              : "You have a solid safety margin. A standard grade on the final exam secures your goal.",
      };
    }
    if (n <= 75) {
      return {
        label:
          locale === "pt"
            ? "Cenário Moderado"
            : locale === "es"
              ? "Meta Moderada"
              : "Moderate Goal",
        badgeBg: "bg-primary/10",
        badgeText: "text-primary",
        message:
          locale === "pt"
            ? "Meta equilibrada e plenamente atingível com estudo dedicado para o exame final."
            : locale === "es"
              ? "Meta equilibrada y totalmente alcanzable con estudio dedicado para el examen final."
              : "Balanced goal and fully achievable with dedicated study for the final exam.",
      };
    }
    if (n <= 90) {
      return {
        label:
          locale === "pt"
            ? "Cenário Exigente"
            : locale === "es"
              ? "Meta Exigente"
              : "Challenging Goal",
        badgeBg: "bg-amber-500/10",
        badgeText: "text-amber-600 dark:text-amber-400",
        message:
          locale === "pt"
            ? "Exige alto desempenho no exame final. Recomendamos foco prioritário nos conteúdos com maior peso."
            : locale === "es"
              ? "Requiere alto rendimiento en el examen final. Se recomienda estudio enfocado en los temas clave."
              : "Requires strong performance on the final. Focus on the highest-yield topics.",
      };
    }
    return {
      label:
        locale === "pt"
          ? "Cenário Crítico"
          : locale === "es"
            ? "Meta Crítica"
            : "High Stakes Goal",
      badgeBg: "bg-rose-500/10",
      badgeText: "text-rose-600 dark:text-rose-400",
      message:
        locale === "pt"
          ? "Quase todo o potencial do exame é necessário. Margem mínima para erros."
          : locale === "es"
            ? "Casi todo el potencial del examen es requerido. Margen mínimo para errores."
            : "Nearly full points needed on the final exam. Narrow margin for error.",
    };
  }

  function handleReset() {
    setCurrentGrade("");
    setEarnedWeight("");
    setTargetGrade("");
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs font-mono font-semibold uppercase text-label tracking-wider">
            {locale === "pt"
              ? "Cálculo de Nota Final"
              : locale === "es"
                ? "Cálculo de Nota Final"
                : "Final Exam Goal"}
          </span>
        </div>

        <AppButton
          color="tertiary"
          small
          onClick={handleReset}
          className="text-xs font-mono"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          iconPosition="left"
        >
          {locale === "pt" ? "Limpar" : locale === "es" ? "Limpiar" : "Reset"}
        </AppButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <AppInput
          id="current-grade"
          label={t("currentGrade")}
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={currentGrade}
          onChange={(e) => setCurrentGrade(e.target.value)}
          placeholder="0–100"
          className="font-mono text-xs sm:text-sm h-11"
        />

        <AppInput
          id="earned-weight"
          label={t("earnedWeight")}
          type="number"
          min="0"
          max="100"
          step="1"
          value={earnedWeight}
          onChange={(e) => setEarnedWeight(e.target.value)}
          placeholder="0–100 %"
          className="font-mono text-xs sm:text-sm h-11"
        />

        <AppInput
          id="target-grade"
          label={t("targetGrade")}
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={targetGrade}
          onChange={(e) => setTargetGrade(e.target.value)}
          placeholder="0–100"
          className="font-mono text-xs sm:text-sm h-11"
        />
      </div>

      {ready && (
        <div className="mt-6 pt-5 border-t border-border/80">
          <div className="p-4 sm:p-5 bg-tertiary border border-border rounded-[2px] space-y-4">
            {status === "impossible" ? (
              <div className="space-y-4">
                <div className="flex items-start sm:items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="block text-xs font-mono font-semibold uppercase text-amber-600 dark:text-amber-400">
                        {t("impossible")}
                      </span>
                      <AppBadge
                        bg="bg-rose-500/10"
                        text="text-rose-600 dark:text-rose-400"
                      >
                        {locale === "pt"
                          ? "Meta Inalcançável"
                          : locale === "es"
                            ? "Inalcanzable"
                            : "Unattainable"}
                      </AppBadge>
                    </div>
                    <p className="text-xs sm:text-sm font-mono text-label">
                      {locale === "pt"
                        ? `A pontuação necessária ultrapassa 100% da prova final. Mesmo gabaritando os ${remainingWeight}% restantes, sua nota máxima possível será de ${maxPossiblePoints}%, abaixo da meta de ${tg}%.`
                        : locale === "es"
                          ? `La calificación requerida excede el 100% del examen final. Incluso con 100% en el ${remainingWeight}% restante, tu nota máxima posible será de ${maxPossiblePoints}%, inferior a la meta de ${tg}%.`
                          : `The required score exceeds 100% on the final. Even with 100% on the remaining ${remainingWeight}%, your max achievable grade is ${maxPossiblePoints}%, below your ${tg}% goal.`}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  <div className="flex items-center justify-between text-xs font-mono text-label">
                    <span>
                      {locale === "pt"
                        ? "Teto máximo atingível"
                        : locale === "es"
                          ? "Máximo posible"
                          : "Max achievable"}
                    </span>
                    <span className="font-semibold text-rose-500 font-mono">
                      {maxPossiblePoints}% / {tg}%{" "}
                      {locale === "pt"
                        ? "meta"
                        : locale === "es"
                          ? "meta"
                          : "goal"}
                    </span>
                  </div>
                  <div className="relative w-full h-3 bg-background border border-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500/70 rounded-full"
                      style={{
                        width: `${Math.min(100, maxPossiblePoints)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : status === "achieved" ? (
              <div className="space-y-4">
                <div className="flex items-start sm:items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5 sm:mt-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="block text-xs font-mono font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                        {t("alreadyAchieved")}
                      </span>
                      <AppBadge
                        bg="bg-emerald-500/10"
                        text="text-emerald-600 dark:text-emerald-400"
                      >
                        {locale === "pt"
                          ? "Aprovado com Folga"
                          : locale === "es"
                            ? "Aprobado Asegurado"
                            : "Goal Secured"}
                      </AppBadge>
                    </div>
                    <p className="text-xs sm:text-sm font-mono text-label">
                      {locale === "pt"
                        ? `Parabéns! Suas notas atuais já somam ${currentPoints} pontos ponderados, superando a meta de ${tg}% antes mesmo da avaliação final.`
                        : locale === "es"
                          ? `¡Felicitaciones! Tus notas actuales ya suman ${currentPoints} puntos ponderados, superando el objetivo de ${tg}% antes del examen final.`
                          : `Congratulations! Your current grade already provides ${currentPoints} weighted points, surpassing your ${tg}% goal without needing the final exam.`}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  <div className="flex items-center justify-between text-xs font-mono text-label">
                    <span>
                      {locale === "pt"
                        ? "Meta conquistada"
                        : locale === "es"
                          ? "Meta alcanzada"
                          : "Goal secured"}
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                      {currentPoints}% ({progressPercent}%)
                    </span>
                  </div>
                  <div className="relative w-full h-3 bg-background border border-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="block text-xs font-mono font-semibold uppercase text-label tracking-wide mb-1">
                      {t("gradeNeeded")}
                    </span>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-3xl sm:text-4xl font-mono font-bold text-primary tracking-tight">
                        {needed?.toFixed(1)}%
                      </span>
                      <AppBadge bg="bg-primary/10" text="text-primary">
                        {locale === "pt"
                          ? "Exame Final"
                          : locale === "es"
                            ? "Examen Final"
                            : "Final Exam"}
                      </AppBadge>
                      {needed !== null && (
                        <AppBadge
                          bg={getFeasibilityInfo(needed).badgeBg}
                          text={getFeasibilityInfo(needed).badgeText}
                        >
                          {getFeasibilityInfo(needed).label}
                        </AppBadge>
                      )}
                    </div>
                  </div>

                  <div className="sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50 text-xs font-mono text-label">
                    <span>
                      {remainingWeight}%{" "}
                      {locale === "pt"
                        ? "peso restante"
                        : locale === "es"
                          ? "peso restante"
                          : "weight remaining"}
                    </span>
                  </div>
                </div>

                {/* Progress bar of goal */}
                <div className="space-y-2 pt-3 border-t border-border/60">
                  <div className="flex items-center justify-between text-xs font-mono text-label">
                    <span>
                      {locale === "pt"
                        ? `Progresso da Meta: ${progressPercent}% já garantido`
                        : locale === "es"
                          ? `Progreso de la Meta: ${progressPercent}% asegurado`
                          : `Goal Progress: ${progressPercent}% secured`}
                    </span>
                    <span className="font-semibold text-foreground font-mono">
                      {currentPoints.toFixed(1)} / {tg.toFixed(1)} pts
                    </span>
                  </div>

                  <div className="relative w-full h-3 bg-background border border-border rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-primary transition-all duration-300 rounded-l-full"
                      style={{
                        width: `${Math.min(100, (currentPoints / 100) * 100)}%`,
                      }}
                      title={`Pontos garantidos: ${currentPoints}`}
                    />
                    <div
                      className="h-full bg-secondary/80 transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100 - (currentPoints / 100) * 100,
                          (neededPoints / 100) * 100,
                        )}%`,
                      }}
                      title={`Pontos necessários: ${neededPoints}`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-label pt-0.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                      {currentPoints.toFixed(1)} pts{" "}
                      {locale === "pt"
                        ? "garantidos"
                        : locale === "es"
                          ? "asegurados"
                          : "earned"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
                      {neededPoints.toFixed(1)} pts{" "}
                      {locale === "pt"
                        ? "no exame"
                        : locale === "es"
                          ? "en examen"
                          : "on final"}
                    </span>
                    <span className="font-semibold text-foreground">
                      {tg}%{" "}
                      {locale === "pt"
                        ? "meta total"
                        : locale === "es"
                          ? "meta total"
                          : "goal"}
                    </span>
                  </div>
                </div>

                {needed !== null && (
                  <p className="text-xs font-mono text-label pt-1 leading-relaxed border-t border-border/40">
                    {getFeasibilityInfo(needed).message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
