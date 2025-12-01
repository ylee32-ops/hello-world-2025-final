# State Machine Documentation

## Overview

The NYC Mayor Game uses a simplified 4-state machine with internal sub-states in the PLAY state.

## States

### 1. MENU
- **Purpose**: Start screen
- **Shows**: Game title, instructions, start button
- **Can transition to**: PLAY

### 2. PLAY
- **Purpose**: Main gameplay state
- **Contains two internal views**:
  - `showingFeedback = false`: Event Card View
  - `showingFeedback = true`: Feedback View
- **Can transition to**: RESULTS, GAME_OVER

### 3. RESULTS
- **Purpose**: Victory screen after completing all events
- **Shows**: Final metrics, governing style, top supporters
- **Can transition to**: MENU

### 4. GAME_OVER
- **Purpose**: Failure screen when any metric reaches 0
- **Shows**: Failure reason, events survived, final metrics
- **Can transition to**: MENU

## State Diagram

```
         START
           ↓
      ┌────────┐
      │  MENU  │ ←──────────────────┐
      └────────┘                     │
           │                         │
           │ [Start Game]            │
           ↓                         │
      ┌────────┐                     │
      │  PLAY  │                     │
      │        │                     │
      │  Sub-states:                 │
      │  • Event Card                │
      │  • Feedback                  │
      └────────┘                     │
           │                         │
           ├─→ [Metric ≤ 0]          │
           │        ↓                │
           │   ┌──────────┐          │
           │   │GAME_OVER │──────────┘
           │   └──────────┘
           │
           └─→ [All Events Done]
                    ↓
               ┌─────────┐
               │ RESULTS │───────────┘
               └─────────┘
```

## PLAY State Detail

The PLAY state is the most complex, containing two views:

### Event Card View
- **Trigger**: `showingFeedback = false`
- **Shows**:
  - Current event title and description
  - Two options (A and B)
  - City metrics dashboard
  - 16 character grid (with drag preview)
- **User Actions**:
  - Drag card up/down to choose option
  - OR click option A/B
- **Next State**: Feedback View (within PLAY)

### Feedback View
- **Trigger**: `showingFeedback = true` AND `feedbackData !== null`
- **Shows**:
  - Chosen option
  - Metric changes (old → new)
  - Character reactions (who supported/opposed)
  - Warnings (if metrics are critical)
  - CONTINUE button
- **User Actions**:
  - Click CONTINUE button
- **Next States**:
  - PLAY (next event) if more events remain
  - RESULTS if all events completed
  - GAME_OVER if any metric ≤ 0

## State Variables

```javascript
// Main state
currentState: "MENU" | "PLAY" | "RESULTS" | "GAME_OVER"

// PLAY sub-state
showingFeedback: boolean
feedbackData: null | FeedbackObject

// Game progress
currentEventIndex: number (0-31)
totalEvents: 32

// Metrics (all 0-100)
metrics: {
  treasury: number,
  publicTrust: number,
  intlReputation: number,
  socialStability: number
}

// Characters (16 total)
characters: Array<Character>
// Each character has support: -100 to +100

// Events (32 total)
events: Array<Event>

// History
decisionHistory: Array<{
  eventId: number,
  choice: "A" | "B",
  timestamp: string
}>
```

## Transition Functions

### `startGame()`
```
Action: MENU → PLAY
- Reset currentEventIndex to 0
- Reset all metrics to 50
- Reset all character support to 0
- Clear decisionHistory
- Set showingFeedback = false
- Set feedbackData = null
```

### `handleDecision(option, label)`
```
Action: Event Card → Feedback (within PLAY)
- Calculate new metrics
- Calculate new character support
- Generate feedbackData object
- Set showingFeedback = true
- Add to decisionHistory
```

### `handleContinue()`
```
Action: Feedback → Next State
- Set showingFeedback = false
- Set feedbackData = null
- Check game over: if any metric ≤ 0 → GAME_OVER
- Check victory: if currentEventIndex + 1 >= totalEvents → RESULTS
- Otherwise: increment currentEventIndex (stay in PLAY)
```

### `returnToMenu()`
```
Action: RESULTS|GAME_OVER → MENU
- Simply change currentState to MENU
- Other state variables remain (will be reset on next startGame)
```

## Validation Rules

### Metric Constraints
- All metrics must stay within 0-100
- Use `Math.max(0, Math.min(100, value))` to enforce

### Character Support Constraints
- Support must stay within -100 to +100
- Use `Math.max(-100, Math.min(100, value))` to enforce

### Game Over Conditions
- ANY metric ≤ 0 triggers GAME_OVER
- Check after EVERY decision
- Cannot continue if triggered

### Victory Conditions
- Complete all 32 events
- All metrics must still be > 0
- Triggers RESULTS state

## Testing Checklist

### State Transitions
- [ ] MENU → PLAY on Start
- [ ] PLAY (Event) → PLAY (Feedback) on Decision
- [ ] PLAY (Feedback) → PLAY (Next Event) on Continue
- [ ] PLAY → RESULTS when all events done
- [ ] PLAY → GAME_OVER when metric hits 0
- [ ] RESULTS → MENU on Play Again
- [ ] GAME_OVER → MENU on Try Again

### Edge Cases
- [ ] Last event (31) transitions to RESULTS
- [ ] Metric exactly 0 triggers GAME_OVER
- [ ] Multiple metrics at 0 (shows correct reason)
- [ ] Character support at -100 and +100 boundaries
- [ ] Rapid clicking doesn't break state

### Data Integrity
- [ ] Metrics never exceed 100 or go below 0
- [ ] Character support never exceeds 100 or -100
- [ ] Event index never goes out of bounds
- [ ] Decision history records all choices

---

**Last Updated**: December 2024
