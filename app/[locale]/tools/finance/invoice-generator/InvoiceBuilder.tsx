"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { InvoiceData, InvoiceTotals } from "@/lib/invoiceTypes";
import { calculateTotals } from "@/lib/invoiceCalc";
import { saveDraft, loadDraft } from "@/lib/invoiceStorage";
import { LOCALE_CONFIGS, LocaleKey } from "@/data/invoiceLocales";
import Button from "@/components/Button";
import InvoiceForm from "./InvoiceForm";
import InvoicePreview from "./InvoicePreview";

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function createEmpty(locale?: LocaleKey, defaultTerms?: string): InvoiceData {
  const localeConfig = (locale && LOCALE_CONFIGS[locale]) || LOCALE_CONFIGS.us;
  return {
    number: "001",
    currency: localeConfig.currency,
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    from: { name: "", email: "", address: "" },
    to: { name: "", email: "", address: "" },
    lineItems: [
      { id: generateId(), description: "", quantity: 1, rate: 0, amount: 0 },
    ],
    tax: localeConfig.taxRate,
    discount: 0,
    notes: "",
    terms: defaultTerms || "Payment due within 30 days.",
    logo: undefined,
    id: "",
    status: "draft",
  };
}

interface InvoiceBuilderProps {
  locale?: LocaleKey;
}

export default function InvoiceBuilder({ locale }: InvoiceBuilderProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("finance.invoiceGenerator.ui");
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

  const [invoice, setInvoice] = useState<InvoiceData>(() =>
    createEmpty(locale),
  );

  useEffect(() => {
    const draft = loadDraft();
    if (draft && !locale) {
      setInvoice(draft);
    } else {
      setInvoice(createEmpty(locale, t("defaultTerms")));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [totals, setTotals] = useState<InvoiceTotals>(() =>
    calculateTotals(createEmpty(locale)),
  );

  useEffect(() => {
    setTotals(calculateTotals(invoice));
  }, [invoice]);

  const update = useCallback(
    <K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => {
      setInvoice((inv) => {
        const next = { ...inv, [field]: value };
        saveDraft(next);
        return next;
      });
    },
    [],
  );

  const updateLineItem = (
    id: string,
    field: string,
    value: string | number,
  ) => {
    setInvoice((inv) => {
      const lineItems = inv.lineItems.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        updated.amount = updated.quantity * updated.rate;
        return updated;
      });
      const next = { ...inv, lineItems };
      saveDraft(next);
      return next;
    });
  };

  const addLineItem = () => {
    update("lineItems", [
      ...invoice.lineItems,
      { id: generateId(), description: "", quantity: 1, rate: 0, amount: 0 },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (invoice.lineItems.length <= 1) return;
    update(
      "lineItems",
      invoice.lineItems.filter((item) => item.id !== id),
    );
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("logo", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const clearInvoice = () => {
    if (window.confirm(t("clearConfirm"))) {
      const next = createEmpty(locale, t("defaultTerms"));
      setInvoice(next);
      saveDraft(next);
      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <style>{`
        .card-neon:hover {
          border-color: var(--base-border) !important;
          box-shadow: none !important;
        }
        .invoice-preview {
          background-color: white !important;
          color: #4b5563 !important;
          border-color: #e5e7eb !important;
          box-shadow: var(--shadow) !important;
        }
        .invoice-preview,
        .invoice-preview * {
          border-color: #e5e7eb !important;
        }
        .invoice-preview .font-bold,
        .invoice-preview .font-semibold,
        .invoice-preview th,
        .invoice-preview .font-medium {
          color: #111827 !important;
        }
        .invoice-preview .uppercase,
        .invoice-preview .shrink-0 {
          color: #6b7280 !important;
        }
        .invoice-preview .text-red-500 {
          color: #ef4444 !important;
        }
        .hidden-print {
          display: none;
        }
        @media print {
          header, footer, nav, aside, .no-print, [class*="fixed bottom-"] {
            display: none !important;
          }
          main {
            min-height: 0 !important;
            height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }
          main > div {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print-card {
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .card-neon {
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .animate-fade-in-up {
            animation: none !important;
            transform: none !important;
          }
          .invoice-preview {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
            width: 100% !important;
          }
          .hidden-print {
            display: block !important;
          }
        }
      `}</style>
      <div className="bg-card border border-bd-base rounded-xl p-6 no-print-card">
        {/* Tab Switcher */}
        <div className="flex border-b border-bd-base -mx-6 px-6 mb-6 no-print">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`flex-1 pb-3 text-center text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "form"
                ? "border-neon text-neon"
                : "border-transparent text-tx-secondary hover:text-tx-primary"
            }`}
          >
            {t("formTab")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex-1 pb-3 text-center text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "preview"
                ? "border-neon text-neon"
                : "border-transparent text-tx-secondary hover:text-tx-primary"
            }`}
          >
            {t("previewTab")}
          </button>
        </div>

        {/* Form Panel */}
        <div
          className={`no-print ${activeTab === "form" ? "block" : "hidden"}`}
        >
          <InvoiceForm
            invoice={invoice}
            update={update}
            updateLineItem={updateLineItem}
            addLineItem={addLineItem}
            removeLineItem={removeLineItem}
            handleLogoUpload={handleLogoUpload}
            handleLogoClick={handleLogoClick}
            logoInputRef={logoInputRef}
            locale={locale}
            clearInvoice={clearInvoice}
            handlePrint={handlePrint}
          />
        </div>

        {/* Preview Panel */}
        <div className={activeTab === "preview" ? "block" : "hidden-print"}>
          <InvoicePreview invoice={invoice} totals={totals} locale={locale} />
          <div className="mt-6 no-print">
            <Button onClick={handlePrint} className="w-full">
              {t("downloadPrint")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
