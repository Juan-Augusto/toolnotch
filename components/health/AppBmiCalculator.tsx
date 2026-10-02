"use client";

import { useState, useId } from "react";
import { useTranslations } from "next-intl";
import {
  RotateCcw,
  Scale,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import {
  calculateBmi,
  lbsToKg,
  kgToLbs,
  feetInchesToCm,
  cmToFeetInches,
  type BmiResult,
  type UnitSystem,
  type Sex,
} from "@/lib/healthMath";
import {
  AppButton,
  AppInput,
  AppSelect,
  AppBadge,
  AppSegmentedControl,
} from "@/components/ui";

interface Props {
  locale: string;
}

const CATEGORY_STYLES: Record<
  BmiResult["category"],
  {
    badgeBg: string;
    badgeText: string;
    text: string;
    bar: string;
  }
> = {
  underweight: {
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-600 dark:text-blue-400",
    text: "text-blue-600 dark:text-blue-400",
    bar: "bg-blue-500",
  },
  normal: {
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
  },
  overweight: {
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-600 dark:text-amber-400",
    text: "text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
  },
  obese: {
    badgeBg: "bg-rose-500/10",
    badgeText: "text-rose-600 dark:text-rose-400",
    text: "text-rose-600 dark:text-rose-400",
    bar: "bg-rose-500",
  },
};

function bmiToPercent(bmi: number): number {
  let val: number;
  if (bmi <= 15) {
    val = 2;
  } else if (bmi >= 40) {
    val = 98;
  } else if (bmi < 18.5) {
    val = Math.max(2, ((bmi - 15) / (18.5 - 15)) * 25);
  } else if (bmi < 25) {
    val = 25 + ((bmi - 18.5) / (25 - 18.5)) * 25;
  } else if (bmi < 30) {
    val = 50 + ((bmi - 25) / (30 - 25)) * 25;
  } else {
    val = Math.min(98, 75 + ((bmi - 30) / (40 - 30)) * 25);
  }
  return parseFloat(val.toFixed(2));
}

export default function AppBmiCalculator({ locale }: Props) {
  const t = useTranslations("healthCalculator");
  const baseId = useId();

  const defaultUnit: UnitSystem = locale === "en" ? "imperial" : "metric";
  const [unit, setUnit] = useState<UnitSystem>(defaultUnit);
  const [sex, setSex] = useState<Sex>("female");

  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");

  const [weightLbs, setWeightLbs] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  const currentValues = (() => {
    let wKg = 0;
    let hCm = 0;

    if (unit === "metric") {
      wKg = parseFloat(weightKg);
      hCm = parseFloat(heightCm);
    } else {
      wKg = lbsToKg(parseFloat(weightLbs));
      hCm = feetInchesToCm(
        parseFloat(heightFt) || 0,
        parseFloat(heightIn) || 0
      );
    }

    const isValid =
      wKg > 0 && hCm > 0 && Number.isFinite(wKg) && Number.isFinite(hCm);

    const result: BmiResult | null = isValid ? calculateBmi(wKg, hCm) : null;

    let minIdealWeight = 0;
    let maxIdealWeight = 0;
    if (hCm > 0) {
      const hM = hCm / 100;
      const minKg = 18.5 * hM * hM;
      const maxKg = 24.9 * hM * hM;

      if (unit === "metric") {
        minIdealWeight = parseFloat(minKg.toFixed(1));
        maxIdealWeight = parseFloat(maxKg.toFixed(1));
      } else {
        minIdealWeight = parseFloat(kgToLbs(minKg).toFixed(1));
        maxIdealWeight = parseFloat(kgToLbs(maxKg).toFixed(1));
      }
    }

    return {
      wKg,
      hCm,
      result,
      minIdealWeight,
      maxIdealWeight,
    };
  })();

  const { result, minIdealWeight, maxIdealWeight } = currentValues;

  function handleUnitChange(newUnit: UnitSystem) {
    if (newUnit === unit) return;

    if (newUnit === "imperial") {
      const kg = parseFloat(weightKg);
      const cm = parseFloat(heightCm);
      if (!isNaN(kg)) setWeightLbs(String(kgToLbs(kg)));
      if (!isNaN(cm)) {
        const { feet, inches } = cmToFeetInches(cm);
        setHeightFt(String(feet));
        setHeightIn(String(inches));
      }
    } else {
      const lbs = parseFloat(weightLbs);
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      if (!isNaN(lbs)) setWeightKg(String(lbsToKg(lbs)));
      if (ft > 0 || inches > 0) {
        setHeightCm(String(feetInchesToCm(ft, inches)));
      }
    }
    setUnit(newUnit);
  }

  function handleReset() {
    setWeightKg("");
    setHeightCm("");
    setWeightLbs("");
    setHeightFt("");
    setHeightIn("");
    setSex("female");
  }

  const sexOptions = [
    { label: t("female"), value: "female" },
    { label: t("male"), value: "male" },
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="w-full sm:w-auto sm:min-w-[340px]">
          <AppSegmentedControl<UnitSystem>
            options={[
              { label: t("metric"), value: "metric" },
              { label: t("imperial"), value: "imperial" },
            ]}
            value={unit}
            onChange={handleUnitChange}
            size="sm"
            color="secondary"
            fontWeight="medium"
            withDashedBorder={false}
            buttonClassName="normal-case text-xs sm:text-sm whitespace-nowrap px-3"
          />
        </div>

        <AppButton
          color="tertiary"
          small
          onClick={handleReset}
          className="self-end sm:self-auto text-xs font-mono"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          iconPosition="left"
        >
          {t("reset")}
        </AppButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-4">
            <div className="pb-1">
              <h2 className="text-sm font-mono uppercase tracking-wider font-semibold text-foreground flex items-center gap-2">
                <Scale className="w-4 h-4 text-primary" />
                <span>
                  {locale === "pt"
                    ? "Dados Corporais"
                    : locale === "es"
                      ? "Datos Corporales"
                      : "Body Measurements"}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AppSelect
                id={`${baseId}-sex`}
                label={t("sex")}
                options={sexOptions}
                value={sex}
                onChange={(val) => setSex(val as Sex)}
                className="font-mono text-sm h-11"
              />

              {unit === "metric" ? (
                <AppInput
                  id={`${baseId}-weight-kg`}
                  label={`${t("weight")} (kg)`}
                  type="number"
                  inputMode="decimal"
                  min="1"
                  step="0.1"
                  placeholder="70"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="font-mono text-sm h-11"
                />
              ) : (
                <AppInput
                  id={`${baseId}-weight-lbs`}
                  label={`${t("weight")} (lbs)`}
                  type="number"
                  inputMode="decimal"
                  min="1"
                  step="0.1"
                  placeholder="154"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                  className="font-mono text-sm h-11"
                />
              )}
            </div>

            {unit === "metric" ? (
              <div>
                <AppInput
                  id={`${baseId}-height-cm`}
                  label={`${t("height")} (cm)`}
                  type="number"
                  inputMode="decimal"
                  min="1"
                  step="0.1"
                  placeholder="175"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="font-mono text-sm h-11"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <AppInput
                  id={`${baseId}-height-ft`}
                  label={`${t("height")} (${t("feet")})`}
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="8"
                  placeholder="5"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                  className="font-mono text-sm h-11"
                />
                <AppInput
                  id={`${baseId}-height-in`}
                  label={`${t("height")} (${t("inches")})`}
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="11"
                  placeholder="9"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                  className="font-mono text-sm h-11"
                />
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm font-mono text-label leading-relaxed pt-2">
            <span className="font-semibold text-foreground">
              {locale === "pt" ? "Nota médica: " : locale === "es" ? "Nota médica: " : "Medical note: "}
            </span>
            {t("disclaimer")}
          </p>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between pb-1">
            <span className="text-sm font-mono uppercase tracking-wider font-semibold text-foreground">
              {t("yourBmi")}
            </span>
            {result && (
              <AppBadge
                bg={CATEGORY_STYLES[result.category].badgeBg}
                text={CATEGORY_STYLES[result.category].badgeText}
              >
                <span className="text-xs sm:text-sm font-semibold">
                  {t(result.category)}
                </span>
              </AppBadge>
            )}
          </div>

          {result ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-3">
                <span
                  className={`text-6xl sm:text-7xl font-black font-mono tracking-tight ${CATEGORY_STYLES[result.category].text}`}
                >
                  {result.bmi.toFixed(1)}
                </span>
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-bold font-mono text-foreground">
                    {t(result.category)}
                  </span>
                  <span className="text-xs sm:text-sm text-label font-mono">
                    {result.category === "normal" ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-4 h-4 inline" />
                        {locale === "pt"
                          ? "Peso na faixa ideal da OMS"
                          : locale === "es"
                            ? "Peso en rango óptimo según la OMS"
                            : "Optimal weight range according to WHO"}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 font-medium">
                        <AlertCircle className="w-4 h-4 inline text-amber-500" />
                        {locale === "pt"
                          ? "Fora da faixa recomendada pela OMS"
                          : locale === "es"
                            ? "Fuera del rango recomendado por la OMS"
                            : "Outside WHO recommended threshold"}
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-mono text-label pb-1">
                  <span>15.0</span>
                  <span className="font-semibold text-foreground">
                    Escala IMC (18.5 – 25.0 – 30.0)
                  </span>
                  <span>40.0</span>
                </div>

                <div className="relative">
                  <div className="grid grid-cols-4 h-3.5 rounded-[2px] overflow-hidden gap-[1px] bg-background p-[1px]">
                    <div
                      className="bg-blue-500/80"
                      title={t("underweight")}
                    />
                    <div
                      className="bg-emerald-500/80"
                      title={t("normal")}
                    />
                    <div
                      className="bg-amber-500/80"
                      title={t("overweight")}
                    />
                    <div
                      className="bg-rose-500/80"
                      title={t("obese")}
                    />
                  </div>

                  <div
                    className="absolute -top-1.5 w-3.5 h-6 bg-foreground border border-background rounded-[1px] transition-all duration-300 pointer-events-none transform -translate-x-1/2"
                    style={{
                      left: `${bmiToPercent(result.bmi)}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-4 text-xs sm:text-sm font-mono text-label text-center pt-1.5">
                  <span>&lt; 18.5</span>
                  <span>18.5 – 24.9</span>
                  <span>25.0 – 29.9</span>
                  <span>≥ 30.0</span>
                </div>
              </div>

              {minIdealWeight > 0 && maxIdealWeight > 0 && (
                <div className="p-4 bg-tertiary rounded-[2px] space-y-1">
                  <div className="text-xs sm:text-sm font-mono text-label">
                    {t("healthyWeightRangeForHeight")}:
                  </div>
                  <div className="text-base sm:text-lg font-mono font-bold text-foreground">
                    {minIdealWeight} {unit === "metric" ? "kg" : "lbs"} –{" "}
                    {maxIdealWeight} {unit === "metric" ? "kg" : "lbs"}
                  </div>
                </div>
              )}

              <div className="p-3.5 sm:p-4 bg-tertiary/70 rounded-[2px] flex items-start gap-3">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs sm:text-sm font-mono font-semibold text-foreground block">
                    {t("bmiSexContext")} ({sex === "female" ? t("female") : t("male")})
                  </span>
                  <p className="text-xs sm:text-sm text-label leading-relaxed">
                    {sex === "female" ? t("bmiSexNoteFemale") : t("bmiSexNoteMale")}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-14 text-center text-label text-sm">
              {locale === "pt"
                ? "Informe seu sexo, peso e altura para calcular o IMC instantaneamente."
                : locale === "es"
                  ? "Introduce tu sexo, peso y estatura para calcular el IMC al instante."
                  : "Enter your sex, weight, and height to calculate your BMI instantly."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
