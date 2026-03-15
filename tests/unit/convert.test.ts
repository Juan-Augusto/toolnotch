import { convert, formatResult } from '@/lib/units'
import { convertTemperature } from '@/lib/temperature'
import { UNITS } from '@/data/units'
import { UnitCategory } from '@/lib/unitTypes'

// ---------------------------------------------------------------------------
// convert() — factor-based categories
// ---------------------------------------------------------------------------

describe('convert() — length', () => {
  it('converts 1 meter to feet ≈ 3.28084', () => {
    expect(convert(1, 'meter', 'foot', 'length')).toBeCloseTo(3.28084, 4)
  })

  it('converts 1 kilometer to miles ≈ 0.621371', () => {
    expect(convert(1, 'kilometer', 'mile', 'length')).toBeCloseTo(0.621371, 4)
  })

  it('converts 1 inch to centimeters ≈ 2.54', () => {
    expect(convert(1, 'inch', 'centimeter', 'length')).toBeCloseTo(2.54, 5)
  })

  it('round-trips meter → foot → meter', () => {
    const original = 42
    const there = convert(original, 'meter', 'foot', 'length')
    const back = convert(there, 'foot', 'meter', 'length')
    expect(back).toBeCloseTo(original, 8)
  })

  it('same unit returns original value', () => {
    expect(convert(7, 'meter', 'meter', 'length')).toBe(7)
  })
})

describe('convert() — weight', () => {
  it('converts 1 kilogram to pounds ≈ 2.20462', () => {
    expect(convert(1, 'kilogram', 'pound', 'weight')).toBeCloseTo(2.20462, 4)
  })

  it('converts 1 pound to kilograms ≈ 0.453592', () => {
    expect(convert(1, 'pound', 'kilogram', 'weight')).toBeCloseTo(0.453592, 4)
  })

  it('round-trips kilogram → pound → kilogram', () => {
    const original = 100
    const there = convert(original, 'kilogram', 'pound', 'weight')
    const back = convert(there, 'pound', 'kilogram', 'weight')
    expect(back).toBeCloseTo(original, 8)
  })
})

describe('convert() — area', () => {
  it('converts 1 square meter to square feet ≈ 10.7639', () => {
    expect(convert(1, 'square meter', 'square foot', 'area')).toBeCloseTo(10.7639, 3)
  })

  it('round-trips hectare → acre → hectare', () => {
    const original = 5
    const there = convert(original, 'hectare', 'acre', 'area')
    const back = convert(there, 'acre', 'hectare', 'area')
    expect(back).toBeCloseTo(original, 8)
  })
})

describe('convert() — volume', () => {
  it('converts 1 liter to US gallons ≈ 0.264172', () => {
    expect(convert(1, 'liter', 'gallon (US)', 'volume')).toBeCloseTo(0.264172, 4)
  })

  it('round-trips liter → milliliter → liter', () => {
    const original = 2.5
    const there = convert(original, 'liter', 'milliliter', 'volume')
    const back = convert(there, 'milliliter', 'liter', 'volume')
    expect(back).toBeCloseTo(original, 8)
  })
})

describe('convert() — speed', () => {
  it('converts 1 mile per hour to km/h ≈ 1.60934', () => {
    expect(convert(1, 'mile per hour', 'kilometer per hour', 'speed')).toBeCloseTo(1.60934, 4)
  })

  it('round-trips meter per second → km/h → meter per second', () => {
    const original = 10
    const there = convert(original, 'meter per second', 'kilometer per hour', 'speed')
    const back = convert(there, 'kilometer per hour', 'meter per second', 'speed')
    expect(back).toBeCloseTo(original, 6)
  })
})

describe('convert() — time', () => {
  it('converts 1 hour to seconds = 3600', () => {
    expect(convert(1, 'hour', 'second', 'time')).toBeCloseTo(3600, 5)
  })

  it('converts 1 day to hours = 24', () => {
    expect(convert(1, 'day', 'hour', 'time')).toBeCloseTo(24, 5)
  })

  it('round-trips year → day → year', () => {
    const original = 2
    const there = convert(original, 'year', 'day', 'time')
    const back = convert(there, 'day', 'year', 'time')
    expect(back).toBeCloseTo(original, 8)
  })
})

describe('convert() — digital-storage', () => {
  it('converts 1 gigabyte to megabytes = 1024', () => {
    expect(convert(1, 'gigabyte', 'megabyte', 'digital-storage')).toBeCloseTo(1024, 5)
  })

  it('converts 8 bits to 1 byte', () => {
    expect(convert(8, 'bit', 'byte', 'digital-storage')).toBeCloseTo(1, 8)
  })

  it('round-trips gigabyte → terabyte → gigabyte', () => {
    const original = 512
    const there = convert(original, 'gigabyte', 'terabyte', 'digital-storage')
    const back = convert(there, 'terabyte', 'gigabyte', 'digital-storage')
    expect(back).toBeCloseTo(original, 8)
  })
})

describe('convert() — pressure', () => {
  it('converts 1 atmosphere to pascals = 101325', () => {
    expect(convert(1, 'atmosphere', 'pascal', 'pressure')).toBeCloseTo(101325, 2)
  })

  it('round-trips psi → bar → psi', () => {
    const original = 30
    const there = convert(original, 'psi', 'bar', 'pressure')
    const back = convert(there, 'bar', 'psi', 'pressure')
    expect(back).toBeCloseTo(original, 6)
  })
})

// ---------------------------------------------------------------------------
// convert() — temperature (delegates to convertTemperature)
// ---------------------------------------------------------------------------

describe('convert() — temperature (via convert())', () => {
  it('converts 100°C to 212°F', () => {
    expect(convert(100, 'celsius', 'fahrenheit', 'temperature')).toBeCloseTo(212, 8)
  })

  it('converts 32°F to 0°C', () => {
    expect(convert(32, 'fahrenheit', 'celsius', 'temperature')).toBeCloseTo(0, 8)
  })

  it('round-trips celsius → fahrenheit → celsius', () => {
    const original = 37
    const there = convert(original, 'celsius', 'fahrenheit', 'temperature')
    const back = convert(there, 'fahrenheit', 'celsius', 'temperature')
    expect(back).toBeCloseTo(original, 8)
  })
})

// ---------------------------------------------------------------------------
// convertTemperature() — direct unit tests
// ---------------------------------------------------------------------------

describe('convertTemperature()', () => {
  it('100°C → 212°F', () => {
    expect(convertTemperature(100, 'celsius', 'fahrenheit')).toBeCloseTo(212, 8)
  })

  it('32°F → 0°C', () => {
    expect(convertTemperature(32, 'fahrenheit', 'celsius')).toBeCloseTo(0, 8)
  })

  it('0 K → −273.15°C', () => {
    expect(convertTemperature(0, 'kelvin', 'celsius')).toBeCloseTo(-273.15, 8)
  })

  it('0°C → 273.15 K', () => {
    expect(convertTemperature(0, 'celsius', 'kelvin')).toBeCloseTo(273.15, 8)
  })

  it('same unit returns original value', () => {
    expect(convertTemperature(25, 'celsius', 'celsius')).toBe(25)
  })

  it('round-trips celsius → kelvin → celsius', () => {
    const original = -40
    const there = convertTemperature(original, 'celsius', 'kelvin')
    const back = convertTemperature(there, 'kelvin', 'celsius')
    expect(back).toBeCloseTo(original, 8)
  })

  it('converts 0°C to 491.67°R (Rankine)', () => {
    expect(convertTemperature(0, 'celsius', 'rankine')).toBeCloseTo(491.67, 2)
  })

  it('round-trips fahrenheit → rankine → fahrenheit', () => {
    const original = 72
    const there = convertTemperature(original, 'fahrenheit', 'rankine')
    const back = convertTemperature(there, 'rankine', 'fahrenheit')
    expect(back).toBeCloseTo(original, 8)
  })
})

// ---------------------------------------------------------------------------
// convert() — graceful fallbacks
// ---------------------------------------------------------------------------

describe('convert() — unknown inputs', () => {
  it('returns original value for unknown category', () => {
    expect(convert(5, 'meter', 'foot', 'weight' as UnitCategory)).toBe(5)
  })

  it('returns original value for unknown from-unit', () => {
    expect(convert(5, 'furlongs', 'foot', 'length')).toBe(5)
  })

  it('returns original value for unknown to-unit', () => {
    expect(convert(5, 'meter', 'furlongs', 'length')).toBe(5)
  })
})

// ---------------------------------------------------------------------------
// formatResult()
// ---------------------------------------------------------------------------

describe('formatResult()', () => {
  it('returns "N/A" for NaN', () => {
    expect(formatResult(NaN)).toBe('N/A')
  })

  it('returns "N/A" for Infinity', () => {
    expect(formatResult(Infinity)).toBe('N/A')
  })

  it('returns "0" for zero', () => {
    expect(formatResult(0)).toBe('0')
  })

  it('formats a normal number with up to 8 significant figures', () => {
    const result = formatResult(3.28084)
    expect(result).toBe('3.28084')
  })

  it('uses exponential notation for very large numbers (≥ 1e15)', () => {
    const result = formatResult(1e16)
    expect(result).toMatch(/e\+/)
  })

  it('uses exponential notation for very small numbers (< 1e-6)', () => {
    const result = formatResult(1e-8)
    expect(result).toMatch(/e-/)
  })
})

// ---------------------------------------------------------------------------
// Round-trip coverage: all non-temperature categories
// ---------------------------------------------------------------------------

describe('convert() — round-trip across all non-temperature categories', () => {
  const nonTempCategories = Object.keys(UNITS) as Array<keyof typeof UNITS>

  for (const category of nonTempCategories) {
    it(`round-trips within category "${category}"`, () => {
      const unitIds = Object.keys(UNITS[category])
      if (unitIds.length < 2) return
      const [from, to] = unitIds
      const original = 42
      const there = convert(original, from, to, category as UnitCategory)
      const back = convert(there, to, from, category as UnitCategory)
      expect(back).toBeCloseTo(original, 6)
    })
  }
})
