interface JsonLdProps {
  schema: object;
}

/**
 * Render a JSON-LD <script> tag for schema.org structured data.
 * Server-rendered so AI crawlers and search engines can read it without JS.
 */
export function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
