import { ConversionPair } from "@/lib/unitTypes";
import { getPairContent } from "@/data/conversionPairContent";

const CATEGORY_NAMES: Record<string, Record<string, string>> = {
  pt: {
    length: "Comprimento",
    weight: "Peso",
    temperature: "Temperatura",
    area: "Área",
    volume: "Volume",
    speed: "Velocidade",
    time: "Tempo",
    "digital-storage": "Armazenamento Digital",
    pressure: "Pressão",
  },
  es: {
    length: "Longitud",
    weight: "Peso",
    temperature: "Temperatura",
    area: "Área",
    volume: "Volumen",
    speed: "Velocidad",
    time: "Tiempo",
    "digital-storage": "Almacenamiento Digital",
    pressure: "Presión",
  },
  en: {
    length: "Length",
    weight: "Weight",
    temperature: "Temperature",
    area: "Area",
    volume: "Volume",
    speed: "Speed",
    time: "Time",
    "digital-storage": "Digital Storage",
    pressure: "Pressure",
  },
};

const UNIT_PLURALS: Record<string, Record<string, string>> = {
  pt: {
    meter: "Metros",
    kilometer: "Quilômetros",
    centimeter: "Centímetros",
    millimeter: "Milímetros",
    micrometer: "Micrômetros",
    mile: "Milhas",
    yard: "Jardas",
    foot: "Pés",
    inch: "Polegadas",
    "nautical mile": "Milhas Náuticas",
    "light year": "Anos-Luz",
    parsec: "Parsecs",
    kilogram: "Quilogramas",
    gram: "Gramas",
    milligram: "Miligramas",
    pound: "Libras",
    ounce: "Onças",
    ton: "Toneladas",
    "short ton": "Toneladas Curtas",
    stone: "Stones",
    carat: "Quilates",
    celsius: "Celsius",
    fahrenheit: "Fahrenheit",
    kelvin: "Kelvin",
    rankine: "Rankine",
    "square meter": "Metros Quadrados",
    "square kilometer": "Quilômetros Quadrados",
    "square mile": "Milhas Quadradas",
    "square foot": "Pés Quadrados",
    "square yard": "Jardas Quadradas",
    "square inch": "Polegadas Quadradas",
    hectare: "Hectares",
    acre: "Acres",
    liter: "Litros",
    milliliter: "Mililitros",
    "cubic meter": "Metros Cúbicos",
    "cubic centimeter": "Centímetros Cúbicos",
    "cubic foot": "Pés Cúbicos",
    "cubic inch": "Polegadas Cúbicas",
    "gallon (US)": "Galões (US)",
    "gallon (UK)": "Galões (UK)",
    quart: "Quartos",
    pint: "Pints",
    cup: "Xícaras",
    "fluid ounce": "Onças Fluidas",
    tablespoon: "Colheres de Sopa",
    teaspoon: "Colheres de Chá",
    "meter per second": "Metros por Segundo",
    "kilometer per hour": "Quilômetros por Hora (KM/H)",
    "mile per hour": "Milhas por Hora (MPH)",
    knot: "Nós",
    "foot per second": "Pés por Segundo",
    mach: "Mach",
    second: "Segundos",
    millisecond: "Milissegundos",
    minute: "Minutos",
    hour: "Horas",
    day: "Dias",
    week: "Semanas",
    month: "Meses",
    year: "Anos",
    decade: "Décadas",
    century: "Séculos",
    byte: "Bytes",
    kilobyte: "Kilobytes (KB)",
    megabyte: "Megabytes (MB)",
    gigabyte: "Gigabytes (GB)",
    terabyte: "Terabytes (TB)",
    petabyte: "Petabytes (PB)",
    bit: "Bits",
    kilobit: "Kilobits",
    megabit: "Megabits",
    gigabit: "Gigabits",
    pascal: "Pascals",
    kilopascal: "Kilopascals (kPa)",
    megapascal: "Megapascals",
    bar: "Bar",
    millibar: "Milibares",
    psi: "PSI",
    atmosphere: "Atmosferas (atm)",
    "millimeter of mercury": "mmHg",
    torr: "Torr",
  },
  es: {
    meter: "Metros",
    kilometer: "Kilómetros",
    centimeter: "Centímetros",
    millimeter: "Milímetros",
    micrometer: "Micrómetros",
    mile: "Millas",
    yard: "Yardas",
    foot: "Pies",
    inch: "Pulgadas",
    "nautical mile": "Millas Náuticas",
    "light year": "Años Luz",
    parsec: "Pársecs",
    kilogram: "Kilogramos",
    gram: "Gramos",
    milligram: "Miligramos",
    pound: "Libras",
    ounce: "Onzas",
    ton: "Toneladas",
    "short ton": "Toneladas Cortas",
    stone: "Stones",
    carat: "Quilates",
    celsius: "Celsius",
    fahrenheit: "Fahrenheit",
    kelvin: "Kelvin",
    rankine: "Rankine",
    "square meter": "Metros Cuadrados",
    "square kilometer": "Kilómetros Cuadrados",
    "square mile": "Millas Cuadradas",
    "square foot": "Pies Cuadrados",
    "square yard": "Yardas Cuadradas",
    "square inch": "Pulgadas Cuadradas",
    hectare: "Hectáreas",
    acre: "Acres",
    liter: "Litros",
    milliliter: "Mililitros",
    "cubic meter": "Metros Cúbicos",
    "cubic centimeter": "Centímetros Cúbicos",
    "cubic foot": "Pies Cúbicos",
    "cubic inch": "Pulgadas Cúbicas",
    "gallon (US)": "Galones (US)",
    "gallon (UK)": "Galones (UK)",
    quart: "Cuartos",
    pint: "Pintas",
    cup: "Tazas",
    "fluid ounce": "Onzas Líquidas",
    tablespoon: "Cucharadas",
    teaspoon: "Cucharaditas",
    "meter per second": "Metros por Segundo",
    "kilometer per hour": "Kilómetros por Hora (KM/H)",
    "mile per hour": "Millas por Hora (MPH)",
    knot: "Nudos",
    "foot per second": "Pies por Segundo",
    mach: "Mach",
    second: "Segundos",
    millisecond: "Milisegundos",
    minute: "Minutos",
    hour: "Horas",
    day: "Días",
    week: "Semanas",
    month: "Meses",
    year: "Años",
    decade: "Décadas",
    century: "Siglos",
    byte: "Bytes",
    kilobyte: "Kilobytes (KB)",
    megabyte: "Megabytes (MB)",
    gigabyte: "Gigabytes (GB)",
    terabyte: "Terabytes (TB)",
    petabyte: "Petabytes (PB)",
    bit: "Bits",
    kilobit: "Kilobits",
    megabit: "Megabits",
    gigabit: "Gigabits",
    pascal: "Pascales",
    kilopascal: "Kilopascales (kPa)",
    megapascal: "Megapascales",
    bar: "Bar",
    millibar: "Milibares",
    psi: "PSI",
    atmosphere: "Atmósferas (atm)",
    "millimeter of mercury": "mmHg",
    torr: "Torr",
  },
};

/**
 * Returns a localized title for any ConversionPair.
 * 1. Uses getPairContent(slug, locale)?.h1 if priority content exists.
 * 2. If it is a category converter (e.g. length-converter), returns "Conversor de Comprimento".
 * 3. For unit-to-unit pairs, returns "Pés para Metros" (pt) or "Pies a Metros" (es).
 * 4. Defaults to pair.title for English or unmapped keys.
 */
export function getLocalizedPairTitle(
  pair: ConversionPair,
  locale = "en"
): string {
  if (locale === "en") return pair.title;

  const content = getPairContent(pair.slug, locale);
  if (content?.h1) return content.h1;

  if (pair.slug.endsWith("-converter")) {
    const catName =
      CATEGORY_NAMES[locale]?.[pair.category] ??
      CATEGORY_NAMES.en[pair.category] ??
      pair.category;
    if (locale === "pt" || locale === "es") {
      return `Conversor de ${catName}`;
    }
    return `${catName} Converter`;
  }

  const plurals = UNIT_PLURALS[locale];
  if (plurals) {
    const fromLabel = plurals[pair.from];
    const toLabel = plurals[pair.to];
    if (fromLabel && toLabel) {
      if (locale === "pt") {
        return `${fromLabel} para ${toLabel}`;
      }
      if (locale === "es") {
        return `${fromLabel} a ${toLabel}`;
      }
    }
  }

  return pair.title;
}
