/**
 * Portfolio / side-project screenshots, pre-resized to 960px wide (2× the
 * widest card) as WebP + JPEG fallback in static/img/landing/960/.
 * The originals in static/img/landing/ are 1–2.3k px and up to 1.8MB each.
 * Sizes are the generated files' intrinsic dimensions (width/height attrs).
 */
export const LANDING_IMAGES = {
  "bento-grid-img": { width: 960, height: 632 },
  "bitcoin-img": { width: 960, height: 961 },
  "covid-la-img": { width: 960, height: 539 },
  "e-wallet-img": { width: 960, height: 659 },
  "education-img": { width: 960, height: 961 },
  "hr-img": { width: 960, height: 549 },
  "insurance-img": { width: 960, height: 960 },
  "petro-img": { width: 960, height: 957 },
  "pos-img": { width: 960, height: 668 },
  "postal-img": { width: 960, height: 954 },
} as const;

export type LandingImageName = keyof typeof LANDING_IMAGES;
