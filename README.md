# template-web

A small Next.js and Supabase starter: app router, TypeScript, Tailwind, email and password auth through Supabase, row level security on a `profiles` table, and GitHub Actions that provision and deploy to Vercel.

## What is here

- `src/app` has the public home page, `/login` for sign in, `/dashboard` as the protected page and `/auth/callback` for the confirmation code exchange.
- `src/lib/supabase/client.ts` creates the browser client for Client Components.
- `src/lib/supabase/server.ts` creates a request-scoped server client for Server Components, Server Actions and Route Handlers.
- `src/proxy.ts` refreshes the Supabase session on every request and redirects unauthenticated users from `/dashboard` to `/login`.
- `supabase/migrations` holds the schema, applied with `supabase db push`.
- `.github/workflows/bootstrap.yml` provisions the Vercel and Supabase projects once.
- `.github/workflows/deploy.yml` applies migrations and deploys on every push to `main`.

## Local setup

1. Run `pnpm install`.
2. Copy `.env.example` to `.env.local` and fill in the Supabase URL and anon key.
3. Apply the schema with `supabase link --project-ref <ref>` then `supabase db push`, or paste `supabase/migrations/20261127000000_init.sql` into the Supabase SQL editor.
4. Run `pnpm dev` and open http://localhost:3000.

The only environment variables are `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Both are public values and no service role key is used.

## Auth flow

The proxy calls `supabase.auth.getClaims()` on each request, writes refreshed cookies onto the response and redirects signed-out users away from protected paths. Server Components call `supabase.auth.getUser()` before rendering user data, so the check does not rely on the proxy alone. The sign up trigger in `supabase/migrations` inserts a row into `profiles`, and row level security limits reads and updates to the owning user. Self-service sign up is disabled both in the UI and in the auth config, so accounts are created from the Supabase dashboard's Users page; the `/auth/callback` route exchanges the PKCE code for a session when a link does arrive. To allow sign up later, add the form back and set `disable_signup` to false.

## Install as an app

`src/app/manifest.ts` serves the web app manifest at `/manifest.webmanifest`, and `public/sw.js` is a hand-written service worker, registered by `src/components/register-service-worker.tsx` in production only. The install prompt and the offline behaviour cover the public shell only: the home page, the icons and the manifest. Everything behind auth needs the network. The dashboard and login HTML are deliberately never cached.

## Deployment model

Project names are derived from the repository, so nothing here is tied to one project. The bootstrap workflow sets `PROJECT_NAME="jdnhlf-${GITHUB_REPOSITORY#*/}"`, creates or reuses the Vercel project with that name, and finds or creates a Supabase organisation of the same name, because the Free plan caps each organisation at 2 active projects.

Every push to `main` runs `deploy.yml`. The `migrate` job runs only when `supabase/**` changed; it looks the Supabase project up by name through the management API, links it and applies pending migrations with `supabase db push`. The `deploy` job links the Vercel project by name with `vercel link`, pulls the production environment, builds with `vercel build --prod` and ships with `vercel deploy --prebuilt --prod`.

Only three organisation secrets are required: `VERCEL_TOKEN`, `SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_PASSWORD`. Set their repository access to all repositories, since on GitHub Free organisation secrets do not reach private repositories. There are no per-repo variables.

The bootstrap workflow creates the Supabase project in `ap-southeast-2` inside the matching organisation and sets `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` on the Vercel project for production, preview and development, which the build pulls from the linked project. It also sets the Supabase auth site URL to the Vercel domain, allows localhost redirects, keeps email confirmation on and disables self-service sign up.

`supabase/config.toml` keeps a placeholder `project_id` for local runs. CI links with `--project-ref`, so the placeholder value is not used there.

Three behaviours are worth knowing before changing the workflows: the Vercel project is created with the `nextjs` framework preset, because the default static preset fails a prebuilt deploy; the deploy step hides `.git` so Vercel does not attribute the deployment to the bot commit author, which Hobby cannot add as a member; and Supabase CLI 3.x reads the database password from `SUPABASE_DB_PASSWORD` rather than `--password`.

## Using this as a template

Generate a new repository from the template:

https://github.com/jdnhlf/template-web

Use "Use this template" in the GitHub UI, or run `gh repo create jdnhlf/<name> --template jdnhlf/template-web --public`.

The three secrets are organisation-wide with access set to all repositories, so a new repository inherits them without any setup. Repositories are public, which is also what makes organisation secrets available on the Free plan.

Run the Bootstrap workflow once from the Actions tab. It creates the Vercel project and the Supabase project named `jdnhlf-<repo name>`, sets both public environment variables on the Vercel project and confirms the result in the log.

That run is the only setup step a generated repository needs; pushes to `main` then deploy.
