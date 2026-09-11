import React from "react";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { Sparkles, AlertTriangle, Info } from "lucide-react";
import AppCard from "@/components/ui/AppCard";
import AppBadge from "@/components/ui/AppBadge";
import AppTip, { type AppTipProps } from "@/components/ui/AppTip";

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "tip" | "warning" | "info";
  title?: string;
  children: React.ReactNode;
}) {
  if (type === "tip") {
    return (
      <AppTip
        title={title || "Dica"}
        className="my-6 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_p]:mt-0 [&_p]:text-inherit"
      >
        {children}
      </AppTip>
    );
  }

  const styles = {
    warning: "border-dashed-5 border-secondary bg-secondary/5 text-foreground",
    info: "border-dashed-5 border-border bg-tertiary/30 text-foreground",
  };

  const icons = {
    warning: <AlertTriangle className="w-4 h-4 text-secondary shrink-0" />,
    info: <Info className="w-4 h-4 text-label shrink-0" />,
  };

  const defaultTitles: Record<string, string> = {
    warning: "Atenção",
    info: "Informação",
  };

  const badgeText = title || defaultTitles[type] || type.toUpperCase();

  return (
    <aside
      className={`p-4 sm:p-5 rounded-[2px] my-6 space-y-2.5 border ${styles[type as "warning" | "info"]}`}
    >
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-foreground">
        {icons[type as "warning" | "info"]}
        <span>{badgeText}</span>
      </div>
      <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans [&>p]:mb-2 [&>p:last-child]:mb-0 [&>p]:mt-0 [&>p]:leading-relaxed">
        {children}
      </div>
    </aside>
  );
}

export const AppMdxComponents: MDXComponents = {
  Callout,
  AppTip: ({ className = "", ...props }: AppTipProps) => (
    <AppTip
      className={`my-6 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_p]:mt-0 [&_p]:text-inherit ${className}`}
      {...props}
    />
  ),
  Tip: ({ className = "", ...props }: AppTipProps) => (
    <AppTip
      className={`my-6 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_p]:mt-0 [&_p]:text-inherit ${className}`}
      {...props}
    />
  ),
  Card: AppCard,
  Badge: AppBadge,
  h2: ({ children, ...props }) => {
    const text = typeof children === "string" ? children : "";
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return (
      <h2
        id={id || undefined}
        className="text-xl sm:text-2xl font-bold uppercase text-foreground mt-12 mb-4 pt-8 border-t-dashed-5 tracking-tight first:mt-0 first:pt-0 first:border-t-0"
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }) => (
    <h3
      className="text-base sm:text-lg font-bold uppercase text-foreground mt-8 mb-3 tracking-tight"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p
      className="text-foreground/90 leading-relaxed text-sm sm:text-base mb-4 last:mb-0"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul
      className="list-disc pl-5 space-y-2 text-foreground/90 text-sm sm:text-base mb-6"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="list-decimal pl-5 space-y-2 text-foreground/90 text-sm sm:text-base mb-6"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed pl-1" {...props}>
      {children}
    </li>
  ),
  a: ({ href, children, ...props }) => {
    const isInternal = href && (href.startsWith("/") || href.startsWith("#"));
    if (isInternal) {
      return (
        <Link
          href={href}
          className="text-secondary hover:text-primary underline underline-offset-4 transition-colors font-medium"
          {...props}
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-secondary hover:text-primary underline underline-offset-4 transition-colors font-medium"
        {...props}
      >
        {children}
      </a>
    );
  },
  strong: ({ children, ...props }) => (
    <strong className="font-bold text-foreground" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-foreground/90" {...props}>
      {children}
    </em>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-2 border-primary bg-tertiary/30 p-4 sm:p-5 rounded-[2px] not-italic text-foreground/90 text-xs sm:text-sm my-6 [&>p]:mb-0 [&>p]:mt-0"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: () => <div className="border-b-dashed-5 my-8" />,
  pre: ({ children, ...props }) => (
    <pre
      className="bg-tertiary border border-border rounded-[2px] p-4 my-6 overflow-x-auto text-xs sm:text-sm"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }) => {
    const isInline = !className || !className.includes("language-");
    if (isInline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded-[2px] bg-tertiary text-xs text-primary border border-border"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  table: ({ children, ...props }) => (
    <div className="not-prose my-6 border border-border rounded-[2px] bg-tertiary/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table
          className="w-full text-left border-collapse text-xs sm:text-sm"
          {...props}
        >
          {children}
        </table>
      </div>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-tertiary border-b border-border text-foreground select-none" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th
      className="px-4 py-3 font-bold uppercase text-foreground text-xs sm:text-sm tracking-wide"
      {...props}
    >
      {children}
    </th>
  ),
  tr: ({ children, ...props }) => (
    <tr
      className="border-b border-border/40 hover:bg-tertiary/40 transition-colors last:border-b-0"
      {...props}
    >
      {children}
    </tr>
  ),
  td: ({ children, ...props }) => (
    <td
      className="px-4 py-3 text-foreground/90 text-xs sm:text-sm leading-normal whitespace-nowrap sm:whitespace-normal"
      {...props}
    >
      {children}
    </td>
  ),
};
