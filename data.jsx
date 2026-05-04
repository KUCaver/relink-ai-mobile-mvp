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
  userAddress: '서울 광진구 능동로 120 (화양동)',

  defaultEntry:
    '오늘 발표 준비 때문에 밤을 새워서 피곤했어. 비교하는 마음이 자꾸 올라오고, 내가 잘하고 있는 건지 확신이 안 들었어.',

  observationCandidates: [
    {
      id: 'o1',
      text: '완벽하게 준비하려는 마음이 강해요.',
      source: '"밤을 새워서 피곤했어"',
      question: '완벽하지 않아도 괜찮다고 느낀 순간이 최근에 있었나요?',
      tag: '완벽주의',
    },
    {
      id: 'o2',
      text: '다른 사람과 비교하며 스스로를 낮추는 경향이 보여요.',
      source: '"비교하는 마음이 자꾸 올라오고"',
      question: '비교가 올라올 때, 주로 누구와 비교하고 있다고 느끼나요?',
      tag: '비교',
    },
    {
      id: 'o3',
      text: '잘하고 싶은 마음이 커서 스스로에게 압박을 주고 있어요.',
      source: '"내가 잘하고 있는 건지 확신이 안 들었어"',
      question: '"잘하고 있다"는 기준은 누가 정한 것 같나요?',
      tag: '압박',
    },
    {
      id: 'o4',
      text: '새로운 도전을 피하고 안정적인 선택을 우선해요.',
      source: '"확신이 안 들었어"',
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
    why: '"비교" 관찰 후보를 자주 저장하셨어요.',
  },

  // 14일치 history — 필터 결과: 비교4 / 불안4 / 성장4 / 시작5 / 회피3
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
    // 2주차 추가 데이터 (4.14–4.20)
    {
      date: '4.20 일',
      entry: '친구 SNS를 보다가 나만 뒤처지는 것 같아서 불안했다.',
      tags: ['비교', '불안'],
      quest: '30분 휴대폰 내려놓기',
      questDone: false,
    },
    {
      date: '4.19 토',
      entry: '오랜만에 책상 정리를 했다. 작게 시작하니 이어졌다.',
      tags: ['성장', '시작'],
      quest: '책상 위 물건 5개 정리하기',
      questDone: true,
    },
    {
      date: '4.18 금',
      entry: '상담 예약을 알아보다가 망설이다가 그냥 닫았다.',
      tags: ['회피', '불안'],
      quest: '상담 안내 페이지만 열어보기',
      questDone: false,
    },
    {
      date: '4.17 목',
      entry: '스터디 발표가 생각보다 잘 됐다. 조금 자신감이 붙었다.',
      tags: ['성장'],
      quest: '발표 후 잘한 점 하나 적기',
      questDone: true,
    },
    {
      date: '4.16 수',
      entry: '해야 할 일이 많았는데 다 미뤄버렸다. 자책이 됐다.',
      tags: ['회피', '미루기'],
      quest: '작업 목록 한 줄만 적기',
      questDone: false,
    },
    {
      date: '4.15 화',
      entry: '취업한 선배 소식을 들었다. 비교가 올라오면서 불안해졌다.',
      tags: ['비교', '불안'],
      quest: '5분 산책하기',
      questDone: true,
    },
    {
      date: '4.14 월',
      entry: '새 주를 시작하며 공부할 내용을 정리했다. 할 수 있다고 느꼈다.',
      tags: ['시작', '성장'],
      quest: '이번 주 목표 한 문장 적기',
      questDone: true,
    },
  ],

  // 기간별 리포트 데이터
  reportData: {
    '7일': {
      dateLabel: '4.21 (월) – 4.27 (일)',
      weeklyKeywords: [
        { word: '비교', count: 6, color: '#5B6FEF' },
        { word: '불안', count: 4, color: '#F5A86B' },
        { word: '성장', count: 3, color: '#5BB97A' },
      ],
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
      message: '스스로를 더 믿고 싶은 마음이 커졌어요. 작은 성공 경험이 자신감을 키워줄 거예요.',
    },
    '14일': {
      dateLabel: '4.14 (월) – 4.27 (일)',
      weeklyKeywords: [
        { word: '비교', count: 8, color: '#5B6FEF' },
        { word: '시작', count: 7, color: '#5BB97A' },
        { word: '불안', count: 6, color: '#F5A86B' },
      ],
      emotionFlow: [
        { day: '1주', v: 2.0 },
        { day: '2일', v: 1.5 },
        { day: '3일', v: 2.4 },
        { day: '4일', v: 2.2 },
        { day: '5일', v: 1.6 },
        { day: '6일', v: 2.6 },
        { day: '7일+', v: 2.8 },
      ],
      repeatedPhrases: ['조금만 더', '어차피', '해야 하는데'],
      pausedActions: ['이력서 작성', '공고 보기', '답장하기'],
      possibleActions: ['기록 남기기', '이력서 한 줄', '물 한 잔'],
      message: '2주 동안 시작을 반복했어요. 멈추지 않은 것 자체가 성장이에요.',
    },
    '1달': {
      dateLabel: '3.28 (금) – 4.27 (일) · MVP 14일 샘플 기반 미리보기',
      weeklyKeywords: [
        { word: '시작', count: 12, color: '#5BB97A' },
        { word: '성장', count: 9, color: '#3F4FC9' },
        { word: '비교', count: 8, color: '#F5A86B' },
      ],
      emotionFlow: [
        { day: '1주', v: 1.8 },
        { day: '2주', v: 2.0 },
        { day: '3주', v: 2.3 },
        { day: '4주', v: 2.1 },
        { day: '5일', v: 2.5 },
        { day: '6일', v: 2.7 },
        { day: '7일+', v: 3.0 },
      ],
      repeatedPhrases: ['이번엔', '그래도', '해봤다'],
      pausedActions: ['운동하기', '도서관 가기', '연락하기'],
      possibleActions: ['산책 5분', '기록 남기기', '오늘의 한 가지'],
      message: '한 달의 흐름에서 시작하는 용기가 조금씩 늘고 있어요. 그 변화를 알아봐 주세요.',
    },
  },

  // 감정 흐름 (7일 기본 — WeeklyReportScreen 기본값)
  emotionFlow: [
    { day: '월', v: 1.6 },
    { day: '화', v: 1.0 },
    { day: '수', v: 2.2 },
    { day: '목', v: 2.8 },
    { day: '금', v: 1.4 },
    { day: '토', v: 2.4 },
    { day: '일', v: 3.0 },
  ],

  weeklyKeywords: [
    { word: '비교', count: 6, color: '#5B6FEF' },
    { word: '불안', count: 4, color: '#F5A86B' },
    { word: '성장', count: 3, color: '#5BB97A' },
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

  messageDraft:
    '안녕하세요. 최근 발표 준비와 진로 준비 과정에서 비교와 불안감이 자주 올라오고 있습니다. 스스로를 믿고 싶은 마음은 있지만, 반복적으로 압박감을 느껴 상담을 받아보고 싶습니다. 제 상태가 어떤지 단정받고 싶은 것은 아니고, 현재 생활 흐름을 함께 정리해보고 싶어 문의드립니다.',

  messageSources: [
    { tag: '비교', txt: '4.27, 4.25 기록에서 "비교가 자주 올라온다"는 흐름' },
    { tag: '불안', txt: '발표 준비 기간의 압박감 표현 4회' },
    { tag: '도움 받고 싶다', txt: '저장한 관찰 후보 3개의 공통 톤' },
  ],

  // 건국대 서울캠퍼스(광진구) 주변 검증된 지원 기관 7개
  supportCandidates: [
    {
      name: '건국대학교 심리상담센터',
      kind: '교내 상담',
      address: '산학협동관 110호',
      phone: '02-450-3019',
      hours: '평일 09:00–17:00',
      url: 'https://counsel.konkuk.ac.kr',
      reason: '"발표·과제 압박" 표현이 반복되었고, 교내 접근이 가장 빠릅니다.',
      reasonShort: '학업 압박·불안 반복',
      tags: ['압박', '학업', '불안'],
    },
    {
      name: '건국대 대학일자리플러스센터',
      kind: '진로·취업',
      address: '건국대학교 내',
      phone: '02-450-4049',
      hours: '평일 09:00–18:00',
      url: 'https://www.konkuk.ac.kr/konkuk/670',
      reason: '"공고를 보다 창을 닫음" 기록이 반복되었어요.',
      reasonShort: '진로·취업 회피 반복',
      tags: ['진로', '회피', '시작 부담'],
    },
    {
      name: '서울청년센터 광진',
      kind: '청년 종합',
      address: '광진구 아차산로 272',
      phone: '02-3409-3700',
      hours: '화–일 10:00–18:00',
      url: 'https://youth.seoul.go.kr',
      reason: '진로·생활·마음건강을 함께 확인할 수 있는 청년 종합 창구예요.',
      reasonShort: '진로+마음건강 통합 지원',
      tags: ['진로', '불안', '연결'],
    },
    {
      name: '광진구 정신건강복지센터',
      kind: '지역 정신건강',
      address: '긴고랑로 110 중곡종합건강센터 4층',
      phone: '02-450-1895',
      hours: '평일 09:00–18:00',
      url: 'https://www.hopegj.or.kr',
      reason: '비교·불안 키워드가 이번 주 상위에 있어 지역 전문 상담 후보로 올랐어요.',
      reasonShort: '비교·불안 키워드 상위',
      tags: ['비교', '불안'],
    },
    {
      name: '서울시 청년 마음건강 지원',
      kind: '서울시 (비대면 가능)',
      address: '온라인 신청',
      phone: '120 다산콜센터',
      hours: '온라인 상시',
      url: 'https://youth.seoul.go.kr',
      reason: '서울 거주 청년 대상 1:1 심리상담을 지원해요. 비대면 신청 가능합니다.',
      reasonShort: '온라인 심리상담 지원',
      tags: ['비교', '불안', '비대면'],
    },
    {
      name: '보건복지부 청년마음건강지원',
      kind: '국가 (복지로 신청)',
      address: '복지로 온라인 신청',
      phone: '129 복지로',
      hours: '온라인 상시',
      url: 'https://www.bokjiro.go.kr',
      reason: '만 19–34세 청년 대상, 10회 1:1 전문 심리상담을 무료로 지원해요.',
      reasonShort: '국가 청년 심리상담 바우처',
      tags: ['비교', '불안', '무료'],
    },
    {
      name: '정신건강 위기상담전화',
      kind: '24시간 위기 상담',
      address: '전화 상담',
      phone: '1577-0199 / 자살예방 109',
      hours: '24시간',
      url: null,
      reason: '지금 당장 힘들다면 전화 한 통이 도움이 될 수 있어요.',
      reasonShort: '즉각 지원 가능',
      tags: ['위기', '즉각'],
    },
  ],

  // 위키 성취 시스템
  wikiAchievements: {
    levelNames: ['씨앗', '새싹', '싹', '잎', '꽃', '열매'],
    categories: [
      { id: 'record', label: '기록', emoji: '📝', desc: '하루를 기록으로 남기는 힘' },
      { id: 'connect', label: '연결', emoji: '🔗', desc: '누군가와 이어지는 용기' },
      { id: 'start', label: '시작', emoji: '🌱', desc: '작은 행동을 시작하는 힘' },
      { id: 'compare', label: '비교 극복', emoji: '🌊', desc: '비교를 알아차리는 능력' },
      { id: 'help', label: '도움 요청', emoji: '💬', desc: '도움을 구하는 용기' },
    ],
    achievements: [
      // 기록 카테고리
      { id: 'r1', category: 'record', title: '한 줄의 시작', desc: '처음으로 기록을 남겼어요', current: 1, goal: 1, medal: 'bronze', xpReward: 5, status: 'achieved', achievedAt: '4.21', trigger: 'entrySubmit' },
      { id: 'r2', category: 'record', title: '일주일의 흐름', desc: '7일 기록을 채웠어요', current: 7, goal: 7, medal: 'silver', xpReward: 15, status: 'achieved', achievedAt: '4.27', trigger: 'streak7' },
      { id: 'r3', category: 'record', title: '한 달의 기억', desc: '30일 연속 기록에 도전해요', current: 7, goal: 30, medal: 'gold', xpReward: 40, status: 'in_progress', achievedAt: null, trigger: 'streak30' },
      // 연결 카테고리
      { id: 'c1', category: 'connect', title: '연결 조각', desc: '연결 관련 기록을 저장했어요', current: 1, goal: 1, medal: 'bronze', xpReward: 5, status: 'achieved', achievedAt: '4.26', trigger: 'observeSave' },
      { id: 'c2', category: 'connect', title: '대화 시도', desc: '답장·연락 기록을 5회 저장했어요', current: 2, goal: 5, medal: 'silver', xpReward: 15, status: 'in_progress', achievedAt: null, trigger: 'connectTag5' },
      { id: 'c3', category: 'connect', title: '연결의 달인', desc: '연결 태그 기록을 10회 남겼어요', current: 2, goal: 10, medal: 'gold', xpReward: 35, status: 'in_progress', achievedAt: null, trigger: 'connectTag10' },
      // 시작 카테고리
      { id: 's1', category: 'start', title: '작은 행동 완료', desc: '하루 부탁을 처음 완료했어요', current: 1, goal: 1, medal: 'bronze', xpReward: 5, status: 'achieved', achievedAt: '4.21', trigger: 'questComplete' },
      { id: 's2', category: 'start', title: '꾸준한 시도', desc: '하루 부탁을 5회 완료했어요', current: 4, goal: 5, medal: 'silver', xpReward: 15, status: 'in_progress', achievedAt: null, trigger: 'questComplete5' },
      { id: 's3', category: 'start', title: '시작의 달인', desc: '하루 부탁을 10회 완료했어요', current: 4, goal: 10, medal: 'gold', xpReward: 30, status: 'in_progress', achievedAt: null, trigger: 'questComplete10' },
      // 비교 극복 카테고리
      { id: 'cp1', category: 'compare', title: '비교를 알아차림', desc: '비교 관련 관찰 후보를 저장했어요', current: 1, goal: 1, medal: 'bronze', xpReward: 5, status: 'achieved', achievedAt: '4.27', trigger: 'compareObserve' },
      { id: 'cp2', category: 'compare', title: '이번 주 돌아보기', desc: '주간 리포트를 열람했어요', current: 1, goal: 1, medal: 'silver', xpReward: 10, status: 'achieved', achievedAt: '4.27', trigger: 'reportView' },
      { id: 'cp3', category: 'compare', title: '비교 극복 여정', desc: '비교 태그 기록을 5회 남겼어요', current: 4, goal: 5, medal: 'gold', xpReward: 25, status: 'in_progress', achievedAt: null, trigger: 'compareTag5' },
      // 도움 요청 카테고리
      { id: 'h1', category: 'help', title: '문의 준비 시작', desc: '문의문 초안을 처음 열었어요', current: 1, goal: 1, medal: 'bronze', xpReward: 5, status: 'achieved', achievedAt: '4.27', trigger: 'messageTabView' },
      { id: 'h2', category: 'help', title: '기관 정보 확인', desc: '지원 기관 정보를 열람했어요', current: 1, goal: 1, medal: 'silver', xpReward: 10, status: 'achieved', achievedAt: '4.27', trigger: 'candidateVisit' },
      { id: 'h3', category: 'help', title: '도움 요청 준비 완료', desc: '문의문에 기관을 반영했어요', current: 0, goal: 1, medal: 'gold', xpReward: 20, status: 'in_progress', achievedAt: null, trigger: 'candidateApplied' },
    ],
  },
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
