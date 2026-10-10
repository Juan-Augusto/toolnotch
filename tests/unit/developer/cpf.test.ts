import {
  generateCpf,
  generateBulkCpf,
  validateCpf,
  formatCpf,
  cleanCpf,
} from '@/lib/developer/cpf'

describe('lib/developer/cpf', () => {
  describe('generateCpf & validateCpf', () => {
    test('generates valid formatted CPF', () => {
      const cpf = generateCpf(true)
      expect(cpf).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
      const validation = validateCpf(cpf)
      expect(validation.valid).toBe(true)
      expect(validation.formatted).toBe(cpf)
    })

    test('generates valid unformatted CPF', () => {
      const cpf = generateCpf(false)
      expect(cpf).toMatch(/^\d{11}$/)
      const validation = validateCpf(cpf)
      expect(validation.valid).toBe(true)
      expect(validation.clean).toBe(cpf)
    })

    test('generates CPF for specific fiscal region (SP = 8)', () => {
      const cpf = generateCpf(true, 8)
      const validation = validateCpf(cpf)
      expect(validation.valid).toBe(true)
      expect(validation.region?.code).toBe(8)
      expect(validation.region?.states).toContain('SP')
    })

    test('generates CPF for specific fiscal region (RS = 0)', () => {
      const cpf = generateCpf(false, 0)
      const validation = validateCpf(cpf)
      expect(validation.valid).toBe(true)
      expect(validation.region?.code).toBe(0)
      expect(validation.region?.states).toContain('RS')
    })
  })

  describe('generateBulkCpf', () => {
    test('generates requested count of valid CPFs', () => {
      const list = generateBulkCpf(5, true)
      expect(list).toHaveLength(5)
      list.forEach((cpf) => {
        expect(validateCpf(cpf).valid).toBe(true)
      })
    })

    test('caps count between 1 and 100', () => {
      expect(generateBulkCpf(0)).toHaveLength(1)
      expect(generateBulkCpf(150)).toHaveLength(100)
    })
  })

  describe('validateCpf edge cases', () => {
    test('rejects repeated digits (e.g. 111.111.111-11)', () => {
      expect(validateCpf('111.111.111-11').valid).toBe(false)
      expect(validateCpf('00000000000').valid).toBe(false)
    })

    test('rejects wrong length', () => {
      expect(validateCpf('123.456.789').valid).toBe(false)
      expect(validateCpf('123456789012').valid).toBe(false)
    })

    test('rejects invalid checksum digits', () => {
      expect(validateCpf('123.456.789-00').valid).toBe(false)
    })
  })

  describe('formatCpf & cleanCpf', () => {
    test('formats partial and full strings', () => {
      expect(formatCpf('12345678909')).toBe('123.456.789-09')
      expect(cleanCpf('123.456.789-09')).toBe('12345678909')
    })
  })
})
