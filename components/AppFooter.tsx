import Link from "next/link";
import { useTranslations } from "next-intl";
import AppLogo from "./AppLogo";

interface FooterProps {
  locale: string;
}

export default function AppFooter({ locale }: FooterProps) {
  const t = useTranslations("footer");
  const prefix = locale === "en" ? "" : `/${locale}`;

  const mainLinks = [
    { label: t("links.tools"), href: prefix || "/" },
    { label: t("links.quizzes"), href: `${prefix}/quizzes` },
    { label: t("links.blog"), href: `${prefix}/blog` },
    { label: t("links.interview"), href: `${prefix}/interview` },
    { label: t("links.about"), href: `${prefix}/about` },
  ];

  const secondaryLinks = [
    { label: t("links.terms"), href: `${prefix}/terms` },
    { label: t("links.privacy"), href: `${prefix}/privacy` },
    { label: t("links.contact"), href: `${prefix}/contact` },
    { label: t("links.disclosure"), href: `${prefix}/disclosure` },
    { label: t("links.partners"), href: `${prefix}/partners` },
  ];

  return (
    <footer className="w-full border-t border-t-border bg-background">
      <div className="container py-12 sm:py-16 flex flex-col items-center text-center">
        <nav
          className="flex flex-wrap justify-center items-center gap-x-8 sm:gap-x-12 gap-y-3 font-mono font-medium text-xs sm:text-sm tracking-wider uppercase text-foreground dark:text-white"
          aria-label="Footer primary navigation"
        >
          {mainLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <nav
          className="flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-10 gap-y-3 font-mono font-medium text-xs sm:text-sm tracking-wider uppercase text-foreground dark:text-white mt-4 sm:mt-6"
          aria-label="Footer secondary navigation"
        >
          {secondaryLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 sm:mt-10">
          <AppLogo href={prefix || "/"} />
        </div>

        <p className="font-mono text-xs text-label/80  mt-3 max-w-md leading-relaxed whitespace-pre-line">
          {t("tagline")}
        </p>

        <p className="font-mono text-xs  mt-6">
          {t("copyright", { name: "Juan Soares" })}
        </p>
      </div>
    </footer>
  );
}
