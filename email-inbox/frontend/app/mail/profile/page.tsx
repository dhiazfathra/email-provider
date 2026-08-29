"use client";

import Link from "next/link";
import { PROFILE } from "@/lib/mock/mail";
import { useMail } from "../state";

export default function MailProfileScreen() {
  const { theme, isMobile, isDesktop } = useMail();

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
        padding: isMobile ? 20 : "30px 34px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          flexWrap: "wrap",
        }}
      >
        <div
          aria-hidden
          style={{
            width: 92,
            height: 92,
            flex: "none",
            borderRadius: 30,
            display: "grid",
            placeItems: "center",
            fontSize: 30,
            fontWeight: 600,
            color: "#fff",
            background: "linear-gradient(140deg,#8b8cf6,#6ee7f0)",
            boxShadow: "0 18px 40px -18px rgba(108,110,246,.9)",
          }}
        >
          {PROFILE.initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "-.02em",
            }}
          >
            {PROFILE.name}
          </h1>
          <div style={{ fontSize: 14, opacity: 0.5, marginTop: 4 }}>
            {PROFILE.headline}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
          <Link
            href="/mail/settings"
            style={{
              padding: "11px 18px",
              borderRadius: 13,
              fontSize: 14,
              fontWeight: 500,
              color: theme.accentSoft,
              background: theme.card,
              border: `1px solid ${theme.cardEdge}`,
            }}
          >
            Settings
          </Link>
          <button
            type="button"
            style={{
              padding: "11px 18px",
              borderRadius: 13,
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "inherit",
              cursor: "pointer",
              border: "none",
              color: "#fff",
              background: "linear-gradient(135deg,#7c7ef2,#a78bfa)",
              boxShadow: "0 12px 26px -12px rgba(124,126,242,.95)",
            }}
          >
            Edit profile
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "repeat(2,minmax(0,1fr))"
            : "repeat(4,minmax(0,1fr))",
          gap: 12,
          marginTop: 28,
        }}
      >
        {PROFILE.stats.map((st) => (
          <div
            key={st.label}
            style={{
              padding: 18,
              borderRadius: 18,
              background: theme.card,
              border: `1px solid ${theme.cardEdge}`,
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: "-.02em",
              }}
            >
              {st.value}
            </div>
            <div style={{ fontSize: 12.5, opacity: 0.5, marginTop: 3 }}>
              {st.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "repeat(2,minmax(0,1fr))" : "1fr",
          gap: 16,
          marginTop: 16,
        }}
      >
        <div
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
            Details
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: 13 }}
          >
            {PROFILE.details.map((d) => (
              <div key={d.k} style={{ display: "flex", gap: 14, fontSize: 14 }}>
                <span style={{ flex: "0 0 108px", opacity: 0.5 }}>{d.k}</span>
                <span style={{ flex: 1, minWidth: 0, fontWeight: 500 }}>
                  {d.v}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div
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
            Signature
          </div>
          <div
            style={{
              padding: 16,
              borderRadius: 14,
              background: theme.card,
              border: `1px solid ${theme.cardEdge}`,
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <div style={{ fontWeight: 600 }}>{PROFILE.signature.name}</div>
            <div style={{ opacity: 0.55 }}>{PROFILE.signature.role}</div>
            <div style={{ opacity: 0.55 }}>{PROFILE.signature.phone}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
