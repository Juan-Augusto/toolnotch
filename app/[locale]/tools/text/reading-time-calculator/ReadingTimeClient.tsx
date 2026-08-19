"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import { useTranslations } from "next-intl";
import {
  BookOpen,
  Mic,
  Minimize2Icon,
  Pause,
  PlayIcon,
  RotateCcwIcon,
  Trash2,
  Zap,
} from "lucide-react";
import { analyzeText } from "@/lib/textAnalysis";
import { TextStats, getFleschLabel, getFleschColor } from "@/lib/textTypes";
import TopWordsChart from "@/components/text-counter/TopWordsChart";
import Button from "@/components/Button";

// --- CONSTANTS & HELPERS ---
const EMPTY_STATS: TextStats = {
  words: 0,
  characters: 0,
  charactersNoSpaces: 0,
  sentences: 0,
  paragraphs: 0,
  readingTime: 0,
  speakingTime: 0,
  fleschEase: 0,
  fleschGrade: 0,
  gunningFog: 0,
  avgWordsPerSentence: 0,
  avgSyllablesPerWord: 0,
  topWords: [],
};

const getComplexityLevel = (ease: number) => {
  if (ease < 30) return { key: "complexityVeryHard", multiplier: 1.3 };
  if (ease < 50) return { key: "complexityHard", multiplier: 1.15 };
  if (ease < 80) return { key: "complexityAverage", multiplier: 1.0 };
  return { key: "complexityEasy", multiplier: 1.0 };
};

const calculateExactTime = (words: number, wpm: number, multiplier = 1.0) => {
  if (words === 0) return { minutes: 0, seconds: 0 };
  const totalSeconds = Math.round((words / wpm) * 60 * multiplier);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return { minutes, seconds };
};

// --- SUB-COMPONENTS ---

function TextInputArea({
  text,
  setText,
  handleSample,
  handleClear,
}: {
  text: string;
  setText: (v: string) => void;
  handleSample: () => void;
  handleClear: () => void;
}) {
  const t = useTranslations("text");
  return (
    <div className="relative">
      <textarea
        className="w-full h-64 p-4 border border-bd-base rounded-xl text-sm resize-y focus:outline-none focus:ring-2 focus:ring-neon bg-card text-tx-primary placeholder-gray-400 dark:placeholder-gray-500"
        placeholder={t("wordCounter.placeholder")}
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck
      />
      <div className="flex gap-2">
        <button
          onClick={handleSample}
          className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 hover:text-tx-primary px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          {t("buttons.sampleText")}
        </button>
        {text && (
          <button
            onClick={handleClear}
            className="text-xs hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
          >
            <Trash2 size={12} />
            {t("buttons.clear")}
          </button>
        )}
      </div>
    </div>
  );
}

function SpeedReaderWidget({
  wordsArray,
  currentIndex,
  setCurrentIndex,
  isPlaying,
  setIsPlaying,
  speedReaderWpm,
  setSpeedReaderWpm,
  setSpeedReaderActive,
}: {
  wordsArray: string[];
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  speedReaderWpm: number;
  setSpeedReaderWpm: Dispatch<SetStateAction<number>>;
  setSpeedReaderActive: Dispatch<SetStateAction<boolean>>;
}) {
  const tr = useTranslations("text.readingTime");

  const getReadingSpeedCategory = (wpm: number) => {
    if (wpm < 200) return tr("ui.speedSlow");
    if (wpm <= 275) return tr("ui.speedMedium");
    if (wpm <= 350) return tr("ui.speedFast");
    return tr("ui.speedSuperFast");
  };

  const renderOrpWord = (word: string) => {
    if (!word) return "";
    const len = word.length;
    let orpIndex = 0;
    if (len > 1 && len <= 5) orpIndex = 1;
    else if (len >= 6 && len <= 9) orpIndex = 2;
    else if (len >= 10 && len <= 13) orpIndex = 3;
    else if (len > 13) orpIndex = 4;

    const left = word.substring(0, orpIndex);
    const middle = word.charAt(orpIndex);
    const right = word.substring(orpIndex + 1);

    return (
      <span className="font-mono text-3xl sm:text-5xl font-extrabold tracking-tight select-none">
        <span className="text-tx-primary">{left}</span>
        <span className="text-red-500 dark:text-red-400">{middle}</span>
        <span className="text-tx-primary">{right}</span>
      </span>
    );
  };

  return (
    <div className="bg-card border border-bd-base rounded-xl p-6 relative overflow-hidden flex flex-col items-center space-y-6 animate-fade-in-up">
      <div className="w-full flex justify-between items-center pb-3 border-b border-bd-base">
        <span className="text-xs font-semibold uppercase tracking-wider text-tx-secondary flex items-center gap-1.5">
          {tr("ui.speedReaderTitle")}
        </span>
        <button
          onClick={() => {
            setIsPlaying(false);
            setSpeedReaderActive(false);
          }}
          className="text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2"
        >
          {tr("ui.closeSpeedReader")}
          <Minimize2Icon className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full h-36 flex items-center justify-center bg-gray-50 dark:bg-elevated border border-bd-base rounded-xl relative">
        {currentIndex < wordsArray.length ? (
          renderOrpWord(wordsArray[currentIndex])
        ) : (
          <span className="text-xs text-tx-secondary italic font-semibold">
            {tr("ui.done")}
          </span>
        )}
      </div>

      <div className="w-full">
        <div className="flex justify-between text-xs text-tx-secondary">
          <span>{tr("ui.readingSpeedLabel")}</span>
          <span className="font-semibold text-neon">
            {tr("ui.wordsPerMinute", { wpm: speedReaderWpm })} (
            {getReadingSpeedCategory(speedReaderWpm)})
          </span>
        </div>
        <input
          type="range"
          min={100}
          max={400}
          step={10}
          value={speedReaderWpm}
          onChange={(e) => setSpeedReaderWpm(parseInt(e.target.value))}
          className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon"
        />
      </div>

      <div className="w-full space-y-2">
        <div className="flex justify-between text-xs text-tx-secondary">
          <span>
            {tr("ui.wordCounter", {
              current: Math.min(currentIndex + 1, wordsArray.length),
              total: wordsArray.length,
            })}
          </span>
          <span>
            {Math.round(
              (Math.min(currentIndex + 1, wordsArray.length) /
                wordsArray.length) *
                100,
            )}
            %
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden border border-bd-base/10">
          <div
            className="bg-neon h-full rounded-full transition-all duration-300"
            style={{
              width: `${(Math.min(currentIndex + 1, wordsArray.length) / wordsArray.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={() => {
            if (currentIndex >= wordsArray.length) {
              setCurrentIndex(0);
            }
            setIsPlaying(!isPlaying);
          }}
          color="primary"
          className="flex items-center gap-2 text-sm"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <PlayIcon className="w-4 h-4" />
          )}
          {isPlaying ? tr("ui.pause") : tr("ui.play")}
        </Button>
        <Button
          onClick={() => {
            setIsPlaying(false);
            setCurrentIndex(0);
          }}
          color="grey"
          className="flex items-center gap-2 text-sm"
        >
          <RotateCcwIcon className="w-4 h-4" />
          {tr("ui.reset")}
        </Button>
      </div>
    </div>
  );
}

function HeroStats({
  readingTimeObj,
  speakingTimeObj,
  readingWpm,
  setReadingWpm,
  speakingWpm,
  setSpeakingWpm,
}: {
  readingTimeObj: { minutes: number; seconds: number };
  speakingTimeObj: { minutes: number; seconds: number };
  readingWpm: number;
  setReadingWpm: Dispatch<SetStateAction<number>>;
  speakingWpm: number;
  setSpeakingWpm: Dispatch<SetStateAction<number>>;
}) {
  const tr = useTranslations("text.readingTime");

  const getReadingSpeedCategory = (wpm: number) => {
    if (wpm < 200) return tr("ui.speedSlow");
    if (wpm <= 275) return tr("ui.speedMedium");
    if (wpm <= 350) return tr("ui.speedFast");
    return tr("ui.speedSuperFast");
  };

  const getSpeakingSpeedCategory = (wpm: number) => {
    if (wpm < 110) return tr("ui.speedSlow");
    if (wpm <= 160) return tr("ui.speedMedium");
    return tr("ui.speedFast");
  };

  const formatDuration = (time: { minutes: number; seconds: number }) => {
    if (time.minutes === 0 && time.seconds === 0) return "0s";
    if (time.minutes === 0) {
      return tr("ui.seconds", { s: time.seconds });
    }
    return tr("ui.minutesAndSeconds", { m: time.minutes, s: time.seconds });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card-neon p-6 bg-card border border-bd-base rounded-xl relative overflow-hidden flex flex-col justify-between">
        <div className="absolute right-4 top-4 text-neon pointer-events-none">
          <BookOpen size={48} />
        </div>
        <div>
          <div className="text-xs font-semibold text-tx-secondary uppercase tracking-wider mb-1">
            {tr("ui.estimatedReadingTime")}
          </div>
          <div className="text-3xl font-black text-neon">
            {formatDuration(readingTimeObj)}
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs text-tx-secondary">
            <span>{tr("ui.readingSpeedLabel")}</span>
            <span className="font-semibold text-neon">
              {tr("ui.wordsPerMinute", { wpm: readingWpm })} (
              {getReadingSpeedCategory(readingWpm)})
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={400}
            step={10}
            value={readingWpm}
            onChange={(e) => setReadingWpm(parseInt(e.target.value))}
            className="w-full h-1 bg-bd-base rounded-lg appearance-none cursor-pointer accent-neon"
          />
        </div>
      </div>

      <div className="card-neon p-6 bg-card border border-bd-base rounded-xl relative overflow-hidden flex flex-col justify-between">
        <div className="absolute right-4 top-4 text-blue-500 pointer-events-none">
          <Mic size={48} />
        </div>
        <div>
          <div className="text-xs font-semibold text-tx-secondary uppercase tracking-wider mb-1">
            {tr("ui.estimatedSpeakingTime")}
          </div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
            {formatDuration(speakingTimeObj)}
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs text-tx-secondary">
            <span>{tr("ui.speakingSpeedLabel")}</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {tr("ui.wordsPerMinute", { wpm: speakingWpm })} (
              {getSpeakingSpeedCategory(speakingWpm)})
            </span>
          </div>
          <input
            type="range"
            min={80}
            max={250}
            step={5}
            value={speakingWpm}
            onChange={(e) => setSpeakingWpm(parseInt(e.target.value))}
            className="w-full h-1 bg-bd-base rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400"
          />
        </div>
      </div>
    </div>
  );
}

function SecondaryStats({
  stats,
  complexity,
}: {
  stats: TextStats;
  complexity: { key: string; multiplier: number };
}) {
  const t = useTranslations("text");
  const tr = useTranslations("text.readingTime");

  const getFleschTranslation = (ease: number) => {
    const label = getFleschLabel(ease);
    const key = label
      .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
      .replace(/^(.)/, (_, c) => c.toLowerCase());
    return t(`stats.fleschLabels.${key}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-card border border-bd-base rounded-xl p-5 space-y-3">
        <p className="text-xs font-semibold text-tx-secondary uppercase tracking-wider mb-1">
          {t("stats.readabilityScores")}
        </p>
        <div className="grid grid-cols-2 gap-4 pt-1">
          <div>
            <div className="text-[10px] font-semibold tracking-wide text-tx-secondary uppercase">
              {t("stats.words")}
            </div>
            <div className="text-lg font-bold text-tx-primary">
              {stats.words.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold tracking-wide text-tx-secondary uppercase">
              {t("stats.characters")}
            </div>
            <div className="text-lg font-bold text-tx-primary">
              {stats.characters.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold tracking-wide text-tx-secondary uppercase">
              {t("stats.sentences")}
            </div>
            <div className="text-lg font-bold text-tx-primary">
              {stats.sentences.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold tracking-wide text-tx-secondary uppercase">
              {t("stats.paragraphs")}
            </div>
            <div className="text-lg font-bold text-tx-primary">
              {stats.paragraphs.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-bd-base rounded-xl p-5 flex flex-col justify-between">
        <div>
          <p className="text-xs font-semibold text-tx-secondary uppercase tracking-wider mb-1">
            {tr("ui.complexityNote")}
          </p>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold ${getFleschColor(stats.fleschEase)}`}
            >
              {stats.fleschEase}
            </span>
            <span
              className={`text-sm font-medium ${getFleschColor(stats.fleschEase)}`}
            >
              {getFleschTranslation(stats.fleschEase)}
            </span>
          </div>
        </div>
        <div className="mt-4 pt-2 border-t border-bd-base text-xs text-tx-secondary">
          {tr(`ui.${complexity.key}`)}
        </div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---

export default function ReadingTimeClient() {
  const t = useTranslations("text");
  const tr = useTranslations("text.readingTime");
  const [text, setText] = useState("");
  const [stats, setStats] = useState<TextStats>(EMPTY_STATS);

  const [readingWpm, setReadingWpm] = useState(238);
  const [speakingWpm, setSpeakingWpm] = useState(130);

  const [speedReaderActive, setSpeedReaderActive] = useState(false);
  const [speedReaderWpm, setSpeedReaderWpm] = useState(238);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(analyzeText(text));
    }, 200);
    return () => clearTimeout(timer);
  }, [text]);

  const [prevText, setPrevText] = useState(text);
  if (prevText !== text) {
    setPrevText(text);
    setIsPlaying(false);
    setCurrentIndex(0);
  }

  const handleClear = useCallback(() => {
    setText("");
    setSpeedReaderActive(false);
  }, []);

  const handleSample = useCallback(() => setText(t("sampleText")), [t]);

  const wordsArray = useMemo(() => {
    return text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
  }, [text]);

  const complexity = getComplexityLevel(stats.fleschEase);

  const playbackFinished =
    currentIndex >= wordsArray.length && wordsArray.length > 0;
  const [wasFinished, setWasFinished] = useState(false);
  if (playbackFinished !== wasFinished) {
    setWasFinished(playbackFinished);
    if (playbackFinished && isPlaying) {
      setIsPlaying(false);
    }
  }

  useEffect(() => {
    if (!isPlaying || currentIndex >= wordsArray.length) {
      return;
    }

    const currentWord = wordsArray[currentIndex];
    if (!currentWord) return;

    const baseDelay = (60 / speedReaderWpm) * 1000;
    let delay = baseDelay;

    if (currentWord.length <= 4) {
      delay *= 0.8;
    } else if (currentWord.length >= 9 && currentWord.length <= 12) {
      delay *= 1.2;
    } else if (currentWord.length > 12) {
      delay *= 1.4;
    }

    const endsWithPunctuation = /[.,!?;:]$/.test(currentWord);
    if (endsWithPunctuation) {
      if (/[.!?]$/.test(currentWord)) {
        delay += 200;
      } else {
        delay += 100;
      }
    }

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, wordsArray, speedReaderWpm]);

  const readingTimeObj = calculateExactTime(
    stats.words,
    readingWpm,
    complexity.multiplier,
  );
  const speakingTimeObj = calculateExactTime(stats.words, speakingWpm, 1.0);

  return (
    <div className="space-y-6">
      <TextInputArea
        text={text}
        setText={setText}
        handleSample={handleSample}
        handleClear={handleClear}
      />

      {speedReaderActive && wordsArray.length > 0 && (
        <SpeedReaderWidget
          wordsArray={wordsArray}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          speedReaderWpm={speedReaderWpm}
          setSpeedReaderWpm={setSpeedReaderWpm}
          setSpeedReaderActive={setSpeedReaderActive}
        />
      )}

      {!speedReaderActive && wordsArray.length > 0 && (
        <div className="flex justify-center">
          <Button
            onClick={() => {
              setCurrentIndex(0);
              setSpeedReaderWpm(readingWpm);
              setSpeedReaderActive(true);
            }}
            color="primary"
            opacity
            className="flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" /> {tr("ui.startSpeedReader")}
          </Button>
        </div>
      )}

      <HeroStats
        readingTimeObj={readingTimeObj}
        speakingTimeObj={speakingTimeObj}
        readingWpm={readingWpm}
        setReadingWpm={setReadingWpm}
        speakingWpm={speakingWpm}
        setSpeakingWpm={setSpeakingWpm}
      />

      <SecondaryStats stats={stats} complexity={complexity} />

      {stats.topWords.length > 0 && (
        <div className="bg-card border border-bd-base rounded-xl p-5">
          <TopWordsChart topWords={stats.topWords} />
        </div>
      )}
    </div>
  );
}
