"use client";

import { HELP_TOPICS, SUPPORT_CHANNELS } from "@/lib/mock/marketing";
import { FeatureCard, PageHead, SectionHeading, useGridCols } from "../ui";

export default function PaneSupport() {
  const cols = useGridCols();

  return (
    <>
      <PageHead
        kicker="Support"
        title="A person answers, usually within an hour."
        lead="Support is staffed by the same team that builds Pane. There is no tier one, and no bot standing in front of it."
        maxWidth={680}
      />
      <div style={{ display: "grid", gridTemplateColumns: cols.feat, gap: 16 }}>
        {SUPPORT_CHANNELS.map((c) => (
          <FeatureCard
            key={c.title}
            glyph={c.glyph}
            title={c.title}
            body={c.body}
            tint={c.tint}
          >
            <div
              style={{
                marginTop: 14,
                fontSize: 13,
                fontWeight: 600,
                color: "#5b57c8",
              }}
            >
              {c.meta}
            </div>
          </FeatureCard>
        ))}
      </div>

      <section style={{ marginTop: 44 }}>
        <SectionHeading>Common answers</SectionHeading>
        <div
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: cols.pair,
            gap: 16,
          }}
        >
          {HELP_TOPICS.map((t) => (
            <div
              key={t.q}
              style={{
                padding: 22,
                borderRadius: 20,
                background: "rgba(255,255,255,.5)",
                border: "1px solid rgba(255,255,255,.85)",
              }}
            >
              <div
                style={{
                  fontSize: 15.5,
                  fontWeight: 600,
                  letterSpacing: "-.015em",
                }}
              >
                {t.q}
              </div>
              <div
                style={{
                  marginTop: 7,
                  fontSize: 14,
                  lineHeight: 1.6,
                  opacity: 0.55,
                  textWrap: "pretty",
                }}
              >
                {t.a}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
