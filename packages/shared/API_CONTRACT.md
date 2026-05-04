# Re:Link Demo API Contract

The demo API runs at `http://127.0.0.1:8787`.

Allowed browser origins:

- `http://localhost:7754`
- `http://127.0.0.1:7754`

Endpoints:

- `GET /api/health`
- `GET /api/snapshot`
- `POST /api/entries/analyze` with `{ "text": string }`
- `POST /api/observations/consent` with `{ "ids": string[] }`
- `POST /api/missions/complete`
- `POST /api/room/items` with `{ "itemId": string }`
- `POST /api/message-draft`

Response envelopes stay compatible with `api-client.jsx`:

- `{ "data": snapshot }`
- `{ "data": snapshot, "draft": string }`
- `{ "data": snapshot, "shopOwned": object }`

State is intentionally in memory for the first demo loop. Restarting the API resets to the seed data from `data.jsx`.
