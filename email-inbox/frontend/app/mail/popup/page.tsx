"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Compose } from "../Compose";
import { EmailList } from "../EmailList";
import { useMail } from "../state";

/** The list with a draft docked over its bottom-right corner. */
export default function MailPopupScreen() {
  const { isMobile } = useMail();
  const [minimized, setMinimized] = useState(false);
  const router = useRouter();

  return (
    <>
      <div style={{ flex: 1, minHeight: 0, display: "grid" }}>
        <EmailList compact={isMobile} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: isMobile ? 78 : 0,
          left: isMobile ? 0 : "auto",
          width: isMobile ? "auto" : 520,
          height: minimized ? "auto" : 560,
          zIndex: 5,
          display: "flex",
        }}
      >
        <Compose
          popup
          minimized={minimized}
          onToggle={() => setMinimized((m) => !m)}
          onClose={() => router.push("/mail")}
        />
      </div>
    </>
  );
}
