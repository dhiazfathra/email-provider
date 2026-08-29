"use client";

import { DOMAINS } from "@/lib/mock/console";
import { Card, ELLIPSIS, MONO, Tag } from "../ui";

export default function ConsoleDomains() {
  return (
    <section
      style={{
        marginTop: 24,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {DOMAINS.map((d) => {
        const verified = d.state === "Verified";
        return (
          <Card
            key={d.name}
            style={{
              padding: 24,
              boxShadow: "0 24px 60px -50px rgba(76,66,160,.7)",
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
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: "-.02em",
                  fontFamily: MONO,
                }}
              >
                {d.name}
              </span>
              <Tag
                bg={verified ? "rgba(94,234,212,.24)" : "rgba(167,139,250,.2)"}
                color={verified ? "#0e8f80" : "#6d4fd6"}
              >
                {d.state}
              </Tag>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 13, opacity: 0.5 }}>{d.volume}</span>
            </div>
            <div
              style={{
                marginTop: 16,
                display: "grid",
                gridTemplateColumns: "var(--dns-cols)",
                gap: 10,
              }}
            >
              {d.records.map((r) => (
                <div
                  key={r.type}
                  style={{
                    padding: 14,
                    borderRadius: 16,
                    background: r.ok
                      ? "rgba(255,255,255,.55)"
                      : "rgba(192,132,252,.09)",
                    border: "1px solid rgba(255,255,255,.9)",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: r.ok ? "#5eead4" : "#c084fc",
                      }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {r.type}
                    </span>
                    <div style={{ flex: 1 }} />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: r.ok ? "#0e8f80" : "#8b5cf6",
                      }}
                    >
                      {r.state}
                    </span>
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontFamily: MONO,
                      fontSize: 11.5,
                      opacity: 0.5,
                      ...ELLIPSIS,
                    }}
                  >
                    {r.value}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </section>
  );
}
