"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MAILBOXES, SCREENS } from "@/lib/mock/mail";
import { PROFILE } from "@/lib/mock/mail";
import { MailProvider, useMail } from "./state";

export default function MailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MailProvider>
      <MailShell>{children}</MailShell>
    </MailProvider>
  );
}

function MailShell({ children }: { children: React.ReactNode }) {
  const {
    theme,
    isMobile,
    isTablet,
    isDesktop,
    railCollapsed,
    toggleRail,
  } = useMail();
  const pathname = usePathname();
  const router = useRouter();
  const railFull = isDesktop && !railCollapsed;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: 560,
        overflow: "hidden",
        background: theme.bg,
        color: theme.fg,
        transition: "background .3s, color .3s",
      }}
    >
      <div
        className="drift"
        aria-hidden
        style={{
          position: "absolute",
          top: -180,
          left: -120,
          width: 720,
          height: 720,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(129,140,248,.55),rgba(129,140,248,0) 68%)",
          filter: "blur(30px)",
        }}
      />
      <div
        className="drift"
        aria-hidden
        style={{
          position: "absolute",
          bottom: -260,
          right: -80,
          width: 800,
          height: 800,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(167,139,250,.45),rgba(167,139,250,0) 68%)",
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
          top: 120,
          right: 280,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(103,232,249,.4),rgba(103,232,249,0) 66%)",
          filter: "blur(30px)",
          animationDuration: "34s",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : railFull
              ? "248px 1fr"
              : "76px 1fr",
          height: "100%",
          padding: isMobile ? 12 : isTablet ? 18 : 26,
          gap: isMobile ? 0 : isTablet ? 14 : 22,
        }}
      >
        {!isMobile && (
          <aside
            style={{
              display: "flex",
              flexDirection: "column",
              gap: railFull ? 22 : 16,
              padding: railFull ? "24px 20px" : "18px 10px",
              borderRadius: 26,
              background: theme.glass,
              backdropFilter: "blur(26px)",
              WebkitBackdropFilter: "blur(26px)",
              border: `1px solid ${theme.edge}`,
              boxShadow: "0 18px 50px -28px rgba(76,66,160,.45)",
              alignItems: railFull ? "stretch" : "center",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                width: "100%",
              }}
            >
              <Link
                href="/"
                aria-label="Pane home"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 11,
                  flex: "none",
                  background: "linear-gradient(140deg,#8b8cf6,#6ee7f0)",
                  boxShadow: "0 6px 16px -6px rgba(108,110,246,.9)",
                }}
              />
              {railFull && (
                <span
                  style={{
                    fontSize: 19,
                    fontWeight: 600,
                    letterSpacing: "-.02em",
                    flex: 1,
                  }}
                >
                  Pane
                </span>
              )}
              {isDesktop && (
                <button
                  type="button"
                  onClick={toggleRail}
                  title="Toggle sidebar"
                  aria-label="Toggle sidebar"
                  aria-expanded={railFull}
                  style={{
                    width: 28,
                    height: 28,
                    flex: "none",
                    borderRadius: 9,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 13,
                    fontFamily: "inherit",
                    color: theme.soft(0.55),
                    background: theme.card,
                    border: `1px solid ${theme.cardEdge}`,
                    cursor: "pointer",
                  }}
                >
                  {railFull ? "‹" : "›"}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => router.push("/mail/popup")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                width: railFull ? "100%" : 48,
                padding: "13px 0",
                border: "none",
                borderRadius: 15,
                fontFamily: "inherit",
                fontSize: 14.5,
                fontWeight: 500,
                color: "#fff",
                cursor: "pointer",
                background: "linear-gradient(135deg,#7c7ef2,#a78bfa)",
                boxShadow: "0 12px 26px -12px rgba(124,126,242,.95)",
              }}
            >
              <span style={{ fontSize: 17, lineHeight: 1 }}>+</span>
              {railFull && <span>Compose</span>}
            </button>

            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "100%",
              }}
            >
              {MAILBOXES.map((n, i) => {
                const on = i === 0;
                return (
                  <div
                    key={n.label}
                    title={n.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: railFull ? "flex-start" : "center",
                      gap: 11,
                      padding: "10px 12px",
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: on ? 600 : 400,
                      color: on ? theme.accent : theme.soft(0.78),
                      background: on ? theme.selected : "transparent",
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width: 16,
                        textAlign: "center",
                        opacity: 0.7,
                        fontSize: 13,
                      }}
                    >
                      {n.glyph}
                    </span>
                    {railFull && <span style={{ flex: 1 }}>{n.label}</span>}
                    {railFull && (
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 500,
                          opacity: 0.55,
                        }}
                      >
                        {n.count}
                      </span>
                    )}
                  </div>
                );
              })}
            </nav>

            {railFull && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  paddingTop: 16,
                  borderTop: "1px solid rgba(124,126,242,.16)",
                }}
              >
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    letterSpacing: ".09em",
                    textTransform: "uppercase",
                    opacity: 0.42,
                    padding: "0 12px 4px",
                  }}
                >
                  Screens
                </div>
                {SCREENS.map((s) => {
                  const on = pathname === s.href;
                  return (
                    <Link
                      key={s.href}
                      href={s.href}
                      aria-current={on ? "page" : undefined}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 11,
                        fontSize: 13,
                        fontWeight: on ? 600 : 400,
                        color: on ? theme.accent : theme.soft(0.62),
                        background: on ? theme.selected : "transparent",
                      }}
                    >
                      {s.label}
                    </Link>
                  );
                })}
              </div>
            )}

            {railFull && (
              <div
                style={{
                  marginTop: "auto",
                  padding: 15,
                  borderRadius: 17,
                  background: theme.card,
                  border: `1px solid ${theme.cardEdge}`,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    opacity: 0.6,
                    marginBottom: 9,
                  }}
                >
                  Storage
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: "rgba(124,126,242,.18)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${PROFILE.storage.pct}%`,
                      height: "100%",
                      borderRadius: 3,
                      background: "linear-gradient(90deg,#7c7ef2,#67e8f9)",
                    }}
                  />
                </div>
                <div
                  style={{ fontSize: 11.5, opacity: 0.5, marginTop: 8 }}
                >
                  {PROFILE.storage.label}
                </div>
              </div>
            )}
          </aside>
        )}

        <main
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 10 : 16,
            minWidth: 0,
            paddingBottom: isMobile ? 78 : 0,
          }}
        >
          <header
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 10 : 16,
              padding: isMobile ? "10px 12px" : "14px 20px",
              borderRadius: 22,
              background: theme.glass,
              backdropFilter: "blur(26px)",
              WebkitBackdropFilter: "blur(26px)",
              border: `1px solid ${theme.edge}`,
              boxShadow: "0 18px 50px -30px rgba(76,66,160,.45)",
            }}
          >
            {isMobile && (
              <Link
                href="/"
                aria-label="Pane home"
                style={{
                  width: 32,
                  height: 32,
                  flex: "none",
                  borderRadius: 10,
                  background: "linear-gradient(140deg,#8b8cf6,#6ee7f0)",
                }}
              />
            )}
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 15px",
                borderRadius: 13,
                background: theme.card,
                border: `1px solid ${theme.cardEdge}`,
              }}
            >
              <span aria-hidden style={{ opacity: 0.4, fontSize: 13 }}>
                ⌕
              </span>
              <input
                type="search"
                aria-label="Search mail"
                placeholder={
                  isMobile ? "Search mail" : "Search mail, people, files"
                }
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontFamily: "inherit",
                  fontSize: 14,
                  color: theme.fg,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {!isMobile && (
                <Link
                  href="/mail/settings"
                  title="Settings"
                  aria-label="Settings"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: theme.card,
                    border: `1px solid ${theme.cardEdge}`,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 14,
                    color: theme.fg,
                    opacity: 0.55,
                  }}
                >
                  ⚙
                </Link>
              )}
              <Link
                href="/mail/profile"
                title="Profile"
                aria-label="Profile"
                style={{
                  width: 38,
                  height: 38,
                  flex: "none",
                  borderRadius: 12,
                  background: "linear-gradient(140deg,#a78bfa,#7dd3fc)",
                }}
              />
            </div>
          </header>

          {isMobile && (
            <div
              style={{
                display: "flex",
                gap: 7,
                overflowX: "auto",
                paddingBottom: 2,
                flex: "none",
              }}
            >
              {SCREENS.map((s) => {
                const on = pathname === s.href;
                return (
                  <Link
                    key={s.href}
                    href={s.href}
                    style={{
                      flex: "none",
                      padding: "8px 14px",
                      borderRadius: 11,
                      fontSize: 13,
                      whiteSpace: "nowrap",
                      fontWeight: on ? 600 : 400,
                      color: on ? theme.accent : theme.soft(0.62),
                      background: on ? theme.selected : theme.card,
                      border: "1px solid rgba(255,255,255,.8)",
                    }}
                  >
                    {s.label}
                  </Link>
                );
              })}
            </div>
          )}

          {children}

          {isMobile && (
            <nav
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 6,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 12px",
                borderRadius: 20,
                background: theme.glass,
                backdropFilter: "blur(26px)",
                WebkitBackdropFilter: "blur(26px)",
                border: `1px solid ${theme.edge}`,
                boxShadow: "0 -14px 40px -26px rgba(76,66,160,.6)",
              }}
            >
              {MAILBOXES.slice(0, 4).map((n, i) => {
                const on = i === 0;
                return (
                  <div
                    key={n.label}
                    style={{
                      flex: 1,
                      minHeight: 46,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 3,
                      borderRadius: 14,
                      background: on ? theme.selected : "transparent",
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        fontSize: 15,
                        opacity: 0.75,
                        color: on ? theme.accent : theme.soft(0.6),
                      }}
                    >
                      {n.glyph}
                    </span>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: on ? 600 : 400,
                        color: on ? theme.accent : theme.soft(0.6),
                      }}
                    >
                      {n.label}
                    </span>
                  </div>
                );
              })}
              <Link
                href="/mail/popup"
                aria-label="Compose"
                style={{
                  width: 52,
                  height: 46,
                  flex: "none",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 15,
                  fontSize: 20,
                  color: "#fff",
                  background: "linear-gradient(135deg,#7c7ef2,#a78bfa)",
                  boxShadow: "0 12px 26px -12px rgba(124,126,242,.95)",
                }}
              >
                +
              </Link>
            </nav>
          )}
        </main>
      </div>
    </div>
  );
}
