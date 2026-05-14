import type { Metadata } from "next";
import { Cairo, Space_Grotesk } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "AI Clipper - Viral Clips in Seconds",
  description: "Transform your long videos into viral short-form content with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased font-arabic">{children}</body>
    </html>
  );
}
