import { CurrencyFormatter } from '@/utils/formatters/currency';
import { DateFormatter } from '@/utils/formatters/date';

describe('CurrencyFormatter', () => {
  describe('toString', () => {
    it('formats numbers to BRL by default', () => {
      const formatter = new CurrencyFormatter();
      const result = formatter.toString(1234.56);
      expect(result).toMatch(/1\.234,56/);
    });

    it('formats numbers to USD when configured', () => {
      const formatter = new CurrencyFormatter({ locale: 'en-US', currency: 'USD' });
      const result = formatter.toString(1234.56);
      expect(result).toMatch(/1,234\.56/);
      expect(result).toContain('$');
    });

    it('formats without currency symbol when showSymbol is false', () => {
      const formatter = new CurrencyFormatter({ locale: 'pt-BR', showSymbol: false });
      const result = formatter.toString(1234.56);
      expect(result).toBe('1.234,56');
    });

    it('handles null, undefined and empty values gracefully', () => {
      const formatter = new CurrencyFormatter();
      expect(formatter.toString(null)).toBe('');
      expect(formatter.toString(undefined)).toBe('');
      expect(formatter.toString('')).toBe('');
    });
  });

  describe('toValue', () => {
    it('parses formatted Brazilian currency string to number', () => {
      const formatter = CurrencyFormatter.BRL;
      expect(formatter.toValue('R$ 1.234,56')).toBe(1234.56);
      expect(formatter.toValue('1234,56')).toBe(1234.56);
      expect(formatter.toValue('100')).toBe(100);
    });

    it('parses formatted US currency string to number', () => {
      const formatter = CurrencyFormatter.USD;
      expect(formatter.toValue('$1,234.56')).toBe(1234.56);
      expect(formatter.toValue('1,234.56')).toBe(1234.56);
    });

    it('handles negative values correctly', () => {
      const formatter = CurrencyFormatter.BRL;
      expect(formatter.toValue('-R$ 50,00')).toBe(-50);
    });

    it('returns 0 for empty or invalid strings', () => {
      const formatter = CurrencyFormatter.BRL;
      expect(formatter.toValue('')).toBe(0);
      expect(formatter.toValue('abc')).toBe(0);
    });
  });
});

describe('DateFormatter', () => {
  describe('toString', () => {
    it('formats ISO string to pt-BR date format', () => {
      const formatter = DateFormatter.PT_BR;
      const formatted = formatter.toString('2026-09-07T00:00:00.000Z');
      expect(formatted).toMatch(/07\/09\/2026/);
    });

    it('formats Date object correctly', () => {
      const formatter = DateFormatter.PT_BR;
      const date = new Date(Date.UTC(2026, 8, 7)); // 2026-09-07
      const formatted = formatter.toString(date);
      expect(formatted).toMatch(/07\/09\/2026/);
    });

    it('returns empty string for invalid date', () => {
      const formatter = DateFormatter.PT_BR;
      expect(formatter.toString('')).toBe('');
      expect(formatter.toString('invalid-date')).toBe('');
    });
  });

  describe('toValue', () => {
    it('converts DD/MM/YYYY into ISO string', () => {
      const formatter = DateFormatter.PT_BR;
      const iso = formatter.toValue('07/09/2026');
      expect(iso).toContain('2026-09-07');
    });

    it('preserves valid ISO string', () => {
      const formatter = DateFormatter.PT_BR;
      const iso = formatter.toValue('2026-09-07T12:00:00.000Z');
      expect(iso).toBe('2026-09-07T12:00:00.000Z');
    });

    it('converts MM/DD/YYYY when locale is en-US', () => {
      const formatter = DateFormatter.EN_US;
      const iso = formatter.toValue('09/07/2026');
      expect(iso).toContain('2026-09-07');
    });

    it('returns empty string for invalid input', () => {
      const formatter = DateFormatter.PT_BR;
      expect(formatter.toValue('')).toBe('');
      expect(formatter.toValue('not-a-date')).toBe('');
    });
  });
});
