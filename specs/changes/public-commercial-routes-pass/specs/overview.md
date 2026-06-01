# Specs Overview: public-commercial-routes-pass

## Capabilities

- `commercial-routes`: public commercial routes render useful, crawlable page
  shells where appropriate and avoid 404s from current navigation.
- `account-entry`: login and registration routes explain the account boundary
  without creating a fake backend integration.
- `compare-workflow`: compare route explains local saved calculator comparison
  and Pro export/sync boundaries.
- `trust-pages`: about, contact, and privacy pages provide basic trust and
  policy context.

## Shared Acceptance

- Calculators remain free and no-login.
- AI tools, cross-device save, advanced PDF/CSV export, and batch workflows are
  framed as account or Pro features.
- Login/register pages are noindex; public content/trust pages have metadata.
- E2E tests verify every new route returns the expected heading and content.
