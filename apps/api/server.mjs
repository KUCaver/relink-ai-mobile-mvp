import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import {
  API_ENDPOINTS,
  API_HOST,
  API_ORIGINS,
  API_PORT,
} from '../../packages/shared/api-contract.mjs';

const clone = (value) => JSON.parse(JSON.stringify(value));
const apiDir = dirname(fileURLToPath(import.meta.url));

const loadSeedData = () => {
  const dataPath = resolve(apiDir, '../../data.jsx');
  const source = readFileSync(dataPath, 'utf8');
  const dataAssignment = 'window.RELINK_DATA = RELINK_DATA;';
  const dataEnd = source.indexOf(dataAssignment);
  if (dataEnd === -1) {
    throw new Error('data.jsx did not contain the RELINK_DATA assignment');
  }

  const dataOnlySource = source.slice(0, dataEnd + dataAssignment.length);
  const sandbox = { window: {} };
  vm.runInNewContext(dataOnlySource, sandbox, { filename: dataPath });

  if (!sandbox.window.RELINK_DATA) {
    throw new Error('data.jsx did not expose window.RELINK_DATA');
  }

  return clone(sandbox.window.RELINK_DATA);
};

const seedData = loadSeedData();

const initialStore = () => ({
  entries: clone(seedData.history || []),
  observationCandidates: clone(seedData.observationCandidates || []),
  savedObservationIds: [],
  dailyQuest: clone(seedData.dailyQuest || {}),
  questDone: false,
  shardsCount: 5,
  wikiLevel: seedData.wikiLevel,
  xp: seedData.xp,
  maxXp: seedData.maxXp,
  shopOwned: { lamp: true, blanket: true },
  messageDraft: seedData.messageDraft,
  messageSources: clone(seedData.messageSources || []),
});

let store = initialStore();

const todayLabel = () => {
  const now = new Date();
  return `${now.getMonth() + 1}.${now.getDate()}`;
};

const truncateEntry = (text) => {
  const normalized = String(text || '').trim();
  if (!normalized) return seedData.defaultEntry || '';
  return normalized.length > 58 ? `${normalized.slice(0, 58)}...` : normalized;
};

const getCandidateByIndex = (index, fallbackTag) => {
  const candidate = seedData.observationCandidates?.[index];
  if (candidate) return clone(candidate);
  return {
    id: `o${index + 1}`,
    text: `${fallbackTag} 흐름을 확인해볼 수 있어요.`,
    source: '오늘 기록',
    question: `${fallbackTag} 조각이 오늘 흐름과 맞는지 확인해볼까요?`,
    tag: fallbackTag,
  };
};

const detectCandidateIndexes = (text) => {
  const source = String(text || '').toLowerCase();
  const matches = [];

  if (/compare|comparison|friend|others|behind|enough|비교|친구|남들/.test(source)) {
    matches.push(1);
  }
  if (/present|presentation|prepare|start|job|career|exam|task|발표|준비|시작|진로|취업/.test(source)) {
    matches.push(0);
  }
  if (/reply|contact|message|call|text|답장|연락|문자|전화/.test(source)) {
    matches.push(4);
  }
  if (/outside|leave|home|walk|door|밖|외출|집/.test(source)) {
    matches.push(3);
  }
  if (/counsel|help|ask|support|clinic|상담|문의|센터|지원/.test(source)) {
    matches.push(2);
  }

  if (matches.length === 0) matches.push(0, 1, 2);

  return Array.from(new Set(matches)).slice(0, 3);
};

const buildObservations = (text) => {
  const source = truncateEntry(text);
  return detectCandidateIndexes(text).map((index) => ({
    ...getCandidateByIndex(index, `signal-${index + 1}`),
    source,
  }));
};

const buildQuest = (observations) => {
  const base = clone(seedData.dailyQuest || {});
  const first = observations[0];

  return {
    ...base,
    why: first?.question || base.why || 'Saved from the latest entry.',
  };
};

const formatTag = (observation) => observation?.tag || observation?.id || 'observation';

const buildMessageDraft = () => {
  const saved = store.observationCandidates.filter((observation) =>
    store.savedObservationIds.includes(observation.id),
  );

  if (saved.length === 0) {
    return seedData.messageDraft || '';
  }

  const labels = saved.map(formatTag).join(', ');
  return [
    '안녕하세요.',
    `최근 생활에서 ${labels} 흐름을 직접 확인했고, 혼자 정리하기 어려워 문의드립니다.`,
    '진단을 받고 싶은 것은 아니고, 제 생활 흐름을 함께 정리해볼 수 있는 초기 상담 경로가 있는지 알고 싶습니다.',
    '아래 내용은 제가 저장하기로 한 기록 조각만 바탕으로 정리한 초안입니다.',
  ].join(' ');
};

const buildReport = () => {
  const saved = store.observationCandidates.filter((observation) =>
    store.savedObservationIds.includes(observation.id),
  );

  if (saved.length === 0) {
    return {
      weeklyKeywords: clone(seedData.weeklyKeywords || []),
      repeatedPhrases: clone(seedData.repeatedPhrases || []),
      pausedActions: clone(seedData.pausedActions || []),
      possibleActions: clone(seedData.possibleActions || []),
      emotionFlow: clone(seedData.emotionFlow || []),
    };
  }

  return {
    weeklyKeywords: saved.slice(0, 3).map((observation, index) => ({
      word: formatTag(observation),
      count: Math.max(2, 6 - index * 2),
      color: ['#5B6FEF', '#F5A86B', '#5BB97A'][index] || '#5B6FEF',
    })),
    repeatedPhrases: Array.from(new Set(saved.map((observation) => observation.source))).slice(0, 3),
    pausedActions: Array.from(new Set(saved.map(formatTag))).slice(0, 3),
    possibleActions: [
      store.dailyQuest.title,
      ...(seedData.possibleActions || []).slice(0, 2),
    ].filter(Boolean),
    emotionFlow: clone(seedData.emotionFlow || []),
  };
};

const snapshot = () => {
  const report = buildReport();

  return {
    ...clone(seedData),
    history: clone(store.entries),
    observationCandidates: clone(store.observationCandidates),
    dailyQuest: clone(store.dailyQuest),
    weeklyKeywords: report.weeklyKeywords,
    repeatedPhrases: report.repeatedPhrases,
    pausedActions: report.pausedActions,
    possibleActions: report.possibleActions,
    emotionFlow: report.emotionFlow,
    memoryFragments: clone(seedData.memoryFragments || []).slice(
      0,
      Math.max(1, Math.min(4, store.savedObservationIds.length + 1)),
    ),
    wikiLevel: store.wikiLevel,
    xp: store.xp,
    maxXp: store.maxXp,
    messageDraft: store.messageDraft,
    messageSources: clone(store.messageSources),
    shardsCount: store.shardsCount,
    savedObservationIds: clone(store.savedObservationIds),
    shopOwned: clone(store.shopOwned),
  };
};

const sendJson = (res, statusCode, payload, origin) => {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  };

  if (origin && API_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else {
    headers['Access-Control-Allow-Origin'] = 'http://localhost:7754';
  }

  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(payload));
};

const sendOptions = (res, origin) => {
  const allowOrigin = origin && API_ORIGINS.has(origin) ? origin : 'http://localhost:7754';
  res.writeHead(204, {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
  });
  res.end();
};

const readJsonBody = async (req) =>
  new Promise((resolveBody, rejectBody) => {
    let raw = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        rejectBody(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw) {
        resolveBody({});
        return;
      }
      try {
        resolveBody(JSON.parse(raw));
      } catch (error) {
        rejectBody(error);
      }
    });
    req.on('error', rejectBody);
  });

const requireMethod = (req, res, method, origin) => {
  if (req.method === method) return true;
  sendJson(res, 405, { error: `Method ${req.method} not allowed` }, origin);
  return false;
};

const handleRequest = async (req, res) => {
  const origin = req.headers.origin;
  const url = new URL(req.url || '/', `http://${req.headers.host || `${API_HOST}:${API_PORT}`}`);

  if (req.method === 'OPTIONS') {
    sendOptions(res, origin);
    return;
  }

  try {
    if (url.pathname === API_ENDPOINTS.health) {
      if (!requireMethod(req, res, 'GET', origin)) return;
      sendJson(res, 200, { ok: true, data: { status: 'ok' } }, origin);
      return;
    }

    if (url.pathname === API_ENDPOINTS.snapshot) {
      if (!requireMethod(req, res, 'GET', origin)) return;
      sendJson(res, 200, { data: snapshot() }, origin);
      return;
    }

    if (url.pathname === API_ENDPOINTS.analyzeEntry) {
      if (!requireMethod(req, res, 'POST', origin)) return;
      const body = await readJsonBody(req);
      const text = String(body.text || '');
      const observations = buildObservations(text);

      store.observationCandidates = observations;
      store.savedObservationIds = [];
      store.dailyQuest = buildQuest(observations);
      store.questDone = false;
      store.messageDraft = buildMessageDraft();
      store.entries = [
        {
          date: todayLabel(),
          entry: truncateEntry(text),
          tags: observations.map(formatTag),
          quest: store.dailyQuest.title,
          questDone: false,
        },
        ...store.entries.filter((entry) => entry.date !== todayLabel()),
      ].slice(0, 7);

      sendJson(res, 200, { data: snapshot() }, origin);
      return;
    }

    if (url.pathname === API_ENDPOINTS.saveObservations) {
      if (!requireMethod(req, res, 'POST', origin)) return;
      const body = await readJsonBody(req);
      const validIds = new Set(store.observationCandidates.map((observation) => observation.id));
      store.savedObservationIds = Array.from(new Set(Array.isArray(body.ids) ? body.ids : []))
        .filter((id) => validIds.has(id));
      store.shardsCount = 5 + store.savedObservationIds.length;
      store.xp = Math.min(
        store.maxXp,
        35 + store.savedObservationIds.length * 5 + (store.questDone ? 5 : 0),
      );
      store.messageDraft = buildMessageDraft();
      store.messageSources = store.observationCandidates
        .filter((observation) => store.savedObservationIds.includes(observation.id))
        .map((observation) => ({
          tag: formatTag(observation),
          txt: `저장한 관찰 조각: ${observation.source}`,
        }));

      sendJson(res, 200, { data: snapshot() }, origin);
      return;
    }

    if (url.pathname === API_ENDPOINTS.completeMission) {
      if (!requireMethod(req, res, 'POST', origin)) return;
      await readJsonBody(req);
      store.questDone = true;
      store.shardsCount += 2;
      store.xp = Math.min(store.maxXp, store.xp + 5);
      store.entries = store.entries.map((entry, index) =>
        index === 0 ? { ...entry, questDone: true } : entry,
      );

      sendJson(res, 200, { data: snapshot() }, origin);
      return;
    }

    if (url.pathname === API_ENDPOINTS.placeRoomItem) {
      if (!requireMethod(req, res, 'POST', origin)) return;
      const body = await readJsonBody(req);
      const itemId = String(body.itemId || '').trim();
      if (itemId) {
        store.shopOwned = { ...store.shopOwned, [itemId]: true };
      }

      sendJson(res, 200, { data: snapshot(), shopOwned: clone(store.shopOwned) }, origin);
      return;
    }

    if (url.pathname === API_ENDPOINTS.messageDraft) {
      if (!requireMethod(req, res, 'POST', origin)) return;
      await readJsonBody(req);
      store.messageDraft = buildMessageDraft();

      sendJson(res, 200, { data: snapshot(), draft: store.messageDraft }, origin);
      return;
    }

    sendJson(res, 404, { error: 'Not found' }, origin);
  } catch (error) {
    sendJson(res, 500, { error: error.message || 'Internal server error' }, origin);
  }
};

const server = createServer(handleRequest);

server.listen(API_PORT, API_HOST, () => {
  console.log(`Re:Link demo API listening at http://${API_HOST}:${API_PORT}`);
});
