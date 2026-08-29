"use client";

import { PRIVACY_SECTIONS } from "@/lib/mock/marketing";
import { LegalPage } from "../legal";

export default function PanePrivacy() {
  return (
    <LegalPage
      kicker="Privacy"
      title="We keep your mail. That is the whole arrangement."
      lead="This policy explains what Pane stores, what it never does, and how to get everything back or deleted."
      updated="12 August 2026"
      sections={PRIVACY_SECTIONS}
    />
  );
}
