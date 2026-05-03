// WikiRoomScene — hand-drawn rainy single room. The room IS the interface.
// Objects are interactive: diary (record), shards (observation), chest (message),
// lamp (mode toggle), plant (growth/streak indicator), window (ambient).

function WikiRoomScene({
  mode = 'night',
  wikiMessage = '비가 정말 많이 오네...\n오늘은 무슨 생각을 했어?',
  onTapDiary,
  onTapShards,
  onTapChest,
  onTapPlant,
  onTapShop,
  onToggleLamp,
  recorded = false,
  shardsCount = 5,
  questDone = false,
  level = 3,
  streakDays = 7,
  unread = 2,
  clock = '04:30',
}) {
  const isNight = mode === 'night';

  // Hand-drawn palette — warmer & dimmer, inspired by reference
  const wallTop = isNight ? '#3F384F' : '#E8DCC9';
  const wallBot = isNight ? '#2B2640' : '#D6C5AC';
  const floor = isNight ? '#5C4530' : '#C29A6F';
  const floorDk = isNight ? '#3D2D1E' : '#9C7A52';
  const ink = isNight ? '#1A1428' : '#3A2A1E';
  const lampLit = '#FFE08A';
  const lampGlow = isNight ? 'rgba(255,224,138,0.55)' : 'rgba(255,224,138,0.0)';

  // little rain drops
  const drops = React.useMemo(
    () => Array.from({ length: 28 }, (_, i) => ({
      x: 6 + Math.random() * 88,
      d: Math.random() * 3,
      dur: 0.9 + Math.random() * 0.7,
      h: 8 + Math.random() * 10,
    })),
    []
  );

  // memory shards on shelf
  const shards = [
    { x: 18, y: 38, c: '#B6E0FF', delay: 0 },
    { x: 32, y: 38, c: '#FFE6A8', delay: 0.6 },
    { x: 24, y: 50, c: '#FFD9F0', delay: 1.2 },
    { x: 14, y: 50, c: '#C8FFD9', delay: 1.8 },
    { x: 36, y: 50, c: '#E0D9FF', delay: 2.4 },
  ];

  return (
    <div style={{
      position: 'relative',
      borderRadius: 24,
      overflow: 'hidden',
      background: `linear-gradient(180deg, ${wallTop} 0%, ${wallBot} 70%)`,
      boxShadow: '0 4px 24px rgba(27,34,64,0.18), inset 0 0 0 1px rgba(255,255,255,0.05)',
      height: 420,
      fontFamily: '"Gaegu", "Pretendard", system-ui',
    }}>
      <style>{`
        @keyframes drop-fall {
          0% { transform: translateY(-12px); opacity: 0; }
          15% { opacity: 0.9; }
          100% { transform: translateY(54px); opacity: 0; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          47% { opacity: 0.92; }
          50% { opacity: 0.7; }
          53% { opacity: 0.95; }
        }
        @keyframes shard-glow {
          0%, 100% { filter: drop-shadow(0 0 4px currentColor); transform: translateY(0); }
          50% { filter: drop-shadow(0 0 10px currentColor); transform: translateY(-2px); }
        }
        @keyframes wiki-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }
        @keyframes blink-eyes {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes float-bubble {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes pulse-tap {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,224,138,0.5); }
          50% { box-shadow: 0 0 0 8px rgba(255,224,138,0); }
        }
        .room-tap { cursor: pointer; transition: transform 0.15s ease; }
        .room-tap:hover { transform: translateY(-1px) scale(1.02); }
        .room-tap:active { transform: translateY(0) scale(0.98); }
      `}</style>

      {/* Top HUD: clock + notifications */}
      <div style={{
        position: 'absolute', top: 10, left: 12, zIndex: 10,
        display: 'flex', flexDirection: 'column', gap: 4,
        color: isNight ? '#fff' : ink, fontWeight: 700,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <svg width="18" height="14" viewBox="0 0 18 14">
            <path d="M2 2 q3 -1 5 0 q-1 3 1 4 q3 1 6 0 q1 3 -1 5 q-4 1 -8 -1 q-4 -2 -3 -8 z"
              fill="none" stroke={isNight ? '#fff' : ink} strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
          <span>{unread}</span>
        </div>
        <div style={{ fontSize: 14, fontFamily: '"Gaegu", monospace' }}>{clock}</div>
      </div>

      {/* Side rail icons (right) — sun/mode, shop, chest, settings */}
      <div style={{
        position: 'absolute', top: 14, right: 10, zIndex: 10,
        display: 'flex', flexDirection: 'column', gap: 10,
        color: isNight ? '#fff' : ink,
      }}>
        {[
          { k: 'sun', svg: <path d="M9 1 v3 M9 14 v3 M1 9 h3 M14 9 h3 M3 3 l2 2 M13 13 l2 2 M3 15 l2 -2 M13 5 l2 -2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>, sub: <circle cx="9" cy="9" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.4"/> , onClick: onToggleLamp, label: '낮/밤' },
          { k: 'shop', svg: <path d="M3 6 L15 6 L14 16 L4 16 Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>, sub: <path d="M6 6 q0 -3 3 -3 q3 0 3 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>, onClick: onTapShop, label: '상점' },
          { k: 'chest', svg: <path d="M2 7 h14 v8 h-14 z M2 7 q0 -4 7 -4 q7 0 7 4 M9 7 v8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>, onClick: onTapChest, label: '문의문' },
          { k: 'set', svg: <circle cx="9" cy="9" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.4"/>, sub: <path d="M9 1 v2 M9 15 v2 M1 9 h2 M15 9 h2 M3.5 3.5 l1.5 1.5 M13 13 l1.5 1.5 M3.5 14.5 l1.5 -1.5 M13 5 l1.5 -1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/> },
        ].map((b, i) => (
          <button key={b.k} onClick={b.onClick} aria-label={b.label} title={b.label} style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'transparent', border: 'none', cursor: b.onClick ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'inherit',
          }}>
            <svg width="22" height="22" viewBox="0 0 18 18" fill="none">{b.svg}{b.sub}</svg>
          </button>
        ))}
      </div>

      {/* Floor band */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 130,
        background: `linear-gradient(180deg, ${floor} 0%, ${floorDk} 100%)`,
        borderTop: `2px solid ${ink}`,
      }}>
        {/* floor planks */}
        {[0.18, 0.36, 0.55, 0.72, 0.88].map((p, i) => (
          <div key={i} style={{
            position: 'absolute', left: 0, right: 0, top: `${p * 100}%`,
            height: 1, background: ink, opacity: 0.35,
          }} />
        ))}
      </div>

      {/* Wall back panel + window */}
      <div style={{
        position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)',
        width: 150, height: 124, borderRadius: 6,
        background: `linear-gradient(180deg, ${isNight ? '#1B2350' : '#94B8CE'} 0%, ${isNight ? '#0F1638' : '#7AA0B8'} 100%)`,
        border: `3px solid ${ink}`,
        overflow: 'hidden',
      }}>
        {/* mullions */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 3, background: ink, transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 3, background: ink, transform: 'translateY(-50%)' }} />
        {/* rain inside window */}
        {drops.slice(0, 14).map((d, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${d.x}%`, top: -8,
            width: 1.2, height: d.h,
            background: 'linear-gradient(180deg, rgba(200,232,255,0.9), rgba(200,232,255,0.1))',
            animation: `drop-fall ${d.dur}s linear infinite`,
            animationDelay: `${d.d}s`,
          }} />
        ))}
        {/* moon */}
        {isNight && (
          <>
            <div style={{ position: 'absolute', top: 8, left: 12, width: 14, height: 14, borderRadius: '50%', background: '#FFE6A8', opacity: 0.9, boxShadow: '0 0 12px rgba(255,230,168,0.7)' }} />
          </>
        )}
      </div>

      {/* Window frame highlights / sill */}
      <div style={{
        position: 'absolute', top: 180, left: '50%', transform: 'translateX(-50%)',
        width: 168, height: 8, background: isNight ? '#1A1428' : '#5A4030',
        borderRadius: 2,
      }} />

      {/* Lamp (top center, hangs from top) */}
      <div className="room-tap" onClick={onToggleLamp} style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 70, height: 70, zIndex: 6,
      }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 1.5, height: 22, background: ink }} />
        {/* shade */}
        <svg width="70" height="36" viewBox="0 0 70 36" style={{ position: 'absolute', top: 18, left: 0 }}>
          <path d="M10 6 L60 6 L52 28 L18 28 Z" fill={isNight ? '#2A2030' : '#5A4030'} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
        </svg>
        {/* bulb glow cone */}
        {isNight && (
          <div style={{
            position: 'absolute', top: 46, left: '50%', transform: 'translateX(-50%)',
            width: 220, height: 240,
            background: 'radial-gradient(ellipse at top, rgba(255,224,138,0.45) 0%, rgba(255,224,138,0.18) 40%, transparent 70%)',
            pointerEvents: 'none',
            animation: 'flicker 4s ease-in-out infinite',
          }} />
        )}
        {/* bulb */}
        <div style={{
          position: 'absolute', top: 42, left: '50%', transform: 'translateX(-50%)',
          width: 12, height: 12, borderRadius: '50%',
          background: lampLit, boxShadow: `0 0 14px 6px ${lampGlow}`,
          animation: 'flicker 4s ease-in-out infinite',
        }} />
      </div>

      {/* Bookshelf (left wall) with memory shards */}
      <div className="room-tap" onClick={onTapShards} style={{
        position: 'absolute', left: 12, bottom: 60, width: 96, height: 140,
        zIndex: 4,
      }}>
        {/* shelf body — hand-drawn */}
        <svg width="96" height="140" viewBox="0 0 96 140" style={{ overflow: 'visible' }}>
          <path d="M4 6 L92 6 L92 134 L4 134 Z"
            fill={isNight ? '#3A2818' : '#8A5E38'} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M4 50 L92 50 M4 92 L92 92" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          {/* simple books */}
          <rect x="14" y="14" width="6" height="32" fill="#7B5BA0" stroke={ink} strokeWidth="1"/>
          <rect x="22" y="18" width="6" height="28" fill="#5B7BD6" stroke={ink} strokeWidth="1"/>
          <rect x="30" y="14" width="6" height="32" fill="#D67B7B" stroke={ink} strokeWidth="1"/>
          {/* shards */}
          {shards.map((s, i) => (
            <g key={i} style={{ animation: `shard-glow ${2.5 + s.delay * 0.3}s ease-in-out infinite`, animationDelay: `${s.delay}s`, color: s.c }}>
              <polygon points={`${s.x*1.9},${s.y*1.6} ${s.x*1.9 + 5},${s.y*1.6 - 5} ${s.x*1.9 + 9},${s.y*1.6 + 1} ${s.x*1.9 + 4},${s.y*1.6 + 7}`}
                fill={s.c} stroke={ink} strokeWidth="1.2" strokeLinejoin="round"/>
            </g>
          ))}
        </svg>
        {/* shards count badge */}
        <div style={{
          position: 'absolute', top: -6, right: -6,
          minWidth: 22, height: 22, padding: '0 6px',
          borderRadius: 999, background: '#FFE6A8', color: ink,
          border: `1.5px solid ${ink}`, fontSize: 11, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          ✨{shardsCount}
        </div>
      </div>

      {/* Old chest (right corner, on floor) — message/storage */}
      <div className="room-tap" onClick={onTapChest} style={{
        position: 'absolute', right: 14, bottom: 36, width: 88, height: 60,
        zIndex: 4,
      }}>
        <svg width="88" height="60" viewBox="0 0 88 60" style={{ overflow: 'visible' }}>
          {/* chest base */}
          <path d="M4 24 L84 24 L80 56 L8 56 Z" fill={isNight ? '#5A3A1E' : '#9C6A38'} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
          {/* lid */}
          <path d="M2 24 q42 -22 84 0 L84 30 L4 30 Z" fill={isNight ? '#7A4A22' : '#B07840'} stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
          {/* metal bands */}
          <path d="M4 38 L84 38 M30 24 L30 56 M58 24 L58 56" stroke={ink} strokeWidth="1.5" fill="none" />
          {/* lock */}
          <rect x="40" y="26" width="8" height="10" fill="#FFE6A8" stroke={ink} strokeWidth="1.5" />
          <circle cx="44" cy="31" r="1.5" fill={ink} />
        </svg>
        {/* notification dot for unsent message */}
        <div style={{
          position: 'absolute', top: -2, right: 8,
          width: 12, height: 12, borderRadius: '50%',
          background: '#F58A6B', border: `1.5px solid ${ink}`,
          animation: 'pulse-tap 1.6s ease-in-out infinite',
        }} />
      </div>

      {/* Small plant (bottom-left near shelf) — streak indicator */}
      <div className="room-tap" onClick={onTapPlant} style={{
        position: 'absolute', left: 116, bottom: 28, zIndex: 4,
      }}>
        <svg width="36" height="44" viewBox="0 0 36 44" style={{ overflow: 'visible' }}>
          {/* pot */}
          <path d="M8 28 L28 28 L25 42 L11 42 Z" fill={isNight ? '#8A5E38' : '#C8895E'} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
          <path d="M6 26 L30 26" stroke={ink} strokeWidth="2" strokeLinecap="round"/>
          {/* leaves */}
          <path d="M18 26 q0 -8 -8 -10 q-2 6 8 10 z" fill="#5BB97A" stroke={ink} strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M18 26 q0 -10 8 -12 q2 8 -8 12 z" fill="#3E9B5C" stroke={ink} strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M18 26 q0 -14 0 -18" stroke="#3E9B5C" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          {/* tiny flower if streak > 5 */}
          {streakDays >= 5 && (
            <>
              <circle cx="18" cy="6" r="3" fill="#FFB8D9" stroke={ink} strokeWidth="1"/>
              <circle cx="18" cy="6" r="1" fill="#FFE6A8"/>
            </>
          )}
        </svg>
        <div style={{
          position: 'absolute', top: -6, right: -10, padding: '1px 6px',
          background: '#fff', border: `1.5px solid ${ink}`, borderRadius: 999,
          fontSize: 10, fontWeight: 800, color: ink,
        }}>
          🔥{streakDays}
        </div>
      </div>

      {/* Diary on floor (small, near Wiki) */}
      <div className="room-tap" onClick={onTapDiary} style={{
        position: 'absolute', left: '50%', bottom: 96,
        transform: 'translateX(-180%)',
        zIndex: 4,
      }}>
        <svg width="42" height="34" viewBox="0 0 42 34" style={{ overflow: 'visible' }}>
          <path d="M4 6 L34 4 L38 30 L8 32 Z" fill="#A04A38" stroke={ink} strokeWidth="2" strokeLinejoin="round"/>
          <path d="M8 10 L32 8.5 M8 16 L32 14.5 M8 22 L24 21" stroke={ink} strokeWidth="1" opacity="0.6"/>
          {/* pen */}
          <path d="M30 0 L40 14" stroke="#3A2A1E" strokeWidth="2" strokeLinecap="round"/>
          <path d="M40 14 L42 18" stroke="#FFE6A8" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        {!recorded && (
          <div style={{
            position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
            width: 8, height: 8, borderRadius: '50%',
            background: '#FFE6A8', boxShadow: '0 0 8px rgba(255,224,138,0.9)',
            animation: 'flicker 1.2s ease-in-out infinite',
          }} />
        )}
      </div>

      {/* Wiki — center bottom, hand-drawn ghost-blob */}
      <div style={{
        position: 'absolute', left: '50%', bottom: 30,
        transform: 'translateX(-50%)',
        animation: 'wiki-breathe 4s ease-in-out infinite',
        zIndex: 5,
      }}>
        <svg width="100" height="120" viewBox="0 0 100 120" style={{ overflow: 'visible' }}>
          {/* shadow */}
          <ellipse cx="50" cy="114" rx="28" ry="4" fill={ink} opacity="0.25" />
          {/* body — soft hand-drawn outline, slightly droopy */}
          <path
            d="M50 14
               C 30 14, 22 30, 22 50
               C 22 72, 28 92, 32 102
               C 36 110, 44 112, 50 112
               C 56 112, 64 110, 68 102
               C 72 92, 78 72, 78 50
               C 78 30, 70 14, 50 14 Z"
            fill="#FAF7F0"
            stroke={ink}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* tiny stem */}
          <path d="M50 16 q0 -6 0 -10" stroke="#3E9B5C" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
          <path d="M50 8 q-5 -4 -8 -1 q3 4 8 4 q5 0 8 -4 q-3 -3 -8 1 z" fill="#5BB97A" stroke={ink} strokeWidth="1.2" strokeLinejoin="round"/>
          {/* arms — folded */}
          <path d="M30 70 q4 6 14 6 M70 70 q-4 6 -14 6" stroke={ink} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* eyes (closed sleepy) */}
          <g style={{ animation: 'blink-eyes 5s ease-in-out infinite', transformOrigin: '40px 50px' }}>
            <path d="M36 50 q4 3 8 0" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
          <g style={{ animation: 'blink-eyes 5s ease-in-out infinite', transformOrigin: '60px 50px' }}>
            <path d="M56 50 q4 3 8 0" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
          {/* mouth */}
          <path d="M44 60 q6 4 12 0" stroke={ink} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          {/* cheeks */}
          <ellipse cx="34" cy="58" rx="3.5" ry="2" fill="#FFB8B8" opacity="0.7" />
          <ellipse cx="66" cy="58" rx="3.5" ry="2" fill="#FFB8B8" opacity="0.7" />
        </svg>
      </div>

      {/* Speech bubble — hand-drawn, floats above-right of Wiki */}
      <div style={{
        position: 'absolute', right: 22, bottom: 138,
        maxWidth: 200, zIndex: 8,
        animation: 'float-bubble 3.5s ease-in-out infinite',
      }}>
        <div style={{
          position: 'relative',
          background: '#FAF7F0',
          padding: '10px 14px',
          fontSize: 13,
          color: ink,
          lineHeight: 1.5,
          letterSpacing: -0.1,
          fontFamily: '"Gaegu", "Pretendard", system-ui',
          fontWeight: 600,
          whiteSpace: 'pre-wrap',
          // hand-drawn squiggly border via filter is hard; use double border + irregular radius
          borderRadius: '20px 22px 18px 24px / 22px 18px 24px 20px',
          border: `2px solid ${ink}`,
          boxShadow: `2px 3px 0 ${ink}30`,
        }}>
          {wikiMessage}
          {/* tail */}
          <svg width="22" height="22" viewBox="0 0 22 22" style={{ position: 'absolute', left: -14, bottom: 6 }}>
            <path d="M22 4 L4 12 L20 16 Z" fill="#FAF7F0" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
            <line x1="20" y1="6" x2="20" y2="14" stroke="#FAF7F0" strokeWidth="3"/>
          </svg>
        </div>
      </div>

      {/* Falling overlay rain over the whole room (subtle) */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: isNight ? 0.18 : 0.1, zIndex: 9 }}>
        {drops.map((d, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${d.x}%`, top: 0,
            width: 1, height: d.h,
            background: 'linear-gradient(180deg, rgba(180,210,235,0.6), rgba(180,210,235,0))',
            animation: `drop-fall ${d.dur * 1.4}s linear infinite`,
            animationDelay: `${d.d}s`,
          }} />
        ))}
      </div>

      {/* Floor objects — small umbrella / cushion on floor for charm */}
      <svg width="42" height="30" viewBox="0 0 42 30" style={{ position: 'absolute', right: 110, bottom: 22, zIndex: 3 }}>
        <ellipse cx="21" cy="22" rx="18" ry="6" fill="#A04A4A" stroke={ink} strokeWidth="2"/>
        <path d="M21 22 q-12 -16 -16 -2" fill="#C26060" stroke={ink} strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M21 22 q12 -16 16 -2" fill="#C26060" stroke={ink} strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M21 22 q0 -18 -2 -2" fill="#A04A4A" stroke={ink} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M21 4 v-2" stroke={ink} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>

      {/* Title pill */}
      <div style={{
        position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(255,255,255,0.85)',
        padding: '4px 12px', borderRadius: 999,
        fontSize: 12, fontWeight: 800, color: ink,
        border: `1.5px solid ${ink}`,
        fontFamily: '"Gaegu", "Pretendard", system-ui',
        letterSpacing: 0.2,
      }}>
        위키의 방
      </div>
    </div>
  );
}

window.WikiRoomScene = WikiRoomScene;
