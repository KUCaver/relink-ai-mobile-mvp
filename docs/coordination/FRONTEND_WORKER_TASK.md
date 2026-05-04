# Frontend Worker Task

## Goal

Connect the current Home flow to `window.ReLinkApi` without changing the visible design.

Workspace:

```text
C:\Users\gando\OneDrive\바탕 화면\건국대학교\건국대학교3학년 1학기\공모전\AI경진대회\relink_mvp_app_dev
```

## Ownership

You may edit only:

```text
api-client.jsx
screens-home.jsx
index.html
docs/coordination/FRONTEND_RESULT.md
```

Do not edit backend, DB, or visual shell files. You are not alone in the codebase; other workers may modify API and DB files in parallel. Do not revert or overwrite their edits.

## Required Behavior

Keep the exact visual design. Only change data flow.

Connect:

```text
submit entry -> ReLinkApi.submitEntry({ text })
save selected observation candidates -> ReLinkApi.saveObservations({ ids })
complete daily mission -> ReLinkApi.completeQuest()
```

Keep local fallback behavior if API is down.

In dev `index.html`, set:

```html
<script>
  window.RELINK_API_BASE_URL = 'http://127.0.0.1:8787';
</script>
```

## Current Constraints

- The static app still uses browser Babel and global `window.*`.
- Do not convert to Vite modules yet.
- Avoid changes to `app.jsx`, `room.jsx`, `garden.jsx`, `primitives.jsx`, and other screen files.

## Verification

Run the dev frontend and verify it still loads:

```text
http://localhost:7754/
```

If the API is unavailable, the app must still work with local fallback.

Write `docs/coordination/FRONTEND_RESULT.md` with changed files, commands, verification, and risks.
