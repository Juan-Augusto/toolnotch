// Replace these with real slot IDs from AdSense dashboard after approval
// To activate ads: 1. Get AdSense approved. 2. Create ad units in AdSense dashboard.
// 3. Replace placeholder values below with real slot IDs. 4. Set NEXT_PUBLIC_ADSENSE_CLIENT in .env.local.
// Format: slot IDs are numbers only (not the ca-pub prefix)
export const AD_SLOTS = {
  TOOL_TOP: '1111111111',          // leaderboard above tool — used in ToolWrapper
  TOOL_BOTTOM: '2222222222',       // rectangle below FAQ — to be added post-approval
  BLOG_ARTICLE_BOTTOM: '3333333333', // rectangle below blog articles
  BLOG_INDEX_TOP: '4444444444',    // leaderboard above blog index
} as const
