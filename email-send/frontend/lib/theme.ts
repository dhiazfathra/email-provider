import type { MessageState } from "@/lib/enums";

/** D11 — colour is keyed by enum member, at the render site. */
const STATE_TINTS: Record<MessageState, { bg: string; fg: string }> = {
  queued: { bg: "rgba(124,126,242,.16)", fg: "#4c46b8" },
  delivered: { bg: "rgba(94,234,212,.24)", fg: "#0e8f80" },
  bounced: { bg: "rgba(192,132,252,.22)", fg: "#8b5cf6" },
  deferred: { bg: "rgba(167,139,250,.16)", fg: "#6d4fd6" },
  suppressed: { bg: "rgba(148,163,184,.22)", fg: "#475569" },
};

export const stateTint = (state: MessageState) => STATE_TINTS[state];

export const GRADIENTS = [
  "linear-gradient(140deg,#7c7ef2,#a78bfa)",
  "linear-gradient(140deg,#7dd3fc,#818cf8)",
  "linear-gradient(140deg,#67e8f9,#5eead4)",
  "linear-gradient(140deg,#c4b5fd,#8b8cf6)",
  "linear-gradient(140deg,#c084fc,#f0abfc)",
] as const;

export const gradient = (i: number): string => GRADIENTS[i % GRADIENTS.length];
