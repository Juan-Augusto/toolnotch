import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Resume Builder — Create a Resume Online',
  description: 'Build a professional resume online for free. Choose from 3 templates, export to PDF. No sign-up required.',
  // Coming-soon stub — noindex until it ships real content (WS-5 audit; WS-6 follow-up).
  robots: { index: false },
}

export default function ResumeBuilderPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Builder</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}
