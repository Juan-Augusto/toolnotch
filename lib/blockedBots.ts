/**
 * Low-value crawlers blocked at the edge (proxy.ts) to save Vercel edge
 * requests. Ported from mvp-project/middleware.js.
 *
 * Keep Googlebot, Bingbot and Google AdSense's Mediapartners-Google allowed:
 * they drive search traffic and ad approval/serving.
 */
export const BLOCKED_BOTS = [
  "AhrefsBot",
  "Amazonbot",
  "PetalBot",
  "SemrushBot",
  "MJ12bot",
  "DotBot",
  "BLEXBot",
  "DataForSeoBot",
  "SerpstatBot",
  "Barkrowler",
  "SeekportBot",
] as const;

const BLOCKED_UA_PATTERNS = BLOCKED_BOTS.map((name) => new RegExp(name, "i"));

export function isBlockedBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return BLOCKED_UA_PATTERNS.some((pattern) => pattern.test(userAgent));
}
