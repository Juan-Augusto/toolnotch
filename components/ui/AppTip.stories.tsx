import type { Meta, StoryObj } from '@storybook/react';
import { AppTip } from './AppTip';

const meta: Meta<typeof AppTip> = {
  title: 'UI/AppTip',
  component: AppTip,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof AppTip>;

export const Default: Story = {
  args: {
    title: 'DICA PROFISSIONAL',
    description:
      'Sempre compare empréstimos pelo CET, não pela taxa nominal. Duas propostas com a mesma taxa de juros podem ter CET muito diferente se as taxas de cadastro ou seguros diferem. Se você tem desconto em folha (empréstimo consignado), as taxas costumam ser significativamente menores do que crédito pessoal comum.',
  },
};

export const ShortTip: Story = {
  args: {
    title: 'ATENÇÃO AO PRAZO',
    description:
      'Prazos mais longos reduzem o valor da parcela mensal, mas aumentam o custo total de juros pagos ao longo do contrato.',
  },
};
