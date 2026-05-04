# Re:Link Dev Integration Rules

## Coordinator

This conversation is the coordinator. Sub-agents must not edit the usable MVP folder:

```text
C:\Users\gando\OneDrive\바탕 화면\건국대학교\건국대학교3학년 1학기\공모전\AI경진대회\relink_mvp_app
```

All work happens in:

```text
C:\Users\gando\OneDrive\바탕 화면\건국대학교\건국대학교3학년 1학기\공모전\AI경진대회\relink_mvp_app_dev
```

## Non-Negotiable Design Rule

The current mobile MVP design is the visual source of truth. Do not restyle:

- iOS device frame
- bottom tabs
- colors, spacing, shadows, cards, and rounded panels
- Wiki room/garden visuals
- Korean copy hierarchy

API wiring must change behavior/data flow, not visual appearance.

## File Ownership

### API Worker

May edit:

```text
apps/api/**
packages/shared/**
docs/coordination/API_RESULT.md
```

Must not edit:

```text
api-client.jsx
screens-*.jsx
app.jsx
index.html
```

### Frontend Worker

May edit:

```text
api-client.jsx
screens-home.jsx
index.html
docs/coordination/FRONTEND_RESULT.md
```

Must not edit:

```text
apps/api/**
packages/db/**
room.jsx
garden.jsx
ios-frame.jsx
primitives.jsx
screens-shop.jsx
screens-wiki.jsx
screens-other.jsx
app.jsx
```

### DB Worker

May edit:

```text
packages/db/**
docs/coordination/DB_RESULT.md
docs/coordination/DB_SCHEMA_NOTES.md
```

Must not edit:

```text
apps/api/**
api-client.jsx
screens-*.jsx
app.jsx
index.html
```

## API Contract

The first demo loop must preserve this frontend contract:

```js
ReLinkApi.getInitialSnapshot()
ReLinkApi.submitEntry({ text })
ReLinkApi.saveObservations({ ids })
ReLinkApi.completeQuest()
ReLinkApi.placeShopItem({ itemId })
ReLinkApi.regenerateMessageDraft()
```

Backend endpoints:

```text
GET  /api/snapshot
POST /api/entries/analyze
POST /api/observations/consent
POST /api/missions/complete
POST /api/room/items
POST /api/message-draft
```

## Ports

```text
Current usable MVP: 7654
Dev frontend:       7754
Demo API:           8787
```

## Merge Requirement

Each worker must write a result file with:

- changed files
- commands run
- verification result
- unresolved risks
- what the coordinator should review
