"use client";

import { useEffect, useState } from "react";
import { relativeTime } from "@/lib/format";

export function SentAt({ iso }: { iso: string }) {
  const [label, setLabel] = useState(
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }),
  );
  // Deliberate: the effect exists solely to diverge from the SSR-safe
  // absolute-date fallback once the client clock is available, avoiding a
  // hydration mismatch (spec risk R5).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setLabel(relativeTime(iso)), [iso]);
  return <span title={iso}>{label}</span>;
}
