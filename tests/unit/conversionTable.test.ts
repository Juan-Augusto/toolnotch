import {
  CONVERSION_TABLE_VALUES,
  buildConversionRows,
} from '@/lib/conversionTable'
import { COMMON_PAIRS } from '@/data/conversionPairs'
import { PRIORITY_PAIR_SLUGS } from '@/data/conversionPairContent'
import { convert } from '@/lib/units'
import { UnitCategory } from '@/lib/unitTypes'

describe('buildConversionRows — shape', () => {
  it('emits one row per reference value, in order', () => {
    const rows = buildConversionRows('inch', 'centimeter', 'length')
    expect(rows).toHaveLength(CONVERSION_TABLE_VALUES.length)
    expect(rows.map(r => r.from)).toEqual([1, 2, 5, 10, 20, 50, 100])
  })

  it('accepts a custom set of reference values', () => {
    const rows = buildConversionRows('foot', 'inch', 'length', [3, 7])
    expect(rows).toEqual([
      { from: 3, to: '36' },
      { from: 7, to: '84' },
    ])
  })
})

// ---------------------------------------------------------------------------
// Exact numbers for the priority pairs. These are the figures a reader will
// copy off the page, so they are asserted literally rather than derived.
// ---------------------------------------------------------------------------

describe('buildConversionRows — exact values for priority pairs', () => {
  const cases: { slug: string; from: string; to: string; category: UnitCategory; expected: string[] }[] = [
    {
      slug: 'inches-to-centimeters',
      from: 'inch',
      to: 'centimeter',
      category: 'length',
      expected: ['2.54', '5.08', '12.7', '25.4', '50.8', '127', '254'],
    },
    {
      slug: 'feet-to-inches',
      from: 'foot',
      to: 'inch',
      category: 'length',
      expected: ['12', '24', '60', '120', '240', '600', '1200'],
    },
    {
      slug: 'miles-to-feet',
      from: 'mile',
      to: 'foot',
      category: 'length',
      expected: ['5280', '10560', '26400', '52800', '105600', '264000', '528000'],
    },
    {
      slug: 'minutes-to-seconds',
      from: 'minute',
      to: 'second',
      category: 'time',
      expected: ['60', '120', '300', '600', '1200', '3000', '6000'],
    },
    {
      slug: 'stones-to-pounds',
      from: 'stone',
      to: 'pound',
      category: 'weight',
      expected: ['14', '28', '70', '140', '280', '700', '1400'],
    },
    {
      slug: 'years-to-days',
      from: 'year',
      to: 'day',
      category: 'time',
      expected: ['365.25', '730.5', '1826.25', '3652.5', '7305', '18262.5', '36525'],
    },
    {
      slug: 'miles-to-kilometers',
      from: 'mile',
      to: 'kilometer',
      category: 'length',
      expected: ['1.609344', '3.218688', '8.04672', '16.09344', '32.18688', '80.4672', '160.9344'],
    },
  ]

  for (const { slug, from, to, category, expected } of cases) {
    it(`${slug} produces the documented values`, () => {
      expect(buildConversionRows(from, to, category).map(r => r.to)).toEqual(expected)
    })
  }

  it('1 mph = 0.44704 m/s', () => {
    expect(buildConversionRows('mile per hour', 'meter per second', 'speed')[0].to).toBe('0.44704')
  })

  it('1 psi = 0.06894757 bar', () => {
    expect(buildConversionRows('psi', 'bar', 'pressure')[0].to).toBe('0.06894757')
  })

  it('1 cm = 0.39370079 in', () => {
    expect(buildConversionRows('centimeter', 'inch', 'length')[0].to).toBe('0.39370079')
  })

  it('1 km = 0.62137119 mi', () => {
    expect(buildConversionRows('kilometer', 'mile', 'length')[0].to).toBe('0.62137119')
  })
})

// ---------------------------------------------------------------------------
// The table must never disagree with the live widget on the same page.
// ---------------------------------------------------------------------------

describe('buildConversionRows — agrees with convert() for every priority pair', () => {
  for (const slug of PRIORITY_PAIR_SLUGS) {
    const pair = COMMON_PAIRS.find(p => p.slug === slug)!

    it(`${slug} rows match convert() output`, () => {
      expect(pair).toBeDefined()
      const rows = buildConversionRows(pair.from, pair.to, pair.category)
      for (const row of rows) {
        const raw = convert(row.from, pair.from, pair.to, pair.category)
        expect(parseFloat(row.to)).toBeCloseTo(raw, 6)
      }
    })
  }
})

describe('every priority slug exists in COMMON_PAIRS', () => {
  for (const slug of PRIORITY_PAIR_SLUGS) {
    it(`${slug} is a real pair`, () => {
      expect(COMMON_PAIRS.some(p => p.slug === slug)).toBe(true)
    })
  }
})
