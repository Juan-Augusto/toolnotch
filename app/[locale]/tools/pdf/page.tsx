import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Free PDF Tools — Merge, Split, Compress PDF Online | ToolNotch',
  description: 'Free online PDF tools: merge PDF, split PDF, compress PDF, convert PDF to JPG, and convert images to PDF. Browser-based — no file upload to servers.',
  alternates: { canonical: '/tools/pdf' },
}

const TOOLS = [
  { href: '/tools/pdf/merge-pdf', label: 'Merge PDF', desc: 'Combine multiple PDF files into one. Drag to reorder.' },
  { href: '/tools/pdf/split-pdf', label: 'Split PDF', desc: 'Split PDF into separate pages or page ranges.' },
  { href: '/tools/pdf/compress-pdf', label: 'Compress PDF', desc: 'Reduce PDF file size for email and web.' },
  { href: '/tools/pdf/pdf-to-jpg', label: 'PDF to JPG', desc: 'Convert PDF pages to high-quality JPG images.' },
  { href: '/tools/pdf/jpg-to-pdf', label: 'JPG to PDF', desc: 'Convert images to a single PDF file.' },
]

export default function PdfToolsHubPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Free PDF Tools</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Merge, split, compress, and convert PDF files for free. All processing happens in your browser — your files never leave your device.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map(tool => (
            <Link key={tool.href} href={tool.href}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-red-300 transition-all group">
              <h2 className="font-bold text-gray-900 group-hover:text-red-600 mb-1">{tool.label}</h2>
              <p className="text-sm text-gray-500">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
