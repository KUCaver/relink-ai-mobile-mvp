// WikiMascot — soft white blob with a tiny sprout

function WikiMascot({ size = 'medium', mood = 'happy', style = {} }) {
  const sizes = { small: 36, medium: 64, large: 140, xl: 200 };
  const px = typeof size === 'number' ? size : sizes[size] || sizes.medium;

  // mood = happy | calm | think | sleep
  const eyeShape = (cx, cy) => {
    if (mood === 'sleep') {
      return <path d={`M${cx - 3} ${cy} q3 -2.5 6 0`} stroke="#1B2240" strokeWidth="1.6" fill="none" strokeLinecap="round" />;
    }
    if (mood === 'think') {
      return <ellipse cx={cx} cy={cy} rx="1.3" ry="2.2" fill="#1B2240" />;
    }
    return <ellipse cx={cx} cy={cy} rx="1.5" ry="2.4" fill="#1B2240" />;
  };

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 100 100"
      style={{ display: 'block', ...style }}
    >
      <defs>
        <radialGradient id={`wm-body-${px}`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#F4F6FB" />
          <stop offset="100%" stopColor="#DDE3F1" />
        </radialGradient>
        <radialGradient id={`wm-cheek-${px}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFC2C2" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFC2C2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`wm-leaf-${px}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8FD9A4" />
          <stop offset="100%" stopColor="#5BB97A" />
        </linearGradient>
      </defs>

      {/* soft shadow under body */}
      <ellipse cx="50" cy="88" rx="24" ry="4" fill="#1B2240" opacity="0.08" />

      {/* sprout stem + leaf */}
      <path d="M50 22 Q50 16 50 10" stroke="#5BB97A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path
        d="M50 12 Q44 6 40 9 Q42 14 50 14 Q58 14 60 9 Q56 6 50 12 Z"
        fill={`url(#wm-leaf-${px})`}
      />
      <path d="M50 14 L50 22" stroke="#3E9B5C" strokeWidth="1" fill="none" />

      {/* body */}
      <path
        d="M30 52 Q30 28 50 28 Q70 28 70 52 Q70 78 50 80 Q30 78 30 52 Z"
        fill={`url(#wm-body-${px})`}
        stroke="#D6DBEB"
        strokeWidth="0.8"
      />

      {/* small foot bumps */}
      <ellipse cx="42" cy="80" rx="5" ry="2.5" fill="#F4F6FB" stroke="#D6DBEB" strokeWidth="0.5" />
      <ellipse cx="58" cy="80" rx="5" ry="2.5" fill="#F4F6FB" stroke="#D6DBEB" strokeWidth="0.5" />

      {/* cheeks */}
      <circle cx="38" cy="58" r="4.5" fill={`url(#wm-cheek-${px})`} />
      <circle cx="62" cy="58" r="4.5" fill={`url(#wm-cheek-${px})`} />

      {/* eyes */}
      {eyeShape(42, 52)}
      {eyeShape(58, 52)}

      {/* mouth */}
      {mood === 'sleep' ? (
        <path d="M46 62 q4 2 8 0" stroke="#1B2240" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      ) : mood === 'think' ? (
        <path d="M46 62 q4 1 8 0" stroke="#1B2240" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M46 60 q4 4 8 0" stroke="#1B2240" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      )}

      {/* tiny highlight */}
      <ellipse cx="40" cy="40" rx="4" ry="2.5" fill="#FFFFFF" opacity="0.7" />
    </svg>
  );
}

window.WikiMascot = WikiMascot;
