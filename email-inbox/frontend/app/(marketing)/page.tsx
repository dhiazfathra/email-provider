"use client";

import Link from "next/link";
import {
  FEATURES,
  HERO_CATEGORIES,
  HERO_ROWS,
  HERO_STATS,
  initialsOf,
  AV,
} from "@/lib/mock/marketing";
import { useViewport } from "@/lib/useViewport";
import { FeatureCard, PRIMARY, SectionHeading, useGridCols } from "./ui";

export default function PaneHome() {
  const { narrow, mob } = useViewport();
  const cols = useGridCols();

  return (
    <>
      <section
        style={{
          display: "grid",
          gridTemplateColumns: narrow
            ? "1fr"
            : "minmax(0,1fr) minmax(0,1.02fr)",
          gap: 48,
          alignItems: "center",
          padding: mob ? "48px 0 56px" : "76px 0 84px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              padding: "6px 13px 6px 7px",
              borderRadius: 12,
              background: "rgba(255,255,255,.6)",
              border: "1px solid rgba(255,255,255,.88)",
              fontSize: 12.5,
              fontWeight: 500,
              color: "#5b57c8",
            }}
          >
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 7,
                background: "#7c7ef2",
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              New
            </span>
            Verification codes now auto-archive
          </div>
          <h1
            style={{
              margin: "20px 0 0",
              fontSize: mob ? 38 : narrow ? 46 : 54,
              lineHeight: 1.04,
              fontWeight: 600,
              letterSpacing: "-.035em",
              textWrap: "balance",
            }}
          >
            An inbox that sorts itself before you open it.
          </h1>
          <p
            style={{
              margin: "20px 0 0",
              fontSize: 17.5,
              lineHeight: 1.6,
              opacity: 0.6,
              maxWidth: 520,
              textWrap: "pretty",
            }}
          >
            Pane splits mail into Primary, Social, Promotions, Newsletters and
            one-time codes as it arrives. What is left is the mail you actually
            answer.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 30,
            }}
          >
            <Link
              href="/signup"
              style={{
                padding: "14px 24px",
                borderRadius: 15,
                fontSize: 15,
                fontWeight: 500,
                color: "#fff",
                background: PRIMARY,
                boxShadow: "0 14px 30px -12px rgba(124,126,242,.95)",
              }}
            >
              Create an account
            </Link>
            <Link
              href="/mail"
              style={{
                padding: "14px 24px",
                borderRadius: 15,
                fontSize: 15,
                fontWeight: 500,
                color: "#5b57c8",
                background: "rgba(255,255,255,.6)",
                border: "1px solid rgba(255,255,255,.9)",
              }}
            >
              See a live inbox
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 26,
              marginTop: 34,
            }}
          >
            {HERO_STATS.map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    letterSpacing: "-.02em",
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 12.5, opacity: 0.5, marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            minWidth: 0,
            padding: 14,
            borderRadius: 28,
            background: "rgba(255,255,255,.5)",
            backdropFilter: "blur(26px)",
            WebkitBackdropFilter: "blur(26px)",
            border: "1px solid rgba(255,255,255,.75)",
            boxShadow: "0 40px 80px -40px rgba(76,66,160,.6)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              padding: "6px 8px 12px",
            }}
          >
            {HERO_CATEGORIES.map((c) => (
              <div
                key={c.label}
                style={{
                  flex: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "6px 11px 6px 6px",
                  borderRadius: 12,
                  background: c.on
                    ? "rgba(255,255,255,.88)"
                    : "rgba(255,255,255,.5)",
                  border: `1px solid ${c.on ? "rgba(124,126,242,.45)" : "rgba(255,255,255,.85)"}`,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 21,
                    height: 21,
                    borderRadius: 7,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 11,
                    color: "#fff",
                    background: c.logo,
                  }}
                >
                  {c.glyph}
                </span>
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: c.on ? 600 : 400,
                    color: c.on ? "#4c46b8" : "rgba(38,35,74,.6)",
                  }}
                >
                  {c.label}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {HERO_ROWS.map((e, i) => (
              <div
                key={e.sender}
                style={{
                  display: "grid",
                  gridTemplateColumns: "34px minmax(0,1fr) auto",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 16,
                  background: e.unread
                    ? "rgba(255,255,255,.72)"
                    : "rgba(255,255,255,.34)",
                  border: `1px solid ${e.unread ? "rgba(255,255,255,.88)" : "rgba(255,255,255,.5)"}`,
                }}
              >
                <div
                  aria-hidden
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#fff",
                    background: AV[i % AV.length],
                  }}
                >
                  {initialsOf(e.sender)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      minWidth: 0,
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
                        fontSize: 13.5,
                        fontWeight: e.unread ? 600 : 400,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {e.sender}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      opacity: 0.55,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      paddingLeft: 13,
                    }}
                  >
                    {e.subject}
                  </div>
                </div>
                <span style={{ fontSize: 12, opacity: 0.45 }}>{e.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 20 }}>
        <SectionHeading>Built around the mail you keep</SectionHeading>
        <p
          style={{
            margin: "12px 0 30px",
            fontSize: 16,
            opacity: 0.55,
            maxWidth: 560,
            textWrap: "pretty",
          }}
        >
          Every part of Pane exists to shorten the distance between an email
          arriving and you being done with it.
        </p>
        <div
          style={{ display: "grid", gridTemplateColumns: cols.feat, gap: 16 }}
        >
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      <section
        style={{
          marginTop: 56,
          padding: mob ? 26 : "38px 40px",
          borderRadius: 30,
          background: "rgba(255,255,255,.5)",
          backdropFilter: "blur(26px)",
          WebkitBackdropFilter: "blur(26px)",
          border: "1px solid rgba(255,255,255,.78)",
          boxShadow: "0 40px 80px -46px rgba(76,66,160,.6)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 26,
        }}
      >
        <div style={{ flex: 1, minWidth: 280 }}>
          <SectionHeading>
            Move your mail across in about four minutes.
          </SectionHeading>
          <p
            style={{
              margin: "12px 0 0",
              fontSize: 16,
              opacity: 0.55,
              maxWidth: 520,
            }}
          >
            Import from Gmail, Outlook or any IMAP account. Filters, labels and
            signatures come with you.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 9,
            minWidth: 260,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: 7,
              borderRadius: 17,
              background: "rgba(255,255,255,.7)",
              border: "1px solid rgba(255,255,255,.9)",
            }}
          >
            <input
              type="email"
              placeholder="you@company.com"
              aria-label="Email address"
              style={{
                flex: 1,
                minWidth: 0,
                padding: "11px 13px",
                fontSize: 14.5,
                border: "none",
                background: "transparent",
                outline: "none",
                fontFamily: "inherit",
                color: "#26234a",
              }}
            />
            <Link
              href="/signup"
              style={{
                padding: "11px 19px",
                borderRadius: 12,
                fontSize: 14.5,
                fontWeight: 500,
                color: "#fff",
                background: PRIMARY,
              }}
            >
              Start
            </Link>
          </div>
          <div style={{ fontSize: 12.5, opacity: 0.45, paddingLeft: 6 }}>
            Free for personal use. No card required.
          </div>
        </div>
      </section>
    </>
  );
}
