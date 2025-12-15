// ===== ANIMAL KINGDOM GAME =====

// ===== GAME STATES =====
const GAME_STATES = {
  MENU: "MENU",
  PLAY: "PLAY",
  RESULTS: "RESULTS",
  GAME_OVER: "GAME_OVER"
};

// ===== DEFAULT DATA (Fallback if JSON fails) =====
const DEFAULT_CHARACTERS = [
  { id: "duck", name: "Duck", icon: "images/characters/duck.png", fallbackEmoji: "🦆", support: 0 },
  { id: "giraffe", name: "Giraffe", icon: "images/characters/giraffe.png", fallbackEmoji: "🦒", support: 0 },
  { id: "penguin", name: "Penguin", icon: "images/characters/penguin.png", fallbackEmoji: "🐧", support: 0 },
  { id: "zebra", name: "Zebra", icon: "images/characters/zebra.png", fallbackEmoji: "🦓", support: 0 },
  { id: "bunny", name: "Bunny", icon: "images/characters/bunny.png", fallbackEmoji: "🐰", support: 0 },
  { id: "chick", name: "Chick", icon: "images/characters/chick.png", fallbackEmoji: "🐥", support: 0 },
  { id: "fox", name: "Fox", icon: "images/characters/fox.png", fallbackEmoji: "🦊", support: 0 },
  { id: "elephant", name: "Elephant", icon: "images/characters/elephant.png", fallbackEmoji: "🐘", support: 0 },
  { id: "pig", name: "Pig", icon: "images/characters/pig.png", fallbackEmoji: "🐷", support: 0 },
  { id: "seal", name: "Seal", icon: "images/characters/seal.png", fallbackEmoji: "🦭", support: 0 },
  { id: "mouse", name: "Mouse", icon: "images/characters/mouse.png", fallbackEmoji: "🐭", support: 0 },
  { id: "lion", name: "Lion", icon: "images/characters/lion.png", fallbackEmoji: "🦁", support: 0 }
];

// ===== CHARACTER IMAGE COMPONENT =====
function CharacterImage({ char, size = "80px" }) {
  const [imgError, setImgError] = React.useState(false);

  if (imgError || !char.icon) {
    return <div style={{ fontSize: size === "120px" ? "80px" : "40px" }}>{char.fallbackEmoji || "🐾"}</div>;
  }

  return (
    <img 
      src={char.icon} 
      alt={char.name}
      style={{ width: size, height: size, objectFit: "contain" }}
      onError={() => setImgError(true)}
    />
  );
}

// ===== PIXEL BORDER DECORATION =====
function PixelBorders() {
  const blockStyle = {
    position: "absolute",
    background: "#ff9346",
    width: "105px",
    height: "40px"
  };

  return (
    <>
      {/* Left side blocks */}
      <div style={{ ...blockStyle, left: "89px", top: "0" }} />
      <div style={{ ...blockStyle, left: "89px", top: "79px" }} />
      <div style={{ ...blockStyle, left: "89px", top: "159px" }} />
      <div style={{ ...blockStyle, left: "89px", top: "238px" }} />
      
      {/* Right side blocks */}
      <div style={{ ...blockStyle, right: "89px", top: "0" }} />
      <div style={{ ...blockStyle, right: "89px", top: "79px" }} />
      <div style={{ ...blockStyle, right: "89px", top: "156px" }} />
      <div style={{ ...blockStyle, right: "89px", top: "235px" }} />
      
      {/* Smaller connecting blocks */}
      <div style={{ ...blockStyle, left: "105px", top: "40px", width: "72px", height: "39px" }} />
      <div style={{ ...blockStyle, left: "105px", top: "119px", width: "72px" }} />
      <div style={{ ...blockStyle, left: "105px", top: "199px", width: "72px", height: "39px" }} />
      <div style={{ ...blockStyle, left: "105px", top: "278px", width: "72px" }} />
      
      <div style={{ ...blockStyle, right: "105px", top: "40px", width: "72px", height: "39px" }} />
      <div style={{ ...blockStyle, right: "105px", top: "119px", width: "72px" }} />
      <div style={{ ...blockStyle, right: "105px", top: "196px", width: "72px", height: "39px" }} />
      <div style={{ ...blockStyle, right: "105px", top: "275px", width: "72px" }} />
    </>
  );
}

// ===== MAIN GAME COMPONENT =====
function AnimalKingdomGame() {
  // === State Management ===
  const [currentState, setCurrentState] = React.useState(GAME_STATES.MENU);
  const [currentEventIndex, setCurrentEventIndex] = React.useState(0);
  const [metrics, setMetrics] = React.useState({
    treasury: 50,
    publicTrust: 50,
    intlReputation: 50,
    socialStability: 50
  });
  
  const [characters, setCharacters] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const [dataLoaded, setDataLoaded] = React.useState(false);
  
  // Drag state
  const [dragPos, setDragPos] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [hoveredOption, setHoveredOption] = React.useState(null);
  const dragStartPos = React.useRef({ x: 0, y: 0 });

  // === Load Data from JSON ===
  React.useEffect(() => {
    let eventsData = [];
    let charactersData = DEFAULT_CHARACTERS;

    // Load events
    fetch('data/events.json')
      .then(response => response.json())
      .then(data => {
        if (data.events && data.events.length > 0) {
          eventsData = data.events;
        }
      })
      .catch(() => console.log('Using default (events.json not found)'))
      .finally(() => {
        setEvents(eventsData);

        // Load characters
        fetch('data/characters.json')
          .then(response => response.json())
          .then(data => {
            if (data.characters && data.characters.length > 0) {
              charactersData = data.characters.map(c => ({ ...c, support: 0 }));
            }
          })
          .catch(() => console.log('Using default characters'))
          .finally(() => {
            setCharacters(charactersData);
            setDataLoaded(true);
          });
      });
  }, []);

  // === Drag Handlers ===
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
      const option = dragPos.x < 0 ? events[currentEventIndex].optionA : events[currentEventIndex].optionB;
      handleDecision(option);
    }

    setDragPos({ x: 0, y: 0 });
    setHoveredOption(null);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  // === Game Logic ===
  const startGame = () => {
    setCurrentState(GAME_STATES.PLAY);
    setCurrentEventIndex(0);
    setMetrics({ treasury: 50, publicTrust: 50, intlReputation: 50, socialStability: 50 });
    setCharacters(characters.map(c => ({ ...c, support: 0 })));
  };

  const handleDecision = (option) => {
    const newM = { ...metrics };
    Object.keys(option.metricChanges).forEach(key => {
      newM[key] += option.metricChanges[key];
      newM[key] = Math.max(0, Math.min(100, newM[key]));
    });
    
    const newC = characters.map(char => {
      const impact = option.characterImpacts.find(imp => imp.id === char.id);
      if (impact) {
        return {
          ...char,
          support: Math.max(-100, Math.min(100, char.support + impact.change))
        };
      }
      return char;
    });
    
    setMetrics(newM);
    setCharacters(newC);
    
    // Check game end
    setTimeout(() => {
      if (Object.values(newM).some(v => v <= 0)) {
        setCurrentState(GAME_STATES.GAME_OVER);
      } else if (currentEventIndex + 1 >= events.length) {
        setCurrentState(GAME_STATES.RESULTS);
      } else {
        setCurrentEventIndex(currentEventIndex + 1);
      }
    }, 300);
  };

  const returnToMenu = () => {
    setCurrentState(GAME_STATES.MENU);
  };

  const getCharColor = (char) => {
    if (!hoveredOption) return "#fffdec";
    
    const option = hoveredOption === "A" ? events[currentEventIndex].optionA : events[currentEventIndex].optionB;
    const impact = option.characterImpacts.find(imp => imp.id === char.id);
    
    if (!impact) return "#fffdec";
    if (impact.change > 0) return "#c8e6c9";
    if (impact.change < 0) return "#ffcdd2";
    return "#fffdec";
  };

  // === Loading ===
  if (!dataLoaded) {
    return (
      <div style={{ 
        background: "#00bbb8", 
        minHeight: "100vh", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "24px",
        color: "white",
        fontWeight: "bold"
      }}>
        Loading Animal Kingdom...
      </div>
    );
  }

  // === MENU ===
  if (currentState === GAME_STATES.MENU) {
    return (
      <div style={{ background: "#00bbb8", minHeight: "100vh", padding: "40px", textAlign: "center", position: "relative" }}>
        <PixelBorders />
        
        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto", paddingTop: "60px" }}>
          <h1 style={{ fontSize: "56px", marginBottom: "30px", color: "#fff", fontWeight: "bold" }}>
            🌍 ANIMAL KINGDOM
          </h1>
          <div style={{ background: "#fffdec", padding: "40px", borderRadius: "24px", marginBottom: "30px", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
            <p style={{ fontSize: "22px", marginBottom: "20px", lineHeight: "1.6", fontWeight: "bold", color: "#333" }}>
              Lead the animal kingdom through {events.length} important decisions!
            </p>
            <p style={{ fontSize: "18px", color: "#666", marginBottom: "20px" }}>
              Drag cards LEFT or RIGHT to choose
            </p>
            <p style={{ fontSize: "16px", color: "#999" }}>
              Keep all metrics above zero to succeed
            </p>
          </div>
          <button 
            onClick={startGame}
            style={{ 
              background: "#ff9346", 
              border: "none", 
              color: "#fff", 
              padding: "18px 50px", 
              fontSize: "24px", 
              cursor: "pointer",
              borderRadius: "20px",
              fontWeight: "bold",
              boxShadow: "0 6px 0 #d16a2e, 0 8px 20px rgba(0,0,0,0.2)",
              transition: "transform 0.1s"
            }}
            onMouseDown={(e) => e.target.style.transform = "translateY(4px)"}
            onMouseUp={(e) => e.target.style.transform = "translateY(0)"}
          >
            START GAME
          </button>
        </div>
      </div>
    );
  }

  // === PLAY ===
  if (currentState === GAME_STATES.PLAY) {
    const ev = events[currentEventIndex];
    const rotation = dragPos.x * 0.02;
    const mainChar = characters.find(c => c.id === ev.character);

    return (
      <div 
        style={{ 
          background: "#00bbb8", 
          minHeight: "100vh", 
          padding: "20px",
          overflow: "hidden",
          userSelect: "none",
          position: "relative"
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <PixelBorders />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Metrics */}
          <div style={{ display: "flex", gap: "15px", marginBottom: "20px", justifyContent: "center", paddingTop: "20px" }}>
            {Object.entries(metrics).map(([k, v]) => (
              <div key={k} style={{ flex: 1, maxWidth: "235px" }}>
                <div style={{ 
                  background: "#277c38", 
                  height: "36px", 
                  borderRadius: "100px",
                  position: "relative",
                  border: "3px solid #fff"
                }}>
                  <div style={{ 
                    background: "#c2ffce", 
                    height: "100%", 
                    width: `${v}%`,
                    borderRadius: "100px",
                    transition: "width 0.3s"
                  }} />
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#277c38"
                  }}>
                    {Math.round(v)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Layout */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center", justifyContent: "center", marginBottom: "30px", minHeight: "500px" }}>
            
            {/* Option A (Left) */}
            <div style={{ 
              background: hoveredOption === "A" ? "#ff6b4d" : "#ff9346",
              padding: "40px 20px", 
              borderRadius: "20px",
              transition: "all 0.3s",
              width: "185px",
              minHeight: "239px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: hoveredOption === "A" ? "scale(1.05)" : "scale(1)",
              boxShadow: hoveredOption === "A" ? "0 8px 0 #d14a2e" : "0 6px 0 #d16a2e",
              cursor: "pointer"
            }}
            onClick={() => !isDragging && handleDecision(ev.optionA)}
            >
              <p style={{ fontSize: "32px", color: "#fff", fontWeight: "bold", textAlign: "center", lineHeight: "normal" }}>
                {ev.optionA.text}
              </p>
            </div>

            {/* Event Card */}
            <div 
              style={{ 
                background: "#0063dc",
                borderRadius: "40px",
                padding: "60px 80px",
                cursor: isDragging ? "grabbing" : "grab",
                transform: `translate(${dragPos.x}px, ${dragPos.y}px) rotate(${rotation}deg)`,
                transition: isDragging ? "none" : "transform 0.3s ease",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                touchAction: "none",
                display: "flex",
                gap: "40px",
                alignItems: "center",
                maxWidth: "900px"
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              {mainChar && <CharacterImage char={mainChar} size="120px" />}
              
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "40px", color: "#fff", marginBottom: "40px", fontWeight: "bold", lineHeight: "normal" }}>
                  {ev.description}
                </p>
                <p style={{ fontSize: "32px", color: "#94ff62", fontWeight: "bold" }}>
                  {ev.characterName}
                </p>
              </div>
            </div>

            {/* Option B (Right) */}
            <div style={{ 
              background: hoveredOption === "B" ? "#ff6b4d" : "#ff9346",
              padding: "40px 20px", 
              borderRadius: "20px",
              transition: "all 0.3s",
              width: "185px",
              minHeight: "239px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: hoveredOption === "B" ? "scale(1.05)" : "scale(1)",
              boxShadow: hoveredOption === "B" ? "0 8px 0 #d14a2e" : "0 6px 0 #d16a2e",
              cursor: "pointer"
            }}
            onClick={() => !isDragging && handleDecision(ev.optionB)}
            >
              <p style={{ fontSize: "32px", color: "#fff", fontWeight: "bold", textAlign: "center", lineHeight: "normal" }}>
                {ev.optionB.text}
              </p>
            </div>
          </div>

          {/* Characters Grid */}
          <div style={{ marginTop: "30px" }}>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(6, 1fr)", 
              gap: "12px",
              maxWidth: "1000px",
              margin: "0 auto"
            }}>
              {characters.map(char => (
                <div 
                  key={char.id}
                  style={{
                    background: getCharColor(char),
                    aspectRatio: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "20px",
                    transition: "all 0.3s",
                    transform: hoveredOption && getCharColor(char) !== "#fffdec" ? "scale(1.15)" : "scale(1)",
                    border: "4px solid #fff",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
                  }}
                >
                  <CharacterImage char={char} size="80px" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === RESULTS ===
  if (currentState === GAME_STATES.RESULTS) {
    return (
      <div style={{ background: "#00bbb8", minHeight: "100vh", padding: "40px", textAlign: "center", position: "relative" }}>
        <PixelBorders />
        
        <div style={{ position: "relative", zIndex: 1, paddingTop: "60px" }}>
          <h1 style={{ fontSize: "48px", marginBottom: "20px", color: "#fff", fontWeight: "bold" }}>
            🎉 SUCCESS! 🎉
          </h1>
          <p style={{ fontSize: "24px", marginBottom: "30px", color: "#fff" }}>
            You led the kingdom through all {events.length} events!
          </p>
          
          <div style={{ 
            maxWidth: "600px", 
            margin: "0 auto 30px", 
            background: "#fffdec", 
            padding: "40px", 
            borderRadius: "24px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
          }}>
            <h3 style={{ color: "#333", marginBottom: "20px", fontSize: "22px", fontWeight: "bold" }}>
              FINAL SCORES
            </h3>
            {Object.entries(metrics).map(([k, v]) => (
              <p key={k} style={{ 
                color: v < 50 ? "#ff9346" : "#277c38", 
                fontSize: "20px", 
                marginBottom: "10px",
                fontWeight: "bold",
                textTransform: "capitalize"
              }}>
                {k}: {Math.round(v)}/100
              </p>
            ))}
          </div>

          <button 
            onClick={returnToMenu}
            style={{ 
              background: "#ff9346", 
              border: "none", 
              color: "#fff", 
              padding: "18px 50px", 
              fontSize: "24px", 
              cursor: "pointer",
              borderRadius: "20px",
              fontWeight: "bold",
              boxShadow: "0 6px 0 #d16a2e, 0 8px 20px rgba(0,0,0,0.2)"
            }}
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }

  // === GAME OVER ===
  if (currentState === GAME_STATES.GAME_OVER) {
    const reason = metrics.treasury <= 0 ? "BANKRUPTCY" :
                   metrics.publicTrust <= 0 ? "NO CONFIDENCE" :
                   metrics.intlReputation <= 0 ? "INTERNATIONAL CRISIS" : "CIVIL UNREST";
    return (
      <div style={{ background: "#00bbb8", minHeight: "100vh", padding: "40px", textAlign: "center", position: "relative" }}>
        <PixelBorders />
        
        <div style={{ position: "relative", zIndex: 1, paddingTop: "60px" }}>
          <h1 style={{ fontSize: "48px", marginBottom: "20px", color: "#fff", fontWeight: "bold" }}>
            😢 GAME OVER
          </h1>
          <h2 style={{ color: "#ffe5b4", fontSize: "32px", marginBottom: "20px", fontWeight: "bold" }}>
            {reason}
          </h2>
          <p style={{ color: "#fff", fontSize: "20px", marginBottom: "30px" }}>
            You survived {currentEventIndex} of {events.length} events
          </p>
          
          <button 
            onClick={returnToMenu}
            style={{ 
              background: "#ff9346", 
              border: "none", 
              color: "#fff", 
              padding: "18px 50px", 
              fontSize: "24px", 
              cursor: "pointer",
              borderRadius: "20px",
              fontWeight: "bold",
              boxShadow: "0 6px 0 #d16a2e"
            }}
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// ===== RENDER =====
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AnimalKingdomGame />);
