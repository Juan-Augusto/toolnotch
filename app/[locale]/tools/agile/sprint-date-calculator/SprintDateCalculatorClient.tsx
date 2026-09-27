"use client";

import { useState } from "react";
import {
  CalendarDays,
  CalendarCheck,
  RotateCcw,
  Check,
  Copy,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  AppButton,
  AppInput,
  AppCard,
  AppBadge,
  AppSegmentedControl,
} from "@/components/ui";

interface Props {
  labels: Record<string, string>;
  locale?: string;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date, locale = "pt"): string {
  const intlLocale =
    locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US";
  return new Intl.DateTimeFormat(intlLocale, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function getWeekdays(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) {
      days.push(new Date(cur));
    }
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

export default function SprintDateCalculatorClient({
  labels,
  locale = "pt",
}: Props) {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [sprintWeeks, setSprintWeeks] = useState("2");
  const [result, setResult] = useState<null | {
    planning: Date;
    review: Date;
    retro: Date;
    end: Date;
    standups: Date[];
    copyText: string;
  }>(null);
  const [copied, setCopied] = useState(false);

  function calculate() {
    if (!startDate) return;
    const start = new Date(startDate + "T00:00:00");
    const weeksNum = parseInt(sprintWeeks, 10) || 2;
    const days = weeksNum * 7;
    const end = addDays(start, days - 1);
    const planning = start;
    const review = end;
    const retro = end;
    const standups = getWeekdays(addDays(start, 1), addDays(end, -1));

    const standupLines = standups
      .map((d) => `  • ${formatDate(d, locale)}`)
      .join("\n");

    const copyText = [
      `${labels.sprintNumber} (${weeksNum} ${locale === "en" ? "weeks" : "semanas"})`,
      `• ${labels.planningLabel}: ${formatDate(planning, locale)}`,
      `• ${labels.sprintEndLabel}: ${formatDate(end, locale)}`,
      `• ${labels.reviewLabel}: ${formatDate(review, locale)}`,
      `• ${labels.retroLabel}: ${formatDate(retro, locale)}`,
      `• ${labels.dailyStandupsLabel} (${standups.length} ${locale === "en" ? "days" : "dias"}):`,
      standupLines,
    ].join("\n");

    setResult({ planning, review, retro, end, standups, copyText });
    setCopied(false);
  }

  async function copyToClipboard() {
    if (!result) return;
    await navigator.clipboard.writeText(result.copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 w-full">
      {/* Settings Form */}
      <AppCard border cornerAccents className="p-4 sm:p-6 bg-tertiary space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <AppInput
              label={labels.startDateLabel}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="font-mono text-sm sm:text-base"
            />
          </div>

          <div>
            <AppSegmentedControl
              label={labels.sprintLengthLabel}
              options={[
                { label: labels.twoWeeks || "2 semanas", value: "2" },
                { label: labels.threeWeeks || "3 semanas", value: "3" },
                { label: labels.fourWeeks || "4 semanas", value: "4" },
              ]}
              value={sprintWeeks}
              onChange={(val) => setSprintWeeks(String(val))}
              fontWeight="medium"
              withDashedBorder={false}
              buttonClassName="normal-case text-sm"
              size="md"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <AppButton
            onClick={calculate}
            color="primary"
            className="font-mono text-sm sm:text-base flex-1 h-[44px]"
          >
            <CalendarCheck className="w-4 h-4 mr-2" />
            <span>{labels.calculateButton}</span>
          </AppButton>
        </div>
      </AppCard>

      {/* Results Card */}
      {result && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <h3 className="font-mono font-bold text-base sm:text-lg uppercase text-foreground flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              <span>
                {locale === "es"
                  ? "Cronograma del Sprint"
                  : locale === "en"
                    ? "Sprint Schedule"
                    : "Cronograma da Sprint"}
              </span>
            </h3>

            <AppButton
              onClick={copyToClipboard}
              small
              color="secondary"
              className="font-mono text-sm px-3.5 h-[36px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1.5 text-emerald-500" />
                  <span>{labels.copiedButton}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1.5" />
                  <span>{labels.copyButton}</span>
                </>
              )}
            </AppButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-4 rounded-[2px] bg-tertiary border border-border flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-[2px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-mono uppercase text-muted-foreground block font-semibold">
                  {labels.planningLabel} {locale === "es" ? "(Inicio)" : locale === "en" ? "(Start)" : "(Início)"}
                </span>
                <span className="text-base sm:text-lg font-mono font-bold text-foreground capitalize">
                  {formatDate(result.planning, locale)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-[2px] bg-tertiary border border-border flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-[2px] bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-mono uppercase text-muted-foreground block font-semibold">
                  {labels.sprintEndLabel} {locale === "es" ? "(Cierre)" : locale === "en" ? "(End)" : "(Término)"}
                </span>
                <span className="text-base sm:text-lg font-mono font-bold text-foreground capitalize">
                  {formatDate(result.end, locale)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-[2px] bg-tertiary border border-border flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-[2px] bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-mono uppercase text-muted-foreground block font-semibold">
                  {labels.reviewLabel}
                </span>
                <span className="text-base sm:text-lg font-mono font-bold text-foreground capitalize">
                  {formatDate(result.review, locale)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-[2px] bg-tertiary border border-border flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-[2px] bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-mono uppercase text-muted-foreground block font-semibold">
                  {labels.retroLabel}
                </span>
                <span className="text-base sm:text-lg font-mono font-bold text-foreground capitalize">
                  {formatDate(result.retro, locale)}
                </span>
              </div>
            </div>
          </div>

          {/* Standups List */}
          <AppCard border cornerAccents={false} className="p-4 sm:p-5 bg-tertiary space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
              <span className="text-sm sm:text-base font-mono font-bold uppercase text-foreground">
                {labels.dailyStandupsLabel} ({result.standups.length})
              </span>
              <span className="text-sm text-muted-foreground font-mono">
                {labels.weekdaysOnlyNote}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
              {result.standups.map((d, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 rounded-[2px] bg-background border border-border/60 text-sm sm:text-base font-mono text-foreground flex items-center justify-between"
                >
                  <span className="text-muted-foreground font-semibold">{idx + 1}.</span>
                  <span className="capitalize font-medium">{formatDate(d, locale)}</span>
                </div>
              ))}
            </div>
          </AppCard>
        </div>
      )}
    </div>
  );
}
