# Korean Company Intelligence — demo, served from the portfolio at `/kci`

This is a **fully self-contained** Next.js app: zero backend calls, no browser
storage. All data is generated in-memory by `lib/fixtures/` and served through
`lib/mock-api.ts` (the single boundary you'd swap for a real FastAPI client
later). It does not depend on anything else from the `market-intelligence` repo.

It is wired into the portfolio as a Next.js **Multi-Zone** "secondary" app: this
app owns everything under `/kci`, and the portfolio's main app rewrites `/kci/*`
to it. The two apps stay fully isolated — different Next/React/Tailwind versions,
no shared styling, providers, or `@/*` alias.

## How it's wired (already done)

- **This app** lives at `../korean-company-intel`, runs on **port 3001**, and
  `next.config.js` defaults `basePath` to `/kci` (override via
  `NEXT_PUBLIC_BASE_PATH`). So every route, `<Link>`, and `/_next` asset is
  namespaced under `/kci`, and `/kci` → `/kci/dashboard` via a basePath-aware
  `redirects()` rule.
- **The portfolio** (`../next.config.ts`) rewrites:
  ```ts
  { source: "/kci",        destination: `${KCI_DEMO_URL}/kci` }
  { source: "/kci/:path*", destination: `${KCI_DEMO_URL}/kci/:path*` }
  ```
  `KCI_DEMO_URL` defaults to `http://localhost:3001` (set it to the deployed
  origin in production).
- The portfolio's `tsconfig.json`, `eslint.config.mjs`, and `.gitignore` exclude
  this folder so it never pollutes the portfolio's typecheck/lint/build.
- A **"Live demo" → `/kci`** link was added to the `sijang` project in
  `content/projects.ts`.

## Local development — run BOTH apps

⚠️ In local dev the portfolio proxies `/kci` to port 3001, so if only the
portfolio is running, `/kci` returns **500 (no upstream)**. Start both:

```bash
# from the portfolio root — one command starts both (portfolio :3000 + demo :3001)
npm run dev:all
```

Or in two terminals:

```bash
npm run dev                                   # portfolio  → :3000
npm --prefix korean-company-intel run dev     # demo       → :3001 (serves /kci)
```

Then open `http://localhost:3000/kci`.

## Production deploy

Two Next apps can't share one build, so deploy this app as its **own target**:

1. Deploy `korean-company-intel/` (e.g. a separate Vercel project) with
   `NEXT_PUBLIC_BASE_PATH=/kci`. Note its origin, e.g. `https://kci-demo.vercel.app`.
2. Set `KCI_DEMO_URL=https://kci-demo.vercel.app` in the portfolio's environment.
   The existing rewrite then serves it transparently at `yoursite.com/kci`.

(On Vercel you can also use native Multi-Zones instead of manual rewrites.)

## Notes

- **Fonts:** `app/globals.css` imports Pretendard from a CDN (one external
  request). Self-host the font if you want zero external calls.
- **Theme:** tiny no-persistence provider (`components/theme-provider.tsx`), dark
  by default — intentionally no `localStorage`.
- **Dead config:** `NEXT_PUBLIC_API_URL` marks where a real API base would go when
  `lib/mock-api.ts` is swapped out.
