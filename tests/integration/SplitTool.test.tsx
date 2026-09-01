import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SplitTool from "@/app/[locale]/tools/pdf/split-pdf/SplitTool";

jest.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    return (key: string, params?: Record<string, string | number>) => {
      let text = `${namespace}.${key}`;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, String(v));
        });
      }
      return text;
    };
  },
}));

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

describe("SplitTool Integration", () => {
  const defaultProps = {
    title: "Split PDF",
    description: "Split PDF description",
    faqs: [],
  };

  test("renders with disabled split button initially", () => {
    render(<SplitTool {...defaultProps} />);

    const splitBtn = screen.getByRole("button", { name: /pdf\.split\.button\.split/i });
    expect(splitBtn).toBeDisabled();
    expect(screen.queryByText(/pdf\.split\.errors/i)).not.toBeInTheDocument();
  });

  test("shows validation error when invalid range is typed", () => {
    render(<SplitTool {...defaultProps} />);

    const input = screen.getByPlaceholderText("pdf.split.pageRanges.placeholder");
    fireEvent.change(input, { target: { value: "abc" } });

    expect(screen.getByText("pdf.split.errors.invalidFormat")).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "true");

    const splitBtn = screen.getByRole("button", { name: /pdf\.split\.button\.split/i });
    expect(splitBtn).toBeDisabled();
  });

  test("shows error when start page is greater than end page", () => {
    render(<SplitTool {...defaultProps} />);

    const input = screen.getByPlaceholderText("pdf.split.pageRanges.placeholder");
    fireEvent.change(input, { target: { value: "5-2" } });

    expect(screen.getByText("pdf.split.errors.startGreaterThanEnd")).toBeInTheDocument();
  });

  test("shows error when page is 0", () => {
    render(<SplitTool {...defaultProps} />);

    const input = screen.getByPlaceholderText("pdf.split.pageRanges.placeholder");
    fireEvent.change(input, { target: { value: "0" } });

    expect(screen.getByText("pdf.split.errors.zeroPage")).toBeInTheDocument();
  });

  test("clears error and remains valid when user clears input or provides valid range", () => {
    render(<SplitTool {...defaultProps} />);

    const input = screen.getByPlaceholderText("pdf.split.pageRanges.placeholder");
    fireEvent.change(input, { target: { value: "invalid" } });
    expect(screen.getByText("pdf.split.errors.invalidFormat")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "1-3, 5" } });
    expect(screen.queryByText("pdf.split.errors.invalidFormat")).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "false");

    fireEvent.change(input, { target: { value: "" } });
    expect(screen.queryByText(/pdf\.split\.errors/i)).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  test("renders formatting examples guide", () => {
    render(<SplitTool {...defaultProps} />);

    expect(screen.getByText("pdf.split.examples.title")).toBeInTheDocument();
    expect(screen.getByText("pdf.split.examples.empty.label")).toBeInTheDocument();
    expect(screen.getByText("pdf.split.examples.empty.desc")).toBeInTheDocument();
    expect(screen.getByText("pdf.split.examples.single.desc")).toBeInTheDocument();
    expect(screen.getByText("pdf.split.examples.range.desc")).toBeInTheDocument();
    expect(screen.getByText("pdf.split.examples.combined.desc")).toBeInTheDocument();
  });
});
