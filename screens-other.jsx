// History, Weekly Report, Message screens
// WikiGrowthScreen moved to screens-wiki.jsx

function HistoryScreen({ state }) {
  const D = window.RELINK_DATA;
  const C = window.useTheme();
  const isNight = C.mode === 'night';

  const [activeTag, setActiveTag] = React.useState('전체');
  const [activePeriod, setActivePeriod] = React.useState('7일');
  const [showCustom, setShowCustom] = React.useState(false);
  const [customRange, setCustomRange] = React.useState('');

  const periodSlice = activePeriod === '7일' ? 7 : 14;
  const byPeriod = D.history.slice(0, periodSlice);
  const filtered = activeTag === '전체'
    ? byPeriod
    : byPeriod.filter((h) => h.tags.includes(activeTag));

  const chipStyle = (active) => ({
    padding: '7px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
    background: active ? C.blue : (isNight ? 'rgba(255,255,255,0.06)' : '#fff'),
    color: active ? '#fff' : C.inkSoft,
    border: active ? 'none' : `1px solid ${isNight ? 'rgba(250,247,240,0.10)' : '#ECEFF6'}`,
    whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer',
  });

  return (
    <div style={{ padding: '14px 16px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing: -0.4 }}>기록 히스토리</div>
        <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 4 }}>
          저장한 기록과 위키와 함께한 흐름을 모았어요.
        </div>
      </div>

      {/* 기간 필터 */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
        {['7일', '14일', '1달'].map((p) => (
          <span
            key={p}
            onClick={() => { setActivePeriod(p); setShowCustom(false); }}
            style={chipStyle(activePeriod === p && !showCustom)}
          >{p}</span>
        ))}
        <span
          onClick={() => setShowCustom((v) => !v)}
          style={chipStyle(showCustom)}
        >직접 입력</span>
      </div>

      {showCustom && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            value={customRange}
            onChange={(e) => setCustomRange(e.target.value)}
            placeholder="YY.MM.DD ~ YY.MM.DD"
            style={{
              flex: 1, padding: '8px 12px', borderRadius: 10, fontSize: 12.5,
              border: `1px solid ${isNight ? 'rgba(250,247,240,0.18)' : '#ECEFF6'}`,
              background: isNight ? 'rgba(255,255,255,0.06)' : '#F8FAFD',
              color: C.ink, outline: 'none', fontFamily: 'inherit',
            }}
          />
          <span style={{ fontSize: 11, color: C.inkMute }}>MVP 샘플 기준</span>
        </div>
      )}

      {activePeriod === '1달' && !showCustom && (
        <div style={{ fontSize: 11, color: C.inkMute, padding: '2px 4px' }}>
          MVP에서는 최근 14일 샘플 기준으로 표시됩니다.
        </div>
      )}

      {/* 키워드 필터 */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
        {['전체', '비교', '불안', '성장', '시작', '회피'].map((t) => (
          <span
            key={t}
            onClick={() => setActiveTag(t)}
            style={chipStyle(activeTag === t)}
          >{t}</span>
        ))}
      </div>

      {/* 결과 카운트 */}
      {activeTag !== '전체' && (
        <div style={{ fontSize: 11.5, color: C.inkSoft }}>
          <span style={{ fontWeight: 700, color: C.blue }}>#{activeTag}</span> 기록 {filtered.length}개
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: C.inkMute, fontSize: 13 }}>
          해당 기간에 <span style={{ fontWeight: 700 }}>#{activeTag}</span> 기록이 없어요.
        </div>
      ) : (
        filtered.map((h, i) => (
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
                <ReChip key={t} color={t === activeTag && activeTag !== '전체' ? C.blueDeep : undefined} bg={t === activeTag && activeTag !== '전체' ? C.blueSoft : undefined}>
                  #{t}
                </ReChip>
              ))}
            </div>
            <div style={{ marginTop: 10, padding: '8px 10px', borderRadius: 10, background: isNight ? 'rgba(255,255,255,0.05)' : '#F8FAFD', border: `1px solid ${isNight ? 'rgba(250,247,240,0.10)' : '#ECEFF6'}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12 }}>{h.questDone ? '✅' : '⏳'}</span>
              <div style={{ fontSize: 12, color: C.inkSoft, flex: 1 }}>
                위키 부탁 · <span style={{ color: C.ink, fontWeight: 600 }}>{h.quest}</span>
              </div>
            </div>
          </ReCard>
        ))
      )}
    </div>
  );
}

function WeeklyReportScreen() {
  const D = window.RELINK_DATA;
  const C = window.useTheme();
  const isNight = C.mode === 'night';

  const [activePeriod, setActivePeriod] = React.useState('7일');
  const [showCustom, setShowCustom] = React.useState(false);
  const [customRange, setCustomRange] = React.useState('');

  const RD = D.reportData[activePeriod];

  // build line chart points
  const W = 280, H = 110, PAD = 10;
  const pts = RD.emotionFlow.map((p, i) => {
    const x = PAD + (i * (W - PAD * 2)) / (RD.emotionFlow.length - 1);
    const y = H - PAD - (p.v / 4) * (H - PAD * 2);
    return { x, y, ...p };
  });
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const area = `${path} L ${pts[pts.length - 1].x} ${H - PAD} L ${pts[0].x} ${H - PAD} Z`;

  const chipStyle = (active) => ({
    padding: '7px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
    background: active ? C.blue : (isNight ? 'rgba(255,255,255,0.06)' : '#fff'),
    color: active ? '#fff' : C.inkSoft,
    border: active ? 'none' : `1px solid ${isNight ? 'rgba(250,247,240,0.10)' : '#ECEFF6'}`,
  });

  return (
    <div style={{ padding: '14px 16px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing: -0.4 }}>생활 흐름 리포트</div>
        <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 4 }}>{RD.dateLabel}</div>
      </div>

      {/* 기간 선택 */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['7일', '14일', '1달'].map((p) => (
          <span
            key={p}
            onClick={() => { setActivePeriod(p); setShowCustom(false); }}
            style={chipStyle(activePeriod === p && !showCustom)}
          >{p}</span>
        ))}
        <span
          onClick={() => setShowCustom((v) => !v)}
          style={chipStyle(showCustom)}
        >직접 입력</span>
      </div>

      {showCustom && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            value={customRange}
            onChange={(e) => setCustomRange(e.target.value)}
            placeholder="YY.MM.DD ~ YY.MM.DD"
            style={{
              flex: 1, padding: '8px 12px', borderRadius: 10, fontSize: 12.5,
              border: `1px solid ${isNight ? 'rgba(250,247,240,0.18)' : '#ECEFF6'}`,
              background: isNight ? 'rgba(255,255,255,0.06)' : '#F8FAFD',
              color: C.ink, outline: 'none', fontFamily: 'inherit',
            }}
          />
          <span style={{ fontSize: 11, color: C.inkMute }}>MVP 샘플 기준</span>
        </div>
      )}

      <ReCard padding={16}>
        <ReSectionTitle title="핵심 키워드 TOP 3" right={<span style={{ fontSize: 11, color: C.inkMute }}>저장한 기록 기준</span>} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {RD.weeklyKeywords.map((k, i) => (
            <div key={k.word} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: isNight ? 'rgba(255,255,255,0.06)' : '#F8FAFD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: C.inkSoft }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>#{k.word}</span>
                  <span style={{ fontSize: 12, color: C.inkSoft }}>{k.count}회</span>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: '#F5F7FB', overflow: 'hidden' }}>
                  <div style={{ width: `${(k.count / (RD.weeklyKeywords[0].count || 1)) * 100}%`, height: '100%', background: k.color }} />
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
          {RD.emotionFlow.map((p) => (
            <span key={p.day} style={{ fontSize: 11, color: C.inkSoft }}>{p.day}</span>
          ))}
        </div>
      </ReCard>

      <ReCard padding={16}>
        <ReSectionTitle title="자주 쓴 표현" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {RD.repeatedPhrases.map((p) => (
            <ReChip key={p} color="#8C5A20" bg="#FFF6EC">"{p}"</ReChip>
          ))}
        </div>
      </ReCard>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <ReCard padding={14}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 8 }}>자주 멈춘 행동</div>
          {RD.pausedActions.map((a) => (
            <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0', fontSize: 12.5, color: C.inkSoft }}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: '#F5A86B' }} />
              {a}
            </div>
          ))}
        </ReCard>
        <ReCard padding={14}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 8 }}>가능했던 행동</div>
          {RD.possibleActions.map((a) => (
            <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0', fontSize: 12.5, color: C.inkSoft }}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: C.green }} />
              {a}
            </div>
          ))}
        </ReCard>
      </div>

      <ReCard padding={16} style={{ background: isNight ? 'linear-gradient(135deg, rgba(91,111,239,0.15) 0%, rgba(91,111,239,0.05) 100%)' : 'linear-gradient(135deg, #EEF1FE 0%, #F8FAFD 100%)', border: `1px solid ${isNight ? 'rgba(154,174,255,0.20)' : '#DCE2FB'}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.blueDeep, marginBottom: 6, letterSpacing: 0.4, textTransform: 'uppercase' }}>이번 기간 나에게</div>
        <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.65, letterSpacing: -0.1 }}>
          {RD.message}
        </div>
      </ReCard>

      <div style={{ fontSize: 11, color: C.inkMute, textAlign: 'center', padding: '4px 12px', lineHeight: 1.6 }}>
        이 기록은 진단이 아니라, {window.RELINK_DATA.userName}님이 직접 확인한 생활 흐름이에요.
      </div>
    </div>
  );
}

function MessageScreen({ state, onToast }) {
  const D = window.RELINK_DATA;
  const C = window.useTheme();
  const isNight = C.mode === 'night';
  const I = window.ReIcon;

  const [selected, setSelected] = React.useState(new Set());
  const [draftCustomized, setDraftCustomized] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const buildInquiryDraft = React.useCallback((candidateNames) => {
    if (candidateNames.length === 0) return D.messageDraft;
    const candidates = candidateNames
      .map((n) => D.supportCandidates.find((sc) => sc.name === n))
      .filter(Boolean);

    const institutionList = candidates.map((c) => `• ${c.name} (${c.kind})`).join('\n');
    const reasonList = candidates.map((c) => `• ${c.reason}`).join('\n');
    const sourceList = D.messageSources.map((s) => `• [${s.tag}] ${s.txt}`).join('\n');

    return [
      '안녕하세요.',
      '',
      '[문의 희망 기관]',
      institutionList,
      '',
      '[기관을 선택한 이유]',
      reasonList,
      '',
      '[관련 기록 근거]',
      sourceList,
      '',
      '[확인하고 싶은 내용]',
      '1. 현재 상황에서 상담 신청이 가능한지',
      '2. 온라인/전화/방문 중 어떤 방식이 적합한지',
      '3. 상담 전 준비해야 할 내용이 있는지',
      '4. 해당 기관이 적합하지 않다면 어느 기관으로 문의하면 되는지',
    ].join('\n');
  }, []);

  const [draft, setDraft] = React.useState(D.messageDraft);

  const toggleSelect = (candidate) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(candidate.name)) {
        next.delete(candidate.name);
      } else {
        next.add(candidate.name);
      }
      if (!draftCustomized) {
        setDraft(buildInquiryDraft([...next]));
      }
      return next;
    });
  };

  const regenerateDraft = () => {
    setDraft(buildInquiryDraft([...selected]));
    setDraftCustomized(false);
  };

  const onCopy = () => {
    setCopied(true);
    onToast('복사됐어요.');
    setTimeout(() => setCopied(false), 1800);
  };

  const handleVisit = (s) => {
    if (s.url) {
      window.open(s.url, '_blank', 'noopener,noreferrer');
    } else {
      onToast(`전화 문의: ${s.phone}`);
    }
  };

  return (
    <div style={{ padding: '14px 16px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing: -0.4 }}>상담·지원 문의 준비</div>
        <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 4, lineHeight: 1.55 }}>
          저장한 기록을 바탕으로 만든 초안이에요. 직접 수정해서 사용해요.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 14, background: '#FFF6EC', border: '1px solid #FBE6CB' }}>
        <div style={{ marginTop: 1 }}>{I.lock('#C77A1F', 14)}</div>
        <div style={{ fontSize: 12, color: '#8C5A20', lineHeight: 1.55, fontWeight: 600 }}>
          Re:Link는 상담기관에 자동으로 전송하지 않아요.<br />
          지원 여부를 판단하지 않고, 문의 준비를 도와요.
        </div>
      </div>

      <ReCard padding={14}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: selected.size > 0 && draftCustomized ? 6 : 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>문의문 초안</div>
          <button
            onClick={regenerateDraft}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 999, background: isNight ? 'rgba(255,255,255,0.06)' : '#F5F7FB', border: `1px solid ${isNight ? 'rgba(250,247,240,0.10)' : '#ECEFF6'}`, color: C.inkSoft, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
            {I.refresh()} 다시 생성
          </button>
        </div>

        {/* 수동 수정 후 기관 변경 시 경고 배너 */}
        {draftCustomized && selected.size > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 10, background: '#FFF8E6', border: '1px solid #F5D78E', marginBottom: 10 }}>
            <span style={{ fontSize: 11.5, color: '#8C6A0A', fontWeight: 600 }}>기관 선택이 변경됐어요.</span>
            <button
              onClick={regenerateDraft}
              style={{ fontSize: 11, fontWeight: 700, color: '#5B6FEF', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}>
              초안 다시 생성
            </button>
          </div>
        )}

        <textarea
          value={draft}
          onChange={(e) => { setDraft(e.target.value); setDraftCustomized(true); }}
          style={{
            width: '100%', minHeight: 220, border: `1px solid ${isNight ? 'rgba(250,247,240,0.15)' : '#ECEFF6'}`, borderRadius: 12,
            padding: 12, fontSize: 13.5, lineHeight: 1.65, color: C.ink, background: isNight ? '#1C1830' : '#F8FAFD',
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>문의 가능한 지원 후보</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {selected.size > 0 && (
              <span style={{ fontSize: 11.5, fontWeight: 700, color: C.blueDeep, background: C.blueSoft, padding: '2px 8px', borderRadius: 999 }}>
                반영된 기관 {selected.size}개
              </span>
            )}
            <span style={{ fontSize: 11, color: C.inkMute }}>최종 확인은 각 기관에서</span>
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 10, lineHeight: 1.5 }}>
          📍 {D.userAddress} 주변 기관이에요.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(D.supportCandidates || []).map((s) => {
            const isSelected = selected.has(s.name);
            return (
              <div key={s.name} style={{
                padding: 12, borderRadius: 14,
                background: isSelected
                  ? (isNight ? 'rgba(90,110,240,0.12)' : '#F0F2FF')
                  : (isNight ? 'rgba(255,255,255,0.05)' : '#F8FAFD'),
                border: isSelected
                  ? `2px solid ${C.blue}`
                  : `1px solid ${isNight ? 'rgba(250,247,240,0.10)' : '#ECEFF6'}`,
                transition: 'all 0.18s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: C.ink, letterSpacing: -0.1 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: C.inkSoft, marginTop: 2 }}>{s.kind} · {s.hours}</div>
                    {s.address !== '온라인 신청' && s.address !== '복지로 온라인 신청' && s.address !== '전화 상담' && (
                      <div style={{ fontSize: 11, color: C.inkMute, marginTop: 1 }}>📍 {s.address}</div>
                    )}
                    <div style={{ fontSize: 11, color: C.inkMute, marginTop: 1 }}>📞 {s.phone}</div>
                  </div>
                </div>

                {/* 왜 떴나요 박스 */}
                <div style={{
                  marginTop: 10, padding: '8px 10px', borderRadius: 10,
                  background: isNight ? 'rgba(255,255,255,0.04)' : '#fff',
                  border: `1px dashed ${isNight ? 'rgba(250,247,240,0.15)' : '#D6DBEB'}`,
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: C.inkMute, letterSpacing: 0.3, marginTop: 1, flexShrink: 0 }}>왜 떴나요?</span>
                  <div style={{ flex: 1, fontSize: 11.5, color: C.inkSoft, lineHeight: 1.5, letterSpacing: -0.1 }}>
                    {s.reason}
                  </div>
                </div>

                {/* 태그 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                  {s.tags.map((t) => (
                    <span key={t} style={{ fontSize: 10.5, fontWeight: 600, color: C.inkSoft, padding: '2px 7px', borderRadius: 999, background: isNight ? 'rgba(255,255,255,0.06)' : '#fff', border: `1px solid ${isNight ? 'rgba(250,247,240,0.10)' : '#ECEFF6'}` }}>#{t}</span>
                  ))}
                </div>

                {/* 버튼 행 */}
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button
                    onClick={() => toggleSelect(s)}
                    style={{
                      flex: 1, padding: '7px 10px', borderRadius: 999,
                      background: isSelected ? C.blue : (isNight ? 'rgba(91,111,239,0.15)' : '#EEF1FE'),
                      color: isSelected ? '#fff' : C.blueDeep,
                      fontSize: 11.5, fontWeight: 700,
                      border: `1px solid ${isSelected ? C.blue : (isNight ? 'rgba(154,174,255,0.20)' : '#DCE2FB')}`,
                      cursor: 'pointer', transition: 'all 0.15s ease',
                    }}>
                    {isSelected ? '✓ 반영됨' : '문의문에 반영'}
                  </button>
                  <button
                    onClick={() => handleVisit(s)}
                    style={{
                      flex: 1, padding: '7px 10px', borderRadius: 999,
                      background: isNight ? 'rgba(255,255,255,0.06)' : '#F5F7FB',
                      color: C.inkSoft,
                      fontSize: 11.5, fontWeight: 700,
                      border: `1px solid ${isNight ? 'rgba(250,247,240,0.10)' : '#ECEFF6'}`,
                      cursor: 'pointer',
                    }}>
                    {s.url ? '기관 바로가기 →' : '📞 전화 문의'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </ReCard>

      <ReCard padding={14}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 8 }}>이 문장은 어디에서 왔을까?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {D.messageSources.map((s) => (
            <div key={s.tag} style={{ display: 'flex', gap: 10, padding: 10, borderRadius: 12, background: isNight ? 'rgba(255,255,255,0.05)' : '#F8FAFD', border: `1px solid ${isNight ? 'rgba(250,247,240,0.10)' : '#ECEFF6'}` }}>
              <ReChip>{s.tag}</ReChip>
              <div style={{ flex: 1, fontSize: 12, color: C.inkSoft, lineHeight: 1.55 }}>{s.txt}</div>
            </div>
          ))}
        </div>
      </ReCard>

      <div style={{ fontSize: 11, color: C.inkMute, textAlign: 'center', padding: '4px 12px', lineHeight: 1.6 }}>
        이 문의문은 진단이 아니에요. {D.userName}님이 직접 검토하고 보내요.
      </div>
    </div>
  );
}

window.HistoryScreen = HistoryScreen;
window.WeeklyReportScreen = WeeklyReportScreen;
window.MessageScreen = MessageScreen;
