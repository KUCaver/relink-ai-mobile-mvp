// HomeScreen — vertical scroll hub for Re:Link

function HomeScreen({ onToast, onNavigate, state, setState }) {
  const D = state.backendData || window.RELINK_DATA;
  const C = window.useTheme();
  const I = window.ReIcon;

  const mode = C.mode;
  const isNight = mode === 'night';
  const setModeOverride = C.setMode;

  const {
    entryText, entrySubmitted, observed, expandedReasons, questDone, savedCount, apiBusy,
  } = state;

  const setEntry = (v) => setState((current) => ({ ...current, entryText: v }));
  const submitEntry = async () => {
    if (!entryText.trim()) return;
    setState((current) => ({ ...current, apiBusy: true }));
    try {
      const result = await window.ReLinkApi.submitEntry({ text: entryText.trim() });
      const nextData = result.data || D;
      const nextObserved = Object.fromEntries((nextData.observationCandidates || []).slice(0, 3).map((o) => [o.id, true]));
      setState((current) => ({
        ...current,
        entrySubmitted: true,
        observed: nextObserved,
        expandedReasons: { [nextData.observationCandidates?.[1]?.id || 'o2']: true },
        questDone: false,
        savedCount: 0,
        shardsCount: nextData.shardsCount || current.shardsCount,
        backendData: nextData,
        apiBusy: false,
      }));
      onToast('기록을 서버 흐름에 연결했어요.');
    } catch (error) {
      setState((current) => ({ ...current, apiBusy: false }));
      onToast('연결 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.');
      console.error(error);
    }
  };
  const toggleObs = (id) => {
    const next = { ...observed, [id]: !observed[id] };
    setState((current) => ({ ...current, observed: next }));
  };
  const toggleReason = (id) => {
    const next = { ...expandedReasons, [id]: !expandedReasons[id] };
    setState((current) => ({ ...current, expandedReasons: next }));
  };
  const saveSelected = async () => {
    const ids = (D.observationCandidates || []).filter((o) => observed[o.id]).map((o) => o.id);
    const count = ids.length;
    if (count === 0) {
      onToast('하나 이상 선택해 주세요.');
      return;
    }
    setState((current) => ({ ...current, apiBusy: true }));
    try {
      const result = await window.ReLinkApi.saveObservations({ ids });
      setState((current) => ({
        ...current,
        savedCount: count,
        backendData: result.data || current.backendData,
        shardsCount: result.data?.shardsCount || current.shardsCount,
        apiBusy: false,
      }));
      onToast(`관찰 후보 ${count}개를 저장하고 리포트/문의문에 연결했어요.`);
    } catch (error) {
      setState((current) => ({ ...current, apiBusy: false }));
      onToast('저장 연결에 실패했어요.');
      console.error(error);
    }
  };
  const completeQuest = async () => {
    setState((current) => ({ ...current, apiBusy: true }));
    try {
      const result = await window.ReLinkApi.completeQuest();
      setState((current) => ({
        ...current,
        questDone: true,
        backendData: result.data || current.backendData,
        shardsCount: result.data?.shardsCount || current.shardsCount,
        apiBusy: false,
      }));
      onToast('하루 부탁 완료가 기록/리포트에 연결됐어요.');
    } catch (error) {
      setState((current) => ({ ...current, apiBusy: false }));
      onToast('하루 부탁 저장에 실패했어요.');
      console.error(error);
    }
  };

  const selectedCount = (D.observationCandidates || []).filter((o) => observed[o.id]).length;

  return (
    <div style={{ padding: '14px 16px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 2px 2px' }}>
        <div>
          <div style={{ fontSize: 19, fontWeight: 700, color: C.ink, letterSpacing: -0.3 }}>
            {isNight ? '오늘도 잘 다녀왔어요' : '좋은 아침이에요'}, <span style={{ color: C.blue }}>{D.userName}님</span>
          </div>
          <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>
            {isNight ? '위키와 함께 오늘을 정리해볼까요?' : '위키가 작은 부탁을 준비했어요.'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* day/night toggle */}
          <div style={{ display: 'flex', background: '#fff', borderRadius: 999, padding: 3, border: '1px solid #ECEFF6' }}>
            {[{ id: 'day', label: '☀️' }, { id: 'night', label: '🌙' }].map((t) => {
              const sel = mode === t.id;
              return (
                <button key={t.id} onClick={() => setModeOverride(t.id)} style={{
                  width: 28, height: 26, borderRadius: 999, border: 'none',
                  background: sel ? (t.id === 'night' ? '#1B2350' : '#FFE6A8') : 'transparent',
                  color: sel && t.id === 'night' ? '#fff' : '#1B2240',
                  fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{t.label}</button>
              );
            })}
          </div>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: 'linear-gradient(135deg, #DCE2FB, #EEF1FE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: C.blueDeep, border: '1px solid #ECEFF6' }}>지</div>
        </div>
      </div>

      {/* Garden hero */}
      <WikiRoomScene
        mode={mode}
        wikiMessage={questDone
          ? `오늘 부탁 들어줘서 고마워!\n빛 조각 ✨2개 보태줄게.`
          : isNight
            ? `오늘은 부담 없이 하나만 해보자.\n"${D.dailyQuest.title}"\n해주면 ✨2개 줄게!`
            : `좋은 아침! 오늘은\n"${D.dailyQuest.title}"\n어때? 완료하면 ✨2개야!`}
        recorded={entrySubmitted}
        questDone={questDone}
        shardsCount={D.shardsCount || state.shardsCount || 5}
        streakDays={D.streakDays}
        level={D.wikiLevel}
        unread={2}
        clock={isNight ? '22:30' : '09:32'}
        onTapDiary={() => {
          const el = document.getElementById('record-card');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        onTapShards={() => {
          const el = document.getElementById('record-card');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          onToast('정원의 빛 조각을 보고 있어요.');
        }}
        onTapChest={() => onNavigate('message')}
        onTapPlant={() => onNavigate('wiki')}
        onTapShop={() => onNavigate('shop')}
        onToggleLamp={() => setModeOverride(isNight ? 'day' : 'night')}
      />

      {/* Streak ribbon */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 14px', borderRadius: 16, background: 'linear-gradient(90deg, #FFF6EC 0%, #FFFDF7 100%)', border: '1px solid #FBE6CB' }}>
        <span style={{ fontSize: 18 }}>🔥</span>
        <div style={{ flex: 1, fontSize: 13, color: '#8C5A20', fontWeight: 600, letterSpacing: -0.1 }}>
          연속 기록 <span style={{ color: '#C77A1F', fontWeight: 800 }}>{D.streakDays}일</span>
          <span style={{ color: '#A87A3A', fontWeight: 500 }}> · 정원에 빛 4개가 모였어요</span>
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {[1,2,3,4].map(i => (
            <span key={i} style={{ width: 7, height: 7, borderRadius: 999, background: '#FFD27A', boxShadow: '0 0 4px rgba(255,210,122,0.7)' }} />
          ))}
        </div>
      </div>

      {/* Wiki greeting + record card */}
      <ReCard padding={0} id="record-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 8px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{isNight ? '📔' : '✨'}</span>
            {isNight ? '오늘을 정리하기' : '오늘을 기록하기'}
          </div>
          <ReChip>위키 · Lv.{D.wikiLevel}</ReChip>
        </div>

        <div style={{ padding: '4px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* wiki bubble */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <WikiMascot size={44} />
            <ReSpeechBubble from="wiki" time={D.greetingTime}>
              {`안녕! 오늘 하루는 어땠어?\n짧게 적어줘도 괜찮아.`}
            </ReSpeechBubble>
          </div>

          {entrySubmitted && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ReSpeechBubble from="user" time="방금">
                {entryText}
              </ReSpeechBubble>
            </div>
          )}
        </div>

        {/* input */}
        <div style={{ padding: '8px 12px 14px' }}>
          <div style={{ background: '#F5F7FB', borderRadius: 16, padding: '10px 12px', border: '1px solid #ECEFF6' }}>
            <textarea
              value={entryText}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="오늘의 생각을 자유롭게 적어보세요..."
              style={{
                width: '100%', minHeight: 60, border: 'none', background: 'transparent',
                resize: 'none', outline: 'none', fontSize: 14, lineHeight: 1.55,
                color: C.ink, fontFamily: 'inherit', letterSpacing: -0.1,
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <button style={{ width: 32, height: 32, borderRadius: 10, background: '#fff', border: '1px solid #ECEFF6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                {I.image()}
              </button>
              <RePillButton
                onClick={submitEntry}
                disabled={entrySubmitted || !entryText.trim() || apiBusy}
                icon={I.send()}
              >
                {apiBusy ? '연결 중...' : entrySubmitted ? '기록 완료' : '기록하기'}
              </RePillButton>
            </div>
          </div>
        </div>
      </ReCard>

      {/* AI observation candidates - glassmorphism gift card style */}
      <div style={{
        position: 'relative',
        opacity: entrySubmitted ? 1 : 0.6,
        pointerEvents: entrySubmitted ? 'auto' : 'none',
        transition: 'opacity 0.3s',
      }}>
        <div style={{
          background: isNight
            ? 'linear-gradient(180deg, #2A3370 0%, #3B3F7A 100%)'
            : 'linear-gradient(180deg, #DDF1F8 0%, #E8F6EC 100%)',
          borderRadius: 22,
          padding: 16,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 4px 18px rgba(27,34,64,0.1)',
        }}>
          {/* sparkle accents */}
          {isNight && (
            <>
              <div style={{ position: 'absolute', top: 18, right: 22, width: 4, height: 4, borderRadius: 999, background: '#FFF8C8', boxShadow: '0 0 8px rgba(255,248,200,0.8)' }} />
              <div style={{ position: 'absolute', bottom: 30, left: 30, width: 3, height: 3, borderRadius: 999, background: '#FFD9F0', boxShadow: '0 0 8px rgba(255,217,240,0.8)' }} />
              <div style={{ position: 'absolute', top: '40%', right: 14, width: 3, height: 3, borderRadius: 999, background: '#C8E8FF', boxShadow: '0 0 8px rgba(200,232,255,0.8)' }} />
            </>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: isNight ? 'rgba(255,255,255,0.7)' : C.inkSoft, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                AI가 마음에서 찾은
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: isNight ? '#fff' : C.ink, marginTop: 2, letterSpacing: -0.2 }}>
                관찰 후보 조각
              </div>
              <div style={{ fontSize: 12, color: isNight ? 'rgba(255,255,255,0.65)' : C.inkSoft, marginTop: 4, letterSpacing: -0.1 }}>
                {entrySubmitted ? '맞는 것만 정원에 심을 수 있어요.' : '먼저 오늘의 기록을 남겨주세요.'}
              </div>
            </div>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.3)', color: isNight ? '#fff' : C.inkSoft, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              {I.refresh(isNight ? '#fff' : C.inkSoft)} 다시
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(D.observationCandidates || []).map((o) => {
              const checked = !!observed[o.id];
              const open = !!expandedReasons[o.id];
              return (
                <div key={o.id} style={{
                  borderRadius: 14,
                  background: checked
                    ? (isNight ? 'rgba(120,200,138,0.25)' : '#F0F9F2')
                    : (isNight ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.65)'),
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${checked
                    ? (isNight ? 'rgba(139,217,164,0.55)' : '#CDEAD4')
                    : 'rgba(255,255,255,0.4)'}`,
                  padding: 10, transition: 'all 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <button
                      onClick={() => toggleObs(o.id)}
                      style={{
                        width: 22, height: 22, borderRadius: 7,
                        background: checked ? C.green : (isNight ? 'rgba(255,255,255,0.85)' : '#fff'),
                        border: `1.5px solid ${checked ? C.green : (isNight ? 'rgba(255,255,255,0.5)' : '#D6DBEB')}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, cursor: 'pointer', marginTop: 1,
                      }}
                    >
                      {checked && I.check('#fff', 12)}
                    </button>
                    <div style={{ flex: 1, fontSize: 13.5, color: isNight ? '#fff' : C.ink, lineHeight: 1.5, letterSpacing: -0.1 }}>{o.text}</div>
                    <button
                      onClick={() => toggleReason(o.id)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 2, padding: '4px 8px', borderRadius: 999, background: isNight ? 'rgba(255,255,255,0.2)' : '#fff', border: `1px solid ${isNight ? 'rgba(255,255,255,0.3)' : '#ECEFF6'}`, color: isNight ? '#fff' : C.inkSoft, fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
                    >
                      이유 {open ? '닫기' : '보기'}
                    </button>
                  </div>
                  {open && (
                    <div style={{ marginTop: 8, marginLeft: 32, padding: 10, borderRadius: 10, background: isNight ? 'rgba(255,255,255,0.92)' : '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.inkMute, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4 }}>원문 근거</div>
                      <div style={{ fontSize: 12.5, color: C.ink, marginBottom: 10, lineHeight: 1.5 }}>{o.source}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.inkMute, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4 }}>확인 질문</div>
                      <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5 }}>"{o.question}"</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={saveSelected}
            disabled={!entrySubmitted || apiBusy}
            style={{
              marginTop: 12, width: '100%', padding: '13px 16px', borderRadius: 14,
              background: 'linear-gradient(135deg, #6E80F4 0%, #5161E8 100%)',
              color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: -0.1,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(81,97,232,0.4)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            🌱 정원에 심기 ({selectedCount})
          </button>
        </div>
      </div>

      {/* Daily quest */}
      <ReCard padding={0}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 8px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>위키의 하루 부탁</div>
          <ReChip color="#3E9B5C" bg="#E8F6EC">오늘 1개 · 보상 ✨2</ReChip>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', padding: '0 16px' }}>
          <WikiMascot size={40} mood="happy" />
          <ReSpeechBubble from="wiki">
            {questDone
              ? `잘했어! 오늘 부탁 들어줘서\n빛 조각 ✨2개 정원에 보태줄게.`
              : `오늘은 부담 없이 하나만 해보자.\n"${D.dailyQuest.title}"\n해주면 ✨2개 챙겨줄게!`}
          </ReSpeechBubble>
        </div>
        <div style={{ padding: '12px 16px 14px' }}>
          <div style={{ background: questDone ? '#E8F6EC' : '#F0F9F2', border: `1.5px solid ${questDone ? C.green : '#CDEAD4'}`, borderRadius: 16, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #CDEAD4' }}>
                {questDone ? I.check(C.green, 16) : <span style={{ fontSize: 16 }}>✏️</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: '#1F4D2E', lineHeight: 1.45, letterSpacing: -0.1 }}>
                  {D.dailyQuest.title}
                </div>
                <div style={{ fontSize: 12, color: '#3E9B5C', marginTop: 6 }}>
                  예시 · {D.dailyQuest.examples.join(' / ')}
                </div>
                <div style={{ fontSize: 11, color: '#7DAA8E', marginTop: 4 }}>
                  💡 {D.dailyQuest.why}
                </div>
                <div style={{ fontSize: 11.5, color: '#8C5A20', marginTop: 6, fontWeight: 700 }}>
                  🎁 보상 · 빛 조각 ✨2개 + 위키 호감도 +5
                </div>
              </div>
            </div>
            <button
              onClick={completeQuest}
              disabled={questDone || apiBusy}
              style={{
                marginTop: 12, width: '100%', padding: '11px 12px', borderRadius: 12,
                background: questDone ? '#fff' : C.green, color: questDone ? C.green : '#fff',
                border: questDone ? `1.5px solid ${C.green}` : 'none',
                fontSize: 13.5, fontWeight: 700, cursor: questDone ? 'default' : 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              {questDone ? <>{I.check(C.green, 14)} 오늘의 부탁을 완료했어요</> : '완료했어요'}
            </button>
          </div>
        </div>
      </ReCard>

      {/* Two-column mini cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Wiki growth mini */}
        <ReCard padding={14} style={{ cursor: 'pointer' }} onClick={() => onNavigate('wiki')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>위키 성장</div>
            {I.chevRight(C.inkMute, 12)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <WikiMascot size={48} mood="calm" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: C.inkSoft }}>레벨</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.blueDeep, letterSpacing: -0.3 }}>Lv.{D.wikiLevel}</div>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <ReProgressBar value={D.xp} max={D.maxXp} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10.5, color: C.inkSoft }}>
              <span>{D.xp} / {D.maxXp} XP</span>
              <span>+25 남음</span>
            </div>
          </div>
        </ReCard>

        {/* Weekly report mini */}
        <ReCard padding={14} style={{ cursor: 'pointer' }} onClick={() => onNavigate('report')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>주간 리포트</div>
            {I.chevRight(C.inkMute, 12)}
          </div>
          <div style={{ fontSize: 10.5, color: C.inkSoft, marginTop: 4 }}>4.21 (월) - 4.27 (일)</div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {D.weeklyKeywords.map((k) => (
              <div key={k.word} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: k.color, width: 32 }}>{k.word}</span>
                <div style={{ flex: 1, height: 6, borderRadius: 999, background: '#F5F7FB', overflow: 'hidden' }}>
                  <div style={{ width: `${(k.count / 6) * 100}%`, height: '100%', background: k.color, opacity: 0.9 }} />
                </div>
                <span style={{ fontSize: 10.5, color: C.inkSoft, width: 22, textAlign: 'right' }}>{k.count}회</span>
              </div>
            ))}
          </div>
        </ReCard>
      </div>

      {/* Pre-counsel message preview */}
      <ReCard padding={16} style={{ cursor: 'pointer' }} onClick={() => onNavigate('message')}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>상담 전 문의문</div>
          <ReChip color="#5A6585" bg="#F5F7FB" style={{ fontWeight: 600 }}>
            {I.lock(C.inkMute, 11)}<span style={{ marginLeft: 3 }}>자동 전송 안 함</span>
          </ReChip>
        </div>
        <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 10, lineHeight: 1.5 }}>
          필요할 때만 만들고, 직접 수정해서 사용할 수 있어요.
        </div>
        <div style={{ background: '#F8FAFD', borderRadius: 14, padding: 12, border: '1px solid #ECEFF6' }}>
          <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.6, letterSpacing: -0.1 }}>
            “안녕하세요. 최근 비교와 불안감이 자주 올라와 힘들어요. 스스로를 믿고 싶은데 잘 안 돼서 도움을 받고 싶습니다…”
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <RePillButton variant="soft" style={{ flex: 1, padding: '10px 12px' }}>문의문 보기</RePillButton>
          <RePillButton variant="ghost" style={{ flex: 1, padding: '10px 12px' }} icon={I.copy()} onClick={(e) => { e.stopPropagation(); onToast('미리보기를 복사했어요.'); }}>복사하기</RePillButton>
        </div>
      </ReCard>

      <div style={{ textAlign: 'center', fontSize: 11, color: C.inkMute, padding: '8px 8px 0' }}>
        Re:Link는 진단을 대신하지 않아요. 사용자가 저장한 기록만 모아둡니다.
      </div>
    </div>
  );
}

window.HomeScreen = HomeScreen;
