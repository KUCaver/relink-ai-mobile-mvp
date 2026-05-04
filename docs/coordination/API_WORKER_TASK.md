# API Worker Task

## Goal

Build a demo backend API in the development workspace without touching frontend files.

Workspace:

```text
C:\Users\gando\OneDrive\바탕 화면\건국대학교\건국대학교3학년 1학기\공모전\AI경진대회\relink_mvp_app_dev
```

## Ownership

You may edit only:

```text
apps/api/**
packages/shared/**
docs/coordination/API_RESULT.md
```

Do not edit frontend files. You are not alone in the codebase; other workers may modify frontend and DB files in parallel. Do not revert or overwrite their edits.

## Required API

Implement a small Node backend on port `8787`.

Endpoints:

```text
GET  /api/health
GET  /api/snapshot
POST /api/entries/analyze
POST /api/observations/consent
POST /api/missions/complete
POST /api/room/items
POST /api/message-draft
```

The response shape should match what `api-client.jsx` expects today:

```js
{ data: snapshot }
{ data: snapshot, draft?: string, shopOwned?: object }
```

## Implementation Guidance

- Prefer no external dependencies for this first demo. Use Node `http` if practical.
- Reuse the same mock behavior currently embedded in `api-client.jsx`.
- Keep state in memory for the demo.
- Add simple CORS headers for `http://localhost:7754`.
- Add a package script under `apps/api/package.json` if useful.
- Add shared API contract notes under `packages/shared`.

## Verification

Run the API locally and verify:

```text
GET /api/health
GET /api/snapshot
POST /api/entries/analyze
POST /api/observations/consent
POST /api/missions/complete
```

Write `docs/coordination/API_RESULT.md` with changed files, commands, verification, and risks.
