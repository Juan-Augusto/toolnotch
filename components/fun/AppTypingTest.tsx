"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Timer,
  RotateCcw,
  Zap,
  Target,
  Trophy,
  Keyboard,
  Award,
} from "lucide-react";
import {
  AppButton,
  AppBadge,
  AppSegmentedControl,
} from "@/components/ui";

const PASSAGES: Record<string, string[]> = {
  pt: [
    "A prática constante da digitação melhora a agilidade mental e a produtividade no trabalho diário. Manter a postura correta e os dedos posicionados sobre a linha guia do teclado permite escrever com rapidez e precisão sem olhar para as teclas.",
    "O conhecimento compartilhado transforma equipes e impulsiona o desenvolvimento de software com qualidade e robustez. Programar com foco e disciplina traz clareza na solução dos problemas mais complexos da computação moderna.",
    "A tecnologia deve servir às pessoas tornando rotinas simples e produtivas. Desenvolver sistemas acessíveis e rápidos exige atenção aos detalhes, clareza no código e respeito à experiência de cada usuário.",
  ],
  es: [
    "La práctica constante de la mecanografía mejora la agilidad mental y la productividad en el trabajo diario. Mantener una postura adecuada y colocar los dedos en la fila guía del teclado permite escribir con rapidez y precisión sin mirar las teclas.",
    "El conocimiento compartido transforma equipos e impulsa el desarrollo de software con calidad y solidez. Programar con enfoque y disciplina aporta claridad en la resolución de los problemas más complejos.",
    "La tecnología debe servir a las personas haciendo que las rutinas sean sencillas y productivas. Desarrollar sistemas accesibles y veloces requiere atención a los detalles y respeto por la experiencia del usuario.",
  ],
  en: [
    "The quick brown fox jumps over the lazy dog. Consistent typing practice improves both mental agility and daily work productivity. Keeping proper posture and placing your fingers on the home row allows you to type quickly and accurately without looking at the keys.",
    "Shared knowledge transforms teams and accelerates high-quality software development. Programming with focus and discipline brings clarity to solving the most challenging problems in modern computing.",
    "Technology should serve people by making everyday routines simpler and more productive. Building accessible and responsive web applications requires attention to detail, code clarity, and respect for user experience.",
  ],
};

const TIME_OPTIONS = [
  { label: "15s", value: "15" },
  { label: "30s", value: "30" },
  { label: "60s", value: "60" },
  { label: "120s", value: "120" },
];

interface AppTypingTestProps {
  locale?: string;
}

export default function AppTypingTest({ locale = "en" }: AppTypingTestProps) {
  const langKey = locale === "pt" ? "pt" : locale === "es" ? "es" : "en";
  const passageList = PASSAGES[langKey] ?? PASSAGES.en;

  const [duration, setDuration] = useState<string>("30");
  const [passageIndex, setPassageIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [totalErrors, setTotalErrors] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const textToType = passageList[passageIndex % passageList.length];

  const resetTest = useCallback(
    (newDuration?: string, nextPassage = false) => {
      if (timerRef.current) clearInterval(timerRef.current);
      const chosenDuration = parseInt(newDuration ?? duration, 10);
      setTimeLeft(chosenDuration);
      setIsActive(false);
      setIsFinished(false);
      setTypedText("");
      setTotalErrors(0);
      if (nextPassage) {
        setPassageIndex((prev) => (prev + 1) % passageList.length);
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    },
    [duration, passageList.length],
  );

  const handleDurationChange = (val: string) => {
    setDuration(val);
    resetTest(val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const value = e.target.value;

    if (!isActive && value.length > 0) {
      setIsActive(true);
    }

    if (value.length > typedText.length) {
      const charIndex = value.length - 1;
      if (value[charIndex] !== textToType[charIndex]) {
        setTotalErrors((prev) => prev + 1);
      }
    }

    setTypedText(value);

    if (value.length >= textToType.length) {
      setIsActive(false);
      setIsFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsActive(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const totalDuration = parseInt(duration, 10);
  const elapsedSeconds = Math.max(1, totalDuration - timeLeft);
  const elapsedMinutes = elapsedSeconds / 60;

  let correctChars = 0;
  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === textToType[i]) {
      correctChars++;
    }
  }

  const wpm = Math.round(correctChars / 5 / elapsedMinutes) || 0;
  const rawWpm = Math.round(typedText.length / 5 / elapsedMinutes) || 0;
  const accuracy = typedText.length
    ? Math.max(0, Math.round((correctChars / typedText.length) * 100))
    : 100;

  const tLabels = {
    pt: {
      timePreset: "Tempo",
      wpm: "PPM (WPM)",
      accuracy: "Precisão",
      rawWpm: "PPM Bruto",
      timeLeft: "Tempo restante",
      errors: "Erros",
      chars: "Caracteres",
      clickToFocus: "Clique aqui ou comece a digitar para iniciar...",
      finishedTitle: "Teste Concluído!",
      finishedSubtitle: "Excelente esforço! Confira seu desempenho abaixo:",
      tryAgain: "Tentar Novamente",
      nextText: "Outro Texto",
      speedTier:
        wpm >= 80
          ? "Velocidade de Mestre!"
          : wpm >= 60
            ? "Muito Rápido!"
            : wpm >= 40
              ? "Velocidade Média"
              : "Continue Praticando!",
    },
    es: {
      timePreset: "Tiempo",
      wpm: "PPM (WPM)",
      accuracy: "Precisión",
      rawWpm: "PPM Bruto",
      timeLeft: "Tiempo restante",
      errors: "Errores",
      chars: "Caracteres",
      clickToFocus: "Haz clic aquí o empieza a escribir para comenzar...",
      finishedTitle: "¡Prueba Completada!",
      finishedSubtitle: "¡Buen esfuerzo! Revisa tu rendimiento a continuación:",
      tryAgain: "Intentar de Nuevo",
      nextText: "Otro Texto",
      speedTier:
        wpm >= 80
          ? "¡Velocidad de Maestro!"
          : wpm >= 60
            ? "¡Muy Rápido!"
            : wpm >= 40
              ? "Velocidad Promedio"
              : "¡Sigue Practicando!",
    },
    en: {
      timePreset: "Time",
      wpm: "WPM",
      accuracy: "Accuracy",
      rawWpm: "Raw WPM",
      timeLeft: "Time left",
      errors: "Errors",
      chars: "Characters",
      clickToFocus: "Click here or start typing to begin...",
      finishedTitle: "Test Complete!",
      finishedSubtitle: "Great job! Here is your performance summary:",
      tryAgain: "Try Again",
      nextText: "Next Passage",
      speedTier:
        wpm >= 80
          ? "Master Typist!"
          : wpm >= 60
            ? "Fast Typist!"
            : wpm >= 40
              ? "Average Speed"
              : "Keep Practicing!",
    },
  }[langKey];

  return (
    <div className="space-y-6 w-full">
      {/* Controls & Live Metrics Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            {tLabels.timePreset}:
          </span>
          <AppSegmentedControl
            options={TIME_OPTIONS}
            value={duration}
            onChange={handleDurationChange}
            size="sm"
            color="primary"
          />
        </div>

        <div className="flex items-center gap-2.5 font-mono text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-background border border-border rounded-[2px]">
            <Timer className="w-3.5 h-3.5 text-primary" />
            <span className="font-bold text-foreground">{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-background border border-border rounded-[2px]">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="font-bold text-foreground">{wpm} WPM</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-background border border-border rounded-[2px]">
            <Target className="w-3.5 h-3.5 text-primary" />
            <span className="font-bold text-foreground">{accuracy}%</span>
          </div>
        </div>
      </div>

      {!isFinished ? (
        <div
          onClick={() => inputRef.current?.focus()}
          className="relative p-4 sm:p-6 bg-background border border-border rounded-[2px] cursor-text min-h-[160px] flex flex-col justify-between"
        >
          {/* Display Passage with live character status */}
          <div className="font-mono text-sm sm:text-base md:text-lg leading-relaxed select-none tracking-wide">
            {textToType.split("").map((char, index) => {
              let charStyle = "text-muted-foreground/60";
              const isCurrent = index === typedText.length;

              if (index < typedText.length) {
                charStyle =
                  typedText[index] === char
                    ? "text-primary font-semibold"
                    : "text-red-500 bg-red-500/15 underline";
              }

              return (
                <span
                  key={index}
                  className={`${charStyle} ${
                    isCurrent
                      ? "border-b-2 border-primary animate-pulse text-foreground font-bold bg-primary/10"
                      : ""
                  }`}
                >
                  {char}
                </span>
              );
            })}
          </div>

          {/* Hidden/Transparent Input to capture keystrokes */}
          <input
            ref={inputRef}
            type="text"
            value={typedText}
            onChange={handleInputChange}
            disabled={isFinished}
            autoFocus
            className="absolute inset-0 opacity-0 cursor-text w-full h-full"
            aria-label={tLabels.clickToFocus}
          />

          {!isActive && typedText.length === 0 && (
            <div className="mt-4 pt-3 border-t border-border/50 text-xs font-mono text-muted-foreground/80 flex items-center justify-between">
              <span>{tLabels.clickToFocus}</span>
              <span className="text-[11px] text-primary">● Tab + Enter</span>
            </div>
          )}
        </div>
      ) : (
        /* Results View */
        <div className="p-5 sm:p-7 bg-background border-2 border-border rounded-[2px] text-center space-y-6">
          <div>
            <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-3">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-mono uppercase text-foreground">
              {tLabels.finishedTitle}
            </h3>
            <p className="text-xs sm:text-sm text-label font-mono mt-1">
              {tLabels.finishedSubtitle}
            </p>
            <div className="mt-2.5">
              <AppBadge bg="bg-primary" text="text-background" icon={<Award className="w-3.5 h-3.5" />}>
                {tLabels.speedTier}
              </AppBadge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-mono">
            <div className="p-3 sm:p-4 bg-tertiary border border-border rounded-[2px]">
              <span className="text-xs text-muted-foreground uppercase">{tLabels.wpm}</span>
              <p className="text-2xl sm:text-3xl font-bold text-primary mt-1">{wpm}</p>
            </div>
            <div className="p-3 sm:p-4 bg-tertiary border border-border rounded-[2px]">
              <span className="text-xs text-muted-foreground uppercase">{tLabels.accuracy}</span>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{accuracy}%</p>
            </div>
            <div className="p-3 sm:p-4 bg-tertiary border border-border rounded-[2px]">
              <span className="text-xs text-muted-foreground uppercase">{tLabels.rawWpm}</span>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{rawWpm}</p>
            </div>
            <div className="p-3 sm:p-4 bg-tertiary border border-border rounded-[2px]">
              <span className="text-xs text-muted-foreground uppercase">{tLabels.errors}</span>
              <p className="text-2xl sm:text-3xl font-bold text-red-500 mt-1">{totalErrors}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <AppButton
              color="primary"
              onClick={() => resetTest(duration)}
              className="font-mono"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {tLabels.tryAgain}
            </AppButton>
            <AppButton
              color="secondary"
              onClick={() => resetTest(duration, true)}
              className="font-mono"
            >
              {tLabels.nextText}
            </AppButton>
          </div>
        </div>
      )}

      {/* Footer controls when in progress */}
      {!isFinished && (
        <div className="flex items-center justify-between font-mono text-xs">
          <AppButton
            color="tertiary"
            small
            onClick={() => resetTest(duration)}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            {tLabels.tryAgain}
          </AppButton>
          <AppButton
            color="tertiary"
            small
            onClick={() => resetTest(duration, true)}
            className="text-muted-foreground hover:text-foreground"
          >
            {tLabels.nextText}
          </AppButton>
        </div>
      )}
    </div>
  );
}
