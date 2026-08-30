"use client";

import { KEYS } from "@/lib/data/keys";
import { SNIPPET } from "@/lib/data/domains";
import { maskKey } from "@/lib/format";
import { SentAt } from "../activity/sent-at";
import { Card, CodeBlock, MONO } from "../ui";

export default function ConsoleKeys() {
  const cols = "var(--key-cols)";

  return (
    <section
      style={{
        marginTop: 24,
        display: "grid",
        gridTemplateColumns: "var(--console-split-cols)",
        gap: 14,
        alignItems: "start",
      }}
    >
      <Card alpha={0.5} style={{ padding: 8 }}>
        {KEYS.map((k, i) => (
          <div
            key={k.prefix}
            style={{
              display: "grid",
              gridTemplateColumns: cols,
              gap: 16,
              alignItems: "center",
              padding: "16px 18px",
              borderRadius: 18,
              background: i % 2 ? "transparent" : "rgba(255,255,255,.55)",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>{k.name}</div>
              <div
                style={{
                  marginTop: 4,
                  fontFamily: MONO,
                  fontSize: 12,
                  opacity: 0.45,
                }}
              >
                {maskKey(k.prefix, k.last4)}
              </div>
            </div>
            <span
              className="wide-only"
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: 9,
                background:
                  k.scope === "Full access"
                    ? "rgba(124,126,242,.18)"
                    : "rgba(103,232,249,.22)",
                color: "#4c46b8",
                justifySelf: "start",
              }}
            >
              {k.scope}
            </span>
            <span style={{ fontSize: 12.5, opacity: 0.5, textAlign: "right" }}>
              <SentAt iso={k.used_at} />
            </span>
          </div>
        ))}
      </Card>

      <div
        style={{
          padding: 22,
          borderRadius: 24,
          background: "rgba(38,35,74,.92)",
          color: "#dcd9ff",
          boxShadow: "0 28px 66px -44px rgba(76,66,160,.9)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
            Send your first message
          </span>
          <div style={{ flex: 1 }} />
          <span
            style={{
              fontSize: 12,
              padding: "4px 9px",
              borderRadius: 8,
              background: "rgba(124,126,242,.35)",
              color: "#e5e3ff",
            }}
          >
            cURL
          </span>
        </div>
        <CodeBlock
          lines={SNIPPET.map((line) => ({ line, color: "#dcd9ff" }))}
          style={{ marginTop: 16 }}
        />
      </div>
    </section>
  );
}
