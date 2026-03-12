import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

const colorMap: Record<string, string> = {
  blue:   'bg-blue-50 border-blue-200 text-blue-700',
  red:    'bg-red-50 border-red-200 text-red-700',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  green:  'bg-green-50 border-green-200 text-green-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
  pink:   'bg-pink-50 border-pink-200 text-pink-700',
  violet: 'bg-violet-50 border-violet-200 text-violet-700',
}

const badgeMap: Record<string, string> = {
  blue:   'bg-blue-100 text-blue-600',
  red:    'bg-red-100 text-red-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  purple: 'bg-purple-100 text-purple-600',
  green:  'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-orange-600',
  pink:   'bg-pink-100 text-pink-600',
  violet: 'bg-violet-100 text-violet-600',
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  const tc = await getTranslations({ locale, namespace: 'common' })

  const TOOLS = [
    {
      category: t('categories.imageTools'),
      color: 'blue',
      items: [
        { href: '/tools/image/image-compressor', label: t('tools.imageCompressor.label'), desc: t('tools.imageCompressor.desc') },
        { href: '/tools/image/convert-png-to-webp', label: t('tools.imageConverter.label'), desc: t('tools.imageConverter.desc') },
      ],
    },
    {
      category: t('categories.pdfTools'),
      color: 'red',
      items: [
        { href: '/tools/pdf/merge-pdf', label: t('tools.mergePdf.label'), desc: t('tools.mergePdf.desc') },
        { href: '/tools/pdf/split-pdf', label: t('tools.splitPdf.label'), desc: t('tools.splitPdf.desc') },
        { href: '/tools/pdf/compress-pdf', label: t('tools.compressPdf.label'), desc: t('tools.compressPdf.desc') },
        { href: '/tools/pdf/pdf-to-jpg', label: t('tools.pdfToJpg.label'), desc: t('tools.pdfToJpg.desc') },
        { href: '/tools/pdf/jpg-to-pdf', label: t('tools.jpgToPdf.label'), desc: t('tools.jpgToPdf.desc') },
      ],
    },
    {
      category: t('categories.converterTools'),
      color: 'indigo',
      items: [
        { href: '/tools/convert/unit-converter', label: t('tools.unitConverter.label'), desc: t('tools.unitConverter.desc') },
        { href: '/tools/convert/currency-converter', label: t('tools.currencyConverter.label'), desc: t('tools.currencyConverter.desc') },
        { href: '/tools/convert/meters-to-feet', label: t('tools.metersToFeet.label'), desc: t('tools.metersToFeet.desc') },
        { href: '/tools/convert/celsius-to-fahrenheit', label: t('tools.celsiusToFahrenheit.label'), desc: t('tools.celsiusToFahrenheit.desc') },
        { href: '/tools/convert/kilograms-to-pounds', label: t('tools.kgToPounds.label'), desc: t('tools.kgToPounds.desc') },
      ],
    },
    {
      category: t('categories.textTools'),
      color: 'purple',
      items: [
        { href: '/tools/text/word-counter', label: t('tools.wordCounter.label'), desc: t('tools.wordCounter.desc') },
        { href: '/tools/text/character-counter', label: t('tools.characterCounter.label'), desc: t('tools.characterCounter.desc') },
        { href: '/tools/text/readability-checker', label: t('tools.readabilityChecker.label'), desc: t('tools.readabilityChecker.desc') },
        { href: '/tools/text/reading-time-calculator', label: t('tools.readingTimeCalculator.label'), desc: t('tools.readingTimeCalculator.desc') },
        { href: '/tools/text/word-frequency-counter', label: t('tools.wordFrequencyCounter.label'), desc: t('tools.wordFrequencyCounter.desc') },
      ],
    },
    {
      category: t('categories.financeTools'),
      color: 'green',
      items: [
        { href: '/tools/finance/loan-calculator', label: t('tools.loanCalculator.label'), desc: t('tools.loanCalculator.desc') },
        { href: '/tools/finance/mortgage-calculator', label: t('tools.mortgageCalculator.label'), desc: t('tools.mortgageCalculator.desc') },
        { href: '/tools/finance/car-loan-calculator', label: t('tools.carLoanCalculator.label'), desc: t('tools.carLoanCalculator.desc') },
        { href: '/tools/finance/invoice-generator', label: t('tools.invoiceGenerator.label'), desc: t('tools.invoiceGenerator.desc') },
        { href: '/tools/finance/invoice-generator-uk', label: t('tools.invoiceGeneratorUk.label'), desc: t('tools.invoiceGeneratorUk.desc') },
        { href: '/tools/finance/home-affordability-calculator', label: t('tools.homeAffordability.label'), desc: t('tools.homeAffordability.desc') },
        { href: '/tools/finance/amortization-calculator', label: t('tools.amortizationCalculator.label'), desc: t('tools.amortizationCalculator.desc') },
        { href: '/tools/finance/student-loan-calculator', label: t('tools.studentLoanCalculator.label'), desc: t('tools.studentLoanCalculator.desc') },
      ],
    },
    {
      category: t('categories.funAndRandom'),
      color: 'orange',
      items: [
        { href: '/tools/fun/spin-the-wheel', label: t('tools.spinTheWheel.label'), desc: t('tools.spinTheWheel.desc') },
        { href: '/tools/fun/random-name-picker', label: t('tools.randomNamePicker.label'), desc: t('tools.randomNamePicker.desc') },
        { href: '/tools/fun/random-team-generator', label: t('tools.teamGenerator.label'), desc: t('tools.teamGenerator.desc') },
        { href: '/tools/fun/coin-flip', label: t('tools.coinFlip.label'), desc: t('tools.coinFlip.desc') },
        { href: '/tools/fun/dice-roller', label: t('tools.diceRoller.label'), desc: t('tools.diceRoller.desc') },
        { href: '/tools/fun/random-number-generator', label: t('tools.numberGenerator.label'), desc: t('tools.numberGenerator.desc') },
        { href: '/tools/fun/yes-or-no-wheel', label: t('tools.yesOrNoWheel.label'), desc: t('tools.yesOrNoWheel.desc') },
        { href: '/tools/fun/wheel-of-names', label: t('tools.wheelOfNames.label'), desc: t('tools.wheelOfNames.desc') },
      ],
    },
    {
      category: t('categories.agileTools'),
      color: 'violet',
      items: [
        { href: '/tools/agile/retro-board', label: t('tools.retroBoard.label'), desc: t('tools.retroBoard.desc') },
      ],
    },
    {
      category: t('categories.quizzes'),
      color: 'pink',
      items: [
        { href: '/quizzes', label: t('tools.allQuizzes.label'), desc: t('tools.allQuizzes.desc') },
        { href: '/quiz/which-programming-language-are-you', label: t('tools.programmingLanguageQuiz.label'), desc: t('tools.programmingLanguageQuiz.desc') },
        { href: '/quiz/am-i-introverted-or-extroverted', label: t('tools.introvertExtrovertQuiz.label'), desc: t('tools.introvertExtrovertQuiz.desc') },
        { href: '/quiz/what-career-suits-you', label: t('tools.careerQuiz.label'), desc: t('tools.careerQuiz.desc') },
        { href: '/quiz/what-type-of-traveler-are-you', label: t('tools.travelerQuiz.label'), desc: t('tools.travelerQuiz.desc') },
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('heading')}</h1>
          <p className="text-lg text-gray-500">
            {t('subheading')}
          </p>
        </div>

        <div className="space-y-10">
          {TOOLS.map((group) => (
            <section key={group.category}>
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colorMap[group.color]}`}>
                  {group.category}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.items.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 flex-shrink-0 ${badgeMap[group.color]}`}>
                        {tc('free')}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                          {tool.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-16">
          {t('moreComingSoon')}
        </p>
      </div>
    </main>
  )
}
