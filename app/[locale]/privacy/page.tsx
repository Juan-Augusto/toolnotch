import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | ToolNotch',
  description: 'Privacy Policy for ToolNotch — how we collect, use, and protect your information.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm text-blue-600 hover:underline">← Back to ToolNotch</Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: March 18, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Overview</h2>
            <p>
              ToolNotch (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the website{' '}
              <a href="https://toolnotch.com" className="text-blue-600 hover:underline">toolnotch.com</a>{' '}
              and provides free online tools for productivity, conversion, finance, and more.
              This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>

            <h3 className="font-semibold text-gray-800 mb-2">a) Files and user input</h3>
            <p>
              Most ToolNotch tools (image compressor, PDF merger, PDF splitter, etc.) process files entirely
              in your browser using client-side JavaScript. <strong>Your files are never uploaded to our servers.</strong>
              They remain on your device at all times.
            </p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">b) Usage data (Google Analytics)</h3>
            <p>
              We use Google Analytics 4 (GA4) to understand how visitors use the site. GA4 collects anonymized
              data including pages visited, time on site, browser type, and approximate geographic location (country/city level).
              This data does not identify you personally. You can opt out via the{' '}
              <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Google Analytics Opt-out Browser Add-on
              </a>.
            </p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">c) Advertising (Google AdSense)</h3>
            <p>
              We use Google AdSense to display advertisements. Google AdSense uses cookies and similar technologies
              to serve ads based on your prior visits to our site and other sites on the internet. Google&apos;s use
              of advertising cookies enables it and its partners to serve ads based on your visit to ToolNotch and/or
              other sites on the internet.
            </p>
            <p className="mt-2">
              You may opt out of personalized advertising by visiting{' '}
              <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Google Ads Settings
              </a>{' '}
              or{' '}
              <a href="https://www.aboutads.info/choices/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                aboutads.info
              </a>.
            </p>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">d) Cookies</h3>
            <p>
              ToolNotch itself uses minimal cookies — primarily to remember your language preference.
              Third-party services (Google Analytics, Google AdSense) set their own cookies as described
              in their respective privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To operate and improve ToolNotch tools and features</li>
              <li>To understand how users interact with the site (via GA4)</li>
              <li>To display relevant advertisements (via Google AdSense)</li>
              <li>To remember your preferences (e.g., language selection)</li>
            </ul>
            <p className="mt-3">We do not sell, trade, or rent your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Third-Party Services</h2>
            <p>We use the following third-party services, each with their own privacy policies:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  Google Privacy Policy
                </a>{' '}(Analytics + AdSense)
              </li>
              <li>
                <a href="https://vercel.com/legal/privacy-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  Vercel Privacy Policy
                </a>{' '}(hosting)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Children&apos;s Privacy</h2>
            <p>
              ToolNotch is not directed to children under 13 years of age. We do not knowingly collect
              personal information from children under 13. If you believe a child has provided us with
              personal information, please contact us and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
            <p>
              Depending on your location, you may have rights under applicable privacy law (such as GDPR or CCPA)
              including the right to access, correct, or delete personal data we hold about you.
              Since we collect minimal personal data and no files are stored on our servers,
              most requests can be addressed by clearing your browser cookies and local storage.
            </p>
            <p className="mt-2">
              For any privacy-related requests, contact us at the email address below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Data Security</h2>
            <p>
              Because most tool processing happens entirely in your browser and no files are transmitted to
              our servers, the risk of data breach is minimal. Network traffic to the site is encrypted
              via HTTPS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page
              with an updated &ldquo;Last updated&rdquo; date. Continued use of the site after changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:juanaugusto1@live.com" className="text-blue-600 hover:underline">
                juanaugusto1@live.com
              </a>.
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
