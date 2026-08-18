import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ToolsSection from "@/components/ToolsSection";
import ToolnotchLogo from "@/components/ToolnotchLogo";

interface Props {
  params: Promise<{ locale: string }>;
}

interface ToolItem {
  href: string;
  label: string;
  desc: string;
}
export interface Tool {
  index: number;
  category: string;
  color: string;
  items: ToolItem[];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const freeLabel = tc("free");

  const TOOLS: Tool[] = [
    {
      category: t("categories.imageTools"),
      color: "blue",
      index: 0,
      items: [
        {
          href: "/tools/image/image-compressor",
          label: t("tools.imageCompressor.label"),
          desc: t("tools.imageCompressor.desc"),
        },
        {
          href: "/tools/image/convert-png-to-webp",
          label: t("tools.imageConverter.label"),
          desc: t("tools.imageConverter.desc"),
        },
      ],
    },
    {
      category: t("categories.pdfTools"),
      color: "red",
      index: 1,
      items: [
        {
          href: "/tools/pdf/merge-pdf",
          label: t("tools.mergePdf.label"),
          desc: t("tools.mergePdf.desc"),
        },
        {
          href: "/tools/pdf/split-pdf",
          label: t("tools.splitPdf.label"),
          desc: t("tools.splitPdf.desc"),
        },
        {
          href: "/tools/pdf/compress-pdf",
          label: t("tools.compressPdf.label"),
          desc: t("tools.compressPdf.desc"),
        },
        {
          href: "/tools/pdf/pdf-to-jpg",
          label: t("tools.pdfToJpg.label"),
          desc: t("tools.pdfToJpg.desc"),
        },
        {
          href: "/tools/pdf/jpg-to-pdf",
          label: t("tools.jpgToPdf.label"),
          desc: t("tools.jpgToPdf.desc"),
        },
      ],
    },
    {
      category: t("categories.converterTools"),
      color: "indigo",
      index: 2,
      items: [
        {
          href: "/tools/convert/unit-converter",
          label: t("tools.unitConverter.label"),
          desc: t("tools.unitConverter.desc"),
        },
        {
          href: "/tools/convert/currency-converter",
          label: t("tools.currencyConverter.label"),
          desc: t("tools.currencyConverter.desc"),
        },
        {
          href: "/tools/convert/percentage-calculator",
          label: t("tools.percentageCalculator.label"),
          desc: t("tools.percentageCalculator.desc"),
        },
        {
          href: "/tools/convert/meters-to-feet",
          label: t("tools.metersToFeet.label"),
          desc: t("tools.metersToFeet.desc"),
        },
        {
          href: "/tools/convert/celsius-to-fahrenheit",
          label: t("tools.celsiusToFahrenheit.label"),
          desc: t("tools.celsiusToFahrenheit.desc"),
        },
        {
          href: "/tools/convert/kilograms-to-pounds",
          label: t("tools.kgToPounds.label"),
          desc: t("tools.kgToPounds.desc"),
        },
      ],
    },
    {
      category: t("categories.textTools"),
      color: "purple",
      index: 3,
      items: [
        {
          href: "/tools/text/word-counter",
          label: t("tools.wordCounter.label"),
          desc: t("tools.wordCounter.desc"),
        },
        {
          href: "/tools/text/character-counter",
          label: t("tools.characterCounter.label"),
          desc: t("tools.characterCounter.desc"),
        },
        {
          href: "/tools/text/readability-checker",
          label: t("tools.readabilityChecker.label"),
          desc: t("tools.readabilityChecker.desc"),
        },
        {
          href: "/tools/text/reading-time-calculator",
          label: t("tools.readingTimeCalculator.label"),
          desc: t("tools.readingTimeCalculator.desc"),
        },
        {
          href: "/tools/text/word-frequency-counter",
          label: t("tools.wordFrequencyCounter.label"),
          desc: t("tools.wordFrequencyCounter.desc"),
        },
      ],
    },
    {
      category: t("categories.financeTools"),
      color: "green",
      index: 4,
      items: [
        {
          href: "/tools/finance/loan-calculator",
          label: t("tools.loanCalculator.label"),
          desc: t("tools.loanCalculator.desc"),
        },
        {
          href: "/tools/finance/mortgage-calculator",
          label: t("tools.mortgageCalculator.label"),
          desc: t("tools.mortgageCalculator.desc"),
        },
        {
          href: "/tools/finance/car-loan-calculator",
          label: t("tools.carLoanCalculator.label"),
          desc: t("tools.carLoanCalculator.desc"),
        },
        {
          href: "/tools/finance/invoice-generator",
          label: t("tools.invoiceGenerator.label"),
          desc: t("tools.invoiceGenerator.desc"),
        },
        {
          href: "/tools/finance/invoice-generator-uk",
          label: t("tools.invoiceGeneratorUk.label"),
          desc: t("tools.invoiceGeneratorUk.desc"),
        },
        {
          href: "/tools/finance/home-affordability-calculator",
          label: t("tools.homeAffordability.label"),
          desc: t("tools.homeAffordability.desc"),
        },
        {
          href: "/tools/finance/amortization-calculator",
          label: t("tools.amortizationCalculator.label"),
          desc: t("tools.amortizationCalculator.desc"),
        },
        {
          href: "/tools/finance/student-loan-calculator",
          label: t("tools.studentLoanCalculator.label"),
          desc: t("tools.studentLoanCalculator.desc"),
        },
      ],
    },
    {
      category: t("categories.funAndRandom"),
      color: "orange",
      index: 5,
      items: [
        {
          href: "/tools/fun/spin-the-wheel",
          label: t("tools.spinTheWheel.label"),
          desc: t("tools.spinTheWheel.desc"),
        },
        {
          href: "/tools/fun/random-name-picker",
          label: t("tools.randomNamePicker.label"),
          desc: t("tools.randomNamePicker.desc"),
        },
        {
          href: "/tools/fun/random-team-generator",
          label: t("tools.teamGenerator.label"),
          desc: t("tools.teamGenerator.desc"),
        },
        {
          href: "/tools/fun/coin-flip",
          label: t("tools.coinFlip.label"),
          desc: t("tools.coinFlip.desc"),
        },
        {
          href: "/tools/fun/dice-roller",
          label: t("tools.diceRoller.label"),
          desc: t("tools.diceRoller.desc"),
        },
        {
          href: "/tools/fun/random-number-generator",
          label: t("tools.numberGenerator.label"),
          desc: t("tools.numberGenerator.desc"),
        },
        {
          href: "/tools/fun/yes-or-no-wheel",
          label: t("tools.yesOrNoWheel.label"),
          desc: t("tools.yesOrNoWheel.desc"),
        },
        {
          href: "/tools/fun/wheel-of-names",
          label: t("tools.wheelOfNames.label"),
          desc: t("tools.wheelOfNames.desc"),
        },
      ],
    },
    {
      category: t("categories.interviewPrep"),
      color: "blue",
      index: 7,
      items: [
        {
          href: "/interview",
          label: t("tools.interviewHub.label"),
          desc: t("tools.interviewHub.desc"),
        },
        {
          href: "/interview/typescript",
          label: t("tools.typescriptQuiz.label"),
          desc: t("tools.typescriptQuiz.desc"),
        },
      ],
    },
    {
      category: t("categories.agileTools"),
      color: "violet",
      index: 6,
      items: [
        {
          href: "/tools/agile/retro-board",
          label: t("tools.retroBoard.label"),
          desc: t("tools.retroBoard.desc"),
        },
        {
          href: "/tools/agile/standup-generator",
          label: t("tools.standupGenerator.label"),
          desc: t("tools.standupGenerator.desc"),
        },
        {
          href: "/tools/agile/planning-poker",
          label: t("tools.planningPoker.label"),
          desc: t("tools.planningPoker.desc"),
        },
        {
          href: "/tools/agile/user-story-writer",
          label: t("tools.userStoryWriter.label"),
          desc: t("tools.userStoryWriter.desc"),
        },
        {
          href: "/tools/agile/sprint-date-calculator",
          label: t("tools.sprintDateCalculator.label"),
          desc: t("tools.sprintDateCalculator.desc"),
        },
      ],
    },
    {
      category: t("categories.quizzes"),
      color: "pink",
      index: 8,
      items: [
        {
          href: "/quizzes",
          label: t("tools.allQuizzes.label"),
          desc: t("tools.allQuizzes.desc"),
        },
        {
          href: "/quiz/which-programming-language-are-you",
          label: t("tools.programmingLanguageQuiz.label"),
          desc: t("tools.programmingLanguageQuiz.desc"),
        },
        {
          href: "/quiz/am-i-introverted-or-extroverted",
          label: t("tools.introvertExtrovertQuiz.label"),
          desc: t("tools.introvertExtrovertQuiz.desc"),
        },
        {
          href: "/quiz/what-career-suits-you",
          label: t("tools.careerQuiz.label"),
          desc: t("tools.careerQuiz.desc"),
        },
        {
          href: "/quiz/what-type-of-traveler-are-you",
          label: t("tools.travelerQuiz.label"),
          desc: t("tools.travelerQuiz.desc"),
        },
        {
          href: "/quiz/fifa-world-cup-winners",
          label: t("tools.worldCupQuiz.label"),
          desc: t("tools.worldCupQuiz.desc"),
        },
        {
          href: "/quiz/which-football-club-are-you",
          label: t("tools.footballClubQuiz.label"),
          desc: t("tools.footballClubQuiz.desc"),
        },
        {
          href: "/quiz/champions-league-trivia",
          label: t("tools.championsLeagueQuiz.label"),
          desc: t("tools.championsLeagueQuiz.desc"),
        },
        {
          href: "/quiz/what-is-your-love-language",
          label: t("tools.loveLangaugeQuiz.label"),
          desc: t("tools.loveLangaugeQuiz.desc"),
        },
        {
          href: "/quiz/formula-1-trivia",
          label: t("tools.formula1TriviaQuiz.label"),
          desc: t("tools.formula1TriviaQuiz.desc"),
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-background relative isolate">
      {/* Decorative SVG Grid Pattern (Full Width) */}
      <svg
        className="pointer-events-none absolute top-0 inset-x-0 -z-20 h-[800px] w-full stroke-gray-200/70 dark:stroke-gray-700/40 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="hero-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 40V.5H40" fill="none"></path>
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          strokeWidth="0"
          fill="url(#hero-grid)"
        ></rect>
      </svg>

      {/* Vertical Edge Lines */}
      <div className="hidden xl:block absolute top-0 bottom-0 left-4 xl:left-8 w-[1px] bg-bd-base -z-10"></div>
      <div className="hidden xl:block absolute top-0 bottom-0 right-4 xl:right-8 w-[1px] bg-bd-base -z-10"></div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="relative isolate text-center mb-10 mt-8 space-y-6">
          {/* Extra Sparkles (Static) */}
          <div className="hidden lg:block absolute top-28 -right-20 xl:-right-48">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-800 dark:text-gray-200"
            >
              <path
                d="M12 2C12 2 12.5 9.5 17 12C12.5 14.5 12 22 12 22C12 22 11.5 14.5 7 12C11.5 9.5 12 2 12 2Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="hidden lg:block absolute top-48 -left-24 xl:-left-48">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-800 dark:text-gray-200"
            >
              <path
                d="M12 2C12 2 12.5 9.5 17 12C12.5 14.5 12 22 12 22C12 22 11.5 14.5 7 12C11.5 9.5 12 2 12 2Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="hidden lg:block absolute bottom-20 -right-16 xl:-right-40">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-800 dark:text-gray-200"
            >
              <path
                d="M12 2C12 2 12.5 9.5 17 12C12.5 14.5 12 22 12 22C12 22 11.5 14.5 7 12C11.5 9.5 12 2 12 2Z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-40 bg-blue-500/60 blur-[150px] -z-10 rounded-full pointer-events-none"></div> */}

          <div className="flex justify-center">
            <div className="badge-neon">{t("badge")}</div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white pb-2 leading-tight">
            {t.rich("heading", {
              highlight: (chunks) => (
                <span className="relative inline-block text-blue-500 whitespace-nowrap z-10">
                  {chunks}
                </span>
              ),
            })}
          </h1>

          <p className="text-base sm:text-lg text-tx-secondary max-w-xl mx-auto leading-relaxed font-medium">
            {t("subheading")}
          </p>
        </div>
        <ToolsSection TOOLS={TOOLS} freeLabel={freeLabel} />

        <p className="text-center text-xs mt-16 text-tx-secondary">
          {t("moreComingSoon")}
        </p>

        <div className="text-center mt-6">
          <Link
            href="/privacy"
            className="text-xs text-tx-secondary hover:text-tx-primary hover:underline dark:text-tx-secondary dark:hover:text-tx-primary"
          >
            {t("nav.privacy")}
          </Link>
        </div>
      </div>
    </main>
  );
}
