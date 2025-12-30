# Research: Starter Pokemon Selection

**Feature Branch**: `004-starter-selection`
**Date**: 2025-12-30

## Research Summary

This document captures key technical decisions and research findings for the starter selection feature.

---

## Decision 1: Database Table Design for PlayerPokemon

**Decision**: Create a single `player_pokemon` table in Supabase with `is_active` boolean and `slot_number` nullable integer.

**Rationale**:
- Single table simplifies queries and maintains referential integrity
- `is_active=true` + `slot_number (1-6)` = Active roster
- `is_active=false` + `slot_number=null` = Storage
- Supabase RLS can easily filter by `auth.uid() = user_id`
- Index on `(user_id, is_active)` enables fast roster queries

**Alternatives Considered**:
1. **Separate tables (active_roster, storage)**: Rejected - adds complexity, requires moving rows between tables
2. **JSONB array on user record**: Rejected - harder to query, no RLS granularity, limits on array size

---

## Decision 2: Type Filtering Implementation

**Decision**: Client-side filtering of pre-loaded starter Pokemon list.

**Rationale**:
- Only 229 eligible starters (SR <= 0.5) - small enough to load all at once
- Type filtering is instant with no API latency
- Reduces server load and simplifies API
- Data comes from static Source folder JSON (no database query needed)

**Alternatives Considered**:
1. **Server-side filtering per request**: Rejected - unnecessary latency for small dataset
2. **Cached filtered sets per type**: Rejected - overcomplicates for marginal benefit

---

## Decision 3: Starter Selection Prevention Logic

**Decision**: Check `hasStarter` flag from API before showing selection UI, enforce at API level.

**Rationale**:
- API must validate to prevent bypassing UI restrictions
- Frontend check improves UX by hiding button if already has starter
- Single source of truth: count of player's active Pokemon > 0 means has starter

**Alternatives Considered**:
1. **Separate `has_starter` column**: Rejected - redundant, can derive from existing data
2. **Frontend-only check**: Rejected - insecure, easily bypassed

---

## Decision 4: Roster Slot Assignment

**Decision**: Use next available slot (1-6) when adding Pokemon, allow gaps.

**Rationale**:
- Simple increment logic: `MAX(slot_number) + 1` or `1` if empty
- When removing Pokemon, slot becomes available for next addition
- No need to compact slots - UI can render based on actual slot numbers

**Alternatives Considered**:
1. **Always compact slots**: Rejected - requires updating multiple rows on removal
2. **Fixed slot assignment (never reuse)**: Rejected - limits to 6 Pokemon ever

---

## Decision 5: API Authentication Pattern

**Decision**: Use Supabase `getUser()` from request headers in each API route.

**Rationale**:
- Follows existing auth pattern from 002-auth-login implementation
- Supabase automatically validates JWT from Authorization header
- Returns user.id for ownership checks
- Returns 401 if not authenticated

**Alternatives Considered**:
1. **Cookie-based sessions**: Available via Supabase, but header-based is more explicit
2. **Custom JWT validation**: Rejected - Supabase handles this

---

## Decision 6: Pokemon Sprite URLs

**Decision**: Use PokeAPI sprite URL pattern: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{number}.png`

**Rationale**:
- Already established pattern from 003-pokemon-generator
- Reliable CDN-hosted sprites
- Uses Pokemon `number` field from Source data
- No need to host sprites locally

**Alternatives Considered**:
1. **Local sprite hosting**: Rejected - increases bundle size, maintenance burden
2. **Official Pokemon API**: Rejected - rate limited, requires API key

---

## Decision 7: Storage View Implementation

**Decision**: Separate `/storage` page (P4 priority) with pagination.

**Rationale**:
- Storage can grow unbounded - pagination prevents performance issues
- Separate page keeps dashboard focused on active roster
- Can lazy-load as P4 after core selection works

**Alternatives Considered**:
1. **Modal overlay on dashboard**: Rejected - harder to navigate large storage
2. **Infinite scroll**: Rejected - pagination simpler to implement

---

## Decision 8: Supabase RLS Policies

**Decision**: Implement row-level security on `player_pokemon` table.

**Policies**:
```sql
-- Users can only see their own Pokemon
CREATE POLICY "Users can view own pokemon" ON player_pokemon
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own Pokemon
CREATE POLICY "Users can insert own pokemon" ON player_pokemon
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own Pokemon
CREATE POLICY "Users can update own pokemon" ON player_pokemon
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own Pokemon
CREATE POLICY "Users can delete own pokemon" ON player_pokemon
  FOR DELETE USING (auth.uid() = user_id);
```

**Rationale**:
- Constitution mandates RLS for all tables
- Prevents cross-user data access even if API bugs exist
- Supabase enforces at database level

---

## Technical Notes

### Existing Data Loader Pattern

From `lib/pokemonData.js`:
```javascript
export function getAllPokemon() {
  const filePath = path.join(SOURCE_DIR, 'pokemon', 'pokemon.json')
  return readJsonFile(filePath)
}
```

New function needed:
```javascript
export function getStarterPokemon() {
  const all = getAllPokemon()
  return all.filter(p => p.sr <= 0.5)
}
```

### Pokemon Types (18 total)

```javascript
const POKEMON_TYPES = [
  'bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting',
  'fire', 'flying', 'ghost', 'grass', 'ground', 'ice',
  'normal', 'poison', 'psychic', 'rock', 'steel', 'water'
]
```

### Starter Eligibility

- Source data field: `sr` (Challenge Rating)
- Eligible values: `sr <= 0.5` (includes 0.125, 0.25, 0.5)
- Count: 229 Pokemon eligible as starters
