// GardenScene — animated night/day garden hero with Wiki at center

function GardenScene({ mode = 'night', wikiMessage = '오늘 초록색 하나만 보고 올래?', onRecord, recorded }) {
  const isNight = mode === 'night';
  const C = window.RELINK_COLORS;

  // sky gradient
  const sky = isNight
    ? 'linear-gradient(180deg, #1B2350 0%, #2A3370 35%, #3B3F7A 70%, #4A4283 100%)'
    : 'linear-gradient(180deg, #BFE3F5 0%, #DDF1F8 45%, #E8F6EC 100%)';

  // generate decorative elements
  const stars = React.useMemo(
    () => Array.from({ length: 28 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 50,
      r: Math.random() * 1.2 + 0.4,
      d: Math.random() * 2,
      o: Math.random() * 0.6 + 0.4,
    })),
    []
  );
  const fireflies = React.useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({
      x: 10 + Math.random() * 80,
      y: 30 + Math.random() * 50,
      d: Math.random() * 4,
      dur: 4 + Math.random() * 3,
    })),
    []
  );

  return (
    <div style={{
      position: 'relative',
      borderRadius: 24,
      overflow: 'hidden',
      background: sky,
      boxShadow: '0 4px 24px rgba(27,34,64,0.12), inset 0 0 0 1px rgba(255,255,255,0.08)',
      height: 360,
    }}>
      <style>{`
        @keyframes ff-twinkle { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes ff-drift { 0% { transform: translate(0,0); } 50% { transform: translate(8px,-6px); } 100% { transform: translate(0,0); } }
        @keyframes wm-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes ripple { 0% { transform: scale(0.6); opacity: 0.6; } 100% { transform: scale(1.4); opacity: 0; } }
        @keyframes lantern-glow { 0%,100% { opacity: 0.85; } 50% { opacity: 1; } }
      `}</style>

      {/* stars */}
      {isNight && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
          {stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#FFF8C8"
              style={{ animation: `ff-twinkle ${2 + s.d}s ease-in-out infinite`, opacity: s.o }} />
          ))}
          {/* moon */}
          <circle cx="78" cy="14" r="5" fill="#FFF3C8" opacity="0.95" />
          <circle cx="76" cy="13" r="4" fill="#1B2350" opacity="0.55" />
        </svg>
      )}
      {!isNight && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
          <circle cx="80" cy="16" r="8" fill="#FFE6A8" opacity="0.9" />
          <circle cx="80" cy="16" r="14" fill="#FFE6A8" opacity="0.25" />
        </svg>
      )}

      {/* far hill silhouette */}
      <svg width="100%" height="180" viewBox="0 0 400 180" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 70 }}>
        <path d="M0 120 Q 80 70 160 100 T 320 90 T 400 110 L 400 180 L 0 180 Z"
              fill={isNight ? '#1A2244' : '#A8D8B0'} opacity={isNight ? 0.7 : 0.55} />
        <path d="M0 140 Q 100 90 200 120 T 400 130 L 400 180 L 0 180 Z"
              fill={isNight ? '#171E3C' : '#7EC58B'} opacity={isNight ? 0.85 : 0.6} />
      </svg>

      {/* lanterns hanging top-left */}
      <div style={{ position: 'absolute', top: 0, left: 14, width: 80, height: 110 }}>
        <svg width="80" height="110" viewBox="0 0 80 110">
          <line x1="22" y1="0" x2="22" y2="34" stroke={isNight ? '#3F4FC9' : '#7AAA92'} strokeWidth="1" opacity="0.6" />
          <line x1="56" y1="0" x2="56" y2="58" stroke={isNight ? '#3F4FC9' : '#7AAA92'} strokeWidth="1" opacity="0.6" />
          {/* lantern 1 */}
          <g style={{ animation: 'lantern-glow 2.8s ease-in-out infinite' }}>
            <circle cx="22" cy="42" r="11" fill="#FFE6A8" opacity="0.35" />
            <ellipse cx="22" cy="42" rx="7" ry="9" fill="#FFD27A" />
            <rect x="18" y="32" width="8" height="2" rx="1" fill="#7A4A1F" />
            <rect x="18" y="50" width="8" height="2" rx="1" fill="#7A4A1F" />
          </g>
          {/* lantern 2 */}
          <g style={{ animation: 'lantern-glow 3.6s ease-in-out infinite' }}>
            <circle cx="56" cy="66" r="10" fill="#FFE6A8" opacity="0.3" />
            <ellipse cx="56" cy="66" rx="6" ry="8" fill="#FFD27A" />
            <rect x="52" y="58" width="8" height="2" rx="1" fill="#7A4A1F" />
            <rect x="52" y="73" width="8" height="2" rx="1" fill="#7A4A1F" />
          </g>
        </svg>
      </div>

      {/* trees on right */}
      <svg width="120" height="180" viewBox="0 0 120 180" style={{ position: 'absolute', top: 30, right: -10 }}>
        <ellipse cx="80" cy="60" rx="34" ry="40" fill={isNight ? '#1F2A4A' : '#7EC58B'} opacity="0.85" />
        <ellipse cx="100" cy="80" rx="22" ry="26" fill={isNight ? '#162038' : '#5FA876'} opacity="0.9" />
        <rect x="78" y="90" width="4" height="50" fill={isNight ? '#0F1428' : '#3E6F4D'} />
      </svg>

      {/* fireflies */}
      {isNight && fireflies.map((f, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${f.x}%`,
          top: `${f.y}%`,
          width: 6, height: 6, borderRadius: '50%',
          background: '#FFF3A0',
          boxShadow: '0 0 8px 2px rgba(255,243,160,0.7)',
          animation: `ff-twinkle ${2 + f.d * 0.5}s ease-in-out infinite, ff-drift ${f.dur}s ease-in-out infinite`,
        }} />
      ))}

      {/* pond */}
      <div style={{
        position: 'absolute',
        left: '50%', bottom: 28, transform: 'translateX(-50%)',
        width: 240, height: 56, borderRadius: '50%',
        background: isNight
          ? 'radial-gradient(ellipse, #4A6BBF 0%, #2A3B7A 60%, #1B2350 100%)'
          : 'radial-gradient(ellipse, #B0D9F0 0%, #7EBDDF 60%, #5FA8D4 100%)',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.25)',
      }}>
        {/* lily pads */}
        <div style={{ position: 'absolute', left: 18, top: 18, width: 22, height: 12, borderRadius: '50%', background: isNight ? '#3E7A5C' : '#5FAD7A', opacity: 0.9 }} />
        <div style={{ position: 'absolute', right: 26, top: 28, width: 18, height: 10, borderRadius: '50%', background: isNight ? '#3E7A5C' : '#5FAD7A', opacity: 0.9 }} />
        <div style={{ position: 'absolute', left: 80, top: 32, width: 16, height: 9, borderRadius: '50%', background: isNight ? '#356A4F' : '#4FA06D', opacity: 0.9 }} />
        {/* glowing flower (memory shard) */}
        <div style={{
          position: 'absolute', left: 30, top: 14, width: 10, height: 10, borderRadius: '50%',
          background: '#FFD9F0', boxShadow: '0 0 10px 3px rgba(255,217,240,0.7)',
          animation: 'ff-twinkle 2.5s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', right: 38, top: 24, width: 8, height: 8, borderRadius: '50%',
          background: '#C8E8FF', boxShadow: '0 0 10px 3px rgba(200,232,255,0.7)',
          animation: 'ff-twinkle 3.2s ease-in-out infinite',
        }} />
      </div>

      {/* flowers around bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 4px' }}>
        {Array.from({ length: 14 }).map((_, i) => {
          const colors = isNight ? ['#FFB8D9', '#D9C8FF', '#FFD9A0', '#FFF3C8'] : ['#FFB8D9', '#FFE6A8', '#FFD27A', '#FFF3C8'];
          const c = colors[i % colors.length];
          const h = 14 + ((i * 7) % 16);
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: c,
                boxShadow: isNight ? `0 0 6px 1px ${c}99` : 'none',
              }} />
              <div style={{ width: 1, height: h, background: isNight ? '#1F4A3A' : '#3E8F58' }} />
            </div>
          );
        })}
      </div>

      {/* speech bubble */}
      <div style={{
        position: 'absolute',
        top: 22,
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 240,
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(8px)',
          padding: '10px 14px',
          borderRadius: 18,
          fontSize: 13,
          fontWeight: 600,
          color: '#1B2240',
          textAlign: 'center',
          letterSpacing: -0.1,
          lineHeight: 1.45,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          position: 'relative',
        }}>
          {wikiMessage}
          <div style={{
            position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
            width: 12, height: 12, background: 'rgba(255,255,255,0.95)',
          }} />
        </div>
        <div style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 8, fontWeight: 600, letterSpacing: 0.5 }}>
          위키의 하루 부탁
        </div>
      </div>

      {/* Wiki at center */}
      <div style={{
        position: 'absolute',
        left: '50%',
        bottom: 40,
        transform: 'translateX(-50%)',
        animation: 'wm-bob 3s ease-in-out infinite',
        filter: isNight ? 'drop-shadow(0 0 16px rgba(255,243,160,0.4))' : 'drop-shadow(0 6px 8px rgba(0,0,0,0.15))',
      }}>
        <WikiMascot size={120} mood={isNight ? 'calm' : 'happy'} />
      </div>

      {/* Record button */}
      <button
        onClick={onRecord}
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 12,
          transform: 'translateX(-50%)',
          padding: '11px 22px',
          borderRadius: 999,
          border: 'none',
          background: isNight
            ? 'linear-gradient(135deg, #8B7BD9 0%, #5B6FEF 100%)'
            : 'linear-gradient(135deg, #6E80F4 0%, #5161E8 100%)',
          color: '#fff',
          fontSize: 13.5,
          fontWeight: 700,
          letterSpacing: -0.1,
          cursor: 'pointer',
          boxShadow: isNight
            ? '0 0 20px rgba(139,123,217,0.6), 0 4px 12px rgba(0,0,0,0.3)'
            : '0 4px 14px rgba(81,97,232,0.4)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          zIndex: 5,
        }}
      >
        <span style={{ fontSize: 14 }}>{isNight ? '📔' : '✨'}</span>
        {recorded ? '오늘 기록을 다시 보기' : (isNight ? '오늘을 기록하기' : '오늘의 부탁 보기')}
      </button>

      {/* HUD: time mode badge */}
      <div style={{
        position: 'absolute', top: 12, right: 12,
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '5px 10px', borderRadius: 999,
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(8px)',
        color: '#fff', fontSize: 11, fontWeight: 700,
        border: '1px solid rgba(255,255,255,0.25)',
      }}>
        {isNight ? '🌙 밤의 정원' : '☀️ 낮의 정원'}
      </div>
    </div>
  );
}

window.GardenScene = GardenScene;
