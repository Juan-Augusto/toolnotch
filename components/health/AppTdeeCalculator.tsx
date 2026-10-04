"use client";

import { useState, useId } from "react";
import { useTranslations } from "next-intl";
import {
  RotateCcw,
  Flame,
  Activity,
  HeartPulse,
  TrendingDown,
  Check,
  Star,
} from "lucide-react";
import {
  calculateTdee,
  lbsToKg,
  kgToLbs,
  feetInchesToCm,
  cmToFeetInches,
  type TdeeResult,
  type Sex,
  type ActivityLevel,
  type UnitSystem,
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
  mode: "maintain" | "deficit";
}

type GoalKey = "lose_fast" | "lose_slow" | "maintain" | "gain_slow" | "gain_fast";

const GOAL_ORDER: GoalKey[] = [
  "lose_fast",
  "lose_slow",
  "maintain",
  "gain_slow",
  "gain_fast",
];

const ACTIVITY_KEYS: ActivityLevel[] = [
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
];

const ACTIVITY_LABEL_MAP: Record<ActivityLevel, string> = {
  sedentary: "sedentary",
  light: "light",
  moderate: "moderate",
  active: "active",
  very_active: "veryActive",
};

export default function AppTdeeCalculator({ locale, mode }: Props) {
  const t = useTranslations("healthCalculator");
  const baseId = useId();

  const defaultUnit: UnitSystem = locale === "en" ? "imperial" : "metric";
  const [unit, setUnit] = useState<UnitSystem>(defaultUnit);

  const [age, setAge] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");

  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");

  const [weightLbs, setWeightLbs] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  const result: TdeeResult | null = (() => {
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

    const ageNum = parseFloat(age);

    if (
      wKg > 0 &&
      hCm > 0 &&
      ageNum > 0 &&
      Number.isFinite(wKg) &&
      Number.isFinite(hCm) &&
      Number.isFinite(ageNum)
    ) {
      return calculateTdee(wKg, hCm, ageNum, sex, activity);
    }
    return null;
  })();

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
    setAge("");
    setWeightKg("");
    setHeightCm("");
    setWeightLbs("");
    setHeightFt("");
    setHeightIn("");
    setSex("male");
    setActivity("moderate");
  }

  const goalDescriptions: Record<
    GoalKey,
    { title: string; subtitle: string; tag: string }
  > = {
    lose_fast: {
      title: t("loseFast"),
      subtitle: t("weeklyLossFast"),
      tag: "-500 kcal",
    },
    lose_slow: {
      title: t("loseSlow"),
      subtitle: t("weeklyLossSlow"),
      tag: "-250 kcal",
    },
    maintain: {
      title: t("maintain"),
      subtitle: t("weeklyMaintain"),
      tag: "0 kcal",
    },
    gain_slow: {
      title: t("gainSlow"),
      subtitle: t("weeklyGainSlow"),
      tag: "+250 kcal",
    },
    gain_fast: {
      title: t("gainFast"),
      subtitle: t("weeklyGainFast"),
      tag: "+500 kcal",
    },
  };

  const activityOptions = ACTIVITY_KEYS.map((key) => ({
    label: t(ACTIVITY_LABEL_MAP[key]),
    value: key,
  }));

  const sexOptions = [
    { label: t("male"), value: "male" },
    { label: t("female"), value: "female" },
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
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <div className="pb-1">
              <h2 className="text-sm font-mono uppercase tracking-wider font-semibold text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span>
                  {locale === "pt"
                    ? "Parâmetros Individuais"
                    : locale === "es"
                      ? "Parámetros Individuales"
                      : "Individual Parameters"}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <AppInput
                id={`${baseId}-age`}
                label={t("age")}
                type="number"
                inputMode="numeric"
                min="10"
                max="120"
                placeholder="30"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="font-mono text-sm h-11"
              />
              <AppSelect
                id={`${baseId}-sex`}
                label={t("sex")}
                options={sexOptions}
                value={sex}
                onChange={(val) => setSex(val as Sex)}
                className="font-mono text-sm h-11"
              />
            </div>

            {unit === "metric" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="space-y-4">
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
              </div>
            )}

            <div>
              <AppSelect
                id={`${baseId}-activity`}
                label={t("activityLevel")}
                options={activityOptions}
                value={activity}
                onChange={(val) => setActivity(val as ActivityLevel)}
                className="font-mono text-sm h-11"
              />
            </div>
          </div>

          <p className="text-xs sm:text-sm font-mono text-label leading-relaxed pt-2">
            <span className="font-semibold text-foreground">
              {locale === "pt" ? "Nota médica: " : locale === "es" ? "Nota médica: " : "Medical note: "}
            </span>
            {t("disclaimer")}
          </p>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-1">
            <span className="text-sm font-mono uppercase tracking-wider font-semibold text-foreground">
              {mode === "deficit" ? t("deficitPlan") : t("maintenanceTdee")}
            </span>
            {result && (
              <AppBadge bg="bg-primary/10" text="text-primary">
                {mode === "deficit" ? (
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                    <TrendingDown className="w-4 h-4" />
                    {t("loseFast")}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                    <Flame className="w-4 h-4" />
                    {t("maintain")}
                  </span>
                )}
              </AppBadge>
            )}
          </div>

          {result ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 bg-tertiary rounded-[2px] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-label font-semibold">
                    <HeartPulse className="w-4 h-4 text-primary" />
                    <span>{t("yourBmr")} (TMB)</span>
                  </div>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-3xl sm:text-4xl font-bold font-mono text-foreground">
                      {result.bmr.toLocaleString()}
                    </span>
                    <span className="text-xs sm:text-sm font-mono text-label">kcal/dia</span>
                  </div>
                  <p className="text-xs sm:text-sm font-mono text-label leading-relaxed pt-1">
                    {locale === "pt"
                      ? "Gasto calórico mínimo em repouso basal"
                      : locale === "es"
                        ? "Gasto calórico mínimo en reposo basal"
                        : "Calories burned at complete resting state"}
                  </p>
                </div>

                <div className="p-4 sm:p-5 bg-tertiary rounded-[2px] space-y-1.5 relative overflow-hidden">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-primary font-semibold">
                    <Flame className="w-4 h-4 text-primary" />
                    <span>{t("yourTdee")} (TDEE)</span>
                  </div>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-3xl sm:text-4xl font-bold font-mono text-primary">
                      {result.tdee.toLocaleString()}
                    </span>
                    <span className="text-xs sm:text-sm font-mono text-primary/80">kcal/dia</span>
                  </div>
                  <p className="text-xs sm:text-sm font-mono text-label leading-relaxed pt-1">
                    {locale === "pt"
                      ? "Total queimado no dia para manter seu peso"
                      : locale === "es"
                        ? "Total quemado al día para mantener tu peso"
                        : "Daily energy expenditure to maintain weight"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-label px-1">
                  <span className="font-semibold uppercase tracking-wider text-foreground">
                    {locale === "pt"
                      ? "Metas Calóricas Diárias"
                      : locale === "es"
                        ? "Metas Calóricas Diarias"
                        : "Daily Calorie Targets"}
                  </span>
                  <span>{t("calories")} / dia</span>
                </div>

                <div className="space-y-2">
                  {GOAL_ORDER.map((key) => {
                    const isTarget =
                      mode === "deficit"
                        ? key === "lose_fast"
                        : key === "maintain";
                    const goalInfo = goalDescriptions[key];
                    const calories = result.goals[key];
                    const maxCal = result.goals.gain_fast;
                    const percent = Math.min(
                      Math.max((calories / maxCal) * 100, 20),
                      100
                    );

                    return (
                      <div
                        key={key}
                        className={`p-3.5 sm:p-4 rounded-[2px] transition-colors ${
                          isTarget
                            ? "bg-primary/10 border-l-4 border-l-primary"
                            : "bg-tertiary/50 hover:bg-tertiary/80 border-l-4 border-l-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <div className="flex items-center gap-2">
                            {isTarget && (
                              <Star className="w-4 h-4 text-primary fill-primary shrink-0" />
                            )}
                            <span
                              className={`text-sm font-mono font-bold ${
                                isTarget ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {goalInfo.title}
                            </span>
                            <span className="text-xs font-mono text-label px-2 py-0.5 rounded-[2px] bg-background">
                              {goalInfo.tag}
                            </span>
                          </div>

                          <div className="flex items-baseline gap-1.5">
                            <span
                              className={`text-lg sm:text-xl font-bold font-mono ${
                                isTarget ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {calories.toLocaleString()}
                            </span>
                            <span className="text-xs sm:text-sm font-mono text-label">
                              kcal
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-label">
                          <span>{goalInfo.subtitle}</span>
                          {isTarget && (
                            <span className="text-primary font-semibold flex items-center gap-1.5 text-xs sm:text-sm">
                              <Check className="w-4 h-4" />
                              {t("recommended")}
                            </span>
                          )}
                        </div>

                        <div className="w-full bg-background/60 h-2 rounded-full mt-2.5 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${
                              isTarget ? "bg-primary" : "bg-muted-foreground/30"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-14 text-center text-label text-sm">
              {locale === "pt"
                ? "Preencha idade, sexo, peso, altura e nível de atividade para calcular seu gasto diário."
                : locale === "es"
                  ? "Completa edad, sexo, peso, estatura y nivel de actividad para calcular tu gasto calórico."
                  : "Fill in age, sex, weight, height, and activity level to calculate your daily energy expenditure."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
