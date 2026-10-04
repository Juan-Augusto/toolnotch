import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AppGpaCalculator from "@/components/education/AppGpaCalculator";
import AppGradeCalculator from "@/components/education/AppGradeCalculator";
import AppCitationGenerator from "@/components/education/AppCitationGenerator";
import EducationToolHeader from "@/app/[locale]/tools/education/components/EducationToolHeader";
import EducationToolContent from "@/app/[locale]/tools/education/components/EducationToolContent";

jest.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    return (key: string, values?: Record<string, unknown>) => {
      const gpaTranslations: Record<string, string> = {
        title: "Calculadora de GPA",
        description: "Calcule seu GPA semestral ou acumulado.",
        cumulativeTitle: "Calculadora de GPA Acumulado",
        cumulativeDescription: "Projete seu GPA acumulado.",
        gradeTitle: "Calculadora de Nota",
        gradeDescription: "Calcule a nota necessária no exame.",
        gradeScale: "Escala de Notas",
        scaleUs4: "EUA (4.0)",
        scalePt20: "Portugal / Brasil (0–20)",
        scaleEs10: "Espanha / AL (0–10)",
        grade: "Nota",
        credits: "Crédito / Peso",
        addCourse: "Adicionar Disciplina",
        removeCourse: "Remover Disciplina",
        yourGpa: "Seu GPA",
        totalCredits: "Total de Créditos / Peso",
        currentGpa: "GPA Atual",
        completedCredits: "Créditos Concluídos (Peso)",
        newSemesterGpa: "GPA do Novo Semestre",
        newSemesterCredits: "Créditos do Novo Semestre (Peso)",
        newCumulativeGpa: "Novo GPA Acumulado",
        currentGrade: "Nota Atual",
        earnedWeight: "Peso das Avaliações Concluídas (%)",
        targetGrade: "Nota Final Desejada",
        gradeNeeded: "Nota Necessária no Exame Final",
        impossible: "Impossível: o máximo é 100%",
        alreadyAchieved: "Meta Já Atingida",
      };

      const citationTranslations: Record<string, string> = {
        title: "Gerador de Citações",
        description: "Formate referências bibliográficas.",
        formatApa: "APA",
        formatMla: "MLA",
        formatChicago: "Chicago",
        formatAbnt: "ABNT",
        sourceWebsite: "Website",
        sourceBook: "Livro",
        sourceJournal: "Periódico",
        sourceYoutube: "YouTube",
        sourceNewspaper: "Jornal",
        authorLabel: "Autores",
        authorLastName: "Sobrenome do Autor",
        authorFirstName: "Primeiro Nome",
        addAuthor: "Adicionar Autor",
        removeAuthor: "Remover",
        titleField: "Título da Obra",
        siteName: "Nome do Site",
        url: "URL",
        year: "Ano",
        month: "Mês",
        day: "Dia",
        accessDate: "Data de Acesso",
        publisher: "Editora",
        city: "Cidade",
        edition: "Edição",
        journalName: "Nome do Periódico",
        volume: "Volume",
        issue: "Número / Edição",
        pages: "Páginas",
        doi: "DOI",
        channelName: "Nome do Canal",
        newspaper: "Nome do Jornal",
        outputHeading: "Referência Formatada",
        copy: "Copiar Referência",
        copied: "Copiado!",
        emptyState: "Preencha os campos para visualizar a referência formatada.",
      };

      if (namespace === "citationGenerator") {
        return citationTranslations[key] ?? key;
      }
      return gpaTranslations[key] ?? key;
    };
  },
}));

describe("Education Tools Components", () => {
  describe("EducationToolHeader", () => {
    it("renders title, description and breadcrumbs", () => {
      render(
        <EducationToolHeader
          title="Calculadora de GPA"
          description="Calcule sua média semestral."
          locale="pt"
          badges={[{ text: "Escala 4.0" }]}
        />,
      );

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Calculadora de GPA",
      );
      expect(screen.getByText("Calcule sua média semestral.")).toBeInTheDocument();
      expect(screen.getByText("Educação")).toBeInTheDocument();
      expect(screen.getByText("Escala 4.0")).toBeInTheDocument();
    });
  });

  describe("EducationToolContent", () => {
    it("renders How To Use steps and FAQs", () => {
      const richContent = {
        whatIs: "Explicação sobre GPA.",
        howToUse: ["Insira as notas.", "Veja a média."],
        whyItMatters: "O GPA é crucial para bolsas.",
      };
      const faqs = [
        { question: "O que é GPA?", answer: "É a média de notas ponderada." },
      ];

      render(
        <EducationToolContent
          currentToolSlug="gpa-calculator"
          richContent={richContent}
          faqs={faqs}
          locale="pt"
        />,
      );

      expect(screen.getByText("Como Usar")).toBeInTheDocument();
      expect(screen.getByText("Insira as notas.")).toBeInTheDocument();
      expect(screen.getByText("Explicação sobre GPA.")).toBeInTheDocument();
      expect(screen.getByText("O que é GPA?")).toBeInTheDocument();
    });
  });

  describe("AppGpaCalculator", () => {
    it("initializes course with empty grade and default credit of 1", () => {
      render(<AppGpaCalculator mode="semester" locale="us" />);

      const gradeInput = screen.getByPlaceholderText(/Nota/i) as HTMLInputElement;
      const creditsInput = screen.getByPlaceholderText(/Crédito \/ Peso/i) as HTMLInputElement;

      expect(gradeInput.value).toBe("");
      expect(creditsInput.value).toBe("1");
    });

    it("renders column labels for grade and credits", () => {
      render(<AppGpaCalculator mode="semester" locale="pt" />);

      expect(screen.getByText("Nota")).toBeInTheDocument();
      expect(screen.getByText("Crédito / Peso")).toBeInTheDocument();
    });

    it("calculates semester GPA correctly", () => {
      render(<AppGpaCalculator mode="semester" locale="us" />);

      const gradeInput = screen.getByPlaceholderText(/Nota/i);
      const creditsInput = screen.getByPlaceholderText(/Crédito \/ Peso/i);

      fireEvent.change(gradeInput, { target: { value: "3.5" } });
      fireEvent.change(creditsInput, { target: { value: "4" } });

      expect(screen.getByText("3.50")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("supports adding and removing courses in semester mode", () => {
      render(<AppGpaCalculator mode="semester" locale="us" />);

      const addBtn = screen.getByRole("button", { name: /Adicionar Disciplina/i });
      fireEvent.click(addBtn);

      const gradeInputs = screen.getAllByPlaceholderText(/Nota/i);
      expect(gradeInputs.length).toBe(2);

      const removeBtns = screen.getAllByTitle(/Remover/i);
      fireEvent.click(removeBtns[0]);

      expect(screen.getAllByPlaceholderText(/Nota/i).length).toBe(1);
    });

    it("calculates cumulative GPA accurately", () => {
      render(<AppGpaCalculator mode="cumulative" locale="us" />);

      const currentGpaInput = screen.getByLabelText(/GPA Atual/i);
      const completedCreditsInput = screen.getByLabelText(/Créditos Concluídos/i);
      const newSemesterGpaInput = screen.getByLabelText(/GPA do Novo Semestre/i);
      const newSemesterCreditsInput = screen.getByLabelText(/Créditos do Novo Semestre/i);

      fireEvent.change(currentGpaInput, { target: { value: "3.0" } });
      fireEvent.change(completedCreditsInput, { target: { value: "30" } });
      fireEvent.change(newSemesterGpaInput, { target: { value: "4.0" } });
      fireEvent.change(newSemesterCreditsInput, { target: { value: "10" } });

      expect(screen.getByText("3.25")).toBeInTheDocument();
    });
  });

  describe("AppGradeCalculator", () => {
    it("calculates required exam grade correctly", () => {
      render(<AppGradeCalculator locale="pt" />);

      const currentGradeInput = screen.getByLabelText(/Nota Atual/i);
      const earnedWeightInput = screen.getByLabelText(/Peso das Avaliações Concluídas/i);
      const targetGradeInput = screen.getByLabelText(/Nota Final Desejada/i);

      fireEvent.change(currentGradeInput, { target: { value: "80" } });
      fireEvent.change(earnedWeightInput, { target: { value: "60" } });
      fireEvent.change(targetGradeInput, { target: { value: "85" } });

      expect(screen.getByText("92.5%")).toBeInTheDocument();
    });

    it("shows impossible status when target exceeds 100%", () => {
      render(<AppGradeCalculator locale="pt" />);

      const currentGradeInput = screen.getByLabelText(/Nota Atual/i);
      const earnedWeightInput = screen.getByLabelText(/Peso das Avaliações Concluídas/i);
      const targetGradeInput = screen.getByLabelText(/Nota Final Desejada/i);

      fireEvent.change(currentGradeInput, { target: { value: "50" } });
      fireEvent.change(earnedWeightInput, { target: { value: "80" } });
      fireEvent.change(targetGradeInput, { target: { value: "90" } });

      expect(screen.getByText(/Impossível/i)).toBeInTheDocument();
    });

    it("shows achieved status when target is already met", () => {
      render(<AppGradeCalculator locale="pt" />);

      const currentGradeInput = screen.getByLabelText(/Nota Atual/i);
      const earnedWeightInput = screen.getByLabelText(/Peso das Avaliações Concluídas/i);
      const targetGradeInput = screen.getByLabelText(/Nota Final Desejada/i);

      fireEvent.change(currentGradeInput, { target: { value: "95" } });
      fireEvent.change(earnedWeightInput, { target: { value: "80" } });
      fireEvent.change(targetGradeInput, { target: { value: "70" } });

      expect(screen.getByText(/Meta Já Atingida/i)).toBeInTheDocument();
    });
  });

  describe("AppCitationGenerator", () => {
    it("formats website citation correctly in APA style", () => {
      render(<AppCitationGenerator locale="pt" />);

      const apaBtn = screen.getByRole("button", { name: "APA" });
      fireEvent.click(apaBtn);

      const titleInput = screen.getByLabelText(/Título da Obra/i);
      fireEvent.change(titleInput, { target: { value: "Deep Learning Foundations" } });

      expect(
        screen.getByText(/Deep Learning Foundations\./i),
      ).toBeInTheDocument();
    });

    it("formats ABNT citation correctly when selected", () => {
      render(<AppCitationGenerator locale="pt" />);

      const titleInput = screen.getByLabelText(/Título da Obra/i);
      fireEvent.change(titleInput, { target: { value: "Engenharia de Software" } });

      const lastNameInput = screen.getByPlaceholderText("Sobrenome do Autor");
      const firstNameInput = screen.getByPlaceholderText("Primeiro Nome");

      fireEvent.change(lastNameInput, { target: { value: "Silva" } });
      fireEvent.change(firstNameInput, { target: { value: "Carlos" } });

      expect(
        screen.getByText(/SILVA, Carlos/i),
      ).toBeInTheDocument();
    });
  });
});
