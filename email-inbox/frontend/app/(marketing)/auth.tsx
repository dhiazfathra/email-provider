"use client";

import Link from "next/link";
import { AUTH_PROVIDERS } from "@/lib/mock/marketing";
import { PRIMARY } from "./ui";

type Field = { label: string; type: string; placeholder: string };

/** Shared body for /signin and /signup — same layout, different copy. */
export function AuthPage({
  title,
  lead,
  points,
  formTitle,
  fields,
  submitLabel,
  switchPrompt,
  switchLabel,
  switchHref,
}: {
  title: string;
  lead: string;
  points: string[];
  formTitle: string;
  fields: Field[];
  submitLabel: string;
  switchPrompt: string;
  switchLabel: string;
  switchHref: string;
}) {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "var(--auth-cols)",
        gap: 44,
        alignItems: "center",
        padding: "var(--hero-pad)",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <h1
          style={{
            margin: 0,
            fontSize: "var(--h1)",
            lineHeight: 1.06,
            fontWeight: 600,
            letterSpacing: "-.035em",
            textWrap: "balance",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            margin: "18px 0 0",
            fontSize: 17,
            lineHeight: 1.6,
            opacity: 0.6,
            maxWidth: 440,
            textWrap: "pretty",
          }}
        >
          {lead}
        </p>
        <div
          style={{
            marginTop: 26,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {points.map((p) => (
            <div
              key={p}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                fontSize: 14.5,
                opacity: 0.58,
              }}
            >
              <span style={{ color: "#7c7ef2", fontWeight: 600 }}>✓</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          minWidth: 0,
          padding: 30,
          borderRadius: 28,
          background: "rgba(255,255,255,.6)",
          backdropFilter: "blur(26px)",
          WebkitBackdropFilter: "blur(26px)",
          border: "1px solid rgba(255,255,255,.85)",
          boxShadow: "0 40px 80px -42px rgba(76,66,160,.6)",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-.02em" }}>
          {formTitle}
        </div>
        <div
          style={{
            marginTop: 18,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {AUTH_PROVIDERS.map((p) => (
            <Link
              key={p.label}
              href="/mail"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: 12,
                borderRadius: 14,
                fontSize: 14.5,
                fontWeight: 500,
                color: "#26234a",
                background: "rgba(255,255,255,.85)",
                border: "1px solid rgba(255,255,255,.95)",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 7,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 11,
                  color: "#fff",
                  background: p.tint,
                }}
              >
                {p.glyph}
              </span>
              {p.label}
            </Link>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "20px 0",
          }}
        >
          <div
            style={{ flex: 1, height: 1, background: "rgba(38,35,74,.12)" }}
          />
          <span style={{ fontSize: 12, opacity: 0.4 }}>or</span>
          <div
            style={{ flex: 1, height: 1, background: "rgba(38,35,74,.12)" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {fields.map((f) => (
            <label
              key={f.label}
              style={{ display: "flex", flexDirection: "column", gap: 6 }}
            >
              <span style={{ fontSize: 12.5, fontWeight: 500, opacity: 0.55 }}>
                {f.label}
              </span>
              <input
                type={f.type}
                placeholder={f.placeholder}
                autoComplete={
                  f.type === "password"
                    ? "current-password"
                    : f.type === "email"
                      ? "email"
                      : "name"
                }
                style={{
                  padding: "13px 14px",
                  borderRadius: 14,
                  fontSize: 14.5,
                  fontFamily: "inherit",
                  color: "#26234a",
                  background: "rgba(255,255,255,.9)",
                  border: "1px solid rgba(124,126,242,.22)",
                  outline: "none",
                }}
              />
            </label>
          ))}
        </div>
        <Link
          href="/mail"
          style={{
            display: "block",
            marginTop: 20,
            textAlign: "center",
            padding: 14,
            borderRadius: 15,
            fontSize: 15,
            fontWeight: 500,
            color: "#fff",
            background: PRIMARY,
            boxShadow: "0 14px 30px -14px rgba(124,126,242,.95)",
          }}
        >
          {submitLabel}
        </Link>
        <div
          style={{
            marginTop: 16,
            fontSize: 13.5,
            opacity: 0.55,
            textAlign: "center",
          }}
        >
          {switchPrompt}{" "}
          <Link href={switchHref} style={{ fontWeight: 500 }}>
            {switchLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
