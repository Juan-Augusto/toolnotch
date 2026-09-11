import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AppCard from "@/components/ui/AppCard";
import AppBadge from "@/components/ui/AppBadge";
import AppButton from "@/components/ui/AppButton";
import AppTip from "@/components/ui/AppTip";

export interface BodyBlock {
  type: "paragraph" | "heading" | "callout" | "list" | "toolCta" | "table";
  level?: number;
  text?: string;
  items?: string[];
  ordered?: boolean;
  toolName?: string;
  toolPath?: string;
  headers?: string[];
  rows?: string[][];
}

interface AppArticleBodyProps {
  blocks: BodyBlock[];
  putIntoPracticeLabel?: string;
  tryToolLabel?: string;
}

function renderFormattedText(text?: string): React.ReactNode {
  if (!text) return null;
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);
  return parts.filter(Boolean).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic text-foreground/90">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded-[2px] bg-tertiary text-xs text-primary border border-border"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      return (
        <Link
          key={i}
          href={href}
          className="text-secondary hover:text-primary underline underline-offset-4 transition-colors font-medium"
        >
          {label}
        </Link>
      );
    }
    return part;
  });
}

export function AppArticleBody({
  blocks,
  putIntoPracticeLabel = "Coloque em prática",
  tryToolLabel = "Acessar ferramenta",
}: AppArticleBodyProps) {
  return (
    <>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={idx}
                className="text-foreground/90 leading-relaxed text-sm sm:text-base my-4"
              >
                {renderFormattedText(block.text)}
              </p>
            );

          case "heading": {
            const headingText = block.text || "";
            const headingId = headingText
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");

            if (block.level === 3) {
              return (
                <h3
                  key={idx}
                  id={headingId}
                  className="text-base sm:text-lg font-bold uppercase text-foreground pt-4"
                >
                  {headingText}
                </h3>
              );
            }

            return (
              <h2
                key={idx}
                id={headingId}
                className="text-xl sm:text-2xl font-bold uppercase text-foreground pt-8 pb-2 border-b-dashed-5"
              >
                {headingText}
              </h2>
            );
          }

          case "list": {
            const items = block.items || [];
            if (block.ordered) {
              return (
                <ol
                  key={idx}
                  className="list-decimal pl-5 space-y-2 text-foreground/90 text-sm sm:text-base my-4"
                >
                  {items.map((item, itemIdx) => (
                    <li key={itemIdx} className="leading-relaxed">
                      {renderFormattedText(item)}
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <ul
                key={idx}
                className="list-disc pl-5 space-y-2 text-foreground/90 text-sm sm:text-base my-4"
              >
                {items.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed">
                    {renderFormattedText(item)}
                  </li>
                ))}
              </ul>
            );
          }

          case "callout":
            return (
              <AppTip
                key={idx}
                title="Dica"
                className="my-6 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_p]:mt-0 [&_p]:text-inherit"
              >
                {renderFormattedText(block.text)}
              </AppTip>
            );

          case "table":
            return (
              <div
                key={idx}
                className="not-prose my-6 overflow-x-auto border border-border rounded-[2px]"
              >
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  {block.headers && (
                    <thead>
                      <tr className="bg-tertiary border-b border-border">
                        {block.headers.map((h, hIdx) => (
                          <th
                            key={hIdx}
                            className="p-3 font-bold uppercase text-foreground"
                          >
                            {renderFormattedText(h)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {block.rows?.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="border-b border-border/50 hover:bg-tertiary/30 transition-colors"
                      >
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3 text-foreground/90 leading-normal">
                            {renderFormattedText(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "toolCta":
            return null;

          default:
            return null;
        }
      })}
    </>
  );
}

export default AppArticleBody;
