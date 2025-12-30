# Data Model: Starter Pokemon Selection

**Feature Branch**: `004-starter-selection`
**Date**: 2025-12-30

## Entity Definitions

### PlayerPokemon

Represents a Pokemon owned by a player, either in their active roster or storage.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| user_id | UUID | NOT NULL, FK → auth.users(id) | Owner's user ID |
| pokemon_id | TEXT | NOT NULL | Pokemon ID from Source data (e.g., "bulbasaur") |
| is_active | BOOLEAN | NOT NULL, DEFAULT false | True if in active roster |
| slot_number | INTEGER | NULL, CHECK (slot_number >= 1 AND slot_number <= 6) | Roster position (1-6) or NULL for storage |
| level | INTEGER | NOT NULL, DEFAULT 1, CHECK (level >= 1 AND level <= 20) | Pokemon level |
| nickname | TEXT | NULL | Optional custom name |
| acquired_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | When Pokemon was acquired |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Record creation time |

**Indexes**:
- `idx_player_pokemon_user_active` ON (user_id, is_active) - Fast roster queries
- `idx_player_pokemon_user_id` ON (user_id) - User's Pokemon lookup

**Constraints**:
- Unique slot per user: `UNIQUE (user_id, slot_number) WHERE slot_number IS NOT NULL`
- Max 6 active: Enforced at API level (SELECT COUNT before INSERT)

---

## SQL Schema

```sql
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create player_pokemon table
CREATE TABLE player_pokemon (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pokemon_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  slot_number INTEGER CHECK (slot_number >= 1 AND slot_number <= 6),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 20),
  nickname TEXT,
  acquired_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  -- Ensure unique slot per user (only for non-null slots)
  CONSTRAINT unique_user_slot UNIQUE (user_id, slot_number)
);

-- Create indexes
CREATE INDEX idx_player_pokemon_user_active ON player_pokemon(user_id, is_active);
CREATE INDEX idx_player_pokemon_user_id ON player_pokemon(user_id);

-- Row Level Security
ALTER TABLE player_pokemon ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own pokemon"
  ON player_pokemon FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pokemon"
  ON player_pokemon FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pokemon"
  ON player_pokemon FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pokemon"
  ON player_pokemon FOR DELETE
  USING (auth.uid() = user_id);
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
    ▼
Source/pokemon/pokemon.json (read-only)
```

---

## State Transitions

### Pokemon Location States

```
┌─────────────┐     Select Starter     ┌─────────────┐
│   (none)    │ ──────────────────────▶│   Active    │
└─────────────┘                        │  (slot 1-6) │
                                       └──────┬──────┘
                                              │
                              Move to Storage │
                                              ▼
                                       ┌─────────────┐
                                       │   Storage   │
                                       │ (slot=NULL) │
                                       └──────┬──────┘
                                              │
                               Move to Active │ (if slot available)
                                              ▼
                                       ┌─────────────┐
                                       │   Active    │
                                       │  (slot 1-6) │
                                       └─────────────┘
```

### Slot Assignment Rules

1. **New Pokemon (starter)**: Assign to slot 1
2. **New Pokemon (full roster)**: Go to storage (is_active=false, slot_number=NULL)
3. **Move to active**: Find lowest available slot (1-6)
4. **Move to storage**: Set is_active=false, slot_number=NULL

---

## Validation Rules

| Rule | Enforcement | Description |
|------|-------------|-------------|
| Valid pokemon_id | API | Check exists in Source/pokemon/pokemon.json |
| Max 6 active | API | Count active before adding, reject if >= 6 |
| Valid slot (1-6) | Database | CHECK constraint |
| User ownership | RLS | auth.uid() = user_id |
| Level range | Database | CHECK (level >= 1 AND level <= 20) |

---

## Sample Data

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "pokemon_id": "bulbasaur",
  "is_active": true,
  "slot_number": 1,
  "level": 1,
  "nickname": null,
  "acquired_at": "2025-12-30T10:00:00Z",
  "created_at": "2025-12-30T10:00:00Z"
}
```
