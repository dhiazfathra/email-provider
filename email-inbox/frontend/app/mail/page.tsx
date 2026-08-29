"use client";

import { EmailList } from "./EmailList";

export default function MailListScreen() {
  // Row density is decided by CSS at the mobile breakpoint, not here.
  return (
    <div style={{ flex: 1, minHeight: 0, display: "grid" }}>
      <EmailList compact={false} />
    </div>
  );
}
