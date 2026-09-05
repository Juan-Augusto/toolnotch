import { encodeBase64, decodeBase64 } from '@/lib/developer/base64'

describe('lib/developer/base64', () => {
  describe('encodeBase64 & decodeBase64', () => {
    test('encodes and decodes standard ASCII text', () => {
      const original = 'Hello World!'
      const encoded = encodeBase64(original)
      expect(encoded.valid).toBe(true)
      expect(encoded.text).toBe('SGVsbG8gV29ybGQh')

      const decoded = decodeBase64(encoded.text)
      expect(decoded.valid).toBe(true)
      expect(decoded.text).toBe(original)
    })

    test('supports UTF-8 with accents and emojis', () => {
      const original = 'Olá, mundo! 🚀 Brasil — Acentuação & Símbolos'
      const encoded = encodeBase64(original)
      expect(encoded.valid).toBe(true)

      const decoded = decodeBase64(encoded.text)
      expect(decoded.valid).toBe(true)
      expect(decoded.text).toBe(original)
    })

    test('handles URL-Safe mode', () => {
      // String that produces + and /
      const original = 'subjects?_d=1&test=true>>>???'
      const encoded = encodeBase64(original, true)
      expect(encoded.text).not.toContain('+')
      expect(encoded.text).not.toContain('/')

      const decoded = decodeBase64(encoded.text, true)
      expect(decoded.valid).toBe(true)
      expect(decoded.text).toBe(original)
    })

    test('handles empty input gracefully', () => {
      expect(encodeBase64('').text).toBe('')
      expect(decodeBase64('').text).toBe('')
    })

    test('rejects invalid Base64 input', () => {
      const res = decodeBase64('???not-valid-base64???')
      expect(res.valid).toBe(false)
      expect(res.errorMessage).toBeDefined()
    })
  })
})
