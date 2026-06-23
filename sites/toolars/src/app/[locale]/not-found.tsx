import Link from "next/link";

/**
 * 404 page for the [locale] segment. Rendered when a tool/page slug is not
 * found within a locale. Styled to match the Toolars design system.
 */
export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <span className="not-found-code">404</span>
        <h1 className="title">Page not found</h1>
        <p className="subtitle">
          The tool or page you are looking for may have moved or no longer exists.
          Try searching from the home page.
        </p>
        <div className="not-found-actions">
          <Link className="button button-solid" href="/">
            Back to home
          </Link>
          <Link className="button button-outline-neutral" href="/explore/pdf">
            Browse tools
          </Link>
        </div>
      </div>
    </div>
  );
}
