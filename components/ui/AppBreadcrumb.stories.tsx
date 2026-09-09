import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import AppBreadcrumb from "./AppBreadcrumb";

const meta: Meta<typeof AppBreadcrumb> = {
  title: "UI/AppBreadcrumb",
  component: AppBreadcrumb,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AppBreadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Quizzes", href: "/quizzes" },
      { label: "Qual é o seu perfil político?", current: true },
    ],
  },
};

export const DeepNested: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Quizzes", href: "/quizzes" },
      { label: "Fifa World Cup Winners", href: "/quiz/fifa-world-cup-winners" },
      { label: "Resultado: Campeão Invicto", current: true },
    ],
  },
};

export const LongLabelsTruncated: Story = {
  render: () => (
    <div className="max-w-md border border-border/40 p-4 rounded-[2px] bg-card">
      <AppBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Desenvolvimento Web Fullstack & Engenharia de Software", href: "/quizzes" },
          { label: "Qual framework moderno melhor combina com sua arquitetura e fluxo de trabalho?", current: true },
        ]}
      />
    </div>
  ),
};
