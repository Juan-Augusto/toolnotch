import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AppAffiliateOffers from "@/components/AppAffiliateOffers";
import AppAffiliateStickyBar from "@/components/AppAffiliateStickyBar";

const mockUsePathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      label: "Ferramenta recomendada",
      dismiss: "Fechar",
      disclosure: "Alguns links acima são links de afiliado.",
      alsoRecommended: "Também recomendado",
      "offers.quillbot-paraphraser.name": "Ferramenta de Paráfrase da QuillBot",
      "offers.quillbot-paraphraser.cta": "Testar o parafraseador da QuillBot",
      "offers.quillbot-paraphraser.blurb": "Reescreva frases em diferentes tons.",
      "offers.quillbot-humanizer.name": "Humanizador de IA da QuillBot",
      "offers.quillbot-humanizer.cta": "Testar o Humanizador de IA da QuillBot",
      "offers.quillbot-humanizer.blurb": "Transforme rascunhos em texto natural.",
    };
    return translations[key] ?? key;
  },
}));

describe("AppAffiliateOffers", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/pt/tools/text/word-counter");
  });

  it("renders null if path has no affiliate offers", () => {
    mockUsePathname.mockReturnValue("/tools/other/unknown");
    const { container } = render(<AppAffiliateOffers />);
    expect(container.firstChild).toBeNull();
  });

  it("renders recommended badge, offer title, blurb, and CTA button", () => {
    render(<AppAffiliateOffers />);

    expect(screen.getByText("Ferramenta recomendada")).toBeInTheDocument();
    expect(
      screen.getByText("Ferramenta de Paráfrase da QuillBot")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Reescreva frases em diferentes tons.")
    ).toBeInTheDocument();

    const ctaLink = screen.getByRole("link", {
      name: /Testar o parafraseador da QuillBot/i,
    });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute("target", "_blank");
    expect(ctaLink).toHaveAttribute("rel", "sponsored nofollow noopener");
  });

  it("renders secondary offer if page has multiple offers", () => {
    mockUsePathname.mockReturnValue("/tools/text/readability-checker");
    render(<AppAffiliateOffers />);

    // Primary offer is Humanizer on readability-checker
    expect(
      screen.getByText("Humanizador de IA da QuillBot")
    ).toBeInTheDocument();
    // Secondary offer is Paraphraser
    expect(screen.getByText("Também recomendado:")).toBeInTheDocument();
    expect(
      screen.getByText("Ferramenta de Paráfrase da QuillBot")
    ).toBeInTheDocument();
  });
});

describe("AppAffiliateStickyBar", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockUsePathname.mockReturnValue("/pt/tools/text/word-counter");
  });

  it("renders null if path has no affiliate offers", () => {
    mockUsePathname.mockReturnValue("/tools/other/unknown");
    const { container } = render(<AppAffiliateStickyBar />);
    expect(container.firstChild).toBeNull();
  });

  it("renders sticky bar with offer name and CTA link", () => {
    render(<AppAffiliateStickyBar />);

    expect(
      screen.getByText("Ferramenta de Paráfrase da QuillBot")
    ).toBeInTheDocument();
    const ctaLink = screen.getByRole("link", {
      name: /Testar o parafraseador da QuillBot/i,
    });
    expect(ctaLink).toBeInTheDocument();
  });

  it("dismisses sticky bar when close button is clicked", () => {
    render(<AppAffiliateStickyBar />);

    const closeBtn = screen.getByRole("button", { name: "Fechar" });
    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn);

    expect(
      screen.queryByText("Ferramenta de Paráfrase da QuillBot")
    ).not.toBeInTheDocument();
  });

  it("clears legacy sessionStorage flags on mount so the bar is not locked hidden", () => {
    sessionStorage.setItem("aff-bar:/tools/text/word-counter", "0");
    render(<AppAffiliateStickyBar />);
    expect(sessionStorage.getItem("aff-bar:/tools/text/word-counter")).toBeNull();
    expect(
      screen.getByText("Ferramenta de Paráfrase da QuillBot")
    ).toBeInTheDocument();
  });
});
