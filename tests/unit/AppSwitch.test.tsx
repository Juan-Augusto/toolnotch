import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppSwitch } from '@/components/ui/form/AppSwitch';

describe('AppSwitch', () => {
  it('renders with label and starts unchecked', () => {
    render(<AppSwitch label="SWITCH" />);

    const switchEl = screen.getByRole('switch', { name: 'SWITCH' });
    expect(switchEl).toBeInTheDocument();
    expect(switchEl).not.toBeChecked();
    expect(switchEl).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByText('SWITCH')).toBeInTheDocument();
  });

  it('renders checked when defaultChecked is true', () => {
    render(<AppSwitch label="SWITCH" defaultChecked={true} />);

    const switchEl = screen.getByRole('switch', { name: 'SWITCH' });
    expect(switchEl).toBeChecked();
    expect(switchEl).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles state on click and calls onChange', () => {
    const handleChange = jest.fn();
    render(<AppSwitch label="SWITCH" onChange={handleChange} />);

    const switchEl = screen.getByRole('switch', { name: 'SWITCH' });
    fireEvent.click(switchEl);

    expect(handleChange).toHaveBeenCalledWith(true, expect.any(Object));
    expect(switchEl).toBeChecked();
    expect(switchEl).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(switchEl);
    expect(handleChange).toHaveBeenCalledWith(false, expect.any(Object));
    expect(switchEl).not.toBeChecked();
    expect(switchEl).toHaveAttribute('aria-checked', 'false');
  });

  it('supports controlled checked prop', () => {
    const { rerender } = render(
      <AppSwitch label="SWITCH" checked={false} />
    );

    const switchEl = screen.getByRole('switch', { name: 'SWITCH' });
    expect(switchEl).not.toBeChecked();

    rerender(<AppSwitch label="SWITCH" checked={true} />);
    expect(switchEl).toBeChecked();
  });

  it('does not toggle when disabled', () => {
    const handleChange = jest.fn();
    render(
      <AppSwitch
        label="SWITCH"
        disabled={true}
        onChange={handleChange}
      />
    );

    const switchEl = screen.getByRole('switch', { name: 'SWITCH' });
    expect(switchEl).toBeDisabled();

    fireEvent.click(switchEl);
    expect(handleChange).not.toHaveBeenCalled();
    expect(switchEl).not.toBeChecked();
  });

  it('supports left and right label positions', () => {
    const { rerender, container } = render(
      <AppSwitch label="SWITCH" labelPosition="left" />
    );

    const labelContainer = container.querySelector('label')!;
    expect(labelContainer.firstElementChild?.tagName.toLowerCase()).toBe('span');

    rerender(<AppSwitch label="SWITCH" labelPosition="right" />);
    expect(labelContainer.lastElementChild?.tagName.toLowerCase()).toBe('span');
  });

  it('displays error and helperText', () => {
    const { rerender } = render(
      <AppSwitch
        label="SWITCH"
        error="Configuração indisponível"
      />
    );

    expect(screen.getByText('Configuração indisponível')).toBeInTheDocument();

    rerender(
      <AppSwitch
        label="SWITCH"
        helperText="Ajuda do switch"
      />
    );

    expect(screen.getByText('Ajuda do switch')).toBeInTheDocument();
  });

  it('passes name and value props to input element', () => {
    render(
      <AppSwitch
        label="SWITCH"
        name="theme"
        value="dark"
      />
    );

    const switchEl = screen.getByRole('switch', { name: 'SWITCH' });
    expect(switchEl).toHaveAttribute('name', 'theme');
    expect(switchEl).toHaveAttribute('value', 'dark');
  });
});
