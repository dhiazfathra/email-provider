"use client";

import { useViewport } from "@/lib/useViewport";
import { SUPPRESS_STATS, SUPPRESSIONS } from "@/lib/mock/console";
import { Card, COLUMN_HEADER, ELLIPSIS, MONO, Tag } from "../ui";

function reasonTint(reason: string): [string, string] {
  if (reason === "Complaint") return ["rgba(192,132,252,.2)", "#8b5cf6"];
  if (reason === "Unsubscribed") return ["rgba(103,232,249,.22)", "#4c46b8"];
  return ["rgba(167,139,250,.18)", "#4c46b8"];
}

export default function ConsoleSuppressions() {
  const { narrow, mob } = useViewport();
  const cols = mob
    ? "minmax(0,1fr) auto"
    : "minmax(0,1.4fr) 140px minmax(0,1fr) 80px";

  return (
    <>
      <section
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: mob
            ? "1fr"
            : narrow
              ? "repeat(2,minmax(0,1fr))"
              : "repeat(4,minmax(0,1fr))",
          gap: 14,
        }}
      >
        {SUPPRESS_STATS.map((s) => (
          <Card
            key={s.label}
            alpha={0.58}
            style={{ padding: 20, borderRadius: 22 }}
          >
            <div style={{ fontSize: 12.5, fontWeight: 500, opacity: 0.5 }}>
              {s.label}
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 27,
                fontWeight: 600,
                letterSpacing: "-.035em",
              }}
            >
              {s.value}
            </div>
            <div style={{ marginTop: 4, fontSize: 12.5, opacity: 0.45 }}>
              {s.note}
            </div>
          </Card>
        ))}
      </section>

      <Card alpha={0.5} style={{ marginTop: 14, padding: 8 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            gap: 16,
            padding: "12px 16px",
            ...COLUMN_HEADER,
          }}
        >
          <span>Address</span>
          {!mob && <span>Reason</span>}
          {!mob && <span>Source</span>}
          <span style={{ textAlign: "right" }}>Added</span>
        </div>
        {SUPPRESSIONS.map((s, i) => {
          const [bg, color] = reasonTint(s.reason);
          return (
            <div
              key={s.address}
              style={{
                display: "grid",
                gridTemplateColumns: cols,
                gap: 16,
                alignItems: "center",
                padding: "14px 16px",
                borderRadius: 17,
                background: i % 2 ? "transparent" : "rgba(255,255,255,.5)",
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 12.5, ...ELLIPSIS }}>
                {s.address}
              </span>
              {!mob && (
                <Tag bg={bg} color={color} style={{ justifySelf: "start" }}>
                  {s.reason}
                </Tag>
              )}
              {!mob && (
                <span style={{ fontSize: 13, opacity: 0.5, ...ELLIPSIS }}>
                  {s.source}
                </span>
              )}
              <span
                style={{ fontSize: 12.5, opacity: 0.45, textAlign: "right" }}
              >
                {s.added}
              </span>
            </div>
          );
        })}
      </Card>
    </>
  );
}
