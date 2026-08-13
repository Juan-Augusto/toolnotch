"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { InvoiceData } from "@/lib/invoiceTypes";
import { INVOICE_CURRENCIES } from "@/data/invoiceCurrencies";
import { LOCALE_CONFIGS, LocaleKey } from "@/data/invoiceLocales";
import Button from "@/components/Button";
import Label from "@/components/Label";
import { formatAmount } from "@/lib/invoiceCalc";

interface InvoiceFormProps {
  invoice: InvoiceData;
  update: (field: keyof InvoiceData, value: any) => void;
  updateLineItem: (id: string, field: string, value: any) => void;
  addLineItem: () => void;
  removeLineItem: (id: string) => void;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogoClick: () => void;
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  locale?: string;
  clearInvoice: () => void;
  handlePrint: () => void;
}

export default function InvoiceForm({
  invoice,
  update,
  updateLineItem,
  addLineItem,
  removeLineItem,
  handleLogoUpload,
  handleLogoClick,
  logoInputRef,
  locale,
  clearInvoice,
  handlePrint,
}: InvoiceFormProps) {
  const t = useTranslations("finance.invoiceGenerator.ui");
  const taxLabel = locale
    ? LOCALE_CONFIGS[locale as LocaleKey]?.taxLabel || t("taxLabel")
    : t("taxLabel");

  const fmt = (v: number) => formatAmount(v, invoice.currency);

  return (
    <div className="space-y-5">
      {/* From */}
      <section>
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {t("from")}
        </h3>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              placeholder={t("nameCompanyPlaceholder")}
              value={invoice.from.name}
              onChange={(e) =>
                update("from", { ...invoice.from, name: e.target.value })
              }
              className="flex-1 px-3 py-2 text-sm"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              ref={logoInputRef}
              id="logo-upload"
            />
            <Button
              type="button"
              onClick={handleLogoClick}
              className="!w-auto py-2 px-4 text-xs font-semibold"
            >
              {t("logoButton")}
            </Button>
          </div>
          <input
            placeholder={t("emailPlaceholder")}
            type="email"
            value={invoice.from.email}
            onChange={(e) =>
              update("from", { ...invoice.from, email: e.target.value })
            }
            className="w-full px-3 py-2 text-sm"
          />
          <textarea
            placeholder={t("addressPlaceholder")}
            rows={2}
            value={invoice.from.address}
            onChange={(e) =>
              update("from", { ...invoice.from, address: e.target.value })
            }
            className="w-full px-3 py-2 text-sm resize-none"
          />
        </div>
      </section>

      {/* To */}
      <section>
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {t("billTo")}
        </h3>
        <div className="space-y-2">
          <input
            placeholder={t("clientNamePlaceholder")}
            value={invoice.to.name}
            onChange={(e) =>
              update("to", { ...invoice.to, name: e.target.value })
            }
            className="w-full px-3 py-2 text-sm"
          />
          <input
            placeholder={t("clientEmailPlaceholder")}
            type="email"
            value={invoice.to.email}
            onChange={(e) =>
              update("to", { ...invoice.to, email: e.target.value })
            }
            className="w-full px-3 py-2 text-sm"
          />
          <textarea
            placeholder={t("clientAddressPlaceholder")}
            rows={2}
            value={invoice.to.address}
            onChange={(e) =>
              update("to", { ...invoice.to, address: e.target.value })
            }
            className="w-full px-3 py-2 text-sm resize-none"
          />
        </div>
      </section>

      {/* Meta */}
      <section>
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {t("invoiceDetails")}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>{t("invoiceNumber")}</Label>
            <input
              value={invoice.number}
              onChange={(e) => update("number", e.target.value)}
              className="w-full px-3 py-2 text-sm"
            />
          </div>
          <div>
            <Label>{t("currency")}</Label>
            <select
              value={invoice.currency}
              onChange={(e) => update("currency", e.target.value)}
              className="w-full px-3 py-2 text-sm"
            >
              {INVOICE_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>{t("date")}</Label>
            <input
              type="date"
              value={invoice.date}
              onChange={(e) => update("date", e.target.value)}
              className="w-full px-3 py-2 text-sm"
            />
          </div>
          <div>
            <Label>{t("dueDate")}</Label>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => update("dueDate", e.target.value)}
              className="w-full px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Line Items */}
      <section>
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {t("lineItems")}
        </h3>
        <div className="space-y-2">
          {/* Header labels */}
          <div className="flex gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 px-0.5 select-none no-print">
            <span className="flex-1">{t("descriptionPlaceholder")}</span>
            <span className="w-24 text-center">{t("qty")}</span>
            <span className="w-24 text-right">{t("rate")}</span>
            <span className="w-32 text-right">{t("amount")}</span>
            {invoice.lineItems.length > 1 && <span className="w-7"></span>}
          </div>

          {invoice.lineItems.map((item) => (
            <div key={item.id} className="flex gap-1.5 items-start">
              <input
                placeholder={t("descriptionPlaceholder")}
                value={item.description}
                onChange={(e) =>
                  updateLineItem(item.id, "description", e.target.value)
                }
                className="flex-1 px-2 py-1.5 text-sm"
              />
              <input
                type="number"
                min={0}
                step={0.01}
                value={item.quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  const parsed = parseFloat(val) || 0;
                  const finalVal =
                    val.includes(".") && val.split(".")[1].length > 2
                      ? Math.round(parsed * 100) / 100
                      : parsed;
                  updateLineItem(item.id, "quantity", finalVal);
                }}
                className="w-24 px-2 py-1.5 text-sm text-center"
              />
              <input
                type="number"
                min={0}
                step={0.01}
                value={item.rate}
                onChange={(e) => {
                  const val = e.target.value;
                  const parsed = parseFloat(val) || 0;
                  const finalVal =
                    val.includes(".") && val.split(".")[1].length > 2
                      ? Math.round(parsed * 100) / 100
                      : parsed;
                  updateLineItem(item.id, "rate", finalVal);
                }}
                className="w-24 px-2 py-1.5 text-sm text-right"
              />
              <div
                title={fmt(item.amount)}
                className="w-32 px-2 py-1.5 bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded text-sm text-right text-gray-600 dark:text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {fmt(item.amount)}
              </div>
              {invoice.lineItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLineItem(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mt-0.5"
                  title={t("removeItem") || "Remove item"}
                  aria-label={t("removeItem") || "Remove item"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addLineItem}
            className="text-sm text-blue-600 dark:text-tx-primary hover:underline cursor-pointer"
          >
            {t("addItem")}
          </button>
        </div>
      </section>

      {/* Totals */}
      <section>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>{t("discount")}</Label>
            <input
              type="number"
              min={0}
              max={100}
              step={0.01}
              value={invoice.discount}
              onChange={(e) => {
                const val = e.target.value;
                const parsed = parseFloat(val) || 0;
                const finalVal =
                  val.includes(".") && val.split(".")[1].length > 2
                    ? Math.round(parsed * 100) / 100
                    : parsed;
                update("discount", finalVal);
              }}
              className="w-full px-3 py-2 text-sm"
            />
          </div>
          <div>
            <Label>{taxLabel} %</Label>
            <input
              type="number"
              min={0}
              max={100}
              step={0.01}
              value={invoice.tax}
              onChange={(e) => {
                const val = e.target.value;
                const parsed = parseFloat(val) || 0;
                const finalVal =
                  val.includes(".") && val.split(".")[1].length > 2
                    ? Math.round(parsed * 100) / 100
                    : parsed;
                update("tax", finalVal);
              }}
              className="w-full px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Notes / Terms */}
      <section>
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {t("notesTerms")}
        </h3>
        <div className="space-y-2">
          <textarea
            placeholder={t("notesPlaceholder")}
            rows={2}
            value={invoice.notes}
            onChange={(e) => update("notes", e.target.value)}
            className="w-full px-3 py-2 text-sm resize-none"
          />
          <textarea
            placeholder={t("termsPlaceholder")}
            rows={2}
            value={invoice.terms}
            onChange={(e) => update("terms", e.target.value)}
            className="w-full px-3 py-2 text-sm resize-none"
          />
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6 pt-4 border-t border-bd-base">
        <Button
          type="button"
          onClick={clearInvoice}
          color="panel"
          className="flex-1"
        >
          {t("clear")}
        </Button>
        <Button type="button" onClick={handlePrint} className="flex-1">
          {t("downloadPrint")}
        </Button>
      </div>
    </div>
  );
}
