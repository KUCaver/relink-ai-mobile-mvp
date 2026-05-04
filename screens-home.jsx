// HomeScreen — vertical scroll hub for Re:Link
// Clear hierarchy: Wiki room → today's record (primary CTA) → AI observation
// fragments → daily quest → supporting cards (growth, report, message).

function HomeScreen({ onToast, onNavigate, state, setState }) {
  const D = state.snapshot || window.RELINK_DATA;
  const C = window.useTheme();
  const I = window.ReIcon;

  const mode = C.mode;
  const isNight = mode === 'night';
  const setModeOverride = C.setMode;

  const {
    entryText, entrySubmitted, observed, expandedReasons, questDone, savedCount,
  } = state;

  const applySnapshot = (snapshot, patch = {}) => {
    if (!snapshot) return;
    window.RELINK_DATA = { ...window.RELINK_DATA, ...snapshot };
    setState({ ...state, snapshot: window.RELINK_DATA, ...patch });
  };

  React.useEffect(() => {
    let mounted = true;
    Promise.resolve(window.ReLinkApi.getInitialSnapshot()).then((result) => {
      if (!mounted) return;
      const snapshot = result.data || result;
      window.RELINK_DATA = { ...window.RELINK_DATA, ...snapshot };
      setState((prev) => ({ ...prev, snapshot: window.RELINK_DATA }));
    });
    return () => { mounted = false; };
  }, []);

  const setEntry = (v) => setState({ ...state, entryText: v });
  const submitEntry = async () => {
    if (!entryText.trim()) return;
    const result = await window.ReLinkApi.submitEntry({ text: entryText });
    const snapshot = result.data || result;
    const nextObserved = Object.fromEntries((snapshot.observationCandidates || []).map((o) => [o.id, false]));
    // unselect by default — user picks fragments themselves
    applySnapshot(snapshot, {
      entrySubmitted: true,
      observed: nextObserved,
      expandedReasons: {},
      questDone: false,
      savedCount: 0,
    });
  };
  const toggleObs = (id) => {
    const next = { ...observed, [id]: !observed[id] };
    setState({ ...state, observed: next });
  };
  const toggleReason = (id) => {
    const next = { ...expandedReasons, [id]: !expandedReasons[id] };
    setState({ ...state, expandedReasons: next });
  };
  const saveSelected = async () => {
    const ids = Object.keys(observed).filter((id) => observed[id]);
    const count = ids.length;
    if (count === 0) {
      onToast('맞다고 느끼는 조각이 있다면 골라주세요.');
      return;
    }
    const result = await window.ReLinkApi.saveObservations({ ids });
    applySnapshot(result.data || result, { savedCount: count });
    onToast(`기억 조각 ${count}개를 정원에 심었어요.`);
  };
  const completeQuest = async () => {
    const result = await window.ReLinkApi.completeQuest();
    applySnapshot(result.data || result, { questDone: true });
    onToast('빛 조각 ✨2개가 방에 더해졌어요.');
  };

  const selectedCount = Object.values(observed).filter(Boolean).length;
  const fragmentColors = ['#B6E0FF', '#FFE6A8', '#FFD9F0', '#C8FFD9', '#E0D9FF'];

  return (
    <div style={{ padding: '14px 16px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* ---------------- Header ---------------- */}
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
          <div style={{ display: 'flex', background: isNight ? 'rgba(255,255,255,0.08)' : '#fff', borderRadius: 999, padding: 3, border: `1px solid ${isNight ? 'rgba(255,255,255,0.12)' : '#ECEFF6'}` }}>
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

      {/* ---------------- Wiki room hero ---------------- */}
      <WikiRoomScene
        mode={mode}
        wikiMessage={questDone
          ? `오늘 부탁 들어줘서 고마워!\n빛 조각 ✨2개 보태줄게.`
          : isNight
            ? `오늘은 부담 없이 하나만 해보자.\n"${D.dailyQuest.title}"\n해주면 ✨2개 줄게!`
            : `좋은 아침! 오늘은\n"${D.dailyQuest.title}"\n어때? 완료하면 ✨2개야!`}
        recorded={entrySubmitted}
        questDone={questDone}
        shardsCount={D.shardsCount || (5 + (savedCount || 0))}
        streakDays={D.streakDays}
        level={D.wikiLevel}
        unread={2}
        clock={isNight ? '22:30' : '09:32'}
        onTapDiary={() => {
          const el = document.getElementById('record-card');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        onTapShards={() => onNavigate('wiki')}
        onTapChest={() => onNavigate('message')}
        onTapPlant={() => onNavigate('wiki')}
        onTapShop={() => onNavigate('shop')}
        onToggleLamp={() => setModeOverride(isNight ? 'day' : 'night')}
      />

      {/* ---------------- Step 1 — TODAY's RECORD (PRIMARY CTA) ---------------- */}
      <ReCard padding={0} id="record-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 22, height: 22, borderRadius: 999, background: C.blue, color: '#fff',
              fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>1</span>
            <div style={{ fontSize: 15.5, fontWeight: 800, color: C.ink, letterSpacing: -0.2 }}>
              위키와 오늘 정리하기
            </div>
          </div>
          <ReChip>약 1분</ReChip>
        </div>

        <div style={{ padding: '8px 16px 4px', display: 'flex', flexDirection: 'column', gap: 10 }}>
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

        <div style={{ padding: '8px 12px 14px' }}>
          <div style={{ background: isNight ? 'rgba(255,255,255,0.06)' : '#F5F7FB', borderRadius: 16, padding: '10px 12px', border: `1px solid ${isNight ? 'rgba(255,255,255,0.08)' : '#ECEFF6'}` }}>
            <textarea
              value={entryText}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="위키에게 짧게 말해주세요..."
              style={{
                width: '100%', minHeight: 60, border: 'none', background: 'transparent',
                resize: 'none', outline: 'none', fontSize: 14, lineHeight: 1.55,
                color: C.ink, fontFamily: 'inherit', letterSpacing: -0.1,
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <button title="사진 첨부" style={{ width: 32, height: 32, borderRadius: 10, background: isNight ? 'rgba(255,255,255,0.08)' : '#fff', border: `1px solid ${isNight ? 'rgba(255,255,255,0.1)' : '#ECEFF6'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                {I.image()}
              </button>
              <RePillButton
                onClick={submitEntry}
                disabled={entrySubmitted || !entryText.trim()}
                icon={I.send()}
                style={{ padding: '12px 20px', fontSize: 14.5 }}
              >
                {entrySubmitted ? '기록 완료' : '기록하기'}
              </RePillButton>
            </div>
          </div>
        </div>
      </ReCard>

      {/* ---------------- Step 2 — OBSERVATION FRAGMENTS ---------------- */}
      <div id="frag-card" style={{
        position: 'relative',
        opacity: entrySubmitted ? 1 : 0.55,
        pointerEvents: entrySubmitted ? 'auto' : 'none',
        transition: 'opacity 0.3s',
      }}>
        <div style={{
          background: isNight ? '#2B2640' : '#FFFFFF',
          borderRadius: 22,
          padding: 16,
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid ${isNight ? 'rgba(250,247,240,0.10)' : '#ECEFF6'}`,
          boxShadow: isNight
            ? '0 1px 2px rgba(0,0,0,0.18), 0 6px 18px rgba(0,0,0,0.22)'
            : '0 1px 2px rgba(27,34,64,0.04), 0 6px 18px rgba(27,34,64,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 22, height: 22, borderRadius: 999, background: '#EFEAFE', color: '#7B5BD6',
                fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>2</span>
              <div style={{ fontSize: 15.5, fontWeight: 800, color: C.ink, letterSpacing: -0.2 }}>
                오늘의 기억 조각 후보
              </div>
            </div>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px',
              borderRadius: 999, background: isNight ? 'rgba(255,255,255,0.08)' : '#F8FAFD',
              border: `1px solid ${isNight ? 'rgba(255,255,255,0.12)' : '#ECEFF6'}`,
              color: C.inkSoft, fontSize: 11, fontWeight: 600, cursor: 'pointer',
            }}>
              {I.refresh(C.inkSoft)} 다시
            </button>
          </div>
          <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 4, marginBottom: 12, lineHeight: 1.5, letterSpacing: -0.1 }}>
            {entrySubmitted
              ? '위키가 오늘 기록에서 조각을 골라봤어요. 본인에게 맞는 것만 정원에 심어요.'
              : '먼저 오늘의 기록을 남겨주세요.'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {D.observationCandidates.slice(0, 4).map((o, idx) => {
              const checked = !!observed[o.id];
              const open = !!expandedReasons[o.id];
              const tint = fragmentColors[idx % fragmentColors.length];
              return (
                <div key={o.id}
                  onClick={() => toggleObs(o.id)}
                  style={{
                    cursor: 'pointer',
                    borderRadius: 16,
                    background: checked
                      ? (isNight ? 'rgba(127,212,155,0.16)' : '#F4FBF6')
                      : (isNight ? 'rgba(255,255,255,0.04)' : '#FBFCFE'),
                    border: `1.5px solid ${checked
                      ? (isNight ? 'rgba(127,212,155,0.55)' : '#CDEAD4')
                      : (isNight ? 'rgba(255,255,255,0.10)' : '#ECEFF6')}`,
                    padding: 12, transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    {/* Memory-fragment shape (not checkbox) */}
                    <div style={{
                      width: 36, height: 36, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative',
                    }}>
                      <svg width="36" height="36" viewBox="0 0 36 36" style={{ position: 'absolute', inset: 0 }}>
                        <polygon
                          points="18,4 30,12 27,28 9,28 6,12"
                          fill={checked ? tint : (isNight ? 'rgba(255,255,255,0.06)' : '#F5F7FB')}
                          stroke={checked ? '#3E9B5C' : (isNight ? 'rgba(255,255,255,0.18)' : '#D6DBEB')}
                          strokeWidth={checked ? 2 : 1.4}
                          strokeLinejoin="round"
                          style={{
                            filter: checked ? `drop-shadow(0 0 6px ${tint})` : 'none',
                            transition: 'all 0.2s',
                          }}
                        />
                      </svg>
                      {checked && (
                        <svg width="14" height="14" viewBox="0 0 24 24" style={{ position: 'relative', zIndex: 1 }}>
                          <polyline points="20 6 9 17 4 12" fill="none" stroke="#1F4D2E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: C.inkMute, marginBottom: 3, letterSpacing: 0.2 }}>
                        가능성 · #{o.tag}
                      </div>
                      <div style={{ fontSize: 13.8, color: C.ink, lineHeight: 1.5, letterSpacing: -0.1, fontWeight: 600 }}>
                        “{o.text}”
                      </div>
                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <span style={{ fontSize: 11, color: C.inkMute, fontWeight: 600, flexShrink: 0, marginTop: 1 }}>원문</span>
                        <span style={{ fontSize: 12, color: C.inkSoft, lineHeight: 1.5, letterSpacing: -0.1, fontStyle: 'italic' }}>
                          {o.source}
                        </span>
                      </div>
                      {open && (
                        <div style={{
                          marginTop: 10, padding: '10px 12px', borderRadius: 12,
                          background: isNight ? 'rgba(255,255,255,0.05)' : '#F8FAFD',
                          border: `1px dashed ${isNight ? 'rgba(255,255,255,0.15)' : '#D6DBEB'}`,
                        }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.inkMute, letterSpacing: 0.3, marginBottom: 4 }}>
                            확인 질문
                          </div>
                          <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.55, letterSpacing: -0.1 }}>
                            {o.question}
                          </div>
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleReason(o.id); }}
                        style={{
                          marginTop: 8, padding: 0, background: 'transparent', border: 'none',
                          color: C.blueDeep, fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
                          letterSpacing: -0.1,
                        }}
                      >
                        {open ? '확인 질문 닫기' : '확인 질문 보기 →'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={saveSelected}
            disabled={!entrySubmitted}
            style={{
              marginTop: 14, width: '100%', padding: '13px 16px', borderRadius: 14,
              background: selectedCount > 0
                ? 'linear-gradient(135deg, #6E80F4 0%, #5161E8 100%)'
                : (isNight ? 'rgba(255,255,255,0.08)' : '#F5F7FB'),
              color: selectedCount > 0 ? '#fff' : C.inkSoft,
              fontSize: 14, fontWeight: 800, letterSpacing: -0.1,
              border: `1px solid ${selectedCount > 0 ? 'transparent' : (isNight ? 'rgba(255,255,255,0.1)' : '#ECEFF6')}`,
              cursor: 'pointer',
              boxShadow: selectedCount > 0 ? '0 4px 14px rgba(81,97,232,0.3)' : 'none',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.2s',
            }}
          >
            {selectedCount > 0
              ? <>🌱 정원에 {selectedCount}개 심기</>
              : '맞는 조각을 골라주세요'}
          </button>
          <div style={{ fontSize: 10.5, color: C.inkMute, textAlign: 'center', marginTop: 8, lineHeight: 1.55 }}>
            저장은 고른 조각만 돼요. 위키는 단정하지 않아요.
          </div>
        </div>
      </div>

      {/* ---------------- Step 3 — DAILY QUEST ---------------- */}
      <ReCard padding={0}>
        <div style={{ padding: '14px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 22, height: 22, borderRadius: 999, background: '#E8F6EC', color: '#3E9B5C',
              fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>3</span>
            <div style={{ fontSize: 15.5, fontWeight: 800, color: C.ink, letterSpacing: -0.2 }}>위키의 하루 부탁</div>
          </div>
          <ReChip color="#3E9B5C" bg="#E8F6EC">보상 · 빛 조각 ✨2</ReChip>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', padding: '4px 16px 0' }}>
          <WikiMascot size={40} mood="happy" />
          <ReSpeechBubble from="wiki">
            {questDone
              ? `잘했어! 빛 조각 ✨2개\n정원에 보태줄게.`
              : `오늘은 이거 하나만 해보자.\n부담 없게.`}
          </ReSpeechBubble>
        </div>
        <div style={{ padding: '12px 16px 14px' }}>
          <div style={{
            background: questDone
              ? (isNight ? 'rgba(127,212,155,0.18)' : '#E8F6EC')
              : (isNight ? 'rgba(127,212,155,0.10)' : '#F0F9F2'),
            border: `1.5px solid ${questDone ? C.green : (isNight ? 'rgba(127,212,155,0.35)' : '#CDEAD4')}`,
            borderRadius: 16, padding: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: questDone ? C.green : (isNight ? 'rgba(255,255,255,0.95)' : '#fff'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, border: `1.5px solid ${questDone ? C.green : '#CDEAD4'}`,
              }}>
                {questDone ? I.check('#fff', 16) : <span style={{ fontSize: 16 }}>🌿</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: isNight ? '#FAF7F0' : '#1F4D2E', lineHeight: 1.45, letterSpacing: -0.1 }}>
                  {D.dailyQuest.title}
                </div>
                <div style={{ fontSize: 11.5, color: isNight ? 'rgba(250,247,240,0.7)' : '#3E9B5C', marginTop: 6, fontWeight: 600 }}>
                  예시 · {D.dailyQuest.examples.join(' / ')}
                </div>
                <div style={{ fontSize: 11, color: isNight ? 'rgba(250,247,240,0.55)' : '#7DAA8E', marginTop: 4, lineHeight: 1.5 }}>
                  💡 {D.dailyQuest.why}
                </div>
              </div>
            </div>
            <button
              onClick={completeQuest}
              disabled={questDone}
              style={{
                marginTop: 12, width: '100%', padding: '12px 12px', borderRadius: 12,
                background: questDone
                  ? (isNight ? 'rgba(255,255,255,0.06)' : '#fff')
                  : C.green,
                color: questDone ? C.green : '#fff',
                border: questDone ? `1.5px solid ${C.green}` : 'none',
                fontSize: 14, fontWeight: 800, cursor: questDone ? 'default' : 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                letterSpacing: -0.1,
              }}
            >
              {questDone
                ? <>{I.check(C.green, 14)} 오늘의 부탁을 완료했어요</>
                : '완료했어요'}
            </button>
          </div>
        </div>
      </ReCard>

      {/* ---------------- Bottom row: secondary cards ---------------- */}
      <div style={{ fontSize: 11.5, fontWeight: 700, color: C.inkMute, padding: '4px 4px 0', letterSpacing: 0.4, textTransform: 'uppercase' }}>
        쌓인 기록 · 천천히 보기
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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

        <ReCard padding={14} style={{ cursor: 'pointer' }} onClick={() => onNavigate('report')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>생활 흐름</div>
            {I.chevRight(C.inkMute, 12)}
          </div>
          <div style={{ fontSize: 10.5, color: C.inkSoft, marginTop: 4 }}>최근 7일</div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {D.weeklyKeywords.map((k) => (
              <div key={k.word} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: k.color, width: 32 }}>#{k.word}</span>
                <div style={{ flex: 1, height: 6, borderRadius: 999, background: isNight ? 'rgba(255,255,255,0.08)' : '#F5F7FB', overflow: 'hidden' }}>
                  <div style={{ width: `${(k.count / 6) * 100}%`, height: '100%', background: k.color, opacity: 0.9 }} />
                </div>
                <span style={{ fontSize: 10.5, color: C.inkSoft, width: 22, textAlign: 'right' }}>{k.count}</span>
              </div>
            ))}
          </div>
        </ReCard>
      </div>

      {/* ---------------- Pre-counsel exit ---------------- */}
      <ReCard padding={16} style={{ cursor: 'pointer' }} onClick={() => onNavigate('message')}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: C.ink, letterSpacing: -0.2 }}>상담·지원 문의 준비</div>
          <ReChip color={C.inkSoft} bg={isNight ? 'rgba(255,255,255,0.08)' : '#F5F7FB'} style={{ fontWeight: 600 }}>
            {I.lock(C.inkMute, 11)}<span style={{ marginLeft: 3 }}>자동 전송 안 함</span>
          </ReChip>
        </div>
        <div style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 10, lineHeight: 1.55, letterSpacing: -0.1 }}>
          쌓인 기록을 바탕으로 문의문 초안을 만들어요. 직접 수정해서 사용해요.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <RePillButton variant="soft" style={{ flex: 1, padding: '10px 12px' }}>문의문 준비</RePillButton>
          <RePillButton variant="ghost" style={{ flex: 1, padding: '10px 12px' }}>지원 후보 보기</RePillButton>
        </div>
      </ReCard>

      <div style={{ textAlign: 'center', fontSize: 11, color: C.inkMute, padding: '6px 8px 0', lineHeight: 1.55 }}>
        Re:Link는 진단 앱이 아니에요. {D.userName}님이 확인한 기록만 모아둡니다.
      </div>
    </div>
  );
}

window.HomeScreen = HomeScreen;
