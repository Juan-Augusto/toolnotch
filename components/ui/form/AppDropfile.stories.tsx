import type { Meta, StoryObj } from '@storybook/react';
import { AppDropfile } from './AppDropfile';

const meta: Meta<typeof AppDropfile> = {
  title: 'UI/Form/AppDropfile',
  component: AppDropfile,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    multiple: { control: 'boolean' },
    showSelectedFiles: { control: 'boolean' },
    accept: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    label: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof AppDropfile>;

export const Default: Story = {
  args: {
    title: 'CLIQUE OU ARRASTE ARQUIVOS PDF AQUI',
    description: 'Clique ou arraste arquivos PDF aqui',
    accept: '.pdf,application/pdf',
    multiple: true,
  },
};

export const WithLabelAndHelperText: Story = {
  args: {
    label: 'DOCUMENTO FISCAL (PDF)',
    title: 'CLIQUE OU ARRASTE ARQUIVOS PDF AQUI',
    description: 'Formatos aceitos: .PDF (máx. 15MB)',
    helperText: 'Arquivos serão processados localmente e com total privacidade.',
    accept: '.pdf',
  },
};

export const SingleFileImage: Story = {
  args: {
    label: 'FOTO DE PERFIL OU LOGO',
    title: 'SELECIONE OU SOLTE SUA IMAGEM',
    description: 'Formatos suportados: PNG, JPG, WEBP (máx. 5MB)',
    accept: 'image/*',
    multiple: false,
    showSelectedFiles: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'COMPROVANTE DE RESIDÊNCIA',
    title: 'CLIQUE OU ARRASTE O ARQUIVO AQUI',
    description: 'Clique ou arraste o arquivo aqui',
    error: 'O arquivo selecionado excede o limite máximo permitido de 10MB.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'UPLOAD BLOQUEADO',
    title: 'ENVIO DE ARQUIVOS DESABILITADO',
    description: 'Aguarde o processamento anterior para enviar novos itens.',
    disabled: true,
  },
};
