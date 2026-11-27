# template-web

Next.js app router with Supabase Auth and one Postgres table guarded by RLS. Public values come from the environment; secrets are never baked in.

## Testing

- Vitest covers logic with real behaviour and edge cases, currently `appName` precedence. Keep it small and do not test framework wiring.
- Playwright covers the journeys that must not break: signed-out home, `/dashboard` redirect, an installable manifest, and service worker registration. Add a spec there when a user-visible flow changes.
- Never point a test at the live Supabase project. Flows that need a session are checked by hand against a real account, or covered by setup that provisions its own database.
- Do not mock your own modules. Stub only boundaries outside your control, such as a third-party HTTP call.
- The manifest and page title are prerendered, so `NEXT_PUBLIC_APP_NAME` is fixed at build time; a test that asserts the name must build with the variable set.

## Commands

- `pnpm format` and `pnpm format:check`
- `pnpm lint`
- `pnpm test:unit`
- `pnpm build`, then `pnpm test:e2e`
