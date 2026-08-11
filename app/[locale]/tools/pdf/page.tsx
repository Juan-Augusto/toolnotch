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
              className="bg-card rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-red-300 transition-all group">
              <h2 className="font-bold text-gray-900 group-hover:text-red-600 mb-1">{tool.label}</h2>
              <p className="text-sm text-gray-500">{tool.desc}</p>
            </Link>
          ))}
        </div>

        {/* Intro section */}
        <div className="mt-16 space-y-6 text-gray-700">
          <h2 className="text-2xl font-bold text-gray-900">What Is a PDF and Why Is It the Universal Document Format?</h2>
          <p className="leading-relaxed">
            PDF stands for Portable Document Format, a file standard developed by Adobe in the early 1990s. Unlike Word documents or web pages, a PDF looks identical on every device — the same fonts, the same layout, the same images — whether it is opened on a Windows laptop, a Mac, an iPhone, or an Android tablet. This reliability made PDFs the default format for contracts, invoices, government forms, academic papers, and any document that needs to be shared without risk of formatting breaking. Today, billions of PDF files are created and sent every day, and the format is supported natively by virtually every operating system, web browser, and email client without any extra software.
          </p>
          <p className="leading-relaxed">
            The most common tasks people need to perform on PDFs include combining multiple files into a single document — for example, merging a cover page, a report body, and an appendix into one shareable PDF. Compressing large PDFs is equally common: a presentation full of high-resolution images can easily exceed 20 MB, making it difficult to attach to an email or upload to a client portal. Splitting a large PDF into individual pages or page ranges is useful when you only need to share one chapter of a report or extract a single invoice from a batch file. Converting PDF pages to JPG images is helpful for creating document previews, sharing content on social media, or embedding PDF content inside a PowerPoint presentation. Going the other way — converting JPG or PNG images into a single PDF — is the quickest way to package scanned receipts, photos, or screenshots into one neat file.
          </p>
          <p className="leading-relaxed">
            These tasks used to require expensive desktop software like Adobe Acrobat Pro. Today, all of these operations can be performed directly in a modern web browser — no installation required, no subscription, and no files leaving your computer. ToolNotch&apos;s PDF tools run entirely client-side using JavaScript libraries like PDF-lib and PDF.js, which means your documents are processed locally on your own device. The result is faster processing (no upload wait times), guaranteed privacy (your files are never sent to any server), and zero cost. Whether you need to quickly compress a PDF before emailing it to a client or split a 50-page report into individual sections, you can do it in seconds without signing up for anything.
          </p>
        </div>

        {/* Why browser-based section */}
        <div className="mt-12 bg-card rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Why Use Browser-Based PDF Tools?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-500 font-bold flex-shrink-0">&#10003;</span>
              <span><strong>No software to install.</strong> Open the tool in any modern browser — Chrome, Firefox, Safari, or Edge — and start working immediately. No downloads, no plugins, no admin rights required.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-500 font-bold flex-shrink-0">&#10003;</span>
              <span><strong>Your files stay private.</strong> All PDF processing happens inside your browser using JavaScript. Your documents are never uploaded to any server, so sensitive contracts, financial documents, and personal files remain completely private.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-500 font-bold flex-shrink-0">&#10003;</span>
              <span><strong>Completely free, no signup required.</strong> Every tool on this page is free to use with no account, no credit card, and no watermarks on your output files. There are no daily limits or paywalled features.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-red-500 font-bold flex-shrink-0">&#10003;</span>
              <span><strong>Works on any device.</strong> These tools are fully responsive and work on desktops, laptops, tablets, and smartphones. There is no platform-specific software to worry about — if your device has a browser, it can run these tools.</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
