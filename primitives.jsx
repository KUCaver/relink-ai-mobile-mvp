// Shared small UI primitives for Re:Link

function ReCard({ children, style = {}, padding = 16, ...rest }) {
  const T = window.useTheme ? window.useTheme() : null;
  const isNight = T && T.mode === 'night';
  return (
    <div
      style={{
        background: isNight ? '#2B2640' : '#FFFFFF',
        borderRadius: 22,
        padding,
        boxShadow: isNight
          ? '0 1px 2px rgba(0,0,0,0.18), 0 6px 18px rgba(0,0,0,0.22)'
          : '0 1px 2px rgba(27,34,64,0.04), 0 6px 18px rgba(27,34,64,0.05)',
        border: `1px solid ${isNight ? 'rgba(250,247,240,0.10)' : '#ECEFF6'}`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

function ReChip({ children, color = '#5B6FEF', bg = '#EEF1FE', style = {} }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 10px',
        borderRadius: 999,
        background: bg,
        color,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.2,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function ReSectionTitle({ title, right, style = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, ...style }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#1B2240', letterSpacing: -0.2 }}>{title}</div>
      {right}
    </div>
  );
}

function RePillButton({ children, onClick, variant = 'primary', icon, style = {}, disabled = false }) {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #6E80F4 0%, #5161E8 100%)',
      color: '#FFFFFF',
      border: 'none',
      boxShadow: '0 4px 10px rgba(81,97,232,0.25)',
    },
    soft: {
      background: '#EEF1FE',
      color: '#3F4FC9',
      border: '1px solid #DCE2FB',
    },
    green: {
      background: '#E8F6EC',
      color: '#3E9B5C',
      border: '1px solid #CDEAD4',
    },
    ghost: {
      background: '#FFFFFF',
      color: '#5A6585',
      border: '1px solid #ECEFF6',
    },
  };
  const v = variants[variant] || variants.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '11px 16px',
        borderRadius: 14,
        fontSize: 14,
        fontWeight: 700,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        letterSpacing: -0.2,
        ...v,
        ...style,
      }}
    >
      {icon}
      {children}
    </button>
  );
}

function ReSpeechBubble({ children, from = 'wiki', time, style = {} }) {
  const T = window.useTheme ? window.useTheme() : null;
  const isNight = T && T.mode === 'night';
  const isWiki = from === 'wiki';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isWiki ? 'flex-start' : 'flex-end',
        gap: 4,
        ...style,
      }}
    >
      <div
        style={{
          maxWidth: '82%',
          padding: '10px 13px',
          borderRadius: 16,
          borderTopLeftRadius: isWiki ? 4 : 16,
          borderTopRightRadius: isWiki ? 16 : 4,
          background: isWiki
            ? (isNight ? 'rgba(250,247,240,0.08)' : '#F2F4FB')
            : (isNight ? '#5B6FEF' : '#5B6FEF'),
          color: isWiki
            ? (isNight ? '#FAF7F0' : '#1B2240')
            : '#FFFFFF',
          fontSize: 14,
          lineHeight: 1.55,
          letterSpacing: -0.1,
          whiteSpace: 'pre-wrap',
        }}
      >
        {children}
      </div>
      {time && (
        <div style={{ fontSize: 10.5, color: isNight ? 'rgba(250,247,240,0.55)' : '#8A93AB', padding: '0 4px' }}>{time}</div>
      )}
    </div>
  );
}

function ReProgressBar({ value, max = 100, color = '#5B6FEF', track = '#ECEFF6', height = 8 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ width: '100%', height, background: track, borderRadius: 999, overflow: 'hidden' }}>
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${color} 0%, ${color}CC 100%)`,
          borderRadius: 999,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  );
}

function ReToast({ message, visible }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 110,
        transform: `translateX(-50%) translateY(${visible ? 0 : 12}px)`,
        opacity: visible ? 1 : 0,
        transition: 'all 0.25s ease',
        background: 'rgba(27,34,64,0.92)',
        color: '#fff',
        padding: '10px 16px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        backdropFilter: 'blur(8px)',
        zIndex: 200,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {message}
    </div>
  );
}

// Tiny lucide-style icons
const Icon = {
  bell: (c = '#1B2240') => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  ),
  send: (c = '#fff') => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
  check: (c = '#fff', size = 14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  chevDown: (c = '#5A6585') => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  chevRight: (c = '#5A6585', size = 14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  ),
  refresh: (c = '#5A6585') => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  copy: (c = '#5A6585') => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  image: (c = '#8A93AB') => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  lock: (c = '#8A93AB', size = 16) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  arrowRight: (c = '#8A93AB', size = 14) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  pdf: (c = '#5A6585') => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
};

window.ReCard = ReCard;
window.ReChip = ReChip;
window.ReSectionTitle = ReSectionTitle;
window.RePillButton = RePillButton;
window.ReSpeechBubble = ReSpeechBubble;
window.ReProgressBar = ReProgressBar;
window.ReToast = ReToast;
window.ReIcon = Icon;
