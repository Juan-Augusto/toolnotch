import React from 'react';
import { render } from '@testing-library/react';
import AppCornerAccents from '@/components/ui/AppCornerAccents';

describe('AppCornerAccents', () => {
  it('renders 4 corner spans by default', () => {
    const { container } = render(
      <div className="relative">
        <AppCornerAccents />
      </div>
    );

    const spans = container.querySelectorAll('span');
    expect(spans.length).toBe(4);
    expect(spans[0]).toHaveClass('-top-0.5', '-left-0.5', 'border-t-3', 'border-l-3', 'border-foreground');
    expect(spans[1]).toHaveClass('-top-0.5', '-right-0.5', 'border-t-3', 'border-r-3', 'border-foreground');
    expect(spans[2]).toHaveClass('-bottom-0.5', '-left-0.5', 'border-b-3', 'border-l-3', 'border-foreground');
    expect(spans[3]).toHaveClass('-bottom-0.5', '-right-0.5', 'border-b-3', 'border-r-3', 'border-foreground');
  });

  it('renders top corners when position="top"', () => {
    const { container } = render(
      <div className="relative">
        <AppCornerAccents position="top" />
      </div>
    );

    const spans = container.querySelectorAll('span');
    expect(spans.length).toBe(2);
    expect(spans[0]).toHaveClass('-top-0.5', '-left-0.5');
    expect(spans[1]).toHaveClass('-top-0.5', '-right-0.5');
  });

  it('renders bottom corners when position="bottom"', () => {
    const { container } = render(
      <div className="relative">
        <AppCornerAccents position="bottom" />
      </div>
    );

    const spans = container.querySelectorAll('span');
    expect(spans.length).toBe(2);
    expect(spans[0]).toHaveClass('-bottom-0.5', '-left-0.5');
    expect(spans[1]).toHaveClass('-bottom-0.5', '-right-0.5');
  });

  it('renders single corner when position is a specific corner preset', () => {
    const { container } = render(
      <div className="relative">
        <AppCornerAccents position="top-right" />
      </div>
    );

    const spans = container.querySelectorAll('span');
    expect(spans.length).toBe(1);
    expect(spans[0]).toHaveClass('-top-0.5', '-right-0.5');
  });

  it('renders specific corners provided via corners prop', () => {
    const { container } = render(
      <div className="relative">
        <AppCornerAccents corners={['top-left', 'bottom-right']} />
      </div>
    );

    const spans = container.querySelectorAll('span');
    expect(spans.length).toBe(2);
    expect(spans[0]).toHaveClass('-top-0.5', '-left-0.5');
    expect(spans[1]).toHaveClass('-bottom-0.5', '-right-0.5');
  });

  it('applies custom className, borderColor, and size', () => {
    const { container } = render(
      <div className="relative">
        <AppCornerAccents
          className="custom-accent"
          borderColor="border-primary"
          size="w-4 h-4"
        />
      </div>
    );

    const spans = container.querySelectorAll('span');
    expect(spans.length).toBe(4);
    spans.forEach((span) => {
      expect(span).toHaveClass('custom-accent', 'border-primary', 'w-4', 'h-4');
    });
  });
});
