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
  { value: "503", reason: "HTTP status in the errors table" },
  { value: "67", reason: "fragment of the hex colour #67e8f9" },
  { value: "140", reason: "gradient angle in decorative tints, not a metric" },
  { value: "818", reason: "fragment of the hex colour #818cf8" },
  { value: "48.00", reason: "illustrative amount in a sample request payload" },
  { value: "2291", reason: "illustrative order id in a sample payload" },
  {
    value: "1756458842,",
    reason: "illustrative webhook signature timestamp",
  },
  { value: "1756458841", reason: "illustrative SMTP response sample" },
  { value: "250", reason: "illustrative SMTP response code, not a claim" },
  { value: "2.0.0", reason: "illustrative SMTP enhanced status code" },
  { value: "20020", reason: "fragment of a sample SMTP relay hostname" },
  { value: "10 M", reason: "regex fragment of the 10 MB attachment limit" },
  { value: "78", reason: "fragment of a hex colour in a decorative gradient" },
  { value: "084", reason: "fragment of a hex colour in a decorative gradient" },
  { value: "09", reason: "fragment of a hex colour in a decorative gradient" },
  { value: "3B", reason: "fragment of a hex colour in a decorative gradient" },
  { value: "03", reason: "fragment of a hex colour in a decorative gradient" },
  { value: "64", reason: "fragment of a hex colour in a decorative gradient" },
  { value: "07", reason: "fragment of a hex colour in a decorative gradient" },
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
