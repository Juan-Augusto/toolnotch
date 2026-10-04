"use client";

import { useState, useRef } from "react";
import { ThumbsUp, ThumbsDown, Trash2, Plus, Download, RotateCcw, Check, Sparkles } from "lucide-react";
import { AppButton, AppBadge, AppCard } from "@/components/ui";

interface Note {
  id: string;
  text: string;
  likes: number;
  dislikes: number;
  votes?: number;
}

type ColumnKey = "wentWell" | "toImprove" | "actionItems";

interface Board {
  wentWell: Note[];
  toImprove: Note[];
  actionItems: Note[];
}

interface ColumnConfig {
  key: ColumnKey;
  label: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
}

interface Props {
  columns: { wentWell: string; toImprove: string; actionItems: string };
  labels: {
    placeholder: string;
    addButton: string;
    voteAriaLabel: string;
    dislikeAriaLabel?: string;
    deleteAriaLabel: string;
    exportButton: string;
    clearButton: string;
    clearConfirm: string;
    emptyHint: string;
    exportHeading: string;
    copiedToast: string;
  };
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function RetroBoardTool({ columns, labels }: Props) {
  const [board, setBoard] = useState<Board>({
    wentWell: [],
    toImprove: [],
    actionItems: [],
  });
  const [inputs, setInputs] = useState({
    wentWell: "",
    toImprove: "",
    actionItems: "",
  });
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const COLS: ColumnConfig[] = [
    {
      key: "wentWell",
      label: columns.wentWell,
      accentText: "text-emerald-600 dark:text-emerald-400",
      accentBg: "bg-emerald-500/10",
      accentBorder: "border-emerald-500/30",
    },
    {
      key: "toImprove",
      label: columns.toImprove,
      accentText: "text-amber-600 dark:text-amber-400",
      accentBg: "bg-amber-500/10",
      accentBorder: "border-amber-500/30",
    },
    {
      key: "actionItems",
      label: columns.actionItems,
      accentText: "text-primary",
      accentBg: "bg-primary/10",
      accentBorder: "border-primary/30",
    },
  ];

  function addNote(colKey: ColumnKey) {
    const text = inputs[colKey].trim();
    if (!text) return;
    setBoard((prev) => ({
      ...prev,
      [colKey]: [
        ...prev[colKey],
        { id: makeId(), text, likes: 0, dislikes: 0, votes: 0 },
      ],
    }));
    setInputs((prev) => ({ ...prev, [colKey]: "" }));
  }

  function deleteNote(colKey: ColumnKey, id: string) {
    setBoard((prev) => ({
      ...prev,
      [colKey]: prev[colKey].filter((n) => n.id !== id),
    }));
  }

  function likeNote(colKey: ColumnKey, id: string) {
    setBoard((prev) => ({
      ...prev,
      [colKey]: prev[colKey].map((n) =>
        n.id === id
          ? {
              ...n,
              likes: (n.likes ?? n.votes ?? 0) + 1,
              votes: (n.likes ?? n.votes ?? 0) + 1,
            }
          : n
      ),
    }));
  }

  function dislikeNote(colKey: ColumnKey, id: string) {
    setBoard((prev) => ({
      ...prev,
      [colKey]: prev[colKey].map((n) =>
        n.id === id ? { ...n, dislikes: (n.dislikes ?? 0) + 1 } : n
      ),
    }));
  }

  function clearBoard() {
    if (window.confirm(labels.clearConfirm)) {
      setBoard({ wentWell: [], toImprove: [], actionItems: [] });
    }
  }

  function exportMarkdown() {
    const lines: string[] = [`# ${labels.exportHeading}`, ""];
    COLS.forEach((col) => {
      lines.push(`## ${col.label}`);
      const notes = board[col.key];
      if (notes.length === 0) {
        lines.push("_Sem notas_");
      } else {
        notes
          .slice()
          .sort((a, b) => {
            const scoreA = (a.likes ?? a.votes ?? 0) - (a.dislikes ?? 0);
            const scoreB = (b.likes ?? b.votes ?? 0) - (b.dislikes ?? 0);
            return scoreB - scoreA;
          })
          .forEach((n) => {
            const l = n.likes ?? n.votes ?? 0;
            const d = n.dislikes ?? 0;
            const reactions =
              l > 0 || d > 0
                ? ` (${l > 0 ? `👍 ${l}` : ""}${l > 0 && d > 0 ? " | " : ""}${d > 0 ? `👎 ${d}` : ""})`
                : "";
            lines.push(`- ${n.text}${reactions}`);
          });
      }
      lines.push("");
    });
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2200);
    });
  }

  const totalNotes =
    board.wentWell.length + board.toImprove.length + board.actionItems.length;

  return (
    <div className="space-y-6 w-full">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <AppBadge bg="bg-primary/10" text="text-primary" className="border border-primary/30 font-mono text-sm px-2.5 py-1">
            {totalNotes} {totalNotes === 1 ? "nota" : "notas"}
          </AppBadge>
        </div>

        <div className="flex items-center gap-2">
          <AppButton
            type="button"
            color="secondary"
            onClick={exportMarkdown}
            className="font-mono text-sm px-3.5 py-1.5"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1.5 text-emerald-500" />
                <span>{labels.copiedToast}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-1.5" />
                <span>{labels.exportButton}</span>
              </>
            )}
          </AppButton>

          {totalNotes > 0 && (
            <AppButton
              type="button"
              color="tertiary"
              onClick={clearBoard}
              className="font-mono text-sm text-danger hover:text-danger px-3.5 py-1.5"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              <span>{labels.clearButton}</span>
            </AppButton>
          )}
        </div>
      </div>

      {/* 3 Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-start w-full">
        {COLS.map((col) => {
          const notes = board[col.key];
          return (
            <div
              key={col.key}
              className={`rounded-[2px] border ${col.accentBorder} bg-background/50 flex flex-col overflow-hidden`}
            >
              {/* Column Header */}
              <div
                className={`px-3.5 py-2.5 sm:px-4 sm:py-3 border-b ${col.accentBorder} ${col.accentBg} flex items-center justify-between`}
              >
                <h3 className={`font-mono font-bold text-xs sm:text-sm uppercase tracking-wider ${col.accentText}`}>
                  {col.label}
                </h3>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-[2px] bg-background/80 border border-border/60 text-foreground">
                  {notes.length}
                </span>
              </div>

              {/* Notes List */}
              <div className="p-3.5 space-y-2.5 min-h-[160px] flex flex-col justify-start">
                {notes.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground font-mono">
                    {labels.emptyHint}
                  </div>
                ) : (
                  notes.map((note) => (
                    <AppCard
                      key={note.id}
                      border
                      cornerAccents={false}
                      className="p-3.5 bg-tertiary flex flex-col gap-2.5 group transition-all"
                    >
                      <p className="text-sm sm:text-base text-foreground leading-relaxed break-words">
                        {note.text}
                      </p>
                      <div className="flex items-center justify-between pt-1.5 border-t border-border/40">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => likeNote(col.key, note.id)}
                            aria-label={labels.voteAriaLabel}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-muted/60 hover:bg-muted text-foreground hover:text-emerald-500 transition-colors font-mono text-xs cursor-pointer"
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="font-semibold">{note.likes ?? note.votes ?? 0}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => dislikeNote(col.key, note.id)}
                            aria-label={labels.dislikeAriaLabel || "Votar contra"}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-muted/60 hover:bg-muted text-foreground hover:text-rose-500 transition-colors font-mono text-xs cursor-pointer"
                          >
                            <ThumbsDown className="w-3.5 h-3.5 text-rose-500" />
                            <span className="font-semibold">{note.dislikes ?? 0}</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteNote(col.key, note.id)}
                          aria-label={labels.deleteAriaLabel}
                          className="text-muted-foreground/60 hover:text-danger p-1 rounded transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </AppCard>
                  ))
                )}
              </div>

              {/* Add Note Input Box */}
              <div className="p-3.5 border-t border-border/60 bg-tertiary/40">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addNote(col.key);
                  }}
                  className="flex gap-2 items-center"
                >
                  <input
                    type="text"
                    value={inputs[col.key]}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, [col.key]: e.target.value }))
                    }
                    placeholder={labels.placeholder}
                    className="flex-1 px-3.5 py-2 text-sm sm:text-base font-mono bg-background border border-border rounded-[2px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-colors min-w-0"
                  />
                  <AppButton
                    type="submit"
                    color="primary"
                    disabled={!inputs[col.key].trim()}
                    className="font-mono text-sm px-4 h-[42px] shrink-0"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    <span>{labels.addButton}</span>
                  </AppButton>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
