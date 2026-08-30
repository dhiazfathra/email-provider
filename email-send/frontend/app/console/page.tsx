"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useViewport } from "@/lib/useViewport";
import {
  CHART_LEGEND,
  deliverySeries,
  kpisForRange,
  REPUTATION,
  sparkBars,
  STREAMS,
} from "@/lib/mock/console";
import { DEFAULT_RANGE, isRange } from "@/lib/ranges";
import { Card } from "./ui";

const CHART_POINTS = { "24h": 8, "7d": 14, "30d": 30 } as const;

export default function ConsoleOverview() {
  return (
    <Suspense fallback={null}>
      <ConsoleOverviewInner />
    </Suspense>
  );
}

function ConsoleOverviewInner() {
  const { mob } = useViewport();
  const searchParams = useSearchParams();
  const rangeParam = searchParams.get("range") ?? undefined;
  const range = isRange(rangeParam) ? rangeParam : DEFAULT_RANGE;
  const KPIS = kpisForRange(range);
  // Bar counts change the number of DOM nodes, not the box they sit in, so
  // this one stays in JS — it cannot shift the layout.
  const chart = deliverySeries(
    mob ? Math.min(7, CHART_POINTS[range]) : CHART_POINTS[range],
  );

  return (
    <>
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "var(--kpi-cols)",
          gap: 14,
          marginTop: 26,
        }}
      >
        {KPIS.map((k, i) => (
          <Card
            key={k.label}
            alpha={0.58}
            blur={20}
            style={{
              padding: 20,
              borderRadius: 22,
              boxShadow: "0 24px 60px -46px rgba(76,66,160,.7)",
            }}
          >
            <div style={{ fontSize: 12.5, fontWeight: 500, opacity: 0.5 }}>
              {k.label}
            </div>
            <div
              style={{
                marginTop: 9,
                display: "flex",
                alignItems: "baseline",
                gap: 9,
              }}
            >
              <span
                style={{
                  fontSize: 29,
                  fontWeight: 600,
                  letterSpacing: "-.035em",
                }}
              >
                {k.value}
              </span>
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: k.deltaColor,
                }}
              >
                {k.delta}
              </span>
            </div>
            <div
              aria-hidden
              style={{
                marginTop: 12,
                display: "flex",
                gap: 3,
                alignItems: "flex-end",
                height: 30,
              }}
            >
              {sparkBars(mob ? 16 : 22, i + 1, k.dip).map((b, j) => (
                <span
                  key={j}
                  style={{
                    flex: 1,
                    borderRadius: 3,
                    height: b.h,
                    background: b.color,
                  }}
                />
              ))}
            </div>
          </Card>
        ))}
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "var(--console-split-cols)",
          gap: 14,
          marginTop: 14,
          alignItems: "start",
        }}
      >
        <Card
          style={{
            padding: 24,
            boxShadow: "0 28px 66px -48px rgba(76,66,160,.7)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-.02em" }}
            >
              Delivery over time
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              {CHART_LEGEND.map((l) => (
                <div
                  key={l.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: 12.5,
                    opacity: 0.6,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: 3,
                      background: l.color,
                    }}
                  />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: 22,
              display: "flex",
              gap: "var(--chart-gap)",
              alignItems: "flex-end",
              height: 210,
            }}
          >
            {chart.map((c) => (
              <div
                key={c.label}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  gap: 2,
                  height: "100%",
                }}
              >
                <span
                  style={{
                    borderRadius: "4px 4px 0 0",
                    height: c.bounced,
                    background: "#c084fc",
                  }}
                />
                <span style={{ height: c.opened, background: "#67e8f9" }} />
                <span
                  style={{
                    borderRadius: "0 0 4px 4px",
                    height: c.delivered,
                    background: "linear-gradient(180deg,#8b8cf6,#7c7ef2)",
                  }}
                />
                <span
                  style={{
                    fontSize: 10.5,
                    opacity: 0.4,
                    textAlign: "center",
                    marginTop: 6,
                  }}
                >
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card style={{ padding: 22 }}>
            <div
              style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-.02em" }}
            >
              Top streams
            </div>
            <div
              style={{
                marginTop: 14,
                display: "flex",
                flexDirection: "column",
                gap: 13,
              }}
            >
              {STREAMS.map((s) => (
                <div key={s.name}>
                  <div
                    style={{ display: "flex", alignItems: "baseline", gap: 10 }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        flex: 1,
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {s.name}
                    </span>
                    <span style={{ fontSize: 13, opacity: 0.5 }}>
                      {s.count}
                    </span>
                  </div>
                  <div
                    style={{
                      marginTop: 7,
                      height: 6,
                      borderRadius: 4,
                      background: "rgba(124,126,242,.14)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: s.pct,
                        height: "100%",
                        borderRadius: 4,
                        background: s.tint,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ padding: 22 }}>
            <div
              style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-.02em" }}
            >
              Reputation
            </div>
            <div
              style={{
                marginTop: 14,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {REPUTATION.map((r, i) => (
                <div
                  key={r.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 14,
                    background: i % 2 ? "transparent" : "rgba(255,255,255,.55)",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: r.color === "#0e8f80" ? "#5eead4" : "#c084fc",
                    }}
                  />
                  <span style={{ flex: 1, minWidth: 0, fontSize: 13.5 }}>
                    {r.label}
                  </span>
                  <span
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: r.color,
                    }}
                  >
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
