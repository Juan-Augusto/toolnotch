"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface AppBreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function AppBreadcrumb({ items, className = "" }: AppBreadcrumbProps) {
  const pathname = usePathname() || "";

  const resolvedItems =
    items && items.length > 0
      ? items
      : (() => {
          const parts = pathname.split("/").filter(Boolean);
          const hasLocale = parts.length > 0 && ["pt", "es"].includes(parts[0]);
          const localePrefix = hasLocale ? `/${parts[0]}` : "";
          const segments = hasLocale ? parts.slice(1) : parts;

          const list: BreadcrumbItem[] = [
            { label: "Home", href: localePrefix || "/" },
          ];

          let accumulated = localePrefix;
          segments.forEach((seg, index) => {
            accumulated += `/${seg}`;
            const isLast = index === segments.length - 1;

            let label = seg;
            if (seg === "quizzes" || seg === "quiz") {
              label = "Quizzes";
            } else if (seg === "interview") {
              label = "Interview";
            } else if (seg === "about") {
              label = "About";
            } else if (seg === "contact") {
              label = "Contact";
            } else if (seg === "partners") {
              label = "Partners";
            } else {
              label = seg
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());
            }

            list.push({
              label,
              href: isLast
                ? undefined
                : seg === "quiz"
                  ? `${localePrefix}/quizzes`
                  : accumulated,
              current: isLast,
            });
          });

          return list;
        })();

  if (
    resolvedItems.length <= 1 ||
    pathname === "/" ||
    pathname === "/pt" ||
    pathname === "/es"
  ) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center flex-wrap gap-2 font-mono text-xs sm:text-sm text-label py-1 ${className}`}
    >
      {resolvedItems.map((item, index) => {
        const isLast = index === resolvedItems.length - 1 || item.current;

        return (
          <div
            key={`${item.label}-${index}`}
            className="flex items-center gap-2"
          >
            {index > 0 && <ChevronRight size={16} />}

            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-secondary transition-colors underline-offset-4 hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={`truncate max-w-[220px] sm:max-w-md ${
                  isLast
                    ? "text-foreground font-semibold"
                    : "hover:text-secondary transition-colors"
                }`}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default AppBreadcrumb;
