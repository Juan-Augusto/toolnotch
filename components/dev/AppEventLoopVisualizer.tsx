"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Trophy,
} from "lucide-react";
import { simulate } from "@/lib/dev/eventLoop";
import { LESSONS, type Lesson } from "@/lib/dev/eventLoopLessons";
import AppEventLoopStage from "./eventloop/AppEventLoopStage";

const STORAGE_KEY = "toolnotch:eventloop:completed";
const SPEEDS = [1400, 800, 400] as const;

interface Props {
  locale?: string;
}

const COMPLETED_EVENT = "toolnotch:eventloop:completed-change";

function readRaw(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(COMPLETED_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(COMPLETED_EVENT, cb);
  };
}

function parseCompleted(raw: string): string[] {
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function saveCompleted(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* storage unavailable: progress just isn't remembered */
  }
  window.dispatchEvent(new Event(COMPLETED_EVENT));
}

/** Deterministic option order (SSR-safe): rotate so the answer isn't always first. */
function buildOptions(lesson: Lesson, lessonIdx: number) {
  const all = [simulate(lesson.program).output, ...lesson.distractors];
  const shift = lessonIdx % all.length;
  const rotated = all.map((_, i) => all[(i + shift) % all.length]);
  const correct = rotated.findIndex((o) => o === all[0]);
  return { options: rotated, correct };
}

export default function AppEventLoopVisualizer({ locale = "en" }: Props) {
  const t = useTranslations("eventLoop");
  const prefix = locale === "en" ? "" : `/${locale}`;

  const [lessonIdx, setLessonIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [picked, setPicked] = useState<number | null>(null);
  const rawCompleted = useSyncExternalStore(subscribe, readRaw, () => "");
  const completed = useMemo(() => parseCompleted(rawCompleted), [rawCompleted]);

  const lesson = LESSONS[lessonIdx];
  const frames = useMemo(() => simulate(lesson.program).frames, [lesson]);
  const { options, correct } = useMemo(
    () => buildOptions(lesson, lessonIdx),
    [lesson, lessonIdx],
  );
  const last = frames.length - 1;
  const frame = frames[Math.min(step, last)];
  const atEnd = step >= last;
  const allDone = completed.length === LESSONS.length;

  const goTo = useCallback(
    (n: number) => {
      const clamped = Math.max(0, Math.min(n, last));
      setStep(clamped);
      if (clamped >= last && !parseCompleted(readRaw()).includes(lesson.id)) {
        saveCompleted([...parseCompleted(readRaw()), lesson.id]);
      }
    },
    [last, lesson.id],
  );

  const running = playing && !atEnd;

  // Autoplay.
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => goTo(step + 1), SPEEDS[speedIdx]);
    return () => window.clearTimeout(id);
  }, [running, step, speedIdx, goTo]);

  const selectLesson = useCallback((idx: number) => {
    setLessonIdx(idx);
    setStep(0);
    setPlaying(false);
    setPicked(null);
  }, []);

  const reset = () => {
    setStep(0);
    setPlaying(false);
  };

  const narration = useMemo(() => {
    const { key, params } = frame.note;
    const p: Record<string, string | number> = { ...params };
    if (typeof p.where === "string") p.where = t(`where.${p.where}`);
    return t(`note.${key}`, p);
  }, [frame, t]);

  const codeLines = lesson.code;
  const nextLesson = LESSONS[lessonIdx + 1];
  const lessonText = (k: string) => t(`lessons.${lesson.id}.${k}`);

  return (
    <div className="grid gap-4 lg:grid-cols-[17rem_1fr]" data-testid="eventloop-visualizer">
      {/* ── Learning path ─────────────────────────────────────────── */}
      <nav aria-label={t("path.title")} className="lg:sticky lg:top-20 lg:self-start">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
            {t("path.title")}
          </h2>
          <span className="font-mono text-[11px] text-label" data-testid="path-progress">
            {t("path.progress", { done: completed.length, total: LESSONS.length })}
          </span>
        </div>
        <div
          className="mb-3 flex gap-1"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={LESSONS.length}
          aria-valuenow={completed.length}
          aria-label={t("path.title")}
        >
          {LESSONS.map((l) => (
            <div
              key={l.id}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                completed.includes(l.id) ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
        <ol className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {LESSONS.map((l, i) => {
            const done = completed.includes(l.id);
            const current = i === lessonIdx;
            return (
              <li key={l.id} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => selectLesson(i)}
                  aria-current={current ? "step" : undefined}
                  data-testid={`lesson-${l.id}`}
                  className={`flex w-full min-w-[11rem] items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors lg:min-w-0 ${
                    current
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
                      done
                        ? "border-primary bg-primary text-background"
                        : "border-border text-label"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" aria-label={t("path.done")} /> : i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {t(`lessons.${l.id}.title`)}
                    </span>
                    <span className="block text-[10px] uppercase tracking-wide text-label">
                      {t(`levels.${l.level}`)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* ── Lesson ────────────────────────────────────────────────── */}
      <section className="min-w-0 space-y-4" aria-labelledby="lesson-title">
        <header>
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
            {t("lessonOf", { n: lessonIdx + 1, total: LESSONS.length })} ·{" "}
            {t(`levels.${lesson.level}`)}
          </p>
          <h2 id="lesson-title" className="section-heading text-2xl text-foreground">
            {lessonText("title")}
          </h2>
          <p className="mt-1 text-sm text-label">{lessonText("goal")}</p>
        </header>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,22rem)_1fr]">
          {/* Code + predict */}
          <div className="space-y-3">
            <div className="overflow-hidden rounded-lg border border-border bg-black/40">
              <div className="border-b border-border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-label">
                {t("codeTitle")}
              </div>
              <pre className="overflow-x-auto py-2 font-mono text-xs leading-6" data-testid="eventloop-code">
                {codeLines.map((text, i) => {
                  const active = frame.line === i + 1;
                  return (
                    <div
                      key={i}
                      aria-current={active ? "true" : undefined}
                      className={`flex border-l-2 pr-3 ${
                        active
                          ? "border-primary bg-primary/15 text-foreground"
                          : "border-transparent text-foreground/70"
                      }`}
                    >
                      <span className="w-8 shrink-0 select-none pr-2 text-right text-label">
                        {i + 1}
                      </span>
                      <code className="whitespace-pre">{text}</code>
                    </div>
                  );
                })}
              </pre>
            </div>

            <div className="rounded-lg border border-border bg-panel/40 p-3" data-testid="eventloop-predict">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-foreground">
                {t("predict.title")}
              </h3>
              <p className="mb-2 text-xs text-label">{t("predict.help")}</p>
              <div className="space-y-1.5" role="radiogroup" aria-label={t("predict.title")}>
                {options.map((opt, i) => {
                  const chosen = picked === i;
                  const reveal = picked !== null;
                  const isRight = i === correct;
                  const tone = !reveal
                    ? "border-border hover:border-primary/50"
                    : isRight
                      ? "border-primary bg-primary/10"
                      : chosen
                        ? "border-red-400/70 bg-red-400/10"
                        : "border-border opacity-60";
                  return (
                    <button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={chosen}
                      disabled={reveal}
                      onClick={() => setPicked(i)}
                      data-testid={`predict-option-${i}`}
                      className={`w-full rounded-md border px-2.5 py-1.5 text-left font-mono text-[11px] leading-5 text-foreground transition-colors ${tone}`}
                    >
                      {opt.join(" → ")}
                    </button>
                  );
                })}
              </div>
              {picked !== null ? (
                <p
                  role="status"
                  data-testid="predict-feedback"
                  className={`mt-2 text-xs font-semibold ${
                    picked === correct ? "text-primary" : "text-red-400"
                  }`}
                >
                  {picked === correct ? t("predict.right") : t("predict.wrong")}
                </p>
              ) : null}
            </div>
          </div>

          {/* Stage + controls */}
          <div className="min-w-0 space-y-3">
            <AppEventLoopStage frame={frame} />

            <div
              role="status"
              aria-live="polite"
              data-testid="eventloop-narration"
              className="rounded-lg border-l-2 border-primary bg-primary/5 px-3 py-2 text-sm text-foreground"
            >
              {narration}
            </div>

            <div className="flex flex-wrap items-center gap-2" data-testid="eventloop-controls">
              <button
                type="button"
                onClick={reset}
                aria-label={t("controls.reset")}
                title={t("controls.reset")}
                className="btn-ghost inline-flex h-9 w-9 items-center justify-center rounded-md"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  goTo(step - 1);
                }}
                disabled={step === 0}
                aria-label={t("controls.prev")}
                title={t("controls.prev")}
                className="btn-ghost inline-flex h-9 w-9 items-center justify-center rounded-md disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (atEnd) {
                    setStep(0);
                    setPlaying(true);
                  } else {
                    setPlaying(!running);
                  }
                }}
                data-testid="eventloop-play"
                className="btn-neon inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-semibold"
              >
                {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {running ? t("controls.pause") : atEnd ? t("controls.replay") : t("controls.play")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  goTo(step + 1);
                }}
                disabled={atEnd}
                data-testid="eventloop-next"
                aria-label={t("controls.next")}
                title={t("controls.next")}
                className="btn-ghost inline-flex h-9 w-9 items-center justify-center rounded-md disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  goTo(last);
                }}
                disabled={atEnd}
                aria-label={t("controls.skip")}
                title={t("controls.skip")}
                className="btn-ghost inline-flex h-9 w-9 items-center justify-center rounded-md disabled:opacity-40"
              >
                <SkipForward className="h-4 w-4" />
              </button>

              <label className="ml-auto flex items-center gap-2 text-[11px] uppercase tracking-wide text-label">
                {t("controls.speed")}
                <select
                  value={speedIdx}
                  onChange={(e) => setSpeedIdx(Number(e.target.value))}
                  className="rounded border border-border bg-background px-1.5 py-1 text-xs text-foreground"
                >
                  <option value={0}>0.5×</option>
                  <option value={1}>1×</option>
                  <option value={2}>2×</option>
                </select>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={last}
                value={Math.min(step, last)}
                onChange={(e) => {
                  setPlaying(false);
                  goTo(Number(e.target.value));
                }}
                aria-label={t("controls.scrub")}
                className="w-full accent-[var(--primary)]"
              />
              <span className="shrink-0 font-mono text-[11px] text-label" data-testid="eventloop-step">
                {Math.min(step, last) + 1}/{frames.length}
              </span>
            </div>
          </div>
        </div>

        {/* Takeaway */}
        <div className="rounded-lg border border-border bg-panel/40 p-4">
          <p className="text-sm leading-relaxed text-foreground">{lessonText("body")}</p>
          {atEnd ? (
            <div className="protip-neon mt-3" data-testid="eventloop-takeaway">
              <p className="text-sm text-foreground">
                <strong>{t("takeawayLabel")}</strong> {lessonText("takeaway")}
              </p>
            </div>
          ) : null}
        </div>

        {/* Path navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => selectLesson(Math.max(0, lessonIdx - 1))}
            disabled={lessonIdx === 0}
            className="btn-ghost rounded-md px-3 py-2 text-sm disabled:opacity-40"
          >
            ← {t("path.prev")}
          </button>
          {nextLesson ? (
            <button
              type="button"
              onClick={() => selectLesson(lessonIdx + 1)}
              data-testid="eventloop-next-lesson"
              className={`${atEnd ? "btn-neon" : "btn-ghost"} rounded-md px-4 py-2 text-sm font-semibold`}
            >
              {t("path.next")}: {t(`lessons.${nextLesson.id}.title`)} →
            </button>
          ) : null}
        </div>

        {allDone ? (
          <div
            className="flex flex-wrap items-center gap-4 rounded-lg border border-primary bg-primary/10 p-4"
            data-testid="eventloop-complete"
          >
            <Trophy className="h-8 w-8 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-foreground">{t("complete.title")}</h3>
              <p className="text-sm text-label">{t("complete.body")}</p>
            </div>
            <Link
              href={`${prefix}/interview/nodejs-fundamentals`}
              className="btn-neon rounded-md px-4 py-2 text-sm font-semibold"
            >
              {t("complete.cta")}
            </Link>
          </div>
        ) : null}
      </section>
    </div>
  );
}
