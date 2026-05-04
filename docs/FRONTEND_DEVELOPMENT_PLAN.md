# Re:Link AI Mobile MVP Frontend Development Plan

## Non-Negotiable Design Rule

The current static MVP is the visual source of truth. During migration, do not change:

- iOS device frame dimensions and visual treatment
- bottom tab layout, copy, icon style, and selected states
- color palette, night/day mode behavior, rounded panels, shadows, and spacing density
- Wiki room/garden illustration style
- Korean product copy and information hierarchy
- the core flow: 오늘 기록 -> 관찰 조각 -> 하루 부탁 -> 리포트/위키/문의문

Any visual change must be intentional and compared against the current MVP first.

## Current Baseline

The app still runs as the original static MVP:

- `Re-Link AI Mobile MVP.html`
- `*.jsx` files loaded through Babel in the browser
- `api-client.jsx` provides a local mock API adapter and can switch to a real backend via `window.RELINK_API_BASE_URL`

For safer development, `index.html` now loads the same files in the same order, and a small Node static server serves the dev project at port `7754`.

## Phase 1: Safe Development Harness

Goal: make the app easy to run without touching the design.

- Run with `npm run dev`
- Build the current static MVP with `npm run build`
- Keep the original HTML file working
- Keep `start-relink.bat` and the desktop launcher working
- Use the current static screen as screenshot baseline

Status: active baseline in place.

## Phase 2: Module Migration Without Visual Drift

Goal: convert global JSX files into source modules while preserving output.

Vite should be introduced in this phase, after the first module entry point exists. Do not put Vite in front of the current browser-Babel prototype if it changes how HTML or JSX files are served.

Recommended order:

1. `data.jsx` -> `src/data/relinkData.js`
2. `primitives.jsx` -> `src/components/primitives.jsx`
3. `mascot.jsx`, `ios-frame.jsx` -> `src/components/*`
4. `room.jsx`, `garden.jsx` -> `src/features/room/*`
5. `screens-home.jsx` -> `src/features/home/HomeScreen.jsx`
6. `screens-other.jsx`, `screens-shop.jsx`, `screens-wiki.jsx`
7. `app.jsx` -> `src/App.jsx`

After each file migration:

- run the app
- compare the migrated screen against the static MVP
- do not proceed if layout, spacing, copy, colors, or interaction states drift

## Phase 3: State and API Boundary

Goal: make the frontend ready for backend integration.

Keep `api-client.jsx` behavior as the API contract, then formalize:

- `getInitialSnapshot`
- `submitEntry`
- `saveObservations`
- `completeQuest`
- `placeShopItem`
- `regenerateMessageDraft`

The frontend should depend on this adapter, not directly on backend details.

## Phase 4: Backend Integration

Goal: replace mock behavior behind the adapter.

Candidate endpoints:

- `GET /api/snapshot`
- `POST /api/entries/analyze`
- `POST /api/observations/consent`
- `POST /api/missions/complete`
- `POST /api/room/items`
- `POST /api/message-draft`

The frontend should continue to work with local mock fallback if backend is unavailable.

## Phase 5: Product Hardening

- persist real user state
- add local error states that do not break the soft visual tone
- add loading states matching the existing UI
- add mobile viewport checks
- add screenshot regression checks against the static MVP
