"use client";

import { useRouter } from "next/navigation";
import {
  AV,
  CATEGORIES,
  EMAILS,
  TAG_TINT,
  initialsOf,
} from "@/lib/mock/mail";
import { useMail } from "./state";

const ELLIPSIS = {
  whiteSpace: "nowrap" as const,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

/**
 * The inbox list. `compact` is the split-pane and mobile layout, where the
 * sender and subject stack instead of sitting side by side.
 */
export function EmailList({ compact }: { compact: boolean }) {
  const {
    theme,
    category,
    setCategory,
    selectedId,
    setSelectedId,
    isMobile,
    isTablet,
    isDesktop,
  } = useMail();
  const router = useRouter();

  const rows = EMAILS.filter((e) => e.category === category);
  const showPreview = !compact && !isTablet;
  const showTags = !compact && !isTablet;

  return (
    <section
      style={{
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: 26,
        background: theme.glass,
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        border: `1px solid ${theme.edge}`,
        boxShadow: "0 30px 70px -40px rgba(76,66,160,.55)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: isMobile ? "16px 16px 10px" : "20px 24px 14px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: isMobile ? 19 : 21,
            fontWeight: 600,
            letterSpacing: "-.02em",
          }}
        >
          Inbox
        </h1>
        <span
          style={{
            fontSize: 12.5,
            fontWeight: 500,
            padding: "3px 9px",
            borderRadius: 8,
            background: theme.chipBg,
            color: theme.chipFg,
          }}
        >
          12 new
        </span>
        <div style={{ flex: 1 }} />
        {isDesktop && (
          <div style={{ display: "flex", gap: 6 }}>
            {["All", "Unread", "Attachments"].map((f, i) => (
              <span
                key={f}
                style={{
                  fontSize: 13,
                  fontWeight: i === 0 ? 600 : 400,
                  padding: "6px 13px",
                  borderRadius: 10,
                  color: i === 0 ? theme.accent : theme.soft(0.6),
                  background: i === 0 ? theme.selected : "transparent",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          padding: isMobile ? "0 12px 10px" : "0 20px 12px",
          flex: "none",
        }}
      >
        {CATEGORIES.map((c) => {
          const on = category === c.label;
          const count = EMAILS.filter(
            (e) => e.category === c.label && e.unread,
          ).length;
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => setCategory(c.label)}
              aria-pressed={on}
              title={c.label}
              style={{
                flex: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 13px 7px 7px",
                borderRadius: 13,
                fontFamily: "inherit",
                cursor: "pointer",
                background: on
                  ? theme.dark
                    ? "rgba(124,126,242,.34)"
                    : "rgba(255,255,255,.88)"
                  : theme.card,
                border: `1px solid ${
                  on
                    ? theme.dark
                      ? "rgba(160,158,255,.55)"
                      : "rgba(124,126,242,.45)"
                    : theme.cardEdge
                }`,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 24,
                  height: 24,
                  flex: "none",
                  borderRadius: 8,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 12,
                  color: "#fff",
                  background: c.logo,
                }}
              >
                {c.glyph}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: on ? 600 : 400,
                  color: on ? theme.accent : theme.soft(0.62),
                  whiteSpace: "nowrap",
                }}
              >
                {c.label}
              </span>
              {count > 0 && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 6px",
                    borderRadius: 7,
                    color: on ? "#fff" : theme.accentSoft,
                    background: on ? "#7c7ef2" : theme.chipBg,
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          padding: isMobile ? "0 8px 8px" : "0 12px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {rows.map((e, i) => {
          const active = compact && e.id === selectedId;
          const [tagColor, tagBg] = TAG_TINT[e.tag] ?? TAG_TINT[""];
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => {
                setSelectedId(e.id);
                router.push(compact ? "/mail/split" : "/mail/read");
              }}
              style={{
                display: "grid",
                gridTemplateColumns: compact
                  ? "38px minmax(0,1fr)"
                  : "38px minmax(0,1fr) auto",
                alignItems: "center",
                gap: isMobile ? 11 : 14,
                padding: isMobile ? "11px 12px" : "13px 16px",
                borderRadius: 16,
                textAlign: "left",
                fontFamily: "inherit",
                color: "inherit",
                cursor: "pointer",
                background: active
                  ? theme.dark
                    ? "rgba(124,126,242,.34)"
                    : "rgba(255,255,255,.9)"
                  : e.unread
                    ? theme.dark
                      ? "rgba(58,56,96,.6)"
                      : "rgba(255,255,255,.72)"
                    : theme.dark
                      ? "rgba(46,44,78,.36)"
                      : "rgba(255,255,255,.34)",
                border: `1px solid ${
                  active
                    ? "rgba(124,126,242,.5)"
                    : e.unread
                      ? theme.cardEdge
                      : theme.dark
                        ? "rgba(148,150,220,.1)"
                        : "rgba(255,255,255,.5)"
                }`,
                boxShadow:
                  e.unread || active
                    ? "0 10px 24px -18px rgba(76,66,160,.7)"
                    : "none",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 13,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#fff",
                  background: AV[i % AV.length],
                }}
              >
                {initialsOf(e.sender)}
              </span>
              <span
                style={{
                  display: "flex",
                  flexDirection: compact ? "column" : "row",
                  alignItems: compact ? "stretch" : "center",
                  gap: compact ? 3 : 14,
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    minWidth: 0,
                    flex: compact ? "0 0 auto" : "0 0 176px",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      flex: "none",
                      background: e.unread ? "#7c7ef2" : "transparent",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: e.unread ? 600 : 400,
                      ...ELLIPSIS,
                    }}
                  >
                    {e.sender}
                  </span>
                  {compact && (
                    <span
                      style={{
                        marginLeft: "auto",
                        flex: "none",
                        fontSize: 12,
                        opacity: 0.45,
                      }}
                    >
                      {e.time}
                    </span>
                  )}
                </span>
                <span
                  style={{
                    minWidth: 0,
                    display: "flex",
                    alignItems: "baseline",
                    gap: 9,
                    paddingLeft: compact ? 13 : 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: compact ? 13.5 : 14,
                      fontWeight: compact ? 400 : e.unread ? 600 : 400,
                      color: compact ? theme.soft(0.6) : theme.fg,
                      ...ELLIPSIS,
                    }}
                  >
                    {e.subject}
                  </span>
                  {showPreview && (
                    <span
                      style={{ fontSize: 13.5, opacity: 0.45, ...ELLIPSIS }}
                    >
                      {e.preview}
                    </span>
                  )}
                </span>
              </span>
              {!compact && (
                <span
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  {showTags && e.tag && (
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 500,
                        padding: "3px 9px",
                        borderRadius: 8,
                        color: tagColor,
                        background: tagBg,
                      }}
                    >
                      {e.tag}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 12.5,
                      opacity: 0.45,
                      textAlign: "right",
                    }}
                  >
                    {e.time}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
