import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppCheckbox } from '@/components/ui/form/AppCheckbox';

describe('AppCheckbox', () => {
  it('renders with label and starts unchecked', () => {
    render(<AppCheckbox label="CHECKBOX" />);

    const checkbox = screen.getByRole('checkbox', { name: 'CHECKBOX' });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    expect(screen.getByText('CHECKBOX')).toBeInTheDocument();
  });

  it('renders checked when defaultChecked is true', () => {
    render(<AppCheckbox label="CHECKBOX" defaultChecked={true} />);

    const checkbox = screen.getByRole('checkbox', { name: 'CHECKBOX' });
    expect(checkbox).toBeChecked();
  });

  it('toggles checked state on click and calls onChange', () => {
    const handleChange = jest.fn();
    render(<AppCheckbox label="CHECKBOX" onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox', { name: 'CHECKBOX' });
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(true, expect.any(Object));
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(false, expect.any(Object));
    expect(checkbox).not.toBeChecked();
  });

  it('supports controlled checked prop', () => {
    const { rerender } = render(
      <AppCheckbox label="CHECKBOX" checked={false} />
    );

    const checkbox = screen.getByRole('checkbox', { name: 'CHECKBOX' });
    expect(checkbox).not.toBeChecked();

    rerender(<AppCheckbox label="CHECKBOX" checked={true} />);
    expect(checkbox).toBeChecked();
  });

  it('does not toggle when disabled', () => {
    const handleChange = jest.fn();
    render(
      <AppCheckbox
        label="CHECKBOX"
        disabled={true}
        onChange={handleChange}
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: 'CHECKBOX' });
    expect(checkbox).toBeDisabled();

    fireEvent.click(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
    expect(checkbox).not.toBeChecked();
  });

  it('handles indeterminate state', () => {
    render(<AppCheckbox label="CHECKBOX" indeterminate={true} />);

    const checkbox = screen.getByRole('checkbox', { name: 'CHECKBOX' }) as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it('displays error and helperText', () => {
    const { rerender } = render(
      <AppCheckbox
        label="CHECKBOX"
        error="Campo obrigatório"
      />
    );

    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();

    rerender(
      <AppCheckbox
        label="CHECKBOX"
        helperText="Informação adicional"
      />
    );

    expect(screen.getByText('Informação adicional')).toBeInTheDocument();
  });

  it('passes name and value props to input element', () => {
    render(
      <AppCheckbox
        label="CHECKBOX"
        name="agree"
        value="yes"
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: 'CHECKBOX' });
    expect(checkbox).toHaveAttribute('name', 'agree');
    expect(checkbox).toHaveAttribute('value', 'yes');
  });
});
