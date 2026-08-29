"use client";

import { Reader } from "../Reader";
import { useMail } from "../state";

export default function MailReadScreen() {
  const { isDesktop } = useMail();

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
      <Reader compact={!isDesktop} />
    </div>
  );
}
