import type { Metadata, Viewport } from "next";
import { outfit } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pane — An inbox that sorts itself before you open it",
  description:
    "Pane splits mail into Primary, Social, Promotions, Newsletters and one-time codes as it arrives. What is left is the mail you actually answer.",
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
    <html lang="en" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
