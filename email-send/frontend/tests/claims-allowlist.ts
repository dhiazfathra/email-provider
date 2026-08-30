/**
 * Numerals allowed in product copy despite not being decisions.
 * Every entry states why. An allowlist is a hiding place — the reason is what
 * makes hiding visible (spec risk R2).
 */
export const ALLOWED_NUMERALS = [
  { value: "2", reason: "API version, as in /v2/send" },
  { value: "200", reason: "HTTP status in the errors table" },
  { value: "202", reason: "HTTP status in the errors table" },
  { value: "400", reason: "HTTP status in the errors table" },
  { value: "401", reason: "HTTP status in the errors table" },
  { value: "403", reason: "HTTP status in the errors table" },
  { value: "404", reason: "HTTP status in the errors table" },
  { value: "409", reason: "HTTP status in the errors table" },
  { value: "422", reason: "HTTP status in the errors table" },
  { value: "429", reason: "HTTP status in the errors table" },
  { value: "500", reason: "HTTP status in the errors table" },
];

/**
 * Phrases that are promises regardless of whether they carry a number.
 * A numeric scan never catches "industry-leading uptime" (spec risk R3).
 */
export const FORBIDDEN_PHRASES = [
  "SLA",
  "uptime",
  "guarantee",
  "guaranteed",
  "industry-leading",
  "SSO",
  "SCIM",
  "data residency",
  "within an hour",
  "under an hour",
];
