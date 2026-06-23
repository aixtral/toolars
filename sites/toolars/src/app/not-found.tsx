import Link from "next/link";

/**
 * Root-level 404 fallback. Rendered for paths that don't match any locale
 * segment (e.g. typos without a locale prefix).
 */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <div className="not-found-page">
          <div className="not-found-content">
            <span className="not-found-code">404</span>
            <h1 className="title">Page not found</h1>
            <p className="subtitle">
              The page you are looking for does not exist. Try the home page.
            </p>
            <div className="not-found-actions">
              <Link className="button button-solid" href="/">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
