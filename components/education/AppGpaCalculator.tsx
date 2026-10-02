"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Plus,
  Trash2,
  Award,
  GraduationCap,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  calculateGpa,
  calculateCumulative,
  getGpaCategory,
  type GradeScale,
  type CourseEntry,
} from "@/lib/gpaMath";
import {
  AppButton,
  AppInput,
  AppSelect,
  AppBadge,
} from "@/components/ui";

interface Props {
  mode: "semester" | "cumulative";
  locale: string;
}

const SCALE_MAX: Record<GradeScale, number> = {
  us4: 4,
  pt20: 20,
  es10: 10,
};

function defaultScale(locale: string): GradeScale {
  if (locale === "pt") return "pt20";
  if (locale === "es") return "es10";
  return "us4";
}

function getSemesterStanding(gpa: number, scale: GradeScale, locale: string) {
  if (scale === "us4") {
    if (gpa >= 3.8) {
      return {
        standing:
          locale === "pt"
            ? "Summa Cum Laude"
            : locale === "es"
              ? "Summa Cum Laude"
              : "Summa Cum Laude",
        badgeBg: "bg-emerald-500/10",
        badgeText: "text-emerald-600 dark:text-emerald-400",
        description:
          locale === "pt"
            ? "Rendimento excepcional! Qualifica para listas de honra (Dean's List) e bolsas competitivas."
            : locale === "es"
              ? "¡Rendimiento excepcional! Califica para listas de honor (Dean's List) y becas."
              : "Outstanding performance! Qualifies for Dean's List and top-tier scholarships.",
      };
    }
    if (gpa >= 3.5) {
      return {
        standing:
          locale === "pt"
            ? "Magna Cum Laude"
            : locale === "es"
              ? "Magna Cum Laude"
              : "Magna Cum Laude",
        badgeBg: "bg-primary/10",
        badgeText: "text-primary",
        description:
          locale === "pt"
            ? "Excelente aproveitamento acadêmico, bem acima da média institucional."
            : locale === "es"
              ? "Excelente rendimiento académico, muy por encima del promedio."
              : "Excellent academic record, well above average for most institutions.",
      };
    }
    if (gpa >= 3.0) {
      return {
        standing:
          locale === "pt"
            ? "Cum Laude"
            : locale === "es"
              ? "Cum Laude"
              : "Cum Laude",
        badgeBg: "bg-primary/10",
        badgeText: "text-primary",
        description:
          locale === "pt"
            ? "Desempenho sólido que atende aos pré-requisitos da maioria das pós-graduações."
            : locale === "es"
              ? "Rendimiento sólido que cumple los requisitos de la mayoría de posgrados."
              : "Solid performance meeting requirements for most graduate programs.",
      };
    }
    if (gpa >= 2.0) {
      return {
        standing:
          locale === "pt"
            ? "Média Regular"
            : locale === "es"
              ? "Promedio Regular"
              : "Satisfactory",
        badgeBg: "bg-amber-500/10",
        badgeText: "text-amber-600 dark:text-amber-400",
        description:
          locale === "pt"
            ? "Atende aos critérios de aprovação, com margem justa para exigências de bolsas."
            : locale === "es"
              ? "Cumple para aprobar, con margen justo para requisitos de becas."
              : "Passing grade, but close to minimum requirements for scholarships.",
      };
    }
    return {
      standing:
        locale === "pt"
          ? "Risco Acadêmico"
          : locale === "es"
            ? "Riesgo Académico"
            : "Academic Warning",
      badgeBg: "bg-rose-500/10",
      badgeText: "text-rose-600 dark:text-rose-400",
      description:
        locale === "pt"
          ? "Média abaixo do mínimo aceitável. Requer recuperação nos próximos períodos."
          : locale === "es"
            ? "Promedio por debajo del mínimo aceptable. Requiere recuperación académica."
            : "GPA below acceptable minimum. Academic recovery plan recommended.",
    };
  }

  if (scale === "pt20") {
    if (gpa >= 18) {
      return {
        standing:
          locale === "pt"
            ? "Excelente (Distinção)"
            : locale === "es"
              ? "Excelente (Distinción)"
              : "Excellent (With Honors)",
        badgeBg: "bg-emerald-500/10",
        badgeText: "text-emerald-600 dark:text-emerald-400",
        description:
          locale === "pt"
            ? "Nível de excelência raro no ensino superior, perfil de topo de turma."
            : locale === "es"
              ? "Nivel de excelencia excepcional en educación superior, cuadro de honor."
              : "Top-tier university achievement, placing you among top graduates.",
      };
    }
    if (gpa >= 16) {
      return {
        standing:
          locale === "pt"
            ? "Muito Bom"
            : locale === "es"
              ? "Muy Bueno"
              : "Very Good",
        badgeBg: "bg-primary/10",
        badgeText: "text-primary",
        description:
          locale === "pt"
            ? "Rendimento muito forte e competitivo para bolsas e candidaturas internacionais."
            : locale === "es"
              ? "Rendimiento muy fuerte y competitivo para becas y programas internacionales."
              : "Strong and highly competitive record for international graduate admissions.",
      };
    }
    if (gpa >= 14) {
      return {
        standing:
          locale === "pt" ? "Bom" : locale === "es" ? "Bueno" : "Good",
        badgeBg: "bg-primary/10",
        badgeText: "text-primary",
        description:
          locale === "pt"
            ? "Média consistente, superando com tranquilidade as exigências de conclusão."
            : locale === "es"
              ? "Promedio consistente, superando con holgura los requisitos de graduación."
              : "Consistent performance comfortably surpassing graduation requirements.",
      };
    }
    if (gpa >= 10) {
      return {
        standing:
          locale === "pt"
            ? "Suficiente"
            : locale === "es"
              ? "Suficiente"
              : "Passing",
        badgeBg: "bg-amber-500/10",
        badgeText: "text-amber-600 dark:text-amber-400",
        description:
          locale === "pt"
            ? "Aprovado na escala de 0 a 20. Oportunidade de elevar notas para estágios competitivos."
            : locale === "es"
              ? "Aprobado en escala de 0 a 20. Oportunidad de mejora para pasantías y posgrados."
              : "Passing on the 0-20 scale. Opportunity to raise grades for competitive roles.",
      };
    }
    return {
      standing:
        locale === "pt"
          ? "Reprovado"
          : locale === "es"
            ? "Reprobado"
            : "Failing",
      badgeBg: "bg-rose-500/10",
      badgeText: "text-rose-600 dark:text-rose-400",
      description:
        locale === "pt"
          ? "Média abaixo do limiar de aprovação (mínimo 10 valores)."
          : locale === "es"
            ? "Promedio por debajo del umbral de aprobación (mínimo 10)."
            : "Grade below passing threshold (minimum 10 points).",
    };
  }

  // es10
  if (gpa >= 9) {
    return {
      standing:
        locale === "pt"
          ? "Sobresaliente"
          : locale === "es"
            ? "Sobresaliente"
            : "Outstanding",
      badgeBg: "bg-emerald-500/10",
      badgeText: "text-emerald-600 dark:text-emerald-400",
      description:
        locale === "pt"
          ? "Desempenho no estrato mais alto da escala 0 a 10."
          : locale === "es"
            ? "Rendimiento en el estrato superior de la escala 0 a 10."
            : "Highest tier performance on the 0-10 grading scale.",
    };
  }
  if (gpa >= 7) {
    return {
      standing:
        locale === "pt" ? "Notable" : locale === "es" ? "Notable" : "Notable",
      badgeBg: "bg-primary/10",
      badgeText: "text-primary",
      description:
        locale === "pt"
          ? "Excelente aproveitamento acadêmico e perfil competitivo."
          : locale === "es"
            ? "Excelente aprovechamiento académico y perfil muy competitivo."
            : "Strong academic record and competitive graduate profile.",
    };
  }
  if (gpa >= 5) {
    return {
      standing:
        locale === "pt" ? "Aprovado" : locale === "es" ? "Aprobado" : "Passed",
      badgeBg: "bg-amber-500/10",
      badgeText: "text-amber-600 dark:text-amber-400",
      description:
        locale === "pt"
          ? "Atinge os critérios mínimos para aprovação nas disciplinas."
          : locale === "es"
            ? "Alcanza los criterios mínimos de aprobación de asignaturas."
            : "Meets minimum passing requirements across subjects.",
    };
  }
  return {
    standing:
      locale === "pt" ? "Suspenso" : locale === "es" ? "Suspenso" : "Failing",
    badgeBg: "bg-rose-500/10",
    badgeText: "text-rose-600 dark:text-rose-400",
    description:
      locale === "pt"
        ? "Média abaixo do mínimo necessário para aprovação (mínimo 5.0)."
        : locale === "es"
          ? "Promedio inferior al mínimo de aprobación (mínimo 5.0)."
          : "Grade below the minimum passing bar (5.0 minimum).",
  };
}

export default function AppGpaCalculator({ mode, locale }: Props) {
  const t = useTranslations("gpaCalculator");

  const [scale, setScale] = useState<GradeScale>(() => defaultScale(locale));

  const [courses, setCourses] = useState<(CourseEntry & { id: number })[]>([
    { id: 1, grade: 0, credits: 1 },
  ]);
  const [nextId, setNextId] = useState(2);

  const [currentGpa, setCurrentGpa] = useState("");
  const [currentCredits, setCurrentCredits] = useState("");
  const [newGpa, setNewGpa] = useState("");
  const [newCredits, setNewCredits] = useState("");

  function handleScaleChange(next: GradeScale) {
    setScale(next);
    setCourses([{ id: 1, grade: 0, credits: 1 }]);
    setNextId(2);
  }

  function addCourse() {
    if (courses.length >= 20) return;
    setCourses((prev) => [...prev, { id: nextId, grade: 0, credits: 1 }]);
    setNextId((n) => n + 1);
  }

  function removeCourse(id: number) {
    if (courses.length <= 1) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  function updateCourse(id: number, field: "grade" | "credits", raw: string) {
    const value = parseFloat(raw);
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, [field]: isNaN(value) ? 0 : value } : c,
      ),
    );
  }

  function resetCalculator() {
    if (mode === "semester") {
      setCourses([{ id: 1, grade: 0, credits: 1 }]);
      setNextId(2);
    } else {
      setCurrentGpa("");
      setCurrentCredits("");
      setNewGpa("");
      setNewCredits("");
    }
  }

  const semesterResult = calculateGpa(courses, scale);
  const semesterCategory =
    semesterResult.totalCredits > 0
      ? getGpaCategory(semesterResult.gpa, scale)
      : null;

  const cGpa = parseFloat(currentGpa);
  const cCred = parseFloat(currentCredits);
  const nGpa = parseFloat(newGpa);
  const nCred = parseFloat(newCredits);
  const cumulativeReady =
    !isNaN(cGpa) &&
    !isNaN(cCred) &&
    !isNaN(nGpa) &&
    !isNaN(nCred) &&
    cCred >= 0 &&
    nCred >= 0;
  const cumulativeGpa = cumulativeReady
    ? calculateCumulative(cGpa, cCred, nGpa, nCred)
    : null;
  const cumulativeCategory =
    cumulativeGpa !== null ? getGpaCategory(cumulativeGpa, scale) : null;
  const delta =
    cumulativeGpa !== null && !isNaN(cGpa) ? cumulativeGpa - cGpa : 0;

  const maxGrade = SCALE_MAX[scale];

  const scaleOptions = [
    { value: "us4", label: t("scaleUs4") },
    { value: "pt20", label: t("scalePt20") },
    { value: "es10", label: t("scaleEs10") },
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/70">
        <div className="w-full sm:w-72">
          <AppSelect
            id="gpa-scale-select"
            label={t("gradeScale")}
            options={scaleOptions}
            value={scale}
            onChange={(val) => handleScaleChange(val as GradeScale)}
            className="font-mono text-xs sm:text-sm"
          />
        </div>

        <AppButton
          color="tertiary"
          small
          onClick={resetCalculator}
          className="self-end sm:self-auto text-xs font-mono"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          iconPosition="left"
        >
          {locale === "pt" ? "Limpar" : locale === "es" ? "Limpiar" : "Reset"}
        </AppButton>
      </div>

      {mode === "semester" ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 px-2 text-xs font-mono font-semibold uppercase text-label tracking-wider select-none">
            <span className="w-7 text-center shrink-0">#</span>
            <label htmlFor={`course-grade-${courses[0]?.id ?? 1}`} className="flex-1 cursor-default">
              {t("grade")}
            </label>
            <label htmlFor={`course-credits-${courses[0]?.id ?? 1}`} className="w-24 sm:w-32 cursor-default">
              {locale === "en" ? t("credits") : "Crédito"}
            </label>
            <span className="w-8 shrink-0" />
          </div>

          <div className="space-y-2.5">
            {courses.map((course, idx) => (
              <div
                key={course.id}
                className="flex items-center gap-2 sm:gap-3 p-2 bg-tertiary border border-border rounded-[2px]"
              >
                <span className="text-xs font-mono font-semibold text-label w-7 text-center shrink-0">
                  {String(idx + 1).padStart(2, "0")}
                </span>

                <div className="flex-1">
                  <AppInput
                    id={`course-grade-${course.id}`}
                    type="number"
                    min="0"
                    max={String(maxGrade)}
                    step={scale === "us4" ? "0.01" : "0.5"}
                    value={course.grade === 0 ? "" : String(course.grade)}
                    onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                    placeholder={`${t("grade")} (0–${maxGrade})`}
                    aria-label={t("grade")}
                    className="font-mono text-xs sm:text-sm h-10"
                  />
                </div>

                <div className="w-24 sm:w-32">
                  <AppInput
                    id={`course-credits-${course.id}`}
                    type="number"
                    min="1"
                    max="30"
                    step="1"
                    value={course.credits === 0 ? "" : String(course.credits)}
                    onChange={(e) => updateCourse(course.id, "credits", e.target.value)}
                    placeholder={t("credits")}
                    aria-label={locale === "en" ? t("credits") : "Crédito"}
                    className="font-mono text-xs sm:text-sm h-10"
                  />
                </div>

                {courses.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeCourse(course.id)}
                    aria-label={t("removeCourse")}
                    title={t("removeCourse")}
                    className="p-2 text-label hover:text-red-500 rounded-[2px] transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-8 shrink-0" />
                )}
              </div>
            ))}
          </div>

          {courses.length < 20 && (
            <div className="pt-1">
              <AppButton
                type="button"
                color="primary"
                small
                onClick={addCourse}
                className="w-full sm:w-auto font-mono text-xs font-semibold"
                icon={<Plus className="w-3.5 h-3.5" />}
                iconPosition="left"
              >
                {t("addCourse")}
              </AppButton>
            </div>
          )}

          {semesterResult.totalCredits > 0 && courses.some((c) => c.grade > 0) && (
            <div className="mt-6 pt-5 border-t border-border/80">
              <div className="p-4 sm:p-5 bg-tertiary border border-border rounded-[2px] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="block text-xs font-mono font-semibold uppercase text-label tracking-wide mb-1">
                      {t("yourGpa")}
                    </span>
                    <div className="flex items-baseline gap-2.5 flex-wrap">
                      <span className="text-3xl sm:text-4xl font-mono font-bold text-primary tracking-tight">
                        {semesterResult.gpa.toFixed(2)}
                      </span>
                      {semesterCategory && (
                        <AppBadge bg="bg-primary/10" text="text-primary" icon={<Award className="w-3 h-3" />}>
                          {semesterCategory}
                        </AppBadge>
                      )}
                      <AppBadge
                        bg={getSemesterStanding(semesterResult.gpa, scale, locale).badgeBg}
                        text={getSemesterStanding(semesterResult.gpa, scale, locale).badgeText}
                      >
                        {getSemesterStanding(semesterResult.gpa, scale, locale).standing}
                      </AppBadge>
                    </div>
                  </div>

                  <div className="sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50 text-xs font-mono text-label">
                    <span className="block text-xs font-mono font-semibold uppercase text-label tracking-wide mb-0.5">
                      {t("totalCredits")}
                    </span>
                    <span className="text-xl sm:text-2xl font-mono font-bold text-foreground">
                      {semesterResult.totalCredits}
                    </span>
                  </div>
                </div>

                {/* Progress bar across scale */}
                <div className="space-y-1.5 pt-3 border-t border-border/60">
                  <div className="flex items-center justify-between text-xs font-mono text-label">
                    <span>
                      {locale === "pt"
                        ? "Aproveitamento na Escala"
                        : locale === "es"
                          ? "Aprovechamiento en Escala"
                          : "Scale Performance"}
                    </span>
                    <span className="font-semibold text-foreground font-mono">
                      {((semesterResult.gpa / maxGrade) * 100).toFixed(1)}% ({semesterResult.gpa.toFixed(2)} / {maxGrade})
                    </span>
                  </div>

                  <div className="relative w-full h-3 bg-background border border-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.max(0, (semesterResult.gpa / maxGrade) * 100))}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-label pt-0.5">
                    <span>0</span>
                    <span>{scale === "us4" ? "2.0 (C)" : scale === "pt20" ? "10 (Suficiente)" : "5 (Aprobado)"}</span>
                    <span>{scale === "us4" ? "3.0 (B)" : scale === "pt20" ? "14 (Bom)" : "7 (Notable)"}</span>
                    <span className="font-semibold text-foreground">
                      {maxGrade} {scale === "us4" ? "(A)" : scale === "pt20" ? "(Excelente)" : "(Sobresaliente)"}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-mono text-label pt-1 leading-relaxed border-t border-border/40">
                  {getSemesterStanding(semesterResult.gpa, scale, locale).description}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <AppInput
              id="current-gpa"
              label={t("currentGpa")}
              type="number"
              min="0"
              max={String(maxGrade)}
              step="0.01"
              value={currentGpa}
              onChange={(e) => setCurrentGpa(e.target.value)}
              placeholder={`0–${maxGrade}`}
              className="font-mono text-xs sm:text-sm h-11"
            />

            <AppInput
              id="completed-credits"
              label={t("completedCredits")}
              type="number"
              min="0"
              step="1"
              value={currentCredits}
              onChange={(e) => setCurrentCredits(e.target.value)}
              placeholder="0"
              className="font-mono text-xs sm:text-sm h-11"
            />

            <AppInput
              id="new-semester-gpa"
              label={t("newSemesterGpa")}
              type="number"
              min="0"
              max={String(maxGrade)}
              step="0.01"
              value={newGpa}
              onChange={(e) => setNewGpa(e.target.value)}
              placeholder={`0–${maxGrade}`}
              className="font-mono text-xs sm:text-sm h-11"
            />

            <AppInput
              id="new-semester-credits"
              label={t("newSemesterCredits")}
              type="number"
              min="0"
              step="1"
              value={newCredits}
              onChange={(e) => setNewCredits(e.target.value)}
              placeholder="0"
              className="font-mono text-xs sm:text-sm h-11"
            />
          </div>

          {cumulativeGpa !== null && (
            <div className="pt-2 border-t border-border/80">
              <div className="p-4 sm:p-5 bg-tertiary border border-border rounded-[2px] space-y-4">
                {/* Comparativo Visual Lado a Lado: 3 cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-background border border-border rounded-[2px] space-y-1">
                    <span className="block text-[11px] font-mono font-semibold uppercase text-label tracking-wider">
                      {locale === "pt"
                        ? "GPA Anterior"
                        : locale === "es"
                          ? "GPA Anterior"
                          : "Previous GPA"}
                    </span>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-foreground">
                      {cGpa.toFixed(2)}
                    </div>
                    <span className="block text-xs font-mono text-label">
                      {cCred} {t("credits")}
                    </span>
                  </div>

                  <div className="p-3 bg-background border border-border rounded-[2px] space-y-1">
                    <span className="block text-[11px] font-mono font-semibold uppercase text-label tracking-wider">
                      {locale === "pt"
                        ? "Novo Semestre"
                        : locale === "es"
                          ? "Nuevo Semestre"
                          : "New Semester"}
                    </span>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-foreground">
                      {nGpa.toFixed(2)}
                    </div>
                    <span className="block text-xs font-mono text-label">
                      {nCred} {t("credits")}
                    </span>
                  </div>

                  <div className="p-3 bg-primary/5 border border-primary/40 rounded-[2px] space-y-1">
                    <span className="block text-[11px] font-mono font-semibold uppercase text-primary tracking-wider">
                      {t("newCumulativeGpa")}
                    </span>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-2xl sm:text-3xl font-mono font-bold text-primary">
                        {cumulativeGpa.toFixed(2)}
                      </span>
                      {cumulativeCategory && (
                        <AppBadge
                          bg="bg-primary/10"
                          text="text-primary"
                          icon={<GraduationCap className="w-3 h-3" />}
                        >
                          {cumulativeCategory}
                        </AppBadge>
                      )}
                    </div>
                    <span className="block text-xs font-mono text-label">
                      {cCred + nCred} {t("credits")}{" "}
                      {locale === "pt"
                        ? "totais"
                        : locale === "es"
                          ? "totales"
                          : "total"}
                    </span>
                  </div>
                </div>

                {/* Variação / Delta e Impacto */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/60">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-label uppercase font-semibold">
                      {locale === "pt"
                        ? "Impacto na Média:"
                        : locale === "es"
                          ? "Impacto en Promedio:"
                          : "Cumulative Impact:"}
                    </span>
                    {delta > 0.001 ? (
                      <AppBadge
                        bg="bg-emerald-500/10"
                        text="text-emerald-600 dark:text-emerald-400"
                        icon={<TrendingUp className="w-3.5 h-3.5" />}
                      >
                        +{delta.toFixed(2)} pts{" "}
                        {cGpa > 0
                          ? `(+${((delta / cGpa) * 100).toFixed(1)}%)`
                          : ""}
                      </AppBadge>
                    ) : delta < -0.001 ? (
                      <AppBadge
                        bg="bg-amber-500/10"
                        text="text-amber-600 dark:text-amber-400"
                        icon={<TrendingDown className="w-3.5 h-3.5" />}
                      >
                        {delta.toFixed(2)} pts{" "}
                        {cGpa > 0
                          ? `(${((delta / cGpa) * 100).toFixed(1)}%)`
                          : ""}
                      </AppBadge>
                    ) : (
                      <AppBadge
                        bg="bg-tertiary"
                        text="text-foreground"
                        icon={<Minus className="w-3.5 h-3.5" />}
                      >
                        0.00 pts (
                        {locale === "pt"
                          ? "Estável"
                          : locale === "es"
                            ? "Estable"
                            : "Stable"}
                        )
                      </AppBadge>
                    )}
                  </div>

                  <span className="text-xs font-mono text-label">
                    {delta > 0.001
                      ? locale === "pt"
                        ? "O novo semestre elevou sua média acumulada."
                        : locale === "es"
                          ? "¡El nuevo semestre aumentó tu promedio acumulado!"
                          : "The new semester increased your cumulative GPA!"
                      : delta < -0.001
                        ? locale === "pt"
                          ? "O novo semestre reduziu sua média acumulada."
                          : locale === "es"
                            ? "El nuevo semestre redujo tu promedio acumulado."
                            : "The new semester reduced your cumulative GPA."
                        : locale === "pt"
                          ? "Sua média acumulada permaneceu estável."
                          : locale === "es"
                            ? "Tu promedio acumulado se mantuvo en el mismo nivel."
                            : "Your cumulative GPA remained unchanged."}
                  </span>
                </div>

                {/* Progress bar across scale */}
                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  <div className="flex items-center justify-between text-xs font-mono text-label">
                    <span>
                      {locale === "pt"
                        ? `Aproveitamento Acumulado: ${(
                            (cumulativeGpa / maxGrade) *
                            100
                          ).toFixed(1)}%`
                        : locale === "es"
                          ? `Aprovechamiento Acumulado: ${(
                              (cumulativeGpa / maxGrade) *
                              100
                            ).toFixed(1)}%`
                          : `Cumulative Standing: ${(
                              (cumulativeGpa / maxGrade) *
                              100
                            ).toFixed(1)}%`}
                    </span>
                    <span className="font-semibold text-foreground font-mono">
                      {cumulativeGpa.toFixed(2)} / {maxGrade}
                    </span>
                  </div>

                  <div className="relative w-full h-3 bg-background border border-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, (cumulativeGpa / maxGrade) * 100),
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
