import React from "react";
import { render, screen } from "@testing-library/react";
import AppBreadcrumb from "@/components/ui/AppBreadcrumb";

// Mock next/navigation
const mockUsePathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

describe("AppBreadcrumb", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/quizzes");
  });

  it("renders explicit items with separators and links", () => {
    const { container } = render(
      <AppBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Quizzes", href: "/quizzes" },
          { label: "Qual é o seu perfil político", current: true },
        ]}
      />
    );

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("href", "/");

    const quizzesLink = screen.getByRole("link", { name: "Quizzes" });
    expect(quizzesLink).toHaveAttribute("href", "/quizzes");

    const currentItem = screen.getByText("Qual é o seu perfil político");
    expect(currentItem).toHaveAttribute("aria-current", "page");

    const separators = container.querySelectorAll("svg.lucide-chevron-right");
    expect(separators.length).toBe(2);
  });

  it("does not render when on home page", () => {
    mockUsePathname.mockReturnValue("/");
    const { container } = render(<AppBreadcrumb />);
    expect(container.firstChild).toBeNull();
  });

  it("does not render on localized home page /pt", () => {
    mockUsePathname.mockReturnValue("/pt");
    const { container } = render(<AppBreadcrumb />);
    expect(container.firstChild).toBeNull();
  });

  it("auto-generates breadcrumbs from pathname when items prop is omitted", () => {
    mockUsePathname.mockReturnValue("/pt/quiz/what-is-your-political-profile");
    render(<AppBreadcrumb />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/pt");
    expect(screen.getByRole("link", { name: "Quizzes" })).toHaveAttribute("href", "/pt/quizzes");
    expect(screen.getByText("What Is Your Political Profile")).toBeInTheDocument();
  });
});
