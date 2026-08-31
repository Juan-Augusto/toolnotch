import {
  validateJson,
  formatJson,
  minifyJson,
} from '@/lib/developer/jsonTools'

describe('lib/developer/jsonTools', () => {
  const sample = '{\n  "name": "ToolNotch",\n  "active": true,\n  "items": [1, 2, 3]\n}'

  describe('validateJson', () => {
    test('validates correct JSON and computes stats', () => {
      const res = validateJson(sample)
      expect(res.valid).toBe(true)
      expect(res.error).toBeNull()
      expect(res.stats).toBeDefined()
      expect(res.stats?.keyCount).toBe(3)
      expect(res.stats?.depth).toBe(3)
    })

    test('rejects empty input', () => {
      const res = validateJson('   ')
      expect(res.valid).toBe(false)
      expect(res.error?.message).toContain('vazio')
    })

    test('detects syntax error with line/position', () => {
      const badJson = '{\n  "name": "test",\n  "broken": \n}'
      const res = validateJson(badJson)
      expect(res.valid).toBe(false)
      expect(res.error).toBeDefined()
      expect(res.error?.message).toBeDefined()
    })
  })

  describe('formatJson', () => {
    test('formats compact JSON into 2-space indentation', () => {
      const compact = '{"a":1,"b":[2,3]}'
      const res = formatJson(compact, 2)
      expect(res.formatted).toBe('{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}')
      expect(res.error).toBeNull()
    })

    test('formats compact JSON into 4-space indentation', () => {
      const compact = '{"a":1}'
      const res = formatJson(compact, 4)
      expect(res.formatted).toBe('{\n    "a": 1\n}')
    })
  })

  describe('minifyJson', () => {
    test('minifies formatted JSON into a single line', () => {
      const formatted = '{\n  "name": "ToolNotch",\n  "count": 10\n}'
      const res = minifyJson(formatted)
      expect(res.minified).toBe('{"name":"ToolNotch","count":10}')
      expect(res.error).toBeNull()
    })
  })
})
