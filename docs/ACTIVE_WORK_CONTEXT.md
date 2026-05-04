# Re:Link AI Active Work Context

## Purpose

This folder is the development workspace. The current usable MVP stays in:

```text
C:\Users\gando\OneDrive\바탕 화면\건국대학교\건국대학교3학년 1학기\공모전\AI경진대회\relink_mvp_app
```

Do not develop directly in the usable MVP folder unless the change has already been verified here.

## Current Product Flow

The proposal and frontend MVP define the product flow as:

```text
하루 기록
  -> AI 관찰 후보
  -> 사용자가 맞는 조각만 저장
  -> 하루 부탁
  -> 위키 성장/방 꾸미기
  -> 7일/14일 리포트
  -> 상담 전 문의문 초안
```

The app must not present diagnosis, medical judgment, or automatic counseling submission.

## Non-Negotiable Design Rule

The existing mobile MVP design is the visual source of truth. Backend/API work must not alter:

- iOS frame
- bottom tabs
- Wiki room/garden illustration style
- colors, spacing, rounded panels, and shadows
- Korean copy hierarchy
- main flow order

When connecting APIs, change data flow first, not UI styling.

## Development Rule

Current usable app:

```text
relink_mvp_app
```

Development app:

```text
relink_mvp_app_dev
```

Only after a full smoke test should files move from `relink_mvp_app_dev` back into `relink_mvp_app`.

## API Contract To Preserve

Frontend should depend on this contract:

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

## First Implementation Target

Build a demo-level API without changing the visible design:

1. Add `apps/api`.
2. Implement an Express/Node API using the existing mock logic.
3. Keep local fallback in `api-client.jsx`.
4. Connect only Home flow first:
   - record entry
   - receive observation candidates
   - save selected observations
   - complete daily mission
5. Verify existing static page still works.

## Do Not Do Yet

- Do not add real Supabase credentials.
- Do not call Solar API until the mock API is stable.
- Do not convert every JSX file at once.
- Do not redesign UI.
- Do not move the desktop EXE to dev until the user approves.

## Last Known Stable URLs

Usable MVP:

```text
http://localhost:7654/Re-Link%20AI%20Mobile%20MVP.html
```

Dev should use a different port if both run together:

```text
frontend dev: http://localhost:7754/
api demo:     http://localhost:8787/
```
