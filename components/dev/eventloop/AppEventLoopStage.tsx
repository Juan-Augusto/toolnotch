"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Frame, Phase, QueueItem } from "@/lib/dev/eventLoop";

type Tone = "primary" | "secondary" | "tertiary";

const TONE: Record<Tone, { chip: string; head: string; ring: string }> = {
  primary: {
    chip: "border-primary/50 bg-primary/10 text-primary",
    head: "text-primary",
    ring: "border-primary shadow-[0_0_0_1px_var(--primary)]",
  },
  secondary: {
    chip: "border-secondary/50 bg-secondary/10 text-secondary",
    head: "text-secondary",
    ring: "border-secondary shadow-[0_0_0_1px_var(--secondary)]",
  },
  tertiary: {
    chip: "border-tertiary/50 bg-tertiary/10 text-tertiary",
    head: "text-tertiary",
    ring: "border-tertiary shadow-[0_0_0_1px_var(--tertiary)]",
  },
};

interface LaneProps {
  title: string;
  hint?: string;
  items: QueueItem[];
  tone: Tone;
  active?: boolean;
  /** Stack grows upward: render newest at top. */
  reverse?: boolean;
  suffix?: (item: QueueItem) => string | null;
  emptyLabel: string;
  testId: string;
}

function Lane({
  title,
  hint,
  items,
  tone,
  active = false,
  reverse = false,
  suffix,
  emptyLabel,
  testId,
}: LaneProps) {
  const reduce = useReducedMotion();
  const t = TONE[tone];
  const shown = reverse ? [...items].reverse() : items;
  return (
    <div
      data-testid={testId}
      className={`flex min-h-[9.5rem] flex-col rounded-lg border bg-panel/60 p-3 transition-colors ${
        active ? t.ring : "border-border"
      }`}
    >
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h4 className={`text-xs font-bold uppercase tracking-wider ${t.head}`}>
          {title}
        </h4>
        {hint ? (
          <span className="text-[10px] uppercase tracking-wide text-label">
            {hint}
          </span>
        ) : null}
      </div>
      <ul className="flex flex-1 flex-col gap-1.5">
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map((item) => {
            const extra = suffix?.(item);
            return (
              <motion.li
                key={item.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.85, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 10 }}
                transition={{ duration: reduce ? 0 : 0.25 }}
                className={`flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 font-mono text-xs ${t.chip}`}
              >
                <span className="truncate">{item.label}</span>
                {extra ? <span className="shrink-0 opacity-70">{extra}</span> : null}
              </motion.li>
            );
          })}
        </AnimatePresence>
        {items.length === 0 ? (
          <li className="m-auto text-xs italic text-label">{emptyLabel}</li>
        ) : null}
      </ul>
    </div>
  );
}

const PHASES: Exclude<Phase, "main">[] = ["timers", "poll", "check"];

export default function AppEventLoopStage({ frame }: { frame: Frame }) {
  const t = useTranslations("eventLoop.stage");
  const reduce = useReducedMotion();
  const finished = frame.note.key === "done";
  const activePhase = finished ? null : frame.phase;

  return (
    <div className="space-y-3" data-testid="eventloop-stage">
      <div className="grid gap-3 md:grid-cols-3">
        <Lane
          testId="lane-stack"
          title={t("callStack")}
          hint={t("callStackHint")}
          items={frame.stack}
          tone="primary"
          reverse
          active={frame.stack.length > 0}
          emptyLabel={t("empty")}
        />
        <Lane
          testId="lane-nexttick"
          title={t("nextTick")}
          hint={t("nextTickHint")}
          items={frame.nextTicks}
          tone="tertiary"
          active={frame.drain === "nextTick"}
          emptyLabel={t("empty")}
        />
        <Lane
          testId="lane-microtasks"
          title={t("microtasks")}
          hint={t("microtasksHint")}
          items={frame.microtasks}
          tone="secondary"
          active={frame.drain === "microtask"}
          emptyLabel={t("empty")}
        />
      </div>

      <div className="rounded-lg border border-border bg-panel/30 p-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            {t("loopTitle")}
          </h3>
          <span className="rounded border border-border px-2 py-0.5 font-mono text-[11px] text-label">
            {t("clock", { ms: frame.clock })}
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {PHASES.map((p) => (
            <div key={p} className="relative">
              <motion.div
                aria-hidden
                className="mb-1.5 h-1 rounded-full bg-border"
                animate={{
                  backgroundColor:
                    activePhase === p ? "var(--primary)" : "var(--border)",
                  scaleY: activePhase === p && !reduce ? 1.6 : 1,
                }}
                transition={{ duration: reduce ? 0 : 0.2 }}
              />
              <Lane
                testId={`lane-${p}`}
                title={t(`phase.${p}`)}
                hint={t(`phaseHint.${p}`)}
                items={
                  p === "timers" ? frame.timers : p === "poll" ? frame.poll : frame.check
                }
                tone="primary"
                active={activePhase === p}
                suffix={p === "check" ? undefined : (i) => (i.due !== undefined ? `@${i.due}ms` : null)}
                emptyLabel={t("empty")}
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-label">{t("internalPhases")}</p>
      </div>

      <div
        data-testid="eventloop-console"
        className="rounded-lg border border-border bg-black/40 p-3 font-mono text-xs"
      >
        <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-label">
          {t("console")}
        </div>
        {frame.output.length === 0 ? (
          <span className="italic text-label">{t("consoleEmpty")}</span>
        ) : (
          <ol className="space-y-0.5">
            <AnimatePresence initial={false}>
              {frame.output.map((line, i) => (
                <motion.li
                  key={`${i}-${line}`}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reduce ? 0 : 0.2 }}
                  className="text-foreground"
                >
                  <span className="mr-2 select-none text-label">{i + 1}</span>
                  {line}
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        )}
      </div>
    </div>
  );
}
