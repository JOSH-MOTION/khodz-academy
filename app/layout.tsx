import type { Metadata, Viewport } from "next";
import { Space_Grotesk, DM_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Khodz Academy — High Performance LMS",
  description:
    "Khodz Academy is a high-performance Learning Management System built for coders. Master programming through structured video lessons, slides, and live progress tracking.",
  keywords: ["Khodz Academy", "LMS", "coding school", "programming courses", "online learning"],
  authors: [{ name: "Khodz Academy", url: "https://khodz.com" }],
  metadataBase: new URL("https://khodz.com"),

  // ── Open Graph ──
  // og-image.png: 1200×630px — navy (#010d1a) background with cyan logo centred
  openGraph: {
    title: "Khodz Academy — High Performance LMS",
    description:
      "Master programming through structured video lessons, slides, and live progress tracking. Join Khodz Academy today.",
    url: "https://khodz.com",
    siteName: "Khodz Academy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Khodz Academy — High Performance Learning Management System",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // ── Twitter / X Card ──
  twitter: {
    card: "summary_large_image",
    title: "Khodz Academy — High Performance LMS",
    description:
      "Master programming through structured video lessons, slides, and live progress tracking.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Khodz Academy" }],
  },

  // ── Favicon / Icons ──
  // All icons derived from k3.png (3000×1156 original) — cyan logo
  // Square crops generated at 16, 32, 48, 180, 192, 512 px
  icons: {
    icon: [
      { url: "/khodz-icon-16.png",  sizes: "16x16",  type: "image/png" },
      { url: "/khodz-icon-32.png",  sizes: "32x32",  type: "image/png" },
      { url: "/khodz-icon-48.png",  sizes: "48x48",  type: "image/png" },
      { url: "/khodz-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/khodz-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple:   { url: "/khodz-icon-180.png", sizes: "180x180", type: "image/png" },
    shortcut: "/khodz-icon-32.png",
  },

  // ── Mobile browser chrome colour ──
  // NOTE: themeColor must be in viewport export in Next.js 16+
};

export const viewport: Viewport = {
  themeColor: "#010d1a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${dmMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
