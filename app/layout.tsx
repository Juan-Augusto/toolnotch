// Root layout — required by Next.js App Router.
// The actual layout (with locale, fonts, scripts) lives in app/[locale]/layout.tsx.
// This file only exists to satisfy Next.js's requirement for a root layout.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
