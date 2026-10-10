# BeltForge Export

Modern wholesale e-commerce for **designer leather belts** sold to international buyers. The storefront features a **3D animated hero** (React Three Fiber), a MOQ-based cart, export landed-cost quotes, and wholesale inquiry checkout.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | **Next.js 16** (React), Tailwind, shadcn/ui, Framer Motion |
| 3D | **@react-three/fiber**, drei, Three.js |
| API (Node) | Next.js **Route Handlers** (`/api/*`) on **Vercel** |
| Database | **Supabase** (Postgres + RLS) — optional; demo catalog works offline |
| Export math | **Go** microservice (`services/export-api`) with Node fallback |

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:43123](http://localhost:43123).

### Environment variables

Copy `.env.example` to `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — catalog + inquiries
- `SUPABASE_SERVICE_ROLE_KEY` — server-side order insert (keep secret)
- `EXPORT_API_URL` — e.g. `http://localhost:8081` to use the Go quote service

### Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL in `supabase/migrations/20260314120000_initial.sql` in the SQL editor (or use Supabase CLI).
3. Add env vars and redeploy.

### Go export API (optional)

```bash
cd services/export-api
go run .
```

Set `EXPORT_API_URL=http://localhost:8081` in `.env.local`. The Next.js route `POST /api/export-quote` proxies to `POST /quote`.

## Deploy on Vercel

1. Push this repo to **GitHub** (use **Create repo** in Cursor if the remote is not linked yet).
2. Import the repository in [Vercel](https://vercel.com/new).
3. Add the Supabase environment variables in the Vercel project settings.
4. Deploy — the Next.js app is the production frontend.

Deploy the Go service separately (Railway, Fly.io, Google Cloud Run, etc.) and set `EXPORT_API_URL` in Vercel to its public URL.

## GitHub repository

This agent cannot create a GitHub organization/repo on your behalf. Click **Create repo** in the agent UI to attach a remote, then pushes from this branch will appear on GitHub. After that, connect the repo to Vercel for continuous deployment.

## License

Private — all rights reserved.
