"use client";

import { useState, useMemo, useRef } from "react";
import {
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  History,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";
import {
  AppButton,
  AppTextarea,
  AppInput,
  AppCard,
  AppBadge,
  AppTabsChips,
  AppCheckbox,
  AppSelect,
} from "@/components/ui";

type FormatType = "slack" | "teams" | "markdown" | "plain";

interface Props {
  labels: Record<string, string>;
  locale?: string;
}

const STORAGE_KEY = "toolnotch_standup_history";

function cleanItem(line: string): string {
  return line.replace(/^[\s*\-•\d.]+\s*/, "").trim();
}

function formatItems(text: string, format: FormatType, autoBullets: boolean): string {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return "";

  if (!autoBullets) {
    return lines.join("\n");
  }

  const bulletChar = format === "slack" ? "•" : "-";
  return lines.map((l) => `${bulletChar} ${cleanItem(l)}`).join("\n");
}

function getStatusLabel(status: string, labels: Record<string, string>): string {
  switch (status) {
    case "normal":
      return labels.statusNormal || "Normal (em desenvolvimento)";
    case "deepWork":
      return labels.statusDeepWork || "Foco total (sem reuniões)";
    case "pairing":
      return labels.statusPairing || "Disponível para pareamento";
    case "onCall":
      return labels.statusOnCall || "Em plantão / On-call";
    case "halfDay":
      return labels.statusHalfDay || "Meio período";
    default:
      return status;
  }
}

export default function StandupGeneratorClient({ labels, locale = "pt" }: Props) {
  const [yesterday, setYesterday] = useState("");
  const [today, setToday] = useState("");
  const [blockers, setBlockers] = useState("");
  const [prs, setPrs] = useState("");
  const [status, setStatus] = useState("");
  const [autoBullets, setAutoBullets] = useState(true);
  const [format, setFormat] = useState<FormatType>("slack");
  const [showExtras, setShowExtras] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToastMessage(msg: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }

  function handleSaveHistory() {
    if (typeof window === "undefined") return;
    if (!today.trim()) return;
    try {
      const data = {
        today: today.trim(),
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      showToastMessage(labels.historySaved || "Salvo no navegador para amanhã!");
    } catch {
      // ignore
    }
  }

  function handleLoadHistory() {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        showToastMessage(labels.historyEmpty || "Nenhum histórico anterior encontrado.");
        return;
      }
      const data = JSON.parse(raw);
      if (data?.today) {
        setYesterday(data.today);
        showToastMessage(labels.historyLoaded || "Ontem carregado do histórico!");
      } else {
        showToastMessage(labels.historyEmpty || "Nenhum histórico anterior encontrado.");
      }
    } catch {
      showToastMessage(labels.historyEmpty || "Nenhum histórico anterior encontrado.");
    }
  }

  function handleLoadExample() {
    if (locale === "es") {
      setYesterday(
        "Revisión y merge del PR #142 (API de autenticación)\nConfiguración de pruebas de integración con Jest"
      );
      setToday(
        "Implementar pantalla de configuración de usuario\nAlineación con diseño sobre nuevos permisos"
      );
      setBlockers("Esperando credenciales del entorno de staging");
      setPrs("#142, #145");
      setStatus("normal");
    } else if (locale === "en") {
      setYesterday(
        "Reviewed and merged PR #142 (Auth API)\nConfigured Jest integration test pipeline"
      );
      setToday(
        "Implement user settings dashboard\nSync with product designer on layout specs"
      );
      setBlockers("Waiting on staging environment credentials");
      setPrs("#142, #145");
      setStatus("normal");
    } else {
      setYesterday(
        "Revisão e merge da PR #142 (API de autenticação)\nConfiguração de testes de integração com Jest"
      );
      setToday(
        "Implementação da tela de configurações de usuário\nAlinhamento com design sobre novas permissões"
      );
      setBlockers("Aguardando liberação de credenciais do ambiente de staging");
      setPrs("#142, #145");
      setStatus("normal");
    }
    setShowExtras(true);
  }

  function handleClear() {
    setYesterday("");
    setToday("");
    setBlockers("");
    setPrs("");
    setStatus("");
    setCopied(false);
  }

  const generatedOutput = useMemo(() => {
    const hasAnyContent =
      yesterday.trim().length > 0 ||
      today.trim().length > 0 ||
      blockers.trim().length > 0 ||
      prs.trim().length > 0;

    if (!hasAnyContent) return "";

    const bulletChar = format === "slack" ? "•" : "-";
    const noBlockersText = labels.noBlockers || "Nenhum";

    const yFormatted = formatItems(yesterday, format, autoBullets);
    const tFormatted = formatItems(today, format, autoBullets);
    const bFormatted = blockers.trim()
      ? formatItems(blockers, format, autoBullets)
      : autoBullets
        ? `${bulletChar} ${noBlockersText}`
        : noBlockersText;

    const prsFormatted = prs.trim() ? formatItems(prs, format, autoBullets) : "";
    const statusLabel = status ? getStatusLabel(status, labels) : "";

    const yesterdayHeading = labels.yesterdayHeading || "Ontem";
    const todayHeading = labels.todayHeading || "Hoje";
    const blockersHeading = labels.blockersHeading || "Bloqueios";
    const prsHeading = labels.prsHeading || "PRs / Tickets";
    const statusHeading = labels.statusHeading || "Status";

    if (format === "slack") {
      let out = `*✅ ${yesterdayHeading}:*\n${yFormatted || "• -"}\n\n*🎯 ${todayHeading}:*\n${tFormatted || "• -"}\n\n*🚧 ${blockersHeading}:*\n${bFormatted}`;
      if (prsFormatted) {
        out += `\n\n*🔗 ${prsHeading}:*\n${prsFormatted}`;
      }
      if (statusLabel) {
        out += `\n\n*⚡ ${statusHeading}:* ${statusLabel}`;
      }
      return out;
    }

    if (format === "teams") {
      let out = `**${yesterdayHeading}**\n${yFormatted || "- -"}\n\n**${todayHeading}**\n${tFormatted || "- -"}\n\n**${blockersHeading}**\n${bFormatted}`;
      if (prsFormatted) {
        out += `\n\n**${prsHeading}**\n${prsFormatted}`;
      }
      if (statusLabel) {
        out += `\n\n**${statusHeading}:** ${statusLabel}`;
      }
      return out;
    }

    if (format === "markdown") {
      let out = `### ${yesterdayHeading}\n${yFormatted || "- -"}\n\n### ${todayHeading}\n${tFormatted || "- -"}\n\n### ${blockersHeading}\n${bFormatted}`;
      if (prsFormatted) {
        out += `\n\n### ${prsHeading}\n${prsFormatted}`;
      }
      if (statusLabel) {
        out += `\n\n**${statusHeading}:** ${statusLabel}`;
      }
      return out;
    }

    // Plain text
    let out = `${yesterdayHeading}:\n${yFormatted || "- -"}\n\n${todayHeading}:\n${tFormatted || "- -"}\n\n${blockersHeading}:\n${bFormatted}`;
    if (prsFormatted) {
      out += `\n\n${prsHeading}:\n${prsFormatted}`;
    }
    if (statusLabel) {
      out += `\n\n${statusHeading}: ${statusLabel}`;
    }
    return out;
  }, [yesterday, today, blockers, prs, status, format, autoBullets, labels]);

  async function handleCopy() {
    if (!generatedOutput) return;
    await navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  const formatTabItems = [
    { id: "slack", label: labels.formatSlack || "Slack / Discord" },
    { id: "teams", label: labels.formatTeams || "Microsoft Teams" },
    { id: "markdown", label: labels.formatMarkdown || "Markdown" },
    { id: "plain", label: labels.formatPlain || "Texto Puro" },
  ];

  const statusOptions = [
    { value: "", label: "Nenhum" },
    { value: "normal", label: labels.statusNormal || "Normal (em desenvolvimento)" },
    { value: "deepWork", label: labels.statusDeepWork || "Foco total (sem reuniões)" },
    { value: "pairing", label: labels.statusPairing || "Disponível para pareamento" },
    { value: "onCall", label: labels.statusOnCall || "Em plantão / On-call" },
    { value: "halfDay", label: labels.statusHalfDay || "Meio período" },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="flex flex-wrap items-center gap-2">
          <AppButton
            type="button"
            color="secondary"
            onClick={handleLoadHistory}
            className="font-mono text-sm px-3.5 py-1.5"
          >
            <History className="w-4 h-4 mr-1.5 text-current" />
            <span>{labels.loadYesterday}</span>
          </AppButton>

          <AppButton
            type="button"
            color="tertiary"
            onClick={handleLoadExample}
            className="font-mono text-sm px-3.5 py-1.5"
          >
            <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" />
            <span>{labels.loadExample}</span>
          </AppButton>
        </div>

        <div className="flex items-center gap-2">
          {toast && (
            <AppBadge bg="bg-primary/10" text="text-primary" className="border border-primary/30 font-mono text-sm px-3 py-1">
              {toast}
            </AppBadge>
          )}

          <AppButton
            type="button"
            color="tertiary"
            onClick={handleClear}
            className="font-mono text-sm text-danger hover:text-danger px-3.5 py-1.5"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            <span>{labels.clearButton}</span>
          </AppButton>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
        {/* Left Column: Form Fields */}
        <AppCard border cornerAccents className="p-4 sm:p-6 bg-tertiary space-y-4">
          <div>
            <AppTextarea
              label={labels.yesterday}
              value={yesterday}
              onChange={(e) => setYesterday(e.target.value)}
              placeholder={labels.yesterdayPlaceholder}
              rows={3}
              className="font-mono text-sm sm:text-base"
            />
          </div>

          <div>
            <AppTextarea
              label={labels.today}
              value={today}
              onChange={(e) => setToday(e.target.value)}
              placeholder={labels.todayPlaceholder}
              rows={3}
              className="font-mono text-sm sm:text-base"
            />
          </div>

          <div>
            <AppTextarea
              label={labels.blockers}
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder={labels.blockersPlaceholder}
              rows={2}
              className="font-mono text-sm sm:text-base"
            />
          </div>

          {/* Toggle Extras Section */}
          <div className="pt-1 border-t border-border/60">
            <button
              type="button"
              onClick={() => setShowExtras(!showExtras)}
              className="flex items-center justify-between w-full py-2 text-sm font-mono font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span>{labels.prsAndTickets} &amp; {labels.status}</span>
              </span>
              {showExtras ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showExtras && (
              <div className="space-y-3 pt-3 animate-in fade-in duration-200">
                <AppInput
                  label={labels.prsAndTickets}
                  value={prs}
                  onChange={(e) => setPrs(e.target.value)}
                  placeholder={labels.prsAndTicketsPlaceholder}
                  className="font-mono text-sm sm:text-base"
                />

                <AppSelect
                  label={labels.status}
                  options={statusOptions}
                  value={status}
                  onChange={(val) => setStatus(val)}
                  searchable={false}
                  placeholder="Selecione um status..."
                />
              </div>
            )}
          </div>

          {/* Settings / Auto-bullets */}
          <div className="pt-2 flex items-center justify-between">
            <AppCheckbox
              label={labels.autoBullets}
              checked={autoBullets}
              onChange={(checked) => setAutoBullets(checked)}
            />

            {today.trim().length > 0 && (
              <button
                type="button"
                onClick={handleSaveHistory}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-primary hover:underline cursor-pointer"
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>{labels.saveHistory}</span>
              </button>
            )}
          </div>
        </AppCard>

        {/* Right Column: Live Formatted Output */}
        <div className="space-y-4">
          {/* Format Selector Tabs */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-mono font-bold uppercase text-foreground">
              Formato de Envio
            </span>
            <AppTabsChips
              items={formatTabItems}
              value={format}
              onChange={(val) => setFormat(val as FormatType)}
            />
          </div>

          {/* Output Card */}
          <AppCard border cornerAccents={false} className="p-4 sm:p-5 bg-background border-border/80 flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-mono font-bold text-sm uppercase text-foreground">
                    {labels.outputHeading || "Prévia do Standup"}
                  </h3>
                  <AppBadge bg="bg-primary/10" text="text-primary" className="font-mono text-xs border border-primary/30 uppercase">
                    {format}
                  </AppBadge>
                </div>

                <AppButton
                  onClick={handleCopy}
                  disabled={!generatedOutput}
                  color={copied ? "secondary" : "primary"}
                  className="font-mono text-sm px-4 h-[38px]"
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

              {generatedOutput ? (
                <div className="font-mono text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap select-all py-1">
                  {generatedOutput}
                </div>
              ) : (
                <div className="py-20 text-center text-sm font-mono text-muted-foreground/70">
                  Preencha os campos ao lado para ver a prévia formatada em tempo real ou clique em &quot;{labels.loadExample}&quot;.
                </div>
              )}
            </div>

            {today.trim().length > 0 && generatedOutput && (
              <div className="pt-3 mt-4 border-t border-border/60 flex items-center justify-between text-xs sm:text-sm font-mono text-muted-foreground">
                <span>Pronto para colar no seu canal</span>
                <button
                  type="button"
                  onClick={handleSaveHistory}
                  className="text-primary hover:underline inline-flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>{labels.saveHistory}</span>
                </button>
              </div>
            )}
          </AppCard>
        </div>
      </div>
    </div>
  );
}
