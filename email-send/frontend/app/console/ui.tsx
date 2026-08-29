import type { CSSProperties, ReactNode } from "react";

/** Frosted panel used for every console card. */
export function Card({
  children,
  style,
  blur = 22,
  alpha = 0.55,
}: {
  children: ReactNode;
  style?: CSSProperties;
  blur?: number;
  alpha?: number;
}) {
  return (
    <div
      style={{
        borderRadius: 24,
        background: `rgba(255,255,255,${alpha})`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: "1px solid rgba(255,255,255,.88)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Coloured status pill. */
export function Tag({
  children,
  bg,
  color,
  style,
}: {
  children: ReactNode;
  bg: string;
  color: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 600,
        padding: "4px 10px",
        borderRadius: 9,
        background: bg,
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** Filter chip row item — a real button, unlike the mockup's anchor. */
export function FilterChip({
  label,
  count,
  dot,
  active,
  onClick,
}: {
  label: string;
  count?: string | number;
  dot: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 13px",
        borderRadius: 12,
        fontSize: 13.5,
        fontFamily: "inherit",
        cursor: "pointer",
        fontWeight: active ? 600 : 400,
        color: active ? "#4c46b8" : "rgba(38,35,74,.62)",
        background: active ? "rgba(255,255,255,.88)" : "rgba(255,255,255,.45)",
        border: `1px solid ${active ? "rgba(124,126,242,.4)" : "rgba(255,255,255,.85)"}`,
      }}
    >
      <span
        aria-hidden
        style={{ width: 7, height: 7, borderRadius: "50%", background: dot }}
      />
      {label}
      {count !== undefined && <span style={{ opacity: 0.45 }}>{count}</span>}
    </button>
  );
}

export const MONO = "var(--font-jetbrains-mono), monospace";

export const ELLIPSIS: CSSProperties = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const COLUMN_HEADER: CSSProperties = {
  fontSize: 11.5,
  fontWeight: 600,
  letterSpacing: ".1em",
  textTransform: "uppercase",
  opacity: 0.4,
};

/** Dark code panel shared by the landing snippet and the message payload. */
export function CodeBlock({
  lines,
  style,
}: {
  lines: { line: string; color: string }[];
  style?: CSSProperties;
}) {
  return (
    <pre
      style={{
        margin: 0,
        fontFamily: MONO,
        fontSize: 12.5,
        lineHeight: 1.7,
        overflow: "auto",
        ...style,
      }}
    >
      {lines.map((l, i) => (
        <div key={i} style={{ whiteSpace: "pre", color: l.color }}>
          {l.line || " "}
        </div>
      ))}
    </pre>
  );
}
