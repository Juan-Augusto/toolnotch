import type { Meta, StoryObj } from '@storybook/react';
import { AppAccordion } from './AppAccordion';

const meta: Meta<typeof AppAccordion> = {
  title: 'UI/AppAccordion',
  component: AppAccordion,
  tags: ['autodocs'],
  argTypes: {
    allowMultiple: { control: 'boolean' },
    defaultOpenAll: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof AppAccordion>;

export const Default: Story = {
  args: {
    group: {
      name: 'ACCORDION/DROPDOWN',
      content: (
        <p>
          Envie seus arquivos PDF pelo botão ou arraste-os para a área, reordene-os
          conforme necessário arrastando, depois clique em Mesclar
        </p>
      ),
      defaultOpen: true,
    },
  },
};

export const MultipleItems: Story = {
  args: {
    groups: [
      {
        name: 'COMO FUNCIONA A COMPRESSÃO?',
        content: (
          <p>
            O algoritmo analisa a estrutura do arquivo e otimiza imagens e fluxos
            internos para reduzir o tamanho total mantendo a legibilidade.
          </p>
        ),
        defaultOpen: true,
      },
      {
        name: 'QUAIS FORMATOS SÃO SUPORTADOS?',
        content: (
          <p>
            Suportamos arquivos PDF padrão, JPG, PNG e WEBP para conversões e
            processamentos diretos no navegador.
          </p>
        ),
      },
      {
        name: 'MEUS ARQUIVOS ESTÃO SEGUROS?',
        content: (
          <p>
            Todo o processamento é executado localmente na máquina do usuário, sem
            envio de dados confidenciais para servidores externos.
          </p>
        ),
      },
    ],
  },
};

export const SingleSelectionOnly: Story = {
  args: {
    allowMultiple: false,
    groups: [
      {
        name: 'SEÇÃO 1',
        content: <p>Conteúdo detalhado da primeira seção explicativa.</p>,
        defaultOpen: true,
      },
      {
        name: 'SEÇÃO 2',
        content: <p>Conteúdo detalhado da segunda seção explicativa.</p>,
      },
    ],
  },
};
