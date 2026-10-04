import React from "react";
import { render, screen } from "@testing-library/react";
import AppTable, {
  AppTableHeader,
  AppTableBody,
  AppTableRow,
  AppTableHead,
  AppTableCell,
} from "@/components/ui/AppTable";

describe("AppTable", () => {
  describe("Config-driven mode", () => {
    const columns = [
      { key: "from", header: "De", align: "left" as const },
      { key: "to", header: "Para", align: "right" as const },
    ];

    const data = [
      { id: "1", from: "1 m", to: "3.28 ft" },
      { id: "2", from: "5 m", to: "16.4 ft" },
    ];

    it("renders table headers and rows from config", () => {
      render(<AppTable columns={columns} data={data} />);

      expect(screen.getByText("De")).toBeInTheDocument();
      expect(screen.getByText("Para")).toBeInTheDocument();
      expect(screen.getByText("1 m")).toBeInTheDocument();
      expect(screen.getByText("3.28 ft")).toBeInTheDocument();
      expect(screen.getByText("5 m")).toBeInTheDocument();
      expect(screen.getByText("16.4 ft")).toBeInTheDocument();
    });

    it("applies alignment classes to th and td", () => {
      render(<AppTable columns={columns} data={data} />);

      const headerFrom = screen.getByText("De");
      const headerTo = screen.getByText("Para");
      expect(headerFrom).toHaveClass("text-left");
      expect(headerTo).toHaveClass("text-right");

      const cellTo = screen.getByText("3.28 ft");
      expect(cellTo).toHaveClass("text-right");
    });
  });

  describe("Compound components mode", () => {
    it("renders correctly with compound syntax", () => {
      render(
        <AppTable>
          <AppTableHeader>
            <AppTableRow>
              <AppTableHead>Moeda</AppTableHead>
              <AppTableHead align="right">Taxa</AppTableHead>
            </AppTableRow>
          </AppTableHeader>
          <AppTableBody>
            <AppTableRow>
              <AppTableCell>USD</AppTableCell>
              <AppTableCell align="right">5.15</AppTableCell>
            </AppTableRow>
          </AppTableBody>
        </AppTable>
      );

      expect(screen.getByText("Moeda")).toBeInTheDocument();
      expect(screen.getByText("Taxa")).toBeInTheDocument();
      expect(screen.getByText("USD")).toBeInTheDocument();
      expect(screen.getByText("5.15")).toBeInTheDocument();
    });
  });

  describe("Visual features", () => {
    it("omits corner accents by default", () => {
      const { container } = render(
        <AppTable>
          <tbody>
            <tr>
              <td>Teste</td>
            </tr>
          </tbody>
        </AppTable>
      );

      const corners = container.querySelectorAll('span[aria-hidden="true"]');
      expect(corners.length).toBe(0);
    });

    it("renders corner accents when cornerAccents={true}", () => {
      const { container } = render(
        <AppTable cornerAccents={true}>
          <tbody>
            <tr>
              <td>Teste</td>
            </tr>
          </tbody>
        </AppTable>
      );

      const corners = container.querySelectorAll('span[aria-hidden="true"]');
      expect(corners.length).toBe(4);
    });
  });
});
