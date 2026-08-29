"use client";

import { useViewport } from "@/lib/useViewport";
import { TEMPLATES } from "@/lib/mock/console";
import { Card, ELLIPSIS, MONO } from "../ui";

export default function ConsoleTemplates() {
  const { narrow, mob } = useViewport();

  return (
    <section
      style={{
        marginTop: 24,
        display: "grid",
        gridTemplateColumns: mob
          ? "1fr"
          : narrow
            ? "repeat(2,minmax(0,1fr))"
            : "repeat(3,minmax(0,1fr))",
        gap: 14,
      }}
    >
      {TEMPLATES.map((t) => (
        <Card
          key={t.slug}
          blur={20}
          style={{
            padding: 20,
            borderRadius: 22,
            boxShadow: "0 24px 60px -50px rgba(76,66,160,.7)",
          }}
        >
          <div
            aria-hidden
            style={{
              height: 96,
              borderRadius: 16,
              background: t.tint,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              gap: 5,
              padding: 14,
            }}
          >
            <span
              style={{
                width: "52%",
                height: 7,
                borderRadius: 4,
                background: "rgba(255,255,255,.85)",
              }}
            />
            <span
              style={{
                width: "80%",
                height: 5,
                borderRadius: 4,
                background: "rgba(255,255,255,.55)",
              }}
            />
            <span
              style={{
                width: "66%",
                height: 5,
                borderRadius: 4,
                background: "rgba(255,255,255,.4)",
              }}
            />
          </div>
          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 9,
            }}
          >
            <span
              style={{
                fontSize: 15.5,
                fontWeight: 600,
                letterSpacing: "-.015em",
                flex: 1,
                minWidth: 0,
                ...ELLIPSIS,
              }}
            >
              {t.name}
            </span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                padding: "3px 9px",
                borderRadius: 8,
                background: "rgba(124,126,242,.14)",
                color: "#5b57c8",
              }}
            >
              v{t.version}
            </span>
          </div>
          <div
            style={{
              marginTop: 6,
              fontFamily: MONO,
              fontSize: 11.5,
              opacity: 0.45,
            }}
          >
            {t.slug}
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 18 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{t.sends}</div>
              <div style={{ fontSize: 11.5, opacity: 0.45 }}>30d sends</div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: parseFloat(t.open) > 50 ? "#0e8f80" : "#6d4fd6",
                }}
              >
                {t.open}
              </div>
              <div style={{ fontSize: 11.5, opacity: 0.45 }}>Open rate</div>
            </div>
          </div>
        </Card>
      ))}
    </section>
  );
}
