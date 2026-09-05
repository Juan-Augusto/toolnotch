import en from '@/messages/en.json'
import pt from '@/messages/pt.json'
import es from '@/messages/es.json'

/**
 * WS-5 i18n consolidation guard.
 *
 * Batch 1 agents (WS-1..4) appended keys to the three message files in
 * parallel. This test is the standing check that `messages/en.json`,
 * `messages/pt.json` and `messages/es.json` carry the *exact same* set of
 * keys (deep). A key present in one file but not another is a runtime
 * missing-translation fallback to English — which WS-5 forbids.
 *
 * Per-pair conversion prose deliberately does NOT live in the message files
 * (see `data/conversionPairContent.ts` — the data-model path chosen as the
 * single source). Only shared UI chrome stays in `messages/*.json`, so the
 * three files must stay key-identical.
 */

type Json = string | number | boolean | null | Json[] | { [k: string]: Json }

function flattenKeys(value: Json, prefix = ''): string[] {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix]
  }
  const out: string[] = []
  for (const key of Object.keys(value)) {
    const next = prefix ? `${prefix}.${key}` : key
    out.push(...flattenKeys((value as { [k: string]: Json })[key], next))
  }
  return out
}

const enKeys = new Set(flattenKeys(en as Json))
const ptKeys = new Set(flattenKeys(pt as Json))
const esKeys = new Set(flattenKeys(es as Json))

function missing(reference: Set<string>, candidate: Set<string>): string[] {
  return [...reference].filter((k) => !candidate.has(k)).sort()
}

describe('messages key parity (en / pt / es)', () => {
  it('pt.json has every key en.json has', () => {
    expect(missing(enKeys, ptKeys)).toEqual([])
  })

  it('en.json has every key pt.json has', () => {
    expect(missing(ptKeys, enKeys)).toEqual([])
  })

  it('es.json has every key en.json has', () => {
    expect(missing(enKeys, esKeys)).toEqual([])
  })

  it('en.json has every key es.json has', () => {
    expect(missing(esKeys, enKeys)).toEqual([])
  })

  it('all three files have an identical key count', () => {
    expect({ pt: ptKeys.size, es: esKeys.size }).toEqual({
      pt: enKeys.size,
      es: enKeys.size,
    })
  })
})
