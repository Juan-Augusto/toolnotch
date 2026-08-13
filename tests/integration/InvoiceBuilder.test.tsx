import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InvoiceBuilder from "@/app/[locale]/tools/finance/invoice-generator/InvoiceBuilder";

// Mock saveDraft and loadDraft
jest.mock("@/lib/invoiceStorage", () => ({
  saveDraft: jest.fn(),
  loadDraft: jest.fn().mockReturnValue(null),
  getNextNumber: jest.fn().mockReturnValue("INV-001"),
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      descriptionPlaceholder: "Description",
      addItem: "+ Add item",
      defaultTerms: "Payment due within 30 days.",
      taxLabel: "Tax",
      removeItem: "Remove item",
      clear: "Clear",
      clearConfirm: "Are you sure?",
    };
    return translations[key] || key;
  },
}));

describe("InvoiceBuilder Line Items removal", () => {
  it("adds and then removes a line item successfully", async () => {
    const user = userEvent.setup();
    render(<InvoiceBuilder locale="us" />);

    // Initially there is 1 line item.
    // The description input has placeholder "Description".
    let inputs = screen.getAllByPlaceholderText("Description");
    expect(inputs).toHaveLength(1);

    // The delete button should NOT be visible when there is only 1 item
    expect(screen.queryAllByLabelText("Remove item")).toHaveLength(0);

    // Click "+ Add item"
    const addButton = screen.getByText("+ Add item");
    await user.click(addButton);

    // Now there should be 2 line items
    inputs = screen.getAllByPlaceholderText("Description");
    expect(inputs).toHaveLength(2);

    // The delete buttons should now be visible for both items
    const deleteButtons = screen.getAllByLabelText("Remove item");
    expect(deleteButtons).toHaveLength(2);

    // Click the first delete button
    await user.click(deleteButtons[0]);

    // There should be 1 line item again
    inputs = screen.getAllByPlaceholderText("Description");
    expect(inputs).toHaveLength(1);

    // The delete button should be hidden again
    expect(screen.queryAllByLabelText("Remove item")).toHaveLength(0);
  });

  it("clears the invoice when Clear button is clicked and confirmed", async () => {
    const confirmMock = jest
      .spyOn(window, "confirm")
      .mockImplementation(() => true);
    const user = userEvent.setup();
    render(<InvoiceBuilder locale="us" />);

    const clearButton = screen.getByText("Clear");
    await user.click(clearButton);

    expect(confirmMock).toHaveBeenCalledWith("Are you sure?");
    confirmMock.mockRestore();
  });
});
