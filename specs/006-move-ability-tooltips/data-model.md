# Data Model: Move and Ability Hover Tooltips

**Feature**: 006-move-ability-tooltips
**Date**: 2025-12-31

## Entities

### Move (existing - Source/moves/moves.json)

Represents a Pokemon attack or action.

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| id | string | Unique identifier (kebab-case) | Yes |
| name | string | Display name | Yes |
| type | string | Pokemon type (grass, fire, etc.) | Yes |
| power | string[] or "none" | Ability score(s) used for attack | Yes |
| time | string | Action economy (1 action, 1 bonus action, etc.) | Yes |
| pp | number | Power points / usage limit | Yes |
| duration | string | Effect duration | Yes |
| range | string | Attack range | Yes |
| description | string | Full move description | Yes |
| higherLevels | string | Scaling at higher levels | No |

**Sample data**:
```json
{
  "id": "absorb",
  "name": "Absorb",
  "type": "grass",
  "power": ["str", "dex"],
  "time": "1 action",
  "pp": 15,
  "duration": "instantaneous",
  "range": "melee",
  "description": "You attempt to absorb some of a target's health...",
  "higherLevels": "The damage dice roll for this move changes to 2d4 at level 5..."
}
```

### Ability (existing - Source/abilities/abilities.json)

Represents a Pokemon passive capability.

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| id | string | Unique identifier (kebab-case) | Yes |
| name | string | Display name | Yes |
| description | string | Full ability description | Yes |

**Sample data**:
```json
{
  "id": "adaptability",
  "name": "Adaptability",
  "description": "When this Pokemon uses a move of its own type, it may roll the damage twice and choose either total."
}
```

### TooltipState (client-side only)

Represents the currently active tooltip state.

| Field | Type | Description |
|-------|------|-------------|
| active | boolean | Whether a tooltip is visible |
| type | "move" \| "ability" \| null | Type of content being shown |
| id | string \| null | ID of the move or ability |
| position | object | Calculated position {top, left} |
| data | object \| null | Cached move/ability data |

## Relationships

```
Pokemon (existing)
    └─── abilities[] ─── references ─── Ability.id
    └─── moves.start[] ─── references ─── Move.id
    └─── moves.level*[] ─── references ─── Move.id
    └─── moves.tm[] ─── references ─── TM number (not Move.id)
```

**Note**: TM moves are stored as TM numbers, not move IDs. TM-to-move mapping would require additional data not currently in Source folder. TM tooltips will show TM number only.

## Validation Rules

1. **Move ID validation**: Move IDs must match `^[a-z0-9-]+$` pattern
2. **Ability ID validation**: Ability IDs must match `^[a-z0-9-]+$` pattern
3. **Missing data handling**: If move/ability not found, display "Details unavailable"

## State Transitions

```
TooltipState Lifecycle:
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   [idle] ──hover/focus──> [loading] ──data──> [visible]  │
│     ▲                                            │       │
│     └──────────mouseleave/blur/scroll────────────┘       │
│                                                          │
│   [visible] ──new hover──> [loading] (replaces)          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## No Database Changes

This feature uses existing Source folder data only. No Supabase schema changes required.
