"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { NAV, PAGE_META } from "@/lib/mock/console";
import { PROJECT } from "@/lib/data/project";
import { TEMPLATES } from "@/lib/data/templates";
import { DOMAINS } from "@/lib/data/domains";
import { SUPPRESSIONS } from "@/lib/data/suppressions";
import { formatCount } from "@/lib/format";
import { DEFAULT_RANGE, RANGES, isRange } from "@/lib/ranges";

const NAV_BADGE: Record<string, number> = {
  "/console/templates": TEMPLATES.length,
  "/console/domains": DOMAINS.length,
  "/console/suppressions": SUPPRESSIONS.length,
};

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <ConsoleLayoutInner>{children}</ConsoleLayoutInner>
    </Suspense>
  );
}

function ConsoleLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rangeParam = searchParams.get("range") ?? undefined;
  const range = isRange(rangeParam) ? rangeParam : DEFAULT_RANGE;
  const setRange = (r: (typeof RANGES)[number]) =>
    router.replace(`${pathname}?range=${r}`, { scroll: false });

  const meta = PAGE_META[pathname] ?? PAGE_META["/console"];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        color: "#26234a",
        background:
          "linear-gradient(150deg,#eef2ff 0%,#f6f0ff 42%,#eafaff 100%)",
      }}
    >
      <div
        className="drift"
        aria-hidden
        style={{
          position: "absolute",
          top: -240,
          left: -160,
          width: 760,
          height: 760,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(129,140,248,.42),rgba(129,140,248,0) 68%)",
          filter: "blur(30px)",
          animationDuration: "24s",
        }}
      />
      <div
        className="drift"
        aria-hidden
        style={{
          position: "absolute",
          top: 420,
          right: -200,
          width: 800,
          height: 800,
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
          display: "grid",
          gridTemplateColumns: "var(--console-shell-cols)",
          minHeight: "100vh",
        }}
      >
        <aside
          style={{
            display: "var(--console-rail-display)",
            flexDirection: "column",
            gap: 22,
            padding: "22px 18px",
            borderRight: "1px solid rgba(255,255,255,.7)",
            background: "rgba(255,255,255,.42)",
            backdropFilter: "blur(26px)",
            WebkitBackdropFilter: "blur(26px)",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              padding: "4px 8px",
              color: "inherit",
            }}
          >
            <span
              aria-hidden
              style={{
                width: 32,
                height: 32,
                borderRadius: 11,
                background: "linear-gradient(140deg,#8b8cf6,#6ee7f0)",
                boxShadow: "0 6px 16px -6px rgba(108,110,246,.9)",
              }}
            />
            <span
              style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-.02em" }}
            >
              Plume
            </span>
          </Link>

          <div
            style={{
              padding: "12px 13px",
              borderRadius: 16,
              background: "rgba(255,255,255,.7)",
              border: "1px solid rgba(255,255,255,.9)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                opacity: 0.42,
              }}
            >
              Project
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 7,
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 8,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#fff",
                  background: "linear-gradient(140deg,#7c7ef2,#a78bfa)",
                }}
              >
                {PROJECT.initial}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                {PROJECT.name}
              </span>
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {NAV.map((n) => {
              const on = pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={on ? "page" : undefined}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "22px minmax(0,1fr) auto",
                    alignItems: "center",
                    gap: 11,
                    padding: "10px 12px",
                    borderRadius: 13,
                    fontSize: 14,
                    fontWeight: on ? 600 : 400,
                    color: on ? "#4c46b8" : "rgba(38,35,74,.68)",
                    background: on ? "rgba(255,255,255,.85)" : "transparent",
                  }}
                >
                  <span aria-hidden style={{ fontSize: 13, opacity: 0.85 }}>
                    {n.glyph}
                  </span>
                  <span>{n.label}</span>
                  {NAV_BADGE[n.href] !== undefined && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 7px",
                        borderRadius: 7,
                        background: "rgba(124,126,242,.14)",
                        color: "#5b57c8",
                      }}
                    >
                      {formatCount(NAV_BADGE[n.href])}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div style={{ flex: 1 }} />

          {PROJECT.demo && (
            <div
              style={{
                padding: "10px 13px",
                borderRadius: 14,
                fontSize: 12.5,
                opacity: 0.55,
                background: "rgba(255,255,255,.5)",
                border: "1px solid rgba(255,255,255,.85)",
              }}
            >
              Demo project — sample data, not live.
            </div>
          )}
        </aside>

        <main
          style={{
            minWidth: 0,
            padding: "var(--console-main-pad)",
          }}
        >
          <header
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "var(--console-h1)",
                  fontWeight: 600,
                  letterSpacing: "-.03em",
                }}
              >
                {meta.title}
              </h1>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 14.5,
                  opacity: 0.55,
                  textWrap: "pretty",
                }}
              >
                {meta.blurb}
              </p>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", gap: 8 }}>
              {RANGES.map((r) => {
                const on = range === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRange(r)}
                    aria-pressed={on}
                    style={{
                      padding: "9px 14px",
                      borderRadius: 12,
                      fontSize: 13.5,
                      fontFamily: "inherit",
                      cursor: "pointer",
                      fontWeight: on ? 600 : 400,
                      color: on ? "#4c46b8" : "rgba(38,35,74,.6)",
                      background: on
                        ? "rgba(255,255,255,.85)"
                        : "rgba(255,255,255,.45)",
                      border: `1px solid ${on ? "rgba(124,126,242,.4)" : "rgba(255,255,255,.85)"}`,
                    }}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </header>

          {/* Mobile navigation: the sidebar is hidden below 720px in the design,
              so the section links move inline. */}
          <nav
            style={{
              display: "var(--console-tabs-display)",
              gap: 8,
              marginTop: 18,
              overflowX: "auto",
              paddingBottom: 4,
            }}
          >
            {NAV.map((n) => {
              const on = pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={on ? "page" : undefined}
                  style={{
                    whiteSpace: "nowrap",
                    padding: "8px 13px",
                    borderRadius: 12,
                    fontSize: 13.5,
                    fontWeight: on ? 600 : 400,
                    color: on ? "#4c46b8" : "rgba(38,35,74,.62)",
                    background: on
                      ? "rgba(255,255,255,.88)"
                      : "rgba(255,255,255,.45)",
                    border: `1px solid ${on ? "rgba(124,126,242,.4)" : "rgba(255,255,255,.85)"}`,
                  }}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          {children}
        </main>
      </div>
    </div>
  );
}
