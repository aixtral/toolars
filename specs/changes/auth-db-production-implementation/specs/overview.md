# Specs Overview: auth-db-production-implementation

This change implements the first production Auth/DB foundation for Toolars.

Capabilities:

- `auth-db-production`: Supabase env/client boundaries, server-side session
  facade, account/workspace migration, RLS policy baseline, and public
  calculator dependency isolation.

Source anchors:

- Supabase Next.js guide:
  https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
- Supabase server-side auth:
  https://supabase.com/docs/guides/auth/server-side
- Supabase user data/profile guidance:
  https://supabase.com/docs/guides/auth/managing-user-data
- Supabase Row Level Security:
  https://supabase.com/docs/guides/database/postgres/row-level-security
