import type { Metadata } from 'next'
import Link from 'next/link'
import { CATEGORY_LABELS } from '@/data/units'
import { COMMON_PAIRS } from '@/data/conversionPairs'
import { buildJsonLd, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Unit & Currency Converter Hub | ToolNotch',
  description: 'Convert between 200+ units and 150+ currencies. Length, weight, temperature, area, volume, speed, digital storage, pressure, and live exchange rates.',
  alternates: { canonical: '/tools/convert' },
  openGraph: { title: 'Unit & Currency Converter — 200+ Units | ToolNotch', url: '/tools/convert' },
}

const jsonLd = buildJsonLd(
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Converter', url: '/tools/convert' }]),
)

const CATEGORIES = Object.entries(CATEGORY_LABELS).concat([['currency', 'Currency']])
const FEATURED_PAIRS = COMMON_PAIRS.slice(0, 12)

export default function ConvertHubPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Unit & Currency Converter</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Convert between 200+ units and 150+ currencies. Fast, accurate, and free.
            </p>
          </div>

          <div className="prose prose-gray max-w-none mb-10 space-y-4 text-gray-700">
            <p>
              Unit conversion is a fundamental skill that touches nearly every aspect of daily life. In the kitchen, a recipe
              from a foreign cookbook may list ingredients in grams while your scale shows ounces, or call for millilitres
              when you only have cup measures. In construction and home improvement, blueprints may mix metric and imperial
              dimensions, requiring accurate conversions between millimetres, inches, and feet to avoid costly measurement
              errors. Travellers frequently need to convert kilometres to miles on road signs, Celsius to Fahrenheit for
              weather forecasts, or litres to gallons at the petrol pump. Scientists and students routinely work across unit
              systems — converting joules to calories, pascals to atmospheres, or metres per second to kilometres per hour.
              Even everyday fitness tracking involves conversions: kilograms to pounds on a gym scale, or kilometres to miles
              logged by a running app.
            </p>
            <p>
              The metric system (SI) is used by most of the world and organises measurements in powers of ten, making
              calculations straightforward. The imperial system — still used in the United States, the United Kingdom for
              some measurements, and a handful of other countries — uses units like inches, feet, yards, miles, ounces, pounds,
              and Fahrenheit that have irregular conversion factors rooted in historical convention. Converting between these
              two systems by hand requires memorising dozens of fixed ratios (1 inch = 2.54 cm, 1 mile = 1.60934 km,
              1 pound = 0.453592 kg) and performing multi-step arithmetic that is error-prone under pressure. A reliable
              online conversion tool eliminates that friction entirely, delivering accurate results in milliseconds and
              reducing the risk of expensive or dangerous measurement mistakes.
            </p>
            <p>
              ToolNotch provides a comprehensive set of free conversion tools designed for speed and accuracy. The
              <strong> Unit Converter</strong> supports over 200 units across 9 categories: length, weight, temperature,
              area, volume, speed, time, digital storage, and pressure — covering everything from nanometres to light-years
              and milligrams to metric tonnes. All unit conversions use precise factor-based mathematics with up to 8
              significant figures of precision and work entirely offline, with no internet connection required. The
              <strong> Currency Converter</strong> pulls live exchange rates from a public API and supports over 150
              world currencies, with rates refreshed approximately every hour so you always have a current reference figure.
              Rounding out the suite, the <strong>Percentage Calculator</strong> handles the three most common percentage
              problems — finding a percentage of a number, calculating what percentage one number is of another, and
              computing percentage change — making it useful for discount calculations, grade calculations, and financial
              analysis.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
            {CATEGORIES.map(([key, label]) => (
              <Link
                key={key}
                href={key === 'currency' ? '/tools/convert/currency-converter' : `/tools/convert/unit-converter`}
                className="bg-card border border-gray-200 rounded-xl p-4 text-center hover:shadow-md hover:border-blue-300 transition-all group"
              >
                <div className="font-semibold text-gray-800 text-sm group-hover:text-blue-600">{label}</div>
              </Link>
            ))}
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Conversions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURED_PAIRS.map(pair => (
              <Link
                key={pair.slug}
                href={`/tools/convert/${pair.slug}`}
                className="bg-card border border-gray-200 rounded-lg px-4 py-3 hover:border-blue-300 hover:shadow-sm transition-all text-sm text-gray-700 hover:text-blue-600"
              >
                {pair.title} →
              </Link>
            ))}
          </div>

          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/tools/convert/unit-converter" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Unit Converter
            </Link>
            <Link href="/tools/convert/currency-converter" className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Currency Converter
            </Link>
          </div>

          <section className="mt-10 bg-card rounded-2xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">When to Use a Conversion Tool</h2>
            <ul className="space-y-3 text-gray-700 list-disc list-inside">
              <li>
                <strong>Cooking and baking:</strong> Converting recipe quantities between metric (grams, millilitres) and
                imperial (ounces, cups) measurements when following recipes from different countries.
              </li>
              <li>
                <strong>Travel planning:</strong> Converting local currency exchange rates before a trip, checking
                temperature forecasts in Celsius or Fahrenheit, and understanding distances shown in kilometres or miles
                on maps and road signs.
              </li>
              <li>
                <strong>Construction and DIY:</strong> Translating blueprint dimensions between millimetres, centimetres,
                inches, and feet to ensure materials are cut and ordered to the correct size.
              </li>
              <li>
                <strong>Science and education:</strong> Converting between SI units for physics, chemistry, and engineering
                assignments — including pressure (Pa to atm), energy (J to cal), and speed (m/s to km/h or mph).
              </li>
              <li>
                <strong>Fitness and health:</strong> Converting body weight between kilograms and pounds, tracking running
                distances in both kilometres and miles, and calculating caloric values when following nutritional plans
                from different regions.
              </li>
            </ul>
          </section>
        </div>
      </main>
    </>
  )
}
