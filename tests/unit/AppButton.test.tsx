import React from 'react';
import { render, screen } from '@testing-library/react';
import AppButton from '@/components/ui/AppButton';

describe('AppButton', () => {
  it('renders children correctly', () => {
    render(<AppButton>Click Me</AppButton>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies primary shadow on hover and primary-shadow on active by default', () => {
    render(<AppButton>Primary</AppButton>);
    const button = screen.getByRole('button', { name: /primary/i });
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('hover:shadow-[0px_4px_0px_var(--color-primary-shadow)]');
    expect(button).toHaveClass('active:bg-primary-shadow');
    expect(button).toHaveClass('active:shadow-none');
  });

  it('applies secondary shadow on hover and secondary-shadow on active', () => {
    render(<AppButton color="secondary">Secondary</AppButton>);
    const button = screen.getByRole('button', { name: /secondary/i });
    expect(button).toHaveClass('bg-secondary');
    expect(button).toHaveClass('hover:shadow-[0px_4px_0px_var(--color-secondary-shadow)]');
    expect(button).toHaveClass('active:bg-secondary-shadow');
    expect(button).toHaveClass('active:shadow-none');
  });

  it('applies tertiary shadow on hover and tertiary-shadow on active', () => {
    render(<AppButton color="tertiary">Tertiary</AppButton>);
    const button = screen.getByRole('button', { name: /tertiary/i });
    expect(button).toHaveClass('bg-tertiary');
    expect(button).toHaveClass('hover:shadow-[0px_4px_0px_var(--color-tertiary-shadow)]');
    expect(button).toHaveClass('active:bg-tertiary-shadow');
    expect(button).toHaveClass('active:shadow-none');
  });

  it('maps panel color to tertiary variant', () => {
    render(<AppButton color="panel">Panel</AppButton>);
    const button = screen.getByRole('button', { name: /panel/i });
    expect(button).toHaveClass('bg-tertiary');
    expect(button).toHaveClass('hover:shadow-[0px_4px_0px_var(--color-tertiary-shadow)]');
    expect(button).toHaveClass('active:bg-tertiary-shadow');
  });

  it('renders with arrow when withArrow is true', () => {
    const { container } = render(<AppButton withArrow>Next</AppButton>);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies small size classes when small prop is true', () => {
    render(<AppButton small>Small</AppButton>);
    const button = screen.getByRole('button', { name: /small/i });
    expect(button).toHaveClass('px-5', 'py-3', 'text-xs');
  });

  it('applies rounded-full when rounded is true', () => {
    render(<AppButton rounded>Rounded</AppButton>);
    const button = screen.getByRole('button', { name: /rounded/i });
    expect(button).toHaveClass('rounded-full');
  });

  it('handles disabled state properly', () => {
    render(<AppButton disabled>Disabled</AppButton>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:cursor-not-allowed');
    expect(button).toHaveClass('disabled:hover:shadow-none');
  });
});
