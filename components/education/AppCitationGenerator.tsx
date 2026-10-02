"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Copy,
  Check,
  Plus,
  Trash2,
  RotateCcw,
  Globe,
  Book,
  FileText,
  Youtube,
  Newspaper,
} from "lucide-react";
import {
  formatCitation,
  type CitationFormat,
  type SourceType,
  type Author,
  type CitationInput,
} from "@/lib/citationFormatter";
import { AppButton, AppInput } from "@/components/ui";

interface Props {
  locale: string;
}

const SOURCE_TYPES: { id: SourceType; icon: React.ReactNode; key: string }[] = [
  { id: "website", icon: <Globe className="w-3.5 h-3.5" />, key: "sourceWebsite" },
  { id: "book", icon: <Book className="w-3.5 h-3.5" />, key: "sourceBook" },
  { id: "journal", icon: <FileText className="w-3.5 h-3.5" />, key: "sourceJournal" },
  { id: "youtube", icon: <Youtube className="w-3.5 h-3.5" />, key: "sourceYoutube" },
  { id: "newspaper", icon: <Newspaper className="w-3.5 h-3.5" />, key: "sourceNewspaper" },
];

export default function AppCitationGenerator({ locale }: Props) {
  const t = useTranslations("citationGenerator");

  const defaultFormat: CitationFormat = locale === "pt" ? "abnt" : "apa";
  const [format, setFormat] = useState<CitationFormat>(defaultFormat);
  const [sourceType, setSourceType] = useState<SourceType>("website");
  const [authors, setAuthors] = useState<Author[]>([{ lastName: "", firstName: "" }]);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const formats: { id: CitationFormat; label: string }[] = [
    { id: "apa", label: t("formatApa") },
    { id: "mla", label: t("formatMla") },
    { id: "chicago", label: t("formatChicago") },
    ...(locale === "pt" ? [{ id: "abnt" as CitationFormat, label: t("formatAbnt") }] : []),
  ];

  const input: CitationInput = {
    sourceType,
    authors: authors.filter((a) => a.lastName || a.firstName),
    title: fields.title || "",
    year: fields.year,
    month: fields.month,
    day: fields.day,
    url: fields.url,
    accessDate: fields.accessDate,
    siteName: fields.siteName,
    publisher: fields.publisher,
    city: fields.city,
    edition: fields.edition,
    journalName: fields.journalName,
    volume: fields.volume,
    issue: fields.issue,
    pages: fields.pages,
    doi: fields.doi,
    channelName: fields.channelName,
    newspaper: fields.newspaper,
  };

  const citation = formatCitation(input, format);

  function updateField(key: string, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  function updateAuthor(index: number, key: keyof Author, value: string) {
    setAuthors((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [key]: value } : a)),
    );
  }

  function addAuthor() {
    if (authors.length < 6) {
      setAuthors((prev) => [...prev, { lastName: "", firstName: "" }]);
    }
  }

  function removeAuthor(index: number) {
    setAuthors((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCopy() {
    if (!citation) return;
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() {
    setAuthors([{ lastName: "", firstName: "" }]);
    setFields({});
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/70">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-mono font-semibold uppercase text-label mr-1">
            {locale === "pt" ? "Estilo:" : locale === "es" ? "Estilo:" : "Style:"}
          </span>
          {formats.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFormat(f.id)}
              className={`px-3 py-1.5 text-xs font-mono font-semibold uppercase rounded-[2px] transition-colors border ${
                format === f.id
                  ? "bg-secondary text-background border-secondary"
                  : "bg-background border-border text-foreground hover:border-secondary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <AppButton
          color="tertiary"
          small
          onClick={handleReset}
          className="self-end sm:self-auto text-xs font-mono"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          iconPosition="left"
        >
          {locale === "pt" ? "Limpar" : locale === "es" ? "Limpiar" : "Reset"}
        </AppButton>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-4 mb-5 border-b border-border/60">
        <span className="text-xs font-mono font-semibold uppercase text-label mr-1">
          {locale === "pt" ? "Fonte:" : locale === "es" ? "Fuente:" : "Source:"}
        </span>
        {SOURCE_TYPES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSourceType(s.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-[2px] transition-colors border ${
              sourceType === s.id
                ? "bg-secondary text-background border-secondary font-semibold"
                : "bg-background border-border text-foreground hover:border-secondary"
            }`}
          >
            {s.icon}
            <span>{t(s.key as Parameters<typeof t>[0])}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-xs font-mono font-semibold uppercase text-label tracking-wide">
            {t("authorLabel")}
          </label>
          {authors.map((a, i) => (
            <div key={i} className="flex items-center gap-2">
              <AppInput
                id={`author-last-${i}`}
                value={a.lastName}
                onChange={(e) => updateAuthor(i, "lastName", e.target.value)}
                placeholder={t("authorLastName")}
                className="font-mono text-xs sm:text-sm h-10 flex-1"
              />
              <AppInput
                id={`author-first-${i}`}
                value={a.firstName}
                onChange={(e) => updateAuthor(i, "firstName", e.target.value)}
                placeholder={t("authorFirstName")}
                className="font-mono text-xs sm:text-sm h-10 flex-1"
              />
              {authors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAuthor(i)}
                  aria-label={t("removeAuthor")}
                  title={t("removeAuthor")}
                  className="p-2 text-label hover:text-red-500 rounded-[2px] transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {authors.length < 6 && (
            <AppButton
              type="button"
              color="tertiary"
              small
              onClick={addAuthor}
              className="font-mono text-xs mt-1"
              icon={<Plus className="w-3.5 h-3.5" />}
              iconPosition="left"
            >
              {t("addAuthor")}
            </AppButton>
          )}
        </div>

        <div>
          <AppInput
            id="citation-title"
            label={t("titleField")}
            value={fields.title || ""}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder={
              sourceType === "book"
                ? "Clean Code: A Handbook of Agile Software Craftsmanship"
                : "Building Accessible Web Applications"
            }
            className="font-mono text-xs sm:text-sm h-10"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {(sourceType === "website" ||
            sourceType === "newspaper" ||
            sourceType === "journal" ||
            sourceType === "youtube") && (
            <>
              <AppInput
                id="citation-year"
                label={t("year")}
                value={fields.year || ""}
                onChange={(e) => updateField("year", e.target.value)}
                placeholder="2026"
                className="font-mono text-xs sm:text-sm h-10"
              />
              <AppInput
                id="citation-month"
                label={t("month")}
                value={fields.month || ""}
                onChange={(e) => updateField("month", e.target.value)}
                placeholder="September"
                className="font-mono text-xs sm:text-sm h-10"
              />
              <AppInput
                id="citation-day"
                label={t("day")}
                value={fields.day || ""}
                onChange={(e) => updateField("day", e.target.value)}
                placeholder="27"
                className="font-mono text-xs sm:text-sm h-10"
              />
            </>
          )}

          {sourceType === "book" && (
            <>
              <AppInput
                id="citation-year"
                label={t("year")}
                value={fields.year || ""}
                onChange={(e) => updateField("year", e.target.value)}
                placeholder="2024"
                className="font-mono text-xs sm:text-sm h-10"
              />
              <AppInput
                id="citation-publisher"
                label={t("publisher")}
                value={fields.publisher || ""}
                onChange={(e) => updateField("publisher", e.target.value)}
                placeholder="O'Reilly Media"
                className="font-mono text-xs sm:text-sm h-10"
              />
              <AppInput
                id="citation-city"
                label={t("city")}
                value={fields.city || ""}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="Boston"
                className="font-mono text-xs sm:text-sm h-10"
              />
              <AppInput
                id="citation-edition"
                label={t("edition")}
                value={fields.edition || ""}
                onChange={(e) => updateField("edition", e.target.value)}
                placeholder="2nd"
                className="font-mono text-xs sm:text-sm h-10"
              />
            </>
          )}

          {sourceType === "website" && (
            <>
              <AppInput
                id="citation-site-name"
                label={t("siteName")}
                value={fields.siteName || ""}
                onChange={(e) => updateField("siteName", e.target.value)}
                placeholder="ToolNotch"
                className="font-mono text-xs sm:text-sm h-10"
              />
              <AppInput
                id="citation-url"
                label={t("url")}
                value={fields.url || ""}
                onChange={(e) => updateField("url", e.target.value)}
                placeholder="https://toolnotch.com/example"
                className="font-mono text-xs sm:text-sm h-10"
              />
              <AppInput
                id="citation-access-date"
                label={t("accessDate")}
                value={fields.accessDate || ""}
                onChange={(e) => updateField("accessDate", e.target.value)}
                placeholder="September 27, 2026"
                className="font-mono text-xs sm:text-sm h-10"
              />
            </>
          )}

          {sourceType === "journal" && (
            <>
              <AppInput
                id="citation-journal-name"
                label={t("journalName")}
                value={fields.journalName || ""}
                onChange={(e) => updateField("journalName", e.target.value)}
                placeholder="Nature"
                className="font-mono text-xs sm:text-sm h-10"
              />
              <AppInput
                id="citation-volume"
                label={t("volume")}
                value={fields.volume || ""}
                onChange={(e) => updateField("volume", e.target.value)}
                placeholder="42"
                className="font-mono text-xs sm:text-sm h-10"
              />
              <AppInput
                id="citation-issue"
                label={t("issue")}
                value={fields.issue || ""}
                onChange={(e) => updateField("issue", e.target.value)}
                placeholder="3"
                className="font-mono text-xs sm:text-sm h-10"
              />
              <AppInput
                id="citation-pages"
                label={t("pages")}
                value={fields.pages || ""}
                onChange={(e) => updateField("pages", e.target.value)}
                placeholder="101-115"
                className="font-mono text-xs sm:text-sm h-10"
              />
              <AppInput
                id="citation-doi"
                label={t("doi")}
                value={fields.doi || ""}
                onChange={(e) => updateField("doi", e.target.value)}
                placeholder="10.1038/s41586"
                className="font-mono text-xs sm:text-sm h-10"
              />
            </>
          )}

          {sourceType === "youtube" && (
            <>
              <AppInput
                id="citation-channel-name"
                label={t("channelName")}
                value={fields.channelName || ""}
                onChange={(e) => updateField("channelName", e.target.value)}
                placeholder="Channel Name"
                className="font-mono text-xs sm:text-sm h-10"
              />
              <AppInput
                id="citation-url"
                label={t("url")}
                value={fields.url || ""}
                onChange={(e) => updateField("url", e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="font-mono text-xs sm:text-sm h-10"
              />
            </>
          )}

          {sourceType === "newspaper" && (
            <>
              <AppInput
                id="citation-newspaper"
                label={t("newspaper")}
                value={fields.newspaper || ""}
                onChange={(e) => updateField("newspaper", e.target.value)}
                placeholder="The New York Times"
                className="font-mono text-xs sm:text-sm h-10"
              />
              <AppInput
                id="citation-city"
                label={t("city")}
                value={fields.city || ""}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="New York"
                className="font-mono text-xs sm:text-sm h-10"
              />
              <AppInput
                id="citation-pages"
                label={t("pages")}
                value={fields.pages || ""}
                onChange={(e) => updateField("pages", e.target.value)}
                placeholder="A1-A4"
                className="font-mono text-xs sm:text-sm h-10"
              />
            </>
          )}
        </div>

        <div className="mt-6 pt-5 border-t border-border/80">
          <div className="flex items-center justify-between mb-2">
            <span className="block text-xs font-mono font-semibold uppercase text-label tracking-wide">
              {t("outputHeading")} ({format.toUpperCase()})
            </span>
            {citation && (
              <AppButton
                type="button"
                color="tertiary"
                small
                onClick={handleCopy}
                className="font-mono text-xs h-8"
                icon={
                  copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )
                }
                iconPosition="left"
              >
                {copied ? t("copied") : t("copy")}
              </AppButton>
            )}
          </div>

          <div
            id="formatted-citation-output"
            aria-live="polite"
            className="p-4 sm:p-5 bg-tertiary border border-border rounded-[2px] min-h-[72px] flex items-center"
          >
            {citation ? (
              <p className="font-mono text-xs sm:text-sm text-foreground leading-relaxed break-words select-all">
                {citation}
              </p>
            ) : (
              <p className="font-mono text-xs text-label italic">
                {t("emptyState")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
