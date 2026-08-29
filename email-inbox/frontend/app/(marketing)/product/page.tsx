"use client";

import { FEATURES, PILLARS } from "@/lib/mock/marketing";
import {
  Card,
  FeatureCard,
  GlyphTile,
  PageHead,
  SectionHeading,
  useGridCols,
} from "../ui";

export default function PaneProduct() {
  const cols = useGridCols();

  return (
    <>
      <PageHead
        kicker="Product"
        title="Four surfaces, one job: get you out of your inbox."
        lead="Sorting, reading, writing and scheduling are separate problems. Pane gives each one its own surface instead of stacking them in a single list."
        maxWidth={760}
      />
      <div style={{ display: "grid", gridTemplateColumns: cols.pair, gap: 16 }}>
        {PILLARS.map((p) => (
          <Card key={p.title} style={{ padding: 26, borderRadius: 24 }}>
            <GlyphTile glyph={p.glyph} tint={p.tint} />
            <div
              style={{
                marginTop: 16,
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-.02em",
              }}
            >
              {p.title}
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 14.5,
                lineHeight: 1.6,
                opacity: 0.55,
                textWrap: "pretty",
              }}
            >
              {p.body}
            </div>
            <div
              style={{
                marginTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 7,
              }}
            >
              {p.points.map((pt) => (
                <div
                  key={pt}
                  style={{
                    display: "flex",
                    gap: 9,
                    alignItems: "flex-start",
                    fontSize: 13.5,
                    opacity: 0.6,
                  }}
                >
                  <span style={{ color: "#7c7ef2", fontWeight: 600 }}>—</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <section style={{ marginTop: 44 }}>
        <SectionHeading>Everything else it does</SectionHeading>
        <div
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: cols.feat,
            gap: 16,
          }}
        >
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>
    </>
  );
}
