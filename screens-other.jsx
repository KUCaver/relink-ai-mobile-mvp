// History, Weekly Report, Wiki Growth, Message screens

function HistoryScreen({ state }) {
  const D = state.backendData || window.RELINK_DATA;
  const C = window.useTheme();
  const isNight = C.mode === 'night';
  return (
    <div style={{ padding: '14px 16px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing: -0.4 }}>기록 히스토리</div>
        <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 4 }}>
          저장한 기록과 위키와 함께한 흐름을 모았어요.
        </div>
      </div>

      {/* filter chips */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
        {['전체', '비교', '불안', '성장', '시작', '회피'].map((t, i) => (
          <span key={t} style={{
            padding: '7px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
            background: i === 0 ? C.blue : '#fff',
            color: i === 0 ? '#fff' : C.inkSoft,
            border: i === 0 ? 'none' : '1px solid #ECEFF6',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>{t}</span>
        ))}
      </div>

      {(D.history || []).map((h, i) => (
        <ReCard key={i} padding={14}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.blueDeep }}>{h.date}</div>
            {h.questDone ? (
              <ReChip color="#3E9B5C" bg="#E8F6EC">하루 부탁 완료</ReChip>
            ) : (
              <ReChip color="#8A93AB" bg="#F5F7FB">진행 중</ReChip>
            )}
          </div>
          <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.55, letterSpacing: -0.1 }}>
            "{h.entry}"
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {h.tags.map((t) => (
              <ReChip key={t}>#{t}</ReChip>
            ))}
          </div>
          <div style={{ marginTop: 10, padding: '8px 10px', borderRadius: 10, background: '#F8FAFD', border: '1px solid #ECEFF6', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12 }}>{h.questDone ? '✅' : '⏳'}</span>
            <div style={{ fontSize: 12, color: C.inkSoft, flex: 1 }}>
              위키 부탁 · <span style={{ color: C.ink, fontWeight: 600 }}>{h.quest}</span>
            </div>
          </div>
        </ReCard>
      ))}
    </div>
  );
}

function WeeklyReportScreen({ state }) {
  const D = state?.backendData || window.RELINK_DATA;
  const C = window.useTheme();
  const isNight = C.mode === 'night';
  const I = window.ReIcon;

  // build line chart points
  const W = 280, H = 110, PAD = 10;
  const emotionFlow = D.emotionFlow || window.RELINK_DATA.emotionFlow;
  const pts = emotionFlow.map((p, i) => {
    const x = PAD + (i * (W - PAD * 2)) / (emotionFlow.length - 1);
    const y = H - PAD - (p.v / 4) * (H - PAD * 2);
    return { x, y, ...p };
  });
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const area = `${path} L ${pts[pts.length - 1].x} ${H - PAD} L ${pts[0].x} ${H - PAD} Z`;

  return (
    <div style={{ padding: '14px 16px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing: -0.4 }}>이번 주 생활 흐름</div>
        <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 4 }}>4.21 (월) – 4.27 (일)</div>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {['7일', '14일'].map((t, i) => (
          <span key={t} style={{
            padding: '7px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
            background: i === 0 ? C.blue : '#fff', color: i === 0 ? '#fff' : C.inkSoft,
            border: i === 0 ? 'none' : '1px solid #ECEFF6',
          }}>{t}</span>
        ))}
      </div>

      <ReCard padding={16}>
        <ReSectionTitle title="핵심 키워드 TOP 3" right={<span style={{ fontSize: 11, color: C.inkMute }}>저장한 기록 기준</span>} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(D.weeklyKeywords || []).map((k, i) => (
            <div key={k.word} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: '#F8FAFD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: C.inkSoft }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>#{k.word}</span>
                  <span style={{ fontSize: 12, color: C.inkSoft }}>{k.count}회</span>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: '#F5F7FB', overflow: 'hidden' }}>
                  <div style={{ width: `${(k.count / 6) * 100}%`, height: '100%', background: k.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ReCard>

      <ReCard padding={16}>
        <ReSectionTitle title="감정 흐름" right={<span style={{ fontSize: 11, color: C.inkMute }}>가벼움 ↑ / 무거움 ↓</span>} />
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="ef-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5B6FEF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#5B6FEF" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={PAD} x2={W - PAD} y1={PAD + i * ((H - PAD * 2) / 3)} y2={PAD + i * ((H - PAD * 2) / 3)} stroke="#ECEFF6" strokeDasharray="2 3" />
          ))}
          <path d={area} fill="url(#ef-area)" />
          <path d={path} stroke="#5B6FEF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#5B6FEF" strokeWidth="2" />
            </g>
          ))}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, padding: '0 6px' }}>
          {emotionFlow.map((p) => (
            <span key={p.day} style={{ fontSize: 11, color: C.inkSoft }}>{p.day}</span>
          ))}
        </div>
      </ReCard>

      <ReCard padding={16}>
        <ReSectionTitle title="자주 쓴 표현" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(D.repeatedPhrases || []).map((p, i) => (
            <ReChip key={`${p}-${i}`} color="#8C5A20" bg="#FFF6EC">"{p}"</ReChip>
          ))}
        </div>
      </ReCard>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <ReCard padding={14}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 8 }}>자주 멈춘 행동</div>
          {(D.pausedActions || []).map((a, i) => (
            <div key={`${a}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0', fontSize: 12.5, color: C.inkSoft }}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: '#F5A86B' }} />
              {a}
            </div>
          ))}
        </ReCard>
        <ReCard padding={14}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 8 }}>가능했던 행동</div>
          {(D.possibleActions || []).map((a, i) => (
            <div key={`${a}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0', fontSize: 12.5, color: C.inkSoft }}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: C.green }} />
              {a}
            </div>
          ))}
        </ReCard>
      </div>

      <ReCard padding={16} style={{ background: 'linear-gradient(135deg, #EEF1FE 0%, #F8FAFD 100%)', border: '1px solid #DCE2FB' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.blueDeep, marginBottom: 6, letterSpacing: 0.4, textTransform: 'uppercase' }}>이번 주 나에게</div>
        <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.65, letterSpacing: -0.1 }}>
          스스로를 더 믿고 싶은 마음이 커졌어요. 작은 성공 경험이 자신감을 키워줄 거예요.
        </div>
      </ReCard>

      <div style={{ fontSize: 11, color: C.inkMute, textAlign: 'center', padding: '4px 12px', lineHeight: 1.6 }}>
        이번 주 기록은 진단이 아니라, {window.RELINK_DATA.userName}님이 직접 확인한 생활 흐름이에요.
      </div>
    </div>
  );
}

function WikiGrowthScreen({ state }) {
  const D = state.backendData || window.RELINK_DATA;
  const C = window.useTheme();
  const isNight = C.mode === 'night';

  return (
    <div style={{ padding: '14px 16px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing: -0.4 }}>위키 성장</div>
        <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 4 }}>
          위키는 작은 기록과 시도로 천천히 자라요.
        </div>
      </div>

      {/* big mascot card */}
      <ReCard padding={20} style={{ background: 'linear-gradient(180deg, #F2F4FB 0%, #FFFFFF 60%)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
          <WikiMascot size={150} mood="happy" />
        </div>
        <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 4 }}>위키 · 새싹 단계</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.blueDeep, letterSpacing: -0.4, marginTop: 4 }}>Lv.{D.wikiLevel}</div>
        <div style={{ maxWidth: 240, margin: '12px auto 6px' }}>
          <ReProgressBar value={D.xp} max={D.maxXp} height={10} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11.5, color: C.inkSoft }}>
            <span>{D.xp} / {D.maxXp} XP</span>
            <span>다음 레벨까지 25 XP</span>
          </div>
        </div>
      </ReCard>

      <ReCard padding={16}>
        <ReSectionTitle title="기억 조각" right={<ReChip color="#3E9B5C" bg="#E8F6EC">4개 모음</ReChip>} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {(D.memoryFragments || []).map((m) => (
            <div key={m.name} style={{ padding: 12, borderRadius: 14, background: '#F8FAFD', border: '1px solid #ECEFF6' }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{m.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{m.name}</div>
              <div style={{ fontSize: 11, color: C.inkSoft, marginTop: 3, lineHeight: 1.5 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </ReCard>

      <ReCard padding={16}>
        <ReSectionTitle title="위키에게 줄 먹이" right={<span style={{ fontSize: 11, color: C.inkMute }}>조각으로 교환</span>} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {D.wikiFoods.map((f) => (
            <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 12, background: '#F8FAFD', border: '1px solid #ECEFF6' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: '1px solid #ECEFF6' }}>{f.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{f.name}</div>
                <div style={{ fontSize: 11, color: C.inkSoft }}>{f.cost}</div>
              </div>
              <button style={{ padding: '7px 12px', borderRadius: 999, background: '#EEF1FE', color: C.blueDeep, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>주기</button>
            </div>
          ))}
        </div>
      </ReCard>

      <div style={{ fontSize: 11, color: C.inkMute, textAlign: 'center', padding: '4px 12px', lineHeight: 1.6 }}>
        Re:Link는 타인과 비교하거나 줄 세우지 않아요. 위키는 오직 {D.userName}님의 흐름을 따라 자라요.
      </div>
    </div>
  );
}

function normalizeSupportToken(value) {
  return String(value || '').replace(/[#\s·/_-]/g, '').toLowerCase();
}

function collectSupportSignals(D) {
  const signals = [];
  const savedIds = D.savedObservationIds || [];
  const observations = D.observationCandidates || [];
  const savedObservations = savedIds.length
    ? observations.filter((o) => savedIds.includes(o.id))
    : [];

  savedObservations.forEach((o) => {
    signals.push(o.tag, o.label, o.saveLabel, o.source);
  });

  (D.messageSources || []).forEach((s) => {
    signals.push(s.tag, s.txt);
  });

  (D.weeklyKeywords || []).forEach((k) => signals.push(k.word));
  (D.pausedActions || []).forEach((a) => signals.push(a));
  (D.history || []).slice(0, 4).forEach((h) => {
    (h.tags || []).forEach((t) => signals.push(t));
    signals.push(h.quest, h.entry);
  });

  return Array.from(new Set(signals.filter(Boolean)));
}

function buildSupportCandidates(D) {
  const candidates = D.supportCandidates || window.RELINK_DATA.supportCandidates || [];
  const signals = collectSupportSignals(D);
  const signalTokens = signals.map(normalizeSupportToken).filter(Boolean);

  const scored = candidates.map((candidate) => {
    const whyMatched = (candidate.triggerTags || []).filter((tag) => {
      const tagToken = normalizeSupportToken(tag);
      return signalTokens.some((signal) => signal.includes(tagToken) || tagToken.includes(signal));
    });

    return {
      ...candidate,
      whyMatched,
      score: whyMatched.length * 10 + (candidate.priority || 0),
    };
  });

  const matched = scored.filter((candidate) => candidate.whyMatched.length > 0);
  if (matched.length > 0) {
    return matched.sort((a, b) => b.score - a.score).slice(0, 4);
  }

  return scored
    .filter((candidate) => ['campus-local-counsel', 'youth-local-support'].includes(candidate.id))
    .map((candidate) => ({ ...candidate, whyMatched: ['기본 문의 후보', '저장한 조각이 더 쌓이면 더 좁혀져요'] }));
}

function MessageScreen({ state, onToast }) {
  const D = state.backendData || window.RELINK_DATA;
  const C = window.useTheme();
  const isNight = C.mode === 'night';
  const I = window.ReIcon;
  const [draft, setDraft] = React.useState(D.messageDraft);
  const [copied, setCopied] = React.useState(false);
  const supportCandidates = React.useMemo(() => buildSupportCandidates(D), [D]);
  const lightCardInk = '#1B2240';
  const lightCardSoft = '#5A6585';
  const lightCardBlue = '#5B6FEF';

  React.useEffect(() => {
    setDraft(D.messageDraft);
  }, [D.messageDraft]);

  const onCopy = () => {
    setCopied(true);
    onToast('복사됐어요.');
    setTimeout(() => setCopied(false), 1800);
  };

  const regenerate = async () => {
    const result = await window.ReLinkApi.regenerateMessageDraft();
    setDraft(result.draft || result.data?.messageDraft || draft);
    onToast('저장한 조각 기준으로 다시 만들었어요.');
  };

  const addCandidateToDraft = (candidate) => {
    const line = `추가로, ${candidate.name}에서 비대면 초기상담이나 가능한 지원 경로를 안내받을 수 있는지도 확인하고 싶습니다.`;
    setDraft((current) => {
      if (current.includes(candidate.name)) return current;
      return `${current.trim()}\n\n확인하고 싶은 지원 경로: ${line}`;
    });
    onToast('문의문 초안에 지원 후보를 반영했어요.');
  };

  return (
    <div style={{ padding: '14px 16px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing: -0.4 }}>상담·지원 문의 준비</div>
        <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 4, lineHeight: 1.55 }}>
          저장한 기록을 바탕으로 만든 초안과 문의 후보예요. 보내기 전 직접 수정할 수 있어요.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 12px', borderRadius: 14, background: '#FFF6EC', border: '1px solid #FBE6CB' }}>
        {I.lock('#C77A1F', 14)}
        <div style={{ fontSize: 12, color: '#8C5A20', lineHeight: 1.5, fontWeight: 600 }}>
          Re:Link는 상담기관에 자동으로 전송하지 않아요. 지원 여부를 판단하지 않고, 문의 준비를 도와요.
        </div>
      </div>

      <ReCard padding={14}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>상담 전 문의문</div>
          <button onClick={regenerate} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 999, background: '#F5F7FB', border: '1px solid #ECEFF6', color: C.inkSoft, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
            {I.refresh()} 다시 생성
          </button>
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          style={{
            width: '100%', minHeight: 220, border: '1px solid #ECEFF6', borderRadius: 12,
            padding: 12, fontSize: 13.5, lineHeight: 1.65, color: lightCardInk, background: '#F8FAFD',
            resize: 'vertical', outline: 'none', fontFamily: 'inherit', letterSpacing: -0.1,
            boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <RePillButton variant="primary" style={{ flex: 1 }} icon={I.copy('#fff')} onClick={onCopy}>
            {copied ? '복사됐어요' : '복사하기'}
          </RePillButton>
          <RePillButton variant="ghost" style={{ flex: 1 }} icon={I.pdf()}>PDF로 저장</RePillButton>
        </div>
      </ReCard>

      <ReCard padding={14}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>문의 가능한 지원 후보</div>
            <div style={{ fontSize: 11.5, color: C.inkSoft, lineHeight: 1.55, marginTop: 4 }}>
              저장한 기록에서 반복된 흐름을 바탕으로, 먼저 확인해볼 수 있는 상담·지원 경로예요.
              지원 대상 여부는 각 기관에서 최종 확인해야 해요.
            </div>
          </div>
          <ReChip color="#5A6585" bg="#F5F7FB">후보 {supportCandidates.length}</ReChip>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {supportCandidates.map((candidate, index) => (
            <div key={candidate.id} style={{ padding: 12, borderRadius: 14, background: '#F8FAFD', border: '1px solid #ECEFF6' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: 9, background: '#EEF1FE', color: lightCardBlue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: lightCardInk, lineHeight: 1.35 }}>{candidate.name}</div>
                  <div style={{ fontSize: 12, color: lightCardSoft, lineHeight: 1.55, marginTop: 5 }}>{candidate.description}</div>
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: lightCardInk, marginBottom: 6 }}>왜 떴나요?</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(candidate.whyMatched || []).slice(0, 4).map((tag) => (
                    <ReChip key={`${candidate.id}-${tag}`} color={lightCardBlue} bg="#EEF1FE">#{tag}</ReChip>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: lightCardInk, marginBottom: 5 }}>문의할 때 물어볼 것</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {(candidate.questionsToAsk || []).slice(0, 3).map((q) => (
                    <div key={`${candidate.id}-${q}`} style={{ display: 'flex', gap: 6, fontSize: 11.5, color: lightCardSoft, lineHeight: 1.45 }}>
                      <span style={{ color: C.green, fontWeight: 800 }}>·</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 10, padding: '8px 10px', borderRadius: 10, background: '#FFFDF7', border: '1px solid #FBE6CB', fontSize: 11, color: '#8C5A20', lineHeight: 1.45 }}>
                {candidate.caution}
              </div>

              <button
                type="button"
                onClick={() => addCandidateToDraft(candidate)}
                style={{ marginTop: 10, width: '100%', padding: '9px 12px', borderRadius: 12, background: '#EEF1FE', color: lightCardBlue, border: '1px solid #DCE2FB', fontSize: 12.5, fontWeight: 800, cursor: 'pointer' }}
              >
                문의문에 반영
              </button>
            </div>
          ))}
        </div>
      </ReCard>

      <ReCard padding={14}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 8 }}>이 추천은 어디에서 왔을까?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(D.messageSources || [
            { tag: '기억 조각', txt: '저장한 관찰 후보가 생기면 이곳에 표시돼요.' },
          ]).map((s) => (
            <div key={s.tag} style={{ display: 'flex', gap: 10, padding: 10, borderRadius: 12, background: '#F8FAFD', border: '1px solid #ECEFF6' }}>
              <ReChip>{s.tag}</ReChip>
              <div style={{ flex: 1, fontSize: 12, color: lightCardSoft, lineHeight: 1.55 }}>{s.txt}</div>
            </div>
          ))}
        </div>
      </ReCard>

      <div style={{ fontSize: 11, color: C.inkMute, textAlign: 'center', padding: '4px 12px', lineHeight: 1.6 }}>
        이 문의문과 지원 후보는 진단이나 자격 판단이 아니에요. {D.userName}님이 직접 검토하고 보내요.
      </div>
    </div>
  );
}

window.HistoryScreen = HistoryScreen;
window.WeeklyReportScreen = WeeklyReportScreen;
window.WikiGrowthScreen = WikiGrowthScreen;
window.MessageScreen = MessageScreen;
