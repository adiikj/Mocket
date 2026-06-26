# Mocket — project context for Claude

**Mocket** is a gamified stock-trading simulator: buy/sell stocks with **virtual money**, leaderboards, contests. Real prices, no real money.

> **This is a resume / portfolio project, not a commercial product.** Real-money-adjacent stock simulators are legally restricted to operate in India, so optimize for what demonstrates engineering skill and judgment to recruiters — clean architecture, real trading-engine logic, tests, good README, a deployable demo. Do **not** add monetization/paid-tier features. (Renamed from the old working title "TradeXcel".)

## Conventions (important)
- **Git commit messages: minimal, and NEVER mention Claude.** No "Co-Authored-By: Claude", no "Generated with Claude Code". Short, plain, human-looking subjects.
- Only commit/push when asked. `main` of the repo is the working line.

## Stack & layout
pnpm monorepo:
```
apps/frontend   # Next.js 16 (App Router) + TypeScript, Redux Toolkit, Tailwind, Chart.js
apps/backend    # Express + TypeScript, Prisma + PostgreSQL (Neon)
packages/        # (reserved for shared TS types, e.g. packages/shared)
docs/reference   # design screenshots
```
- Backend auth: JWT access+refresh, OTP via Twilio (SMS) + Google/Nodemailer (email), Cloudinary avatars.
- DB: **Prisma + Postgres on Neon**. Models in `apps/backend/prisma/schema.prisma`. Auth helpers (hash/verify/sign) in `apps/backend/src/utils/auth.ts`. Prisma client singleton in `apps/backend/src/db/prisma.ts`. JWT payload uses `id` (not `_id`).

## Common commands (run from repo root)
- `pnpm install` — install all workspaces (postinstall runs `prisma generate`)
- `pnpm dev` — run both apps; `pnpm dev:api` / `pnpm dev:web` for one
- `pnpm --filter @mocket/backend build` — `prisma generate && tsc`
- `pnpm --filter @mocket/backend db:migrate` — `prisma migrate dev`
- Env: each app has `.env` (gitignored) + `.env.example`. Backend needs `DATABASE_URL` (Neon).

## Status
- **Phase 1 DONE:** monorepo migrated from two separate repos (full git history preserved via subtree), JS→TS, Vite→Next.js, **Mongoose→Prisma/Postgres**. Both apps build clean; backend connects to Neon and serves on port 5000.
- **Phase 2 (next, the core):** the actual trading engine does **not** exist yet. Backend has only `User` + `PendingUser`. Portfolio & Leaderboard frontends use hardcoded dummy data. Build: `Wallet`, `Holding`, `Transaction` Prisma models; `POST /trade/buy|sell`, `GET /portfolio|wallet|transactions`; wire Portfolio/Wallet off dummy data.
- Full plan: **`REVIVAL_PLAN.md`** (this repo root).

## Gotchas
- `apps/backend/src/controllers/user.controller.ts` runs `await oAuth2Client.getAccessToken()` at module import — if Google OAuth creds expire, the server crashes at startup. (Currently valid.)
- Backend deploys to **Render free tier** (Root Directory `apps/backend`, build `pnpm install && pnpm build`, start `node dist/index.js`, needs `DATABASE_URL`; run `prisma migrate deploy` on deploy). Free tier cold-starts after ~15 min idle. Frontend deploys to Vercel.
- Old repos (`Adiijha/TradeXcel-backend`, `Adiijha/TradeXcel-frontend`) and their live deployment are the fallback — don't archive until Mocket is redeployed and verified. This repo is `adiikj/Mocket`.
