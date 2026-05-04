# Next Steps

## Step 1: Demo API

Create a small backend under `apps/api`.

Suggested files:

```text
apps/api/package.json
apps/api/src/server.js
apps/api/src/mock-store.js
apps/api/src/mock-ai.js
apps/api/src/routes.js
```

Use plain Node/Express-style structure. If avoiding dependencies, use Node `http` first.

## Step 2: Shared Contract

Create response shapes that mirror current `api-client.jsx`.

```text
packages/shared/relink-api-contract.md
```

Do not introduce complex tooling before the API behavior is proven.

## Step 3: Frontend Wiring

In `api-client.jsx`, set backend base URL from:

```js
window.RELINK_API_BASE_URL
```

In dev `index.html`, set:

```html
<script>
  window.RELINK_API_BASE_URL = 'http://127.0.0.1:8787';
</script>
```

Keep fallback behavior if API is down.

## Step 4: Home Flow Only

Connect only:

- submit entry
- save observations
- complete quest

Leave report/wiki/message mostly mock until the first API loop is stable.

## Step 5: Later Supabase

After the demo API works:

1. Add Supabase schema.
2. Store users and daily entries.
3. Store observation candidates.
4. Store accepted user observations.
5. Store daily missions.
6. Add reports and inquiry drafts.
