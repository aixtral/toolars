# Specs Overview: site-graph-metadata-pass

## Capabilities

| Capability | Requirement File | Summary |
|---|---|---|
| Site graph metadata | `specs/site-graph-metadata/requirements.md` | Root metadata and JSON-LD identify toolars as a public utility site with a searchable tools directory. |

## Acceptance Summary

- Public pages inherit a commercial default title/description, `metadataBase`, canonical home URL, Open Graph defaults, and Twitter card defaults.
- The root layout renders valid JSON-LD for `Organization` and `WebSite`.
- The `WebSite` schema includes a `SearchAction` pointing to the public tools directory query URL.
- The implementation is covered by unit tests and E2E metadata checks.
