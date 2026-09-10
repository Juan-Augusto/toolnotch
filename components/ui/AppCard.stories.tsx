import type { Meta, StoryObj } from "@storybook/react";
import AppCard from "./AppCard";
import AppButton from "./AppButton";

const meta: Meta<typeof AppCard> = {
  title: "UI/AppCard",
  component: AppCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AppCard>;

export const Default: Story = {
  render: () => (
    <div className="max-w-xs">
      <AppCard className="flex flex-col justify-between p-6 min-h-[280px]">
        <div>
          <h2 className="font-mono text-sm  uppercase text-foreground">
            FERRAMENTAS
          </h2>
          <p className="font-mono text-xs text-label/80 mt-3 leading-relaxed">
            Comprima imagens, manipule PDFs, faça cálculos e utilize utilitários
            rápidos direto no navegador.
          </p>
        </div>
        <div className="mt-6">
          <AppButton color="primary" withArrow small>
            Acessar
          </AppButton>
        </div>
      </AppCard>
    </div>
  ),
};

export const WithoutCornerAccents: Story = {
  render: () => (
    <div className="max-w-xs">
      <AppCard
        cornerAccents={false}
        className="flex flex-col justify-between p-6 min-h-[280px]"
      >
        <div>
          <h2 className="font-mono text-sm  uppercase text-foreground">
            SEM ACCENTS
          </h2>
          <p className="font-mono text-xs text-label/80 mt-3 leading-relaxed">
            Card limpo com apenas a borda tracejada, sem os acentos de canto.
          </p>
        </div>
      </AppCard>
    </div>
  ),
};
