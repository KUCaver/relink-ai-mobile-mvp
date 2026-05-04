// ShopScreen — hand-drawn shop matching WikiRoom aesthetic.
// Items the user can buy with 빛 조각 (memory shards). Each card has a 구매 button.

function ShopItemIcon({ kind, mode = 'night' }) {
  const isNight = mode === 'night';
  const ink = isNight ? '#1A1428' : '#3A2A1E';
  const stroke = ink;
  switch (kind) {
    case 'turtle':
      return (
        <svg width="56" height="40" viewBox="0 0 56 40">
          <ellipse cx="28" cy="22" rx="16" ry="11" fill="#7BA86B" stroke={stroke} strokeWidth="2" />
          <path d="M16 22 q12 -10 24 0" stroke={stroke} strokeWidth="1.5" fill="none" />
          <path d="M22 14 v16 M28 12 v20 M34 14 v16" stroke={stroke} strokeWidth="1.2" fill="none" />
          <circle cx="44" cy="20" r="4" fill="#A8D08A" stroke={stroke} strokeWidth="1.6" />
          <circle cx="45" cy="19" r="0.8" fill={stroke} />
          <path d="M14 28 l-3 4 M18 32 l-2 3 M40 32 l2 3 M44 28 l3 3" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'seed':
      return (
        <svg width="56" height="40" viewBox="0 0 56 40">
          <ellipse cx="28" cy="22" rx="14" ry="8" fill="#E8D9B8" stroke={stroke} strokeWidth="2" />
          <path d="M20 22 q8 -4 16 0" stroke={stroke} strokeWidth="1.4" fill="none" />
        </svg>
      );
    case 'window':
      return (
        <svg width="56" height="40" viewBox="0 0 56 40">
          <rect x="14" y="6" width="28" height="28" fill={isNight ? '#1B2350' : '#94B8CE'} stroke={stroke} strokeWidth="2" />
          <line x1="28" y1="6" x2="28" y2="34" stroke={stroke} strokeWidth="2" />
          <line x1="14" y1="20" x2="42" y2="20" stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case 'book':
      return (
        <svg width="56" height="40" viewBox="0 0 56 40">
          <path d="M10 12 L46 8 L48 32 L12 36 Z" fill="#FAF7F0" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
          <path d="M28 10 L30 34" stroke={stroke} strokeWidth="1.6" />
          <path d="M16 18 L26 17 M16 22 L26 21 M32 17 L42 16 M32 21 L42 20" stroke={stroke} strokeWidth="0.8" opacity="0.6" />
        </svg>
      );
    case 'wall':
      return (
        <svg width="56" height="40" viewBox="0 0 56 40">
          <path d="M28 6 L28 30 M22 14 L34 14 M22 22 L34 22" stroke={stroke} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M14 32 L42 32" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'lamp':
      return (
        <svg width="56" height="40" viewBox="0 0 56 40">
          <path d="M28 4 L28 12" stroke={stroke} strokeWidth="1.6" />
          <path d="M16 18 L40 18 L34 30 L22 30 Z" fill="#5A4030" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="28" cy="32" r="2.5" fill="#FFE08A" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case 'blanket':
      return (
        <svg width="56" height="40" viewBox="0 0 56 40">
          <path d="M10 22 q18 -10 36 0 q-2 10 -18 10 q-16 0 -18 -10 z" fill="#D9CFC0" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
          <text x="20" y="22" fontSize="9" fontFamily='"Gaegu", monospace' fontWeight="700" fill={stroke}>z</text>
          <text x="26" y="20" fontSize="11" fontFamily='"Gaegu", monospace' fontWeight="700" fill={stroke}>z</text>
        </svg>
      );
    case 'cup':
      return (
        <svg width="56" height="40" viewBox="0 0 56 40">
          <path d="M20 8 L36 8 L34 34 L22 34 Z" fill="#FAF7F0" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
          <path d="M22 18 q6 4 12 0 L34 30 q-6 -4 -12 0 z" fill="#A8D8F0" stroke={stroke} strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

function ShopScreen({ state, setState, onToast, onNavigate }) {
  const D = window.RELINK_DATA;
  const C = window.useTheme();
  const mode = C.mode;
  const isNight = mode === 'night';
  const ink = isNight ? '#1A1428' : '#3A2A1E';

  const owned = state.shopOwned || {};
  const shards = (state.savedCount || 0) + 5; // playful: shards on shelf

  const buy = (item) => {
    if (item.locked) {
      onToast(item.lockNote || '아직 열리지 않았어요.');
      return;
    }
    if (owned[item.id]) {
      onToast('이미 방에 있어요.');
      return;
    }
    if (shards < item.price) {
      onToast(`빛 조각이 ${item.price - shards}개 더 필요해요.`);
      return;
    }
    setState({ ...state, shopOwned: { ...owned, [item.id]: true } });
    onToast(`${item.name}을(를) 방에 두었어요. 위키가 좋아해요.`);
  };

  return (
    <div data-screen-label="06 상점" style={{
      padding: '14px 16px 28px',
      display: 'flex', flexDirection: 'column', gap: 14,
      fontFamily: '"Gaegu", "Pretendard", system-ui',
    }}>
      {/* Hand-drawn header card */}
      <div style={{
        position: 'relative',
        borderRadius: 22,
        background: isNight ? '#2B2640' : '#FAF3E5',
        border: `2.5px solid ${ink}`,
        padding: '14px 16px',
        boxShadow: `3px 4px 0 ${ink}40`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: isNight ? '#FAF7F0' : ink, letterSpacing: 0.3 }}>
              위키의 상점
            </div>
            <div style={{ fontSize: 13, color: isNight ? 'rgba(250,247,240,0.75)' : C.inkSoft, marginTop: 2, fontWeight: 600 }}>
              방을 채우면 위키가 더 잘 자고, 더 잘 웃어요.
            </div>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: isNight ? 'rgba(255,255,255,0.12)' : '#FFF8E8',
            border: `2px solid ${ink}`,
            borderRadius: 999, padding: '6px 12px',
            fontSize: 14, fontWeight: 800, color: isNight ? '#FFE08A' : '#8C5A20',
          }}>
            ✨ {shards}
          </div>
        </div>
      </div>

      {/* Item list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {D.shopItems.map((item) => {
          const isOwned = !!owned[item.id];
          const canAfford = shards >= item.price && !item.locked;
          return (
            <div key={item.id} style={{
              position: 'relative',
              borderRadius: 18,
              background: isNight ? '#352F4D' : '#FFFDF7',
              border: `2.5px solid ${ink}`,
              padding: 14,
              boxShadow: `3px 4px 0 ${ink}40`,
              opacity: item.locked ? 0.7 : 1,
            }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                {/* hand-drawn icon panel */}
                <div style={{
                  width: 72, height: 56, flexShrink: 0,
                  borderRadius: 12,
                  background: isNight ? 'rgba(255,255,255,0.06)' : '#F5EBD7',
                  border: `2px dashed ${ink}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <ShopItemIcon kind={item.iconKind} mode={mode} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: isNight ? '#FAF7F0' : ink, letterSpacing: 0.2 }}>
                      {item.name}
                    </div>
                    {item.locked && (
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        color: isNight ? '#FFB8B8' : '#A04A4A',
                        background: isNight ? 'rgba(255,184,184,0.12)' : '#FFE8E8',
                        border: `1.5px solid ${isNight ? '#A04A4A' : '#A04A4A'}`,
                        borderRadius: 999, padding: '1px 8px',
                      }}>🔒 {item.lockNote}</span>
                    )}
                    {isOwned && (
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        color: '#3E9B5C',
                        background: '#E8F6EC',
                        border: '1.5px solid #3E9B5C',
                        borderRadius: 999, padding: '1px 8px',
                      }}>✓ 보유 중</span>
                    )}
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: isNight ? '#C8E0FF' : '#4A6FA0', marginTop: 4, letterSpacing: -0.1 }}>
                    {item.effect}
                  </div>
                  <div style={{ fontSize: 12.5, color: isNight ? 'rgba(250,247,240,0.7)' : C.inkSoft, marginTop: 6, lineHeight: 1.55, fontWeight: 600 }}>
                    {item.detail}
                  </div>
                </div>
              </div>

              {/* Price + buy */}
              <div style={{
                marginTop: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: 10,
                borderTop: `1.5px dashed ${isNight ? 'rgba(255,255,255,0.15)' : ink + '30'}`,
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 15, fontWeight: 800,
                  color: isNight ? '#FFE08A' : '#8C5A20',
                }}>
                  ✨ <span>{item.price}</span>
                  <span style={{ fontSize: 12, color: isNight ? 'rgba(250,247,240,0.6)' : C.inkSoft, fontWeight: 600 }}>빛 조각</span>
                </div>
                <button
                  onClick={() => buy(item)}
                  disabled={isOwned || item.locked}
                  style={{
                    border: `2.5px solid ${ink}`,
                    background: isOwned
                      ? (isNight ? '#3E5C48' : '#E8F6EC')
                      : !canAfford
                        ? (isNight ? '#3F384F' : '#F0E8D8')
                        : (isNight ? '#FFE08A' : '#FFE08A'),
                    color: isOwned
                      ? '#3E9B5C'
                      : !canAfford
                        ? (isNight ? 'rgba(250,247,240,0.55)' : C.inkSoft)
                        : ink,
                    fontFamily: 'inherit',
                    fontSize: 14, fontWeight: 800,
                    padding: '8px 18px',
                    borderRadius: 999,
                    cursor: isOwned || item.locked ? 'default' : 'pointer',
                    boxShadow: isOwned || !canAfford ? 'none' : `2px 3px 0 ${ink}`,
                    letterSpacing: 0.3,
                  }}
                >
                  {isOwned ? '보유 중' : item.locked ? '잠김' : '구매하기'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Back to room */}
      <button
        onClick={() => onNavigate('home')}
        style={{
          alignSelf: 'center',
          marginTop: 4,
          background: 'transparent',
          border: `2px solid ${isNight ? 'rgba(250,247,240,0.4)' : ink + '60'}`,
          color: isNight ? 'rgba(250,247,240,0.85)' : ink,
          fontFamily: 'inherit',
          fontSize: 13.5, fontWeight: 700,
          padding: '8px 18px',
          borderRadius: 999,
          cursor: 'pointer',
        }}
      >
        ← 위키의 방으로 돌아가기
      </button>

      <div style={{ textAlign: 'center', fontSize: 11, color: isNight ? 'rgba(250,247,240,0.5)' : C.inkMute, padding: '6px 8px 0', fontWeight: 600 }}>
        빛 조각은 매일 기록을 남기면 위키가 모아줘요.
      </div>
    </div>
  );
}

window.ShopScreen = ShopScreen;
window.ShopItemIcon = ShopItemIcon;
