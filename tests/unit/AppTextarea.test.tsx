import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppTextarea from '@/components/ui/form/AppTextarea';

describe('AppTextarea', () => {
  it('renders textarea with default 4 rows', () => {
    render(<AppTextarea placeholder="Digite sua mensagem" />);

    const textarea = screen.getByPlaceholderText('Digite sua mensagem');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('rows', '4');
    expect(textarea.tagName.toLowerCase()).toBe('textarea');
  });

  it('respects custom rows prop', () => {
    render(<AppTextarea placeholder="Área grande" rows={8} />);

    const textarea = screen.getByPlaceholderText('Área grande');
    expect(textarea).toHaveAttribute('rows', '8');
  });

  it('renders label and associates it with textarea', () => {
    render(<AppTextarea label="Descrição" id="desc-id" />);

    const label = screen.getByText('Descrição');
    const textarea = screen.getByRole('textbox');

    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'desc-id');
    expect(textarea).toHaveAttribute('id', 'desc-id');
  });

  it('renders helper text when provided without error', () => {
    render(
      <AppTextarea
        label="Comentário"
        helperText="Máximo de 300 caracteres permitidos"
      />
    );

    expect(
      screen.getByText('Máximo de 300 caracteres permitidos')
    ).toBeInTheDocument();
  });

  it('renders error message and suppresses helper text when error is present', () => {
    render(
      <AppTextarea
        label="Comentário"
        error="Campo obrigatório"
        helperText="Texto auxiliar"
      />
    );

    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
    expect(screen.queryByText('Texto auxiliar')).not.toBeInTheDocument();

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-red-500');
  });

  it('calls onChange and onValueChange on user input', () => {
    const handleChange = jest.fn();
    const handleValueChange = jest.fn();

    render(
      <AppTextarea
        onChange={handleChange}
        onValueChange={handleValueChange}
        placeholder="Escreva aqui"
      />
    );

    const textarea = screen.getByPlaceholderText('Escreva aqui');
    fireEvent.change(textarea, { target: { value: 'Nova mensagem de teste' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleValueChange).toHaveBeenCalledWith('Nova mensagem de teste');
  });

  it('handles focus and blur state transitions', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();

    render(
      <AppTextarea
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Foco"
      />
    );

    const textarea = screen.getByPlaceholderText('Foco');

    fireEvent.focus(textarea);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(textarea).toHaveClass('border-secondary');

    fireEvent.blur(textarea);
    expect(handleBlur).toHaveBeenCalledTimes(1);
    expect(textarea).not.toHaveClass('border-secondary');
  });

  it('respects disabled state', () => {
    render(<AppTextarea label="Desabilitado" disabled placeholder="Inativo" />);

    const textarea = screen.getByPlaceholderText('Inativo');
    expect(textarea).toBeDisabled();

    const label = screen.getByText('Desabilitado');
    expect(label).toHaveClass('opacity-50');
  });

  it('supports controlled and uncontrolled values', () => {
    const { rerender } = render(<AppTextarea defaultValue="Texto Inicial" />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Texto Inicial');

    rerender(<AppTextarea value="Valor Controlado" onChange={() => {}} />);
    expect(textarea.value).toBe('Valor Controlado');
  });

  it('applies custom class names', () => {
    const { container } = render(
      <AppTextarea
        label="Custom"
        className="custom-textarea"
        containerClassName="custom-container"
        labelClassName="custom-label"
      />
    );

    expect(container.firstChild).toHaveClass('custom-container');
    expect(screen.getByText('Custom')).toHaveClass('custom-label');
    expect(screen.getByRole('textbox')).toHaveClass('custom-textarea');
  });
});
