# Data Model: Pokemon Collection View

**Feature**: 005-pokemon-collection-view
**Date**: 2025-12-31

## Entities

### Pokemon (Source Data - Read Only)

Represents a Pokemon species from the Source/pokemon/pokemon.json file.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (kebab-case, e.g., "bulbasaur") |
| name | string | Display name (e.g., "Bulbasaur") |
| number | integer | Pokedex number (1-1142) |
| type | string[] | Array of 1-2 types (e.g., ["grass", "poison"]) |
| sr | number | Spawn Rate / Rarity (0.125, 0.25, 0.5, 1-15) |
| size | string | Size category (tiny, small, medium, large, huge) |
| minLevel | integer | Minimum level for encounter |
| description | string | Flavor text description |
| hp | integer | Base hit points |
| ac | integer | Armor class |
| hitDice | string | Hit dice type (e.g., "d6") |
| speed | object[] | Movement speeds by type |
| attributes | object | STR, DEX, CON, INT, WIS, CHA values |
| skills | string[] | Proficient skills |
| savingThrows | string[] | Proficient saving throws |
| abilities | object[] | Array of {id, hidden, description} |
| moves | object | Moves by learning method (start, level, tm, egg) |
| evolution | string | Evolution stage description |
| media | object | Sprite URLs (main, sprite, shiny variants) |

**Validation Rules**:
- number: Must be positive integer
- type: Array with 1-2 valid type strings
- sr: Must be one of: 0.125, 0.25, 0.5, 1-15

### Filter State (Client-Side)

Represents the current filter configuration in the UI.

| Field | Type | Description |
|-------|------|-------------|
| selectedTypes | string[] | 0-2 selected type filters |
| selectedSR | number \| null | Selected SR value or null for all |

**State Transitions**:
- Initial: { selectedTypes: [], selectedSR: null } (shows all Pokemon)
- Type selected: Add type to selectedTypes (max 2)
- Type deselected: Remove type from selectedTypes
- SR selected: Set selectedSR to value
- SR cleared: Set selectedSR to null
- Clear all: Reset to initial state

### Player Pokemon (Database - Existing)

References user's owned Pokemon in player_pokemon table.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Owner's auth.users ID |
| pokemon_id | string | References Pokemon.id |
| is_active | boolean | In active roster (true) or storage (false) |
| slot_number | integer \| null | Roster slot 1-6 if active |
| level | integer | Current level (1-20) |
| nickname | string \| null | Optional nickname |
| acquired_at | timestamp | When acquired |

**Relationship**: Used to determine if user has a starter (has any row in player_pokemon).

## Type Reference

Valid Pokemon types (18 total):
```
bug, dark, dragon, electric, fairy, fighting, fire, flying,
ghost, grass, ground, ice, normal, poison, psychic, rock, steel, water
```

## SR Value Reference

Valid SR values (18 total):
```
Fractional: 0.125, 0.25, 0.5
Integer: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
```

## Filter Logic

### Type Filter (OR within selection)

```
If selectedTypes is empty:
  Show all Pokemon
Else:
  Show Pokemon where type[] contains ANY of selectedTypes
```

### SR Filter (Exact match)

```
If selectedSR is null:
  Show all Pokemon
Else:
  Show Pokemon where sr === selectedSR
```

### Combined Filter (AND between filters)

```
filteredPokemon = allPokemon.filter(pokemon => {
  const passesTypeFilter = selectedTypes.length === 0 ||
    selectedTypes.some(type => pokemon.type.includes(type));
  const passesSRFilter = selectedSR === null ||
    pokemon.sr === selectedSR;
  return passesTypeFilter && passesSRFilter;
});
```

## Data Flow

```
Source/pokemon/pokemon.json
         |
         v
  lib/pokemonData.js (getAllPokemon)
         |
         v
  pages/api/collection.js (GET endpoint)
         |
         v
  pages/collection.js (page component)
         |
         v
  CollectionFilterBar (filter state)
         |
         v
  PokemonCollectionGrid (filtered display)
         |
         v
  PokemonDetailModal (on click)
```
