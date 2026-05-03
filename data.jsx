// Mock data and shared constants for Re:Link AI

const RELINK_COLORS = {
  bg: '#F5F7FB',
  card: '#FFFFFF',
  ink: '#1B2240',
  inkSoft: '#5A6585',
  inkMute: '#8A93AB',
  line: '#ECEFF6',
  blue: '#5B6FEF',
  blueSoft: '#EEF1FE',
  blueDeep: '#3F4FC9',
  green: '#5BB97A',
  greenSoft: '#E8F6EC',
  mint: '#D9F0DF',
  warn: '#F5A86B',
  pink: '#FFD6D9',
  lavender: '#EFEAFE',
};

const RELINK_DATA = {
  userName: '지민',
  greetingTime: '오전 9:32',
  streakDays: 7,
  wikiLevel: 3,
  xp: 35,
  maxXp: 60,

  defaultEntry:
    '오늘 발표 준비 때문에 밤을 새워서 피곤했어. 비교하는 마음이 자꾸 올라오고, 내가 잘하고 있는 건지 확신이 안 들었어.',

  observationCandidates: [
    {
      id: 'o1',
      text: '완벽하게 준비하려는 마음이 강해요.',
      source: '“밤을 새워서 피곤했어”',
      question: '완벽하지 않아도 괜찮다고 느낀 순간이 최근에 있었나요?',
      tag: '완벽주의',
    },
    {
      id: 'o2',
      text: '다른 사람과 비교하며 스스로를 낮추는 경향이 보여요.',
      source: '“비교하는 마음이 자꾸 올라오고”',
      question: '비교가 올라올 때, 주로 누구와 비교하고 있다고 느끼나요?',
      tag: '비교',
    },
    {
      id: 'o3',
      text: '잘하고 싶은 마음이 커서 스스로에게 압박을 주고 있어요.',
      source: '“내가 잘하고 있는 건지 확신이 안 들었어”',
      question: '“잘하고 있다”는 기준은 누가 정한 것 같나요?',
      tag: '압박',
    },
    {
      id: 'o4',
      text: '새로운 도전을 피하고 안정적인 선택을 우선해요.',
      source: '“확신이 안 들었어”',
      question: '확신이 없을 때, 보통 어떤 선택을 자주 하시나요?',
      tag: '회피',
    },
    {
      id: 'o5',
      text: '감정 표현이 적고 혼자 해결하려는 경향이 있어요.',
      source: '기록 전반의 흐름',
      question: '오늘의 감정을 한 사람에게 말한다면, 누구일까요?',
      tag: '고립',
    },
  ],

  dailyQuest: {
    title: '비교가 올라올 때, 지금 하고 있는 것 하나만 집중해보기',
    examples: ['25분 집중하기', '오늘의 발표 자료 한 장 정리하기'],
    why: '“비교” 관찰 후보를 자주 저장하셨어요.',
  },

  history: [
    {
      date: '4.27 일',
      entry: '발표 준비 때문에 피곤했고 비교감이 올라왔다.',
      tags: ['비교', '불안', '완벽주의'],
      quest: '발표 자료 한 장 정리하기',
      questDone: true,
    },
    {
      date: '4.26 토',
      entry: '오랜만에 친구를 만났는데 답장이 늦어서 미안했다.',
      tags: ['연결', '미루기'],
      quest: '친구에게 한 줄 답장 보내기',
      questDone: true,
    },
    {
      date: '4.25 금',
      entry: '공고를 보다가 자신이 없어져서 창을 닫아버렸다.',
      tags: ['회피', '비교'],
      quest: '공고 한 개만 끝까지 읽기',
      questDone: false,
    },
    {
      date: '4.24 목',
      entry: '이력서 한 줄을 고쳤다. 별 일 아닌데 뿌듯했다.',
      tags: ['시작', '성장'],
      quest: '이력서 첫 문장 다듬기',
      questDone: true,
    },
    {
      date: '4.23 수',
      entry: '아침에 일어나기 힘들었지만 차 한잔으로 시작했다.',
      tags: ['시작', '루틴'],
      quest: '따뜻한 음료 한 잔 마시기',
      questDone: true,
    },
    {
      date: '4.22 화',
      entry: '하루 종일 휴대폰만 봤다. 시간이 아까웠다.',
      tags: ['미루기', '후회'],
      quest: '5분만 산책하기',
      questDone: false,
    },
    {
      date: '4.21 월',
      entry: '한 주의 시작이 무거웠다. 그래도 기록은 남겼다.',
      tags: ['무거움', '시작'],
      quest: '오늘의 한 줄 적기',
      questDone: true,
    },
  ],

  weeklyKeywords: [
    { word: '비교', count: 6, color: '#5B6FEF' },
    { word: '불안', count: 4, color: '#F5A86B' },
    { word: '성장', count: 3, color: '#5BB97A' },
  ],

  // emotion flow — values 0..4 (0 무거움 ~ 4 가벼움)
  emotionFlow: [
    { day: '월', v: 1.6 },
    { day: '화', v: 1.0 },
    { day: '수', v: 2.2 },
    { day: '목', v: 2.8 },
    { day: '금', v: 1.4 },
    { day: '토', v: 2.4 },
    { day: '일', v: 3.0 },
  ],

  repeatedPhrases: ['오바 같음', '나중에', '못 했어'],
  pausedActions: ['공고 보기', '친구 답장', '상담 문의'],
  possibleActions: ['자료 한 장 정리', '25분 집중', '기록 남기기'],

  memoryFragments: [
    { name: '바람 조각', emoji: '🌬️', desc: '비교가 올라와도 멈추지 않은 날' },
    { name: '시작 조각', emoji: '🌱', desc: '한 줄이라도 적었던 날' },
    { name: '연결 조각', emoji: '🔗', desc: '누군가에게 답장한 날' },
    { name: '용기 조각', emoji: '✨', desc: '피하지 않고 한 번 더 본 날' },
  ],

  wikiFoods: [
    { name: '작은 새싹', emoji: '🌿', cost: '1 조각' },
    { name: '따뜻한 차', emoji: '🍵', cost: '2 조각' },
    { name: '반짝 조각', emoji: '🌟', cost: '3 조각' },
  ],

  shopItems: [
    {
      id: 'turtle',
      name: '거북이친구',
      effect: '위키와 마음을 서로 바꿔줘요',
      detail: '하루에 한 번, 위키가 나와 감정을 교환해요. 무거운 마음을 잠시 맡길 수 있어요.',
      price: 5, currency: 'shards',
      iconKind: 'turtle',
    },
    {
      id: 'seed',
      name: '씨앗',
      effect: '성장할 때 호감도 획득',
      detail: '심으면 며칠에 걸쳐 자라요. 다 자라면 작은 추억 조각을 줘요.',
      price: 2, currency: 'shards',
      iconKind: 'seed',
    },
    {
      id: 'window',
      name: '창문',
      effect: '호감단계 상승 시 필요',
      detail: '창밖을 더 멀리 볼 수 있게 돼요. 바깥 풍경이 매일 조금씩 달라져요.',
      price: 8, currency: 'shards',
      iconKind: 'window',
      locked: true, lockNote: 'Lv.5에 열려요',
    },
    {
      id: 'book',
      name: '책',
      effect: '호감단계 상승 시 필요',
      detail: '위키가 책을 읽고 새로운 말투를 배워와요.',
      price: 4, currency: 'shards',
      iconKind: 'book',
    },
    {
      id: 'wall',
      name: '벽',
      effect: '벽지를 도배해요',
      detail: '방의 분위기를 바꿔요. 따뜻한 색·차분한 색 중에 골라 발라요.',
      price: 6, currency: 'shards',
      iconKind: 'wall',
    },
    {
      id: 'lamp',
      name: '전등',
      effect: '안정감 있게 만들어요',
      detail: '밤이 되어도 방이 너무 어두워지지 않아요. 위키가 더 잘 자요.',
      price: 3, currency: 'shards',
      iconKind: 'lamp',
    },
    {
      id: 'blanket',
      name: '이불',
      effect: '잠을 잘 수 있어요',
      detail: '6시간 이상 자고 들어오면 꿈일기를 볼 수 있어요. 읽으면 호감도가 올라가요.',
      price: 4, currency: 'shards',
      iconKind: 'blanket',
    },
    {
      id: 'cup',
      name: '물컵',
      effect: '1분에 +10씩 채워져요',
      detail: '구매 시 방 옆에 놓여 터치할 수 있어요. 0~250까지 채워지며 위키가 마실 수 있어요.',
      price: 2, currency: 'shards',
      iconKind: 'cup',
    },
  ],

  supportCandidates: [
    {
      id: 'campus-local-counsel',
      name: '학교 상담센터 / 지역 상담센터',
      category: 'counseling',
      description: '비교, 불안, 압박감이 반복될 때 먼저 문의해볼 수 있는 상담 경로예요.',
      triggerTags: ['비교', '불안', '압박', '완벽주의', '비교가 올라옴', '시작 부담'],
      questionsToAsk: ['비대면 상담이 가능한가요?', '진로 불안이나 비교감도 상담 가능한가요?', '1회 상담부터 가능한가요?'],
      caution: '상담 가능 여부와 이용 방식은 기관에서 최종 확인해야 해요.',
      priority: 4,
    },
    {
      id: 'career-job-center',
      name: '청년 진로·취업 지원센터',
      category: 'career',
      description: '공고 보기, 발표 준비, 진로 준비 앞에서 자주 멈춘 기록이 있을 때 확인해볼 수 있는 경로예요.',
      triggerTags: ['시작 부담', '공고', '발표', '진로', '회피', '취업', '준비'],
      questionsToAsk: ['진로상담이나 취업 준비 상담이 가능한가요?', '부담 낮은 1회 상담부터 가능한가요?', '발표 준비나 취업 준비 압박감도 상담 가능한가요?'],
      caution: 'Re:Link는 지원 대상 여부를 판단하지 않고, 문의할 내용을 정리해요.',
      priority: 3,
    },
    {
      id: 'mental-health-youth',
      name: '정신건강복지센터 / 청년 마음건강 상담',
      category: 'mental_health',
      description: '불안감, 압박감, 수면·생활 리듬 어려움이 반복될 때 문의 후보로 볼 수 있는 경로예요.',
      triggerTags: ['불안', '압박', '무기력', '반복표현', '생활리듬', '수면', '고립'],
      questionsToAsk: ['초기상담이 가능한가요?', '비대면 또는 전화 상담이 가능한가요?', '현재 상태를 어떻게 설명하면 좋을까요?'],
      caution: 'Re:Link는 상태를 진단하지 않고 상담 가능 여부 확인을 도와요.',
      priority: 2,
    },
    {
      id: 'youth-local-support',
      name: '청년센터 / 지자체 청년지원',
      category: 'youth_support',
      description: '진로, 생활, 고립감, 사회진입 부담이 함께 나타날 때 확인해볼 수 있는 경로예요.',
      triggerTags: ['고립', '시작 부담', '진로', '외출감소', '연결', '밖에 나가기 부담', '상담 문의 부담'],
      questionsToAsk: ['청년 상담이나 생활지원 프로그램이 있나요?', '비대면으로 먼저 문의할 수 있나요?', '어떤 정보를 준비하면 되나요?'],
      caution: '지원 대상 여부는 각 기관에서 최종 확인해야 해요. Re:Link는 문의 준비만 도와요.',
      priority: 1,
    },
  ],

  messageDraft:
    '안녕하세요. 최근 발표 준비와 진로 준비 과정에서 비교와 불안감이 자주 올라오고 있습니다. 스스로를 믿고 싶은 마음은 있지만, 반복적으로 압박감을 느껴 상담을 받아보고 싶습니다. 제 상태가 어떤지 단정받고 싶은 것은 아니고, 현재 생활 흐름을 함께 정리해보고 싶어 문의드립니다.',
};

window.RELINK_COLORS = RELINK_COLORS;
window.RELINK_DATA = RELINK_DATA;

// Dark variant — soft warm-violet to match the 비내리는 단칸방 mood
const RELINK_COLORS_DARK = {
  bg: '#1F1B30',
  card: '#2B2640',
  ink: '#FAF7F0',
  inkSoft: 'rgba(250,247,240,0.78)',
  inkMute: 'rgba(250,247,240,0.55)',
  line: 'rgba(250,247,240,0.12)',
  blue: '#9AAEFF',
  blueSoft: 'rgba(154,174,255,0.18)',
  blueDeep: '#C8D4FF',
  green: '#7FD49B',
  greenSoft: 'rgba(127,212,155,0.18)',
  mint: 'rgba(127,212,155,0.22)',
  warn: '#F5A86B',
  pink: '#FFB8D9',
  lavender: 'rgba(192,178,255,0.18)',
};

window.RELINK_COLORS_DARK = RELINK_COLORS_DARK;

// Theme context (global mode state) — single source of truth
const ReLinkTheme = React.createContext({ mode: 'day', setMode: () => {} });
window.ReLinkTheme = ReLinkTheme;
window.useTheme = function useTheme() {
  const ctx = React.useContext(ReLinkTheme);
  const palette = ctx.mode === 'night' ? RELINK_COLORS_DARK : RELINK_COLORS;
  return { ...palette, mode: ctx.mode, setMode: ctx.setMode };
};
