import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppSelect } from '@/components/ui/form/AppSelect';

const sampleOptions = ['VALOR 1', 'VALOR 2', 'VALOR 3'];

describe('AppSelect', () => {
  it('renders with label and placeholder', () => {
    render(
      <AppSelect
        label="SELECT"
        placeholder="SELECIONE..."
        options={sampleOptions}
      />
    );

    expect(screen.getByText('SELECT')).toBeInTheDocument();
    expect(screen.getByText('SELECIONE...')).toBeInTheDocument();
  });

  it('opens dropdown on click and shows options', () => {
    render(
      <AppSelect
        label="SELECT"
        options={sampleOptions}
      />
    );

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'VALOR 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'VALOR 2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'VALOR 3' })).toBeInTheDocument();
  });

  it('selects option, calls onChange and closes dropdown', () => {
    const handleChange = jest.fn();
    render(
      <AppSelect
        options={sampleOptions}
        onChange={handleChange}
      />
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const option = screen.getByRole('option', { name: 'VALOR 2' });
    fireEvent.click(option);

    expect(handleChange).toHaveBeenCalledWith('VALOR 2');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByText('VALOR 2')).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside">Outside Area</div>
        <AppSelect options={sampleOptions} />
      </div>
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('supports controlled value prop', () => {
    const { rerender } = render(
      <AppSelect
        value="VALOR 1"
        options={sampleOptions}
      />
    );

    expect(screen.getByText('VALOR 1')).toBeInTheDocument();

    rerender(
      <AppSelect
        value="VALOR 3"
        options={sampleOptions}
      />
    );

    expect(screen.getByText('VALOR 3')).toBeInTheDocument();
  });

  it('supports object options with label and value', () => {
    const objectOptions = [
      { label: 'Primeiro', value: '1' },
      { label: 'Segundo', value: '2' },
    ];
    const handleChange = jest.fn();

    render(
      <AppSelect
        options={objectOptions}
        onChange={handleChange}
      />
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const option = screen.getByRole('option', { name: 'Segundo' });
    fireEvent.click(option);

    expect(handleChange).toHaveBeenCalledWith('2');
    expect(screen.getByText('Segundo')).toBeInTheDocument();
  });

  it('handles keyboard navigation with Escape, Enter, ArrowDown, ArrowUp', () => {
    const handleChange = jest.fn();
    render(
      <AppSelect
        options={sampleOptions}
        onChange={handleChange}
      />
    );

    const trigger = screen.getByRole('combobox');

    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    fireEvent.keyDown(trigger, { key: ' ' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(handleChange).toHaveBeenCalledWith('VALOR 1');
  });

  it('does not open when disabled', () => {
    render(
      <AppSelect
        options={sampleOptions}
        disabled={true}
      />
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDisabled();

    fireEvent.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('displays error and helperText', () => {
    const { rerender } = render(
      <AppSelect
        options={sampleOptions}
        error="Campo obrigatório"
      />
    );

    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();

    rerender(
      <AppSelect
        options={sampleOptions}
        helperText="Ajuda do campo"
      />
    );

    expect(screen.getByText('Ajuda do campo')).toBeInTheDocument();
  });
});
