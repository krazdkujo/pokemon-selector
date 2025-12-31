# Research: Pokemon Move Selection and HP Setup

**Feature Branch**: `007-pokemon-move-hp-setup`
**Date**: 2025-12-31

## Research Topics

### 1. Move Pool Extraction from Pokemon Data

**Context**: Pokemon data in `Source/pokemon/pokemon.json` contains moves organized by level keys (start, level2, level6, etc.).

**Decision**: Create a utility function `getAvailableMovesForLevel(pokemonId, level)` that:
1. Parses the moves object keys to extract level numbers
2. Filters to include only keys where the level number <= Pokemon's current level
3. Combines all move IDs from matching levels into a flat array
4. Excludes `tm` and `egg` move arrays

**Rationale**:
- The data structure uses consistent naming: "start" for level 1, "level{N}" for other levels
- Level parsing is straightforward: extract number from "level{N}" or treat "start" as level 1
- Union approach (cumulative moves) matches TTRPG mechanics where Pokemon learn but don't forget

**Alternatives Considered**:
- Intersection filtering (only current level moves): Rejected - doesn't match Pokemon/TTRPG mechanics
- Include TM/egg moves: Rejected per spec - these are future features

**Implementation**:
```javascript
function getAvailableMovesForLevel(pokemon, level) {
  const moves = pokemon.moves || {}
  const available = []

  for (const [key, moveList] of Object.entries(moves)) {
    if (key === 'tm' || key === 'egg') continue

    let moveLevel = 1
    if (key === 'start') {
      moveLevel = 1
    } else if (key.startsWith('level')) {
      moveLevel = parseInt(key.replace('level', ''), 10)
    }

    if (moveLevel <= level && Array.isArray(moveList)) {
      available.push(...moveList)
    }
  }

  return [...new Set(available)] // Dedupe
}
```

---

### 2. HP Calculation Methods

**Context**: TTRPG-style HP uses hit dice (d6, d8, etc.) plus constitution modifier.

**Decision**: Implement two calculation methods:

**Average Method**:
- Level 1: Maximum hit die value (e.g., 6 for d6, 8 for d8)
- Levels 2+: Average value rounded up (3.5 -> 4 for d6, 4.5 -> 5 for d8)
- Add CON modifier per level

Formula: `HP = maxDie + ((level - 1) * avgDie) + (level * conMod)`

**Roll Method**:
- Level 1: Maximum hit die value (no rolling - prevents instant death)
- Levels 2+: Random roll of the hit die
- Add CON modifier per level
- Return roll history for transparency

**Rationale**:
- Level 1 max die is standard TTRPG rule to prevent extremely weak starting characters
- Average rounding up favors the player slightly (standard D&D convention)
- Roll history lets players verify results

**Alternatives Considered**:
- Roll for level 1: Rejected - can result in 1 HP Pokemon which is poor UX
- Floor instead of ceiling for average: Rejected - penalizes players

**Implementation**:
```javascript
function calculateHP(hitDice, conScore, level, method) {
  const dieValue = parseInt(hitDice.replace('d', ''), 10) // d6 -> 6
  const conMod = Math.floor((conScore - 10) / 2)

  if (method === 'average') {
    const avgDie = Math.ceil(dieValue / 2 + 0.5) // 3.5 -> 4, 4.5 -> 5
    const hp = dieValue + ((level - 1) * avgDie) + (level * conMod)
    return { hp: Math.max(1, hp), rolls: null }
  }

  // Roll method
  const rolls = [dieValue] // Level 1 is max
  for (let i = 2; i <= level; i++) {
    rolls.push(Math.floor(Math.random() * dieValue) + 1)
  }
  const baseHp = rolls.reduce((sum, r) => sum + r, 0)
  const hp = baseHp + (level * conMod)

  return { hp: Math.max(1, hp), rolls }
}
```

---

### 3. Database Schema Extension

**Context**: Existing `player_pokemon` table needs new columns for moves and HP.

**Decision**: Add the following columns:
- `selected_moves` - TEXT[] (PostgreSQL array) - stores up to 4 move IDs
- `current_hp` - INTEGER - current HP value
- `max_hp` - INTEGER - maximum HP value
- `hp_method` - TEXT - 'average' or 'roll'
- `hp_rolls` - INTEGER[] (nullable) - roll history for 'roll' method

**Rationale**:
- PostgreSQL arrays are native and efficient for small fixed-size lists
- Separate current_hp and max_hp supports future damage/healing features
- hp_rolls provides audit trail for roll method

**Alternatives Considered**:
- JSONB for moves: Rejected - simple array is more efficient
- Separate moves table: Rejected - adds complexity for 4 items max
- No hp_rolls storage: Rejected - players want to see their roll history

---

### 4. UI Flow Integration

**Context**: Must intercept the starter selection flow to add move/HP setup step.

**Decision**: Modify the flow as follows:
1. Player clicks "Choose as Starter" in StarterDetailModal
2. Instead of immediately calling API, open PokemonSetupModal
3. PokemonSetupModal shows move selection and HP method
4. On confirm, call API with all data (pokemon, nickname, moves, HP method)
5. API calculates HP and saves everything atomically

**Rationale**:
- Single API call ensures atomicity - no partial saves
- Modal-in-modal is acceptable UX for wizard-like flows
- Existing StarterDetailModal changes are minimal

**Alternatives Considered**:
- Two-step API (save Pokemon, then save moves/HP): Rejected - risks orphaned records
- Replace StarterDetailModal entirely: Rejected - more code churn for no benefit

---

### 5. Move Details Display

**Context**: Players need move information to make informed selections.

**Decision**: Reuse existing MoveTooltipContent component and Tooltip wrapper. Each move in the selection panel shows:
- Move name
- Type badge
- Hover/click for full details via tooltip

**Rationale**:
- Feature 006 already implemented move tooltips
- Consistent UX across the application
- No new components needed for move details

**Alternatives Considered**:
- Inline full details: Rejected - clutters the selection UI
- Separate details panel: Rejected - tooltip is sufficient and already exists

---

## Summary of Decisions

| Topic | Decision | Key Rationale |
|-------|----------|---------------|
| Move Pool | Cumulative by level, exclude TM/egg | Matches TTRPG mechanics |
| HP Average | Ceiling for average die values | Player-friendly D&D convention |
| HP Roll | Max at level 1, roll for 2+ | Prevents 1 HP starts |
| DB Schema | PostgreSQL arrays for moves/rolls | Simple, efficient for small lists |
| UI Flow | Modal chain with single API call | Atomic save, minimal code churn |
| Move Display | Reuse existing tooltips | Consistency, no new code needed |
