"use client";

import { useState, useMemo } from "react";
import {
  AppCard,
  AppButton,
  AppInput,
  AppTextarea,
  AppBadge,
} from "@/components/ui";
import { testRegex, REGEX_PRESETS, type RegexPreset } from "@/lib/dev/regex";
import { Copy, Check, Code, Search, Replace, Sparkles, Info } from "lucide-react";

interface Props {
  locale?: string;
}

const INITIAL_PRESET = REGEX_PRESETS[0];

export default function AppRegexTester({ locale = "pt" }: Props) {
  const [pattern, setPattern] = useState(INITIAL_PRESET.pattern);
  const [flags, setFlags] = useState({
    g: true,
    i: false,
    m: true,
    s: false,
    u: false,
  });
  const [testText, setTestText] = useState(INITIAL_PRESET.sampleText);
  const [replacement, setReplacement] = useState("");
  const [activeTab, setActiveTab] = useState<"matches" | "replace">("matches");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const isPt = locale === "pt";

  const flagsString = useMemo(() => {
    return Object.entries(flags)
      .filter(([, active]) => active)
      .map(([f]) => f)
      .join("");
  }, [flags]);

  const toggleFlag = (flag: "g" | "i" | "m" | "s" | "u") => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const applyPreset = (preset: RegexPreset) => {
    setPattern(preset.pattern);
    setTestText(preset.sampleText);
    setFlags({
      g: preset.flags.includes("g"),
      i: preset.flags.includes("i"),
      m: preset.flags.includes("m"),
      s: preset.flags.includes("s"),
      u: preset.flags.includes("u"),
    });
  };

  const result = useMemo(() => {
    return testRegex(pattern, flagsString, testText, replacement);
  }, [pattern, flagsString, testText, replacement]);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Preset Library Card */}
      <AppCard border cornerAccents className="p-4 sm:p-5 bg-tertiary space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold uppercase font-mono text-foreground">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            {isPt ? "Modelos e Presets Prontos:" : "Ready Presets:"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {REGEX_PRESETS.map((p) => (
            <AppButton
              key={p.id}
              color="tertiary"
              small
              className="!bg-background text-sm font-mono !font-normal !py-1.5 !px-3"
              onClick={() => applyPreset(p)}
            >
              {p.name}
            </AppButton>
          ))}
        </div>
      </AppCard>

      {/* Regex Expression and Test Area Card */}
      <AppCard border cornerAccents className="p-5 sm:p-7 bg-tertiary space-y-5">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label htmlFor="regex-pattern" className="text-xs font-semibold uppercase font-mono text-foreground flex items-center gap-2">
              <Code className="w-4 h-4 text-primary" />
              {isPt ? "Expressão Regular (Pattern)" : "Regular Expression (Pattern)"}
            </label>

            {/* Flags Buttons */}
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-label font-mono mr-1">Flags:</span>
              {(["g", "i", "m", "s", "u"] as const).map((flag) => (
                <AppButton
                  key={flag}
                  color={flags[flag] ? "primary" : "tertiary"}
                  small
                  className={`font-mono text-sm !py-1 !px-2.5 ${!flags[flag] ? "!bg-background" : ""}`}
                  onClick={() => toggleFlag(flag)}
                  title={`${flag} flag`}
                >
                  {flag}
                </AppButton>
              ))}
            </div>
          </div>

          <div className="flex items-center bg-background border border-border rounded-[2px] overflow-hidden focus-within:ring-2 focus-within:ring-primary/40">
            <span className="px-3 text-label font-mono text-sm bg-tertiary border-r border-border select-none">
              /
            </span>
            <input
              id="regex-pattern"
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="[a-zA-Z0-9]+..."
              className="w-full font-mono text-sm p-2.5 bg-transparent focus:outline-none text-foreground"
            />
            <span className="px-3 text-label font-mono text-sm bg-tertiary border-l border-border select-none">
              /{flagsString}
            </span>
          </div>

          {!result.isValidPattern && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-[2px] text-sm font-mono">
              Erro de Sintaxe: {result.error}
            </div>
          )}
        </div>

        {/* Test String */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase font-mono text-foreground">
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" />
              {isPt ? "Texto de Teste" : "Test String"}
            </span>
            <span>
              {result.totalMatches} {isPt ? "correspondência(s)" : "match(es)"}
            </span>
          </div>
          <AppTextarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder={isPt ? "Insira o texto para testar a regex..." : "Insert test string here..."}
            rows={5}
            variant="background"
            className="w-full font-mono text-sm"
          />
        </div>
      </AppCard>

      {/* Tabs: Matches Table / Substitution */}
      <AppCard border cornerAccents className="p-5 sm:p-7 bg-tertiary space-y-5">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            <AppButton
              color={activeTab === "matches" ? "primary" : "tertiary"}
              small
              className={`font-mono text-sm ${activeTab !== "matches" ? "!bg-background" : ""}`}
              onClick={() => setActiveTab("matches")}
            >
              {isPt ? `Correspondências (${result.totalMatches})` : `Matches (${result.totalMatches})`}
            </AppButton>
            <AppButton
              color={activeTab === "replace" ? "primary" : "tertiary"}
              small
              className={`font-mono text-sm ${activeTab !== "replace" ? "!bg-background" : ""}`}
              onClick={() => setActiveTab("replace")}
              icon={<Replace className="w-4 h-4" />}
              iconPosition="left"
            >
              {isPt ? "Substituição / Replace" : "Substitution / Replace"}
            </AppButton>
          </div>
        </div>

        {activeTab === "matches" ? (
          result.matches.length > 0 ? (
            <div className="space-y-3">
              {result.matches.map((m, idx) => (
                <div key={idx} className="p-4 bg-background border border-border rounded-[2px] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-primary text-background font-normal px-2 py-0.5 rounded-[2px]">
                        Match #{idx + 1}
                      </span>
                      <span className="text-sm text-label font-mono">
                        pos: {m.index}..{m.index + m.length} ({m.length} chars)
                      </span>
                    </div>
                    <AppButton
                      color="tertiary"
                      small
                      className="!bg-background text-sm font-mono !py-1.5 !px-3"
                      icon={copiedKey === `match-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      iconPosition="left"
                      onClick={() => copyToClipboard(m.fullMatch, `match-${idx}`)}
                    >
                      {copiedKey === `match-${idx}` ? (isPt ? "Copiado!" : "Copied!") : (isPt ? "Copiar" : "Copy")}
                    </AppButton>
                  </div>

                  <div className="p-3 bg-tertiary rounded-[2px] font-mono text-sm text-foreground break-all border border-border">
                    {m.fullMatch}
                  </div>

                  {m.groups.length > 0 && (
                    <div className="pl-3 space-y-1.5 border-l-2 border-primary/50 pt-1">
                      <span className="text-xs uppercase font-mono text-label">
                        {isPt ? "Grupos de Captura:" : "Capture Groups:"}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {m.groups.map((g, gIdx) => (
                          <div key={gIdx} className="flex items-center gap-2 text-sm font-mono bg-tertiary p-2 rounded-[2px] border border-border">
                            <span className="text-label">
                              ${g.name ? g.name : g.index}:
                            </span>
                            <span className="text-foreground select-all font-normal">
                              {g.value || <span className="opacity-40 italic font-normal">(vazio)</span>}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-label font-mono">
              {pattern ? (isPt ? "Nenhuma correspondência encontrada." : "No matches found.") : (isPt ? "Digite uma regex para testar." : "Type a regex to test.")}
            </div>
          )
        ) : (
          /* Replace tab */
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="replace-pattern-input" className="text-xs font-semibold uppercase font-mono text-foreground">
                {isPt ? "Padrão de Substituição (suporta $1, $2, $&):" : "Replacement Pattern (supports $1, $2, $&):"}
              </label>
              <AppInput
                id="replace-pattern-input"
                type="text"
                value={replacement}
                onChange={(e) => setReplacement(e.target.value)}
                placeholder={isPt ? "Ex: [$1] ou [REMOVIDO]" : "Ex: [$1] or [REDACTED]"}
                className="font-mono text-sm"
              />
            </div>

            {/* Explanatory Help Box */}
            <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-2.5 text-xs font-mono">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Info className="w-4 h-4 text-primary shrink-0" />
                <span>
                  {isPt ? "Como funciona a Substituição (Replace)?" : "How does Substitution (Replace) work?"}
                </span>
              </div>
              <p className="text-label leading-relaxed font-sans text-xs">
                {isPt
                  ? "Esta aba substitui tudo o que a regex encontrou no seu texto pelo formato que você digitar. Você pode usar variáveis para reorganizar os grupos capturados:"
                  : "This tab replaces whatever matches the regex in your text with your custom pattern. Use variables to reorder captured groups:"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => setReplacement("[$1]")}
                  className="p-2.5 bg-tertiary hover:bg-tertiary/80 border border-border rounded-[2px] text-left transition-colors cursor-pointer group"
                >
                  <div className="text-primary font-bold group-hover:underline">$1, $2, $3...</div>
                  <div className="text-label text-[11px] mt-0.5 font-sans">
                    {isPt ? "Insere o grupo de captura correspondente ()" : "Inserts matching capture group ()"}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setReplacement("<b>$&</b>")}
                  className="p-2.5 bg-tertiary hover:bg-tertiary/80 border border-border rounded-[2px] text-left transition-colors cursor-pointer group"
                >
                  <div className="text-primary font-bold group-hover:underline">$&</div>
                  <div className="text-label text-[11px] mt-0.5 font-sans">
                    {isPt ? "Insere o texto inteiro correspondido" : "Inserts full matched string"}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setReplacement("[OCULTO]")}
                  className="p-2.5 bg-tertiary hover:bg-tertiary/80 border border-border rounded-[2px] text-left transition-colors cursor-pointer group"
                >
                  <div className="text-primary font-bold group-hover:underline">[TEXTO FIXO]</div>
                  <div className="text-label text-[11px] mt-0.5 font-sans">
                    {isPt ? "Troca o match por uma máscara ou texto fixo" : "Replaces match with static text/mask"}
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold uppercase font-mono text-foreground">
                <span>{isPt ? "Resultado da Substituição" : "Replaced Output"}</span>
                <AppButton
                  color="tertiary"
                  small
                  disabled={!result.replacedText}
                  className="!bg-background text-sm font-mono !py-2 !px-3.5"
                  icon={copiedKey === "replace" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  iconPosition="left"
                  onClick={() => copyToClipboard(result.replacedText || "", "replace")}
                >
                  {copiedKey === "replace" ? (isPt ? "Copiado!" : "Copied!") : (isPt ? "Copiar Resultado" : "Copy Result")}
                </AppButton>
              </div>
              <AppTextarea
                readOnly
                value={result.replacedText}
                rows={5}
                variant="background"
                className="w-full font-mono text-sm"
              />
            </div>
          </div>
        )}
      </AppCard>
    </div>
  );
}
