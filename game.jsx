// ===== NYC MAYOR GAME  =====

// ===== GAME STATES =====
const GAME_STATES = {
  MENU: "MENU",
  PLAY: "PLAY",
  RESULTS: "RESULTS",
  GAME_OVER: "GAME_OVER"
};

// ===== DEFAULT DATA (Fallback) =====
const DEFAULT_EVENTS = [
  {
    id: 1,
    title: "Minimum Wage → $20/hour",
    description: "City Council proposes raising minimum wage from $15 to $20. Workers can't afford rent. Small businesses warn of closures.",
    category: "economic",
    optionA: {
      text: "SUPPORT: Raise to $20",
      metricChanges: { treasury: -10, publicTrust: 15, intlReputation: 5, socialStability: 10 },
      characterImpacts: [
        { id: "B5", change: 20 }, { id: "C9", change: 18 },
        { id: "B7", change: -15 }, { id: "A4", change: -20 }
      ]
    },
    optionB: {
      text: "OPPOSE: Keep at $15",
      metricChanges: { treasury: 8, publicTrust: -12, intlReputation: -3, socialStability: -8 },
      characterImpacts: [
        { id: "B7", change: 18 }, { id: "A4", change: 20 },
        { id: "B5", change: -20 }, { id: "C9", change: -18 }
      ]
    }
  }
];

const DEFAULT_CHARACTERS = [
  { id: "A1", name: "Sal", title: "Union Boss", icon: "🚇" },
  { id: "A2", name: "Keisha", title: "Councilwoman", icon: "🏛️" },
  { id: "A3", name: "Mike", title: "Firefighter", icon: "🚒" },
  { id: "A4", name: "Robert", title: "Developer", icon: "⛪" },
  { id: "B5", name: "Carlos", title: "Organizer", icon: "🍽️" },
  { id: "B6", name: "Lily", title: "Mom", icon: "🏥" },
  { id: "B7", name: "George", title: "Business", icon: "🍴" },
  { id: "B8", name: "Sean", title: "Police", icon: "👮" },
  { id: "C9", name: "Alex", title: "Activist", icon: "📦" },
  { id: "C10", name: "Jay", title: "Artist", icon: "🎨" },
  { id: "C11", name: "Priya", title: "Tech", icon: "💻" },
  { id: "C12", name: "David", title: "Professional", icon: "💼" },
  { id: "D13", name: "Maria", title: "Climate", icon: "🌍" },
  { id: "D14", name: "River", title: "Student", icon: "📱" },
  { id: "D15", name: "Emma", title: "Nurse", icon: "💉" },
  { id: "D16", name: "Tom", title: "Veteran", icon: "🎖️" }
];

// ===== MAIN GAME COMPONENT =====
function NYCMayorGame() {
  // === State Management ===
  const [currentState, setCurrentState] = React.useState(GAME_STATES.MENU);
  const [showingFeedback, setShowingFeedback] = React.useState(false);
  const [feedbackData, setFeedbackData] = React.useState(null);
  
  const [currentEventIndex, setCurrentEventIndex] = React.useState(0);
  const [metrics, setMetrics] = React.useState({
    treasury: 50,
    publicTrust: 50,
    intlReputation: 50,
    socialStability: 50
  });
  
  const [characters, setCharacters] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const [decisionHistory, setDecisionHistory] = React.useState([]);
  const [dataLoaded, setDataLoaded] = React.useState(false);

  // === Load Data from JSON ===
  React.useEffect(() => {
    let eventsData = DEFAULT_EVENTS;
    let charactersData = DEFAULT_CHARACTERS;

    // Try to load events from JSON
    fetch('data/events.json')
      .then(response => response.json())
      .then(data => {
        if (data.events && data.events.length > 0) {
          eventsData = data.events;
        }
      })
      .catch(error => {
        console.log('Using default events (JSON not found)');
      })
      .finally(() => {
        setEvents(eventsData);

        // Try to load characters from JSON
        fetch('data/characters.json')
          .then(response => response.json())
          .then(data => {
            if (data.characters && data.characters.length > 0) {
              charactersData = data.characters.map(c => ({ ...c, support: 0 }));
            }
          })
          .catch(error => {
            console.log('Using default characters (JSON not found)');
            charactersData = DEFAULT_CHARACTERS.map(c => ({ ...c, support: 0 }));
          })
          .finally(() => {
            setCharacters(charactersData);
            setDataLoaded(true);
          });
      });
  }, []);

  // === State Transition Functions ===
  
  // MENU → PLAY
  const startGame = () => {
    setCurrentState(GAME_STATES.PLAY);
    setShowingFeedback(false);
    setFeedbackData(null);
    setCurrentEventIndex(0);
    setMetrics({
      treasury: 50,
      publicTrust: 50,
      intlReputation: 50,
      socialStability: 50
    });
    setCharacters(characters.map(c => ({ ...c, support: 0 })));
    setDecisionHistory([]);
  };

  // Event Card → Feedback (within PLAY)
  const handleDecision = (option, label) => {
    const oldMetrics = { ...metrics };
    
    const newMetrics = { ...metrics };
    Object.keys(option.metricChanges).forEach(key => {
      newMetrics[key] += option.metricChanges[key];
      newMetrics[key] = Math.max(0, Math.min(100, newMetrics[key]));
    });
    
    const newCharacters = characters.map(char => {
      const impact = option.characterImpacts.find(imp => imp.id === char.id);
      if (impact) {
        return {
          ...char,
          support: Math.max(-100, Math.min(100, char.support + impact.change))
        };
      }
      return char;
    });
    
    const feedback = {
      chosenOption: label,
      eventTitle: events[currentEventIndex].title,
      metricChanges: Object.keys(newMetrics).map(key => ({
        metric: key,
        oldValue: oldMetrics[key],
        newValue: newMetrics[key],
        change: newMetrics[key] - oldMetrics[key]
      })),
      characterReactions: option.characterImpacts.map(impact => {
        const char = newCharacters.find(c => c.id === impact.id);
        const oldChar = characters.find(c => c.id === impact.id);
        return {
          character: char,
          change: impact.change,
          oldSupport: oldChar.support,
          newSupport: char.support
        };
      }),
      warnings: generateWarnings(newMetrics)
    };
    
    setMetrics(newMetrics);
    setCharacters(newCharacters);
    setFeedbackData(feedback);
    setShowingFeedback(true);
    
    setDecisionHistory([
      ...decisionHistory,
      {
        eventId: events[currentEventIndex].id,
        choice: label,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  // Feedback → Next Event / RESULTS / GAME_OVER
  const handleContinue = () => {
    setShowingFeedback(false);
    setFeedbackData(null);
    
    const isGameOver = Object.values(metrics).some(v => v <= 0);
    if (isGameOver) {
      setCurrentState(GAME_STATES.GAME_OVER);
      return;
    }
    
    if (currentEventIndex + 1 >= events.length) {
      setCurrentState(GAME_STATES.RESULTS);
      return;
    }
    
    setCurrentEventIndex(currentEventIndex + 1);
  };

  // RESULTS / GAME_OVER → MENU
  const returnToMenu = () => {
    setCurrentState(GAME_STATES.MENU);
  };

  // === Helper Functions ===
  
  const generateWarnings = (metrics) => {
    const warnings = [];
    Object.entries(metrics).forEach(([key, value]) => {
      if (value <= 0) {
        warnings.push(`${key} has COLLAPSED (0)`);
      } else if (value < 25) {
        warnings.push(`${key} is CRITICAL (${Math.round(value)})`);
      }
    });
    return warnings;
  };

  const getFailureReason = () => {
    if (metrics.treasury <= 0) return { title: "BANKRUPTCY", desc: "City treasury depleted." };
    if (metrics.publicTrust <= 0) return { title: "NO CONFIDENCE", desc: "Public trust collapsed." };
    if (metrics.intlReputation <= 0) return { title: "INTERNATIONAL CRISIS", desc: "NYC's reputation destroyed." };
    if (metrics.socialStability <= 0) return { title: "CIVIL UNREST", desc: "Social order collapsed." };
    return { title: "UNKNOWN", desc: "Error" };
  };

  // === Loading Screen ===
  if (!dataLoaded) {
    return (
      <div style={{ 
        background: '#1a1a1a', 
        color: '#0f0', 
        fontFamily: 'Courier New', 
        minHeight: '100vh', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px'
      }}>
        Loading NYC Mayor Game...
      </div>
    );
  }

  // === Render Functions ===

  // MENU State
  if (currentState === GAME_STATES.MENU) {
    return (
      <div style={{ 
        background: '#1a1a1a', 
        color: '#0f0', 
        fontFamily: 'Courier New', 
        minHeight: '100vh', 
        padding: '40px', 
        textAlign: 'center' 
      }}>
        <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>NYC MAYOR GAME</h1>
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>Survive {events.length} events</p>
        <p style={{ marginBottom: '30px', color: '#888' }}>Keep all metrics above 0</p>
        <button 
          onClick={startGame}
          style={{ 
            background: '#0f0', 
            border: 'none', 
            color: '#000', 
            padding: '15px 40px', 
            fontSize: '20px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          START GAME
        </button>
      </div>
    );
  }

  // PLAY State
  if (currentState === GAME_STATES.PLAY) {
    // Show Feedback
    if (showingFeedback && feedbackData) {
      return (
        <div style={{ background: '#1a1a1a', color: '#0f0', fontFamily: 'Courier New', minHeight: '100vh', padding: '30px' }}>
          <h2 style={{ textAlign: 'center', color: '#ff0', marginBottom: '30px' }}>DECISION OUTCOME</h2>
          <div style={{ maxWidth: '600px', margin: '0 auto', background: '#222', padding: '30px', borderRadius: '10px' }}>
            <p style={{ fontSize: '20px', marginBottom: '20px' }}>You chose OPTION {feedbackData.chosenOption}</p>
            
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#0ff', marginBottom: '15px' }}>METRICS:</h3>
              {feedbackData.metricChanges.map(m => (
                <p key={m.metric} style={{ color: m.change > 0 ? '#0f0' : '#f00', marginBottom: '8px' }}>
                  {m.metric}: {Math.round(m.oldValue)} → {Math.round(m.newValue)} ({m.change > 0 ? '+' : ''}{m.change})
                </p>
              ))}
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#0ff', marginBottom: '15px' }}>REACTIONS:</h3>
              {feedbackData.characterReactions.map(r => (
                <p key={r.character.id} style={{ color: r.change > 0 ? '#0f0' : '#f00', marginBottom: '8px' }}>
                  {r.character.icon} {r.character.name}: {r.change > 0 ? '+' : ''}{r.change}
                </p>
              ))}
            </div>

            {feedbackData.warnings.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                {feedbackData.warnings.map((w, i) => (
                  <p key={i} style={{ color: '#f00', fontWeight: 'bold' }}>⚠️ {w}</p>
                ))}
              </div>
            )}

            <button 
              onClick={handleContinue}
              style={{ 
                background: '#0f0', 
                border: 'none', 
                color: '#000', 
                padding: '12px 30px', 
                fontSize: '18px', 
                cursor: 'pointer',
                width: '100%',
                fontWeight: 'bold'
              }}
            >
              CONTINUE
            </button>
          </div>
        </div>
      );
    }

    // Show Event Card
    const currentEvent = events[currentEventIndex];
    return (
      <div style={{ background: '#1a1a1a', color: '#fff', fontFamily: 'Courier New', minHeight: '100vh', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#0f0' }}>EVENT {currentEventIndex + 1}/{events.length}</h2>
        </div>

        {/* Metrics */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {Object.entries(metrics).map(([k, v]) => (
            <div key={k} style={{ flex: '1 1 120px', maxWidth: '150px' }}>
              <div style={{ fontSize: '12px', color: '#888' }}>{k}</div>
              <div style={{ background: '#333', height: '8px', borderRadius: '4px' }}>
                <div style={{ background: v < 25 ? '#f00' : '#0f0', height: '100%', width: `${v}%`, borderRadius: '4px' }} />
              </div>
              <div style={{ fontSize: '12px', color: v < 25 ? '#f00' : '#0f0' }}>{Math.round(v)}</div>
            </div>
          ))}
        </div>

        {/* Event Card */}
        <div style={{ background: '#2a2a2a', border: '3px solid #0f0', borderRadius: '15px', padding: '30px', maxWidth: '600px', margin: '0 auto 20px' }}>
          <h2 style={{ color: '#ff0', marginBottom: '15px' }}>{currentEvent.title}</h2>
          <p style={{ color: '#ccc', lineHeight: '1.6' }}>{currentEvent.description}</p>
        </div>

        {/* Options */}
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div 
            onClick={() => handleDecision(currentEvent.optionA, "A")}
            style={{ 
              background: '#2a2a2a', 
              border: '2px solid #66f', 
              padding: '20px', 
              marginBottom: '10px', 
              borderRadius: '10px', 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderWidth = '3px'}
            onMouseLeave={(e) => e.currentTarget.style.borderWidth = '2px'}
          >
            <div style={{ color: '#66f', fontWeight: 'bold', marginBottom: '10px' }}>OPTION A</div>
            <div style={{ color: '#fff' }}>{currentEvent.optionA.text}</div>
          </div>

          <div 
            onClick={() => handleDecision(currentEvent.optionB, "B")}
            style={{ 
              background: '#2a2a2a', 
              border: '2px solid #f66', 
              padding: '20px', 
              borderRadius: '10px', 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderWidth = '3px'}
            onMouseLeave={(e) => e.currentTarget.style.borderWidth = '2px'}
          >
            <div style={{ color: '#f66', fontWeight: 'bold', marginBottom: '10px' }}>OPTION B</div>
            <div style={{ color: '#fff' }}>{currentEvent.optionB.text}</div>
          </div>
        </div>

        {/* Characters Grid */}
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ textAlign: 'center', color: '#0ff', marginBottom: '15px' }}>NEW YORKERS</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', 
            gap: '10px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {characters.map(char => {
              const supportColor = char.support > 0 ? '#0f0' : char.support < 0 ? '#f00' : '#888';
              return (
                <div 
                  key={char.id}
                  style={{
                    background: '#2a2a2a',
                    padding: '10px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: `2px solid ${supportColor}`
                  }}
                >
                  <div style={{ fontSize: '32px' }}>{char.icon}</div>
                  <div style={{ fontSize: '10px', color: '#ccc', marginTop: '5px' }}>{char.name}</div>
                  <div style={{ fontSize: '10px', color: supportColor, marginTop: '3px' }}>
                    {char.support > 0 ? '+' : ''}{char.support}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // RESULTS State
  if (currentState === GAME_STATES.RESULTS) {
    return (
      <div style={{ background: '#1a1a1a', color: '#0f0', fontFamily: 'Courier New', minHeight: '100vh', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>🎉 VICTORY! 🎉</h1>
        <p style={{ fontSize: '20px', marginBottom: '30px' }}>You survived all {events.length} events!</p>
        
        <div style={{ maxWidth: '400px', margin: '0 auto 40px', background: '#222', padding: '30px', borderRadius: '10px' }}>
          <h3 style={{ color: '#0ff', marginBottom: '20px' }}>FINAL METRICS:</h3>
          {Object.entries(metrics).map(([k, v]) => (
            <p key={k} style={{ color: v < 50 ? '#fa0' : '#0f0', fontSize: '18px', marginBottom: '10px' }}>
              {k}: {Math.round(v)}/100
            </p>
          ))}
        </div>

        <button 
          onClick={returnToMenu}
          style={{ background: '#0f0', border: 'none', color: '#000', padding: '15px 40px', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          PLAY AGAIN
        </button>
      </div>
    );
  }

  // GAME_OVER State
  if (currentState === GAME_STATES.GAME_OVER) {
    const reason = getFailureReason();
    return (
      <div style={{ background: '#1a1a1a', color: '#f00', fontFamily: 'Courier New', minHeight: '100vh', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️ GAME OVER ⚠️</h1>
        <h2 style={{ color: '#ff0', fontSize: '32px', marginBottom: '20px' }}>{reason.title}</h2>
        <p style={{ color: '#ccc', fontSize: '18px', marginBottom: '30px' }}>{reason.desc}</p>
        <p style={{ color: '#ccc', marginBottom: '40px' }}>You survived {currentEventIndex} out of {events.length} events</p>
        
        <button 
          onClick={returnToMenu}
          style={{ background: '#f00', border: 'none', color: '#fff', padding: '15px 40px', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          TRY AGAIN
        </button>
      </div>
    );
  }

  return null;
}

// ===== RENDER APP =====
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<NYCMayorGame />);
