"use client";

import { useState } from "react";
import { AUDIT_DESCRIPTIONS, AUDIT_ENTRIES } from "@/lib/data/audit";
import { AUDIT_CATEGORIES, type AuditCategory } from "@/lib/enums";
import { ACTIVITY_RETENTION_DAYS } from "@/lib/limits";
import { formatCount, relativeTime } from "@/lib/format";
import { gradient } from "@/lib/theme";
import { initialsOf } from "@/lib/mock/console";
import { Card, COLUMN_HEADER, ELLIPSIS, FilterChip, MONO, Tag } from "../ui";

const CATEGORY_TINT: Record<AuditCategory, [string, string]> = {
  keys: ["rgba(124,126,242,.16)", "#4c46b8"],
  domains: ["rgba(139,140,246,.18)", "#4c46b8"],
  templates: ["rgba(103,232,249,.2)", "#0e8f80"],
  suppressions: ["rgba(167,139,250,.18)", "#6d4fd6"],
  members: ["rgba(94,234,212,.24)", "#0e8f80"],
};

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export default function ConsoleAudit() {
  const [category, setCategory] = useState<AuditCategory | "all">("all");

  const cols = "var(--audit-cols)";

  const rows = AUDIT_ENTRIES.filter(
    (a) => category === "all" || a.category === category,
  );

  return (
    <>
      <section
        style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 8 }}
      >
        <FilterChip
          label="All"
          dot="#7c7ef2"
          count={AUDIT_ENTRIES.length}
          active={category === "all"}
          onClick={() => setCategory("all")}
        />
        {AUDIT_CATEGORIES.map((c) => (
          <FilterChip
            key={c}
            label={cap(c)}
            dot={CATEGORY_TINT[c][1]}
            count={AUDIT_ENTRIES.filter((a) => a.category === c).length}
            active={category === c}
            onClick={() => setCategory(c)}
          />
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
          <span>Actor</span>
          <span className="wide-only">Action</span>
          <span className="wide-only">Target</span>
          <span className="wide-only">Source</span>
          <span style={{ textAlign: "right" }}>When</span>
        </div>
        {rows.map((a, i) => {
          const [bg, color] = CATEGORY_TINT[a.category];
          const desc = AUDIT_DESCRIPTIONS[a.id];
          return (
            <div
              key={a.id}
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
                    background: gradient(i),
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
                {desc.action}
              </Tag>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 12.5,
                  opacity: 0.7,
                  ...ELLIPSIS,
                }}
              >
                {desc.target}
              </span>
              <span
                className="wide-only"
                style={{
                  fontFamily: MONO,
                  fontSize: 12.5,
                  opacity: 0.5,
                  ...ELLIPSIS,
                }}
              >
                {a.ip}
              </span>
              <span
                style={{ fontSize: 12.5, opacity: 0.45, textAlign: "right" }}
              >
                {relativeTime(a.at)}
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
          Audit events are immutable and retained for{" "}
          {formatCount(ACTIVITY_RETENTION_DAYS)} days.
        </span>
      </div>
    </>
  );
}
