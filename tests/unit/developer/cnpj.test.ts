import {
  generateCnpj,
  generateBulkCnpj,
  validateCnpj,
  formatCnpj,
  cleanCnpj,
} from '@/lib/developer/cnpj'

describe('lib/developer/cnpj', () => {
  describe('generateCnpj & validateCnpj', () => {
    test('generates valid headquarters CNPJ (0001)', () => {
      const cnpj = generateCnpj(true, false)
      expect(cnpj).toMatch(/^\d{2}\.\d{3}\.\d{3}\/0001-\d{2}$/)
      const validation = validateCnpj(cnpj)
      expect(validation.valid).toBe(true)
      expect(validation.formatted).toBe(cnpj)
    })

    test('generates valid branch CNPJ', () => {
      const cnpj = generateCnpj(false, true)
      expect(cnpj).toMatch(/^\d{14}$/)
      const validation = validateCnpj(cnpj)
      expect(validation.valid).toBe(true)
    })
  })

  describe('generateBulkCnpj', () => {
    test('generates requested number of valid CNPJs', () => {
      const list = generateBulkCnpj(5, true)
      expect(list).toHaveLength(5)
      list.forEach((cnpj) => {
        expect(validateCnpj(cnpj).valid).toBe(true)
      })
    })
  })

  describe('validateCnpj real samples and edge cases', () => {
    test('validates known real Brazilian CNPJs', () => {
      // Banco do Brasil: 00.000.000/0001-91
      expect(validateCnpj('00.000.000/0001-91').valid).toBe(true)
      // Petrobras: 33.000.167/0001-01
      expect(validateCnpj('33.000.167/0001-01').valid).toBe(true)
      // Google: 06.990.590/0001-23
      expect(validateCnpj('06.990.590/0001-23').valid).toBe(true)
    })

    test('rejects repeated digits', () => {
      expect(validateCnpj('11.111.111/1111-11').valid).toBe(false)
      expect(validateCnpj('00000000000000').valid).toBe(false)
    })

    test('rejects invalid check digits', () => {
      expect(validateCnpj('00.000.000/0001-00').valid).toBe(false)
      expect(validateCnpj('12345678000199').valid).toBe(false)
    })

    test('rejects wrong length', () => {
      expect(validateCnpj('123456780001').valid).toBe(false)
    })
  })

  describe('formatCnpj & cleanCnpj', () => {
    test('formats partial and full strings', () => {
      expect(formatCnpj('00000000000191')).toBe('00.000.000/0001-91')
      expect(cleanCnpj('00.000.000/0001-91')).toBe('00000000000191')
    })
  })
})
