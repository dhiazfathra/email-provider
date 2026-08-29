"use client";

import { COMPLIANCE, SECURITY } from "@/lib/mock/marketing";
import { useViewport } from "@/lib/useViewport";
import { FeatureCard, PageHead, SectionHeading, useGridCols } from "../ui";

export default function PaneSecurity() {
  const cols = useGridCols();
  const { mob } = useViewport();

  return (
    <>
      <PageHead
        kicker="Security"
        title="Your mail is not our training data."
        lead="Pane is paid for by subscriptions, so there is nothing to gain from reading your inbox. Sorting runs on metadata and sender reputation, never on message bodies sold onward."
        maxWidth={740}
      />
      <div style={{ display: "grid", gridTemplateColumns: cols.feat, gap: 16 }}>
        {SECURITY.map((s) => (
          <FeatureCard key={s.title} {...s} />
        ))}
      </div>

      <section
        style={{
          marginTop: 34,
          padding: mob ? 26 : "38px 40px",
          borderRadius: 30,
          background: "rgba(255,255,255,.5)",
          backdropFilter: "blur(26px)",
          WebkitBackdropFilter: "blur(26px)",
          border: "1px solid rgba(255,255,255,.78)",
        }}
      >
        <SectionHeading>Compliance and reports</SectionHeading>
        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {COMPLIANCE.map((c, i) => (
            <div
              key={c.name}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0,1fr) auto",
                gap: 16,
                alignItems: "center",
                padding: "14px 16px",
                borderRadius: 16,
                background: i % 2 ? "transparent" : "rgba(255,255,255,.5)",
              }}
            >
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 13, opacity: 0.5, marginTop: 2 }}>
                  {c.note}
                </div>
              </div>
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#4c46b8",
                  padding: "6px 12px",
                  borderRadius: 10,
                  background: "rgba(124,126,242,.14)",
                }}
              >
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
