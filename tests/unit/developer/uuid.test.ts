import {
  generateUuid,
  generateBulkUuid,
  inspectUuid,
  formatUuid,
} from '@/lib/developer/uuid'

describe('lib/developer/uuid', () => {
  describe('generateUuid versions', () => {
    test('generates valid UUID v4', () => {
      const uuid = generateUuid('v4')
      const inspection = inspectUuid(uuid)
      expect(inspection.valid).toBe(true)
      expect(inspection.version).toBe(4)
    })

    test('generates valid UUID v1', () => {
      const uuid = generateUuid('v1')
      const inspection = inspectUuid(uuid)
      expect(inspection.valid).toBe(true)
      expect(inspection.version).toBe(1)
      expect(inspection.timestampIso).toBeDefined()
    })

    test('generates valid UUID v7', () => {
      const uuid = generateUuid('v7')
      const inspection = inspectUuid(uuid)
      expect(inspection.valid).toBe(true)
      expect(inspection.version).toBe(7)
      expect(inspection.timestampIso).toBeDefined()
    })
  })

  describe('formatting options', () => {
    test('formats uppercase', () => {
      const uuid = generateUuid('v4', { uppercase: true })
      expect(uuid).toBe(uuid.toUpperCase())
    })

    test('formats without hyphens', () => {
      const uuid = generateUuid('v4', { hyphens: false })
      expect(uuid).not.toContain('-')
      expect(uuid).toHaveLength(32)
      // Inspector should recognize 32-char hex string
      expect(inspectUuid(uuid).valid).toBe(true)
    })

    test('formats with braces', () => {
      const uuid = generateUuid('v4', { braces: true })
      expect(uuid.startsWith('{')).toBe(true)
      expect(uuid.endsWith('}')).toBe(true)
      expect(inspectUuid(uuid).valid).toBe(true)
    })
  })

  describe('generateBulkUuid', () => {
    test('generates requested count', () => {
      const list = generateBulkUuid(10, 'v4')
      expect(list).toHaveLength(10)
      const set = new Set(list)
      expect(set.size).toBe(10)
    })
  })

  describe('inspectUuid', () => {
    test('inspects known UUIDs accurately', () => {
      const v4 = '550e8400-e29b-41d4-a716-446655440000'
      const res = inspectUuid(v4)
      expect(res.valid).toBe(true)
      expect(res.version).toBe(4)
      expect(res.variant).toContain('RFC 4122')
    })

    test('rejects malformed strings', () => {
      expect(inspectUuid('not-a-uuid').valid).toBe(false)
      expect(inspectUuid('550e8400-e29b-91d4-a716-446655440000').valid).toBe(false) // version 9 doesn't exist
    })
  })
})
