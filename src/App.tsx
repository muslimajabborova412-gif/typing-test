import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, AudioLines, Compass, Globe2, Map, Mic, Minus, Plus, Send, Settings2, Sparkles, Volume2 } from 'lucide-react';
import WorldScene from './world/WorldScene';
import { labels, locations, type Language } from './data/locations';

const placeIcons: Record<string, string> = { school: '⌂', market: '◇', park: '✳', 'home-west': '⌂', 'home-east': '⌂' };

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedId, setSelectedId] = useState('school');
  const [focusId, setFocusId] = useState<string | null>(null);
  const [command, setCommand] = useState('');
  const [notice, setNotice] = useState('');
  const [apiOnline, setApiOnline] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [zoom, setZoom] = useState(0);
  const t = labels[language];
  const selected = locations.find((location) => location.id === selectedId) ?? locations[0];

  useEffect(() => {
    let active = true;
    fetch('/api/health').then((response) => response.ok ? response.json() : Promise.reject()).then(() => { if (active) setApiOnline(true); }).catch(() => { if (active) setApiOnline(false); });
    return () => { active = false; };
  }, []);

  const stats = useMemo(() => [
    { label: t.people, value: '—', icon: <Activity size={15} /> },
    { label: 'Places built', value: '05', icon: <Map size={15} /> },
  ], [t.people]);

  function chooseLocation(id: string) {
    setSelectedId(id);
    setFocusId(id);
    setNotice('');
  }

  function submitCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = command.trim().toLocaleLowerCase();
    if (!normalized) return;
    const found = locations.find((location) => [location.id, ...Object.values(location.names)].some((name) => normalized.includes(name.toLocaleLowerCase())));
    if (found) {
      chooseLocation(found.id);
      setNotice(`${language === 'tg' ? 'Самт интихоб шуд:' : language === 'ru' ? 'Выбрано место:' : 'Destination selected:'} ${found.names[language]}`);
    } else {
      setNotice(language === 'tg' ? 'Ҷой ёфт нашуд. Аз рӯйхати ҷойҳо истифода баред.' : language === 'ru' ? 'Место не найдено. Выберите его из списка.' : 'I could not match that place. Try one of the destinations below.');
    }
    setCommand('');
  }

  return <main className="app-shell min-h-screen">
    <header className="topbar">
      <a className="brand" href="#home" aria-label="Tajik Sado AI home"><span className="brand-mark"><AudioLines size={21} /></span><span className="brand-name">tajik<span>sado</span><small>AI WORLD</small></span></a>
      <div className="topbar-center"><span className="live-dot" />{apiOnline ? t.online : t.offline}<span className="topbar-divider" /> <span className="phase-chip">{t.phase}</span></div>
      <div className="topbar-actions">
        <label className="language-select"><Globe2 size={15} /><select aria-label="Interface language" value={language} onChange={(event) => setLanguage(event.target.value as Language)}><option value="en">EN</option><option value="ru">RU</option><option value="tg">TG</option></select></label>
        <button className={`icon-button ${settingsOpen ? 'active' : ''}`} onClick={() => setSettingsOpen((value) => !value)} aria-label="Settings"><Settings2 size={18} /></button>
        <div className="user-avatar" title="Guest explorer">S</div>
      </div>
    </header>

    <section className="intro-row"><div><div className="eyebrow"><Sparkles size={14} /> YOUR WORLD, YOUR VOICE</div><h1>{t.world}</h1><p>{t.subtitle}</p></div><div className="intro-weather"><span className="weather-icon">☀</span><span><b>24°</b><small>Dushanbe · Clear skies</small></span></div></section>

    <section className="workspace">
      <aside className="left-panel panel">
        <div className="panel-heading"><div><span className="section-kicker">{t.controls}</span><h2>{t.explore}</h2></div><Compass size={18} className="heading-icon" /></div>
        <p className="panel-copy">{t.hint}</p>
        <div className="section-label">{t.locations}<span>05</span></div>
        <div className="location-list">
          {locations.map((location, index) => <button key={location.id} className={`location-item ${selectedId === location.id ? 'selected' : ''}`} onClick={() => chooseLocation(location.id)}>
            <span className={`place-icon place-${location.kind}`}>{placeIcons[location.id]}</span><span className="location-text"><b>{location.names[language]}</b><small>{location.kind === 'home' ? (language === 'ru' ? 'Жилой район' : language === 'tg' ? 'Минтақаи истиқоматӣ' : 'Residential area') : location.kind === 'education' ? (language === 'ru' ? 'Образование' : language === 'tg' ? 'Маориф' : 'Learning district') : location.kind === 'market' ? (language === 'ru' ? 'Торговый район' : language === 'tg' ? 'Минтақаи бозор' : 'Trading district') : (language === 'ru' ? 'Зелёная зона' : language === 'tg' ? 'Минтақаи сабз' : 'Green district')}</small></span><span className="location-index">0{index + 1}</span>
          </button>)}
        </div>
        <div className="selected-card"><div className="selected-card-top"><span className="selected-pulse" />{t.selected}</div><b>{selected.names[language]}</b><span>{selected.kind === 'park' ? 'A quiet green space in the heart of the city.' : selected.kind === 'market' ? 'A colorful place for local trade and conversation.' : selected.kind === 'education' ? 'A welcoming place to learn and meet.' : 'A neighborhood tucked into the city.'}</span></div>
        <div className="panel-footer"><span className="mini-avatar">✦</span><span><b>World guide</b><small>{language === 'ru' ? 'Готов исследовать' : language === 'tg' ? 'Барои кашф омода' : 'Ready to explore'}</small></span><span className="guide-online" /></div>
      </aside>

      <section className="world-column">
        <div className="world-card">
          <div className="world-toolbar"><div className="map-title"><span className="map-icon"><Map size={16} /></span><span><b>{t.map}</b><small>DU-01 / CENTRAL DISTRICT</small></span></div><div className="map-controls"><span className="map-live"><i /> LIVE MAP</span><button aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(-2, value - 1))}><Minus size={15} /></button><button aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(2, value + 1))}><Plus size={15} /></button><button aria-label={t.reset} onClick={() => { setZoom(0); setFocusId(null); setSelectedId('school'); }}><Compass size={15} /></button></div></div>
          <div className={`canvas-wrap zoom-${zoom}`}><WorldScene selected={selectedId} onSelect={chooseLocation} focusId={focusId} /><div className="canvas-vignette" /><div className="canvas-tag"><span className="live-dot" /> DUSHANBE · 3D</div><div className="canvas-hint">{t.zoom}</div><div className="compass-widget"><ArrowUpRight size={14} /><span>N</span><ArrowDownRight size={14} /></div></div>
          <div className="command-area"><div className="command-symbol"><Sparkles size={18} /></div><form onSubmit={submitCommand}><input value={command} onChange={(event) => setCommand(event.target.value)} placeholder={t.command} aria-label="World text command" /><button type="submit" aria-label={t.send}><span>{t.send}</span><Send size={15} /></button></form><button className="mic-button" type="button" title="Voice commands are planned for a later phase" aria-label="Voice commands coming in a later phase"><Mic size={18} /><span className="mic-lock">·</span></button></div>
          {notice && <div role="status" className="command-notice">{notice}</div>}
        </div>
        <div className="bottom-stats">{stats.map((stat) => <div className="stat-card" key={stat.label}><span className="stat-icon">{stat.icon}</span><span><small>{stat.label}</small><b>{stat.value}</b></span></div>)}<div className="stat-card world-status"><span className="status-ring"><span /></span><span><small>World engine</small><b>Rendering in real time</b></span></div><div className="bottom-note">Built for curious minds <span>✦</span></div></div>
      </section>

      <aside className="right-panel panel"><div className="right-heading"><span className="section-kicker">WORLD DETAILS</span><button className="more-button" aria-label="World options">···</button></div><div className="district-art"><div className="district-glow" /><div className="district-skyline"><i /><i /><i /><i /><i /><i /><i /></div><span className="district-label">DU-01</span><span className="district-orbit orbit-one" /><span className="district-orbit orbit-two" /></div><div className="district-name"><div><span className="district-pin">⌖</span><span><b>{selected.names[language]}</b><small>Dushanbe, Tajikistan</small></span></div><span className="district-temp">24°</span></div><div className="detail-divider" /><div className="detail-row"><span>District type</span><b>{selected.kind === 'education' ? 'Education' : selected.kind === 'market' ? 'Local market' : selected.kind === 'park' ? 'Urban park' : 'Neighborhood'}</b></div><div className="detail-row"><span>Environment</span><b><span className="green-dot" /> Calm & welcoming</b></div><div className="detail-row"><span>Area code</span><b>DU · 01</b></div><div className="ambient-card"><div className="ambient-icon"><Volume2 size={16} /></div><div><b>Ambient sound</b><small>{soundOn ? 'Soft city atmosphere' : 'Sound muted'}</small></div><button className={`toggle ${soundOn ? 'on' : ''}`} onClick={() => setSoundOn((value) => !value)} aria-label="Toggle ambient sound"><i /></button></div>{settingsOpen && <div className="settings-popover"><b>World settings</b><span>Visual language · {language.toUpperCase()}</span><span>Quality · Balanced</span><small>Camera, sound and language controls are available here.</small></div>}</aside>
    </section>
    <footer className="page-footer"><span>© 2026 TAJIK SADO AI</span><span>AN INTERACTIVE WORLD IN PROGRESS</span><span>MADE WITH <i>♥</i> IN TAJIKISTAN</span></footer>
  </main>;
}
