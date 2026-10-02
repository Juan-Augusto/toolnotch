import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AppBmiCalculator from "@/components/health/AppBmiCalculator";
import AppTdeeCalculator from "@/components/health/AppTdeeCalculator";
import HealthToolHeader from "@/app/[locale]/tools/health/components/HealthToolHeader";
import HealthToolContent from "@/app/[locale]/tools/health/components/HealthToolContent";

jest.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    return (key: string, values?: Record<string, unknown>) => {
      const healthTranslations: Record<string, string> = {
        bmiTitle: "Calculadora de IMC",
        bmiDescription: "Calcule seu Índice de Massa Corporal.",
        tdeeTitle: "Calculadora de TDEE",
        tdeeDescription: "Calcule seu gasto energético diário.",
        deficitTitle: "Calculadora de Déficit Calórico",
        deficitDescription: "Planeje seu déficit calórico.",
        weight: "Peso",
        height: "Altura",
        age: "Idade",
        sex: "Sexo",
        male: "Masculino",
        female: "Feminino",
        metric: "Métrico",
        imperial: "Imperial",
        feet: "pés",
        inches: "pol",
        activityLevel: "Nível de Atividade",
        sedentary: "Sedentário",
        light: "Levemente Ativo",
        moderate: "Moderadamente Ativo",
        active: "Muito Ativo",
        veryActive: "Extremamente Ativo",
        yourBmi: "Seu IMC",
        underweight: "Abaixo do peso",
        normal: "Peso ideal",
        overweight: "Sobrepeso",
        obese: "Obesidade",
        disclaimer: "Esta ferramenta possui finalidade informativa e não substitui orientação médica.",
        yourBmr: "Sua TMB",
        yourTdee: "Seu TDEE",
        calories: "calorias",
        maintain: "Manter peso",
        loseSlow: "Perda moderada",
        loseFast: "Perda de peso",
        gainSlow: "Ganho moderado",
        gainFast: "Ganho de peso",
        reset: "Limpar",
        healthyWeightRange: "Faixa de peso saudável",
        healthyWeightRangeForHeight: "Faixa de peso saudável para sua altura",
        deficitPlan: "Plano de Déficit Calórico",
        maintenanceTdee: "Manutenção (TDEE)",
        recommended: "Recomendado",
        weeklyLossFast: "~0,5 kg / semana",
        weeklyLossSlow: "~0,25 kg / semana",
        weeklyMaintain: "Peso estável",
        weeklyGainSlow: "+0,25 kg / semana",
        weeklyGainFast: "+0,5 kg / semana",
        bmiSexContext: "Contexto biológico",
        bmiSexNoteFemale: "Mulheres possuem naturalmente maior proporção de gordura essencial.",
        bmiSexNoteMale: "Homens tendem a ter maior densidade de massa muscular.",
      };

      return healthTranslations[key] ?? key;
    };
  },
}));

jest.mock("@/components/AppAffiliateOffers", () => {
  return function MockAffiliateOffers() {
    return <div data-testid="mock-affiliate-offers" />;
  };
});

jest.mock("@/components/AppAffiliateStickyBar", () => {
  return function MockAffiliateStickyBar() {
    return <div data-testid="mock-affiliate-sticky" />;
  };
});

describe("Health Tools Integration Tests", () => {
  describe("AppBmiCalculator", () => {
    it("renders initial state with metric inputs and empty result prompt", () => {
      render(<AppBmiCalculator locale="pt" />);
      expect(
        screen.getByText(/calcular o IMC instantaneamente/i)
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/Sexo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Peso \(kg\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Altura \(cm\)/i)).toBeInTheDocument();
    });

    it("calculates normal BMI correctly for 70kg and 175cm", () => {
      render(<AppBmiCalculator locale="pt" />);
      const weightInput = screen.getByLabelText(/Peso \(kg\)/i);
      const heightInput = screen.getByLabelText(/Altura \(cm\)/i);

      fireEvent.change(weightInput, { target: { value: "70" } });
      fireEvent.change(heightInput, { target: { value: "175" } });

      expect(screen.getByText("22.9")).toBeInTheDocument();
      expect(screen.getAllByText("Peso ideal").length).toBeGreaterThan(0);
      expect(screen.getByText(/Faixa de peso saudável para sua altura/i)).toBeInTheDocument();
      expect(screen.getByText(/56.7 kg – 76.3 kg/i)).toBeInTheDocument();
    });

    it("displays sex-specific biological context note and updates when sex changes", () => {
      render(<AppBmiCalculator locale="pt" />);
      const weightInput = screen.getByLabelText(/Peso \(kg\)/i);
      const heightInput = screen.getByLabelText(/Altura \(cm\)/i);
      const sexSelect = screen.getByRole("combobox", { name: /Sexo/i });

      fireEvent.change(weightInput, { target: { value: "60" } });
      fireEvent.change(heightInput, { target: { value: "165" } });

      // Default sex is female
      expect(
        screen.getByText("Mulheres possuem naturalmente maior proporção de gordura essencial.")
      ).toBeInTheDocument();

      // Change sex to male via AppSelect
      fireEvent.click(sexSelect);
      const maleOption = screen.getByRole("option", { name: "Masculino" });
      fireEvent.click(maleOption);

      expect(
        screen.getByText("Homens tendem a ter maior densidade de massa muscular.")
      ).toBeInTheDocument();
    });

    it("calculates overweight BMI 25.6 (68kg, 163cm) and correctly places indicator in the overweight segment", () => {
      const { container } = render(<AppBmiCalculator locale="pt" />);
      const weightInput = screen.getByLabelText(/Peso \(kg\)/i);
      const heightInput = screen.getByLabelText(/Altura \(cm\)/i);

      fireEvent.change(weightInput, { target: { value: "68" } });
      fireEvent.change(heightInput, { target: { value: "163" } });

      expect(screen.getByText("25.6")).toBeInTheDocument();
      expect(screen.getAllByText("Sobrepeso").length).toBeGreaterThan(0);

      // Needle must be at 53% (in the 50%-75% overweight segment)
      const needle = container.querySelector(".absolute.-top-1\\.5");
      expect(needle).toBeInTheDocument();
      expect(needle).toHaveStyle({ left: "53%" });
    });

    it("switches to imperial units and back to metric seamlessly", () => {
      render(<AppBmiCalculator locale="pt" />);
      const imperialRadio = screen.getByRole("radio", { name: /imperial/i });
      fireEvent.click(imperialRadio);

      expect(screen.getByLabelText(/Peso \(lbs\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Altura \(pés\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Altura \(pol\)/i)).toBeInTheDocument();

      const metricRadio = screen.getByRole("radio", { name: /métrico/i });
      fireEvent.click(metricRadio);

      expect(screen.getByLabelText(/Peso \(kg\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Altura \(cm\)/i)).toBeInTheDocument();
    });

    it("clears inputs when clicking reset", () => {
      render(<AppBmiCalculator locale="pt" />);
      const weightInput = screen.getByLabelText(/Peso \(kg\)/i);
      fireEvent.change(weightInput, { target: { value: "85" } });
      expect(weightInput).toHaveValue(85);

      const resetButton = screen.getByRole("button", { name: /limpar/i });
      fireEvent.click(resetButton);

      expect(weightInput).toHaveValue(null);
    });
  });

  describe("AppTdeeCalculator", () => {
    it("renders in maintain mode and calculates BMR and TDEE when inputs filled", () => {
      render(<AppTdeeCalculator mode="maintain" locale="pt" />);
      expect(screen.getByText(/Preencha idade, sexo, peso, altura/i)).toBeInTheDocument();

      const ageInput = screen.getByLabelText(/^Idade$/i);
      const weightInput = screen.getByLabelText(/Peso \(kg\)/i);
      const heightInput = screen.getByLabelText(/Altura \(cm\)/i);

      fireEvent.change(ageInput, { target: { value: "30" } });
      fireEvent.change(weightInput, { target: { value: "70" } });
      fireEvent.change(heightInput, { target: { value: "175" } });

      // Male BMR: 10*70 + 6.25*175 - 5*30 + 5 = 700 + 1093.75 - 150 + 5 = 1648.75 -> 1649
      // Moderate multiplier: 1648.75 * 1.55 = 2555.56 -> 2556
      expect(screen.getByText(/1[.,]649/)).toBeInTheDocument();
      expect(screen.getAllByText(/2[.,]556/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Manutenção (TDEE)")).toBeInTheDocument();
      expect(screen.getByText("Recomendado")).toBeInTheDocument();
    });

    it("renders in deficit mode highlighting the deficit target", () => {
      render(<AppTdeeCalculator mode="deficit" locale="pt" />);
      const ageInput = screen.getByLabelText(/^Idade$/i);
      const weightInput = screen.getByLabelText(/Peso \(kg\)/i);
      const heightInput = screen.getByLabelText(/Altura \(cm\)/i);

      fireEvent.change(ageInput, { target: { value: "30" } });
      fireEvent.change(weightInput, { target: { value: "70" } });
      fireEvent.change(heightInput, { target: { value: "175" } });

      expect(screen.getByText("Plano de Déficit Calórico")).toBeInTheDocument();
      expect(screen.getByText("-500 kcal")).toBeInTheDocument();
    });

    it("resets parameters upon clicking reset button", () => {
      render(<AppTdeeCalculator mode="maintain" locale="pt" />);
      const ageInput = screen.getByLabelText(/^Idade$/i);
      fireEvent.change(ageInput, { target: { value: "25" } });
      expect(ageInput).toHaveValue(25);

      const resetButton = screen.getByRole("button", { name: /limpar/i });
      fireEvent.click(resetButton);

      expect(ageInput).toHaveValue(null);
    });
  });

  describe("HealthToolHeader", () => {
    it("renders breadcrumbs, title, and description", () => {
      render(
        <HealthToolHeader
          title="Calculadora de IMC"
          description="Descubra seu Índice de Massa Corporal."
          locale="pt"
        />
      );

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Calculadora de IMC"
      );
      expect(
        screen.getByText("Descubra seu Índice de Massa Corporal.")
      ).toBeInTheDocument();
      expect(screen.getByText("Saúde & Fitness")).toBeInTheDocument();
    });
  });

  describe("HealthToolContent", () => {
    it("renders rich content, FAQs, and related health tools", () => {
      render(
        <HealthToolContent
          currentToolSlug="bmi-calculator"
          locale="pt"
          richContent={{
            whatIs: "O IMC é um índice de triagem corporal.",
            whyItMatters: "Manter peso saudável previne problemas cardíacos.",
            howToUse: ["Informe seu peso", "Informe sua altura"],
            proTip: "Combine o IMC com a medição da cintura.",
          }}
          faqs={[
            {
              question: "O que é IMC?",
              answer: "É uma relação entre peso e altura.",
            },
          ]}
        />
      );

      expect(screen.getByText("Como Usar")).toBeInTheDocument();
      expect(screen.getByText("Informe seu peso")).toBeInTheDocument();
      expect(screen.getByText("O Que É Esta Ferramenta?")).toBeInTheDocument();
      expect(screen.getByText("Por Que Isso Importa?")).toBeInTheDocument();
      expect(screen.getByText("Dica de Saúde")).toBeInTheDocument();
      expect(screen.getByText("Perguntas Frequentes")).toBeInTheDocument();
      expect(screen.getByText("O que é IMC?")).toBeInTheDocument();
      expect(screen.getByText("Ferramentas de Saúde Relacionadas")).toBeInTheDocument();
      expect(screen.getByText("Calculadora de TDEE (Gasto Diário)")).toBeInTheDocument();
    });
  });
});
