# Aixtral Lab Migration Batches

> Source: read-only Explorer C, agent `019efbfc-684f-7020-b03e-1523b33e94bc`.

## Summary

- Missing Aixtral Lab registry slugs: 72
- Source slugs with pure implementation: 52
- Source slugs requiring page/client rebuild: 20
- Recommended batches: 10
- UI rule: every migrated workspace must use Toolars templates and design tokens; do not copy Aixtral Lab page UI.

## Batch 1: Low-Risk Text Utilities

Slugs: `base64-converter`, `case-converter`, `slug-generator`, `text-stats`, `uuid-generator`, `url-encoder`, `html-entity-encoder`, `lorem-ipsum`.

Verify:

```bash
cd sites/toolars
pnpm test -- base64-converter case-converter slug-generator text-stats uuid-generator url-encoder html-entity-encoder lorem-ipsum
pnpm typecheck
pnpm run audit:tool-inventory
```

## Batch 2: Data Formatters And Diffs

Slugs: `csv-to-json`, `json-to-csv`, `json-diff`, `yaml-validator`, `xml-formatter`, `markdown-to-json`, `diff-checker`, `text-diff`.

Verify:

```bash
cd sites/toolars
pnpm test -- csv-to-json json-to-csv json-diff yaml-validator xml-formatter markdown-to-json diff-checker text-diff
pnpm typecheck
pnpm run audit:tool-inventory
```

## Batch 3: Parser And Numeric Utilities

Slugs: `url-parser`, `number-base-converter`, `file-size-converter`, `chmod-calculator`, `ipv4-subnet-calculator`, `timestamp-converter`, `user-agent-parser`.

Verify:

```bash
cd sites/toolars
pnpm test -- url-parser number-base-converter file-size-converter chmod-calculator ipv4-subnet-calculator timestamp-converter user-agent-parser
pnpm typecheck
pnpm run audit:tool-inventory
```

## Batch 4: Color And CSS Generators

Slugs: `color-converter`, `color-contrast-checker`, `color-palette-generator`, `css-border-radius-generator`, `css-flexbox-generator`, `css-grid-generator`, `css-unit-converter`.

Verify:

```bash
cd sites/toolars
pnpm test -- color-converter color-contrast-checker color-palette-generator css-border-radius-generator css-flexbox-generator css-grid-generator css-unit-converter
pnpm typecheck
pnpm run visual:release-gate
```

## Batch 5: Web Dev Generators

Slugs: `robots-txt-generator`, `meta-tag-generator`, `password-generator`, `hash-generator`, `html-preview`, `code-minifier`, `docker-compose-converter`, `env-editor`.

Verify:

```bash
cd sites/toolars
pnpm test -- robots-txt-generator meta-tag-generator password-generator hash-generator html-preview code-minifier docker-compose-converter env-editor
pnpm typecheck
pnpm build
```

## Batch 6: AI And Security Local Tools

Slugs: `ai-guardrail-config`, `system-prompt-guard`, `toxicity-scanner`, `red-team-simulator`, `embedding-playground`, `synthetic-dataset-gen`, `regex-tester`.

Verify:

```bash
cd sites/toolars
pnpm test -- ai-guardrail-config system-prompt-guard toxicity-scanner red-team-simulator embedding-playground synthetic-dataset-gen regex-tester
pnpm typecheck
pnpm build
```

## Batch 7: Higher-Dependency Existing Logic

Slugs: `base64-image-encoder`, `jwt-decoder`, `cron-explainer`, `sql-formatter`, `toml-converter`, `css-to-tailwind-converter`, `unicode-search`.

Verify:

```bash
cd sites/toolars
pnpm test -- base64-image-encoder jwt-decoder cron-explainer sql-formatter toml-converter css-to-tailwind-converter unicode-search
pnpm typecheck
pnpm build
```

## Batch 8: Light Rebuild Tools

Slugs: `token-counter`, `system-prompt-compressor`, `html-markdown-converter`, `markdown-table-generator`, `http-status-reference`, `mime-lookup`, `svg-optimizer`.

Verify:

```bash
cd sites/toolars
pnpm test -- token-counter system-prompt-compressor html-markdown-converter markdown-table-generator http-status-reference mime-lookup svg-optimizer
pnpm typecheck
pnpm build
```

## Batch 9: Medium-Risk Rebuild UI

Slugs: `css-box-shadow-generator`, `css-animation-generator`, `json-schema-builder`, `rag-chunk-visualizer`, `jailbreak-detector`, `image-resizer`.

Verify:

```bash
cd sites/toolars
pnpm test -- css-box-shadow-generator css-animation-generator json-schema-builder rag-chunk-visualizer jailbreak-detector image-resizer
pnpm typecheck
pnpm build
```

## Batch 10: External Library And Export Tools

Slugs: `barcode-generator`, `qr-code-generator`, `nanoid-generator`, `mock-data-generator`, `certificate-decoder`, `cron-builder`, `code-to-image`.

Verify:

```bash
cd sites/toolars
pnpm test -- barcode-generator qr-code-generator nanoid-generator mock-data-generator certificate-decoder cron-builder code-to-image
pnpm typecheck
pnpm build
pnpm run visual:release-gate
```
