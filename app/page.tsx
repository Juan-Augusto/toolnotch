import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ToolNotch — Free Online Tools',
  description:
    'Free online tools: compress images, merge PDFs, convert units, and more. No signup, no upload, 100% private.',
}

const TOOLS = [
  {
    category: 'Image Tools',
    color: 'blue',
    items: [
      { href: '/tools/image/image-compressor', label: 'Image Compressor', desc: 'Compress JPG, PNG, WebP, AVIF' },
      { href: '/tools/image/convert-png-to-webp', label: 'Image Converter', desc: 'Convert between formats' },
    ],
  },
  {
    category: 'PDF Tools',
    color: 'red',
    items: [
      { href: '/tools/pdf/merge-pdf', label: 'Merge PDF', desc: 'Combine multiple PDFs into one' },
      { href: '/tools/pdf/split-pdf', label: 'Split PDF', desc: 'Split PDF by page range' },
      { href: '/tools/pdf/compress-pdf', label: 'Compress PDF', desc: 'Reduce PDF file size' },
      { href: '/tools/pdf/pdf-to-jpg', label: 'PDF to JPG', desc: 'Convert PDF pages to images' },
      { href: '/tools/pdf/jpg-to-pdf', label: 'JPG to PDF', desc: 'Convert images to PDF' },
    ],
  },
]

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  red: 'bg-red-50 border-red-200 text-red-700',
}

const badgeMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600',
  red: 'bg-red-100 text-red-600',
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">ToolNotch</h1>
          <p className="text-lg text-gray-500">
            Free online tools — no signup, no upload, 100% private
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
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 ${badgeMap[group.color]}`}>
                        Free
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
          More tools coming soon
        </p>
      </div>
    </main>
  )
}
