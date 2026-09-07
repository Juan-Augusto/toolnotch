import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppSegmentedControl, { type SegmentOption } from '@/components/AppSegmentedControl';

describe('AppSegmentedControl', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  it('renders all options with label and sets defaultValue by value', () => {
    const options: SegmentOption<number>[] = [
      { label: '1 ANO', value: 1 },
      { label: '5 ANOS', value: 5 },
      { label: '10 ANOS', value: 10 },
    ];

    render(
      <AppSegmentedControl
        options={options}
        defaultValue={10}
      />
    );

    const option1 = screen.getByRole('radio', { name: /1 ANO/i });
    const option5 = screen.getByRole('radio', { name: /5 ANOS/i });
    const option10 = screen.getByRole('radio', { name: /10 ANOS/i });

    expect(option1).toBeInTheDocument();
    expect(option5).toBeInTheDocument();
    expect(option10).toBeInTheDocument();

    expect(option10).toHaveAttribute('aria-checked', 'true');
    expect(option1).toHaveAttribute('aria-checked', 'false');
    expect(option5).toHaveAttribute('aria-checked', 'false');
  });

  it('switches selected option value on click in uncontrolled mode', () => {
    const handleChange = jest.fn();
    const options: SegmentOption<string>[] = [
      { label: '1 ANO', value: '1y' },
      { label: '5 ANOS', value: '5y' },
      { label: '10 ANOS', value: '10y' },
    ];

    render(
      <AppSegmentedControl
        options={options}
        defaultValue="1y"
        onChange={handleChange}
      />
    );

    const option5 = screen.getByRole('radio', { name: /5 ANOS/i });
    fireEvent.click(option5);

    expect(option5).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /1 ANO/i })).toHaveAttribute('aria-checked', 'false');
    expect(handleChange).toHaveBeenCalledWith('5y');
  });

  it('operates in controlled mode with value and onChange', () => {
    const handleChange = jest.fn();
    const options: SegmentOption<string>[] = [
      { label: '1 ANO', value: '1y' },
      { label: '5 ANOS', value: '5y' },
      { label: '10 ANOS', value: '10y' },
    ];

    const { rerender } = render(
      <AppSegmentedControl
        options={options}
        value="5y"
        onChange={handleChange}
      />
    );

    const option10 = screen.getByRole('radio', { name: /10 ANOS/i });
    fireEvent.click(option10);

    expect(handleChange).toHaveBeenCalledWith('10y');
    // Still 5y until re-rendered with new controlled value
    expect(screen.getByRole('radio', { name: /5 ANOS/i })).toHaveAttribute('aria-checked', 'true');

    rerender(
      <AppSegmentedControl
        options={options}
        value="10y"
        onChange={handleChange}
      />
    );
    expect(option10).toHaveAttribute('aria-checked', 'true');
  });

  it('supports badges and hidden form input with value', () => {
    const options: SegmentOption<number>[] = [
      { label: '1 ANO', value: 1, badge: 'HOT' },
      { label: '5 ANOS', value: 5 },
      { label: '10 ANOS', value: 10 },
    ];

    render(
      <AppSegmentedControl
        options={options}
        defaultValue={1}
        name="prazo"
      />
    );

    expect(screen.getByText('HOT')).toBeInTheDocument();
    const hiddenInput = document.querySelector('input[name="prazo"]') as HTMLInputElement;
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput.value).toBe('1');
  });

  it('prevents selection of disabled options', () => {
    const handleChange = jest.fn();
    const options: SegmentOption<string>[] = [
      { label: '1 ANO', value: '1y' },
      { label: '5 ANOS', value: '5y', disabled: true },
    ];

    render(
      <AppSegmentedControl
        options={options}
        defaultValue="1y"
        onChange={handleChange}
      />
    );

    const disabledOption = screen.getByRole('radio', { name: /5 ANOS/i });
    expect(disabledOption).toBeDisabled();

    fireEvent.click(disabledOption);
    expect(handleChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: /1 ANO/i })).toHaveAttribute('aria-checked', 'true');
  });

  it('supports keyboard navigation via arrow keys and home/end', () => {
    const handleChange = jest.fn();
    const options: SegmentOption<string>[] = [
      { label: '1 ANO', value: '1y' },
      { label: '5 ANOS', value: '5y' },
      { label: '10 ANOS', value: '10y' },
    ];

    render(
      <AppSegmentedControl
        options={options}
        defaultValue="1y"
        onChange={handleChange}
      />
    );

    const radio1 = screen.getByRole('radio', { name: /1 ANO/i });

    // ArrowRight -> 5 ANOS
    fireEvent.keyDown(radio1, { key: 'ArrowRight' });
    expect(handleChange).toHaveBeenCalledWith('5y');
    expect(screen.getByRole('radio', { name: /5 ANOS/i })).toHaveAttribute('aria-checked', 'true');

    // End -> 10 ANOS
    const radio5 = screen.getByRole('radio', { name: /5 ANOS/i });
    fireEvent.keyDown(radio5, { key: 'End' });
    expect(handleChange).toHaveBeenCalledWith('10y');
    expect(screen.getByRole('radio', { name: /10 ANOS/i })).toHaveAttribute('aria-checked', 'true');

    // Home -> 1 ANO
    const radio10 = screen.getByRole('radio', { name: /10 ANOS/i });
    fireEvent.keyDown(radio10, { key: 'Home' });
    expect(handleChange).toHaveBeenCalledWith('1y');
    expect(screen.getByRole('radio', { name: /1 ANO/i })).toHaveAttribute('aria-checked', 'true');
  });

  it('renders label, error and helper text', () => {
    const options: SegmentOption<string>[] = [
      { label: '1 ANO', value: '1' },
      { label: '5 ANOS', value: '5' },
    ];

    const { rerender } = render(
      <AppSegmentedControl
        label="PRAZO"
        helperText="Escolha um prazo"
        options={options}
      />
    );

    expect(screen.getByText('PRAZO')).toBeInTheDocument();
    expect(screen.getByText('Escolha um prazo')).toBeInTheDocument();

    rerender(
      <AppSegmentedControl
        label="PRAZO"
        error="Campo obrigatório"
        options={options}
      />
    );
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });
});
