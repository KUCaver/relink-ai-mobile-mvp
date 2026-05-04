// WikiGrowthScreen — 위키 성장 & 성취 시스템
// 분리 이유: screens-other.jsx 길이 관리 + 성취 시스템 독립 확장 가능성

function WikiGrowthScreen({ state }) {
  const D = window.RELINK_DATA;
  const C = window.useTheme();
  const isNight = C.mode === 'night';
  const WA = D.wikiAchievements;

  const [activeCategory, setActiveCategory] = React.useState('record');

  // state(homeState) 이벤트로 진행도 보정 — MVP 실시간 반영
  const questDoneCount = D.history.filter((h) => h.questDone).length;
  const compareTagCount = D.history.filter((h) => h.tags.includes('비교')).length;
  const connectTagCount = D.history.filter((h) => h.tags.includes('연결') || h.tags.includes('연결')).length;
  const entrySubmitted = state && state.entrySubmitted;
  const savedCount = state ? (state.savedCount || 0) : 0;

  // 성취 목록 — state 반영으로 current 보정
  const enriched = WA.achievements.map((a) => {
    let current = a.current;
    if (a.trigger === 'questComplete5' || a.trigger === 'questComplete10') current = Math.min(a.goal, questDoneCount);
    if (a.trigger === 'compareTag5') current = Math.min(a.goal, compareTagCount);
    if (a.trigger === 'connectTag5' || a.trigger === 'connectTag10') current = Math.min(a.goal, connectTagCount);
    if (a.trigger === 'entrySubmit' && entrySubmitted) current = 1;
    if (a.trigger === 'observeSave') current = Math.min(a.goal, Math.max(a.current, savedCount));
    const status = current >= a.goal ? 'achieved' : a.status;
    return { ...a, current, status };
  });

  const filtered = enriched.filter((a) => a.category === activeCategory);
  const achievedTotal = enriched.filter((a) => a.status === 'achieved').length;

  const levelName = WA.levelNames[Math.min(D.wikiLevel - 1, WA.levelNames.length - 1)];

  const medalEmoji = { bronze: '🥉', silver: '🥈', gold: '🥇' };
  const medalColor = { bronze: '#C97C3A', silver: '#7A90A8', gold: '#B8860B' };
  const medalBg = { bronze: '#FFF4E8', silver: '#F0F4F8', gold: '#FFFBE6' };
  const medalBgDark = { bronze: 'rgba(201,124,58,0.15)', silver: 'rgba(122,144,168,0.15)', gold: 'rgba(184,134,11,0.15)' };

  return (
    <div style={{ padding: '14px 16px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing: -0.4 }}>위키 성장</div>
        <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 4 }}>
          위키는 작은 기록과 시도로 천천히 자라요.
        </div>
      </div>

      {/* 마스코트 + 레벨 카드 */}
      <ReCard padding={20} style={{
        background: isNight
          ? 'linear-gradient(180deg, rgba(91,111,239,0.12) 0%, rgba(43,38,64,0.8) 60%)'
          : 'linear-gradient(180deg, #F2F4FB 0%, #FFFFFF 60%)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
          <WikiMascot size={130} mood="happy" />
        </div>
        <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 4 }}>위키 · {levelName} 단계</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.blueDeep, letterSpacing: -0.4, marginTop: 4 }}>Lv.{D.wikiLevel}</div>
        <div style={{ maxWidth: 240, margin: '12px auto 4px' }}>
          <ReProgressBar value={D.xp} max={D.maxXp} height={10} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11.5, color: C.inkSoft }}>
            <span>{D.xp} / {D.maxXp} XP</span>
            <span>다음 레벨까지 {D.maxXp - D.xp} XP</span>
          </div>
        </div>
      </ReCard>

      {/* 전체 달성 요약 */}
      <ReCard padding={14}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>전체 성취 현황</div>
          <ReChip color="#3E9B5C" bg="#E8F6EC">{achievedTotal} / {enriched.length}개 달성</ReChip>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: isNight ? 'rgba(255,255,255,0.08)' : '#F0F2FF', overflow: 'hidden' }}>
          <div style={{ width: `${(achievedTotal / enriched.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #5B6FEF, #7FD49B)', borderRadius: 999, transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          {['🥉', '🥈', '🥇'].map((m, i) => {
            const tier = ['bronze', 'silver', 'gold'][i];
            const cnt = enriched.filter((a) => a.status === 'achieved' && a.medal === tier).length;
            return (
              <div key={tier} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18 }}>{m}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, marginTop: 2 }}>{cnt}개</div>
              </div>
            );
          })}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18 }}>⏳</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, marginTop: 2 }}>{enriched.filter((a) => a.status === 'in_progress').length}개</div>
          </div>
        </div>
      </ReCard>

      {/* 카테고리 탭 */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
        {WA.categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const catAchieved = enriched.filter((a) => a.category === cat.id && a.status === 'achieved').length;
          const catTotal = enriched.filter((a) => a.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                padding: '8px 12px', borderRadius: 14, flexShrink: 0, cursor: 'pointer',
                background: isActive ? C.blue : (isNight ? 'rgba(255,255,255,0.06)' : '#fff'),
                border: isActive ? 'none' : `1px solid ${isNight ? 'rgba(250,247,240,0.10)' : '#ECEFF6'}`,
                transition: 'all 0.15s ease',
              }}>
              <span style={{ fontSize: 18 }}>{cat.emoji}</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: isActive ? '#fff' : C.inkSoft, whiteSpace: 'nowrap' }}>{cat.label}</span>
              <span style={{ fontSize: 9.5, color: isActive ? 'rgba(255,255,255,0.75)' : C.inkMute }}>{catAchieved}/{catTotal}</span>
            </button>
          );
        })}
      </div>

      {/* 카테고리 설명 */}
      {(() => {
        const cat = WA.categories.find((c) => c.id === activeCategory);
        return cat ? (
          <div style={{ fontSize: 12, color: C.inkSoft, padding: '2px 4px' }}>{cat.desc}</div>
        ) : null;
      })()}

      {/* 성취 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((a) => {
          const isAchieved = a.status === 'achieved';
          const isProgress = a.status === 'in_progress';
          const progressPct = Math.min(100, Math.round((a.current / a.goal) * 100));

          return (
            <div
              key={a.id}
              style={{
                padding: '14px 14px 12px',
                borderRadius: 16,
                background: isAchieved
                  ? (isNight ? medalBgDark[a.medal] : medalBg[a.medal])
                  : (isNight ? 'rgba(255,255,255,0.04)' : '#F8FAFD'),
                border: isAchieved
                  ? `1.5px solid ${isNight ? `rgba(${a.medal === 'bronze' ? '201,124,58' : a.medal === 'silver' ? '122,144,168' : '184,134,11'},0.35)` : medalBg[a.medal]}`
                  : `1px solid ${isNight ? 'rgba(250,247,240,0.08)' : '#ECEFF6'}`,
                opacity: isProgress ? 1 : isAchieved ? 1 : 0.55,
              }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                {/* 메달 배지 */}
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isAchieved
                    ? (isNight ? `rgba(${a.medal === 'bronze' ? '201,124,58' : a.medal === 'silver' ? '122,144,168' : '184,134,11'},0.25)` : '#fff')
                    : (isNight ? 'rgba(255,255,255,0.06)' : '#fff'),
                  fontSize: 20,
                }}>
                  {isAchieved ? medalEmoji[a.medal] : (isProgress ? '🔄' : '🔒')}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: isAchieved ? medalColor[a.medal] : C.ink, letterSpacing: -0.1 }}>
                      {a.title}
                    </div>
                    {isAchieved && (
                      <span style={{ fontSize: 10.5, color: medalColor[a.medal], fontWeight: 700 }}>
                        +{a.xpReward} XP
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: C.inkSoft, lineHeight: 1.5 }}>{a.desc}</div>

                  {/* 진행 중 — 프로그레스 바 */}
                  {isProgress && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.inkMute, marginBottom: 4 }}>
                        <span>{a.current} / {a.goal}</span>
                        <span>{progressPct}%</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 999, background: isNight ? 'rgba(255,255,255,0.08)' : '#ECEFF6', overflow: 'hidden' }}>
                        <div style={{ width: `${progressPct}%`, height: '100%', background: '#5B6FEF', borderRadius: 999, transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  )}

                  {/* 달성 날짜 */}
                  {isAchieved && a.achievedAt && (
                    <div style={{ fontSize: 11, color: medalColor[a.medal], marginTop: 6, fontWeight: 600 }}>
                      {a.achievedAt} 달성 · {medalEmoji[a.medal]} {a.medal === 'bronze' ? '동메달' : a.medal === 'silver' ? '은메달' : '금메달'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 기억 조각 */}
      <ReCard padding={16}>
        <ReSectionTitle title="기억 조각" right={<ReChip color="#3E9B5C" bg="#E8F6EC">{D.memoryFragments.length}개 모음</ReChip>} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {D.memoryFragments.map((m) => (
            <div key={m.name} style={{ padding: 12, borderRadius: 14, background: isNight ? 'rgba(255,255,255,0.05)' : '#F8FAFD', border: `1px solid ${isNight ? 'rgba(250,247,240,0.10)' : '#ECEFF6'}` }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{m.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{m.name}</div>
              <div style={{ fontSize: 11, color: C.inkSoft, marginTop: 3, lineHeight: 1.5 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </ReCard>

      {/* 위키 먹이 */}
      <ReCard padding={16}>
        <ReSectionTitle title="위키에게 줄 먹이" right={<span style={{ fontSize: 11, color: C.inkMute }}>조각으로 교환</span>} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {D.wikiFoods.map((f) => (
            <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 12, background: isNight ? 'rgba(255,255,255,0.05)' : '#F8FAFD', border: `1px solid ${isNight ? 'rgba(250,247,240,0.10)' : '#ECEFF6'}` }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: isNight ? 'rgba(255,255,255,0.08)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: `1px solid ${isNight ? 'rgba(250,247,240,0.10)' : '#ECEFF6'}` }}>{f.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{f.name}</div>
                <div style={{ fontSize: 11, color: C.inkSoft }}>{f.cost}</div>
              </div>
              <button style={{ padding: '7px 12px', borderRadius: 999, background: C.blueSoft, color: C.blueDeep, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>주기</button>
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

window.WikiGrowthScreen = WikiGrowthScreen;
