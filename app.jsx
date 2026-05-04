// App shell + bottom tab bar + main HTML wiring

function BottomTab({ tab, active, label, icon, onClick, mode = 'day' }) {
  const C = mode === 'night' ? window.RELINK_COLORS_DARK : window.RELINK_COLORS;
  const c = active ? C.blue : C.inkMute;
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        padding: '6px 4px 4px', background: 'transparent', border: 'none', cursor: 'pointer',
      }}
    >
      {icon(c)}
      <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 600, color: c, letterSpacing: -0.1 }}>{label}</span>
      <span style={{
        width: 4, height: 4, borderRadius: 999, background: active ? C.blue : 'transparent',
        marginTop: 1,
      }} />
    </button>
  );
}

function ReLinkApp() {
  const [tab, setTab] = React.useState('home');
  const [toast, setToast] = React.useState({ message: '', visible: false });
  const toastTimer = React.useRef(null);

  // Global theme: auto by clock, can be overridden via toggle
  const autoMode = (() => {
    const h = new Date().getHours();
    return (h >= 6 && h < 18) ? 'day' : 'night';
  })();
  const [modeOverride, setModeOverride] = React.useState(null);
  const mode = modeOverride || autoMode;
  const setMode = (m) => setModeOverride(m);
  const themeValue = React.useMemo(() => ({ mode, setMode }), [mode]);
  const C = mode === 'night' ? window.RELINK_COLORS_DARK : window.RELINK_COLORS;

  const showToast = (message) => {
    setToast({ message, visible: true });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2000);
  };

  const [homeState, setHomeState] = React.useState({
    entryText: window.RELINK_DATA.defaultEntry,
    entrySubmitted: false,
    observed: { o1: true, o2: true, o3: true },
    expandedReasons: { o2: true },
    questDone: false,
    savedCount: 0,
    shopOwned: { lamp: true, blanket: true },
  });

  const tabIcons = {
    home: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11.5L12 4l9 7.5" /><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
      </svg>
    ),
    history: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 3-6.7" /><polyline points="3 4 3 9 8 9" /><polyline points="12 7 12 12 15 14" />
      </svg>
    ),
    report: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    wiki: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z" />
        <path d="M12 7v-2" />
      </svg>
    ),
    message: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  };

  const tabs = [
    { id: 'home', label: '오늘', icon: tabIcons.home },
    { id: 'history', label: '기록', icon: tabIcons.history },
    { id: 'report', label: '리포트', icon: tabIcons.report },
    { id: 'wiki', label: '위키', icon: tabIcons.wiki },
    { id: 'message', label: '문의문', icon: tabIcons.message },
  ];

  const screen = (() => {
    switch (tab) {
      case 'home': return <HomeScreen state={homeState} setState={setHomeState} onToast={showToast} onNavigate={setTab} />;
      case 'history': return <HistoryScreen state={homeState} />;
      case 'report': return <WeeklyReportScreen />;
      case 'wiki': return <WikiGrowthScreen state={homeState} />;
      case 'message': return <MessageScreen state={homeState} onToast={showToast} />;
      case 'shop': return <ShopScreen state={homeState} setState={setHomeState} onToast={showToast} onNavigate={setTab} />;
      default: return null;
    }
  })();

  // tagged labels for screen-context
  const screenLabel = {
    home: '01 홈',
    history: '02 기록 히스토리',
    report: '03 주간 리포트',
    wiki: '04 위키 성장',
    message: '05 상담 전 문의문',
    shop: '06 위키의 상점',
  }[tab];

  return (
    <window.ReLinkTheme.Provider value={themeValue}>
    <div data-screen-label={screenLabel} style={{
      position: 'relative', width: '100%', height: '100%',
      background: C.bg,
      transition: 'background 0.5s ease',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingTop: 50 /* status bar */, paddingBottom: 78 /* tab bar */ }}>
        {screen}
      </div>

      {/* toast */}
      <ReToast message={toast.message} visible={toast.visible} />

      {/* bottom tab bar */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: mode === 'night' ? 'rgba(31,27,48,0.94)' : 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        borderTop: `1px solid ${mode === 'night' ? 'rgba(250,247,240,0.1)' : '#ECEFF6'}`,
        paddingBottom: 22, paddingTop: 4,
        display: 'flex', alignItems: 'center',
      }}>
        {tabs.map((t) => (
          <BottomTab
            key={t.id}
            tab={t.id}
            active={tab === t.id}
            label={t.label}
            icon={t.icon}
            mode={mode}
            onClick={() => setTab(t.id)}
          />
        ))}
      </div>
    </div>
    </window.ReLinkTheme.Provider>
  );
}

function App() {
  // Center the iOS device on screen, scale down on small viewports
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const fit = () => {
      const w = window.innerWidth, h = window.innerHeight;
      const dw = 402, dh = 874;
      const s = Math.min(1, w / (dw + 60), h / (dh + 60));
      setScale(s);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <div style={{
      width: '100vw', minHeight: '100vh', background: 'linear-gradient(180deg, #EEF1FA 0%, #F5F7FB 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, boxSizing: 'border-box',
    }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <IOSDevice width={402} height={874}>
          <ReLinkApp />
        </IOSDevice>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
