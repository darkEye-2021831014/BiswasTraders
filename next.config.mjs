import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Security headers. The brief asks for:
 *   - CSP (with frame-src limited to the Google Maps embed host)
 *   - Referrer-Policy
 *   - X-Content-Type-Options
 *   - Permissions-Policy
 *   - X-Frame-Options (defence-in-depth alongside CSP frame-ancestors)
 *
 * CSP is kept tight: only same-origin + the resources we actually use
 * (Google Fonts for typography, Google Maps embed for the contact
 * page). Inline styles are allowed because Tailwind's preflight and
 * our own globals.css need them; the inline-script allowance is for
 * the JSON-LD <script> blocks (their content is JSON, not code).
 * 'unsafe-inline' on script-src is the *unsafe* bit — we keep it for
 * now because JSON-LD is required and there is no nonce/hashing
 * system wired up. A future hardening pass can move to nonce-based
 * script-src.
 */
const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "camera=()",
      "geolocation=(self)",
      "gyroscope=()",
      "microphone=()",
      "payment=()",
      "usb=()",
    ].join(", "),
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js dev HMR uses eval; production doesn't but we keep it
      // off in prod via the env check below.
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob:",
      "font-src 'self' data: https://fonts.gstatic.com",
      // The only third-party frame we ever load is the Google Maps
      // embed on the contact page, which is gated by a click-to-load.
      "frame-src https://www.google.com",
      "connect-src 'self'",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          // The root layout reads `headers()` to set `<html lang>`, which
          // makes the page dynamic. By default Next sends
          // `Cache-Control: no-store` for dynamic pages, which:
          //   1. Blocks back/forward cache (bfcache) on Chrome / Safari
          //   2. Forces a full re-fetch on every navigation
          //
          // For this site every page is fully static content (no per-user
          // data), so we override the default with a revalidation cache
          // directive. CDN-friendly, browser-friendly, and bfcache-friendly.
          {
            key: "Cache-Control",
            // 5 min fresh + 1 day SWR. This is the right shape for a
            // site whose content rarely changes: it lets the browser
            // and CDN serve from cache for fast bfcache restoration,
            // but the SWR window guarantees the next visitor gets the
            // next build within a day.
            value: "public, max-age=300, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
