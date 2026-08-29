import type { Metadata, Viewport } from "next";
import { jetbrainsMono, outfit } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plume — Email your product sends, delivered and accounted for",
  description:
    "One API for receipts, password resets, notifications and bulk sends. Every message keeps a trace from the API call to the recipient's mail server.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
