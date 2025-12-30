# Research: Pokemon Selector and Generation System

**Feature**: 003-pokemon-generator
**Date**: 2025-12-30

## Research Tasks

### 1. Pokemon Sprite/Image Source

**Decision**: Use PokeAPI sprites via direct URL pattern

**Rationale**:
- PokeAPI provides free, reliable Pokemon sprites at predictable URLs
- Pattern: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{number}.png`
- No API key required, direct static file access
- Covers all 1142 Pokemon in our dataset

**Alternatives Considered**:
- Host sprites locally: Rejected - adds ~50MB to repo, copyright concerns
- Use PokeAPI REST API: Rejected - adds latency, rate limiting concerns
- No images: Rejected - poor user experience

---

### 2. Move Selection Algorithm

**Decision**: Select 4 moves from available pool with level-appropriate priority

**Rationale**:
Based on Source data structure, Pokemon have moves organized by level tiers:
- `start`: Available from level 1
- `level2`, `level6`, `level10`, `level14`, `level18`: Unlocked at those levels
- `tm`: TM-learnable moves (optional)

Algorithm for default level 5:
1. Include all `start` moves in pool
2. Include `level2` moves in pool
3. Randomly select 4 moves from combined pool
4. If pool has fewer than 4 moves, include `tm` moves

**Alternatives Considered**:
- Always give all start moves + random: Rejected - inflexible, predictable
- Pure random from all moves: Rejected - gives high-level moves to low-level Pokemon
- User selects moves: Rejected - out of scope for MVP (P3 story)

---

### 3. Ability Selection Logic

**Decision**: 90% normal ability, 10% hidden ability

**Rationale**:
Based on Source data, abilities have `hidden: true/false` flag:
```json
"abilities": [
  { "id": "overgrow", "hidden": false },
  { "id": "chlorophyll", "hidden": true }
]
```

Hidden abilities should be rare to match game mechanics and add excitement.

**Alternatives Considered**:
- 50/50 split: Rejected - hidden abilities should feel special
- Always normal: Rejected - removes interesting variety
- User choice: Rejected - out of scope for MVP

---

### 4. Nature Stat Modification

**Decision**: Display both base stats and nature-modified stats

**Rationale**:
Natures in Source data use D&D-style stats (str, dex, con, int, wis, cha):
```json
{
  "id": "adamant",
  "increasedStat": "str",
  "decreasedStat": "cha",
  "effect": "+1 STR, -1 CHA"
}
```

Apply +1 to increased stat, -1 to decreased stat (unless same = neutral).
Show original base stats with nature modifier clearly displayed.

**Alternatives Considered**:
- Only show final stats: Rejected - user can't understand nature impact
- Complex percentage modifiers: Rejected - not how Source data works

---

### 5. API Endpoint Design

**Decision**: POST endpoint with optional pokemonId parameter

**Rationale**:
```javascript
// POST /api/generate-pokemon
// Body: { pokemonId?: string, level?: number }
// Response: { success: boolean, pokemon: GeneratedPokemon, error?: string }
```

POST chosen because:
- Allows request body for parameters
- Semantically represents "creating" a generated Pokemon
- Consistent with potential future expansion (saving to collection)

**Alternatives Considered**:
- GET with query params: Rejected - less clean for complex params
- Two separate endpoints: Rejected - duplicates generation logic

---

### 6. Evolution Information Display

**Decision**: Show "evolves to" and "evolves from" information if available

**Rationale**:
Evolution data structure:
```json
{
  "id": "bulbasaur-to-ivysaur",
  "from": "bulbasaur",
  "to": "ivysaur",
  "conditions": [{ "type": "level", "value": 6 }]
}
```

Lookup by Pokemon ID to find evolution paths. Display conditions (level required).

**Alternatives Considered**:
- Full evolution chain: Rejected - complex to implement, can add later
- No evolution info: Rejected - useful information for users

---

### 7. Error Handling Strategy

**Decision**: Graceful degradation with user-friendly messages

**Rationale**:
| Error Type | User Message | Technical Handling |
|------------|--------------|-------------------|
| Missing Source file | "Pokemon data unavailable. Please try again later." | Log error, return 500 |
| Invalid Pokemon ID | "Pokemon not found. Please try a different name." | Return 404 |
| No valid moves | "Could not generate moveset. Using default moves." | Fallback to first 4 available |
| Network timeout | "Generation taking too long. Please try again." | 10s timeout, return 408 |

**Alternatives Considered**:
- Technical error messages: Rejected - bad UX
- Silent failures: Rejected - user confusion

---

### 8. Default Level for Generation

**Decision**: Default to level 5

**Rationale**:
- Level 5 is traditional Pokemon starting level
- Gives access to start moves + level2 moves
- Not too weak, not too strong
- Easy to understand for users

**Alternatives Considered**:
- Level 1: Rejected - too few moves available
- Random level: Rejected - inconsistent experience
- User selects: Rejected - can add as enhancement later

---

## Summary of Key Decisions

| Area | Decision |
|------|----------|
| Sprites | PokeAPI GitHub raw sprites |
| Move Selection | 4 moves from level-appropriate pool |
| Ability Selection | 90% normal / 10% hidden |
| Nature Application | +1/-1 to affected stats |
| API Design | POST /api/generate-pokemon |
| Evolution | Show to/from with conditions |
| Error Handling | Graceful degradation |
| Default Level | Level 5 |

All NEEDS CLARIFICATION items resolved. Ready for Phase 1.
