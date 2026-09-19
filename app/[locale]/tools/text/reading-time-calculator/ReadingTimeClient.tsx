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
} from "lucide-react";
import { analyzeText } from "@/lib/textAnalysis";
import { TextStats, getFleschKey, getFleschColor } from "@/lib/textTypes";
import AppTopWordsChart from "@/components/text-counter/AppTopWordsChart";
import { AppButton } from "@/components/ui";
import TextActionBar from "../components/TextActionBar";

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

function TextInputArea({
  text,
  setText,
  handleSample,
  handleClear,
  placeholder,
}: {
  text: string;
  setText: (v: string) => void;
  handleSample: () => void;
  handleClear: () => void;
  placeholder?: string;
}) {
  const tr = useTranslations("text.readingTime");
  return (
    <div className="bg-tertiary dark:bg-background border border-border rounded-[2px] overflow-hidden focus-within:border-foreground/40 transition-colors">
      <textarea
        rows={12}
        className="w-full min-h-[280px] sm:min-h-[340px] h-72 sm:h-84 p-4 sm:p-5 bg-transparent border-none text-foreground placeholder:text-label/50 focus:outline-none transition-all font-sans resize-y leading-relaxed"
        placeholder={placeholder ?? tr("placeholder")}
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck
      />
      <TextActionBar
        text={text}
        onSample={handleSample}
        onClear={handleClear}
      />
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
      <span className="text-3xl sm:text-5xl font-mono font-bold tracking-tight select-none">
        <span className="text-foreground">{left}</span>
        <span className="text-red-500">{middle}</span>
        <span className="text-foreground">{right}</span>
      </span>
    );
  };

  return (
    <div className="bg-tertiary dark:bg-background border border-border rounded-[2px] p-5 sm:p-6 flex flex-col items-center space-y-5">
      <div className="w-full flex justify-between items-center pb-3 border-b border-border">
        <span className="font-mono font-bold uppercase text-foreground">
          {tr("ui.speedReaderTitle")}
        </span>
        <button
          onClick={() => {
            setIsPlaying(false);
            setSpeedReaderActive(false);
          }}
          className="font-mono text-label hover:text-foreground cursor-pointer transition-colors flex items-center gap-1.5"
        >
          {tr("ui.closeSpeedReader")}
          <Minimize2Icon className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="w-full h-36 flex items-center justify-center bg-tertiary border border-border rounded-[2px]">
        {currentIndex < wordsArray.length ? (
          renderOrpWord(wordsArray[currentIndex])
        ) : (
          <span className="font-mono text-label italic">
            {tr("ui.done")}
          </span>
        )}
      </div>

      <div className="w-full space-y-1.5">
        <div className="flex justify-between font-mono text-label">
          <span>{tr("ui.readingSpeedLabel")}</span>
          <span className="font-bold text-foreground">
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
          className="w-full h-1.5 bg-tertiary border border-border rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      <div className="w-full space-y-1.5">
        <div className="flex justify-between font-mono text-label">
          <span>
            {tr("ui.wordCounter", {
              current: Math.min(currentIndex + 1, wordsArray.length),
              total: wordsArray.length,
            })}
          </span>
          <span className="font-bold text-foreground">
            {Math.round(
              (Math.min(currentIndex + 1, wordsArray.length) /
                wordsArray.length) *
                100,
            )}
            %
          </span>
        </div>
        <div className="w-full bg-tertiary border border-border h-2 rounded-[2px] overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-200"
            style={{
              width: `${(Math.min(currentIndex + 1, wordsArray.length) / wordsArray.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <AppButton
          onClick={() => {
            if (currentIndex >= wordsArray.length) {
              setCurrentIndex(0);
            }
            setIsPlaying(!isPlaying);
          }}
          color="primary"
          className="flex items-center gap-2"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <PlayIcon className="w-3.5 h-3.5" />
          )}
          {isPlaying ? tr("ui.pause") : tr("ui.play")}
        </AppButton>
        <AppButton
          onClick={() => {
            setIsPlaying(false);
            setCurrentIndex(0);
          }}
          color="tertiary"
          className="flex items-center gap-2"
        >
          <RotateCcwIcon className="w-3.5 h-3.5" />
          {tr("ui.reset")}
        </AppButton>
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
    if (time.minutes === 0 && time.seconds === 0) return tr("ui.seconds", { s: 0 });
    if (time.minutes === 0) {
      return tr("ui.seconds", { s: time.seconds });
    }
    return tr("ui.minutesAndSeconds", { m: time.minutes, s: time.seconds });
  };

  return (
    <div className="bg-tertiary dark:bg-background border border-border rounded-[2px] grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      <div className="p-4 sm:p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
              {tr("ui.estimatedReadingTime")}
            </span>
            <BookOpen className="w-4 h-4 text-foreground/70" />
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-foreground tracking-tight">
            {formatDuration(readingTimeObj)}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-border/60 space-y-1.5">
          <div className="flex justify-between font-mono text-foreground font-medium">
            <span>{tr("ui.readingSpeedLabel")}</span>
            <span className="font-bold text-foreground">
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
            className="w-full h-1.5 bg-tertiary border border-border rounded-lg appearance-none cursor-pointer accent-foreground"
          />
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
              {tr("ui.estimatedSpeakingTime")}
            </span>
            <Mic className="w-4 h-4 text-foreground/70" />
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-foreground tracking-tight">
            {formatDuration(speakingTimeObj)}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-border/60 space-y-1.5">
          <div className="flex justify-between font-mono text-foreground font-medium">
            <span>{tr("ui.speakingSpeedLabel")}</span>
            <span className="font-bold text-foreground">
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
            className="w-full h-1.5 bg-tertiary border border-border rounded-lg appearance-none cursor-pointer accent-foreground"
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
    const key = getFleschKey(ease);
    return t(`stats.fleschLabels.${key}`);
  };

  return (
    <div className="bg-tertiary dark:bg-background border border-border rounded-[2px] grid grid-cols-1 sm:grid-cols-2 overflow-hidden">
      <div className="p-4 sm:p-5 space-y-3 border-b sm:border-b-0 sm:border-r border-border">
        <p className="text-xs font-mono font-medium uppercase tracking-wider text-foreground">
          {t("stats.readabilityScores")}
        </p>
        <div className="grid grid-cols-2 gap-3 pt-1 font-mono">
          <div>
            <div className="text-xs uppercase font-medium text-foreground">
              {t("stats.words")}
            </div>
            <div className="text-lg font-bold text-foreground">
              {stats.words.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase font-medium text-foreground">
              {t("stats.characters")}
            </div>
            <div className="text-lg font-bold text-foreground">
              {stats.characters.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase font-medium text-foreground">
              {t("stats.sentences")}
            </div>
            <div className="text-lg font-bold text-foreground">
              {stats.sentences.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase font-medium text-foreground">
              {t("stats.paragraphs")}
            </div>
            <div className="text-lg font-bold text-foreground">
              {stats.paragraphs.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <p className="text-xs font-mono font-medium uppercase tracking-wider text-foreground mb-1">
            {tr("ui.complexityNote")}
          </p>
          <div className="flex items-baseline gap-2 font-mono">
            <span
              className={`text-2xl font-bold ${getFleschColor(stats.fleschEase)}`}
            >
              {stats.fleschEase}
            </span>
            <span
              className={`font-medium ${getFleschColor(stats.fleschEase)}`}
            >
              {getFleschTranslation(stats.fleschEase)}
            </span>
          </div>
        </div>
        <div className="mt-4 pt-2 border-t border-border font-mono text-foreground">
          {tr(`ui.${complexity.key}`)}
        </div>
      </div>
    </div>
  );
}

export default function ReadingTimeClient({
  locale = "pt",
  placeholder,
}: {
  locale?: string;
  placeholder?: string;
}) {
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
    }, 150);
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
    <section
      aria-label={tr("title")}
      className="mb-10 sm:mb-14 w-full space-y-4 sm:space-y-5"
    >
      <TextInputArea
        text={text}
        setText={setText}
        handleSample={handleSample}
        handleClear={handleClear}
        placeholder={placeholder}
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
          <AppButton
            onClick={() => {
              setCurrentIndex(0);
              setSpeedReaderWpm(readingWpm);
              setSpeedReaderActive(true);
            }}
            color="primary"
            className="flex items-center justify-center font-mono font-semibold"
          >
            {tr("ui.startSpeedReader")}
          </AppButton>
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
        <div className="bg-background border border-border rounded-[2px] p-4 sm:p-5">
          <AppTopWordsChart topWords={stats.topWords} />
        </div>
      )}
    </section>
  );
}
