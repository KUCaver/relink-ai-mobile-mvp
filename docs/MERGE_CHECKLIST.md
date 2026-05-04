# Merge Checklist

Use this before copying any development changes back to `relink_mvp_app`.

## Required Checks

- Current usable MVP still opens.
- Dev app opens on its own port.
- Home screen visual layout matches the usable MVP.
- Today record submit works.
- Observation candidates appear after submit.
- Selected observation save works.
- Daily mission complete works.
- Message draft does not auto-send anything.
- Browser console has no fatal error.
- API server returns valid JSON for the core endpoints.

## Files That Should Usually Merge

- `apps/api/**`
- `packages/shared/**`
- API-only changes in `api-client.jsx`
- Minimal state wiring changes in `screens-home.jsx`
- README/docs updates

## Files That Need Extra Review Before Merge

- `app.jsx`
- `ios-frame.jsx`
- `primitives.jsx`
- `garden.jsx`
- `room.jsx`
- `screens-shop.jsx`
- `screens-wiki.jsx`
- `screens-other.jsx`

These files are visually sensitive. Any visual diff must be intentional.

## Files That Should Not Merge Automatically

- `node_modules/**`
- `dist/**`
- `*.log`
- local `.env` files
- desktop launcher changes unless the user approves

## Manual Rollback Rule

If a merged change breaks the usable MVP, restore from the dev folder only after identifying the exact file. Do not replace the whole usable app folder blindly.
