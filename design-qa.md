# Design QA: OAuth Account Modal

## Scope

- Selected visual: `/Users/stanvl/.codex/generated_images/019efa2a-183f-77e2-8215-9118eea35dd9/exec-9a17225a-bd09-4e74-a2ec-38a1e26908e3.png`
- Illustration asset: `/Users/stanvl/.codex/generated_images/019efa2a-183f-77e2-8215-9118eea35dd9/exec-82a6b872-f99e-49a3-9fd2-cb68a13853d5.png`
- Implementation: `http://127.0.0.1:9088/en`
- Viewport: 1280 x 720
- States: home page with Sign in open, then Sign up selected from the account-switch action

## Comparison

The implementation follows the selected flat workspace-network direction in
both authentication states. It keeps the existing Toolars logo, fills the left
panel with the generated tool-network illustration, and preserves the compact
white/slate/emerald modal language. The right panel removes the `Account`
eyebrow, giving the title and OAuth actions a cleaner hierarchy.

Google uses its multicolor G mark and GitHub uses the black Octocat mark from
local static assets. The provider buttons retain their real Supabase OAuth
behavior, with the same visual treatment in Sign in and Sign up.

## Evidence

- In-app Browser captures reviewed after a production rebuild and restart.
- Sign in: illustration, Google mark, GitHub mark, no `Account` inside the dialog, and no console warnings/errors.
- Sign up: illustration and both provider marks present after switching from Sign in; no `Account` inside the dialog and no console warnings/errors.
- Focused test, typecheck, i18n audit, proxy asset routing test, and production build passed.

## Result

final result: passed
