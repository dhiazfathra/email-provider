"use client";

import { INCIDENTS, SERVICES, uptimeBars } from "@/lib/mock/marketing";
import { useViewport } from "@/lib/useViewport";
import { PageHead, SectionHeading, useGridCols } from "../ui";

export default function PaneStatus() {
  const { mob } = useViewport();
  const cols = useGridCols();

  return (
    <>
      <PageHead
        kicker="Status"
        title="All systems operational."
        lead="Uptime measured from external probes in six regions, refreshed every 30 seconds."
        maxWidth={640}
      />
      <div
        style={{
          padding: 8,
          borderRadius: 26,
          background: "rgba(255,255,255,.5)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          border: "1px solid rgba(255,255,255,.85)",
          boxShadow: "0 30px 70px -48px rgba(76,66,160,.7)",
        }}
      >
        {SERVICES.map((s, si) => (
          <div
            key={s.name}
            style={{
              display: "grid",
              gridTemplateColumns: mob
                ? "1fr auto"
                : "minmax(0,1fr) auto 120px",
              gap: 18,
              alignItems: "center",
              padding: "16px 18px",
              borderRadius: 20,
              background: si % 2 ? "transparent" : "rgba(255,255,255,.5)",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: s.degraded ? "#c084fc" : "#5eead4",
                  }}
                />
                <span style={{ fontSize: 15, fontWeight: 600 }}>{s.name}</span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  opacity: 0.5,
                  marginTop: 3,
                  paddingLeft: 17,
                }}
              >
                {s.note}
              </div>
            </div>
            {!mob && (
              <div
                aria-hidden
                style={{
                  display: "flex",
                  gap: 3,
                  alignItems: "flex-end",
                  height: 26,
                }}
              >
                {uptimeBars(34, si, s.degraded).map((b, i) => (
                  <span
                    key={i}
                    style={{
                      width: 5,
                      borderRadius: 3,
                      height: b.h,
                      background: b.color,
                    }}
                  />
                ))}
              </div>
            )}
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: s.degraded ? "#8b5cf6" : "#0e9488",
                }}
              >
                {s.status}
              </div>
              <div style={{ fontSize: 12.5, opacity: 0.45, marginTop: 2 }}>
                {s.uptime} / 90d
              </div>
            </div>
          </div>
        ))}
      </div>

      <section style={{ marginTop: 44 }}>
        <SectionHeading>Recent incidents</SectionHeading>
        <div
          style={{
            marginTop: 22,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {INCIDENTS.map((i) => (
            <div
              key={i.title}
              style={{
                display: "grid",
                gridTemplateColumns: cols.log,
                gap: 24,
                padding: 24,
                borderRadius: 22,
                background: "rgba(255,255,255,.52)",
                border: "1px solid rgba(255,255,255,.85)",
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{i.date}</div>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: 9,
                    fontSize: 11.5,
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: 9,
                    background:
                      i.severity === "Major"
                        ? "rgba(192,132,252,.2)"
                        : "rgba(124,126,242,.16)",
                    color: "#4c46b8",
                  }}
                >
                  {i.severity}
                </span>
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "-.015em",
                  }}
                >
                  {i.title}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 14.5,
                    lineHeight: 1.6,
                    opacity: 0.58,
                    textWrap: "pretty",
                  }}
                >
                  {i.body}
                </div>
                <div style={{ marginTop: 10, fontSize: 13, opacity: 0.45 }}>
                  Resolved in {i.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
