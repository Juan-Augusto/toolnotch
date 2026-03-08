export function convertTemperature(value: number, from: string, to: string): number {
  if (from === to) return value

  // Convert to Celsius first
  let celsius: number
  switch (from) {
    case 'celsius':    celsius = value; break
    case 'fahrenheit': celsius = (value - 32) * 5 / 9; break
    case 'kelvin':     celsius = value - 273.15; break
    case 'rankine':    celsius = (value - 491.67) * 5 / 9; break
    default:           celsius = value
  }

  // Convert from Celsius to target
  switch (to) {
    case 'celsius':    return celsius
    case 'fahrenheit': return celsius * 9 / 5 + 32
    case 'kelvin':     return celsius + 273.15
    case 'rankine':    return (celsius + 273.15) * 9 / 5
    default:           return celsius
  }
}

export const TEMPERATURE_UNITS = ['celsius', 'fahrenheit', 'kelvin', 'rankine'] as const
