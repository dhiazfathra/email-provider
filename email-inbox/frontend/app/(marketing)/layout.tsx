"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FOOTER_LINKS, NAV_LINKS } from "@/lib/mock/marketing";
import { useViewport } from "@/lib/useViewport";
import { PRIMARY } from "./ui";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { mob } = useViewport();

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
            "radial-gradient(circle,rgba(167,139,250,.42),rgba(167,139,250,0) 68%)",
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
          top: 1100,
          left: 120,
          width: 620,
          height: 620,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(103,232,249,.38),rgba(103,232,249,0) 66%)",
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
            display: "flex",
            alignItems: "center",
            gap: 18,
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
              Pane
            </span>
          </Link>
          {!mob && (
            <nav style={{ display: "flex", gap: 4, marginLeft: 14 }}>
              {NAV_LINKS.map((l) => {
                const on = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    aria-current={on ? "page" : undefined}
                    style={{
                      padding: "9px 14px",
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: on ? 600 : 400,
                      color: on ? "#4c46b8" : "rgba(38,35,74,.68)",
                      background: on ? "rgba(255,255,255,.8)" : "transparent",
                    }}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          )}
          <div style={{ flex: 1 }} />
          <Link
            href="/signin"
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
            href="/signup"
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
            Get Pane free
          </Link>
        </header>

        {children}

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
            <span
              aria-hidden
              style={{
                width: 22,
                height: 22,
                borderRadius: 8,
                background: "linear-gradient(140deg,#8b8cf6,#6ee7f0)",
              }}
            />
            <span style={{ fontWeight: 500 }}>Pane</span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
            {FOOTER_LINKS.map((l) => (
              <Link key={l.href} href={l.href} style={{ color: "inherit" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
