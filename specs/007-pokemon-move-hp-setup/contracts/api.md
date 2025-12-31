# API Contracts: Pokemon Move Selection and HP Setup

**Feature Branch**: `007-pokemon-move-hp-setup`
**Date**: 2025-12-31

## Modified Endpoints

### POST /api/starters - Select Starter Pokemon (Updated)

Adds move selection and HP calculation to starter selection.

**Request**:
```json
{
  "pokemonId": "bulbasaur",
  "nickname": "Leafy",
  "selectedMoves": ["tackle", "growl"],
  "hpMethod": "average"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| pokemonId | string | Yes | Pokemon ID from Source data |
| nickname | string | No | Optional nickname (max 20 chars) |
| selectedMoves | string[] | Yes | Array of 1-4 move IDs |
| hpMethod | string | Yes | "average" or "roll" |

**Response (201 Created)**:
```json
{
  "success": true,
  "pokemon": {
    "id": "uuid",
    "pokemonId": "bulbasaur",
    "name": "Bulbasaur",
    "number": 1,
    "nickname": "Leafy",
    "isActive": true,
    "slotNumber": 1,
    "level": 1,
    "types": ["grass", "poison"],
    "sr": 0.5,
    "spriteUrl": "https://...",
    "acquiredAt": "2025-12-31T10:00:00Z",
    "selectedMoves": ["tackle", "growl"],
    "currentHp": 7,
    "maxHp": 7,
    "hpMethod": "average",
    "hpRolls": null,
    "attributes": { "str": 13, "dex": 12, "con": 12, ... },
    "hitDice": "d6",
    "moves": { "start": [...], "level2": [...], ... },
    "abilities": [...]
  }
}
```

**Error Responses**:

| Status | Error | Condition |
|--------|-------|-----------|
| 400 | "Pokemon ID is required" | Missing pokemonId |
| 400 | "Selected moves are required" | Missing or empty selectedMoves |
| 400 | "Must select between 1 and 4 moves" | Invalid move count |
| 400 | "Invalid move: {moveId}" | Move not available for level |
| 400 | "HP method must be 'average' or 'roll'" | Invalid hpMethod |
| 400 | "This Pokemon is not eligible as a starter" | SR > 0.5 |
| 400 | "You already have a starter!" | User has existing Pokemon |
| 401 | "Unauthorized" | Missing/invalid auth token |
| 404 | "Pokemon not found" | Invalid pokemonId |
| 500 | "Failed to save..." | Database error |

---

## New Endpoints

### POST /api/calculate-hp - Calculate HP Preview

Calculates HP without saving. Used for UI preview before confirming.

**Request**:
```json
{
  "pokemonId": "bulbasaur",
  "level": 1,
  "hpMethod": "roll"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| pokemonId | string | Yes | Pokemon ID from Source data |
| level | number | Yes | Pokemon level (1-20) |
| hpMethod | string | Yes | "average" or "roll" |

**Response (200 OK)**:
```json
{
  "success": true,
  "hp": 7,
  "maxHp": 7,
  "rolls": [6],
  "breakdown": {
    "hitDice": "d6",
    "conScore": 12,
    "conModifier": 1,
    "level": 1,
    "method": "roll",
    "dieValue": 6,
    "perLevelRolls": [6],
    "conBonus": 1,
    "total": 7
  }
}
```

For average method, `rolls` is null and `perLevelRolls` shows the fixed values.

**Error Responses**:

| Status | Error | Condition |
|--------|-------|-----------|
| 400 | "Pokemon ID is required" | Missing pokemonId |
| 400 | "Level must be between 1 and 20" | Invalid level |
| 400 | "HP method must be 'average' or 'roll'" | Invalid hpMethod |
| 401 | "Unauthorized" | Missing/invalid auth token |
| 404 | "Pokemon not found" | Invalid pokemonId |

---

### GET /api/pokemon-moves - Get Available Moves

Returns available moves for a Pokemon at a given level.

**Request**: Query parameters
```
GET /api/pokemon-moves?pokemonId=bulbasaur&level=6
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pokemonId | string | Yes | Pokemon ID from Source data |
| level | number | Yes | Pokemon level (1-20) |

**Response (200 OK)**:
```json
{
  "success": true,
  "pokemonId": "bulbasaur",
  "level": 6,
  "moves": [
    {
      "id": "tackle",
      "name": "Tackle",
      "type": "normal",
      "levelLearned": 1,
      "description": "A physical attack..."
    },
    {
      "id": "growl",
      "name": "Growl",
      "type": "normal",
      "levelLearned": 1,
      "description": "The user growls..."
    },
    {
      "id": "vine-whip",
      "name": "Vine Whip",
      "type": "grass",
      "levelLearned": 2,
      "description": "The user strikes..."
    }
  ],
  "movesByLevel": {
    "1": ["tackle", "growl"],
    "2": ["vine-whip", "leech-seed"],
    "6": ["poison-powder", "sleep-powder", "take-down", "razor-leaf"]
  }
}
```

**Error Responses**:

| Status | Error | Condition |
|--------|-------|-----------|
| 400 | "Pokemon ID is required" | Missing pokemonId |
| 400 | "Level must be between 1 and 20" | Invalid level |
| 401 | "Unauthorized" | Missing/invalid auth token |
| 404 | "Pokemon not found" | Invalid pokemonId |

---

## Request/Response Types

### MoveInfo

```typescript
interface MoveInfo {
  id: string           // e.g., "tackle"
  name: string         // e.g., "Tackle"
  type: string         // e.g., "normal"
  levelLearned: number // Level at which move becomes available
  description: string  // Move description
  power?: string[]     // Stat(s) used for attack
  time?: string        // Action time
  pp?: number          // Power points
  range?: string       // Attack range
}
```

### HPBreakdown

```typescript
interface HPBreakdown {
  hitDice: string      // e.g., "d6"
  conScore: number     // Constitution score
  conModifier: number  // Calculated modifier
  level: number        // Pokemon level
  method: 'average' | 'roll'
  dieValue: number     // Numeric die value (6 for d6)
  perLevelRolls: number[] // Roll or average for each level
  conBonus: number     // Total CON bonus (modifier * level)
  total: number        // Final HP
}
```

### PlayerPokemonResponse (Extended)

```typescript
interface PlayerPokemonResponse {
  // Existing fields
  id: string
  pokemonId: string
  name: string
  number: number
  nickname: string | null
  isActive: boolean
  slotNumber: number | null
  level: number
  types: string[]
  sr: number
  spriteUrl: string
  acquiredAt: string
  attributes: Record<string, number>
  description: string
  abilities: Ability[]
  moves: Record<string, string[]>
  hp: number
  ac: number
  size: string
  minLevel: number
  hitDice: string
  evolution: string

  // New fields
  selectedMoves: string[]
  currentHp: number
  maxHp: number
  hpMethod: 'average' | 'roll'
  hpRolls: number[] | null
}
```
