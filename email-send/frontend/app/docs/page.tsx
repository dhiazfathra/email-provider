"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useViewport } from "@/lib/useViewport";
import {
  API_ERRORS,
  DOCS_LANGS,
  DOCS_NAV,
  DOCS_SECTIONS,
  DOC_STREAMS,
  QUICKSTART_CODE,
  QUICKSTART_STEPS,
  RATE_LIMITS,
  SCOPES,
  SDK_CHIPS,
  SEND_PARAMS,
  SEND_REQUEST,
  SEND_RESPONSE,
  WEBHOOK_EVENTS,
  WEBHOOK_SAMPLE,
  type DocsLang,
} from "@/lib/mock/docs";
import { CodeBlock, MONO } from "../console/ui";

const PRIMARY = "linear-gradient(135deg,#7c7ef2,#a78bfa)";
const DARK = "rgba(38,35,74,.92)";
const LABEL = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: ".09em",
  textTransform: "uppercase" as const,
  opacity: 0.42,
};

/** Highlights the section currently under the header. */
function useActiveSection() {
  const [active, setActive] = useState(DOCS_SECTIONS[0].id);

  useEffect(() => {
    const onScroll = () => {
      let current = DOCS_SECTIONS[0].id;
      for (const s of DOCS_SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < 160) current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return active;
}

export default function PlumeDocs() {
  const { width } = useViewport();
  const narrow = width < 1180;
  const mob = width < 720;
  const [lang, setLang] = useState<DocsLang>("curl");
  const active = useActiveSection();

  const pad = mob ? 24 : "34px 36px";
  const h2 = mob ? 24 : 29;
  const pairCols = narrow ? "1fr" : "repeat(2,minmax(0,1fr))";
  const stepCols = mob ? "1fr" : "repeat(4,minmax(0,1fr))";
  const labelOf = (id: string) =>
    DOCS_SECTIONS.find((s) => s.id === id)?.label ?? id;

  const section = {
    padding: pad,
    borderRadius: 26,
    background: "rgba(255,255,255,.55)",
    backdropFilter: "blur(22px)",
    WebkitBackdropFilter: "blur(22px)",
    border: "1px solid rgba(255,255,255,.85)",
    boxShadow: "0 28px 66px -48px rgba(76,66,160,.7)",
    scrollMarginTop: 24,
  };

  const codePanel = {
    padding: 18,
    borderRadius: 18,
    background: DARK,
    color: "#dcd9ff",
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflowX: "clip",
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
          top: -240,
          left: -160,
          width: 780,
          height: 780,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(129,140,248,.45),rgba(129,140,248,0) 68%)",
          filter: "blur(30px)",
          animationDuration: "24s",
        }}
      />
      <div
        className="drift"
        aria-hidden
        style={{
          position: "absolute",
          top: 820,
          right: -200,
          width: 820,
          height: 820,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(103,232,249,.34),rgba(103,232,249,0) 68%)",
          filter: "blur(30px)",
          animationDuration: "30s",
          animationDirection: "reverse",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 28px 90px",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            margin: "24px 0 0",
            padding: "14px 20px",
            borderRadius: 22,
            background: "rgba(255,255,255,.5)",
            backdropFilter: "blur(26px)",
            WebkitBackdropFilter: "blur(26px)",
            border: "1px solid rgba(255,255,255,.75)",
            boxShadow: "0 18px 50px -30px rgba(76,66,160,.45)",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              color: "inherit",
            }}
          >
            <span
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
          </Link>
          <span
            style={{
              padding: "4px 10px",
              borderRadius: 9,
              fontSize: 11.5,
              fontWeight: 600,
              color: "#5b57c8",
              background: "rgba(124,126,242,.14)",
            }}
          >
            Docs
          </span>
          <div style={{ flex: 1 }} />
          {!mob && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "9px 14px",
                borderRadius: 13,
                background: "rgba(255,255,255,.62)",
                border: "1px solid rgba(255,255,255,.9)",
                minWidth: 230,
              }}
            >
              <span aria-hidden style={{ opacity: 0.35, fontSize: 14 }}>
                ⌕
              </span>
              <input
                type="search"
                placeholder="Search the docs"
                aria-label="Search the docs"
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontFamily: "inherit",
                  fontSize: 14,
                  color: "#26234a",
                }}
              />
              <span style={{ fontFamily: MONO, fontSize: 11, opacity: 0.35 }}>
                ⌘K
              </span>
            </div>
          )}
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
            Console
          </Link>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: mob
              ? "1fr"
              : narrow
                ? "232px minmax(0,1fr)"
                : "236px minmax(0,1fr) 200px",
            gap: 26,
            alignItems: "start",
            marginTop: 26,
          }}
        >
          {!mob && (
            <aside
              style={{
                display: "flex",
                position: "sticky",
                top: 24,
                flexDirection: "column",
                gap: 22,
                padding: "22px 18px",
                borderRadius: 24,
                background: "rgba(255,255,255,.5)",
                backdropFilter: "blur(22px)",
                WebkitBackdropFilter: "blur(22px)",
                border: "1px solid rgba(255,255,255,.8)",
                boxShadow: "0 24px 60px -46px rgba(76,66,160,.7)",
                maxHeight: "calc(100vh - 48px)",
                overflow: "auto",
              }}
            >
              {DOCS_NAV.map((g) => (
                <div
                  key={g.group}
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: ".09em",
                      textTransform: "uppercase",
                      opacity: 0.4,
                      padding: "0 12px 8px",
                    }}
                  >
                    {g.group}
                  </div>
                  {g.ids.map((id) => {
                    const on = active === id;
                    return (
                      <a
                        key={id}
                        href={`#${id}`}
                        aria-current={on ? "true" : undefined}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 11,
                          fontSize: 14,
                          fontWeight: on ? 600 : 400,
                          color: on ? "#4c46b8" : "rgba(38,35,74,.66)",
                          background: on
                            ? "rgba(255,255,255,.85)"
                            : "transparent",
                        }}
                      >
                        {labelOf(id)}
                      </a>
                    );
                  })}
                </div>
              ))}
            </aside>
          )}

          <main
            style={{
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 26,
            }}
          >
            <section id="quickstart" style={section}>
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  letterSpacing: ".09em",
                  textTransform: "uppercase",
                  color: "#5b57c8",
                  opacity: 0.75,
                }}
              >
                Get started
              </div>
              <h1
                style={{
                  margin: "10px 0 0",
                  fontSize: mob ? 32 : 42,
                  lineHeight: 1.08,
                  fontWeight: 600,
                  letterSpacing: "-.035em",
                }}
              >
                Quickstart
              </h1>
              <p
                style={{
                  margin: "14px 0 0",
                  fontSize: 16.5,
                  lineHeight: 1.6,
                  opacity: 0.58,
                  maxWidth: 620,
                  textWrap: "pretty",
                }}
              >
                Verify a domain, create a key, and send your first message. The
                whole path takes about five minutes and works the same on the
                free plan.
              </p>

              <div
                style={{
                  marginTop: 26,
                  display: "grid",
                  gridTemplateColumns: stepCols,
                  gap: 12,
                }}
              >
                {QUICKSTART_STEPS.map((s) => (
                  <div
                    key={s.n}
                    style={{
                      padding: 18,
                      borderRadius: 18,
                      background: "rgba(255,255,255,.6)",
                      border: "1px solid rgba(255,255,255,.92)",
                    }}
                  >
                    <div
                      aria-hidden
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 9,
                        display: "grid",
                        placeItems: "center",
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: "#fff",
                        background: "linear-gradient(140deg,#7c7ef2,#a78bfa)",
                      }}
                    >
                      {s.n}
                    </div>
                    <div
                      style={{
                        marginTop: 12,
                        fontSize: 14.5,
                        fontWeight: 600,
                        letterSpacing: "-.01em",
                      }}
                    >
                      {s.title}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 13.5,
                        lineHeight: 1.55,
                        opacity: 0.55,
                        textWrap: "pretty",
                      }}
                    >
                      {s.body}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 24,
                  padding: 14,
                  borderRadius: 22,
                  background: "rgba(255,255,255,.5)",
                  border: "1px solid rgba(255,255,255,.9)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    padding: "2px 4px 12px",
                    flexWrap: "wrap",
                  }}
                >
                  {DOCS_LANGS.map((t) => {
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
                <CodeBlock
                  lines={QUICKSTART_CODE[lang]}
                  style={{ ...codePanel, padding: 20 }}
                />
              </div>

              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  gap: 12,
                  padding: "16px 18px",
                  borderRadius: 18,
                  background: "rgba(124,126,242,.1)",
                  border: "1px solid rgba(124,126,242,.24)",
                }}
              >
                <span style={{ color: "#5b57c8", fontWeight: 600 }}>i</span>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    opacity: 0.7,
                    textWrap: "pretty",
                  }}
                >
                  Sandbox keys start with{" "}
                  <span
                    style={{ fontFamily: MONO, fontSize: 13, color: "#4c46b8" }}
                  >
                    plm_test_
                  </span>{" "}
                  and accept every request without delivering mail. Traces and
                  webhooks still fire, so you can build the whole integration
                  before verifying a domain.
                </div>
              </div>
            </section>

            <section id="authentication" style={section}>
              <h2
                style={{
                  margin: 0,
                  fontSize: h2,
                  fontWeight: 600,
                  letterSpacing: "-.03em",
                }}
              >
                Authentication
              </h2>
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: 15.5,
                  lineHeight: 1.6,
                  opacity: 0.58,
                  maxWidth: 620,
                  textWrap: "pretty",
                }}
              >
                Every request carries a bearer key in the{" "}
                <span
                  style={{ fontFamily: MONO, fontSize: 13.5, color: "#4c46b8" }}
                >
                  Authorization
                </span>{" "}
                header. Keys are scoped to a project and to a set of
                permissions, and are shown once at creation.
              </p>
              <CodeBlock
                lines={[
                  {
                    line: "Authorization: Bearer plm_live_8Kd2QvR7nX4mYs1FhTgB",
                    color: "#dcd9ff",
                  },
                ]}
                style={{ ...codePanel, marginTop: 20 }}
              />
              <div
                style={{
                  marginTop: 18,
                  display: "grid",
                  gridTemplateColumns: pairCols,
                  gap: 12,
                }}
              >
                {SCOPES.map((s) => (
                  <div
                    key={s.scope}
                    style={{
                      padding: "16px 18px",
                      borderRadius: 16,
                      background: "rgba(255,255,255,.6)",
                      border: "1px solid rgba(255,255,255,.92)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 13,
                        color: "#4c46b8",
                      }}
                    >
                      {s.scope}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 13.5,
                        lineHeight: 1.55,
                        opacity: 0.55,
                      }}
                    >
                      {s.body}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="send" style={section}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 9,
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: "#fff",
                    background: "#7c7ef2",
                    fontFamily: MONO,
                  }}
                >
                  POST
                </span>
                <span style={{ fontFamily: MONO, fontSize: 15 }}>/v2/send</span>
              </div>
              <h2
                style={{
                  margin: "14px 0 0",
                  fontSize: h2,
                  fontWeight: 600,
                  letterSpacing: "-.03em",
                }}
              >
                Send a message
              </h2>
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: 15.5,
                  lineHeight: 1.6,
                  opacity: 0.58,
                  maxWidth: 620,
                  textWrap: "pretty",
                }}
              >
                Accepts a single message or a batch of up to 500. The call
                returns as soon as the message is queued and validated against
                your suppression list.
              </p>

              <div style={{ marginTop: 22, ...LABEL }}>Body parameters</div>
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {SEND_PARAMS.map((p, i) => (
                  <div
                    key={p.name}
                    style={{
                      display: "grid",
                      gridTemplateColumns: mob
                        ? "1fr"
                        : "190px 130px minmax(0,1fr)",
                      gap: 14,
                      padding: "13px 14px",
                      borderRadius: 14,
                      background:
                        i % 2 ? "transparent" : "rgba(255,255,255,.55)",
                      alignItems: "baseline",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <span
                        style={{
                          fontFamily: MONO,
                          fontSize: 13.5,
                          color: "#4c46b8",
                        }}
                      >
                        {p.name}
                      </span>
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: 11.5,
                          fontWeight: 600,
                          color:
                            p.req === "required"
                              ? "#7c7ef2"
                              : "rgba(38,35,74,.35)",
                        }}
                      >
                        {p.req}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 12.5,
                        opacity: 0.45,
                      }}
                    >
                      {p.type}
                    </div>
                    <div
                      style={{
                        fontSize: 13.5,
                        lineHeight: 1.55,
                        opacity: 0.6,
                        textWrap: "pretty",
                      }}
                    >
                      {p.body}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 22,
                  display: "grid",
                  gridTemplateColumns: pairCols,
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ ...LABEL, marginBottom: 10 }}>Request</div>
                  <CodeBlock lines={SEND_REQUEST} style={codePanel} />
                </div>
                <div>
                  <div style={{ ...LABEL, marginBottom: 10 }}>
                    Response · 202
                  </div>
                  <CodeBlock lines={SEND_RESPONSE} style={codePanel} />
                </div>
              </div>
            </section>

            <section id="templates" style={section}>
              <h2
                style={{
                  margin: 0,
                  fontSize: h2,
                  fontWeight: 600,
                  letterSpacing: "-.03em",
                }}
              >
                Templates and streams
              </h2>
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: 15.5,
                  lineHeight: 1.6,
                  opacity: 0.58,
                  maxWidth: 620,
                  textWrap: "pretty",
                }}
              >
                Templates render server-side with typed variables. Streams
                separate reputation, so a bulk campaign cannot affect password
                resets sent in the same account.
              </p>
              <div
                style={{
                  marginTop: 20,
                  display: "grid",
                  gridTemplateColumns: pairCols,
                  gap: 12,
                }}
              >
                <div
                  style={{
                    padding: 20,
                    borderRadius: 20,
                    background: "rgba(255,255,255,.6)",
                    border: "1px solid rgba(255,255,255,.92)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 15.5,
                      fontWeight: 600,
                      letterSpacing: "-.015em",
                    }}
                  >
                    Referencing a version
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 13.5,
                      lineHeight: 1.6,
                      opacity: 0.55,
                      textWrap: "pretty",
                    }}
                  >
                    Pass a name to use the live version, or pin an exact one.
                    Pinned sends ignore rollbacks.
                  </div>
                  <CodeBlock
                    lines={[
                      { line: '"template": "receipt-v3"', color: "#67e8f9" },
                      { line: '"template": "receipt-v3@14"', color: "#67e8f9" },
                    ]}
                    style={{
                      ...codePanel,
                      marginTop: 14,
                      padding: 16,
                      borderRadius: 14,
                    }}
                  />
                </div>
                <div
                  style={{
                    padding: 20,
                    borderRadius: 20,
                    background: "rgba(255,255,255,.6)",
                    border: "1px solid rgba(255,255,255,.92)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 15.5,
                      fontWeight: 600,
                      letterSpacing: "-.015em",
                    }}
                  >
                    Stream types
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {DOC_STREAMS.map((s) => (
                      <div
                        key={s.id}
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "baseline",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: MONO,
                            fontSize: 12.5,
                            color: "#4c46b8",
                            minWidth: 96,
                          }}
                        >
                          {s.id}
                        </span>
                        <span
                          style={{
                            fontSize: 13.5,
                            lineHeight: 1.55,
                            opacity: 0.55,
                          }}
                        >
                          {s.body}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section id="webhooks" style={section}>
              <h2
                style={{
                  margin: 0,
                  fontSize: h2,
                  fontWeight: 600,
                  letterSpacing: "-.03em",
                }}
              >
                Webhooks
              </h2>
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: 15.5,
                  lineHeight: 1.6,
                  opacity: 0.58,
                  maxWidth: 620,
                  textWrap: "pretty",
                }}
              >
                Events post as JSON with an HMAC-SHA256 signature in{" "}
                <span
                  style={{ fontFamily: MONO, fontSize: 13.5, color: "#4c46b8" }}
                >
                  Plume-Signature
                </span>
                . Retries back off for 24 hours; anything missed can be replayed
                from the console for 30 days.
              </p>
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {WEBHOOK_EVENTS.map((e) => (
                  <span
                    key={e}
                    style={{
                      padding: "7px 12px",
                      borderRadius: 11,
                      fontFamily: MONO,
                      fontSize: 12,
                      color: "#4c46b8",
                      background: "rgba(124,126,242,.13)",
                    }}
                  >
                    {e}
                  </span>
                ))}
              </div>
              <CodeBlock
                lines={WEBHOOK_SAMPLE}
                style={{ ...codePanel, marginTop: 18 }}
              />
            </section>

            <section id="errors" style={section}>
              <h2
                style={{
                  margin: 0,
                  fontSize: h2,
                  fontWeight: 600,
                  letterSpacing: "-.03em",
                }}
              >
                Errors and rate limits
              </h2>
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: 15.5,
                  lineHeight: 1.6,
                  opacity: 0.58,
                  maxWidth: 620,
                  textWrap: "pretty",
                }}
              >
                Errors return a stable machine code alongside the HTTP status.
                Retry anything in the 5xx range and any 429 after the interval
                in{" "}
                <span
                  style={{ fontFamily: MONO, fontSize: 13.5, color: "#4c46b8" }}
                >
                  Retry-After
                </span>
                .
              </p>
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {API_ERRORS.map((e, i) => (
                  <div
                    key={e.code}
                    style={{
                      display: "grid",
                      gridTemplateColumns: mob
                        ? "1fr"
                        : "56px 190px minmax(0,1fr)",
                      gap: 14,
                      padding: "13px 14px",
                      borderRadius: 14,
                      background:
                        i % 2 ? "transparent" : "rgba(255,255,255,.55)",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: 13.5,
                        fontWeight: 500,
                        color: e.statusColor,
                      }}
                    >
                      {e.status}
                    </span>
                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: 12.5,
                        color: "#4c46b8",
                      }}
                    >
                      {e.code}
                    </span>
                    <span
                      style={{
                        fontSize: 13.5,
                        lineHeight: 1.55,
                        opacity: 0.6,
                        textWrap: "pretty",
                      }}
                    >
                      {e.body}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 18,
                  display: "grid",
                  gridTemplateColumns: stepCols,
                  gap: 12,
                }}
              >
                {RATE_LIMITS.map((l) => (
                  <div
                    key={l.label}
                    style={{
                      padding: "16px 18px",
                      borderRadius: 16,
                      background: "rgba(255,255,255,.6)",
                      border: "1px solid rgba(255,255,255,.92)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 19,
                        fontWeight: 600,
                        letterSpacing: "-.025em",
                      }}
                    >
                      {l.value}
                    </div>
                    <div style={{ marginTop: 4, fontSize: 13, opacity: 0.5 }}>
                      {l.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section
              id="sdks"
              style={{
                ...section,
                background: "rgba(255,255,255,.5)",
                border: "1px solid rgba(255,255,255,.8)",
                display: "flex",
                flexWrap: "wrap",
                gap: 24,
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1, minWidth: 280 }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: h2,
                    fontWeight: 600,
                    letterSpacing: "-.03em",
                  }}
                >
                  SDKs and SMTP
                </h2>
                <p
                  style={{
                    margin: "12px 0 0",
                    fontSize: 15.5,
                    lineHeight: 1.6,
                    opacity: 0.58,
                    maxWidth: 520,
                    textWrap: "pretty",
                  }}
                >
                  Typed clients handle retries, idempotency keys and batching.
                  An existing app can point at the relay instead and get the
                  same streams and traces.
                </p>
                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 7,
                  }}
                >
                  {SDK_CHIPS.map((c) => (
                    <span
                      key={c}
                      style={{
                        padding: "6px 11px",
                        borderRadius: 11,
                        fontFamily: MONO,
                        fontSize: 12,
                        color: "#4c46b8",
                        background: "rgba(124,126,242,.13)",
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 9,
                  minWidth: 250,
                }}
              >
                <Link
                  href="/console"
                  style={{
                    padding: "13px 22px",
                    textAlign: "center",
                    borderRadius: 14,
                    fontSize: 14.5,
                    fontWeight: 500,
                    color: "#fff",
                    background: PRIMARY,
                    boxShadow: "0 14px 30px -14px rgba(124,126,242,.95)",
                  }}
                >
                  Get an API key
                </Link>
                <Link
                  href="/"
                  style={{
                    padding: "13px 22px",
                    textAlign: "center",
                    borderRadius: 14,
                    fontSize: 14.5,
                    fontWeight: 500,
                    color: "#5b57c8",
                    background: "rgba(255,255,255,.7)",
                    border: "1px solid rgba(255,255,255,.95)",
                  }}
                >
                  Back to plume.email
                </Link>
              </div>
            </section>
          </main>

          {!narrow && (
            <aside
              style={{
                display: "flex",
                position: "sticky",
                top: 24,
                flexDirection: "column",
                gap: 4,
                padding: "20px 16px",
                borderRadius: 22,
                background: "rgba(255,255,255,.42)",
                border: "1px solid rgba(255,255,255,.78)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: ".09em",
                  textTransform: "uppercase",
                  opacity: 0.4,
                  padding: "0 10px 8px",
                }}
              >
                On this page
              </div>
              {DOCS_SECTIONS.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 9,
                    fontSize: 13.5,
                    color: active === t.id ? "#4c46b8" : "rgba(38,35,74,.6)",
                    background:
                      active === t.id ? "rgba(255,255,255,.85)" : "transparent",
                  }}
                >
                  {t.label}
                </a>
              ))}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
