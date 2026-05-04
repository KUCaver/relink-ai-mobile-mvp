export const API_HOST = '127.0.0.1';
export const API_PORT = 8787;
export const API_ORIGINS = new Set([
  'http://localhost:7754',
  'http://127.0.0.1:7754',
]);

export const API_ENDPOINTS = {
  health: '/api/health',
  snapshot: '/api/snapshot',
  analyzeEntry: '/api/entries/analyze',
  saveObservations: '/api/observations/consent',
  completeMission: '/api/missions/complete',
  placeRoomItem: '/api/room/items',
  messageDraft: '/api/message-draft',
};

export const RESPONSE_SHAPES = {
  snapshot: '{ data: snapshot }',
  withDraft: '{ data: snapshot, draft: string }',
  withShopOwned: '{ data: snapshot, shopOwned: object }',
};
