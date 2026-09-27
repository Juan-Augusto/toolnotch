"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  Users,
  CreditCard,
  RotateCcw,
  Eye,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  BookmarkCheck,
  CheckCircle2,
  BookOpen,
  Timer,
} from "lucide-react";
import {
  AppButton,
  AppCard,
  AppInput,
  AppBadge,
  AppTabsChips,
} from "@/components/ui";

const FIBONACCI_CARDS = ["1", "2", "3", "5", "8", "13", "21", "34", "?", "☕"];
const NUMERIC_CARDS = [1, 2, 3, 5, 8, 13, 21, 34];

interface Participant {
  id: string;
  name: string;
  vote: string | null;
}

interface BacklogItem {
  id: string;
  story: string;
  points: string;
}

interface Props {
  labels: Record<string, string>;
  locale?: string;
}

type TabMode = "team" | "camera" | "guide";

export default function PlanningPokerClient({ labels, locale = "pt" }: Props) {
  const [activeTab, setActiveTab] = useState<TabMode>("team");

  // Story & Participants state
  const [story, setStory] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [participants, setParticipants] = useState<Participant[]>(() => {
    if (locale === "es") {
      return [
        { id: "1", name: "Alice (Dev)", vote: null },
        { id: "2", name: "Bruno (Dev)", vote: null },
        { id: "3", name: "Carlos (QA)", vote: null },
        { id: "4", name: "Tú", vote: null },
      ];
    }
    if (locale === "en") {
      return [
        { id: "1", name: "Alice (Dev)", vote: null },
        { id: "2", name: "Bob (Dev)", vote: null },
        { id: "3", name: "Charlie (QA)", vote: null },
        { id: "4", name: "You", vote: null },
      ];
    }
    return [
      { id: "1", name: "Alice (Dev)", vote: null },
      { id: "2", name: "Bruno (Dev)", vote: null },
      { id: "3", name: "Carlos (QA)", vote: null },
      { id: "4", name: "Você", vote: null },
    ];
  });

  const [activeParticipantId, setActiveParticipantId] = useState<string>("1");
  const [revealed, setRevealed] = useState(false);

  // Backlog state
  const [backlog, setBacklog] = useState<BacklogItem[]>([]);
  const [consensusInput, setConsensusInput] = useState<string>("");
  const [copiedBacklog, setCopiedBacklog] = useState(false);

  // Camera Mode state
  const [cameraCard, setCameraCard] = useState<string>("5");
  const [cameraFlipped, setCameraFlipped] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Calculate vote stats when revealed
  const stats = useMemo(() => {
    const votes = participants.map((p) => p.vote).filter(Boolean) as string[];
    if (votes.length === 0) return null;

    const numericVotes = votes
      .map((v) => Number(v))
      .filter((n) => !isNaN(n) && NUMERIC_CARDS.includes(n));

    const isAllSame = votes.length > 1 && votes.every((v) => v === votes[0]);

    if (numericVotes.length === 0) {
      return {
        votesCount: votes.length,
        numericCount: 0,
        average: null,
        median: null,
        min: null,
        max: null,
        minVoters: [] as string[],
        maxVoters: [] as string[],
        hasDivergence: false,
        isConsensus: isAllSame,
        consensusValue: isAllSame ? votes[0] : null,
      };
    }

    numericVotes.sort((a, b) => a - b);
    const sum = numericVotes.reduce((acc, curr) => acc + curr, 0);
    const avg = Number((sum / numericVotes.length).toFixed(1));

    const mid = Math.floor(numericVotes.length / 2);
    const median =
      numericVotes.length % 2 !== 0
        ? numericVotes[mid]
        : Number(((numericVotes[mid - 1] + numericVotes[mid]) / 2).toFixed(1));

    const min = numericVotes[0];
    const max = numericVotes[numericVotes.length - 1];

    // Find participant names for min and max
    const minVoters = participants.filter((p) => p.vote === String(min)).map((p) => p.name);
    const maxVoters = participants.filter((p) => p.vote === String(max)).map((p) => p.name);

    const hasDivergence = max - min >= 3;

    return {
      votesCount: votes.length,
      numericCount: numericVotes.length,
      average: avg,
      median,
      min,
      max,
      minVoters,
      maxVoters,
      hasDivergence,
      isConsensus: isAllSame,
      consensusValue: isAllSame ? votes[0] : String(median),
    };
  }, [participants]);

  // Set consensus suggestion when votes are revealed
  useEffect(() => {
    if (revealed && stats?.consensusValue) {
      setConsensusInput(stats.consensusValue);
    }
  }, [revealed, stats]);

  // Vote for a participant
  function handleVote(card: string) {
    if (revealed || !activeParticipantId || participants.length === 0) return;
    setParticipants((prev) =>
      prev.map((p) => (p.id === activeParticipantId ? { ...p, vote: card } : p))
    );

    // Auto-advance to next participant who hasn't voted yet
    const nextUnvoted = participants.find(
      (p) => p.id !== activeParticipantId && p.vote === null
    );
    if (nextUnvoted) {
      setActiveParticipantId(nextUnvoted.id);
    }
  }

  function handleReveal() {
    setRevealed(true);
  }

  function handleNewRound() {
    setParticipants((prev) => prev.map((p) => ({ ...p, vote: null })));
    setRevealed(false);
    setConsensusInput("");
    setStory("");
    if (participants.length > 0) {
      setActiveParticipantId(participants[0].id);
    } else {
      setActiveParticipantId("");
    }
  }

  function handleAddParticipant() {
    const name = newMemberName.trim();
    if (!name) return;
    const newId = String(Date.now());
    setParticipants((prev) => [...prev, { id: newId, name, vote: null }]);
    setNewMemberName("");
    setActiveParticipantId(newId);
  }

  function handleRemoveParticipant(id: string) {
    setParticipants((prev) => {
      const remaining = prev.filter((p) => p.id !== id);
      if (activeParticipantId === id) {
        setActiveParticipantId(remaining[0]?.id || "");
      }
      return remaining;
    });
  }

  function handleClearAllParticipants() {
    setParticipants([]);
    setActiveParticipantId("");
    setRevealed(false);
  }

  function handleSaveToBacklog() {
    if (!consensusInput.trim()) return;
    const taskName =
      story.trim() ||
      (locale === "pt"
        ? `Tarefa #${backlog.length + 1}`
        : locale === "es"
          ? `Tarea #${backlog.length + 1}`
          : `Story #${backlog.length + 1}`);

    setBacklog((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        story: taskName,
        points: consensusInput.trim(),
      },
    ]);

    handleNewRound();
  }

  function handleRemoveBacklogItem(id: string) {
    setBacklog((prev) => prev.filter((item) => item.id !== id));
  }

  const totalBacklogPoints = useMemo(() => {
    return backlog.reduce((sum, item) => {
      const num = Number(item.points);
      return isNaN(num) ? sum : sum + num;
    }, 0);
  }, [backlog]);

  async function handleCopyBacklogMarkdown() {
    if (backlog.length === 0) return;
    const heading =
      locale === "pt"
        ? "### Backlog Estimado na Sessão de Planning Poker\n"
        : locale === "es"
          ? "### Backlog Estimado en la Sesión de Planning Poker\n"
          : "### Estimated Backlog in Planning Poker Session\n";

    const rows = backlog.map((b) => `- **${b.story}**: ${b.points} pts`).join("\n");
    const totalLine =
      locale === "pt"
        ? `\n\n**Total da Sprint:** ${totalBacklogPoints} story points`
        : locale === "es"
          ? `\n\n**Total del Sprint:** ${totalBacklogPoints} story points`
          : `\n\n**Total Sprint:** ${totalBacklogPoints} story points`;

    await navigator.clipboard.writeText(heading + rows + totalLine);
    setCopiedBacklog(true);
    setTimeout(() => setCopiedBacklog(false), 2000);
  }

  // Camera countdown trigger
  function handleStartCountdown() {
    setCameraFlipped(false);
    setCountdown(3);
  }

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      countdownTimer.current = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else {
      setCameraFlipped(true);
      setCountdown(null);
    }
    return () => {
      if (countdownTimer.current) clearTimeout(countdownTimer.current);
    };
  }, [countdown]);

  const fibonacciGuideItems = useMemo(() => {
    if (locale === "es") {
      return [
        {
          title: "1 Punto (Muy Simple / XS)",
          desc: "Cambios puntuales, corrección de texto o ajustes de estilo. Tiempo estimado: pocas horas.",
          color: "text-primary",
        },
        {
          title: "2 Puntos (Simple / S)",
          desc: "Tarea conocida y de bajo riesgo con requisitos definidos. Tiempo estimado: alrededor de 1 día.",
          color: "text-primary",
        },
        {
          title: "3 Puntos (Pequeña a Mediana / M)",
          desc: "Flujo estándar o endpoint con pruebas unitarias. Tiempo estimado: 1 a 2 días.",
          color: "text-primary",
        },
        {
          title: "5 Puntos (Mediana / M)",
          desc: "Funcionalidad que involucra frontend y backend con integración. Tiempo estimado: 2 a 3 días.",
          color: "text-primary",
        },
        {
          title: "8 Puntos (Grande / L)",
          desc: "Alta complejidad o nueva arquitectura. Atención: consume casi la mitad de un sprint.",
          color: "text-primary",
        },
        {
          title: "13 Puntos (Muy Grande / XL)",
          desc: "Alto riesgo y dependencias. Recomendación: dividir la historia en partes más pequeñas.",
          color: "text-amber-500",
        },
        {
          title: "21+ Puntos (Épico)",
          desc: "Imposible estimar con precisión en este sprint. Debe dividirse en historias menores en el refinamiento.",
          color: "text-danger",
        },
        {
          title: "? y ☕ (Duda o Pausa)",
          desc: "? indica falta de información o alcance incierto. ☕ señala pausa para descanso del equipo.",
          color: "text-foreground",
        },
      ];
    }
    if (locale === "en") {
      return [
        {
          title: "1 Point (Very Simple / XS)",
          desc: "Minor fixes, copy updates, or style tweaks. Estimated time: a few hours.",
          color: "text-primary",
        },
        {
          title: "2 Points (Simple / S)",
          desc: "Familiar, low-risk task with clear requirements. Estimated time: about 1 day.",
          color: "text-primary",
        },
        {
          title: "3 Points (Small to Medium / M)",
          desc: "Standard flow or API endpoint implementation with tests. Estimated time: 1 to 2 days.",
          color: "text-primary",
        },
        {
          title: "5 Points (Medium / M)",
          desc: "Feature spanning frontend and backend integration. Estimated time: 2 to 3 days.",
          color: "text-primary",
        },
        {
          title: "8 Points (Large / L)",
          desc: "High complexity or new architecture. Note: may take nearly half a sprint.",
          color: "text-primary",
        },
        {
          title: "13 Points (Very Large / XL)",
          desc: "High risk and dependencies. Recommendation: split the story into smaller parts.",
          color: "text-amber-500",
        },
        {
          title: "21+ Points (Epic)",
          desc: "Too large to estimate accurately in this sprint. Must be broken down during refinement.",
          color: "text-danger",
        },
        {
          title: "? & ☕ (Unclear or Coffee)",
          desc: "? indicates missing details or uncertain scope. ☕ signals a requested break for the team.",
          color: "text-foreground",
        },
      ];
    }
    return [
      {
        title: "1 Ponto (Muito Simples / PP)",
        desc: "Alterações pontuais, correção de texto ou ajuste de estilo. Tempo estimado: poucas horas.",
        color: "text-primary",
      },
      {
        title: "2 Pontos (Simples / P)",
        desc: "Tarefa conhecida e de baixo risco, com requisitos bem definidos. Tempo estimado: cerca de 1 dia.",
        color: "text-primary",
      },
      {
        title: "3 Pontos (Pequena a Média / M)",
        desc: "Implementação de fluxo padrão ou endpoint com testes unitários. Tempo estimado: 1 a 2 dias.",
        color: "text-primary",
      },
      {
        title: "5 Pontos (Média / M)",
        desc: "Nova funcionalidade envolvendo frontend e backend com integração. Tempo estimado: 2 a 3 dias.",
        color: "text-primary",
      },
      {
        title: "8 Pontos (Grande / G)",
        desc: "Complexidade alta ou arquitetura nova. Atenção: consome quase metade de uma sprint.",
        color: "text-primary",
      },
      {
        title: "13 Pontos (Muito Grande / GG)",
        desc: "Risco alto e muitas dependências. Recomendação: fatiar a história em duas ou três partes menores.",
        color: "text-amber-500",
      },
      {
        title: "21+ Pontos (Épico)",
        desc: "Impossível estimar com precisão nesta sprint. Deve ser quebrado em histórias menores no refinamento.",
        color: "text-danger",
      },
      {
        title: "? e ☕ (Dúvida ou Pausa)",
        desc: "? indica falta de informações ou escopo incerto. ☕ sinaliza necessidade de pausa para descanso da equipe.",
        color: "text-foreground",
      },
    ];
  }, [locale]);

  const activeParticipant = participants.find((p) => p.id === activeParticipantId);
  const totalVotesRecorded = participants.filter((p) => p.vote !== null).length;

  return (
    <div className="space-y-6 w-full">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/70">
        <AppTabsChips
          items={[
            {
              id: "team",
              label: labels.tabTeam || "Modo Time / Sessão",
              icon: <Users className="w-4 h-4" />,
            },
            {
              id: "camera",
              label: labels.tabCamera || "Carta para Câmera",
              icon: <CreditCard className="w-4 h-4" />,
            },
            {
              id: "guide",
              label: labels.tabGuide || "Guia Fibonacci",
              icon: <BookOpen className="w-4 h-4" />,
            },
          ]}
          value={activeTab}
          onChange={(val) => setActiveTab(val as TabMode)}
        />

        {activeTab === "team" && (
          <div className="flex items-center gap-2">
            <AppBadge
              bg="bg-primary/10"
              text="text-primary"
              className="border border-primary/30 font-mono text-sm px-2.5 py-1"
            >
              {totalVotesRecorded}/{participants.length} {labels.voteRecorded || "votos"}
            </AppBadge>
          </div>
        )}
      </div>

      {/* TAB 1: TEAM / SESSION REFINEMENT MODE */}
      {activeTab === "team" && (
        <div className="space-y-6">
          {/* Story Input */}
          <AppCard border cornerAccents className="p-4 sm:p-5 bg-tertiary space-y-3">
            <AppInput
              label={labels.storyLabel || "História / Tarefa da Rodada"}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder={labels.storyPlaceholder || "Descreva a história ou tarefa a estimar..."}
              className="font-mono text-sm sm:text-base"
            />
          </AppCard>

          {/* Participants Cards Grid */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <h3 className="font-mono font-bold text-sm sm:text-base uppercase text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{labels.participantsTitle || "Participantes da Rodada"}</span>
                  <AppBadge bg="bg-primary/10" text="text-primary" className="text-sm font-mono ml-1 px-2.5 py-0.5">
                    {participants.length}
                  </AppBadge>
                </h3>

                {participants.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllParticipants}
                    className="text-sm font-mono text-muted-foreground hover:text-danger flex items-center gap-1.5 transition-colors px-2.5 py-1 rounded-[2px] hover:bg-danger/10 border border-transparent hover:border-danger/30"
                    title={labels.clearAllParticipants || "Excluir todos os participantes"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{labels.clearAllParticipants || "Excluir todos"}</span>
                  </button>
                )}
              </div>

              {/* Add member form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddParticipant();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder={labels.addParticipantPlaceholder || "Nome do desenvolvedor..."}
                  className="px-3 py-2 text-sm sm:text-base font-mono bg-background border border-border rounded-[2px] text-foreground outline-none focus:border-primary"
                />
                <AppButton
                  type="submit"
                  small
                  color="secondary"
                  disabled={!newMemberName.trim()}
                  className="font-mono text-sm px-3.5 h-[38px]"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>{labels.addParticipant || "Adicionar"}</span>
                </AppButton>
              </form>
            </div>

            {participants.length === 0 ? (
              <div className="p-8 text-center bg-tertiary border border-dashed border-border rounded-[2px] space-y-2">
                <Users className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                <p className="text-sm sm:text-base font-mono text-muted-foreground">
                  {labels.noParticipantsMessage || "Nenhum participante na rodada. Adicione os membros da equipe acima para iniciar a votação."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {participants.map((p) => {
                  const isActive = activeParticipantId === p.id && !revealed;
                  const hasVoted = p.vote !== null;

                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        if (!revealed) setActiveParticipantId(p.id);
                      }}
                      className={`relative p-3 sm:p-4 rounded-[2px] border transition-all cursor-pointer select-none flex flex-col items-center justify-between min-h-[140px] sm:min-h-[160px] ${
                        isActive
                          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                          : "border-border bg-tertiary hover:border-primary/50"
                      }`}
                    >
                      <div className="w-full flex items-center justify-between text-sm font-mono">
                        <span className="font-bold truncate max-w-[100px] sm:max-w-[120px] text-foreground" title={p.name}>
                          {p.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveParticipant(p.id);
                          }}
                          className="text-muted-foreground/60 hover:text-danger p-1 transition-colors rounded-[2px] hover:bg-danger/10"
                          title={labels.removeParticipant || "Remover participante"}
                          aria-label={`${labels.removeParticipant || "Remover participante"} ${p.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Card display */}
                      <div className="my-2 flex items-center justify-center">
                        {!revealed ? (
                          hasVoted ? (
                            <div className="w-10 sm:w-12 h-14 sm:h-16 rounded-[2px] bg-primary text-background border border-primary flex flex-col items-center justify-center font-mono font-bold shadow-xs">
                              <CheckCircle2 className="w-5 h-5 mb-0.5" />
                              <span className="text-xs uppercase tracking-tight font-bold">OK</span>
                            </div>
                          ) : (
                            <div className="w-10 sm:w-12 h-14 sm:h-16 rounded-[2px] border border-dashed border-border flex items-center justify-center text-muted-foreground/60 font-mono text-base font-bold">
                              ?
                            </div>
                          )
                        ) : (
                          <div className="w-12 sm:w-14 h-16 sm:h-20 rounded-[2px] border-2 border-primary bg-background text-primary font-mono font-black text-2xl sm:text-3xl flex items-center justify-center shadow-xs animate-in zoom-in-75 duration-200">
                            {p.vote ?? "-"}
                          </div>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="w-full text-center">
                        <span className="text-sm font-mono text-muted-foreground font-medium">
                          {!revealed
                            ? hasVoted
                              ? labels.voteRecorded || "Voto registrado"
                              : labels.pendingVote || "Aguardando"
                            : `Votou: ${p.vote ?? "-"}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Voting Action Area */}
          {!revealed ? (
            <AppCard border cornerAccents={false} className="p-4 sm:p-6 bg-tertiary space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm sm:text-base font-mono font-semibold text-foreground">
                  {participants.length > 0 ? (
                    <>
                      {labels.votingPrompt || "Selecione o participante e clique na carta:"}{" "}
                      <span className="text-primary font-bold">
                        {activeParticipant?.name || ""}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">
                      {labels.addParticipantsPrompt || "Adicione participantes acima para começar a votar"}
                    </span>
                  )}
                </p>

                <div className="flex items-center gap-2">
                  <AppButton
                    onClick={handleReveal}
                    disabled={totalVotesRecorded === 0 || participants.length === 0}
                    color="primary"
                    className="font-mono text-sm sm:text-base px-5 h-[42px]"
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    <span>{labels.revealAll || "Revelar Todos os Votos"}</span>
                  </AppButton>
                </div>
              </div>

              {/* Fibonacci Deck */}
              <div className="flex flex-wrap gap-2.5 sm:gap-3 items-center justify-center sm:justify-start pt-1">
                {FIBONACCI_CARDS.map((card) => {
                  const isSelected = activeParticipant?.vote === card;
                  return (
                    <button
                      key={card}
                      type="button"
                      disabled={!activeParticipant || participants.length === 0}
                      onClick={() => handleVote(card)}
                      className={`w-14 sm:w-16 h-20 sm:h-24 rounded-[2px] border-2 font-mono font-bold text-lg sm:text-xl flex items-center justify-center transition-all select-none ${
                        !activeParticipant || participants.length === 0
                          ? "opacity-40 cursor-not-allowed border-border bg-background text-muted-foreground"
                          : isSelected
                            ? "border-primary bg-primary text-background shadow-md scale-105 cursor-pointer"
                            : "border-border bg-background text-foreground hover:border-primary/80 hover:text-primary hover:shadow-2xs cursor-pointer"
                      }`}
                    >
                      {card}
                    </button>
                  );
                })}
              </div>
            </AppCard>
          ) : (
            /* Results & Consensus Area */
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <AppCard border cornerAccents className="p-4 sm:p-6 bg-tertiary space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="font-mono font-bold text-base sm:text-lg uppercase text-foreground">
                      Resultado da Estimativa
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <AppButton
                      onClick={handleNewRound}
                      color="tertiary"
                      className="font-mono text-sm sm:text-base px-4 h-[40px]"
                    >
                      <RotateCcw className="w-4 h-4 mr-1.5" />
                      <span>{labels.newRound || "Nova Rodada"}</span>
                    </AppButton>
                  </div>
                </div>

                {/* Consensus Banner or Divergence Alert */}
                {stats?.isConsensus ? (
                  <div className="p-4 rounded-[2px] bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="font-mono font-bold text-base sm:text-lg text-foreground uppercase">
                        Consenso Unânime do Time!
                      </h4>
                      <p className="text-sm sm:text-base text-muted-foreground font-mono">
                        Todos os participantes concordaram na estimativa de{" "}
                        <strong className="text-foreground">{stats.consensusValue} story points</strong>.
                      </p>
                    </div>
                  </div>
                ) : stats?.hasDivergence ? (
                  <div className="p-4 rounded-[2px] bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-1.5 text-sm sm:text-base font-mono">
                      <h4 className="font-bold text-base sm:text-lg text-foreground uppercase">
                        {labels.divergenceTitle || "Debate Recomendado"}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {labels.divergenceMessage ||
                          "Divergência detectada: compare o menor voto com o maior voto antes de bater o martelo."}
                      </p>
                      <div className="flex flex-wrap gap-4 pt-1 font-semibold text-sm sm:text-base">
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {labels.minVote || "Menor voto"}: {stats.min} pts ({stats.minVoters?.join(", ")})
                        </span>
                        <span className="text-amber-600 dark:text-amber-400">
                          {labels.maxVote || "Maior voto"}: {stats.max} pts ({stats.maxVoters?.join(", ")})
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Stats Numbers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                  <div className="p-3 bg-background border border-border rounded-[2px]">
                    <span className="text-sm text-muted-foreground uppercase font-bold tracking-wide">{labels.averageLabel || "Média"}</span>
                    <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                      {stats?.average !== null ? `${stats?.average} pts` : "-"}
                    </p>
                  </div>

                  <div className="p-3 bg-background border border-border rounded-[2px]">
                    <span className="text-sm text-muted-foreground uppercase font-bold tracking-wide">{labels.medianLabel || "Mediana"}</span>
                    <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                      {stats?.median !== null ? `${stats?.median} pts` : "-"}
                    </p>
                  </div>

                  <div className="p-3 bg-background border border-border rounded-[2px]">
                    <span className="text-sm text-muted-foreground uppercase font-bold tracking-wide">{labels.minVote || "Menor"}</span>
                    <p className="text-xl sm:text-2xl font-bold text-emerald-500 mt-1">
                      {stats?.min !== null ? `${stats?.min} pts` : "-"}
                    </p>
                  </div>

                  <div className="p-3 bg-background border border-border rounded-[2px]">
                    <span className="text-sm text-muted-foreground uppercase font-bold tracking-wide">{labels.maxVote || "Maior"}</span>
                    <p className="text-xl sm:text-2xl font-bold text-amber-500 mt-1">
                      {stats?.max !== null ? `${stats?.max} pts` : "-"}
                    </p>
                  </div>
                </div>

                {/* Save to Sprint Backlog Form */}
                <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-mono font-semibold text-foreground">
                      Consenso Final da Tarefa:
                    </span>
                    <input
                      type="text"
                      value={consensusInput}
                      onChange={(e) => setConsensusInput(e.target.value)}
                      className="w-20 px-3 py-1.5 text-base font-mono font-bold text-center bg-background border border-border rounded-[2px] text-foreground focus:border-primary outline-none"
                    />
                    <span className="text-sm sm:text-base font-mono text-muted-foreground">pts</span>
                  </div>

                  <AppButton
                    onClick={handleSaveToBacklog}
                    disabled={!consensusInput.trim()}
                    color="primary"
                    className="font-mono text-sm sm:text-base px-5 h-[42px]"
                  >
                    <BookmarkCheck className="w-4 h-4 mr-1.5" />
                    <span>{labels.saveToBacklog || "Salvar no Backlog da Sprint"}</span>
                  </AppButton>
                </div>
              </AppCard>
            </div>
          )}

          {/* Session Backlog Table */}
          {backlog.length > 0 && (
            <AppCard border cornerAccents={false} className="p-4 sm:p-6 bg-tertiary space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/70">
                <div className="flex items-center gap-2">
                  <h3 className="font-mono font-bold text-sm sm:text-base uppercase text-foreground">
                    {labels.backlogTitle || "Histórias Estimadas na Sessão"}
                  </h3>
                  <AppBadge bg="bg-primary/10" text="text-primary" className="font-mono text-sm border border-primary/30 px-2.5 py-0.5">
                    {backlog.length} {backlog.length === 1 ? "história" : "histórias"}
                  </AppBadge>
                </div>

                <div className="flex items-center gap-2">
                  <AppButton
                    onClick={handleCopyBacklogMarkdown}
                    small
                    color="secondary"
                    className="font-mono text-sm px-3.5 h-[36px]"
                  >
                    {copiedBacklog ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                        <span>{labels.backlogCopied || "Backlog copiado!"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        <span>{labels.exportBacklog || "Copiar Backlog em Markdown"}</span>
                      </>
                    )}
                  </AppButton>

                  <AppButton
                    onClick={() => setBacklog([])}
                    small
                    color="tertiary"
                    className="font-mono text-sm text-danger hover:text-danger px-3 h-[36px]"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    <span>{labels.clearBacklog || "Limpar Backlog"}</span>
                  </AppButton>
                </div>
              </div>

              <div className="divide-y divide-border/60">
                {backlog.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-sm sm:text-base font-mono">
                    <span className="text-foreground font-medium">{item.story}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary px-2.5 py-0.5 rounded-[2px] bg-primary/10 border border-primary/30 text-sm sm:text-base">
                        {item.points} pts
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBacklogItem(item.id)}
                        className="text-muted-foreground/60 hover:text-danger p-1 transition-colors"
                        title="Remover história"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border/70 flex items-center justify-between text-sm sm:text-base font-mono font-bold text-foreground">
                <span>{labels.totalPoints || "Total da Sprint"}:</span>
                <span className="text-base sm:text-lg text-primary">{totalBacklogPoints} story points</span>
              </div>
            </AppCard>
          )}
        </div>
      )}

      {/* TAB 2: CAMERA CARD MODE (ZOOM / MEET) */}
      {activeTab === "camera" && (
        <div className="max-w-xl mx-auto space-y-6 text-center">
          <p className="text-sm sm:text-base font-mono text-muted-foreground">
            {labels.flipCardHint || "Escolha sua carta e mostre para a câmera na contagem do time:"}
          </p>

          {/* Big Flip Card */}
          <div className="flex items-center justify-center py-4">
            <div
              onClick={() => setCameraFlipped(!cameraFlipped)}
              className={`w-44 sm:w-56 h-64 sm:h-80 rounded-[4px] border-4 transition-all duration-300 transform select-none cursor-pointer flex flex-col items-center justify-center shadow-lg ${
                cameraFlipped
                  ? "border-primary bg-background text-primary scale-105"
                  : "border-border bg-tertiary text-muted-foreground"
              }`}
            >
              {countdown !== null ? (
                <div className="text-7xl font-mono font-black text-amber-500 animate-pulse">
                  {countdown}
                </div>
              ) : cameraFlipped ? (
                <>
                  <div className="text-7xl sm:text-8xl font-mono font-black tracking-tighter">
                    {cameraCard}
                  </div>
                  <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground mt-2 font-bold">
                    Story Points
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <CreditCard className="w-12 h-12 text-muted-foreground/40" />
                  <span className="text-sm font-mono uppercase tracking-wider text-muted-foreground/70 font-semibold">
                    Carta Oculta
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Card Deck Selector */}
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-center">
            {FIBONACCI_CARDS.map((card) => {
              const isSelected = cameraCard === card;
              return (
                <button
                  key={card}
                  type="button"
                  onClick={() => {
                    setCameraCard(card);
                    setCameraFlipped(true);
                  }}
                  className={`w-12 sm:w-14 h-16 sm:h-20 rounded-[2px] border-2 font-mono font-bold text-base sm:text-lg flex items-center justify-center transition-all select-none cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary text-background shadow-xs"
                      : "border-border bg-tertiary text-foreground hover:border-primary/80 hover:text-primary"
                  }`}
                >
                  {card}
                </button>
              );
            })}
          </div>

          {/* Action Countdown Button */}
          <div className="pt-2 flex justify-center gap-3">
            <AppButton
              onClick={handleStartCountdown}
              color="primary"
              className="font-mono text-sm sm:text-base px-6 h-[44px]"
            >
              <Timer className="w-4 h-4 mr-2" />
              <span>{labels.countdownButton || "Contagem Regressiva (3s)"}</span>
            </AppButton>
          </div>
        </div>
      )}

      {/* TAB 3: FIBONACCI REFERENCE GUIDE */}
      {activeTab === "guide" && (
        <AppCard border cornerAccents className="p-4 sm:p-6 bg-tertiary space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border/70">
            <BookOpen className="w-5 h-5 text-primary shrink-0" />
            <h3 className="font-mono font-bold text-base sm:text-lg uppercase text-foreground">
              {locale === "es"
                ? "Guía Práctica de la Escala Fibonacci y Complejidad"
                : locale === "en"
                  ? "Practical Fibonacci Scale & Complexity Guide"
                  : "Guia Prático da Escala Fibonacci e Complexidade"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 font-mono">
            {fibonacciGuideItems.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-background border border-border rounded-[2px] space-y-1.5 shadow-2xs"
              >
                <div className={`font-bold text-sm sm:text-base ${item.color}`}>
                  {item.title}
                </div>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </AppCard>
      )}
    </div>
  );
}
