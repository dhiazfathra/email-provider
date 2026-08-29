"use client";

import Link from "next/link";
import { PERKS, ROLES } from "@/lib/mock/marketing";
import { useViewport } from "@/lib/useViewport";
import { Card, PageHead, SectionHeading, useGridCols } from "../ui";

export default function PaneCareers() {
  const cols = useGridCols();
  const { mob } = useViewport();

  return (
    <>
      <PageHead
        kicker="Careers"
        title="Nineteen people, one product, no roadmap theatre."
        lead="Pane is remote across eight countries with two weeks a year in the same room. Everyone here ships, including the founders."
        maxWidth={700}
      />
      <div style={{ display: "grid", gridTemplateColumns: cols.feat, gap: 16 }}>
        {PERKS.map((p) => (
          <Card key={p.title} style={{ boxShadow: "none" }}>
            <div
              style={{
                fontSize: 16.5,
                fontWeight: 600,
                letterSpacing: "-.015em",
              }}
            >
              {p.title}
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
              {p.body}
            </div>
          </Card>
        ))}
      </div>

      <section style={{ marginTop: 44 }}>
        <SectionHeading>Open roles</SectionHeading>
        <div
          style={{
            marginTop: 22,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {ROLES.map((r) => (
            <Link
              key={r.title}
              href="/support"
              style={{
                display: "grid",
                gridTemplateColumns: mob ? "1fr" : "minmax(0,1fr) 140px 80px",
                gap: 18,
                alignItems: "center",
                padding: "22px 24px",
                borderRadius: 20,
                background: "rgba(255,255,255,.55)",
                border: "1px solid rgba(255,255,255,.85)",
                color: "inherit",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 16.5,
                    fontWeight: 600,
                    letterSpacing: "-.015em",
                  }}
                >
                  {r.title}
                </div>
                <div style={{ marginTop: 5, fontSize: 13.5, opacity: 0.5 }}>
                  {r.team} · {r.location}
                </div>
              </div>
              <div style={{ fontSize: 13.5, opacity: 0.55 }}>{r.range}</div>
              <span
                style={{ fontSize: 13.5, fontWeight: 500, color: "#5b57c8" }}
              >
                Apply →
              </span>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 18, fontSize: 14, opacity: 0.55 }}>
          Nothing that fits? Send a note to jobs@pane.com describing what you
          would want to work on.
        </div>
      </section>
    </>
  );
}
