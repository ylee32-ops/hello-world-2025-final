# Data Structure Documentation

## Overview

This document defines all data structures used in the NYC Mayor Game.

---

## 1. Event Structure

### JSON Schema

```json
{
  "id": number,
  "title": string,
  "description": string,
  "category": string,
  "optionA": {
    "text": string,
    "shortLabel": string,
    "metricChanges": {
      "treasury": number,
      "publicTrust": number,
      "intlReputation": number,
      "socialStability": number
    },
    "characterImpacts": [
      {
        "id": string,
        "change": number
      }
    ]
  },
  "optionB": {
    // Same structure as optionA
  }
}
```

### Field Descriptions

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `id` | number | 1-32 | Unique event identifier |
| `title` | string | - | Event title (concise) |
| `description` | string | - | Event description explaining the dilemma |
| `category` | string | - | economic, justice, housing, environment, infrastructure, health |
| `optionA.text` | string | - | Full description of option A |
| `optionA.shortLabel` | string | - | Short label (e.g., "Support", "Cut") |
| `metricChanges.*` | number | -50 to +50 | Change to apply to metric |
| `characterImpacts[].id` | string | A1-D16 | Character ID |
| `characterImpacts[].change` | number | -30 to +30 | Support change |

### Example

```json
{
  "id": 1,
  "title": "Minimum Wage Increase to $20/hour",
  "description": "City Council proposes raising minimum wage...",
  "category": "economic",
  "optionA": {
    "text": "SUPPORT: Raise to $20",
    "shortLabel": "Support",
    "metricChanges": {
      "treasury": -10,
      "publicTrust": 15,
      "intlReputation": 5,
      "socialStability": 10
    },
    "characterImpacts": [
      { "id": "B5", "change": 20 },
      { "id": "C9", "change": 18 }
    ]
  },
  "optionB": {
    // ...
  }
}
```

---

## 2. Character Structure

### JSON Schema

```json
{
  "id": string,
  "name": string,
  "fullName": string,
  "title": string,
  "age": number,
  "demographics": {
    "ethnicity": string,
    "gender": string,
    "borough": string
  },
  "position": {
    "economic": number,
    "authority": number
  },
  "population": number,
  "influenceWeight": number,
  "icon": string,
  "support": number
}
```

### Field Descriptions

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `id` | string | A1-D16 | Unique character identifier |
| `name` | string | - | First name |
| `fullName` | string | - | Full name |
| `title` | string | - | Role/identity description |
| `age` | number | 18-70 | Character age |
| `demographics.ethnicity` | string | - | Ethnic background |
| `demographics.gender` | string | - | Gender identity |
| `demographics.borough` | string | - | NYC borough |
| `position.economic` | number | -2 to +2 | Left (-2) to Right (+2) |
| `position.authority` | number | -2 to +2 | Libertarian (-2) to Authoritarian (+2) |
| `population` | number | 0-1 | Percentage of NYC population |
| `influenceWeight` | number | 0.7-1.2 | Political influence multiplier |
| `icon` | string | emoji | Character icon/emoji |
| `support` | number | -100 to +100 | Current support level (game state) |

### Political Position Grid

```
         Authority (+2)
              ↑
              │  A1  A2  A3  A4
              │  
Left (-2) ←───┼───  B5  B6  B7  B8  ───→ Right (+2)
              │  
              │  C9  C10 C11 C12
              │
              ↓  D13 D14 D15 D16
         Liberty (-2)
```

### Example

```json
{
  "id": "A1",
  "name": "Sal",
  "fullName": "Sal Benedetti",
  "title": "Old-School Union Boss",
  "age": 65,
  "demographics": {
    "ethnicity": "Italian-American",
    "gender": "Male",
    "borough": "Brooklyn"
  },
  "position": {
    "economic": -2,
    "authority": 2
  },
  "population": 0.06,
  "influenceWeight": 0.9,
  "icon": "🚇",
  "support": 0
}
```

---

## 3. Game State Structure

### JavaScript Object

```javascript
{
  // Main state
  currentState: "MENU" | "PLAY" | "RESULTS" | "GAME_OVER",
  
  // PLAY sub-state
  showingFeedback: boolean,
  feedbackData: FeedbackData | null,
  
  // Progress
  currentEventIndex: number,  // 0-31
  totalEvents: number,        // 32
  
  // Metrics (0-100)
  metrics: {
    treasury: number,
    publicTrust: number,
    intlReputation: number,
    socialStability: number
  },
  
  // Characters
  characters: Character[],  // Array of 16
  
  // Events
  events: Event[],  // Array of 32
  
  // History
  decisionHistory: DecisionRecord[]
}
```

---

## 4. Feedback Data Structure

### JavaScript Object

```javascript
{
  // Choice info
  chosenOption: "A" | "B",
  eventTitle: string,
  
  // Metric changes
  metricChanges: [
    {
      metric: string,
      oldValue: number,
      newValue: number,
      change: number
    }
  ],
  
  // Character reactions
  characterReactions: [
    {
      character: Character,
      change: number,
      oldSupport: number,
      newSupport: number
    }
  ],
  
  // Warnings
  warnings: string[]
}
```

### Example

```javascript
{
  chosenOption: "A",
  eventTitle: "Minimum Wage Increase to $20/hour",
  metricChanges: [
    {
      metric: "treasury",
      oldValue: 50,
      newValue: 40,
      change: -10
    },
    {
      metric: "publicTrust",
      oldValue: 50,
      newValue: 65,
      change: 15
    }
  ],
  characterReactions: [
    {
      character: { id: "B5", name: "Carlos", ... },
      change: 20,
      oldSupport: 0,
      newSupport: 20
    }
  ],
  warnings: [
    "treasury is CRITICAL (40)"
  ]
}
```

---

## 5. Decision History Structure

### JavaScript Object

```javascript
{
  eventId: number,
  choice: "A" | "B",
  timestamp: string  // ISO 8601 format
}
```

### Example

```javascript
{
  eventId: 1,
  choice: "A",
  timestamp: "2024-12-01T10:30:00.000Z"
}
```

---

## 6. Metrics

### Structure

```javascript
{
  treasury: number,         // 0-100
  publicTrust: number,      // 0-100
  intlReputation: number,   // 0-100
  socialStability: number   // 0-100
}
```

### Meanings

| Metric | Description | Low (<25) | High (>75) |
|--------|-------------|-----------|------------|
| **Treasury** | City budget & financial health | Bankruptcy risk | Surplus |
| **Public Trust** | Citizens' faith in leadership | Recall/impeachment | Strong mandate |
| **Int'l Reputation** | NYC's global standing | Sanctions/isolation | World leader |
| **Social Stability** | Peace and order | Riots/unrest | Harmony |

### Calculation Rules

```javascript
// Apply change
newValue = oldValue + change;

// Constrain to 0-100
newValue = Math.max(0, Math.min(100, newValue));

// Game Over condition
isGameOver = (treasury <= 0 || publicTrust <= 0 || 
              intlReputation <= 0 || socialStability <= 0);
```

---

## 7. Character Support

### Structure

```javascript
support: number  // -100 to +100
```

### Meanings

| Range | Label | Description |
|-------|-------|-------------|
| 75 to 100 | Strongly Support | Die-hard ally |
| 25 to 74 | Support | Generally favorable |
| -24 to 24 | Neutral | No strong opinion |
| -74 to -25 | Oppose | Generally against you |
| -100 to -75 | Strongly Oppose | Active enemy |

### Calculation Rules

```javascript
// Apply change
newSupport = oldSupport + change;

// Constrain to -100 to +100
newSupport = Math.max(-100, Math.min(100, newSupport));
```

---

## 8. Data Loading

### From JSON Files

```javascript
// Load events
fetch('data/events.json')
  .then(response => response.json())
  .then(data => {
    setEvents(data.events);
  });

// Load characters
fetch('data/characters.json')
  .then(response => response.json())
  .then(data => {
    // Initialize support to 0
    const chars = data.characters.map(c => ({
      ...c,
      support: 0
    }));
    setCharacters(chars);
  });
```

---

## 9. Data Validation

### Event Validation

```javascript
function validateEvent(event) {
  // Required fields
  if (!event.id || !event.title || !event.description) {
    throw new Error("Missing required fields");
  }
  
  // Metric changes in valid range
  const changes = [
    ...Object.values(event.optionA.metricChanges),
    ...Object.values(event.optionB.metricChanges)
  ];
  if (changes.some(c => c < -50 || c > 50)) {
    throw new Error("Metric change out of range");
  }
  
  // Character impacts in valid range
  const impacts = [
    ...event.optionA.characterImpacts,
    ...event.optionB.characterImpacts
  ];
  if (impacts.some(i => i.change < -30 || i.change > 30)) {
    throw new Error("Character impact out of range");
  }
  
  return true;
}
```

### Character Validation

```javascript
function validateCharacter(char) {
  // Required fields
  if (!char.id || !char.name || !char.title) {
    throw new Error("Missing required fields");
  }
  
  // Position in valid range
  if (char.position.economic < -2 || char.position.economic > 2) {
    throw new Error("Economic position out of range");
  }
  if (char.position.authority < -2 || char.position.authority > 2) {
    throw new Error("Authority position out of range");
  }
  
  // Population sums to ~1.0
  // (checked across all characters)
  
  return true;
}
```

---

## 10. File Locations

```
final/
├── data/
│   ├── events.json        ← 32 events
│   └── characters.json    ← 16 characters
├── game.jsx               ← Uses the data
└── docs/
    └── DATA_STRUCTURE.md  ← This file
```

---

**Last Updated**: December 2024
