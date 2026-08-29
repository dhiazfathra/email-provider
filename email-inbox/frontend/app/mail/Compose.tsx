"use client";

import { DRAFT } from "@/lib/mock/mail";
import { useMail } from "./state";

/**
 * Compose surface. `popup` is the docked variant over the list, which can also
 * be minimised to its header bar.
 */
export function Compose({
  popup = false,
  minimized = false,
  onToggle,
  onClose,
}: {
  popup?: boolean;
  minimized?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}) {
  const { theme } = useMail();
  const expanded = !(popup && minimized);

  const iconButton = {
    width: 26,
    height: 26,
    borderRadius: 8,
    display: "grid",
    placeItems: "center",
    fontSize: 13,
    fontFamily: "inherit",
    cursor: "pointer",
    color: theme.soft(0.55),
    background: theme.card,
    border: `1px solid ${theme.cardEdge}`,
  };

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
        borderRadius: popup ? "22px 22px 0 0" : 26,
        background: theme.dark
          ? theme.glass
          : `rgba(255,255,255,${popup ? 0.62 : 0.46})`,
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        border: `1px solid ${theme.edge}`,
        boxShadow: popup
          ? "0 -20px 60px -30px rgba(76,66,160,.7)"
          : "0 30px 70px -40px rgba(76,66,160,.55)",
        overflow: "hidden",
        color: theme.fg,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: popup ? "13px 18px" : "18px 24px",
          borderBottom: "1px solid rgba(124,126,242,.14)",
          background: popup
            ? theme.dark
              ? "transparent"
              : "rgba(255,255,255,.35)"
            : "transparent",
        }}
      >
        <span
          style={{
            fontSize: popup ? 14 : 16,
            fontWeight: 600,
            letterSpacing: "-.02em",
          }}
        >
          New message
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 6 }}>
          {popup && (
            <button
              type="button"
              onClick={onToggle}
              aria-label={minimized ? "Expand draft" : "Minimise draft"}
              aria-expanded={expanded}
              style={iconButton}
            >
              {minimized ? "▢" : "—"}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Discard draft"
            style={iconButton}
          >
            ✕
          </button>
        </div>
      </div>

      {expanded && (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            padding: popup ? "4px 18px 16px" : "18px 40px 28px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: popup ? "100%" : 760,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "13px 4px",
                borderBottom: "1px solid rgba(124,126,242,.13)",
              }}
            >
              <span style={{ fontSize: 13, width: 38, opacity: 0.45 }}>
                To
              </span>
              {DRAFT.to.map((r) => (
                <span
                  key={r.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "5px 11px 5px 5px",
                    borderRadius: 11,
                    background: "rgba(124,126,242,.13)",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 7,
                      background: r.avatar,
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    {r.name}
                  </span>
                  <span style={{ fontSize: 12, opacity: 0.4 }}>✕</span>
                </span>
              ))}
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 12.5, opacity: 0.4 }}>Cc · Bcc</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "13px 4px",
                borderBottom: "1px solid rgba(124,126,242,.13)",
              }}
            >
              <span style={{ fontSize: 13, width: 38, opacity: 0.45 }}>
                Subject
              </span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                {DRAFT.subject}
              </span>
            </div>

            <div
              style={{
                flex: 1,
                minHeight: 0,
                padding: "20px 4px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                fontSize: 14.5,
                lineHeight: 1.65,
                color: theme.soft(0.8),
                overflowY: "auto",
              }}
            >
              {DRAFT.paragraphs.map((p) => (
                <p key={p} style={{ margin: 0, textWrap: "pretty" }}>
                  {p}
                </p>
              ))}
              <span
                aria-hidden
                style={{
                  display: "inline-block",
                  width: 1.5,
                  height: 19,
                  background: "#7c7ef2",
                  borderRadius: 1,
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 4px 2px",
                borderTop: "1px solid rgba(124,126,242,.14)",
              }}
            >
              <button
                type="button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 24px",
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
                Send
                <span aria-hidden style={{ opacity: 0.7 }}>
                  ➤
                </span>
              </button>
              <div style={{ display: "flex", gap: 4 }}>
                {DRAFT.tools.map((t) => (
                  <span
                    key={t}
                    aria-hidden
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 11,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 14,
                      color: theme.soft(0.5),
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 12, opacity: 0.4 }}>Draft saved</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
