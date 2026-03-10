// This file is intentionally minimal — the middleware (proxy) handles locale routing.
// For the 'en' locale (no prefix), next-intl routes requests to app/[locale]/page.tsx.
// This file satisfies Next.js App Router's requirement for a root page export.
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/')
}
