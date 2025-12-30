# Data Model: Pokemon Selector and Generation System

**Feature**: 003-pokemon-generator
**Date**: 2025-12-30

## Source Data Entities (Read-Only)

These entities exist in the `Source/` folder JSON files and are read-only.

### Pokemon (Source/pokemon/pokemon.json)

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (kebab-case, e.g., "bulbasaur") |
| name | string | Display name (e.g., "Bulbasaur") |
| number | number | Pokedex number |
| type | string[] | Type(s) of the Pokemon (e.g., ["grass", "poison"]) |
| size | string | Size category (tiny, small, medium, large, huge) |
| sr | number | Challenge rating |
| minLevel | number | Minimum level for this Pokemon |
| eggGroup | string[] | Breeding groups |
| gender | string | Gender ratio (e.g., "1:7") |
| description | string | Flavor text description |
| ac | number | Armor class |
| hp | number | Hit points |
| hitDice | string | Hit dice type (e.g., "d6") |
| speed | object[] | Movement speeds ({ type, value }) |
| attributes | object | Base stats { str, dex, con, int, wis, cha } |
| skills | string[] | Proficient skills |
| savingThrows | string[] | Proficient saving throws |
| senses | string[] | Special senses |
| abilities | object[] | Available abilities [{ id, hidden, description }] |
| moves | object | Move pools by level { start, level2, level6, ... tm } |

### Move (Source/moves/moves.json)

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (kebab-case) |
| name | string | Display name |
| type | string | Move type (grass, fire, etc.) |
| power | string[] | Attribute(s) used for the move |
| time | string | Action time required |
| pp | number | Power points (usage limit) |
| duration | string | Effect duration |
| range | string | Attack range |
| description | string | Move description and effects |
| higherLevels | string | Scaling at higher levels |

### Ability (Source/abilities/abilities.json)

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Display name |
| description | string | Ability effect description |

### Nature (Source/natures/natures.json)

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Display name |
| increasedStat | string | Stat that gets +1 (str, dex, con, int, wis, cha) |
| decreasedStat | string | Stat that gets -1 |
| effect | string | Human-readable effect (e.g., "+1 STR, -1 CHA" or "Neutral") |

### Evolution (Source/evolution/evolution.json)

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (e.g., "bulbasaur-to-ivysaur") |
| from | string | Pokemon ID that evolves |
| to | string | Pokemon ID it evolves into |
| conditions | object[] | Evolution conditions [{ type, value }] |
| effects | object[] | Evolution effects [{ type, value }] |

---

## Generated Entity (Runtime)

This entity is created by the generation API and sent to the frontend.

### GeneratedPokemon

| Field | Type | Description |
|-------|------|-------------|
| id | string | Base Pokemon ID |
| name | string | Pokemon display name |
| number | number | Pokedex number |
| types | string[] | Pokemon type(s) |
| size | string | Size category |
| description | string | Flavor text |
| spriteUrl | string | URL to Pokemon sprite image |
| level | number | Generated level (default: 5) |
| baseStats | object | Original { str, dex, con, int, wis, cha, hp, ac } |
| modifiedStats | object | Stats after nature modifier applied |
| nature | object | Selected nature { id, name, effect } |
| ability | object | Selected ability { id, name, description, isHidden } |
| moves | object[] | Array of 4 moves [{ id, name, type, description, pp, range }] |
| evolution | object | Evolution info { evolvesTo, evolvesFrom, condition } or null |
| speed | object[] | Movement speeds |
| skills | string[] | Proficient skills |
| savingThrows | string[] | Proficient saving throws |

---

## Entity Relationships

```
Pokemon 1---* PokemonAbility (abilities array)
Pokemon 1---* PokemonMove (moves object)
Move *---1 MoveType (type field)
Nature 1---1 GeneratedPokemon (selected at generation)
Ability 1---1 GeneratedPokemon (selected at generation)
Pokemon *---* Evolution (from/to fields)
```

---

## Validation Rules

### Pokemon ID Validation
- Must exist in pokemon.json array
- Case-insensitive lookup (convert to lowercase)
- Return 404 if not found

### Move Selection Validation
- Must select exactly 4 moves
- Moves must exist in Pokemon's move pool for given level
- Fallback to any available moves if pool too small

### Ability Selection Validation
- Must select ability from Pokemon's abilities array
- Track if selected ability is hidden

### Nature Selection Validation
- Must be one of 25 valid natures from natures.json
- Apply stat modifications only if increasedStat != decreasedStat

---

## State Transitions

This feature is stateless for MVP. Each generation request produces a new GeneratedPokemon with no persistence.

Future enhancement (out of scope):
- Save generated Pokemon to user's collection in Supabase
- Track generation history
