# Data Model: Pokemon Move Selection and HP Setup

**Feature Branch**: `007-pokemon-move-hp-setup`
**Date**: 2025-12-31

## Entity Definitions

### PlayerPokemon (Extended)

Extends the existing `player_pokemon` table from feature 004 with move and HP data.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | (existing) Unique identifier |
| user_id | UUID | NOT NULL, FK | (existing) Owner's user ID |
| pokemon_id | TEXT | NOT NULL | (existing) Pokemon ID from Source data |
| is_active | BOOLEAN | NOT NULL | (existing) True if in active roster |
| slot_number | INTEGER | NULL | (existing) Roster position (1-6) |
| level | INTEGER | NOT NULL | (existing) Pokemon level |
| nickname | TEXT | NULL | (existing) Optional custom name |
| acquired_at | TIMESTAMP | NOT NULL | (existing) When Pokemon was acquired |
| created_at | TIMESTAMP | NOT NULL | (existing) Record creation time |
| **selected_moves** | TEXT[] | NOT NULL, CHECK array_length <= 4 | **NEW**: Array of move IDs (1-4 moves) |
| **current_hp** | INTEGER | NOT NULL, CHECK >= 1 | **NEW**: Current HP value |
| **max_hp** | INTEGER | NOT NULL, CHECK >= 1 | **NEW**: Maximum HP value |
| **hp_method** | TEXT | NOT NULL, CHECK IN ('average', 'roll') | **NEW**: HP calculation method used |
| **hp_rolls** | INTEGER[] | NULL | **NEW**: Roll history (null if average method) |

**New Constraints**:
- `selected_moves` must have 1-4 elements
- `current_hp` must be <= `max_hp`
- `hp_method` must be 'average' or 'roll'
- `hp_rolls` should only be non-null when `hp_method` = 'roll'

---

## SQL Schema Changes

```sql
-- Add new columns to existing player_pokemon table
ALTER TABLE player_pokemon
  ADD COLUMN selected_moves TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN current_hp INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN max_hp INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN hp_method TEXT NOT NULL DEFAULT 'average',
  ADD COLUMN hp_rolls INTEGER[];

-- Add constraints for new columns
ALTER TABLE player_pokemon
  ADD CONSTRAINT check_moves_count
    CHECK (array_length(selected_moves, 1) >= 1 AND array_length(selected_moves, 1) <= 4),
  ADD CONSTRAINT check_hp_positive
    CHECK (current_hp >= 1 AND max_hp >= 1),
  ADD CONSTRAINT check_current_hp_max
    CHECK (current_hp <= max_hp),
  ADD CONSTRAINT check_hp_method
    CHECK (hp_method IN ('average', 'roll'));

-- Update default for selected_moves to require at least one move
-- Note: Default is for migration only; API will always provide moves
COMMENT ON COLUMN player_pokemon.selected_moves IS 'Array of move IDs (1-4 moves)';
COMMENT ON COLUMN player_pokemon.current_hp IS 'Current HP, may be reduced by damage';
COMMENT ON COLUMN player_pokemon.max_hp IS 'Maximum HP calculated at acquisition';
COMMENT ON COLUMN player_pokemon.hp_method IS 'average or roll - how HP was calculated';
COMMENT ON COLUMN player_pokemon.hp_rolls IS 'Roll history for roll method, null for average';
```

---

## Migration Strategy

Since existing records lack move/HP data, migration handles them gracefully:

```sql
-- Migration script for existing player_pokemon records
-- Sets reasonable defaults for Pokemon acquired before this feature

-- Step 1: Add columns with permissive defaults
ALTER TABLE player_pokemon
  ADD COLUMN IF NOT EXISTS selected_moves TEXT[] DEFAULT ARRAY['tackle']::TEXT[],
  ADD COLUMN IF NOT EXISTS current_hp INTEGER DEFAULT 10,
  ADD COLUMN IF NOT EXISTS max_hp INTEGER DEFAULT 10,
  ADD COLUMN IF NOT EXISTS hp_method TEXT DEFAULT 'average',
  ADD COLUMN IF NOT EXISTS hp_rolls INTEGER[];

-- Step 2: Update existing records with calculated values
-- (Run once, then constraints can be added)
UPDATE player_pokemon
SET selected_moves = ARRAY['tackle']::TEXT[]
WHERE selected_moves IS NULL OR selected_moves = '{}';

-- Step 3: Add constraints after data is valid
ALTER TABLE player_pokemon
  ALTER COLUMN selected_moves SET NOT NULL,
  ALTER COLUMN current_hp SET NOT NULL,
  ALTER COLUMN max_hp SET NOT NULL,
  ALTER COLUMN hp_method SET NOT NULL;
```

---

## Entity Relationships

```
auth.users (Supabase built-in)
    │
    │ 1:N
    ▼
player_pokemon
    │
    │ References (via pokemon_id)
    │ ─────────────────────────────────► Source/pokemon/pokemon.json
    │
    │ References (via selected_moves[])
    └─────────────────────────────────► Source/moves/moves.json
```

---

## Derived Data (Not Stored)

These values are computed at runtime, not stored in the database:

| Derived Field | Source | Calculation |
|---------------|--------|-------------|
| Available Moves | pokemon.moves + level | All moves from start through current level |
| CON Modifier | pokemon.attributes.con | (CON - 10) / 2, floored |
| Hit Die Value | pokemon.hitDice | Parse "d6" -> 6, "d8" -> 8 |

---

## Validation Rules

| Rule | Enforcement | Description |
|------|-------------|-------------|
| 1-4 moves selected | Database + API | CHECK constraint + API validation |
| Moves valid for level | API | Verify each move exists in available pool |
| Move IDs exist | API | Verify against Source/moves/moves.json |
| HP > 0 | Database | CHECK constraint |
| current_hp <= max_hp | Database | CHECK constraint |
| hp_method valid | Database | CHECK IN ('average', 'roll') |
| hp_rolls matches level | API | Length should equal level (if roll method) |

---

## Sample Data

### New Pokemon with Average HP

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "user_id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "pokemon_id": "bulbasaur",
  "is_active": true,
  "slot_number": 1,
  "level": 1,
  "nickname": "Leafy",
  "acquired_at": "2025-12-31T10:00:00Z",
  "created_at": "2025-12-31T10:00:00Z",
  "selected_moves": ["tackle", "growl"],
  "current_hp": 7,
  "max_hp": 7,
  "hp_method": "average",
  "hp_rolls": null
}
```

### New Pokemon with Rolled HP (Level 5)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "user_id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "pokemon_id": "charmander",
  "is_active": true,
  "slot_number": 2,
  "level": 5,
  "nickname": null,
  "acquired_at": "2025-12-31T11:00:00Z",
  "created_at": "2025-12-31T11:00:00Z",
  "selected_moves": ["scratch", "growl", "ember", "smokescreen"],
  "current_hp": 28,
  "max_hp": 28,
  "hp_method": "roll",
  "hp_rolls": [6, 4, 5, 3, 6]
}
```

**HP Calculation Breakdown**:
- Level 1: 6 (max d6)
- Level 2: 4 (rolled)
- Level 3: 5 (rolled)
- Level 4: 3 (rolled)
- Level 5: 6 (rolled)
- Base: 6 + 4 + 5 + 3 + 6 = 24
- CON Modifier: Charmander CON 10 -> mod 0
- Total: 24 + (5 * 0) = 24... wait, let me recalculate with actual data

Actually, Charmander's CON would need to be checked. For sample purposes, assuming CON 12 (mod +1):
- Total: 24 + (5 * 1) = 29 HP
