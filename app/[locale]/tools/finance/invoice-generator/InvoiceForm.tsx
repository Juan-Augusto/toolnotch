"use client";

import React, { useMemo } from "react";
import { Trash2, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { InvoiceData } from "@/lib/invoiceTypes";
import { INVOICE_CURRENCIES } from "@/data/invoiceCurrencies";
import { LOCALE_CONFIGS, LocaleKey } from "@/data/invoiceLocales";
import AppButton from "@/components/AppButton";
import { AppInput, AppSelect, AppTextarea } from "@/components/ui/form";
import { formatAmount } from "@/lib/invoiceCalc";

interface InvoiceFormProps {
  invoice: InvoiceData;
  update: <K extends keyof InvoiceData>(
    field: K,
    value: InvoiceData[K],
  ) => void;
  updateLineItem: (id: string, field: string, value: string | number) => void;
  addLineItem: () => void;
  removeLineItem: (id: string) => void;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogoClick: () => void;
  handleRemoveLogo: () => void;
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
  handleRemoveLogo,
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

  const currencyOptions = useMemo(
    () =>
      INVOICE_CURRENCIES.map((c) => ({
        value: c.code,
        label: `${c.code} — ${c.name}`,
      })),
    [],
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* From & Bill To Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* From */}
        <section className="bg-tertiary border border-border rounded-[2px] p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground mb-3">
              {t("from")}
            </h3>
            <div className="space-y-2.5">
              <div className="flex gap-2 items-end">
                <AppInput
                  placeholder={t("nameCompanyPlaceholder")}
                  value={invoice.from.name}
                  onChange={(e) =>
                    update("from", { ...invoice.from, name: e.target.value })
                  }
                  variant="background"
                  className="font-mono text-xs sm:text-sm"
                  containerClassName="flex-1 min-w-0"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  ref={logoInputRef}
                  id="logo-upload"
                />
                {invoice.logo ? (
                  <div className="flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-3 h-10 sm:h-12 border border-border bg-background rounded-[2px] shrink-0 max-w-[180px] sm:max-w-[220px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={invoice.logo}
                      alt="Logo"
                      className="h-6 w-6 sm:h-6.5 sm:w-6.5 object-contain rounded-[2px] shrink-0 cursor-pointer hover:opacity-80 bg-tertiary border border-border p-0.5"
                      onClick={handleLogoClick}
                      title={t("changeLogo")}
                    />
                    <span
                      className="font-mono text-xs sm:text-sm font-medium text-foreground truncate flex-1 min-w-0 cursor-pointer hover:underline"
                      onClick={handleLogoClick}
                      title={invoice.logoFileName || t("changeLogo")}
                    >
                      {invoice.logoFileName || "Logo"}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="text-label hover:text-red-500 hover:bg-red-500/10 transition-colors p-1 rounded-[2px] shrink-0 cursor-pointer"
                      title={t("removeLogo")}
                      aria-label={t("removeLogo")}
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                ) : (
                  <AppButton
                    type="button"
                    onClick={handleLogoClick}
                    color="tertiary"
                    className="!w-auto h-10 sm:h-12 px-3.5 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold shrink-0 flex items-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground/70" />
                    <span>{t("logoButton")}</span>
                  </AppButton>
                )}
              </div>
              <AppInput
                placeholder={t("emailPlaceholder")}
                type="email"
                value={invoice.from.email}
                onChange={(e) =>
                  update("from", { ...invoice.from, email: e.target.value })
                }
                variant="background"
                className="font-mono text-xs sm:text-sm"
              />
              <AppTextarea
                placeholder={t("addressPlaceholder")}
                rows={2}
                value={invoice.from.address}
                onChange={(e) =>
                  update("from", { ...invoice.from, address: e.target.value })
                }
                variant="background"
                className="font-mono text-xs sm:text-sm resize-none"
              />
            </div>
          </div>
        </section>

        {/* To */}
        <section className="bg-tertiary border border-border rounded-[2px] p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground mb-3">
              {t("billTo")}
            </h3>
            <div className="space-y-2.5">
              <AppInput
                placeholder={t("clientNamePlaceholder")}
                value={invoice.to.name}
                onChange={(e) =>
                  update("to", { ...invoice.to, name: e.target.value })
                }
                variant="background"
                className="font-mono text-xs sm:text-sm"
              />
              <AppInput
                placeholder={t("clientEmailPlaceholder")}
                type="email"
                value={invoice.to.email}
                onChange={(e) =>
                  update("to", { ...invoice.to, email: e.target.value })
                }
                variant="background"
                className="font-mono text-xs sm:text-sm"
              />
              <AppTextarea
                placeholder={t("clientAddressPlaceholder")}
                rows={2}
                value={invoice.to.address}
                onChange={(e) =>
                  update("to", { ...invoice.to, address: e.target.value })
                }
                variant="background"
                className="font-mono text-xs sm:text-sm resize-none"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Meta */}
      <section className="bg-tertiary border border-border rounded-[2px] p-4 sm:p-5">
        <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground mb-3">
          {t("invoiceDetails")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <AppInput
              label={t("invoiceNumber")}
              labelClassName="font-mono text-xs font-bold uppercase text-foreground mb-1.5"
              value={invoice.number}
              onChange={(e) => update("number", e.target.value)}
              variant="background"
              className="font-mono text-xs sm:text-sm"
            />
          </div>
          <div>
            <AppSelect
              label={t("currency")}
              labelClassName="font-mono text-xs font-bold uppercase text-foreground mb-1.5"
              value={invoice.currency}
              onChange={(val) => update("currency", val)}
              options={currencyOptions}
              variant="background"
              dropdownClassName="min-w-[260px] sm:min-w-[300px]"
              searchable
            />
          </div>
          <div>
            <AppInput
              type="date"
              label={t("date")}
              labelClassName="font-mono text-xs font-bold uppercase text-foreground mb-1.5"
              value={invoice.date}
              onChange={(e) => update("date", e.target.value)}
              variant="background"
              className="font-mono text-xs sm:text-sm"
            />
          </div>
          <div>
            <AppInput
              type="date"
              label={t("dueDate")}
              labelClassName="font-mono text-xs font-bold uppercase text-foreground mb-1.5"
              value={invoice.dueDate}
              onChange={(e) => update("dueDate", e.target.value)}
              variant="background"
              className="font-mono text-xs sm:text-sm"
            />
          </div>
        </div>
      </section>

      {/* Line Items */}
      <section className="bg-tertiary border border-border rounded-[2px] p-4 sm:p-5">
        <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground mb-3">
          {t("lineItems")}
        </h3>

        <div className="space-y-3 md:space-y-2.5">
          {/* Header labels - Desktop only */}
          <div className="hidden md:flex gap-2 text-xs font-mono font-semibold uppercase text-label px-0.5 select-none no-print">
            <span className="flex-1 min-w-0">{t("descriptionPlaceholder")}</span>
            <span className="w-24 text-center shrink-0">{t("qty")}</span>
            <span className="w-28 text-right shrink-0">{t("rate")}</span>
            <span className="w-32 text-right shrink-0">{t("amount")}</span>
            <span className="w-8 shrink-0"></span>
          </div>

          {invoice.lineItems.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-background/50 border border-border rounded-[2px] space-y-2.5 md:space-y-0 md:p-0 md:bg-transparent md:border-0 md:flex md:gap-2 md:items-center"
            >
              {/* Description */}
              <AppInput
                placeholder={t("descriptionPlaceholder")}
                value={item.description}
                onChange={(e) =>
                  updateLineItem(item.id, "description", e.target.value)
                }
                variant="background"
                className="font-mono text-xs sm:text-sm"
                containerClassName="w-full md:flex-1 md:min-w-0"
              />

              {/* Row 2 on Mobile: Qty & Rate (flattens into desktop row with md:contents) */}
              <div className="flex gap-2 items-end md:contents">
                {/* Quantity */}
                <div className="flex-1 min-w-0 md:flex-none md:w-24 md:shrink-0">
                  <span className="block text-[11px] font-mono font-bold uppercase text-label mb-1.5 md:hidden">
                    {t("qty")}
                  </span>
                  <AppInput
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
                    variant="background"
                    className="font-mono text-xs sm:text-sm text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none !px-2"
                  />
                </div>

                {/* Rate */}
                <div className="flex-1 min-w-0 md:flex-none md:w-28 md:shrink-0">
                  <span className="block text-[11px] font-mono font-bold uppercase text-label mb-1.5 md:hidden">
                    {t("rate")}
                  </span>
                  <AppInput
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
                    variant="background"
                    className="font-mono text-xs sm:text-sm text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none !px-2.5"
                  />
                </div>
              </div>

              {/* Row 3 on Mobile: Total & Delete (flattens into desktop row with md:contents) */}
              <div className="flex gap-2 items-end md:contents">
                {/* Amount / Total */}
                <div className="flex-1 min-w-0 md:flex-none md:w-32 md:shrink-0">
                  <span className="block text-[11px] font-mono font-bold uppercase text-label mb-1.5 md:hidden">
                    {t("amount")}
                  </span>
                  <div
                    title={fmt(item.amount)}
                    className="w-full h-10 sm:h-12 flex items-center justify-end px-3.5 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-[2px] text-xs sm:text-sm text-right font-mono text-foreground font-medium overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {fmt(item.amount)}
                  </div>
                </div>

                {/* Delete button */}
                <div className="w-9 h-10 sm:h-12 flex items-center justify-center shrink-0 md:w-8">
                  {invoice.lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.id)}
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-label hover:text-red-500 hover:bg-red-500/10 rounded-[2px] transition-colors cursor-pointer"
                      title={t("removeItem") || "Remove item"}
                      aria-label={t("removeItem") || "Remove item"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <button
              type="button"
              onClick={addLineItem}
              className="text-xs sm:text-sm font-mono font-medium text-secondary hover:underline cursor-pointer transition-colors"
            >
              {t("addItem")}
            </button>
          </div>
        </div>
      </section>

      {/* Totals */}
      <section className="bg-tertiary border border-border rounded-[2px] p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <AppInput
              label={t("discount")}
              labelClassName="font-mono text-xs font-bold uppercase text-foreground mb-1.5"
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
              variant="background"
              className="font-mono text-xs sm:text-sm"
            />
          </div>
          <div>
            <AppInput
              label={`${taxLabel} %`}
              labelClassName="font-mono text-xs font-bold uppercase text-foreground mb-1.5"
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
              variant="background"
              className="font-mono text-xs sm:text-sm"
            />
          </div>
        </div>
      </section>

      {/* Notes / Terms */}
      <section className="bg-tertiary border border-border rounded-[2px] p-4 sm:p-5">
        <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground mb-3">
          {t("notesTerms")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <AppTextarea
              label={t("notesLabel") || "Notes"}
              labelClassName="font-mono text-xs font-bold uppercase text-foreground mb-1.5"
              placeholder={t("notesPlaceholder")}
              rows={3}
              value={invoice.notes}
              onChange={(e) => update("notes", e.target.value)}
              variant="background"
              className="font-mono text-xs sm:text-sm resize-none"
            />
          </div>
          <div>
            <AppTextarea
              label={t("termsPlaceholder") || "Terms"}
              labelClassName="font-mono text-xs font-bold uppercase text-foreground mb-1.5"
              placeholder={t("termsPlaceholder")}
              rows={3}
              value={invoice.terms}
              onChange={(e) => update("terms", e.target.value)}
              variant="background"
              className="font-mono text-xs sm:text-sm resize-none"
            />
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <AppButton
          type="button"
          onClick={clearInvoice}
          color="tertiary"
          className="flex-1"
        >
          {t("clear")}
        </AppButton>
        <AppButton
          type="button"
          onClick={handlePrint}
          color="primary"
          className="flex-1"
        >
          {t("downloadPrint")}
        </AppButton>
      </div>
    </div>
  );
}
