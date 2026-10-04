export interface Formatter<T = any> {
  /**
   * Converte o valor bruto em uma string formatada para exibição no input.
   */
  toString(value: T | null | undefined): string;

  /**
   * Converte a string formatada de volta para o valor bruto tipado (number, ISOString, etc.).
   */
  toValue(formatted: string): T;
}
