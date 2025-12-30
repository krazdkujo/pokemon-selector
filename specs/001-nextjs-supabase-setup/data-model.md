# Data Model: Initial Project Setup and Structure

**Feature Branch**: `001-nextjs-supabase-setup`
**Date**: 2025-12-30

## Overview

This feature focuses on project infrastructure setup. The primary data entities are configuration objects and read-only Pokemon data from the Source folder. No database schema changes are required.

## Entities

### 1. Environment Configuration

**Purpose**: Store connection credentials and configuration for Supabase integration.

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | string | Yes | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | string | Yes | Public anonymous key for client-side |
| SUPABASE_SERVICE_KEY | string | Yes | Service role key (server-side only) |

**Validation Rules**:
- NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL
- Keys must be non-empty strings
- SUPABASE_SERVICE_KEY must never be exposed to client-side code

**Storage**: `.env.local` file (local), Vercel Environment Variables (production)

---

### 2. Supabase Client Instance

**Purpose**: Singleton client for Supabase operations.

**Attributes**:
| Field | Type | Description |
|-------|------|-------------|
| supabaseUrl | string | Connection URL from environment |
| supabaseAnonKey | string | Anonymous key from environment |
| client | SupabaseClient | Initialized client instance |

**State Transitions**:
- Uninitialized -> Initialized (on first import)
- Initialized -> Error (if environment variables missing)

**Relationships**:
- Uses Environment Configuration for initialization
- Consumed by API routes and pages requiring auth/database access

---

### 3. Pokemon Data Source (Read-Only Reference)

**Purpose**: Static game data loaded from Source folder JSON files.

**Entity Types**:

#### 3.1 Pokemon
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (kebab-case, e.g., "bulbasaur") |
| name | string | Display name |
| number | integer | Pokedex number |
| type | string[] | Pokemon types (e.g., ["grass", "poison"]) |
| size | string | Size category |
| sr | number | Species rating |
| minLevel | integer | Minimum level |
| hp | integer | Hit points |
| ac | integer | Armor class |
| attributes | object | STR, DEX, CON, INT, WIS, CHA stats |
| abilities | object[] | Ability references with hidden flag |
| moves | object | Move lists by level/TM |

#### 3.2 Moves
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Display name |
| type | string | Move type |
| damage | string | Damage formula |
| description | string | Move effect description |

#### 3.3 Abilities
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Display name |
| description | string | Ability effect description |

#### 3.4 Items
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Display name |
| description | string | Item description |
| effects | string | Item effects |

#### 3.5 Metadata
| Field | Type | Description |
|-------|------|-------------|
| version | string | Data version |
| importedAt | string (ISO date) | Import timestamp |
| source.repository | string | Source repository URL |
| source.commit | string | Source commit hash |
| entityCounts | object | Count per entity type |

**Relationships**:
- Pokemon -> Abilities (many-to-many via ability IDs)
- Pokemon -> Moves (many-to-many via move IDs)
- Pokemon -> TMs (many-to-many via TM numbers)
- Evolution chains link Pokemon entities

**Access Pattern**:
- Loaded via `lib/pokemonData.js` utility functions
- All access is read-only
- Data can be loaded at build time (getStaticProps) or runtime (API routes)

---

## Data Flow Diagram

```
[Source/]                    [lib/pokemonData.js]          [Consumer]
    |                               |                          |
    |  ---- JSON files ---->        |                          |
    |                               |  <-- getAllPokemon() --- |
    |                               |  --- Pokemon[] -------> |
    |                               |                          |
    |                               |  <-- getPokemonById() -- |
    |                               |  --- Pokemon ---------> |
    |                               |                          |
    |                               |  <-- getMetadata() ----- |
    |                               |  --- Metadata --------> |
```

---

## Validation Requirements

### Environment Variables
1. All required variables must be present before app initialization
2. Missing variables should produce clear error messages
3. Format validation for URL and key patterns

### Source Data
1. JSON files must exist and be valid JSON
2. Entity counts should match metadata
3. Reference integrity (Pokemon ability/move IDs should exist in respective files) - validated at usage time, not load time

---

## Notes

- No database tables are created in this feature
- Supabase database schema will be defined in future features
- Pokemon data structure follows the poke5e repository format
- All Source folder data is treated as immutable
