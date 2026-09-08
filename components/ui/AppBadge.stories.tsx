import type { Meta, StoryObj } from "@storybook/react";
import AppBadge from "./AppBadge";
import { Sparkles, Check, Flame, Award, Heart } from "lucide-react";

const meta: Meta<typeof AppBadge> = {
  title: "UI/AppBadge",
  component: AppBadge,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AppBadge>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <AppBadge bg="bg-primary" text="text-background">
        PRIMÁRIO
      </AppBadge>

      <AppBadge bg="bg-secondary" text="text-background">
        SECUNDÁRIO
      </AppBadge>

      <AppBadge bg="bg-tertiary" text="text-foreground" className="border border-border/60">
        TERTIARY
      </AppBadge>

      <AppBadge bg="bg-green-500/20" text="text-green-400">
        SUCESSO
      </AppBadge>

      <AppBadge bg="bg-red-500/20" text="text-red-400">
        ALERTA
      </AppBadge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <AppBadge
        bg="bg-primary"
        text="text-background"
        icon={<Sparkles className="w-3.5 h-3.5" />}
      >
        EM DESTAQUE
      </AppBadge>

      <AppBadge
        bg="bg-secondary"
        text="text-background"
        icon={<Flame className="w-3.5 h-3.5" />}
      >
        POPULAR
      </AppBadge>

      <AppBadge
        bg="bg-tertiary"
        text="text-foreground"
        icon={<Check className="w-3.5 h-3.5 text-primary" />}
        className="border border-border/60"
      >
        VERIFICADO
      </AppBadge>

      <AppBadge
        bg="bg-purple-500/20"
        text="text-purple-400"
        icon={<Award className="w-3.5 h-3.5" />}
      >
        PREMIADO
      </AppBadge>

      <AppBadge
        bg="bg-pink-500/20"
        text="text-pink-400"
        icon={<Heart className="w-3.5 h-3.5" />}
      >
        FAVORITO
      </AppBadge>
    </div>
  ),
};

export const ShortcutBadge: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <span className="font-mono text-sm text-label">Fechar busca:</span>
      <AppBadge
        bg="bg-tertiary"
        text="text-label"
        className="text-[10px] px-1.5 py-0.5 font-mono border border-border/60"
      >
        esc
      </AppBadge>
    </div>
  ),
};
