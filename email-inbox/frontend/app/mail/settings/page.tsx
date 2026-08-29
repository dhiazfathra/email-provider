"use client";

import { SETTING_GROUPS } from "@/lib/mock/mail";
import { useMail } from "../state";

export default function MailSettingsScreen() {
  const { theme, toggles, flip } = useMail();

  return (
    <section
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        borderRadius: 26,
        background: theme.glass,
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        border: `1px solid ${theme.edge}`,
        boxShadow: "0 30px 70px -40px rgba(76,66,160,.55)",
        padding: "var(--mail-page-pad)",
      }}
    >
      <h1
        style={{
          margin: "0 0 4px",
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "-.02em",
        }}
      >
        Settings
      </h1>
      <p style={{ margin: "0 0 26px", fontSize: 14, opacity: 0.5 }}>
        Preferences apply to this account on every device.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "var(--mail-settings-cols)",
          gap: 16,
        }}
      >
        {SETTING_GROUPS.map((g) => (
          <div
            key={g.title}
            style={{
              padding: 20,
              borderRadius: 20,
              background: theme.card,
              border: `1px solid ${theme.cardEdge}`,
            }}
          >
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: ".09em",
                textTransform: "uppercase",
                opacity: 0.42,
                marginBottom: 14,
              }}
            >
              {g.title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {g.rows.map((r) => {
                const on = r.kind === "switch" ? toggles[r.key] : false;
                const body = (
                  <>
                    <span style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                      <span
                        style={{
                          display: "block",
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        {r.label}
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: 12.5,
                          opacity: 0.45,
                          marginTop: 2,
                        }}
                      >
                        {r.hint}
                      </span>
                    </span>
                    {r.kind === "switch" ? (
                      <span
                        aria-hidden
                        style={{
                          width: 42,
                          height: 24,
                          flex: "none",
                          borderRadius: 12,
                          padding: 3,
                          display: "flex",
                          justifyContent: on ? "flex-end" : "flex-start",
                          background: on
                            ? "linear-gradient(135deg,#7c7ef2,#a78bfa)"
                            : "rgba(124,126,242,.2)",
                          transition: "background .18s",
                        }}
                      >
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: "#fff",
                            boxShadow: "0 2px 6px -1px rgba(76,66,160,.5)",
                          }}
                        />
                      </span>
                    ) : (
                      <span
                        style={{
                          flex: "none",
                          fontSize: 13,
                          fontWeight: 500,
                          color: theme.chipFg,
                          padding: "5px 11px",
                          borderRadius: 10,
                          background: theme.chipBg,
                        }}
                      >
                        {r.value}
                      </span>
                    )}
                  </>
                );

                if (r.kind === "value") {
                  return (
                    <div
                      key={r.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                      }}
                    >
                      {body}
                    </div>
                  );
                }

                return (
                  <button
                    key={r.label}
                    type="button"
                    role="switch"
                    aria-checked={on}
                    onClick={() => flip(r.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: 0,
                      border: "none",
                      background: "transparent",
                      fontFamily: "inherit",
                      color: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    {body}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
