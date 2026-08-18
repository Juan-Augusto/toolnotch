"use client";
import { useTranslations } from "next-intl";

interface TopWordsChartProps {
  topWords: { word: string; count: number }[];
}

export default function TopWordsChart({ topWords }: TopWordsChartProps) {
  const t = useTranslations("text.stats");
  if (topWords.length === 0) return null;
  const maxCount = topWords[0]?.count ?? 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-tx-primary uppercase tracking-wider">
          {t("topWords")}
        </h3>
        <span className="text-[10px] text-tx-secondary uppercase tracking-widest font-semibold bg-bd-base/30 px-2.5 py-1 rounded-full border border-bd-base/50">
          {t("densityAnalysis")}
        </span>
      </div>
      <div className="space-y-2">
        {topWords.map(({ word, count }, index) => {
          const percentageOfMax = (count / maxCount) * 100;
          const rank = index + 1;

          return (
            <div
              key={word}
              className="group flex items-center gap-3 p-1.5 rounded-lg hover:bg-elevated transition-all duration-200"
            >
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-md text-[10px] font-black shrink-0 transition-colors ${
                  rank === 1
                    ? "bg-neon/10 text-neon border border-bd-neon/30"
                    : rank === 2
                      ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      : rank === 3
                        ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                        : "bg-bd-base/30 text-tx-secondary border border-bd-base/20"
                }`}
              >
                {rank}
              </div>

              <div className="w-24 text-sm text-tx-primary font-semibold truncate group-hover:text-neon transition-colors">
                {word}
              </div>

              <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden border border-bd-base/10">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out group-hover:bg-blue-600 shadow-sm"
                  style={{ width: `${percentageOfMax}%` }}
                />
              </div>

              <div className="text-[11px] font-bold text-tx-secondary bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded-full group-hover:text-neon group-hover:bg-neon/10 transition-all select-none">
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
