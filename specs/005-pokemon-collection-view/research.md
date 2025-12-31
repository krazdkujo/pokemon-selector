# Research: Pokemon Collection View

**Feature**: 005-pokemon-collection-view
**Date**: 2025-12-31

## Research Tasks Completed

### 1. Pokemon Data Structure Analysis

**Decision**: Use existing `getAllPokemon()` from lib/pokemonData.js

**Findings**:
- Total Pokemon: 1,142 entries in Source/pokemon/pokemon.json
- Each Pokemon has: id, name, number, type[], sr, attributes, abilities, moves, media, etc.
- Data is static and read from file system

**Rationale**: Existing data loader already provides all needed functionality. No new data access patterns required.

### 2. SR (Rarity) Values Analysis

**Decision**: SR is a numeric field with 18 unique values

**Findings**:
- SR values found in dataset: 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
- Starters are defined as sr <= 0.5
- Higher SR values indicate rarer Pokemon

**Rationale**: Filter UI should show these as dropdown options, grouped logically (fractional values separate from integers).

**Alternatives Considered**:
- Range slider: Rejected because discrete values work better for exact filtering
- Checkboxes: Rejected because 18 options would clutter the UI

### 3. Existing Component Patterns

**Decision**: Reuse patterns from 004-starter-selection feature

**Findings**:
- TypeFilterBar.jsx: Handles type selection (max 2 types), reusable as-is
- StarterCard.jsx: Card display pattern with sprite, name, types, stats
- StarterDetailModal.jsx: Modal with tabs for moves, abilities, full stats
- StarterGrid.jsx: Grid layout with filter application

**Rationale**: Consistent UX and reduced development effort by extending proven patterns.

### 4. Redirect Logic for Starter Screen

**Decision**: Modify select-starter.js to redirect users with starters to /collection

**Findings**:
- Current flow: GET /api/starters returns `hasStarter` boolean
- If hasStarter is true, user should not see starter selection
- Redirect should happen on page load before rendering

**Implementation Approach**:
```javascript
// In select-starter.js useEffect
if (data.hasStarter) {
  router.push('/collection');
  return;
}
```

### 5. Filter Combination Logic

**Decision**: Use AND logic for combining type and SR filters

**Findings**:
- Type filter: Pokemon must have at least one selected type (OR within types)
- SR filter: Pokemon must match selected SR value (exact match)
- Combined: Pokemon must match type filter AND SR filter

**Rationale**: Matches user mental model - "show me Fire Pokemon with SR 5"

### 6. Performance Considerations

**Decision**: Client-side filtering is acceptable for 1,142 Pokemon

**Findings**:
- Dataset size: ~2MB JSON when loaded
- Filter operations: O(n) array filter, negligible for 1,142 items
- Modern browsers handle this without perceptible delay

**Alternatives Considered**:
- Server-side filtering: Rejected as unnecessary complexity for small dataset
- Pagination: Not required for performance, but could add for UX if grid is overwhelming

### 7. Modal Data Requirements

**Decision**: Modal shows all Pokemon data available in Source files

**Findings**:
Pokemon detail modal should display:
- Header: Name, number, sprite image
- Basic info: Types, SR, size, level range
- Stats: HP, AC, attributes (STR, DEX, CON, INT, WIS, CHA)
- Abilities: Regular and hidden abilities with descriptions
- Moves: Organized by learning method (start, level, TM, egg)
- Evolution: Evolution chain information
- Description: Flavor text

**Rationale**: Reuse StarterDetailModal structure which already shows most of this data.

## Summary

All technical unknowns have been resolved:
- SR field confirmed as numeric rarity value (0.125-15)
- Existing components can be reused with minimal modification
- Client-side filtering is appropriate for dataset size
- Redirect logic is straightforward using existing hasStarter check
- No new dependencies or architectural changes required

The feature fits cleanly within the existing codebase patterns established by 004-starter-selection.
