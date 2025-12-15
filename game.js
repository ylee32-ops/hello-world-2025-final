import React, { useState, useRef } from 'react';

const EVENTS = [
  {
    id: 1,
    title: "Minimum Wage → $20/hour",
    description: "City Council proposes raising minimum wage from $15 to $20. Workers can't afford rent. Small businesses warn of closures.",
    optionA: {
      text: "SUPPORT: Raise to $20",
      metricChanges: { treasury: -10, publicTrust: 15, intlReputation: 5, socialStability: 10 },
      characterImpacts: [
        { id: "B5", change: 20 }, { id: "C9", change: 18 }, { id: "A1", change: 12 },
        { id: "A2", change: 15 }, { id: "B7", change: -15 }, { id: "A4", change: -20 }
      ]
    },
    optionB: {
      text: "OPPOSE: Keep at $15",
      metricChanges: { treasury: 8, publicTrust: -12, intlReputation: -3, socialStability: -8 },
      characterImpacts: [
        { id: "B7", change: 18 }, { id: "A4", change: 20 }, { id: "C11", change: 10 },
        { id: "B5", change: -20 }, { id: "C9", change: -18 }, { id: "A1", change: -12 }
      ]
    }
  },
  {
    id: 2,
    title: "Police Budget: Cut 50%?",
    description: "Activists demand police budget cuts. Police union warns crime will surge.",
    optionA: {
      text: "CUT: Reduce 50%",
      metricChanges: { treasury: 20, publicTrust: -15, intlReputation: 10, socialStability: -20 },
      characterImpacts: [
        { id: "C9", change: 25 }, { id: "D13", change: 22 }, { id: "A2", change: 15 },
        { id: "B8", change: -30 }, { id: "A1", change: -12 }, { id: "B6", change: -10 }
      ]
    },
    optionB: {
      text: "MAINTAIN: Keep funding",
      metricChanges: { treasury: -12, publicTrust: 8, intlReputation: -5, socialStability: 15 },
      characterImpacts: [
        { id: "B8", change: 25 }, { id: "A1", change: 12 }, { id: "B6", change: 15 },
        { id: "C9", change: -25 }, { id: "D13", change: -22 }, { id: "A2", change: -10 }
      ]
    }
  },
  {
    id: 3,
    title: "Amazon HQ2: Tax Breaks?",
    description: "Amazon wants $3B in tax breaks for Queens HQ. 25K jobs vs corporate welfare?",
    optionA: {
      text: "YES: Give tax breaks",
      metricChanges: { treasury: -15, publicTrust: -10, intlReputation: 15, socialStability: 5 },
      characterImpacts: [
        { id: "A4", change: 20 }, { id: "C11", change: 18 }, { id: "B7", change: 12 },
        { id: "C9", change: -20 }, { id: "A2", change: -15 }, { id: "B5", change: -12 }
      ]
    },
    optionB: {
      text: "NO: Reject Amazon",
      metricChanges: { treasury: 5, publicTrust: 8, intlReputation: -12, socialStability: -5 },
      characterImpacts: [
        { id: "C9", change: 22 }, { id: "A2", change: 18 }, { id: "B5", change: 15 },
        { id: "A4", change: -22 }, { id: "C11", change: -20 }, { id: "B7", change: -10 }
      ]
    }
  },
  {
    id: 4,
    title: "Rent Control Expansion",
    description: "Expand rent control to all buildings? Tenants want it. Landlords threaten no maintenance.",
    optionA: {
      text: "EXPAND: All buildings",
      metricChanges: { treasury: -8, publicTrust: 18, intlReputation: 5, socialStability: 12 },
      characterImpacts: [
        { id: "C9", change: 25 }, { id: "B5", change: 20 }, { id: "A2", change: 18 },
        { id: "D14", change: 22 }, { id: "B7", change: -18 }, { id: "A4", change: -25 }
      ]
    },
    optionB: {
      text: "STATUS QUO: No expansion",
      metricChanges: { treasury: 5, publicTrust: -15, intlReputation: 8, socialStability: -10 },
      characterImpacts: [
        { id: "B7", change: 20 }, { id: "A4", change: 22 }, { id: "C11", change: 12 },
        { id: "C9", change: -25 }, { id: "B5", change: -20 }, { id: "A2", change: -15 }
      ]
    }
  },
  {
    id: 5,
    title: "Subway Fare: $3 → $4?",
    description: "MTA needs money for repairs. Raise subway fare?",
    optionA: {
      text: "RAISE: $3 → $4",
      metricChanges: { treasury: 15, publicTrust: -18, intlReputation: -5, socialStability: -12 },
      characterImpacts: [
        { id: "B7", change: 10 }, { id: "A4", change: 12 },
        { id: "A1", change: -20 }, { id: "B5", change: -22 }, { id: "C9", change: -25 }
      ]
    },
    optionB: {
      text: "FREEZE: Keep at $3",
      metricChanges: { treasury: -20, publicTrust: 15, intlReputation: 3, socialStability: 10 },
      characterImpacts: [
        { id: "A1", change: 20 }, { id: "B5", change: 22 }, { id: "C9", change: 25 },
        { id: "B7", change: -8 }, { id: "A4", change: -10 }
      ]
    }
  },
  {
    id: 6,
    title: "Green New Deal NYC",
    description: "Ban fossil fuels by 2030? Climate activists say emergency. Unions worry about jobs.",
    optionA: {
      text: "YES: Ban by 2030",
      metricChanges: { treasury: -25, publicTrust: 10, intlReputation: 20, socialStability: -8 },
      characterImpacts: [
        { id: "D13", change: 30 }, { id: "C9", change: 20 }, { id: "A2", change: 15 },
        { id: "A1", change: -18 }, { id: "B7", change: -15 }, { id: "A4", change: -22 }
      ]
    },
    optionB: {
      text: "NO: Gradual transition",
      metricChanges: { treasury: -5, publicTrust: -8, intlReputation: -10, socialStability: 5 },
      characterImpacts: [
        { id: "A1", change: 15 }, { id: "B7", change: 18 }, { id: "A4", change: 20 },
        { id: "D13", change: -30 }, { id: "C9", change: -18 }, { id: "A2", change: -12 }
      ]
    }
  },
  {
    id: 7,
    title: "Public Housing Crisis",
    description: "NYCHA buildings failing. $40B repair backlog. Privatize or massive public investment?",
    optionA: {
      text: "PRIVATIZE: Sell to developers",
      metricChanges: { treasury: 30, publicTrust: -20, intlReputation: -8, socialStability: -15 },
      characterImpacts: [
        { id: "A4", change: 25 }, { id: "B7", change: 20 }, { id: "C11", change: 15 },
        { id: "C9", change: -28 }, { id: "B5", change: -25 }, { id: "D14", change: -30 }
      ]
    },
    optionB: {
      text: "INVEST: $40B public funding",
      metricChanges: { treasury: -35, publicTrust: 20, intlReputation: 8, socialStability: 15 },
      characterImpacts: [
        { id: "C9", change: 28 }, { id: "B5", change: 25 }, { id: "D14", change: 30 },
        { id: "A4", change: -25 }, { id: "B7", change: -18 }, { id: "C11", change: -12 }
      ]
    }
  },
  {
    id: 8,
    title: "Stop-and-Frisk Return?",
    description: "Crime up 15%. Police union wants stop-and-frisk back. Civil rights groups oppose.",
    optionA: {
      text: "RESTORE: Bring it back",
      metricChanges: { treasury: 5, publicTrust: -18, intlReputation: -15, socialStability: -20 },
      characterImpacts: [
        { id: "B8", change: 30 }, { id: "A1", change: 10 }, { id: "B6", change: 12 },
        { id: "C9", change: -35 }, { id: "A2", change: -25 }, { id: "D14", change: -28 }
      ]
    },
    optionB: {
      text: "REFUSE: Community policing",
      metricChanges: { treasury: -10, publicTrust: 12, intlReputation: 10, socialStability: 8 },
      characterImpacts: [
        { id: "C9", change: 30 }, { id: "A2", change: 22 }, { id: "D14", change: 25 },
        { id: "B8", change: -25 }, { id: "A1", change: -8 }, { id: "B6", change: -10 }
      ]
    }
  },
  {
    id: 9,
    title: "Congestion Pricing",
    description: "Charge $15 to drive into Manhattan. MTA needs revenue. Outer borough residents angry.",
    optionA: {
      text: "IMPLEMENT: $15 charge",
      metricChanges: { treasury: 25, publicTrust: -15, intlReputation: 12, socialStability: -10 },
      characterImpacts: [
        { id: "D13", change: 25 }, { id: "A2", change: 18 }, { id: "C11", change: 15 },
        { id: "A1", change: -20 }, { id: "B7", change: -22 }, { id: "B6", change: -18 }
      ]
    },
    optionB: {
      text: "CANCEL: No charge",
      metricChanges: { treasury: -20, publicTrust: 10, intlReputation: -8, socialStability: 5 },
      characterImpacts: [
        { id: "A1", change: 20 }, { id: "B7", change: 22 }, { id: "B6", change: 18 },
        { id: "D13", change: -25 }, { id: "A2", change: -15 }, { id: "C11", change: -12 }
      ]
    }
  },
  {
    id: 10,
    title: "Sanctuary City Status",
    description: "Federal government threatens to cut funding unless NYC cooperates with ICE.",
    optionA: {
      text: "COOPERATE: Work with ICE",
      metricChanges: { treasury: 15, publicTrust: -25, intlReputation: -20, socialStability: -18 },
      characterImpacts: [
        { id: "B8", change: 20 }, { id: "A4", change: 15 }, { id: "B7", change: 12 },
        { id: "C9", change: -35 }, { id: "A2", change: -30 }, { id: "B5", change: -32 }
      ]
    },
    optionB: {
      text: "RESIST: Keep sanctuary status",
      metricChanges: { treasury: -18, publicTrust: 20, intlReputation: 15, socialStability: 12 },
      characterImpacts: [
        { id: "C9", change: 35 }, { id: "A2", change: 30 }, { id: "B5", change: 32 },
        { id: "B8", change: -18 }, { id: "A4", change: -12 }, { id: "B7", change: -10 }
      ]
    }
  }
];

const CHARACTERS = [
  { id: "A1", name: "Sal", title: "Union Boss", icon: "🚇" },
  { id: "A2", name: "Keisha", title: "Councilwoman", icon: "🏛️" },
  { id: "A4", name: "Robert", title: "Developer", icon: "⛪" },
  { id: "B5", name: "Carlos", title: "Organizer", icon: "🍽️" },
  { id: "B6", name: "Lily", title: "Mom", icon: "🏥" },
  { id: "B7", name: "George", title: "Business", icon: "🍴" },
  { id: "B8", name: "Sean", title: "Police", icon: "👮" },
  { id: "C9", name: "Alex", title: "Activist", icon: "📦" },
  { id: "C11", name: "Priya", title: "Tech", icon: "💻" },
  { id: "D13", name: "Maria", title: "Climate", icon: "🌍" },
  { id: "D14", name: "River", title: "Student", icon: "📱" },
  { id: "A3", name: "Mike", title: "Worker", icon: "🔧" },
  { id: "B4", name: "Sarah", title: "Teacher", icon: "📚" },
  { id: "C10", name: "Jay", title: "Artist", icon: "🎨" },
  { id: "D15", name: "Emma", title: "Nurse", icon: "💉" },
  { id: "D16", name: "Tom", title: "Veteran", icon: "🎖️" }
];

export default function DraggableGame() {
  const [state, setState] = useState("MENU");
  const [event, setEvent] = useState(0);
  const [metrics, setMetrics] = useState({
    treasury: 50, publicTrust: 50, intlReputation: 50, socialStability: 50
  });
  const [chars, setChars] = useState(CHARACTERS.map(c => ({ ...c, support: 0 })));
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const start = () => {
    setState("PLAY");
    setEvent(0);
    setMetrics({ treasury: 50, publicTrust: 50, intlReputation: 50, socialStability: 50 });
    setChars(CHARACTERS.map(c => ({ ...c, support: 0 })));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    dragStartPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;
    setDragPos({ x: deltaX, y: deltaY });

    if (deltaX < -100) {
      setHoveredOption("A");
    } else if (deltaX > 100) {
      setHoveredOption("B");
    } else {
      setHoveredOption(null);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartPos.current.x;
    const deltaY = touch.clientY - dragStartPos.current.y;
    setDragPos({ x: deltaX, y: deltaY });

    if (deltaX < -100) {
      setHoveredOption("A");
    } else if (deltaX > 100) {
      setHoveredOption("B");
    } else {
      setHoveredOption(null);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragPos.x) > 150) {
      const option = dragPos.x < 0 ? EVENTS[event].optionA : EVENTS[event].optionB;
      const label = dragPos.x < 0 ? "A" : "B";
      choose(option, label);
    }

    setDragPos({ x: 0, y: 0 });
    setHoveredOption(null);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const choose = (opt, label) => {
    const newM = { ...metrics };
    Object.keys(opt.metricChanges).forEach(k => {
      newM[k] = Math.max(0, Math.min(100, newM[k] + opt.metricChanges[k]));
    });
    
    const newC = [...chars];
    opt.characterImpacts.forEach(imp => {
      const c = newC.find(x => x.id === imp.id);
      if (c) {
        c.support = Math.max(-100, Math.min(100, c.support + imp.change));
      }
    });
    
    setMetrics(newM);
    setChars(newC);
    
    // Check game end conditions immediately
    if (Object.values(newM).some(v => v <= 0)) {
      setState("GAMEOVER");
    } else if (event + 1 >= EVENTS.length) {
      setState("RESULTS");
    } else {
      setEvent(event + 1);
    }
  };

  const getCharColor = (char) => {
    if (!hoveredOption) return "#2a2a2a";
    
    const option = hoveredOption === "A" ? EVENTS[event].optionA : EVENTS[event].optionB;
    const impact = option.characterImpacts.find(imp => imp.id === char.id);
    
    if (!impact) return "#2a2a2a";
    if (impact.change > 0) return "#4a5f4a";
    if (impact.change < 0) return "#5f3a3a";
    return "#2a2a2a";
  };

  if (state === "MENU") {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', 
        color: '#d4d4d4', 
        fontFamily: '"Courier New", monospace', 
        minHeight: '100vh', 
        padding: '40px', 
        textAlign: 'center' 
      }}>
        <h1 style={{ fontSize: '36px', marginBottom: '20px', color: '#e8e8e8', fontWeight: 'normal', letterSpacing: '2px' }}>
          NYC MAYOR
        </h1>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: '#0f1419', padding: '30px', borderRadius: '4px', border: '1px solid #2a2a2a' }}>
          <p style={{ fontSize: '16px', marginBottom: '20px', lineHeight: '1.8' }}>
            Navigate 10 political events as NYC mayor. Drag cards left or right to make decisions.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '30px', fontSize: '14px', color: '#888' }}>
            <div>← LEFT: Option A</div>
            <div>RIGHT: Option B →</div>
          </div>
          <p style={{ marginBottom: '30px', color: '#666', fontSize: '13px' }}>
            Keep all metrics above zero to survive
          </p>
          <button 
            onClick={start}
            style={{ 
              background: '#2a4a5a', 
              border: '1px solid #3a5a6a', 
              color: '#d4d4d4', 
              padding: '12px 36px', 
              fontSize: '16px', 
              cursor: 'pointer',
              fontFamily: '"Courier New", monospace',
              letterSpacing: '1px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#3a5a6a'}
            onMouseOut={(e) => e.target.style.background = '#2a4a5a'}
          >
            START
          </button>
        </div>
      </div>
    );
  }

  if (state === "PLAY") {
    const ev = EVENTS[event];
    const rotation = dragPos.x * 0.03;

    return (
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', 
          color: '#d4d4d4', 
          fontFamily: '"Courier New", monospace', 
          minHeight: '100vh', 
          padding: '20px',
          overflow: 'hidden',
          userSelect: 'none'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Metrics */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', justifyContent: 'center' }}>
          {Object.entries(metrics).map(([k, v]) => (
            <div key={k} style={{ flex: 1, maxWidth: '140px' }}>
              <div style={{ fontSize: '11px', marginBottom: '4px', color: '#666', letterSpacing: '0.5px' }}>
                {k.toUpperCase()}
              </div>
              <div style={{ background: '#0f1419', height: '6px', borderRadius: '1px', border: '1px solid #1a1a1a' }}>
                <div style={{ 
                  background: v < 25 ? '#9a5a5a' : '#5a6a5a', 
                  height: '100%', 
                  width: `${v}%`,
                  borderRadius: '1px'
                }} />
              </div>
              <div style={{ fontSize: '11px', marginTop: '3px', color: v < 25 ? '#9a5a5a' : '#7a8a7a' }}>
                {Math.round(v)}
              </div>
            </div>
          ))}
        </div>

        {/* Main Layout: Options and Card */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
          
          {/* Option A (Left) */}
          <div style={{ 
            background: hoveredOption === "A" ? 'rgba(80, 60, 60, 0.5)' : 'rgba(30, 30, 30, 0.4)',
            border: hoveredOption === "A" ? '2px solid #8a6a6a' : '1px solid #3a3a3a',
            padding: '20px', 
            borderRadius: '4px',
            transition: 'all 0.3s',
            width: '200px',
            minHeight: '120px'
          }}>
            <div style={{ fontSize: '11px', color: '#8a6a6a', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '1px' }}>
              ← OPTION A
            </div>
            <div style={{ fontSize: '13px', color: '#d4d4d4', lineHeight: '1.4' }}>{ev.optionA.text}</div>
          </div>

          {/* Event Card */}
          <div 
            style={{ 
              background: '#0f1419',
              border: '1px solid #3a3a3a',
              borderRadius: '4px',
              padding: '30px',
              width: '400px',
              cursor: isDragging ? 'grabbing' : 'grab',
              transform: `translate(${dragPos.x}px, ${dragPos.y}px) rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease',
              boxShadow: isDragging ? '0 15px 30px rgba(0,0,0,0.6)' : '0 5px 15px rgba(0,0,0,0.3)',
              touchAction: 'none'
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '12px', letterSpacing: '1px' }}>
              EVENT {event + 1} / {EVENTS.length}
            </div>
            <h2 style={{ fontSize: '18px', color: '#a8a8a8', marginBottom: '15px', fontWeight: 'normal' }}>
              {ev.title}
            </h2>
            <p style={{ fontSize: '13px', color: '#888', lineHeight: '1.6' }}>{ev.description}</p>
            <div style={{ marginTop: '20px', fontSize: '12px', color: '#555', textAlign: 'center', letterSpacing: '1px' }}>
              ← DRAG TO DECIDE →
            </div>
          </div>

          {/* Option B (Right) */}
          <div style={{ 
            background: hoveredOption === "B" ? 'rgba(60, 70, 80, 0.5)' : 'rgba(30, 30, 30, 0.4)',
            border: hoveredOption === "B" ? '2px solid #6a7a8a' : '1px solid #3a3a3a',
            padding: '20px', 
            borderRadius: '4px',
            transition: 'all 0.3s',
            width: '200px',
            minHeight: '120px'
          }}>
            <div style={{ fontSize: '11px', color: '#6a7a8a', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '1px' }}>
              OPTION B →
            </div>
            <div style={{ fontSize: '13px', color: '#d4d4d4', lineHeight: '1.4' }}>{ev.optionB.text}</div>
          </div>
        </div>

        {/* Characters Grid */}
        <div style={{ marginTop: '30px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(8, 1fr)', 
            gap: '6px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {chars.map(char => (
              <div 
                key={char.id}
                style={{
                  background: getCharColor(char),
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '2px',
                  fontSize: '22px',
                  transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                  transform: hoveredOption && getCharColor(char) !== "#2a2a2a" ? 'scale(1.1)' : 'scale(1)',
                  border: '1px solid #1a1a1a'
                }}
              >
                <div>{char.icon}</div>
                <div style={{ fontSize: '8px', marginTop: '3px', color: '#888' }}>{char.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (state === "RESULTS") {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', 
        color: '#d4d4d4', 
        fontFamily: '"Courier New", monospace', 
        minHeight: '100vh', 
        padding: '40px', 
        textAlign: 'center' 
      }}>
        <h1 style={{ fontSize: '36px', marginBottom: '20px', color: '#7a8a7a', fontWeight: 'normal' }}>
          TERM COMPLETE
        </h1>
        <p style={{ fontSize: '16px', marginBottom: '30px' }}>Survived all {EVENTS.length} events</p>
        
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          background: '#0f1419', 
          padding: '30px', 
          borderRadius: '4px',
          border: '1px solid #2a2a2a'
        }}>
          <h3 style={{ color: '#6a6a6a', marginBottom: '20px', fontSize: '13px', letterSpacing: '1px' }}>
            FINAL METRICS
          </h3>
          {Object.entries(metrics).map(([k, v]) => (
            <p key={k} style={{ 
              color: v < 50 ? '#9a8a6a' : '#7a8a7a', 
              fontSize: '15px', 
              marginBottom: '10px' 
            }}>
              {k}: {Math.round(v)}
            </p>
          ))}
        </div>

        <button 
          onClick={() => setState("MENU")}
          style={{ 
            background: '#2a4a5a', 
            border: '1px solid #3a5a6a', 
            color: '#d4d4d4', 
            padding: '12px 36px', 
            fontSize: '16px', 
            cursor: 'pointer',
            marginTop: '40px',
            fontFamily: '"Courier New", monospace',
            letterSpacing: '1px'
          }}
        >
          RETURN TO MENU
        </button>
      </div>
    );
  }

  if (state === "GAMEOVER") {
    const reason = metrics.treasury <= 0 ? "BANKRUPTCY" :
                   metrics.publicTrust <= 0 ? "NO CONFIDENCE" :
                   metrics.intlReputation <= 0 ? "INTERNATIONAL CRISIS" : "CIVIL UNREST";
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #2e1a1a 0%, #3e1616 100%)', 
        color: '#d4a4a4', 
        fontFamily: '"Courier New", monospace', 
        minHeight: '100vh', 
        padding: '40px', 
        textAlign: 'center' 
      }}>
        <h1 style={{ fontSize: '36px', marginBottom: '20px', color: '#c4a4a4', fontWeight: 'normal' }}>
          TERM ENDED
        </h1>
        <h2 style={{ color: '#9a7a7a', fontSize: '24px', marginBottom: '20px', fontWeight: 'normal' }}>
          {reason}
        </h2>
        <p style={{ color: '#888', fontSize: '15px', marginBottom: '30px' }}>
          Survived {event} of {EVENTS.length} events
        </p>
        
        <button 
          onClick={() => setState("MENU")}
          style={{ 
            background: '#5a3a3a', 
            border: '1px solid #6a4a4a', 
            color: '#d4d4d4', 
            padding: '12px 36px', 
            fontSize: '16px', 
            cursor: 'pointer',
            fontFamily: '"Courier New", monospace',
            letterSpacing: '1px'
          }}
        >
          TRY AGAIN
        </button>
      </div>
    );
  }
}