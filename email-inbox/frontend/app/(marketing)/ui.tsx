"use client";

import type { CSSProperties, ReactNode } from "react";
import { useViewport } from "@/lib/useViewport";

export const PRIMARY = "linear-gradient(135deg,#7c7ef2,#a78bfa)";

/** Frosted card used across every marketing section. */
export function Card({
  children,
  style,
  alpha = 0.55,
  blur = 20,
}: {
  children: ReactNode;
  style?: CSSProperties;
  alpha?: number;
  blur?: number;
}) {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 22,
        background: `rgba(255,255,255,${alpha})`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: "1px solid rgba(255,255,255,.85)",
        boxShadow: "0 24px 60px -44px rgba(76,66,160,.7)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Gradient glyph tile that heads most cards. */
export function GlyphTile({ glyph, tint }: { glyph: string; tint: string }) {
  return (
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
        background: tint,
        boxShadow: "0 10px 22px -12px rgba(108,110,246,.9)",
      }}
    >
      {glyph}
    </div>
  );
}

/** Kicker + h1 + lead that opens every sub-page. */
export function PageHead({
  kicker,
  title,
  lead,
  updated,
  maxWidth = 720,
}: {
  kicker: string;
  title: string;
  lead: string;
  updated?: string;
  maxWidth?: number;
}) {
  const { narrow, mob } = useViewport();
  return (
    <section style={{ padding: mob ? "44px 0 34px" : "68px 0 40px" }}>
      <div
        style={{
          fontSize: 12.5,
          fontWeight: 600,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "#7c7ef2",
        }}
      >
        {kicker}
      </div>
      <h1
        style={{
          margin: "14px 0 0",
          fontSize: mob ? 38 : narrow ? 46 : 54,
          lineHeight: 1.06,
          fontWeight: 600,
          letterSpacing: "-.035em",
          maxWidth,
          textWrap: "balance",
        }}
      >
        {title}
      </h1>
      <p
        style={{
          margin: "18px 0 0",
          fontSize: 17.5,
          lineHeight: 1.6,
          opacity: 0.6,
          maxWidth: 560,
          textWrap: "pretty",
        }}
      >
        {lead}
      </p>
      {updated && (
        <div style={{ marginTop: 14, fontSize: 13, opacity: 0.45 }}>
          Last updated {updated}
        </div>
      )}
    </section>
  );
}

export function SectionHeading({ children }: { children: ReactNode }) {
  const { mob } = useViewport();
  return (
    <h2
      style={{
        margin: 0,
        fontSize: mob ? 26 : 32,
        fontWeight: 600,
        letterSpacing: "-.03em",
      }}
    >
      {children}
    </h2>
  );
}

/** Three-up card grid, collapsing at the design's breakpoints. */
export function useGridCols() {
  const { narrow, mob } = useViewport();
  return {
    feat: mob
      ? "1fr"
      : narrow
        ? "repeat(2,minmax(0,1fr))"
        : "repeat(3,minmax(0,1fr))",
    pair: mob ? "1fr" : "repeat(2,minmax(0,1fr))",
    plans: narrow ? "1fr" : "repeat(3,minmax(0,1fr))",
    log: mob ? "1fr" : "180px minmax(0,1fr)",
  };
}

/** Card with glyph, title and body — the repeated feature/security tile. */
export function FeatureCard({
  glyph,
  title,
  body,
  tint,
  children,
}: {
  glyph?: string;
  title: string;
  body: string;
  tint?: string;
  children?: ReactNode;
}) {
  return (
    <Card>
      {glyph && tint && <GlyphTile glyph={glyph} tint={tint} />}
      <div
        style={{
          marginTop: glyph ? 16 : 0,
          fontSize: 16.5,
          fontWeight: 600,
          letterSpacing: "-.015em",
        }}
      >
        {title}
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
        {body}
      </div>
      {children}
    </Card>
  );
}
