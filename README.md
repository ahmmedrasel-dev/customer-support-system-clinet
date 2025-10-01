# Customer Support System — Client

A modern, responsive client interface for a customer support / ticketing system built with Next.js (App Router) and Tailwind CSS. This repository contains the front-end (client) application used for customer registration/login and the admin dashboard UI used to manage support tickets.

## Key features
- Authentication UI: Login and registration flows implemented using react-hook-form with Zod validation.
- Admin dashboard: ticket stats (Open, In Progress, Resolved, Closed) and a recent tickets table for quick triage.
- Dark-first responsive UI using Tailwind CSS and small reusable UI primitives under `components/ui`.
- Theme/hydration safeguards to reduce SSR/CSR mismatches for client-side theming.

## Tech stack
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- react-hook-form + Zod for client-side form validation
- @hookform/resolvers (zod resolver)

## Project structure (high level)
- `app/` — Next.js routes and layouts (includes `(auth)` group and `admin` area)
- `components/` — shared UI primitives and auth components (e.g. `RegistrationForm.tsx`)
- `lib/` — utility helpers
- `public/` — static assets

## Getting started (development)
1. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn
```

2. Start the development server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

3. Open http://localhost:3000 in your browser.

## Notes
- This client app expects backend API endpoints such as `/api/register` and `/api/login`. Replace or proxy these endpoints to connect with your server.
- The client-side forms use Zod schemas for validation; mirror validation on the server for security.
- If you modify validation shapes, update `components/auth/RegistrationForm.tsx` and the login page accordingly.

## Environment variables
- Configure an API base URL when needed via environment variables, e.g. `NEXT_PUBLIC_API_BASE_URL`.

## Testing and linting
- Run TypeScript checks and linting depending on available scripts. Typical commands:

```bash
npm run build       # typecheck + build
npm run lint        # lint (if configured)
```

## Deployment
- Deploy to Vercel, Netlify, or other hosts that support Next.js. Vercel is recommended for quick deployments.

## Contributing
- Suggested workflow:
  1. Fork and create a feature branch
  2. Install dependencies and run the dev server
  3. Add tests for new functionality and keep changes scoped

## Developer notes
- Admin layout is split into components under `app/components/layout/` (header, sidebar, user menu). Check there when changing layout behavior.
- For theme/hydration issues check `components/theme-provider.tsx` and the root layout.

## License
- No license file is included in this repository. Add a LICENSE (for example MIT) if you plan to publish.

If you want, I can add a `.env.example`, a short developer checklist, or a small CI workflow next.
