"use client";

import { EmailList } from "../EmailList";
import { Reader } from "../Reader";
import { useMail } from "../state";

/**
 * Two panes side by side. Below the desktop breakpoint there is no room for
 * both, so the mockup falls back to the reader alone.
 */
export default function MailSplitScreen() {
  const { isDesktop } = useMail();

  if (!isDesktop) {
    return (
      <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
        <Reader compact />
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "grid",
        gridTemplateColumns: "minmax(360px,440px) 1fr",
        gap: 16,
      }}
    >
      <EmailList compact />
      <Reader compact />
    </div>
  );
}
