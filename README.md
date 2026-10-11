# BeltForge Export

Belts-only wholesale e-commerce for **international export**. Features an **explodable 3D belt viewer** (React Three Fiber), MOQ cart, landed-cost quotes, and inquiry checkout.

## Catalogue

Product data lives in `src/data/belt-catalog.json` (12 belt SKUs). Optional: load from Supabase using the migration in `supabase/migrations/`.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js (React), Tailwind, shadcn/ui |
| 3D | @react-three/fiber, drei |
| API | Next.js Route Handlers (Vercel) |
| Database | Supabase (optional) |
| Export quotes | Go service in `services/export-api` |

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:43123](http://localhost:43123).

## Deploy

Connect `1xlblaze/beltforge-export` on GitHub to Vercel, or see `docs/DEPLOY.md`.
