"use client";

import { useRouter } from "next/navigation";
import { Compose } from "../Compose";

export default function MailComposeScreen() {
  const router = useRouter();

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
      <Compose onClose={() => router.push("/mail")} />
    </div>
  );
}
