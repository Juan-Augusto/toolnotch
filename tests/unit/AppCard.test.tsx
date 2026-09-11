import React from "react";
import { render, screen } from "@testing-library/react";
import AppCard from "@/components/ui/AppCard";

describe("AppCard", () => {
  it("renders children and omits corner accents by default", () => {
    const { container } = render(
      <AppCard>
        <div>Card Content</div>
      </AppCard>,
    );

    expect(screen.getByText("Card Content")).toBeInTheDocument();
    const cornerSpans = container.querySelectorAll('span[aria-hidden="true"]');
    expect(cornerSpans.length).toBe(0);
  });

  it("omits corner accents when withCornerAccents={false}", () => {
    const { container } = render(
      <AppCard withCornerAccents={false}>
        <div>Card Content</div>
      </AppCard>,
    );

    expect(screen.getByText("Card Content")).toBeInTheDocument();
    const cornerSpans = container.querySelectorAll('span[aria-hidden="true"]');
    expect(cornerSpans.length).toBe(0);
  });

  it("renders corner accents when withCornerAccents is explicitly passed true", () => {
    const { container } = render(
      <AppCard withCornerAccents={true}>
        <div>Card Content</div>
      </AppCard>,
    );

    expect(screen.getByText("Card Content")).toBeInTheDocument();
    const cornerSpans = container.querySelectorAll('span[aria-hidden="true"]');
    expect(cornerSpans.length).toBe(4);
  });
});
