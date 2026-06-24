/**
 * Feature flags for gating functionality that is not yet ready for launch.
 * Set to `true` to enable a feature, `false` to hide it.
 *
 * When a feature is disabled:
 * - Navigation links to it are hidden
 * - The route redirects to the home page
 * - It is excluded from the sitemap and disallowed in robots.txt
 *
 * To re-enable a feature for a future release, flip its flag to `true`.
 */
export const FEATURE_FLAGS = {
  /** Tool submission flow (/submit). Disabled for initial launch. */
  submit: false,
  /** Admin review console (/admin/review). Internal only for now. */
  adminReview: false
} as const;

export type FeatureId = keyof typeof FEATURE_FLAGS;

export function isFeatureEnabled(feature: FeatureId): boolean {
  return FEATURE_FLAGS[feature];
}
