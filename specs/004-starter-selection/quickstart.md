# Quickstart: Starter Pokemon Selection

**Feature Branch**: `004-starter-selection`
**Date**: 2025-12-30

## Prerequisites

1. Node.js 18+ installed
2. Supabase project configured with auth enabled
3. `.env.local` with Supabase credentials
4. `npm install` completed

## Database Setup

Run the following SQL in your Supabase SQL Editor:

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
  CONSTRAINT unique_user_slot UNIQUE (user_id, slot_number)
);

-- Create indexes
CREATE INDEX idx_player_pokemon_user_active ON player_pokemon(user_id, is_active);
CREATE INDEX idx_player_pokemon_user_id ON player_pokemon(user_id);

-- Enable Row Level Security
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

## Development Server

```bash
npm run dev
```

Server runs at http://localhost:3000 (or next available port).

## Validation Steps

### 1. Verify Database Setup

In Supabase Dashboard > Table Editor, confirm `player_pokemon` table exists with correct columns.

### 2. Test Starter Browsing

1. Log in to the application
2. Navigate to `/select-starter`
3. Verify type filter bar shows 18 types
4. Click a type (e.g., "Fire")
5. Verify only Fire-type Pokemon with SR <= 0.5 appear

### 3. Test Starter Selection

1. With types filtered, click on a Pokemon card
2. Verify detail modal opens with stats and "Choose as Starter" button
3. Click "Choose as Starter"
4. Verify redirect to dashboard
5. Verify Pokemon appears in active roster slot 1

### 4. Test Duplicate Prevention

1. Navigate back to `/select-starter`
2. Verify message: "You already have a starter!"
3. Verify no Pokemon selection options are shown

### 5. Test Roster Display

1. On dashboard, verify active roster section shows 6 slots
2. Verify slot 1 has your starter Pokemon
3. Verify slots 2-6 show "Empty" placeholders

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/starters` | GET | Get all eligible starters + hasStarter flag |
| `/api/starters` | POST | Select a starter (body: `{pokemonId}`) |
| `/api/roster` | GET | Get active roster (6 slots) |
| `/api/roster` | PUT | Update roster slot (move to storage, etc.) |
| `/api/storage` | GET | Get storage with pagination |
| `/api/storage` | POST | Move Pokemon from storage to active |

## File Locations

| Purpose | Path |
|---------|------|
| Starter selection page | `pages/select-starter.js` |
| Starters API | `pages/api/starters.js` |
| Roster API | `pages/api/roster.js` |
| Storage API | `pages/api/storage.js` |
| Type filter component | `components/TypeFilterBar.jsx` |
| Starter grid component | `components/StarterGrid.jsx` |
| Active roster component | `components/ActiveRoster.jsx` |
| Data loader extension | `lib/pokemonData.js` (add getStarterPokemon) |

## Common Issues

### "Table does not exist" error
Run the SQL schema in Supabase SQL Editor.

### 401 Unauthorized
Ensure user is logged in. Check Authorization header in browser dev tools.

### No starters showing
Check Source/pokemon/pokemon.json exists and has Pokemon with `sr <= 0.5`.

### RLS errors
Ensure RLS policies are created and `auth.uid()` matches the user_id.
