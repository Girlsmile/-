import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "力训记录",
  description: "记录训练、打卡和训练趋势的个人应用"
};

/** RootLayout wires global document chrome and styles for the app router. */
export default function RootLayout({
  children
}: Readonly<{
  /** Nested route content rendered by Next.js. */
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
