"use client";

import { useTranslations } from "next-intl";
import { InvoiceData, InvoiceTotals } from "@/lib/invoiceTypes";
import { LOCALE_CONFIGS, LocaleKey } from "@/data/invoiceLocales";
import { formatAmount } from "@/lib/invoiceCalc";

interface InvoicePreviewProps {
  invoice: InvoiceData;
  totals: InvoiceTotals;
  locale?: string;
}

export default function InvoicePreview({
  invoice,
  totals,
  locale,
}: InvoicePreviewProps) {
  const t = useTranslations("finance.invoiceGenerator.ui");
  const taxLabel = locale
    ? LOCALE_CONFIGS[locale as LocaleKey]?.taxLabel || t("taxLabel")
    : t("taxLabel");

  const fmt = (v: number) => formatAmount(v, invoice.currency);

  return (
    <div className="invoice-preview bg-card border border-bd-base rounded-xl p-8 text-sm">
      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          {invoice.logo ? (
            <img
              src={invoice.logo}
              alt="Logo"
              className="max-h-16 max-w-[200px] object-contain mb-4"
            />
          ) : null}
          <div className="font-bold text-xl ">{t("invoiceTitle")}</div>
          <div>#{invoice.number}</div>
        </div>
        <div className="text-right text-xs space-y-1">
          {invoice.from.name && (
            <div className="font-semibold">{invoice.from.name}</div>
          )}
          {invoice.from.email && <div>{invoice.from.email}</div>}
          {invoice.from.address && (
            <div className="whitespace-pre-wrap max-w-xs ml-auto">
              {invoice.from.address}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8 border-t border-bd-base pt-6">
        <div>
          <div className="text-xs font-semibold uppercase mb-2">
            {t("billTo")}
          </div>
          <div className="text-xs space-y-1">
            {invoice.to.name && (
              <div className="font-semibold">{invoice.to.name}</div>
            )}
            {invoice.to.email && <div>{invoice.to.email}</div>}
            {invoice.to.address && (
              <div className="whitespace-pre-wrap max-w-xs">
                {invoice.to.address}
              </div>
            )}
          </div>
        </div>
        <div className="text-right text-xs space-y-2">
          <div className="flex justify-between md:justify-end gap-4">
            <span className="font-semibold uppercase">{t("date")}:</span>
            <span>{invoice.date}</span>
          </div>
          {invoice.dueDate && (
            <div className="flex justify-between md:justify-end gap-4">
              <span className="font-semibold uppercase">{t("dueDate")}:</span>
              <span>{invoice.dueDate}</span>
            </div>
          )}
        </div>
      </div>

      <table className="w-full text-left border-collapse mb-8">
        <thead>
          <tr className="border-b text-xs font-semibold uppercase">
            <th className="py-2 pr-2">{t("descriptionPlaceholder")}</th>
            <th className="py-2 px-2 text-center w-20">{t("qty")}</th>
            <th className="py-2 px-2 text-right w-32">{t("rate")}</th>
            <th className="py-2 pl-2 text-right w-40">{t("amount")}</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item) => (
            <tr key={item.id} className="border-b border-bd-base text-xs">
              <td className="py-2 pr-2 font-medium break-all">
                {item.description || `—`}
              </td>
              <td className="py-2 px-2 text-center break-all">
                {item.quantity}
              </td>
              <td className="py-2 px-2 text-right break-all">
                {fmt(item.rate)}
              </td>
              <td className="py-2 pl-2 text-right font-medium break-all">
                {fmt(item.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ml-auto w-80 text-xs space-y-1">
        <div className="flex justify-between gap-4">
          <span className="shrink-0">{t("subtotal")}</span>
          <span className="text-right font-medium break-all">
            {fmt(totals.subtotal)}
          </span>
        </div>
        {totals.discountAmount > 0 && (
          <div className="flex justify-between gap-4">
            <span className="shrink-0">{t("discountLabel")}</span>
            <span className="text-red-500 text-right font-medium break-all">
              -{fmt(totals.discountAmount)}
            </span>
          </div>
        )}
        {totals.taxAmount > 0 && (
          <div className="flex justify-between gap-4">
            <span className="shrink-0">
              {taxLabel} ({invoice.tax}%)
            </span>
            <span className="text-right font-medium break-all">
              {fmt(totals.taxAmount)}
            </span>
          </div>
        )}
        <div className="flex justify-between gap-4 border-t border-bd-base pt-2 text-sm font-bold">
          <span className="shrink-0">{t("total")}</span>
          <span className="text-right break-all">{fmt(totals.total)}</span>
        </div>
      </div>

      <div className="mt-12 border-t border-t-bd-base pt-6">
        {invoice.notes && (
          <div className="mb-4">
            <div className="text-xs font-semibold uppercase mb-1">
              {t("notesTerms")}
            </div>
            <div className="text-xs">{invoice.notes}</div>
          </div>
        )}
        {invoice.terms && <div className="mt-2 text-xs">{invoice.terms}</div>}
      </div>
    </div>
  );
}
