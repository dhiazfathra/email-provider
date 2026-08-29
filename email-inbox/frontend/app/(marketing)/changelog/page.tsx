"use client";

import { RELEASES, releaseTagTint } from "@/lib/mock/marketing";
import { PageHead, useGridCols } from "../ui";

export default function PaneChangelog() {
  const cols = useGridCols();

  return (
    <>
      <PageHead
        kicker="Changelog"
        title="What shipped, in order."
        lead="Pane releases every second Thursday. Fixes go out as they land."
        maxWidth={640}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {RELEASES.map((r) => {
          const [tagBg, tagColor] = releaseTagTint(r.tag);
          return (
            <div
              key={r.version}
              style={{
                display: "grid",
                gridTemplateColumns: cols.log,
                gap: 24,
                padding: 26,
                borderRadius: 24,
                background: "rgba(255,255,255,.52)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,.85)",
                boxShadow: "0 24px 60px -48px rgba(76,66,160,.7)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 19,
                    fontWeight: 600,
                    letterSpacing: "-.025em",
                  }}
                >
                  {r.version}
                </div>
                <div style={{ fontSize: 13, opacity: 0.45, marginTop: 3 }}>
                  {r.date}
                </div>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: 10,
                    fontSize: 11.5,
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: 9,
                    background: tagBg,
                    color: tagColor,
                  }}
                >
                  {r.tag}
                </span>
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    letterSpacing: "-.02em",
                  }}
                >
                  {r.title}
                </div>
                <div
                  style={{
                    marginTop: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 9,
                  }}
                >
                  {r.items.map((it) => (
                    <div
                      key={it}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                        fontSize: 14.5,
                        lineHeight: 1.55,
                        opacity: 0.6,
                      }}
                    >
                      <span style={{ color: "#7c7ef2", fontWeight: 600 }}>
                        —
                      </span>
                      <span>{it}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
