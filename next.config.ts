import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Output ──
  // 'standalone' bundles everything Vercel needs; no extra config required on Vercel itself.
  output: "standalone",

  // ── Image Optimisation ──
  images: {
    // Allow external image domains used in the app
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "customer-*.cloudflarestream.com",
      },
    ],
    // Modern formats for smaller payloads
    formats: ["image/avif", "image/webp"],
    // Reasonable device sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ── Security & Performance Headers ──
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Force HTTPS in browser
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Referrer policy for privacy
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permissions policy
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // XSS protection (legacy browsers)
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
      {
        // Long cache for static assets
        source: "/(.*)\\.(png|jpg|jpeg|gif|webp|avif|svg|ico|woff|woff2|ttf|otf)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // ── Redirects ──
  async redirects() {
    return [
      // Redirect bare /dashboard → /student-dashboard
      {
        source: "/dashboard",
        destination: "/student-dashboard",
        permanent: true,
      },
    ];
  },

  // ── Compiler ──
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ── Experimental ──
  experimental: {
    // Faster builds on Vercel
    optimizePackageImports: ["react-pdf"],
  },
};

export default nextConfig;
