import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import AppQuiz from "@/components/quiz/AppQuiz";
import { Quiz, TriviaQuiz } from "@/lib/quizTypes";

const mockPersonalityQuiz: Quiz = {
  id: "personality-test",
  title: "Qual é o seu perfil de dev?",
  description: "Descubra se você é Frontend ou Backend.",
  image: "/images/test.jpg",
  questions: [
    {
      id: "q1",
      text: "O que você prefere construir?",
      options: [
        { id: "opt-front", text: "Interfaces e CSS", scores: { front: 3 } },
        { id: "opt-back", text: "APIs e Bancos de Dados", scores: { back: 3 } },
      ],
    },
    {
      id: "q2",
      text: "Qual ferramenta você mais usa?",
      options: [
        { id: "opt-react", text: "React e Tailwind", scores: { front: 3 } },
        { id: "opt-node", text: "Node e PostgreSQL", scores: { back: 3 } },
      ],
    },
  ],
  results: [
    {
      id: "front",
      title: "Frontend Master",
      description: "Você domina o visual e a experiência do usuário.",
      image: "/images/front.jpg",
      traits: ["CRIATIVO", "DETALHISTA"],
      shareText: "Meu perfil deu Frontend Master!",
    },
    {
      id: "back",
      title: "Backend Architect",
      description: "Você constrói sistemas robustos e escaláveis.",
      image: "/images/back.jpg",
      traits: ["LÓGICO", "SISTÊMICO"],
      shareText: "Meu perfil deu Backend Architect!",
    },
  ],
};

const mockTriviaQuiz: TriviaQuiz = {
  id: "trivia-test",
  type: "trivia",
  category: "sports",
  title: "Quiz da Copa do Mundo",
  description: "Teste seus conhecimentos sobre futebol.",
  image: "/images/cup.jpg",
  questions: [
    {
      id: "tq1",
      text: "Quem ganhou a Copa de 2002?",
      options: [
        { id: "bra", text: "Brasil" },
        { id: "ger", text: "Alemanha" },
      ],
      correctAnswerId: "bra",
      explanation: "O Brasil venceu a Alemanha por 2 a 0 na final.",
    },
  ],
  tiers: [
    {
      id: "legend",
      minPercent: 80,
      label: "Lenda do Futebol",
      description: "Você sabe tudo sobre futebol mundial!",
      shareText: "Acertei tudo no quiz!",
    },
  ],
};

describe("AppQuiz Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("renders idle start screen with title, description and start button", () => {
    render(<AppQuiz quiz={mockPersonalityQuiz} locale="pt" />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /QUAL É O SEU PERFIL DE DEV\?/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Descubra se você é Frontend ou Backend.")
    ).toBeInTheDocument();
    expect(screen.getByText(/2 perguntas/i)).toBeInTheDocument();
    expect(screen.getByText(/COMEÇAR QUIZ/i)).toBeInTheDocument();
  });

  it("transitions to active state and renders progress and randomized options on start", () => {
    render(<AppQuiz quiz={mockPersonalityQuiz} locale="pt" />);

    const startBtn = screen.getByRole("button", { name: /COMEÇAR QUIZ/i });
    fireEvent.click(startBtn);

    expect(screen.getAllByText(/PERGUNTA/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("/ 02")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /O QUE VOCÊ PREFERE CONSTRUIR\?/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText("Interfaces e CSS")).toBeInTheDocument();
    expect(screen.getByText("APIs e Bancos de Dados")).toBeInTheDocument();
  });

  it("navigates through questions and shows final personality result with share options", () => {
    const onComplete = jest.fn();
    render(
      <AppQuiz
        quiz={mockPersonalityQuiz}
        locale="pt"
        autoStart
        onComplete={onComplete}
      />
    );

    // Question 1
    const optionFront1 = screen.getByText("Interfaces e CSS");
    fireEvent.click(optionFront1);

    // Question 2
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /QUAL FERRAMENTA VOCÊ MAIS USA\?/i,
      })
    ).toBeInTheDocument();

    const optionFront2 = screen.getByText("React e Tailwind");
    fireEvent.click(optionFront2);

    // Result screen
    expect(screen.getByText(/SEU RESULTADO/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /FRONTEND MASTER/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Você domina o visual e a experiência do usuário.")
    ).toBeInTheDocument();
    expect(screen.getByText("#CRIATIVO")).toBeInTheDocument();
    expect(screen.getByText("#DETALHISTA")).toBeInTheDocument();

    // Share buttons
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("X / Twitter")).toBeInTheDocument();
    expect(screen.getByText("Copiar Link")).toBeInTheDocument();
    expect(screen.getByText(/Baixar Card/i)).toBeInTheDocument();

    // Retake button
    expect(screen.getByText("JOGAR NOVAMENTE")).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({ id: "front", title: "Frontend Master" })
    );
  });

  it("handles trivia quiz with score breakdown and explanation", () => {
    render(<AppQuiz quiz={mockTriviaQuiz} locale="pt" autoStart />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /QUEM GANHOU A COPA DE 2002\?/i,
      })
    ).toBeInTheDocument();

    const optionBra = screen.getByText("Brasil");
    fireEvent.click(optionBra);

    // Trivia reveals explanation
    expect(screen.getByText(/EXPLICAÇÃO/i)).toBeInTheDocument();
    expect(
      screen.getByText("O Brasil venceu a Alemanha por 2 a 0 na final.")
    ).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1300);
    });

    // Result screen for trivia
    expect(screen.getByText(/PONTUAÇÃO FINAL/i)).toBeInTheDocument();
    expect(screen.getByText("/ 1")).toBeInTheDocument();
    expect(screen.getByText(/100% acertos • Lenda do Futebol/i)).toBeInTheDocument();
  });

  it("restarts quiz and reshuffles when JOGAR NOVAMENTE is clicked", () => {
    render(<AppQuiz quiz={mockPersonalityQuiz} locale="pt" autoStart />);

    // Answer Q1
    fireEvent.click(screen.getByText("Interfaces e CSS"));

    // Answer Q2
    fireEvent.click(screen.getByText("React e Tailwind"));

    // On result screen
    const retakeBtn = screen.getByRole("button", { name: /JOGAR NOVAMENTE/i });
    fireEvent.click(retakeBtn);

    // Back to active question 1
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("/ 02")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /O QUE VOCÊ PREFERE CONSTRUIR\?/i,
      })
    ).toBeInTheDocument();
  });
});
