import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppInput from '@/components/ui/form/AppInput';
import { CurrencyFormatter } from '@/utils/formatters/currency';

describe('AppInput', () => {
  it('renders input with default properties', () => {
    render(<AppInput placeholder="Digite seu nome" />);

    const input = screen.getByPlaceholderText('Digite seu nome');
    expect(input).toBeInTheDocument();
    expect(input.tagName.toLowerCase()).toBe('input');
    expect(input).toHaveClass('bg-tertiary', 'border');
  });

  it('renders without border and background when flat is true', () => {
    render(<AppInput placeholder="Input flat" flat />);

    const input = screen.getByPlaceholderText('Input flat');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('bg-transparent', 'border-0');
    expect(input).not.toHaveClass('bg-tertiary');
  });

  it('renders label and associates it with input', () => {
    render(<AppInput label="Nome Completo" id="name-input" />);

    const label = screen.getByText('Nome Completo');
    const input = screen.getByRole('textbox');

    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'name-input');
    expect(input).toHaveAttribute('id', 'name-input');
  });

  it('renders helper text when provided without error', () => {
    render(
      <AppInput
        label="E-mail"
        helperText="Digite um e-mail corporativo válido"
      />
    );

    expect(
      screen.getByText('Digite um e-mail corporativo válido')
    ).toBeInTheDocument();
  });

  it('renders error message and applies error styles', () => {
    render(
      <AppInput
        label="E-mail"
        error="E-mail inválido"
        helperText="Texto auxiliar"
      />
    );

    expect(screen.getByText('E-mail inválido')).toBeInTheDocument();
    expect(screen.queryByText('Texto auxiliar')).not.toBeInTheDocument();

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
  });

  it('calls onChange and onValueChange on user input', () => {
    const handleChange = jest.fn();
    const handleValueChange = jest.fn();

    render(
      <AppInput
        onChange={handleChange}
        onValueChange={handleValueChange}
        placeholder="Texto"
      />
    );

    const input = screen.getByPlaceholderText('Texto');
    fireEvent.change(input, { target: { value: 'Meu texto' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleValueChange).toHaveBeenCalledWith('Meu texto', 'Meu texto');
  });

  it('works with custom formatter', () => {
    const handleValueChange = jest.fn();

    render(
      <AppInput
        formatter={CurrencyFormatter.BRL}
        onValueChange={handleValueChange}
        defaultValue={1500}
        placeholder="R$ 0,00"
      />
    );

    const input = screen.getByPlaceholderText('R$ 0,00') as HTMLInputElement;
    expect(input.value).toContain('1.500,00');

    fireEvent.change(input, { target: { value: '2500,50' } });
    expect(handleValueChange).toHaveBeenCalledWith(2500.5, '2500,50');
  });

  it('handles focus and blur states', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();

    render(
      <AppInput
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Foco"
      />
    );

    const input = screen.getByPlaceholderText('Foco');

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(input).toHaveClass('border-secondary');

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
    expect(input).not.toHaveClass('border-secondary');
  });

  it('respects disabled state', () => {
    render(<AppInput label="Desabilitado" disabled placeholder="Inativo" />);

    const input = screen.getByPlaceholderText('Inativo');
    expect(input).toBeDisabled();

    const label = screen.getByText('Desabilitado');
    expect(label).toHaveClass('opacity-50');
  });
});
