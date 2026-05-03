// Re:Link API adapter.
// Set window.RELINK_API_BASE_URL = 'http://127.0.0.1:8000' before this file
// to use a real backend. Without it, the same contract runs against local mock data.

(function initReLinkApi() {
  const storageKey = 'relink-front-api-state-v1';

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const todayLabel = () => {
    const now = new Date();
    return `${now.getMonth() + 1}.${now.getDate()} ${'일월화수목금토'[now.getDay()]}`;
  };
  const wait = (value, ms = 260) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

  const readStore = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey));
      if (parsed) return parsed;
    } catch (_) {
      // ignore malformed local demo cache
    }
    const D = window.RELINK_DATA;
    return {
      entries: clone(D.history),
      observationCandidates: clone(D.observationCandidates),
      savedObservationIds: [],
      dailyQuest: clone(D.dailyQuest),
      questDone: false,
      shardsCount: 5,
      wikiLevel: D.wikiLevel,
      xp: D.xp,
      maxXp: D.maxXp,
      shopOwned: { lamp: true, blanket: true },
      messageDraft: D.messageDraft,
      messageSources: [
        { tag: '비교', txt: '저장한 관찰 후보에서 비교가 올라오는 흐름' },
        { tag: '시작 부담', txt: '기록에서 시작 전 멈춤이 반복된 흐름' },
        { tag: '문의 초안', txt: '사용자가 저장한 조각만 반영' },
      ],
    };
  };

  let store = readStore();

  const persist = () => {
    localStorage.setItem(storageKey, JSON.stringify(store));
  };

  const formatTag = (tag) => {
    const labels = {
      comparison: '비교',
      start: '시작 부담',
      reply: '답장 미룸',
      outside: '밖에 나가기 부담',
      message: '상담 문의 부담',
      action: '작은 시도',
    };
    return labels[tag] || tag;
  };

  const detectTags = (text) => {
    const src = String(text || '');
    const tags = [];
    if (/비교|친구|남들|뒤처|부족|잘하고/.test(src)) tags.push('comparison');
    if (/발표|준비|공고|자소서|면접|진로|취업|자료|시작|닫/.test(src)) tags.push('start');
    if (/답장|연락|카톡|문자|전화/.test(src)) tags.push('reply');
    if (/밖|외출|현관|집에만|나가기/.test(src)) tags.push('outside');
    if (/상담|문의|센터|도움|지원|신청/.test(src)) tags.push('message');
    if (tags.length === 0) tags.push('action');
    return Array.from(new Set(tags));
  };

  const pickSource = (text, keywordRegex, fallback) => {
    const sentences = String(text || '')
      .split(/(?<=[.!?。！？\n])|\s{2,}/)
      .map((s) => s.trim())
      .filter(Boolean);
    return sentences.find((sentence) => keywordRegex.test(sentence)) || fallback || '오늘 기록 전체';
  };

  const buildObservations = (text) => {
    const tags = detectTags(text);
    const rules = [
      {
        id: 'o-start',
        tag: '시작 부담',
        text: '오늘 기록에서는 시작하기 전 부담이 컸을 가능성이 있어요.',
        source: pickSource(text, /발표|준비|공고|자소서|면접|진로|취업|자료|시작|닫/, '“해야 하는데 멈춘 일”로 보이는 문장'),
        question: '정말 귀찮았던 걸까, 아니면 시작하면 부담이 커질 것 같았던 걸까?',
        signal: 'start',
      },
      {
        id: 'o-compare',
        tag: '비교가 올라옴',
        text: '다른 사람의 속도가 내 기준처럼 느껴졌을 수도 있어요.',
        source: pickSource(text, /비교|친구|남들|뒤처|부족|잘하고/, '“비교하는 마음이 자꾸 올라오고”'),
        question: '사용자가 보기엔 비교가 올라온 순간이 있었나요?',
        signal: 'comparison',
      },
      {
        id: 'o-reply',
        tag: '답장 미룸',
        text: '답장이나 연락을 바로 잇기 어려웠던 흐름을 확인해볼 수 있어요.',
        source: pickSource(text, /답장|연락|카톡|문자|전화/, '연락을 떠올린 문장'),
        question: '답장을 미룬 이유는 말 고르기였나요, 에너지가 부족해서였나요?',
        signal: 'reply',
      },
      {
        id: 'o-outside',
        tag: '밖에 나가기 부담',
        text: '밖에 나가는 첫 동작이 조금 크게 느껴졌을 가능성이 있어요.',
        source: pickSource(text, /밖|외출|현관|집에만|나가기/, '바깥을 떠올린 문장'),
        question: '밖에 나가기 전 가장 부담스러운 건 준비, 시선, 이동 중 어느 쪽에 가까웠나요?',
        signal: 'outside',
      },
      {
        id: 'o-message',
        tag: '상담 문의 부담',
        text: '도움을 요청하는 첫 문장을 고르는 일이 부담이었을 수도 있어요.',
        source: pickSource(text, /상담|문의|센터|도움|지원|신청/, '도움을 떠올린 문장'),
        question: '지금 필요한 건 바로 신청일까요, 아니면 먼저 물어볼 문장일까요?',
        signal: 'message',
      },
      {
        id: 'o-action',
        tag: '작은 시도 가능',
        text: '아주 작은 행동부터라면 다시 이어볼 수 있는 가능성이 있어요.',
        source: pickSource(text, /조금|하나|한 줄|한 장|정리|물|창문|책상/, '오늘 기록 전체'),
        question: '오늘 할 수 있는 제일 작은 행동은 무엇에 가까울까요?',
        signal: 'action',
      },
    ];

    const selected = rules.filter((rule) => tags.includes(rule.signal));
    const fallback = rules.find((rule) => rule.signal === 'action');
    return Array.from(new Map([...selected, fallback].map((rule) => [rule.id, rule])).values()).slice(0, 3);
  };

  const buildQuest = (observations) => {
    const tags = observations.map((o) => o.tag).join(' ');
    if (tags.includes('답장')) {
      return {
        title: '답장 첫 줄만 써두기',
        examples: ['“늦게 봐서 미안해” 한 줄 적기', '보내지 않고 메모장에만 쓰기'],
        why: '답장 미룸 조각을 저장 후보로 확인했어요.',
      };
    }
    if (tags.includes('밖에')) {
      return {
        title: '문 앞 공기 30초 확인하기',
        examples: ['현관 앞에 서기', '창문 열고 바깥 소리 듣기'],
        why: '밖에 나가기 부담 조각을 확인했어요.',
      };
    }
    return {
      title: '준비물 하나만 다시 열기',
      examples: ['발표 자료 첫 장 보기', '공고 링크만 다시 열기'],
      why: '시작 전 부담 조각을 확인했어요.',
    };
  };

  const buildReport = () => {
    const saved = store.observationCandidates.filter((o) => store.savedObservationIds.includes(o.id));
    const words = saved.length ? saved.map((o) => o.tag) : ['시작 부담', '비교가 올라옴', '작은 시도'];
    return {
      weeklyKeywords: words.slice(0, 3).map((word, index) => ({
        word,
        count: Math.max(2, 6 - index * 2),
        color: ['#5B6FEF', '#F5A86B', '#5BB97A'][index] || '#5B6FEF',
      })),
      repeatedPhrases: saved.length ? Array.from(new Set(saved.map((o) => o.source.replace(/[“”"]/g, ''))).slice(0, 3)) : window.RELINK_DATA.repeatedPhrases,
      pausedActions: saved.length ? Array.from(new Set(saved.map((o) => o.tag))).slice(0, 3) : window.RELINK_DATA.pausedActions,
      possibleActions: [store.dailyQuest.title, '기록 남기기', '문의문 초안 확인'],
      emotionFlow: window.RELINK_DATA.emotionFlow,
    };
  };

  const buildMessageDraft = () => {
    const saved = store.observationCandidates.filter((o) => store.savedObservationIds.includes(o.id));
    if (saved.length === 0) {
      return '아직 저장하기로 한 기억 조각이 없어 문의문 초안을 만들지 않았어요. 필요한 조각만 먼저 저장해 주세요.';
    }
    const labels = saved.map((o) => o.tag).join(', ');
    return [
      '안녕하세요.',
      `최근 생활에서 ${labels} 흐름을 직접 확인했고, 혼자 정리하기 어려워 문의드립니다.`,
      '진단을 받고 싶은 것은 아니고, 제 생활 흐름을 함께 정리해볼 수 있는 비대면 상담이나 초기 상담 경로가 있는지 알고 싶습니다.',
      '아래 내용은 제가 저장하기로 한 기록 조각만 바탕으로 정리한 초안입니다.',
    ].join(' ');
  };

  const snapshot = () => {
    const report = buildReport();
    return {
      ...clone(window.RELINK_DATA),
      history: clone(store.entries),
      observationCandidates: clone(store.observationCandidates),
      dailyQuest: clone(store.dailyQuest),
      weeklyKeywords: report.weeklyKeywords,
      repeatedPhrases: report.repeatedPhrases,
      pausedActions: report.pausedActions,
      possibleActions: report.possibleActions,
      emotionFlow: report.emotionFlow,
      memoryFragments: clone(window.RELINK_DATA.memoryFragments).slice(0, Math.max(1, Math.min(4, store.savedObservationIds.length + 1))),
      wikiLevel: store.wikiLevel,
      xp: store.xp,
      maxXp: store.maxXp,
      messageDraft: store.messageDraft,
      messageSources: store.messageSources,
      shardsCount: store.shardsCount,
      savedObservationIds: clone(store.savedObservationIds),
    };
  };

  const request = async (path, body, fallback) => {
    const baseUrl = window.RELINK_API_BASE_URL;
    if (baseUrl) {
      try {
        const res = await fetch(`${baseUrl}${path}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body || {}),
        });
        if (!res.ok) throw new Error(`API ${res.status}`);
        return await res.json();
      } catch (error) {
        console.warn('[ReLinkApi] live backend failed; using local mock', error);
      }
    }
    return wait(fallback());
  };

  window.ReLinkApi = {
    getInitialSnapshot() {
      return snapshot();
    },

    async submitEntry({ text }) {
      return request('/api/entries/analyze', { text }, () => {
        const observations = buildObservations(text);
        store.observationCandidates = observations;
        store.savedObservationIds = [];
        store.dailyQuest = buildQuest(observations);
        store.questDone = false;
        store.messageDraft = buildMessageDraft();
        store.entries = [
          {
            date: todayLabel(),
            entry: text.length > 58 ? `${text.slice(0, 58)}...` : text,
            tags: observations.map((o) => o.tag),
            quest: store.dailyQuest.title,
            questDone: false,
          },
          ...store.entries.filter((entry) => entry.date !== todayLabel()),
        ].slice(0, 7);
        persist();
        return { data: snapshot() };
      });
    },

    async saveObservations({ ids }) {
      return request('/api/observations/consent', { ids }, () => {
        store.savedObservationIds = Array.from(new Set(ids || []));
        store.shardsCount = 5 + store.savedObservationIds.length;
        store.xp = Math.min(store.maxXp, 35 + store.savedObservationIds.length * 5 + (store.questDone ? 5 : 0));
        store.messageDraft = buildMessageDraft();
        store.messageSources = store.observationCandidates
          .filter((o) => store.savedObservationIds.includes(o.id))
          .map((o) => ({ tag: o.tag, txt: `${formatTag(o.signal)} 조각: ${o.source}` }));
        persist();
        return { data: snapshot() };
      });
    },

    async completeQuest() {
      return request('/api/missions/complete', {}, () => {
        store.questDone = true;
        store.shardsCount += 2;
        store.xp = Math.min(store.maxXp, store.xp + 5);
        store.entries = store.entries.map((entry, index) => index === 0 ? { ...entry, questDone: true } : entry);
        persist();
        return { data: snapshot() };
      });
    },

    async placeShopItem({ itemId }) {
      return request('/api/room/items', { itemId }, () => {
        store.shopOwned = { ...store.shopOwned, [itemId]: true };
        persist();
        return { data: snapshot(), shopOwned: clone(store.shopOwned) };
      });
    },

    async regenerateMessageDraft() {
      return request('/api/message-draft', {}, () => {
        store.messageDraft = buildMessageDraft();
        persist();
        return { data: snapshot(), draft: store.messageDraft };
      });
    },
  };
})();
