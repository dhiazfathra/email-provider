"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CODE,
  FEATURES,
  FOOTER_LINKS,
  LANGS,
  NAV_LINKS,
  type CodeLang,
} from "@/lib/mock/landing";

const GLASS: React.CSSProperties = {
  background: "rgba(255,255,255,.5)",
  backdropFilter: "blur(26px)",
  WebkitBackdropFilter: "blur(26px)",
  border: "1px solid rgba(255,255,255,.75)",
};

const PRIMARY = "linear-gradient(135deg,#7c7ef2,#a78bfa)";

export default function PlumeLanding() {
  const [lang, setLang] = useState<CodeLang>("curl");

  // Responsive values come from CSS variables in globals.css so the first
  // paint is already correct — see the note there.
  const h1 = "var(--h1)";
  const h2 = "var(--h2)";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        color: "#26234a",
        background:
          "linear-gradient(150deg,#eef2ff 0%,#f6f0ff 40%,#eafaff 100%)",
      }}
    >
      <div
        className="drift"
        aria-hidden
        style={{
          position: "absolute",
          top: -220,
          left: -140,
          width: 780,
          height: 780,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(129,140,248,.5),rgba(129,140,248,0) 68%)",
          filter: "blur(30px)",
        }}
      />
      <div
        className="drift"
        aria-hidden
        style={{
          position: "absolute",
          top: 340,
          right: -160,
          width: 820,
          height: 820,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(103,232,249,.4),rgba(103,232,249,0) 68%)",
          filter: "blur(30px)",
          animationDuration: "28s",
          animationDirection: "reverse",
        }}
      />
      <div
        className="drift"
        aria-hidden
        style={{
          position: "absolute",
          top: 1200,
          left: 100,
          width: 640,
          height: 640,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(167,139,250,.36),rgba(167,139,250,0) 66%)",
          filter: "blur(30px)",
          animationDuration: "34s",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 28px 90px",
        }}
      >
        <header
          style={{
            ...GLASS,
            display: "flex",
            alignItems: "center",
            gap: 18,
            margin: "24px 0 0",
            padding: "14px 20px",
            borderRadius: 22,
            boxShadow: "0 18px 50px -30px rgba(76,66,160,.45)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div
              aria-hidden
              style={{
                width: 34,
                height: 34,
                borderRadius: 11,
                background: "linear-gradient(140deg,#8b8cf6,#6ee7f0)",
                boxShadow: "0 6px 16px -6px rgba(108,110,246,.9)",
              }}
            />
            <span
              style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-.02em" }}
            >
              Plume
            </span>
          </div>
          <nav
            style={{
              display: "var(--nav-display)",
              gap: 4,
              marginLeft: 14,
            }}
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l}
                href={l === "Docs" ? "/docs" : "#"}
                style={{
                  padding: "9px 14px",
                  borderRadius: 12,
                  fontSize: 14,
                  color: "rgba(38,35,74,.68)",
                }}
              >
                {l}
              </Link>
            ))}
          </nav>
          <div style={{ flex: 1 }} />
          <Link
            href="/console"
            style={{
              padding: "9px 15px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(38,35,74,.7)",
            }}
          >
            Sign in
          </Link>
          <Link
            href="/console"
            style={{
              padding: "11px 19px",
              borderRadius: 13,
              fontSize: 14,
              fontWeight: 500,
              color: "#fff",
              background: PRIMARY,
              boxShadow: "0 12px 26px -12px rgba(124,126,242,.95)",
            }}
          >
            Start sending free
          </Link>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "var(--hero-cols)",
            gap: 44,
            alignItems: "center",
            padding: "var(--hero-pad)",
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
                v2
              </span>
              Message trace now shows the raw SMTP response
            </div>
            <h1
              style={{
                margin: "20px 0 0",
                fontSize: h1,
                lineHeight: 1.04,
                fontWeight: 600,
                letterSpacing: "-.035em",
                textWrap: "balance",
              }}
            >
              Email your product sends, delivered and accounted for.
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
              One API for receipts, password resets, notifications and bulk
              sends. Every message keeps a trace from the API call to the
              recipient&rsquo;s mail server.
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
                href="/console"
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
                Get an API key
              </Link>
              <Link
                href="/console"
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
                Open the console
              </Link>
            </div>
          </div>

          <div
            style={{
              ...GLASS,
              minWidth: 0,
              padding: 14,
              borderRadius: 28,
              boxShadow: "0 40px 80px -40px rgba(76,66,160,.6)",
            }}
          >
            <div style={{ display: "flex", gap: 6, padding: "4px 6px 12px" }}>
              {LANGS.map((t) => {
                const on = lang === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setLang(t.id)}
                    aria-pressed={on}
                    style={{
                      padding: "7px 13px",
                      borderRadius: 11,
                      fontSize: 12.5,
                      fontFamily: "inherit",
                      cursor: "pointer",
                      fontWeight: on ? 600 : 400,
                      color: on ? "#4c46b8" : "rgba(38,35,74,.6)",
                      background: on
                        ? "rgba(255,255,255,.9)"
                        : "rgba(255,255,255,.45)",
                      border: `1px solid ${on ? "rgba(124,126,242,.4)" : "rgba(255,255,255,.85)"}`,
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
            <pre
              style={{
                margin: 0,
                padding: 20,
                borderRadius: 20,
                background: "rgba(38,35,74,.92)",
                color: "#dcd9ff",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 12.5,
                lineHeight: 1.75,
                overflow: "auto",
              }}
            >
              {CODE[lang].map((c, i) => (
                <div key={i} style={{ whiteSpace: "pre", color: c.color }}>
                  {c.line || " "}
                </div>
              ))}
            </pre>
          </div>
        </section>

        <section style={{ paddingTop: 12 }}>
          <h2
            style={{
              margin: 0,
              fontSize: h2,
              fontWeight: 600,
              letterSpacing: "-.03em",
            }}
          >
            Built for the mail nobody is supposed to notice
          </h2>
          <p
            style={{
              margin: "12px 0 30px",
              fontSize: 16,
              opacity: 0.55,
              maxWidth: 560,
              textWrap: "pretty",
            }}
          >
            Transactional mail only matters when it fails. Plume is built around
            finding out why, fast.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "var(--feat-cols)",
              gap: 16,
            }}
          >
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{
                  padding: 24,
                  borderRadius: 22,
                  background: "rgba(255,255,255,.55)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,.85)",
                  boxShadow: "0 24px 60px -44px rgba(76,66,160,.7)",
                }}
              >
                <div
                  aria-hidden
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 13,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 16,
                    color: "#fff",
                    background: f.tint,
                    boxShadow: "0 10px 22px -12px rgba(108,110,246,.9)",
                  }}
                >
                  {f.glyph}
                </div>
                <div
                  style={{
                    marginTop: 16,
                    fontSize: 16.5,
                    fontWeight: 600,
                    letterSpacing: "-.015em",
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    marginTop: 7,
                    fontSize: 14,
                    lineHeight: 1.6,
                    opacity: 0.55,
                    textWrap: "pretty",
                  }}
                >
                  {f.body}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 56 }}>
          <p style={{ fontSize: 15, opacity: 0.6, textWrap: "pretty" }}>
            Plume is a proof of concept. There is no pricing yet, and nothing
            here is for sale.
          </p>
        </section>

        <section
          style={{
            ...GLASS,
            marginTop: 56,
            padding: "var(--cta-pad)",
            borderRadius: 30,
            border: "1px solid rgba(255,255,255,.78)",
            boxShadow: "0 40px 80px -46px rgba(76,66,160,.6)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 26,
          }}
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2
              style={{
                margin: 0,
                fontSize: h2,
                fontWeight: 600,
                letterSpacing: "-.03em",
                textWrap: "balance",
              }}
            >
              First message sent in under five minutes.
            </h2>
            <p
              style={{
                margin: "12px 0 0",
                fontSize: 16,
                opacity: 0.55,
                maxWidth: 520,
              }}
            >
              Verify a domain, take a key, post JSON. Migration tooling imports
              templates and suppression lists from SendGrid, Mailgun and SES.
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
                aria-label="Work email"
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
                href="/console"
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
              3,000 messages a month free. No card required.
            </div>
          </div>
        </section>

        <footer
          style={{
            marginTop: 44,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 18,
            fontSize: 13,
            opacity: 0.5,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              aria-hidden
              style={{
                width: 22,
                height: 22,
                borderRadius: 8,
                background: "linear-gradient(140deg,#8b8cf6,#6ee7f0)",
              }}
            />
            <span style={{ fontWeight: 500 }}>Plume</span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
            {FOOTER_LINKS.map((l) => (
              <Link
                key={l}
                href={l === "Docs" ? "/docs" : "#"}
                style={{ color: "inherit" }}
              >
                {l}
              </Link>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
