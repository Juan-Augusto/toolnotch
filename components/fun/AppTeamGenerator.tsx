"use client";

import { useState, useMemo, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Trash2,
  Users,
  Shuffle,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Layers,
  Trophy,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  AppButton,
  AppInput,
  AppTextarea,
  AppSegmentedControl,
  AppBadge,
} from "@/components/ui";
import {
  splitIntoTeams,
  splitTeamsBySize,
  splitIntoCustomNamedTeams,
  validateTeamCount,
  validateTeamSize,
  validateCustomTeamNames,
  CustomNamedTeam,
} from "@/lib/teamGenerator";

const SAMPLE_NAMES = [
  "Alice",
  "Bob",
  "Carol",
  "Dave",
  "Eve",
  "Frank",
  "Grace",
  "Heidi",
  "Ivan",
  "Judy",
];

const SAMPLE_TEAM_NAMES: Record<string, string[]> = {
  pt: ["Time Backend", "Time Frontend", "Time Infra", "Time QA"],
  es: ["Equipo Backend", "Equipo Frontend", "Equipo Infra", "Equipo QA"],
  en: ["Backend Team", "Frontend Team", "Infra Team", "QA Team"],
};

const TEAM_ACCENTS = [
  {
    border: "border-t-4 border-t-neon",
    numberBg: "bg-primary/15 text-primary border-primary/40",
  },
  {
    border: "border-t-4 border-t-blue-500",
    numberBg:
      "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  {
    border: "border-t-4 border-t-purple-500",
    numberBg:
      "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  {
    border: "border-t-4 border-t-amber-500",
    numberBg:
      "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  {
    border: "border-t-4 border-t-rose-500",
    numberBg:
      "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
  },
  {
    border: "border-t-4 border-t-teal-500",
    numberBg:
      "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
  },
  {
    border: "border-t-4 border-t-indigo-500",
    numberBg:
      "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
  },
  {
    border: "border-t-4 border-t-orange-500",
    numberBg:
      "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  },
  {
    border: "border-t-4 border-t-cyan-500",
    numberBg:
      "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
  },
  {
    border: "border-t-4 border-t-fuchsia-500",
    numberBg:
      "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/30",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 14 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 280, damping: 22 },
  },
  exit: { opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.15 } },
};

const nameVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0 },
};

interface AppTeamGeneratorProps {
  locale?: string;
}

export default function AppTeamGenerator({ locale = "pt" }: AppTeamGeneratorProps = {}) {
  const t = useTranslations("fun.teamGenerator");
  const isPt = locale === "pt";
  const isEs = locale === "es";
  const removeAriaLabel = (name: string) =>
    isPt ? `Remover ${name}` : isEs ? `Eliminar ${name}` : `Remove ${name}`;

  const [participants, setParticipants] = useState<string[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [showBulk, setShowBulk] = useState(false);

  const [mode, setMode] = useState<"byTeams" | "byTeamSize" | "byTeamNames">(
    "byTeams",
  );
  const [teamCount, setTeamCount] = useState(2);
  const [teamSize, setTeamSize] = useState(3);

  const [customTeamNames, setCustomTeamNames] = useState<string[]>([]);
  const [teamNameInput, setTeamNameInput] = useState("");
  const [teamNameBulkText, setTeamNameBulkText] = useState("");
  const [showTeamNameBulk, setShowTeamNameBulk] = useState(false);

  const [teams, setTeams] = useState<CustomNamedTeam[]>([]);
  const [copied, setCopied] = useState(false);
  const [key, setKey] = useState(0);

  // Validation
  const teamCountValidation = useMemo(() => {
    return validateTeamCount(participants.length, teamCount);
  }, [participants.length, teamCount]);

  const teamCountError = useMemo(() => {
    if (teamCountValidation.valid) return null;
    return t(
      `errors.${teamCountValidation.errorKey}`,
      teamCountValidation.errorParams ?? {},
    );
  }, [teamCountValidation, t]);

  const teamSizeValidation = useMemo(() => {
    return validateTeamSize(participants.length, teamSize);
  }, [participants.length, teamSize]);

  const teamSizeError = useMemo(() => {
    if (teamSizeValidation.valid) return null;
    return t(
      `errors.${teamSizeValidation.errorKey}`,
      teamSizeValidation.errorParams ?? {},
    );
  }, [teamSizeValidation, t]);

  const customTeamNamesValidation = useMemo(() => {
    return validateCustomTeamNames(participants.length, customTeamNames.length);
  }, [participants.length, customTeamNames.length]);

  const customTeamNamesError = useMemo(() => {
    if (customTeamNamesValidation.valid) return null;
    return t(
      `errors.${customTeamNamesValidation.errorKey}`,
      customTeamNamesValidation.errorParams ?? {},
    );
  }, [customTeamNamesValidation, t]);

  const isValid =
    mode === "byTeams"
      ? teamCountValidation.valid
      : mode === "byTeamSize"
        ? teamSizeValidation.valid
        : customTeamNamesValidation.valid;

  // Handlers - Participants
  const addParticipant = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setParticipants((prev) => [...prev, trimmed]);
    setNameInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addParticipant();
    }
  };

  const addBulkParticipants = () => {
    const names = bulkText
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    if (names.length === 0) return;
    setParticipants((prev) => [...prev, ...names]);
    setBulkText("");
    setShowBulk(false);
  };

  const removeParticipant = (index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setParticipants([]);
    setTeams([]);
  };

  const loadSample = () => {
    setParticipants(SAMPLE_NAMES);
  };

  // Handlers - Custom Team Names
  const addTeamName = () => {
    const trimmed = teamNameInput.trim();
    if (!trimmed) return;
    setCustomTeamNames((prev) => [...prev, trimmed]);
    setTeamNameInput("");
  };

  const handleTeamNameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTeamName();
    }
  };

  const addBulkTeamNames = () => {
    const names = teamNameBulkText
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    if (names.length === 0) return;
    setCustomTeamNames((prev) => [...prev, ...names]);
    setTeamNameBulkText("");
    setShowTeamNameBulk(false);
  };

  const removeTeamName = (index: number) => {
    setCustomTeamNames((prev) => prev.filter((_, i) => i !== index));
  };

  const clearTeamNames = () => {
    setCustomTeamNames([]);
  };

  const loadSampleTeamNames = () => {
    const list = SAMPLE_TEAM_NAMES[locale] ?? SAMPLE_TEAM_NAMES.en;
    setCustomTeamNames(list);
  };

  const generate = () => {
    if (!isValid) return;
    if (mode === "byTeams") {
      const result = splitIntoTeams(participants, teamCount);
      setTeams(
        result.map((members, i) => ({
          name: t("results.teamTitle", { number: i + 1 }),
          members,
        })),
      );
    } else if (mode === "byTeamSize") {
      const res = splitTeamsBySize(participants, teamSize);
      setTeams(
        res.teams.map((members, i) => ({
          name: t("results.teamTitle", { number: i + 1 }),
          members,
        })),
      );
    } else {
      const res = splitIntoCustomNamedTeams(participants, customTeamNames);
      setTeams(res);
    }
    setKey((k) => k + 1);
  };

  const copy = async () => {
    const text = teams
      .map((team) => `${team.name}: ${team.members.join(", ")}`)
      .join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasAnySmallerTeam = useMemo(() => {
    if (teams.length <= 1) return false;
    const maxSize = Math.max(...teams.map((t) => t.members.length));
    const minSize = Math.min(...teams.map((t) => t.members.length));
    return maxSize > minSize;
  }, [teams]);

  return (
    <div className="space-y-6 w-full">
      {/* 1. PARTICIPANTS MANAGEMENT SECTION */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-border/80">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-base sm:text-lg font-bold font-mono tracking-tight text-foreground">
              {t("participants.title")}
            </h3>
            <AppBadge bg="bg-primary/10" text="text-primary" className="border border-primary/40 font-mono">
              {t("participants.count", { count: participants.length })}
            </AppBadge>
          </div>

          <div className="flex items-center gap-2">
            <AppButton
              type="button"
              small
              color="tertiary"
              onClick={loadSample}
              className="font-mono text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-primary" />
              {t("participants.loadSample")}
            </AppButton>
            {participants.length > 0 && (
              <AppButton
                type="button"
                small
                color="tertiary"
                onClick={clearAll}
                className="font-mono text-xs text-danger hover:text-danger"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                {t("participants.clearAll")}
              </AppButton>
            )}
          </div>
        </div>

        {/* Input row */}
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <AppInput
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("participants.inputPlaceholder")}
              className="font-mono text-xs sm:text-sm"
            />
          </div>
          <AppButton
            type="button"
            color="primary"
            small
            onClick={addParticipant}
            disabled={!nameInput.trim()}
            className="font-mono text-xs whitespace-nowrap h-[42px] px-4"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            {t("participants.addButton")}
          </AppButton>
        </div>

        {/* Bulk Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowBulk(!showBulk)}
            className="text-xs font-mono font-medium text-primary hover:underline flex items-center gap-1.5 cursor-pointer select-none"
          >
            {showBulk ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
            <span>{t("participants.bulkToggle")}</span>
          </button>

          {showBulk && (
            <div className="mt-2.5 p-3.5 border border-border/80 rounded-[2px] bg-secondary/5 space-y-3">
              <AppTextarea
                rows={4}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={t("participants.bulkPlaceholder")}
                className="font-mono text-xs sm:text-sm"
              />
              <div className="flex justify-end">
                <AppButton
                  type="button"
                  color="primary"
                  small
                  disabled={!bulkText.trim()}
                  onClick={addBulkParticipants}
                  className="font-mono text-xs"
                >
                  {t("participants.bulkAddButton")}
                </AppButton>
              </div>
            </div>
          )}
        </div>

        {/* Participant Chips List */}
        <div className="p-3 border border-border/80 rounded-[2px] bg-background/50 min-h-[72px]">
          {participants.length === 0 ? (
            <p className="text-xs font-mono text-muted-foreground text-center py-4">
              {t("participants.empty")}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {participants.map((name, index) => (
                  <motion.span
                    key={`${name}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary/15 border border-border/80 text-foreground text-xs sm:text-sm font-mono rounded-[2px] group"
                  >
                    <span className="font-medium truncate max-w-[200px]">{name}</span>
                    <button
                      type="button"
                      onClick={() => removeParticipant(index)}
                      className="text-muted-foreground hover:text-danger p-0.5 rounded transition-colors cursor-pointer"
                      aria-label={removeAriaLabel(name)}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* 2. TEAM CONFIGURATION (MODE SWITCH & INPUTS) */}
      <div className="space-y-4 pt-2">
        <AppSegmentedControl
          fullWidth
          value={mode}
          onChange={(val) => setMode(val as "byTeams" | "byTeamSize" | "byTeamNames")}
          options={[
            { label: t("mode.byTeams"), value: "byTeams" },
            { label: t("mode.byTeamSize"), value: "byTeamSize" },
            { label: t("mode.byTeamNames"), value: "byTeamNames" },
          ]}
        />

        {/* Mode 1: Fixed Team Count */}
        {mode === "byTeams" && (
          <div className="space-y-1.5 w-full">
            <label className="block text-xs sm:text-sm font-mono font-medium text-foreground">
              {t("teamCount.label")}
            </label>
            <input
              type="number"
              min={2}
              max={participants.length || 2}
              value={teamCount}
              onChange={(e) => setTeamCount(parseInt(e.target.value, 10) || 0)}
              aria-invalid={Boolean(teamCountError && participants.length >= 2)}
              className={`w-full px-4 py-2.5 border rounded-[2px] font-mono text-xs sm:text-sm bg-tertiary text-foreground focus:outline-none focus:ring-1 transition-colors ${
                teamCountError && participants.length >= 2
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-border hover:border-foreground/30 focus:border-secondary focus:ring-secondary/20"
              }`}
            />
            {teamCountError && participants.length >= 2 ? (
              <p className="text-xs font-mono text-red-500 mt-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {teamCountError}
              </p>
            ) : (
              <p className="text-[11px] font-mono text-muted-foreground mt-1">
                {t("teamCount.hint")}
              </p>
            )}
          </div>
        )}

        {/* Mode 2: Team Size */}
        {mode === "byTeamSize" && (
          <div className="space-y-1.5 w-full">
            <label className="block text-xs sm:text-sm font-mono font-medium text-foreground">
              {t("teamSize.label")}
            </label>
            <input
              type="number"
              min={1}
              max={Math.max(1, participants.length - 1)}
              value={teamSize}
              onChange={(e) => setTeamSize(parseInt(e.target.value, 10) || 0)}
              aria-invalid={Boolean(teamSizeError && participants.length >= 2)}
              className={`w-full px-4 py-2.5 border rounded-[2px] font-mono text-xs sm:text-sm bg-tertiary text-foreground focus:outline-none focus:ring-1 transition-colors ${
                teamSizeError && participants.length >= 2
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-border hover:border-foreground/30 focus:border-secondary focus:ring-secondary/20"
              }`}
            />
            {teamSizeError && participants.length >= 2 ? (
              <p className="text-xs font-mono text-red-500 mt-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {teamSizeError}
              </p>
            ) : (
              <p className="text-[11px] font-mono text-muted-foreground mt-1">
                {t("teamSize.hint")}
              </p>
            )}
          </div>
        )}

        {/* Mode 3: Custom Team Names */}
        {mode === "byTeamNames" && (
          <div className="space-y-3 w-full">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/80">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <h4 className="text-xs sm:text-sm font-bold font-mono text-foreground">
                  {t("teamNames.title")}
                </h4>
                <AppBadge bg="bg-primary/10" text="text-primary" className="border border-primary/40 font-mono">
                  {t("teamNames.count", { count: customTeamNames.length })}
                </AppBadge>
              </div>

              <div className="flex items-center gap-2">
                <AppButton
                  type="button"
                  small
                  color="tertiary"
                  onClick={loadSampleTeamNames}
                  className="font-mono text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-primary" />
                  {t("teamNames.loadSample")}
                </AppButton>
                {customTeamNames.length > 0 && (
                  <AppButton
                    type="button"
                    small
                    color="tertiary"
                    onClick={clearTeamNames}
                    className="font-mono text-xs text-danger hover:text-danger"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    {t("teamNames.clearAll")}
                  </AppButton>
                )}
              </div>
            </div>

            {/* Team Name Input row */}
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <AppInput
                  value={teamNameInput}
                  onChange={(e) => setTeamNameInput(e.target.value)}
                  onKeyDown={handleTeamNameKeyDown}
                  placeholder={t("teamNames.inputPlaceholder")}
                  className="font-mono text-xs sm:text-sm"
                />
              </div>
              <AppButton
                type="button"
                color="primary"
                small
                onClick={addTeamName}
                disabled={!teamNameInput.trim()}
                className="font-mono text-xs whitespace-nowrap h-[42px] px-4"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                {t("teamNames.addButton")}
              </AppButton>
            </div>

            {/* Bulk Team Names Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowTeamNameBulk(!showTeamNameBulk)}
                className="text-xs font-mono font-medium text-primary hover:underline flex items-center gap-1.5 cursor-pointer select-none"
              >
                {showTeamNameBulk ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
                <span>{t("teamNames.bulkToggle")}</span>
              </button>

              {showTeamNameBulk && (
                <div className="mt-2.5 p-3.5 border border-border/80 rounded-[2px] bg-secondary/5 space-y-3">
                  <AppTextarea
                    rows={4}
                    value={teamNameBulkText}
                    onChange={(e) => setTeamNameBulkText(e.target.value)}
                    placeholder={t("teamNames.bulkPlaceholder")}
                    className="font-mono text-xs sm:text-sm"
                  />
                  <div className="flex justify-end">
                    <AppButton
                      type="button"
                      color="primary"
                      small
                      disabled={!teamNameBulkText.trim()}
                      onClick={addBulkTeamNames}
                      className="font-mono text-xs"
                    >
                      {t("teamNames.bulkAddButton")}
                    </AppButton>
                  </div>
                </div>
              )}
            </div>

            {/* Team Names Chips List */}
            <div className="p-3 border border-border/80 rounded-[2px] bg-background/50 min-h-[72px]">
              {customTeamNames.length === 0 ? (
                <p className="text-xs font-mono text-muted-foreground text-center py-4">
                  {t("teamNames.empty")}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {customTeamNames.map((name, index) => (
                      <motion.span
                        key={`${name}-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary/15 border border-border/80 text-foreground text-xs sm:text-sm font-mono rounded-[2px] group"
                      >
                        <span className="font-medium truncate max-w-[200px]">{name}</span>
                        <button
                          type="button"
                          onClick={() => removeTeamName(index)}
                          className="text-muted-foreground hover:text-danger p-0.5 rounded transition-colors cursor-pointer"
                          aria-label={removeAriaLabel(name)}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {customTeamNamesError && participants.length >= 2 && (
              <p className="text-xs font-mono text-red-500 mt-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {customTeamNamesError}
              </p>
            )}
          </div>
        )}

        {/* Generate Button: Standard AppButton */}
        <div className="pt-2">
          <AppButton
            type="button"
            onClick={generate}
            disabled={!isValid || participants.length < 2}
            color="primary"
            className="w-full font-mono font-bold text-sm sm:text-base py-3 sm:py-3.5 tracking-wide"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            {t("button.generate")}
          </AppButton>
        </div>
      </div>

      {/* 3. GENERATED TEAMS RESULTS */}
      <AnimatePresence mode="wait">
        {teams.length > 0 && (
          <motion.div
            key={key}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="space-y-4 pt-4 border-t border-border/80"
          >
            <div className="flex flex-wrap justify-between items-center gap-3">
              <h3 className="text-base sm:text-xl font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span>
                  {t("results.title")} ({teams.length})
                </span>
              </h3>
              <AppButton
                type="button"
                color="tertiary"
                small
                onClick={copy}
                className="font-mono text-xs"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-primary mr-1.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                )}
                <span>
                  {copied ? t("results.copied") : t("results.copyAll")}
                </span>
              </AppButton>
            </div>

            {/* Notice when teams have uneven distribution */}
            {hasAnySmallerTeam && (
              <div className="text-xs sm:text-sm font-mono font-medium text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/35 rounded-[2px] p-3 flex items-center gap-2">
                <span className="shrink-0 text-base">⚠️</span>
                <span>{t("results.balancedNotice")}</span>
              </div>
            )}

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team, i) => {
                const maxSize = Math.max(...teams.map((t) => t.members.length));
                const minSize = Math.min(...teams.map((t) => t.members.length));
                const smaller =
                  maxSize > minSize && team.members.length < maxSize;
                const accent = TEAM_ACCENTS[i % TEAM_ACCENTS.length];

                return (
                  <motion.div
                    key={i}
                    variants={cardVariants}
                    className={`rounded-[2px] bg-background/60 border border-border/80 p-4 sm:p-5 flex flex-col justify-between ${accent.border}`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-border/80">
                        <div
                          title={team.name}
                          className="font-bold font-mono text-sm sm:text-base text-foreground truncate max-w-[220px] sm:max-w-[280px]"
                        >
                          {team.name}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {smaller ? (
                            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold px-2 py-0.5 rounded-[2px] bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/35">
                              ⚠️{" "}
                              {t("results.fewerMembers", {
                                count: team.members.length,
                              })}
                            </span>
                          ) : (
                            <span className="font-mono text-[11px] font-medium px-2 py-0.5 rounded-[2px] bg-tertiary border border-border/80 text-muted-foreground">
                              {t("results.memberCount", {
                                count: team.members.length,
                              })}
                            </span>
                          )}
                        </div>
                      </div>

                      <motion.ul
                        variants={{
                          visible: {
                            transition: {
                              staggerChildren: 0.05,
                              delayChildren: 0.05,
                            },
                          },
                        }}
                        className="space-y-1.5"
                      >
                        {team.members.map((name, memberIdx) => (
                          <motion.li
                            key={`${name}-${memberIdx}`}
                            variants={nameVariants}
                            className="text-xs sm:text-sm font-mono flex items-center gap-2 font-medium text-foreground py-0.5"
                          >
                            <span className="w-5 h-5 rounded-[2px] bg-secondary/20 border border-border/80 flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">
                              {memberIdx + 1}
                            </span>
                            <span className="truncate">{name}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
