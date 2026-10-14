/**
 * Root-level 404. Locale-aware 404s live in /[locale]/not-found.tsx; this one
 * is the catch-all for paths that don't even match a locale.
 */
export default function NotFound() {
  return (
    <html lang="bn">
      <body className="min-h-screen grid place-items-center bg-canvas text-charcoal p-6">
        <div className="text-center">
          <div className="font-display text-6xl text-brick">404</div>
          <h1 className="text-2xl font-semibold mt-2">Page not found</h1>
          <a
            href="/"
            className="inline-block mt-4 h-12 px-4 leading-[3rem] font-display uppercase tracking-label border border-charcoal"
            style={{ borderRadius: 2 }}
          >
            Home
          </a>
        </div>
      </body>
    </html>
  );
}
