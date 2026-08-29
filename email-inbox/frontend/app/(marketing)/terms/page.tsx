"use client";

import { TERMS_SECTIONS } from "@/lib/mock/marketing";
import { LegalPage } from "../legal";

export default function PaneTerms() {
  return (
    <LegalPage
      kicker="Terms"
      title="Plain terms, written to be read."
      lead="The full agreement between you and Pane, in the shortest form we could write it without leaving anything out."
      updated="1 August 2026"
      sections={TERMS_SECTIONS}
    />
  );
}
