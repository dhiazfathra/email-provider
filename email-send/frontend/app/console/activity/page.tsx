"use client";

import { useState } from "react";
import { MESSAGES, messageCounts } from "@/lib/data/messages";
import { MESSAGE_STATES } from "@/lib/enums";
import { formatCount } from "@/lib/format";
import { stateTint } from "@/lib/theme";
import { messageDetail } from "@/lib/mock/console";
import {
  Card,
  CodeBlock,
  COLUMN_HEADER,
  ELLIPSIS,
  FilterChip,
  MONO,
  Tag,
} from "../ui";
import { SentAt } from "./sent-at";

const STATE_DOT: Record<(typeof MESSAGE_STATES)[number], string> = {
  queued: "#7c7ef2",
  delivered: "#5eead4",
  bounced: "#c084fc",
  deferred: "#a78bfa",
  suppressed: "#94a3b8",
};

export default function ConsoleActivity() {
  const [filter, setFilter] = useState<"All" | (typeof MESSAGE_STATES)[number]>(
    "All",
  );
  const [selected, setSelected] = useState(2);

  const cols = "var(--log-cols)";
  const counts = messageCounts();

  const rows = MESSAGES.map((e, i) => ({ ...e, index: i })).filter(
    (e) => filter === "All" || e.state === filter,
  );
  const detail = messageDetail(selected);

  return (
    <>
      <section
        style={{
          marginTop: 24,
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <FilterChip
          label="All"
          count={formatCount(MESSAGES.length)}
          dot="#7c7ef2"
          active={filter === "All"}
          onClick={() => setFilter("All")}
        />
        {MESSAGE_STATES.map((s) => (
          <FilterChip
            key={s}
            label={s}
            count={formatCount(counts[s] ?? 0)}
            dot={STATE_DOT[s]}
            active={filter === s}
            onClick={() => setFilter(s)}
          />
        ))}
      </section>

      <Card
        alpha={0.5}
        style={{
          marginTop: 14,
          padding: 8,
          boxShadow: "0 28px 66px -50px rgba(76,66,160,.7)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            gap: 16,
            padding: "12px 16px",
            ...COLUMN_HEADER,
          }}
        >
          <span>Recipient</span>
          <span className="wide-only">Subject</span>
          <span className="wide-only">Stream</span>
          <span className="wide-only">Status</span>
          <span style={{ textAlign: "right" }}>Time</span>
        </div>
        {rows.map((e) => {
          const on = e.index === selected;
          const { bg: tagBg, fg: tagColor } = stateTint(e.state);
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => setSelected(e.index)}
              aria-expanded={on}
              style={{
                width: "100%",
                textAlign: "left",
                font: "inherit",
                border: "none",
                cursor: "pointer",
                display: "grid",
                gridTemplateColumns: cols,
                gap: 16,
                alignItems: "center",
                padding: "14px 16px",
                borderRadius: 17,
                background: on
                  ? "rgba(255,255,255,.9)"
                  : e.index % 2
                    ? "transparent"
                    : "rgba(255,255,255,.5)",
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 12.5, ...ELLIPSIS }}>
                {e.to}
              </span>
              <span
                className="wide-only"
                style={{ fontSize: 13.5, opacity: 0.75, ...ELLIPSIS }}
              >
                {e.subject}
              </span>
              <span
                className="wide-only"
                style={{ fontSize: 12.5, opacity: 0.5, ...ELLIPSIS }}
              >
                {e.stream}
              </span>
              <Tag
                bg={tagBg}
                color={tagColor}
                style={{ justifySelf: "start", display: "var(--wide-only)" }}
              >
                {e.state}
              </Tag>
              <span
                style={{
                  fontSize: 12.5,
                  opacity: 0.45,
                  textAlign: "right",
                  whiteSpace: "nowrap",
                }}
              >
                <SentAt iso={e.sent_at} />
              </span>
            </button>
          );
        })}
      </Card>

      {detail && (
        <Card
          alpha={0.62}
          style={{
            marginTop: 14,
            padding: 24,
            border: "1px solid rgba(255,255,255,.9)",
            boxShadow: "0 28px 66px -48px rgba(76,66,160,.7)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 16.5,
                fontWeight: 600,
                letterSpacing: "-.02em",
              }}
            >
              {detail.subject}
            </div>
            <Tag
              bg={stateTint(detail.state).bg}
              color={stateTint(detail.state).fg}
            >
              {detail.state}
            </Tag>
            <div style={{ flex: 1 }} />
            <span style={{ fontFamily: MONO, fontSize: 12, opacity: 0.45 }}>
              {detail.id}
            </span>
          </div>
          <div
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: "var(--trace-cols)",
              gap: 18,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              {detail.trace.map((t) => (
                <div
                  key={t.step}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "20px minmax(0,1fr)",
                    gap: 12,
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: "50%",
                        background: t.dot,
                        marginTop: 4,
                      }}
                    />
                    <span style={{ flex: 1, width: 2, background: t.line }} />
                  </div>
                  <div style={{ paddingBottom: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      {t.step}
                    </div>
                    <div style={{ fontSize: 13, opacity: 0.5, marginTop: 2 }}>
                      {t.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <CodeBlock
              lines={detail.payload}
              style={{
                padding: 16,
                borderRadius: 18,
                background: "rgba(38,35,74,.9)",
                color: "#dcd9ff",
              }}
            />
          </div>
        </Card>
      )}
    </>
  );
}
