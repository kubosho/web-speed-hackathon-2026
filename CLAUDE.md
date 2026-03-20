# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Web Speed Hackathon 2026 competition app — a fictional SNS called "CaX". The goal is to optimize performance while maintaining feature parity (verified by VRT and manual test cases).

## Architecture

Monorepo with pnpm workspaces under `/application`:
- **client** — React 19 SPA, built with Webpack 5, Babel (targeting latest Chrome), PostCSS
- **server** — Express 5 API, Sequelize ORM with SQLite, runs on port 3000 (or `PORT` env)
- **e2e** — Playwright VRT and functional tests

Scoring tool lives in `/scoring-tool` (Lighthouse-based performance measurement).

### Key architectural details
- Client webpack config: `application/client/webpack.config.js`
- Server entry: `application/server/src/index.ts` (Express + WebSocket support)
- Database: SQLite file at `application/database.sqlite`, copied to `/tmp` at startup
- API routes mounted at `/api/v1` via `apiRouter`
- Static files served via `staticRouter`
- SSE streaming for `/api/v1/crok` (AI chat) — protocol must not be changed
- `POST /api/v1/initialize` resets database to initial seed state

## Commands

All commands run from `/application` unless noted.

```bash
# Setup
mise trust && mise install    # Install Node 24.14.0 + pnpm 10.32.1
pnpm install --frozen-lockfile

# Build & Run
pnpm build                    # Build client (webpack)
pnpm start                    # Start server at localhost:3000

# Code Quality
pnpm format                   # Run oxlint + oxfmt
pnpm typecheck                # TypeScript check across all packages

# E2E Tests (from /application/e2e)
pnpm exec playwright install chromium  # First time only
pnpm test                              # Run against localhost:3000
E2E_BASE_URL=https://example.fly.dev pnpm test  # Run against deployed app
pnpm test:update                       # Update VRT snapshots
E2E_WORKERS=2 pnpm test                # Control parallelism

# Scoring (from /scoring-tool)
pnpm start -- --applicationUrl <url>

# Deploy (from repo root)
fly deploy --app <app-name>
```

## Regulations (competition rules)

- **Do NOT change `fly.toml`** when deploying to the organizer's fly.io
- **Do NOT change seed data IDs** in the database
- **Do NOT change the SSE protocol** for `/api/v1/crok`
- **VRT must pass** — no significant visual regressions in Chrome latest
- **Manual test cases** in `docs/test_cases.md` must all pass
- All code/files may be changed; API responses may be modified; external SaaS may be used

## Scoring (1150 points max)

- **Page Display (900 pts)**: 9 pages scored by Lighthouse (FCP, SI, LCP, TBT, CLS)
- **Page Interaction (250 pts)**: 5 scenarios scored by TBT + INP (only measured if display >= 300 pts)

## Linting

- oxlint with plugins: eslint, typescript, unicorn, react, react-perf, oxc
- oxfmt for formatting (import sorting enabled)
- `react/jsx-key` rule is disabled in `.oxlintrc.json`
