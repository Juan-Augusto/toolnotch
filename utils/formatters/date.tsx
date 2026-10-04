import type { Formatter } from "./types";

export interface DateFormatterOptions {
  /**
   * Código de idioma/localidade (ex: 'pt-BR', 'en-US'). Padrão: 'pt-BR'.
   */
  locale?: string;
  /**
   * Tipo de formatação para exibição. Padrão: 'date'.
   */
  format?: "date" | "datetime" | "iso";
  /**
   * Fuso horário opcional (ex: 'UTC', 'America/Sao_Paulo').
   */
  timeZone?: string;
}

export class DateFormatter implements Formatter<string> {
  readonly locale: string;
  readonly format: "date" | "datetime" | "iso";
  readonly timeZone?: string;

  constructor(options: DateFormatterOptions = {}) {
    this.locale = options.locale ?? "pt-BR";
    this.format = options.format ?? "date";
    this.timeZone = options.timeZone ?? "UTC";
  }

  /**
   * Converte uma Date, string ISO ou timestamp para formato legível de data.
   * @example
   * formatter.toString("2026-09-07T00:00:00.000Z") // "07/09/2026"
   * formatter.toString(new Date(2026, 8, 7)) // "07/09/2026"
   */
  toString(value: Date | string | number | null | undefined): string {
    if (!value) return "";

    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return "";

    if (this.format === "iso") {
      return date.toISOString().split("T")[0];
    }

    try {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: this.timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };

      if (this.format === "datetime") {
        options.hour = "2-digit";
        options.minute = "2-digit";
        options.second = "2-digit";
      }

      return new Intl.DateTimeFormat(this.locale, options).format(date);
    } catch {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${d}/${m}/${y}`;
    }
  }

  /**
   * Converte uma string de data formatada em uma string no padrão ISO (ISOString).
   * Suporta formatos DD/MM/YYYY, MM/DD/YYYY e YYYY-MM-DD.
   * @example
   * formatter.toValue("07/09/2026") // "2026-09-07T00:00:00.000Z"
   */
  toValue(formatted: string): string {
    if (!formatted || typeof formatted !== "string") return "";

    const trimmed = formatted.trim();
    if (!trimmed) return "";

    if (/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(trimmed)) {
      const parsed = new Date(trimmed);
      return isNaN(parsed.getTime()) ? "" : parsed.toISOString();
    }

    const match = trimmed.match(
      /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/,
    );
    if (!match) return "";

    const [, part1, part2, yearStr, hourStr, minStr, secStr] = match;
    const year = parseInt(yearStr, 10);
    const hour = hourStr ? parseInt(hourStr, 10) : 0;
    const minute = minStr ? parseInt(minStr, 10) : 0;
    const second = secStr ? parseInt(secStr, 10) : 0;

    let day: number;
    let month: number;

    if (this.locale.toLowerCase().startsWith("en")) {
      month = parseInt(part1, 10) - 1;
      day = parseInt(part2, 10);
    } else {
      day = parseInt(part1, 10);
      month = parseInt(part2, 10) - 1;
    }

    const utcDate = new Date(Date.UTC(year, month, day, hour, minute, second));
    if (isNaN(utcDate.getTime())) return "";

    return utcDate.toISOString();
  }

  static PT_BR = new DateFormatter({ locale: "pt-BR" });
  static EN_US = new DateFormatter({ locale: "en-US" });
  static ISO = new DateFormatter({ format: "iso" });
}

export default DateFormatter;
