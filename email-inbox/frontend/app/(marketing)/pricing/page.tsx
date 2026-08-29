"use client";

import Link from "next/link";
import { FAQ, PLANS } from "@/lib/mock/marketing";
import { PageHead, PRIMARY, SectionHeading, useGridCols } from "../ui";

export default function PanePricing() {
  const cols = useGridCols();

  return (
    <>
      <PageHead
        kicker="Pricing"
        title="One price per person. No seat maths."
        lead="Billed yearly. Switch or cancel at any point and keep an export of everything."
        maxWidth={700}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: cols.plans,
          gap: 16,
          alignItems: "start",
        }}
      >
        {PLANS.map((p) => (
          <div
            key={p.name}
            style={{
              padding: 28,
              borderRadius: 26,
              background: p.hero
                ? "rgba(255,255,255,.78)"
                : "rgba(255,255,255,.5)",
              backdropFilter: "blur(22px)",
              WebkitBackdropFilter: "blur(22px)",
              border: `1px solid ${p.hero ? "rgba(124,126,242,.4)" : "rgba(255,255,255,.85)"}`,
              boxShadow: "0 30px 70px -46px rgba(76,66,160,.7)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: "-.02em",
                }}
              >
                {p.name}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 9px",
                  borderRadius: 8,
                  background: p.hero ? "#7c7ef2" : "rgba(124,126,242,.14)",
                  color: p.hero ? "#fff" : "#5b57c8",
                }}
              >
                {p.tag}
              </span>
            </div>
            <div
              style={{
                marginTop: 18,
                display: "flex",
                alignItems: "baseline",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 600,
                  letterSpacing: "-.035em",
                }}
              >
                {p.price}
              </span>
              <span style={{ fontSize: 14, opacity: 0.5 }}>{p.unit}</span>
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 14,
                opacity: 0.55,
                lineHeight: 1.55,
                textWrap: "pretty",
              }}
            >
              {p.blurb}
            </div>
            <Link
              href="/signup"
              style={{
                display: "block",
                marginTop: 20,
                textAlign: "center",
                padding: 13,
                borderRadius: 14,
                fontSize: 14.5,
                fontWeight: 500,
                color: p.hero ? "#fff" : "#5b57c8",
                background: p.hero ? PRIMARY : "rgba(255,255,255,.8)",
                border: `1px solid ${p.hero ? "transparent" : "rgba(255,255,255,.95)"}`,
              }}
            >
              {p.cta}
            </Link>
            <div
              style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                gap: 9,
              }}
            >
              {p.items.map((it) => (
                <div
                  key={it}
                  style={{
                    display: "flex",
                    gap: 9,
                    alignItems: "flex-start",
                    fontSize: 14,
                    opacity: 0.62,
                  }}
                >
                  <span style={{ color: "#7c7ef2", fontWeight: 600 }}>✓</span>
                  <span>{it}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <section style={{ marginTop: 44 }}>
        <SectionHeading>Questions people ask first</SectionHeading>
        <div
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: cols.pair,
            gap: 16,
          }}
        >
          {FAQ.map((q) => (
            <div
              key={q.q}
              style={{
                padding: 22,
                borderRadius: 20,
                background: "rgba(255,255,255,.5)",
                border: "1px solid rgba(255,255,255,.85)",
              }}
            >
              <div
                style={{
                  fontSize: 15.5,
                  fontWeight: 600,
                  letterSpacing: "-.015em",
                }}
              >
                {q.q}
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
                {q.a}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
