# Research: Move and Ability Hover Tooltips

**Feature**: 006-move-ability-tooltips
**Date**: 2025-12-31

## Research Areas

### 1. Tooltip Implementation Pattern

**Decision**: Build custom tooltip component using React state and CSS positioning

**Rationale**:
- Project uses no external UI libraries - keep dependencies minimal
- Custom component allows full control over styling to match existing design
- Simpler than adding a tooltip library for this single use case
- Can position tooltips dynamically based on viewport bounds

**Alternatives Considered**:
| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| React-tooltip library | Ready-made, accessible | New dependency, styling overhead | Adds complexity for single feature |
| Floating-ui/Popper | Excellent positioning | Heavy dependency | Overkill for modal-contained tooltips |
| CSS-only tooltips | Zero JS | No dynamic positioning, limited content | Can't handle viewport overflow |
| Custom component | Full control, no deps | More code | **Selected** |

### 2. Data Fetching Strategy

**Decision**: Server-side lookup via API endpoint, client caches response

**Rationale**:
- Source data (moves.json, abilities.json) is server-side only per constitution
- Single API call returns full move/ability data for caching
- Avoid loading 800+ moves on initial page load
- API can batch-lookup multiple items if needed

**Alternatives Considered**:
| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| Inline all data in page props | Fast tooltips | Large page payload | Against constitution (Source data authority) |
| Fetch on hover | Minimal data transfer | Noticeable delay | Poor UX, 200ms requirement |
| Preload all moves/abilities | Instant tooltips | ~500KB payload | Too large for modal feature |
| API with client cache | Balance of speed/size | Cache management | **Selected** |

### 3. Tooltip Positioning Strategy

**Decision**: CSS fixed positioning with JavaScript boundary detection

**Rationale**:
- Fixed positioning works within scrollable modal container
- Calculate position relative to trigger element's bounding rect
- Flip tooltip direction if it would overflow viewport
- Dismiss on scroll to avoid stale positioning

**Implementation Approach**:
1. On hover/focus, get trigger element's bounding rect
2. Calculate default position (below trigger, centered)
3. Check if tooltip would overflow viewport edges
4. Adjust position (flip to top, shift left/right) as needed
5. Apply position via inline styles

### 4. Accessibility Pattern

**Decision**: Use ARIA tooltip pattern with focus support

**Rationale**:
- `aria-describedby` links trigger to tooltip content
- `role="tooltip"` identifies the popup
- Focus triggers (via tabindex) enable keyboard access
- Touch events handled via tap-to-show/tap-outside-to-hide

**Key Implementation Details**:
- Trigger elements get `tabindex="0"` for focusability
- Tooltip has `role="tooltip"` and unique ID
- Show on mouseenter, focus; hide on mouseleave, blur
- Touch: show on tap, hide on tap outside

### 5. Single Tooltip Management

**Decision**: React context or parent state manages active tooltip

**Rationale**:
- Only one tooltip visible at a time per FR-010
- Parent component (PokemonDetailModal) owns tooltip state
- Tooltip ID stored in state, passed down to trigger components
- New hover/focus replaces active tooltip immediately

## Data Source Analysis

### Move Data Structure (from Source/moves/moves.json)

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
  "description": "You attempt to absorb...",
  "higherLevels": "The damage dice roll..."
}
```

**Fields to display**: name, type (with badge), power, time, pp, duration, range, description, higherLevels

### Ability Data Structure (from Source/abilities/abilities.json)

```json
{
  "id": "adaptability",
  "name": "Adaptability",
  "description": "When this Pokemon uses a move of its own type..."
}
```

**Fields to display**: name, description (hidden status comes from Pokemon data, not ability data)

## Existing Helper Functions

From `lib/pokemonData.js`:
- `getMoveById(id)` - Already exists, returns move by ID
- `getAbilityById(id)` - Already exists, returns ability by ID

No new lib functions needed for data lookup.

## Performance Considerations

1. **Tooltip render frequency**: Tooltips are lightweight; no concern
2. **API caching**: Cache move/ability lookups in component state or React context
3. **Event handling**: Use event delegation on parent for many triggers
4. **CSS transitions**: Keep animations simple (fade in/out) for performance

## Conclusions

All research questions resolved. Ready for Phase 1 design artifacts.

- **Tooltip approach**: Custom React component with CSS positioning
- **Data strategy**: API endpoint with client-side caching
- **Positioning**: Fixed with viewport boundary detection
- **Accessibility**: ARIA tooltip pattern with focus/touch support
- **State management**: Parent component manages single active tooltip
