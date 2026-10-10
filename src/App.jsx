import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle, Bug, CalendarDays, Check, CircleHelp, Clock3, Cpu,
  Folder, Gamepad2, HardDrive, Info, Monitor, Music, Power, RefreshCw,
  ShieldAlert, ShieldCheck, Skull, Smile, Sparkles, X, Zap, Minimize2,
  Maximize2, Minus, Wifi, Volume2, BatteryCharging, Trophy, Settings,
  Search, FileText, Trash2, Terminal, MousePointer2, Coffee
} from 'lucide-react';

const POPUPS = [
  { title: 'Critical System Error', icon: 'error', message: 'Your common sense could not be found.', buttons: ['Search for it', 'Ignore problem'], chaos: 7 },
  { title: 'Windows Security Center', icon: 'warning', message: 'Threat detected: 47 unfinished plans and one suspiciously confident user.', buttons: ['Fix everything', 'Not now'], chaos: 8 },
  { title: 'Important Reminder', icon: 'info', message: 'You opened this website to relax. You are now managing 14 windows.', buttons: ['Fair point', 'Who asked?'], chaos: 6 },
  { title: 'Application Not Responding', icon: 'error', message: 'CommonSense.exe is not responding. Would you like to wait, close, or pretend nothing happened?', buttons: ['Wait forever', 'Close'], chaos: 9 },
  { title: 'Internet Explorer', icon: 'info', message: 'This page cannot be displayed. The page is literally right here. Please explain.', buttons: ['Refresh reality', 'Cancel'], chaos: 5 },
  { title: 'User Account Control', icon: 'warning', message: 'Do you want to allow Popup.exe to make changes to your patience?', buttons: ['Allow chaos', 'Deny reality'], chaos: 10 },
  { title: 'Windows Update', icon: 'info', message: 'Installing update 1 of 999: More pop-ups. Please do not turn off your sense of humour.', buttons: ['Install', 'Remind me never'], chaos: 7 },
  { title: 'Recycle Bin', icon: 'info', message: 'Your motivation has been moved to the Recycle Bin. Restore it? (No guarantee.)', buttons: ['Restore', 'Empty bin'], chaos: 6 },
  { title: 'Printer Status', icon: 'warning', message: 'Printer status: emotionally unavailable. It has paper, ink, and unresolved issues.', buttons: ['Comfort printer', 'Cancel'], chaos: 5 },
  { title: 'Unexpected Exception', icon: 'error', message: 'Error 418: I am a teapot. Please stop asking me to be productive.', buttons: ['Make tea', 'Close'], chaos: 7 }
];

const STARTER_POPUPS = [
  { title: 'Welcome to Popup Apocalypse', icon: 'info', message: 'This is a harmless game. All chaos stays inside this webpage. Click “Begin the chaos” when you are ready.', buttons: ['Begin the chaos', 'I fear nothing'], chaos: 0, starter: true }
];

const iconFor = (kind, size = 32) => {
  const props = { size, strokeWidth: 1.8 };
  if (kind === 'error') return <AlertTriangle {...props} color="#e53d37" />;
  if (kind === 'warning') return <ShieldAlert {...props} color="#e6a323" />;
  if (kind === 'info') return <Info {...props} color="#2677d8" />;
  return <CircleHelp {...props} color="#2677d8" />;
};

function App() {
  const [started, setStarted] = useState(false);
  const [popups, setPopups] = useState([]);
  const [chaos, setChaos] = useState(0);
  const [patience, setPatience] = useState(100);
  const [closedCount, setClosedCount] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [score, setScore] = useState(0);
  const [zCounter, setZCounter] = useState(20);
  const [startMenu, setStartMenu] = useState(false);
  const [taskManager, setTaskManager] = useState(false);
  const [whackOpen, setWhackOpen] = useState(false);
  const [whackScore, setWhackScore] = useState(0);
  const [whackTime, setWhackTime] = useState(15);
  const [whackRunning, setWhackRunning] = useState(false);
  const [toast, setToast] = useState('');
  const [ending, setEnding] = useState(null);
  const [soundOn, setSoundOn] = useState(false);
  const [drag, setDrag] = useState(null);
  const [desktopJoke, setDesktopJoke] = useState('');
  const nextId = useRef(1);
  const toastTimer = useRef(null);
  const desktopRef = useRef(null);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('popup-apocalypse-best') || 0));
  const [endingsFound, setEndingsFound] = useState(() => {
    try { return JSON.parse(localStorage.getItem('popup-apocalypse-endings') || '[]'); }
    catch { return []; }
  });

  const showToast = useCallback((message) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2400);
  }, []);

  const spawnPopup = useCallback((custom = null, options = {}) => {
    if (ending && !options.allowAfterEnding) return;
    const template = custom || POPUPS[Math.floor(Math.random() * POPUPS.length)];
    const id = nextId.current++;
    const width = Math.min(360, Math.max(286, (desktopRef.current?.clientWidth || window.innerWidth) - 30));
    const desktopWidth = desktopRef.current?.clientWidth || window.innerWidth;
    const desktopHeight = desktopRef.current?.clientHeight || window.innerHeight - 120;
    const popupWidth = Math.min(width, desktopWidth - 20);
    const popupHeight = 185;
    const x = Math.max(8, Math.random() * Math.max(8, desktopWidth - popupWidth - 8));
    const y = Math.max(8, Math.random() * Math.max(8, desktopHeight - popupHeight - 8));
    setPopups(old => [...old, { ...template, id, x, y, z: zCounter + id, width: popupWidth, wobble: Math.random() > 0.6 }]);
    setZCounter(v => v + 1);
    if (!template.starter) {
      setChaos(v => Math.min(100, v + (template.chaos || 5)));
      setPatience(v => Math.max(0, v - 2));
    }
  }, [ending, zCounter]);

  const beginGame = () => {
    setStarted(true);
    setPopups([]);
    setEnding(null);
    setChaos(4);
    setPatience(100);
    setScore(0);
    setClicks(0);
    setClosedCount(0);
    setDesktopJoke('System status: suspiciously normal.');
    showToast('Welcome aboard. Your patience has been notified. 🫡');
    setTimeout(() => spawnPopup({
      title: 'Welcome to Popup Apocalypse',
      icon: 'info',
      message: 'The rules are simple: survive the pop-ups, discover secrets, and do not trust anything labelled “Cancel”.',
      buttons: ['Understood', 'I trust Cancel'],
      chaos: 2
    }), 250);
  };

  const restartGame = () => {
    setPopups([]);
    setChaos(0);
    setPatience(100);
    setClosedCount(0);
    setClicks(0);
    setScore(0);
    setEnding(null);
    setStarted(false);
    setStartMenu(false);
    setTaskManager(false);
    setWhackOpen(false);
    setWhackRunning(false);
    setWhackScore(0);
    setWhackTime(15);
    setDesktopJoke('All systems normal. This is probably fine.');
    nextId.current = 1;
    showToast('System restarted. Your browser has trust issues now.');
  };

  const finishGame = useCallback((type, title, description) => {
    setEnding({ type, title, description });
    const newScore = score + closedCount * 10 + clicks * 2 + whackScore * 5;
    setScore(newScore);
    setBestScore(old => {
      const best = Math.max(old, newScore);
      localStorage.setItem('popup-apocalypse-best', String(best));
      return best;
    });
    setEndingsFound(old => {
      const next = old.includes(type) ? old : [...old, type];
      localStorage.setItem('popup-apocalypse-endings', JSON.stringify(next));
      return next;
    });
    setPopups([]);
    setStartMenu(false);
    setTaskManager(false);
    setWhackOpen(false);
  }, [score, closedCount, clicks, whackScore]);

  const closePopup = (id, reward = true) => {
    setPopups(old => old.filter(p => p.id !== id));
    if (reward) {
      setClosedCount(v => v + 1);
      setScore(v => v + 10);
      setPatience(v => Math.min(100, v + 1));
      setChaos(v => Math.max(0, v - 1));
      setDesktopJoke(['One window down. Approximately 47 remain.', 'Excellent clicking. Your ancestors are proud.', 'The pop-up has been returned to the void.', 'You closed a window. The website took that personally.'][Math.floor(Math.random() * 4)]);
    }
  };

  const handlePopupButton = (popup, button) => {
    setClicks(v => v + 1);
    setScore(v => v + 2);
    if (popup.starter || /begin|fear nothing/i.test(button)) {
      closePopup(popup.id, false);
      setStarted(true);
      setChaos(v => Math.min(100, v + 4));
      showToast('The chaos engine is now online.');
      spawnPopup();
      return;
    }
    if (/cancel/i.test(button) && Math.random() > 0.35) {
      closePopup(popup.id, false);
      spawnPopup({
        title: 'Cancellation of Cancellation',
        icon: 'warning',
        message: 'You cancelled the cancellation. The cancellation department is confused.',
        buttons: ['Cancel again', 'I accept my fate'],
        chaos: 8
      });
      return;
    }
    if (/fix everything|allow chaos|install|restore|refresh reality|search for it/i.test(button)) {
      closePopup(popup.id, false);
      spawnPopup();
      spawnPopup();
      showToast('Excellent. You have made the situation worse.');
      return;
    }
    closePopup(popup.id, false);
    setDesktopJoke(`${button} selected. Your decision has been recorded and judged.`);
    if (Math.random() > 0.4) spawnPopup();
  };

  const onWindowPointerDown = (event, popup) => {
    if (event.target.closest('button')) return;
    setDrag({ id: popup.id, dx: event.clientX - popup.x, dy: event.clientY - popup.y });
    setZCounter(v => v + 1);
    setPopups(old => old.map(p => p.id === popup.id ? { ...p, z: zCounter + 10 } : p));
  };

  useEffect(() => {
    if (!drag) return;
    const move = (event) => {
      const bounds = desktopRef.current?.getBoundingClientRect();
      if (!bounds) return;
      setPopups(old => old.map(p => p.id === drag.id ? {
        ...p,
        x: Math.max(0, Math.min(bounds.width - p.width, event.clientX - bounds.left - drag.dx)),
        y: Math.max(0, Math.min(bounds.height - 80, event.clientY - bounds.top - drag.dy))
      } : p));
    };
    const stop = () => setDrag(null);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
    };
  }, [drag]);

  useEffect(() => {
    if (!started || ending) return;
    const timer = window.setInterval(() => {
      setChaos(old => {
        const next = Math.min(100, old + (popups.length > 3 ? 2 : 1));
        if (next >= 100) {
          setTimeout(() => finishGame('apocalypse', 'THE APOCALYPSE IS HERE', 'You opened so many windows that the desktop has achieved sentience. It has filed a complaint against you.'), 0);
        }
        return next;
      });
    }, 3500);
    return () => window.clearInterval(timer);
  }, [started, ending, popups.length, finishGame]);

  useEffect(() => {
    if (!started || ending) return;
    if (patience <= 0) finishGame('patience', 'PATIENCE.EXE HAS STOPPED', 'You ran out of patience. The computer would like to speak to your manager.');
  }, [patience, started, ending, finishGame]);

  useEffect(() => {
    if (!whackRunning) return;
    const timer = window.setInterval(() => setWhackTime(t => Math.max(0, t - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [whackRunning]);

  useEffect(() => {
    if (whackRunning && whackTime <= 0) {
      setWhackRunning(false);
      showToast(`Mini-game over! Score: ${whackScore}. Your mouse needs a holiday.`);
    }
  }, [whackTime, whackRunning, whackScore, showToast]);

  useEffect(() => {
    if (!started || ending) return;
    const timer = window.setInterval(() => {
      if (Math.random() > 0.58 && popups.length < 12) spawnPopup();
    }, Math.max(2600, 7000 - chaos * 42));
    return () => window.clearInterval(timer);
  }, [started, ending, popups.length, chaos, spawnPopup]);

  const processList = useMemo(() => [
    ['Popup.exe', Math.min(99, 18 + popups.length * 7), 'Running'],
    ['Annoyance.exe', Math.min(99, chaos + 20), 'Running'],
    ['CommonSense.exe', chaos > 40 ? 0 : 7, chaos > 40 ? 'Not responding' : 'Running'],
    ['Patience.exe', patience, patience < 20 ? 'Critical' : 'Running'],
    ['Whack-a-Popup.exe', whackRunning ? 35 : 0, whackRunning ? 'Running' : 'Sleeping']
  ], [popups.length, chaos, patience, whackRunning]);

  const showEnding = () => finishGame('escape', 'YOU ESCAPED. SOMEHOW.', 'You shut down the chaos engine. The desktop is quiet. Too quiet. You may now return to your regularly scheduled chaos.');

  const startWhack = () => {
    setWhackScore(0);
    setWhackTime(15);
    setWhackRunning(true);
    setWhackOpen(true);
  };

  const randomWhack = () => {
    setWhackScore(s => s + 1);
    setScore(s => s + 5);
    if (Math.random() > 0.65) showToast('Popup eliminated. Another one has already lawyered up.');
  };

  return (
    <div className="game-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-icon"><Monitor size={22}/></span><div><b>Popup Apocalypse</b><small>Windows XP-ish · Totally safe-ish</small></div></div>
        <div className="top-actions">
          <span className={`status-pill ${started && !ending ? 'running' : ''}`}><span/>{ending ? 'SESSION ENDED' : started ? 'CHAOS RUNNING' : 'SYSTEM IDLE'}</span>
          <button className="toolbar-btn" onClick={restartGame} title="Restart game"><RefreshCw size={16}/><span>Restart</span></button>
        </div>
      </header>

      <main className="desktop-wrap">
        <div className="desktop" ref={desktopRef} onClick={() => startMenu && setStartMenu(false)}>
          <div className="wallpaper-glow"/>
          <div className="desktop-icons">
            <button className="desktop-icon" onClick={(e) => {e.stopPropagation(); setDesktopJoke('My Computer: 4 suspicious folders and one questionable life choice.'); spawnPopup({title:'My Computer',icon:'info',message:'Local Disk (C:) is 99% full of unfinished plans.',buttons:['Inspect files','Close'],chaos:3})}}>
              <span className="xp-icon computer"><Monitor size={28}/></span><span>My Computer</span>
            </button>
            <button className="desktop-icon" onClick={(e) => {e.stopPropagation(); spawnPopup({title:'Recycle Bin',icon:'info',message:'The bin contains: Motivation, Weekend Plans, and 16 “final_final_v3” files.',buttons:['Restore motivation','Empty bin'],chaos:4})}}>
              <span className="xp-icon recycle"><Trash2 size={27}/></span><span>Recycle Bin</span>
            </button>
            <button className="desktop-icon" onClick={(e) => {e.stopPropagation(); setTaskManager(true); setStartMenu(false)}}>
              <span className="xp-icon task"><Cpu size={27}/></span><span>Task Manager</span>
            </button>
            <button className="desktop-icon" onClick={(e) => {e.stopPropagation(); startWhack(); setStartMenu(false)}}>
              <span className="xp-icon game"><Gamepad2 size={27}/></span><span>Whack-a-Popup</span>
            </button>
            <button className="desktop-icon" onClick={(e) => {e.stopPropagation(); setDesktopJoke('Internet Explorer: The loading bar is a lifestyle, not a promise.'); spawnPopup({title:'Internet Explorer',icon:'info',message:'Would you like to make Internet Explorer your default browser? This question will return every 11 minutes.',buttons:['Absolutely not','Maybe in 2004'],chaos:5})}}>
              <span className="xp-icon ie"><span>e</span></span><span>Internet Explorer</span>
            </button>
            <button className="desktop-icon" onClick={(e) => {e.stopPropagation(); spawnPopup({title:'Notepad',icon:'info',message:'Untitled - Notepad\\n\\nDear diary, I tried to close one popup and accidentally founded a popup-based economy.',buttons:['Save feelings','Discard'],chaos:3})}}>
              <span className="xp-icon note"><FileText size={27}/></span><span>Notepad.exe</span>
            </button>
          </div>

          <div className="desktop-status">
            <div className="status-card">
              <div className="status-title"><span className="led"/> SYSTEM CHAOS <b>{chaos}%</b></div>
              <div className="meter"><span className="chaos-fill" style={{width:`${chaos}%`}}/></div>
              <div className="status-title patience-title"><span>🧠</span> USER PATIENCE <b>{patience}%</b></div>
              <div className="meter"><span className="patience-fill" style={{width:`${patience}%`}}/></div>
              <div className="status-stats"><span>Closed: {closedCount}</span><span>Score: {score}</span></div>
            </div>
          </div>

          {!started && !ending && <div className="welcome-window">
            <div className="window-title"><span><Monitor size={14}/> Popup Apocalypse Setup</span><div><button disabled><Minus size={12}/></button><button disabled><Maximize2 size={11}/></button><button onClick={beginGame}><X size={13}/></button></div></div>
            <div className="welcome-content">
              <div className="welcome-logo"><AlertTriangle size={38}/></div>
              <div><h1>Welcome to Popup Apocalypse</h1><p>A harmless desktop simulation where pop-ups multiply, buttons get suspicious, and your patience becomes a high score.</p></div>
              <div className="welcome-tip"><ShieldCheck size={17}/> All effects stay inside this webpage. No real system alerts or settings are touched.</div>
              <button className="xp-button primary" onClick={beginGame}>Begin the chaos <span>›</span></button>
            </div>
          </div>}

          {started && !ending && <div className="desktop-hint"><Sparkles size={14}/>{desktopJoke || 'Welcome to the chaos. Try clicking desktop icons.'}</div>}

          {popups.map(p => (
            <div key={p.id} className={`popup-window ${p.wobble ? 'wobble' : ''}`} style={{left:p.x,top:p.y,width:p.width,zIndex:p.z}} onPointerDown={(e) => onWindowPointerDown(e,p)}>
              <div className="window-title"><span>{p.icon === 'error' ? <AlertTriangle size={13} color="#fff"/> : p.icon === 'warning' ? <ShieldAlert size={13} color="#fff"/> : <Info size={13} color="#fff"/>}{p.title}</span><div className="window-controls"><button title="Minimize" onClick={(e) => {e.stopPropagation(); closePopup(p.id,false); showToast('Window minimized into the void.')}}><Minus size={11}/></button><button title="Maximize" onClick={(e) => {e.stopPropagation(); setPopups(old => old.map(item => item.id === p.id ? {...item,x:4,y:4,width:Math.min(500,(desktopRef.current?.clientWidth || 500)-8)} : item));}}><Maximize2 size={10}/></button><button title="Close" onClick={(e) => {e.stopPropagation();closePopup(p.id);}}><X size={12}/></button></div></div>
              <div className="popup-body">
                <div className="popup-message">{iconFor(p.icon, 34)}<p>{p.message}</p></div>
                <div className="popup-buttons">{p.buttons.map(button => <button className="xp-button" key={button} onClick={(e) => {e.stopPropagation();handlePopupButton(p,button)}}>{button}</button>)}</div>
              </div>
            </div>
          ))}

          {taskManager && <div className="utility-window task-manager">
            <div className="window-title"><span><Cpu size={13}/> Windows Task Manager (Definitely Real)</span><div className="window-controls"><button onClick={() => setTaskManager(false)}><X size={12}/></button></div></div>
            <div className="utility-content"><div className="task-tabs"><span className="selected">Processes</span><span>Performance</span><span>Networking</span></div><div className="process-table"><div className="process-row head"><span>Image Name</span><span>CPU</span><span>Status</span></div>{processList.map(([name,cpu,status]) => <div className="process-row" key={name}><span>{name}</span><span>{cpu}%</span><span className={status !== 'Running' && status !== 'Sleeping' ? 'danger-text' : ''}>{status}</span></div>)}</div><div className="task-footer"><span>Processes: {processList.length}</span><button className="xp-button" onClick={() => {setTaskManager(false);setPopups([]);setChaos(v=>Math.max(0,v-12));setPatience(v=>Math.min(100,v+8));showToast('You ended Annoyance.exe. It restarted with a promotion.');spawnPopup({title:'Process Restarted',icon:'warning',message:'Annoyance.exe has restarted with administrator privileges. Who approved this?',buttons:['Ask HR','Close'],chaos:3})}}>End Process</button></div></div>
          </div>}

          {whackOpen && <div className="utility-window whack-window">
            <div className="window-title"><span><Gamepad2 size={13}/> Whack-a-Popup.exe</span><div className="window-controls"><button onClick={() => {setWhackOpen(false);setWhackRunning(false)}}><X size={12}/></button></div></div>
            <div className="whack-content"><div className="whack-stats"><span>Time: <b>{whackTime}s</b></span><span>Score: <b>{whackScore}</b></span></div><p>{whackRunning ? 'Click the pop-up before it files a complaint.' : '15 seconds. One mouse. Questionable life choices.'}</p><div className="whack-grid">{Array.from({length:9},(_,i)=><button key={i} className={`whack-hole ${whackRunning && (i === (whackScore * 7 + whackTime * 3) % 9) ? 'active' : ''}`} onClick={() => {if(whackRunning && i === (whackScore * 7 + whackTime * 3) % 9) randomWhack(); else if(whackRunning) setPatience(v=>Math.max(0,v-2))}}>{whackRunning && i === (whackScore * 7 + whackTime * 3) % 9 ? <AlertTriangle size={21}/> : null}</button>)}</div><button className="xp-button primary" onClick={() => whackRunning ? (setWhackRunning(false),showToast(`Final score: ${whackScore}`)) : startWhack()}>{whackRunning ? 'Give up gracefully' : 'Start 15-second round'}</button></div>
          </div>}

          {ending && <div className="ending-overlay"><div className="ending-card"><div className="ending-symbol">{ending.type === 'escape' ? <Trophy size={42}/> : <Skull size={42}/>}</div><span className="ending-kicker">SESSION COMPLETE</span><h2>{ending.title}</h2><p>{ending.description}</p><div className="ending-score"><div><small>FINAL SCORE</small><b>{score}</b></div><div><small>BEST SCORE</small><b>{bestScore}</b></div><div><small>ENDINGS FOUND</small><b>{endingsFound.length + (endingsFound.includes(ending.type) ? 0 : 1)}/3</b></div></div><div className="ending-actions"><button className="xp-button primary" onClick={restartGame}><RefreshCw size={14}/> Play again</button><button className="xp-button" onClick={() => {setEnding(null);setStarted(true);setChaos(10);setPatience(100);showToast('New session. Trust no button.')}}>Free play</button></div></div></div>}

          {startMenu && <div className="start-menu" onClick={e => e.stopPropagation()}><div className="start-user"><span className="user-avatar"><Smile size={25}/></span><b>Definitely Not Admin</b></div><div className="start-menu-body"><div className="start-left"><button onClick={() => {setTaskManager(true);setStartMenu(false)}}><Cpu size={20}/> Task Manager</button><button onClick={() => {startWhack();setStartMenu(false)}}><Gamepad2 size={20}/> Games</button><button onClick={() => {spawnPopup();setStartMenu(false)}}><Folder size={20}/> My Documents</button><button onClick={() => {setDesktopJoke('Control Panel says: have you tried turning your expectations off and on again?');spawnPopup({title:'Control Panel',icon:'info',message:'Which setting would you like to change? Your patience? Your past? Your browser tabs?',buttons:['Change everything','Cancel'],chaos:4});setStartMenu(false)}}><Settings size={20}/> Control Panel</button></div><div className="start-right"><button onClick={() => {setDesktopJoke('Recent documents: final_final_REAL.docx, definitely_done.docx, help.txt');showToast('Recent documents opened. None are finished.');setStartMenu(false)}}><FileText size={17}/> Recent Documents</button><button onClick={() => {setStartMenu(false);showToast('Help is on the way. It got stuck in traffic.')}}><CircleHelp size={17}/> Help and Support</button><button onClick={() => {setStartMenu(false);showToast('Search results: 0 solutions, 17 more questions.')}}><Search size={17}/> Search</button></div></div><div className="start-menu-footer"><button onClick={() => {setStartMenu(false);showToast('Log off? In this economy?')}}><Power size={17}/> Log Off</button><button onClick={restartGame}><Power size={17}/> Shut Down</button></div></div>}
        </div>

        <div className="taskbar">
          <button className="start-button" onClick={() => setStartMenu(v => !v)}><span className="windows-flag"><i/><i/><i/><i/></span> start</button>
          <button className="taskbar-app active" onClick={() => {setStarted(true);setEnding(null)}}><Monitor size={15}/> Popup Apocalypse</button>
          {taskManager && <button className="taskbar-app" onClick={() => setTaskManager(false)}><Cpu size={15}/> Task Manager</button>}
          {whackOpen && <button className="taskbar-app" onClick={() => setWhackOpen(false)}><Gamepad2 size={15}/> Whack-a-Popup</button>}
          <div className="taskbar-spacer"/>
          <div className="tray"><Wifi size={14}/><Volume2 size={14}/><BatteryCharging size={14}/><span>{new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span></div>
        </div>
      </main>

      <section className="below-desktop">
        <div className="how-it-works"><span className="eyebrow"><Sparkles size={13}/> THE OBJECTIVE</span><h2>Can you survive the desktop?</h2><p>Close windows to earn points, use Task Manager to fight back, and find the secret escape. Every effect is contained in this game — your actual browser stays safe.</p><div className="objective-cards"><div><MousePointer2/><b>Click carefully</b><small>Some buttons create more chaos.</small></div><div><Cpu/><b>Use Task Manager</b><small>End processes for temporary relief.</small></div><div><Trophy/><b>Find endings</b><small>Escape, survive, or cause total chaos.</small></div></div></div>
        <div className="scoreboard"><span className="eyebrow"><Trophy size={13}/> YOUR RECORD</span><div className="record-number">{bestScore}</div><p>Best score saved on this device</p><div className="ending-chips">{['escape','patience','apocalypse'].map(id=><span className={endingsFound.includes(id)?'found':''} key={id}>{endingsFound.includes(id)?'✓':'?'} {id==='escape'?'Escape Artist':id==='patience'?'Patience.exe':'Apocalypse'}</span>)}</div><button className="reset-record" onClick={() => {localStorage.removeItem('popup-apocalypse-best');localStorage.removeItem('popup-apocalypse-endings');setBestScore(0);setEndingsFound([]);showToast('Record cleared. A fresh start. Suspicious.')}}>Reset saved record</button></div>
      </section>
      <footer className="footer"><span>POPUP APOCALYPSE © 2004-ish</span><span>All chaos contained within this webpage. No actual system settings touched.</span><button onClick={restartGame}><RefreshCw size={13}/> Restart session</button></footer>
      {toast && <div className="toast"><Check size={15}/>{toast}</div>}
    </div>
  );
}

export default App;
