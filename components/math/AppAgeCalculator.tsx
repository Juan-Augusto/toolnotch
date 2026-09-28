"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Calendar,
  RotateCcw,
  Copy,
  Check,
  Cake,
  PartyPopper,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import { AppInput, AppButton, AppBadge } from "@/components/ui";
import { calculateAge, nextBirthday, type AgeResult, type BirthdayCountdown } from "@/lib/ageMath";

interface Props {
  locale: string;
}

function formatDateDisplay(date: Date, locale = "pt"): string {
  const intlLocale =
    locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US";
  return new Intl.DateTimeFormat(intlLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatShortDate(date: Date, locale = "pt"): string {
  const intlLocale =
    locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US";
  return new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    month: "long",
  }).format(date);
}

export default function AppAgeCalculator({ locale }: Props) {
  const t = useTranslations("ageCalculator");

  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => today.toISOString().split("T")[0], [today]);

  const [birthdate, setBirthdate] = useState("");
  const [targetDate, setTargetDate] = useState(todayStr);
  const [copied, setCopied] = useState(false);

  const birthdateObj = useMemo(() => {
    if (!birthdate) return null;
    return new Date(birthdate + "T00:00:00");
  }, [birthdate]);

  const targetDateObj = useMemo(() => {
    if (!targetDate) return new Date();
    return new Date(targetDate + "T00:00:00");
  }, [targetDate]);

  const isTargetToday = targetDate === todayStr;

  const isValidDateRange = useMemo(() => {
    if (!birthdateObj || !targetDateObj) return false;
    return birthdateObj <= targetDateObj;
  }, [birthdateObj, targetDateObj]);

  const age: AgeResult | null = useMemo(() => {
    if (!isValidDateRange || !birthdateObj || !targetDateObj) return null;
    return calculateAge(birthdateObj, targetDateObj);
  }, [isValidDateRange, birthdateObj, targetDateObj]);

  const bday: BirthdayCountdown | null = useMemo(() => {
    if (!birthdateObj) return null;
    return nextBirthday(birthdateObj, today);
  }, [birthdateObj, today]);

  const handleReset = useCallback(() => {
    setBirthdate("");
    setTargetDate(todayStr);
    setCopied(false);
  }, [todayStr]);

  const handleUseToday = useCallback(() => {
    setTargetDate(todayStr);
  }, [todayStr]);

  const handleCopy = useCallback(async () => {
    if (!age) return;
    const parts = [
      `${age.years} ${t("yearsOld")}, ${age.months} ${t("monthsWord")} ${t("and")} ${age.days} ${t("daysWord")}`,
      `${t("totalDays", { total: age.totalDays.toLocaleString(locale) })}`,
      `${t("totalMonths")}: ${age.totalMonths.toLocaleString(locale)}`,
      `${t("totalWeeks")}: ${age.totalWeeks.toLocaleString(locale)}`,
      `${t("totalHours")}: ${age.totalHours.toLocaleString(locale)}`,
    ];
    if (bday && isTargetToday) {
      if (bday.isToday) {
        parts.push(t("happyBirthday"));
      } else {
        parts.push(`${t("nextBirthday")}: ${t("inDays", { n: bday.daysUntil })} (${formatShortDate(bday.nextBirthdayDate, locale)})`);
      }
    }

    try {
      await navigator.clipboard.writeText(parts.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard write failure
    }
  }, [age, bday, isTargetToday, locale, t]);

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-end pb-2">
        <AppButton
          color="tertiary"
          small
          onClick={handleReset}
          className="text-xs font-mono"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          iconPosition="left"
        >
          {t("reset")}
        </AppButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <div className="pb-1">
              <h2 className="text-sm font-mono uppercase tracking-wider font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{t("birthParameters")}</span>
              </h2>
            </div>

            <div className="space-y-4">
              <AppInput
                id="age-birthdate"
                label={t("birthdate")}
                type="date"
                max={todayStr}
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="font-mono text-sm h-11"
              />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground select-none">
                    {t("targetDate")}
                  </span>
                  {!isTargetToday && (
                    <button
                      type="button"
                      onClick={handleUseToday}
                      className="text-xs font-mono text-primary hover:underline cursor-pointer"
                    >
                      {t("useToday")}
                    </button>
                  )}
                </div>
                <AppInput
                  id="age-target-date"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="font-mono text-sm h-11"
                />
              </div>

              {birthdate && !isValidDateRange && (
                <p className="text-sm font-mono text-red-500 pt-1">
                  {t("errorFutureDate")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Age Results */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-1">
            <span className="text-sm font-mono uppercase tracking-wider font-semibold text-foreground">
              {t("exactAge")}
            </span>
            {age && (
              <AppButton
                color="tertiary"
                small
                onClick={handleCopy}
                className="text-xs font-mono"
                icon={
                  copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-label" />
                  )
                }
                iconPosition="left"
              >
                {copied ? t("copied") : t("copySummary")}
              </AppButton>
            )}
          </div>

          {age ? (
            <div className="space-y-6">
              {/* Main Age Highlight Hero */}
              <div className="p-5 sm:p-6 bg-tertiary rounded-[2px] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-mono text-label">
                    {t("youAre")}
                  </span>
                  {!isTargetToday && targetDateObj && (
                    <AppBadge bg="bg-secondary/10" text="text-secondary">
                      <span className="text-xs font-mono font-medium">
                        {t("onDate", {
                          date: new Intl.DateTimeFormat(
                            locale === "pt"
                              ? "pt-BR"
                              : locale === "es"
                                ? "es-ES"
                                : "en-US",
                            { day: "numeric", month: "short", year: "numeric" },
                          ).format(targetDateObj),
                        })}
                      </span>
                    </AppBadge>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
                  <span className="text-5xl sm:text-6xl md:text-7xl font-black font-mono tracking-tight text-primary">
                    {age.years}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-lg sm:text-xl font-bold font-mono text-foreground">
                      {t("yearsOld")}
                    </span>
                    <span className="text-sm font-mono text-label">
                      {age.months} {t("monthsWord")} {t("and")} {age.days} {t("daysWord")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Birthday Card (When viewing current age) */}
              {bday && isTargetToday && (
                <div
                  className={`p-4 rounded-[2px] flex items-center justify-between gap-4 transition-colors ${
                    bday.isToday
                      ? "bg-primary/10 border-l-4 border-l-primary"
                      : "bg-tertiary"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[2px] bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                      {bday.isToday ? (
                        <PartyPopper className="w-5 h-5 text-primary" />
                      ) : (
                        <Cake className="w-5 h-5 text-secondary" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-mono font-semibold text-foreground">
                        {bday.isToday
                          ? t("happyBirthday")
                          : t("nextBirthday")}
                      </div>
                      {!bday.isToday && (
                        <div className="text-xs font-mono text-label mt-0.5">
                          {formatDateDisplay(bday.nextBirthdayDate, locale)}
                        </div>
                      )}
                    </div>
                  </div>

                  {!bday.isToday && (
                    <div className="text-right shrink-0">
                      <span className="text-lg sm:text-xl font-bold font-mono text-secondary block">
                        {t("inDays", { n: bday.daysUntil })}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Lifetime Summary Stats Grid */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-label px-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-semibold uppercase tracking-wider text-foreground">
                    {t("lifeSummary")}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 sm:p-4 bg-tertiary rounded-[2px] space-y-1">
                    <span className="text-xs font-mono text-label block">
                      {t("daysWord")}
                    </span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-foreground block">
                      {age.totalDays.toLocaleString(locale)}
                    </span>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-tertiary rounded-[2px] space-y-1">
                    <span className="text-xs font-mono text-label block">
                      {t("monthsWord")}
                    </span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-foreground block">
                      {age.totalMonths.toLocaleString(locale)}
                    </span>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-tertiary rounded-[2px] space-y-1">
                    <span className="text-xs font-mono text-label block">
                      {t("totalWeeks")}
                    </span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-foreground block">
                      {age.totalWeeks.toLocaleString(locale)}
                    </span>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-tertiary rounded-[2px] space-y-1">
                    <span className="text-xs font-mono text-label block">
                      {t("totalHours")}
                    </span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-foreground block">
                      {age.totalHours.toLocaleString(locale)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-14 text-center text-label text-sm">
              {t("emptyPrompt")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
