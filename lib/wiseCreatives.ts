/**
 * Wise (prf.hn / Partnerize) affiliate banner creatives — camref 1101l6t7M2.
 *
 * The network also issues a `<script src=".../creative/...">` tag per creative
 * that document.write()s this same markup client-side. We skip that tag on
 * purpose: document.write from an async script is unreliable in React/Next
 * (fights hydration, can no-op post-load, trips stricter CSPs) and buys nothing
 * over the static `<a><img>` fallback the network ships alongside it. The
 * fallback is what's listed below — plain, SSR-safe, and functionally identical
 * (same click-tracked link, same creative image).
 *
 * Pure data — consumed by components/WiseBanner.tsx.
 */

export interface WiseCreative {
  creativeRef: string;
  href: string;
  img: string;
  width: number;
  height: number;
}

export const WISE_CREATIVES: WiseCreative[] = [
  {
    creativeRef: "1011l103161",
    href: "https://wise.prf.hn/click/camref:1101l6t7M2/creativeref:1011l103161",
    img: "https://wise-creative.prf.hn/source/camref:1101l6t7M2/creativeref:1011l103161",
    width: 1200,
    height: 628,
  },
  {
    creativeRef: "1011l103162",
    href: "https://wise.prf.hn/click/camref:1101l6t7M2/creativeref:1011l103162",
    img: "https://wise-creative.prf.hn/source/camref:1101l6t7M2/creativeref:1011l103162",
    width: 1200,
    height: 628,
  },
  {
    creativeRef: "1011l108069",
    href: "https://wise.prf.hn/click/camref:1101l6t7M2/creativeref:1011l108069",
    img: "https://wise-creative.prf.hn/source/camref:1101l6t7M2/creativeref:1011l108069",
    width: 1200,
    height: 628,
  },
  {
    creativeRef: "1100l102201",
    href: "https://wise.prf.hn/click/camref:1101l6t7M2/creativeref:1100l102201",
    img: "https://wise-creative.prf.hn/source/camref:1101l6t7M2/creativeref:1100l102201",
    width: 1200,
    height: 628,
  },
  {
    creativeRef: "1100l107099",
    href: "https://wise.prf.hn/click/camref:1101l6t7M2/creativeref:1100l107099",
    img: "https://wise-creative.prf.hn/source/camref:1101l6t7M2/creativeref:1100l107099",
    width: 1200,
    height: 628,
  },
  {
    creativeRef: "1100l107103",
    href: "https://wise.prf.hn/click/camref:1101l6t7M2/creativeref:1100l107103",
    img: "https://wise-creative.prf.hn/source/camref:1101l6t7M2/creativeref:1100l107103",
    width: 1200,
    height: 628,
  },
  {
    creativeRef: "1100l107109",
    href: "https://wise.prf.hn/click/camref:1101l6t7M2/creativeref:1100l107109",
    img: "https://wise-creative.prf.hn/source/camref:1101l6t7M2/creativeref:1100l107109",
    width: 1200,
    height: 628,
  },
  {
    creativeRef: "1101l107622",
    href: "https://wise.prf.hn/click/camref:1101l6t7M2/creativeref:1101l107622",
    img: "https://wise-creative.prf.hn/source/camref:1101l6t7M2/creativeref:1101l107622",
    width: 1200,
    height: 628,
  },
  {
    creativeRef: "1101l107624",
    href: "https://wise.prf.hn/click/camref:1101l6t7M2/creativeref:1101l107624",
    img: "https://wise-creative.prf.hn/source/camref:1101l6t7M2/creativeref:1101l107624",
    width: 1200,
    height: 628,
  },
];

/** Deterministic pick so server and client render the same creative (no hydration mismatch). */
export function pickWiseCreative(seed: string): WiseCreative {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % WISE_CREATIVES.length;
  return WISE_CREATIVES[index];
}
