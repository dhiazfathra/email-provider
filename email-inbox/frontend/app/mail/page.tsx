"use client";

import { EmailList } from "./EmailList";
import { useMail } from "./state";

export default function MailListScreen() {
  const { isMobile } = useMail();

  return (
    <div style={{ flex: 1, minHeight: 0, display: "grid" }}>
      <EmailList compact={isMobile} />
    </div>
  );
}
