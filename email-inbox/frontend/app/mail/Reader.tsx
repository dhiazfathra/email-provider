"use client";

import { THREAD_BODY, initialsOf } from "@/lib/mock/mail";
import { useMail, useSelectedThread } from "./state";

/** Thread view. `compact` is the split-pane and tablet variant. */
export function Reader({ compact }: { compact: boolean }) {
  const { theme } = useMail();
  const thread = useSelectedThread();
  const email = `${thread.sender.split(" ")[0].toLowerCase()}@studio.co`;

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: 26,
        background: theme.dark ? theme.glass : "rgba(255,255,255,.46)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        border: `1px solid ${theme.edge}`,
        boxShadow: "0 30px 70px -40px rgba(76,66,160,.55)",
        overflow: "hidden",
        color: theme.fg,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(124,126,242,.14)",
        }}
      >
        {THREAD_BODY.actions.map((a) => (
          <button
            key={a.label}
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "7px 12px",
              borderRadius: 11,
              fontSize: 12.5,
              fontWeight: 500,
              fontFamily: "inherit",
              cursor: "pointer",
              color: theme.soft(0.7),
              background: theme.card,
              border: `1px solid ${theme.cardEdge}`,
            }}
          >
            <span aria-hidden style={{ opacity: 0.6 }}>
              {a.glyph}
            </span>
            {a.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, opacity: 0.42 }}>1 of 12</span>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          padding: compact ? "24px 24px" : "34px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <div
          style={{
            maxWidth: 760,
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h1
              style={{
                margin: 0,
                fontSize: compact ? 22 : 30,
                fontWeight: 600,
                letterSpacing: "-.025em",
                lineHeight: 1.2,
                textWrap: "pretty",
              }}
            >
              {thread.subject}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                aria-hidden
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 15,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#fff",
                  background: "linear-gradient(140deg,#8b8cf6,#a78bfa)",
                }}
              >
                {initialsOf(thread.sender)}
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  minWidth: 0,
                }}
              >
                <span style={{ fontSize: 14.5, fontWeight: 600 }}>
                  {thread.sender}
                </span>
                <span style={{ fontSize: 12.5, opacity: 0.45 }}>
                  {email} · to me
                </span>
              </div>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 12.5, opacity: 0.45 }}>
                {thread.time}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 15,
              padding: "24px 26px",
              borderRadius: 20,
              background: theme.card,
              border: `1px solid ${theme.cardEdge}`,
              fontSize: 14.5,
              lineHeight: 1.65,
              color: theme.soft(0.82),
            }}
          >
            {THREAD_BODY.paragraphs.map((p) => (
              <p key={p} style={{ margin: 0, textWrap: "pretty" }}>
                {p}
              </p>
            ))}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                paddingTop: 4,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 500, color: theme.fg }}>
                {thread.sender}
              </span>
              <span style={{ fontSize: 12.5, opacity: 0.55 }}>
                {THREAD_BODY.signRole}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {THREAD_BODY.files.map((f) => (
              <button
                key={f.name}
                type="button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "12px 15px",
                  borderRadius: 15,
                  fontFamily: "inherit",
                  color: "inherit",
                  cursor: "pointer",
                  background: theme.card,
                  border: `1px solid ${theme.cardEdge}`,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: f.tint,
                  }}
                />
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    {f.name}
                  </span>
                  <span style={{ fontSize: 11.5, opacity: 0.45 }}>
                    {f.size}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              style={{
                padding: "11px 22px",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "inherit",
                cursor: "pointer",
                border: "none",
                color: "#fff",
                background: "linear-gradient(135deg,#7c7ef2,#a78bfa)",
                boxShadow: "0 12px 26px -14px rgba(124,126,242,.95)",
              }}
            >
              Reply
            </button>
            <button
              type="button"
              style={{
                padding: "11px 22px",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "inherit",
                cursor: "pointer",
                color: theme.soft(0.7),
                background: theme.card,
                border: `1px solid ${theme.cardEdge}`,
              }}
            >
              Forward
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
