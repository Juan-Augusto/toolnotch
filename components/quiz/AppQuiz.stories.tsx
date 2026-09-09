import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import AppQuiz from "./AppQuiz";
import { Quiz, TriviaQuiz } from "@/lib/quizTypes";

const mockPersonalityQuiz: Quiz = {
  id: "tech-profile-quiz",
  title: "Qual é o seu perfil na tecnologia?",
  description:
    "Descubra se sua personalidade combina mais com Frontend, Backend, Design System ou Dados.",
  image: "/images/tech.jpg",
  questions: [
    {
      id: "q1",
      text: "Quando você inicia um novo projeto, qual é a sua prioridade máxima?",
      options: [
        {
          id: "opt-1",
          text: "Garantir uma interface moderna, acessível e ultra responsiva",
          scores: { front: 3, design: 2 },
        },
        {
          id: "opt-2",
          text: "Estruturar o banco de dados e APIs escaláveis com alta performance",
          scores: { back: 3, data: 2 },
        },
        {
          id: "opt-3",
          text: "Definir padrões visuais consistentes, paletas e componentes reutilizáveis",
          scores: { design: 3, front: 2 },
        },
        {
          id: "opt-4",
          text: "Analisar métricas, pipelines e modelos preditivos",
          scores: { data: 3, back: 1 },
        },
      ],
    },
    {
      id: "q2",
      text: "Qual destas tecnologias você escolheria para trabalhar todos os dias?",
      options: [
        {
          id: "opt-react",
          text: "Next.js, Tailwind CSS e TypeScript",
          scores: { front: 3 },
        },
        {
          id: "opt-node",
          text: "Node.js, PostgreSQL, Docker e Redis",
          scores: { back: 3 },
        },
        {
          id: "opt-figma",
          text: "Figma, Storybook e Design Tokens",
          scores: { design: 3 },
        },
        {
          id: "opt-python",
          text: "Python, Pandas, SQL e Machine Learning",
          scores: { data: 3 },
        },
      ],
    },
    {
      id: "q3",
      text: "Como você lida com um bug inesperado em produção?",
      options: [
        {
          id: "opt-ui-bug",
          text: "Inspeciono no DevTools para conferir classes, layout shift e console",
          scores: { front: 3 },
        },
        {
          id: "opt-log-bug",
          text: "Abro os logs do servidor, monitoro latência e checo queries lentas",
          scores: { back: 3 },
        },
        {
          id: "opt-design-bug",
          text: "Valido se o fluxo de experiência do usuário faz sentido antes do código",
          scores: { design: 3 },
        },
        {
          id: "opt-data-bug",
          text: "Verifico integridade dos dados e discrepâncias no pipeline",
          scores: { data: 3 },
        },
      ],
    },
  ],
  results: [
    {
      id: "front",
      title: "Frontend Architect",
      description:
        "Você tem obsessão por interfaces polidas, microinterações fluidas e usabilidade impecável. Adora transformar ideias em produtos visuais rápidos e elegantes.",
      image: "/images/frontend.jpg",
      traits: ["CRIATIVO", "DETALHISTA", "FOCO NO USUÁRIO"],
      shareText: "Meu perfil tech deu Frontend Architect! Faça o teste no Toolnotch:",
    },
    {
      id: "back",
      title: "Backend Specialist",
      description:
        "Sua paixão é arquitetura distribuída, segurança e eficiência. Para você, o motor por trás dos panos é o que realmente faz um software ser lendário.",
      image: "/images/backend.jpg",
      traits: ["ANALÍTICO", "SISTÊMICO", "PERFORMANCE"],
      shareText: "Meu perfil tech deu Backend Specialist! Faça o teste no Toolnotch:",
    },
    {
      id: "design",
      title: "Design System Lead",
      description:
        "Você é a ponte perfeita entre arte e engenharia. Entende que consistência visual e experiência do usuário são os maiores diferenciais de qualquer aplicação.",
      image: "/images/design.jpg",
      traits: ["VISUAL", "PADRONIZAÇÃO", "EMPATIA"],
      shareText: "Meu perfil tech deu Design System Lead! Faça o teste no Toolnotch:",
    },
    {
      id: "data",
      title: "Data Driven Engineer",
      description:
        "Você toma decisões baseadas em números e evidências. Curiosidade analítica é sua principal força para resolver problemas complexos.",
      image: "/images/data.jpg",
      traits: ["ESTRATÉGICO", "MATEMÁTICO", "METICULOSO"],
      shareText: "Meu perfil tech deu Data Driven Engineer! Faça o teste no Toolnotch:",
    },
  ],
};

const mockTriviaQuiz: TriviaQuiz = {
  id: "world-cup-trivia",
  type: "trivia",
  category: "sports",
  title: "Quiz da Copa do Mundo",
  description:
    "Teste seu conhecimento sobre as maiores decisões e recordes dos Mundiais de Futebol.",
  image: "/images/cup.jpg",
  timeLimitSeconds: 20,
  questions: [
    {
      id: "tq1",
      text: "Qual seleção venceu a primeira Copa do Mundo em 1930?",
      options: [
        { id: "uru", text: "Uruguai" },
        { id: "arg", text: "Argentina" },
        { id: "bra", text: "Brasil" },
        { id: "ita", text: "Itália" },
      ],
      correctAnswerId: "uru",
      explanation: "O Uruguai sediou e venceu a primeira edição em 1930 derrotando a Argentina por 4 a 2.",
      source: {
        name: "FIFA",
        url: "https://www.fifa.com",
      },
    },
    {
      id: "tq2",
      text: "Quantas Copas do Mundo a Seleção Brasileira conquistou até hoje?",
      options: [
        { id: "c4", text: "4 títulos" },
        { id: "c5", text: "5 títulos (Pentacampeão)" },
        { id: "c6", text: "6 títulos" },
        { id: "c3", text: "3 títulos" },
      ],
      correctAnswerId: "c5",
      explanation: "O Brasil conquistou 5 títulos mundiais: 1958, 1962, 1970, 1994 e 2002.",
      source: {
        name: "CBF",
        url: "https://www.cbf.com.br",
      },
    },
    {
      id: "tq3",
      text: "Qual jogador é o maior artilheiro da história das Copas do Mundo?",
      options: [
        { id: "klose", text: "Miroslav Klose (16 gols)" },
        { id: "ronaldo", text: "Ronaldo Fenômeno (15 gols)" },
        { id: "pele", text: "Pelé (12 gols)" },
        { id: "messi", text: "Lionel Messi (13 gols)" },
      ],
      correctAnswerId: "klose",
      explanation: "Miroslav Klose marcou seu 16º gol na semifinal de 2014, tornando-se o maior artilheiro isolado.",
      source: {
        name: "Guinness World Records",
        url: "https://www.guinnessworldrecords.com",
      },
    },
  ],
  tiers: [
    {
      id: "legend",
      minPercent: 80,
      label: "Lenda dos Mundiais",
      description:
        "Impressionante! Sua memória futebolística é de especialista. Você conhece detalhes históricos dignos de enciclopédia esportiva.",
      shareText: "Fiz o Quiz da Copa no Toolnotch e acertei quase tudo! Nível: Lenda dos Mundiais.",
    },
    {
      id: "fan",
      minPercent: 50,
      label: "Torcedor de Respeito",
      description:
        "Bom conhecimento! Você acompanha bem as Copas do Mundo e acertou perguntas difíceis. Mais uma revisada e você atinge o topo.",
      shareText: "Fiz o Quiz da Copa no Toolnotch e mandei bem! Teste seus conhecimentos:",
    },
    {
      id: "rookie",
      minPercent: 0,
      label: "Iniciante dos Campos",
      description:
        "Você ainda está conhecendo a rica história dos Mundiais. Vale a pena jogar novamente para aprender mais curiosidades!",
      shareText: "Joguei o Quiz da Copa no Toolnotch! Venha ver quanto você acerta:",
    },
  ],
};

const meta: Meta<typeof AppQuiz> = {
  title: "Quiz/AppQuiz",
  component: AppQuiz,
  tags: ["autodocs"],
  argTypes: {
    locale: {
      control: "radio",
      options: ["pt", "en", "es"],
    },
    autoStart: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppQuiz>;

export const PersonalityStartScreen: Story = {
  args: {
    quiz: mockPersonalityQuiz,
    locale: "pt",
    autoStart: false,
  },
  render: (args) => (
    <div className="container py-8">
      <AppQuiz {...args} />
    </div>
  ),
};

export const PersonalityActiveQuestions: Story = {
  args: {
    quiz: mockPersonalityQuiz,
    locale: "pt",
    autoStart: true,
  },
  render: (args) => (
    <div className="container py-8">
      <AppQuiz {...args} />
    </div>
  ),
};

export const TriviaWithTimer: Story = {
  args: {
    quiz: mockTriviaQuiz,
    locale: "pt",
    autoStart: true,
  },
  render: (args) => (
    <div className="container py-8">
      <AppQuiz {...args} />
    </div>
  ),
};

export const EnglishLocale: Story = {
  args: {
    quiz: mockPersonalityQuiz,
    locale: "en",
    autoStart: false,
  },
  render: (args) => (
    <div className="container py-8">
      <AppQuiz {...args} />
    </div>
  ),
};
