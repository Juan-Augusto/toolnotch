import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import AppScrollToTop from "@/components/AppScrollToTop";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/tools",
}));

describe("AppScrollToTop", () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
    });
  });

  it("renders the scroll to top button hidden initially at the top of the page", () => {
    render(<AppScrollToTop />);

    const button = screen.getByTestId("scroll-to-top");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Voltar ao topo");
    expect(button).toHaveClass("opacity-0", "pointer-events-none");
  });

  it("becomes visible when user scrolls down past 250px", () => {
    render(<AppScrollToTop />);

    const button = screen.getByTestId("scroll-to-top");

    act(() => {
      window.scrollY = 350;
      fireEvent.scroll(window);
    });

    expect(button).toHaveClass("opacity-100", "pointer-events-auto");

    act(() => {
      window.scrollY = 100;
      fireEvent.scroll(window);
    });

    expect(button).toHaveClass("opacity-0", "pointer-events-none");
  });

  it("calls window.scrollTo with smooth behavior when clicked", () => {
    render(<AppScrollToTop />);

    const button = screen.getByTestId("scroll-to-top");

    act(() => {
      window.scrollY = 500;
      fireEvent.scroll(window);
    });

    fireEvent.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
