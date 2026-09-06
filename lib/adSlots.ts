// ── Display-ad provider ────────────────────────────────────────────────────
// `NEXT_PUBLIC_AD_PROVIDER` selects the network at build time:
//   'adsense'  (default) — Google AdSense (needs NEXT_PUBLIC_ADSENSE_CLIENT)
//   'adsterra'            — Adsterra / Monetag fallback (needs zone IDs below)
//   'none'                — render no ad slots at all (hard kill switch)
export type AdProvider = 'adsense' | 'adsterra' | 'none'

export const AD_PROVIDER: AdProvider =
  (process.env.NEXT_PUBLIC_AD_PROVIDER as AdProvider) || 'adsense'

// ── Google AdSense slot IDs ────────────────────────────────────────────────
// Replace these with real slot IDs from the AdSense dashboard after approval.
// To activate: 1. Get AdSense approved. 2. Create ad units in the dashboard.
// 3. Replace the placeholders below. 4. Set NEXT_PUBLIC_ADSENSE_CLIENT.
// Format: slot IDs are numbers only (not the ca-pub prefix).
export const AD_SLOTS = {
  TOOL_TOP: '1111111111',          // leaderboard above tool — used in ToolWrapper
  TOOL_BOTTOM: '2222222222',       // rectangle below FAQ — to be added post-approval
  BLOG_ARTICLE_BOTTOM: '3333333333', // rectangle below blog articles
  BLOG_INDEX_TOP: '4444444444',    // leaderboard above blog index
  CONVERT_SLUG: '5555555555',      // leaderboard on /tools/convert/[slug] pages
} as const

// ── Adsterra / Monetag zone IDs ───────────────────────────────────────────
// Fallback display network, used only when NEXT_PUBLIC_AD_PROVIDER=adsterra.
// Create the zones in the Adsterra dashboard, replace the placeholders, then
// wire the per-zone async script in the layout (banner + native only — no
// popunder / interstitial). Keys mirror AD_SLOTS so callers pass the same key.
export const ADSTERRA_ZONES: Record<keyof typeof AD_SLOTS, string> = {
  TOOL_TOP: '0000000000',
  TOOL_BOTTOM: '0000000001',
  BLOG_ARTICLE_BOTTOM: '0000000002',
  BLOG_INDEX_TOP: '0000000003',
  CONVERT_SLUG: '0000000004',
}
