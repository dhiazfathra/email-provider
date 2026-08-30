"use client";

import { useState } from "react";
import {
  AUDIT,
  AUDIT_CATEGORIES,
  AUDIT_DOT,
  initialsOf,
} from "@/lib/mock/console";
import { ACTIVITY_RETENTION_DAYS } from "@/lib/limits";
import { Card, COLUMN_HEADER, ELLIPSIS, FilterChip, MONO, Tag } from "../ui";

function categoryTint(category: string): [string, string] {
  if (category === "Security") return ["rgba(192,132,252,.2)", "#8b5cf6"];
  if (category === "Members") return ["rgba(94,234,212,.24)", "#0e8f80"];
  return ["rgba(124,126,242,.16)", "#4c46b8"];
}

export default function ConsoleAudit() {
  const [category, setCategory] = useState<string>("All");

  const cols = "var(--audit-cols)";

  const rows = AUDIT.filter(
    (a) => category === "All" || a.category === category,
  );

  return (
    <>
      <section
        style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 8 }}
      >
        {AUDIT_CATEGORIES.map((c) => (
          <FilterChip
            key={c}
            label={c}
            dot={AUDIT_DOT[c]}
            count={
              c === "All"
                ? AUDIT.length
                : AUDIT.filter((a) => a.category === c).length
            }
            active={category === c}
            onClick={() => setCategory(c)}
          />
        ))}
      </section>

      <Card
        alpha={0.5}
        style={{
          marginTop: 14,
          padding: 8,
          boxShadow: "0 28px 66px -50px rgba(76,66,160,.7)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            gap: 16,
            padding: "12px 16px",
            ...COLUMN_HEADER,
          }}
        >
          <span>Actor</span>
          <span className="wide-only">Action</span>
          <span className="wide-only">Target</span>
          <span className="wide-only">Source</span>
          <span style={{ textAlign: "right" }}>When</span>
        </div>
        {rows.map((a, i) => {
          const [bg, color] = categoryTint(a.category);
          return (
            <div
              key={`${a.when}-${a.target}`}
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  minWidth: 0,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 26,
                    height: 26,
                    flex: "none",
                    borderRadius: 9,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#fff",
                    background: a.tint,
                  }}
                >
                  {initialsOf(a.actor)}
                </span>
                <span style={{ fontSize: 13.5, ...ELLIPSIS }}>{a.actor}</span>
              </div>
              <Tag
                bg={bg}
                color={color}
                style={{ justifySelf: "start", display: "var(--wide-only)" }}
              >
                {a.action}
              </Tag>
              <span
                className="wide-only"
                style={{
                  fontFamily: MONO,
                  fontSize: 12.5,
                  opacity: 0.7,
                  ...ELLIPSIS,
                }}
              >
                {a.target}
              </span>
              <span
                className="wide-only"
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  opacity: 0.45,
                  ...ELLIPSIS,
                }}
              >
                {a.source}
              </span>
              <span
                style={{
                  fontSize: 12.5,
                  opacity: 0.45,
                  textAlign: "right",
                  whiteSpace: "nowrap",
                }}
              >
                {a.when}
              </span>
            </div>
          );
        })}
      </Card>

      <div
        style={{
          marginTop: 14,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          borderRadius: 20,
          background: "rgba(255,255,255,.45)",
          border: "1px solid rgba(255,255,255,.85)",
        }}
      >
        <span style={{ fontSize: 13.5, opacity: 0.55 }}>
          Audit events are immutable and retained for {ACTIVITY_RETENTION_DAYS}{" "}
          days.
        </span>
      </div>
    </>
  );
}
