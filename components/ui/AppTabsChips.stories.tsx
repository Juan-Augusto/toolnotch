import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import AppTabsChips, { AppTabsChipItem } from "./AppTabsChips";
import { Sparkles, Volleyball, Brain, Server, Landmark } from "lucide-react";

const meta: Meta<typeof AppTabsChips> = {
  title: "UI/AppTabsChips",
  component: AppTabsChips,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AppTabsChips>;

const mockItems: AppTabsChipItem[] = [
  { id: "all", label: "TODOS", count: 24 },
  {
    id: "sports",
    label: "ESPORTES",
    count: 8,
    icon: <Volleyball className="w-3.5 h-3.5" />,
  },
  {
    id: "personality",
    label: "PERSONALIDADE",
    count: 6,
    icon: <Brain className="w-3.5 h-3.5" />,
  },
  {
    id: "backend",
    label: "BACKEND",
    count: 5,
    icon: <Server className="w-3.5 h-3.5" />,
  },
  {
    id: "civic",
    label: "CÍVICO",
    count: 5,
    icon: <Landmark className="w-3.5 h-3.5" />,
  },
];

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<string>("all");
    return (
      <div className="p-4 bg-background">
        <AppTabsChips
          items={mockItems}
          value={selected}
          onChange={setSelected}
        />
      </div>
    );
  },
};

export const WithoutIcons: Story = {
  render: () => {
    const [selected, setSelected] = useState<string>("pop");
    const simpleItems: AppTabsChipItem[] = [
      { id: "pop", label: "POPULARES" },
      { id: "rec", label: "RECENTES" },
      { id: "fav", label: "FAVORITOS" },
      { id: "top", label: "MAIS JOGADOS" },
    ];
    return (
      <div className="p-4 bg-background">
        <AppTabsChips
          items={simpleItems}
          value={selected}
          onChange={setSelected}
        />
      </div>
    );
  },
};
