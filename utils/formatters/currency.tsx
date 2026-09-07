import type { Formatter } from "./types";

export interface CurrencyFormatterOptions {
  /**
   * Código de idioma/localidade (ex: 'pt-BR', 'en-US', 'de-DE'). Padrão: 'pt-BR'.
   */
  locale?: string;
  /**
   * Código ISO 4217 da moeda (ex: 'BRL', 'USD', 'EUR'). Padrão: 'BRL'.
   */
  currency?: string;
  /**
   * Número de casas decimais. Padrão: 2.
   */
  precision?: number;
  /**
   * Se deve incluir o símbolo da moeda na formatação. Padrão: true.
   */
  showSymbol?: boolean;
}

export class CurrencyFormatter implements Formatter<number> {
  readonly locale: string;
  readonly currency: string;
  readonly precision: number;
  readonly showSymbol: boolean;

  constructor(options: CurrencyFormatterOptions = {}) {
    this.locale = options.locale ?? "pt-BR";
    this.currency = options.currency ?? "BRL";
    this.precision = options.precision ?? 2;
    this.showSymbol = options.showSymbol ?? true;
  }

  /**
   * Converte um número ou representação numérica para formato monetário.
   * @example
   * formatter.toString(1234.56) // "R$ 1.234,56"
   */
  toString(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === "") {
      return "";
    }

    const num = typeof value === "number" ? value : this.toValue(String(value));
    if (isNaN(num)) {
      return "";
    }

    try {
      if (this.showSymbol) {
        return new Intl.NumberFormat(this.locale, {
          style: "currency",
          currency: this.currency,
          minimumFractionDigits: this.precision,
          maximumFractionDigits: this.precision,
        }).format(num);
      }

      return new Intl.NumberFormat(this.locale, {
        style: "decimal",
        minimumFractionDigits: this.precision,
        maximumFractionDigits: this.precision,
      }).format(num);
    } catch {
      return num.toFixed(this.precision);
    }
  }

  /**
   * Extrai o valor numérico puro de uma string formatada em moeda.
   * @example
   * formatter.toValue("R$ 1.234,56") // 1234.56
   * formatter.toValue("$1,234.56") // 1234.56
   */
  toValue(formatted: string): number {
    if (!formatted || typeof formatted !== "string") {
      return 0;
    }

    const sanitized = formatted.trim();
    if (!sanitized) return 0;

    const isNegative = sanitized.includes("-");

    const hasComma = sanitized.includes(",");
    const hasDot = sanitized.includes(".");

    let cleanNumber = sanitized.replace(/[^0-9.,]/g, "");

    if (hasComma && hasDot) {
      const lastComma = sanitized.lastIndexOf(",");
      const lastDot = sanitized.lastIndexOf(".");

      if (lastComma > lastDot) {
        // Vírgula é decimal (pt-BR)
        cleanNumber = cleanNumber.replace(/\./g, "").replace(",", ".");
      } else {
        // Ponto é decimal (en-US)
        cleanNumber = cleanNumber.replace(/,/g, "");
      }
    } else if (hasComma) {
      // Apenas vírgula presente
      cleanNumber = cleanNumber.replace(",", ".");
    }

    const result = parseFloat(cleanNumber);
    if (isNaN(result)) return 0;

    return isNegative ? -Math.abs(result) : Math.abs(result);
  }

  static BRL = new CurrencyFormatter({ locale: "pt-BR", currency: "BRL" });
  static USD = new CurrencyFormatter({ locale: "en-US", currency: "USD" });
  static EUR = new CurrencyFormatter({ locale: "de-DE", currency: "EUR" });
}

export default CurrencyFormatter;
