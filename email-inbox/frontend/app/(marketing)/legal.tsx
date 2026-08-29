"use client";

import Link from "next/link";
import { Card, PageHead, useGridCols } from "./ui";

/** Shared body for /privacy and /terms — same layout, different sections. */
export function LegalPage({
  kicker,
  title,
  lead,
  updated,
  sections,
}: {
  kicker: string;
  title: string;
  lead: string;
  updated: string;
  sections: { title: string; body: string }[];
}) {
  const cols = useGridCols();

  return (
    <>
      <PageHead
        kicker={kicker}
        title={title}
        lead={lead}
        updated={updated}
        maxWidth={700}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: cols.pair,
          gap: 16,
          alignItems: "start",
        }}
      >
        {sections.map((s) => (
          <Card key={s.title} style={{ padding: 26 }}>
            <div
              style={{
                fontSize: 16.5,
                fontWeight: 600,
                letterSpacing: "-.015em",
              }}
            >
              {s.title}
            </div>
            <div
              style={{
                marginTop: 9,
                fontSize: 14.5,
                lineHeight: 1.65,
                opacity: 0.58,
                textWrap: "pretty",
              }}
            >
              {s.body}
            </div>
          </Card>
        ))}
      </div>

      <section
        style={{
          marginTop: 34,
          padding: "var(--cta-pad)",
          borderRadius: 30,
          background: "rgba(255,255,255,.5)",
          backdropFilter: "blur(26px)",
          WebkitBackdropFilter: "blur(26px)",
          border: "1px solid rgba(255,255,255,.78)",
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1, minWidth: 260 }}>
          <div
            style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-.02em" }}
          >
            Questions about this document?
          </div>
          <div style={{ marginTop: 7, fontSize: 14.5, opacity: 0.55 }}>
            Write to legal@pane.com and a person will answer within two working
            days.
          </div>
        </div>
        <Link
          href="/support"
          style={{
            padding: "13px 22px",
            borderRadius: 14,
            fontSize: 14.5,
            fontWeight: 500,
            color: "#5b57c8",
            background: "rgba(255,255,255,.8)",
            border: "1px solid rgba(255,255,255,.95)",
          }}
        >
          Contact support
        </Link>
      </section>
    </>
  );
}
