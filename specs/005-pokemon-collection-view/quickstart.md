# Quickstart: Pokemon Collection View

**Feature**: 005-pokemon-collection-view
**Branch**: `005-pokemon-collection-view`

## Prerequisites

- Node.js 18.x+ installed
- Supabase project configured with player_pokemon table
- Feature 004-starter-selection implemented (starter selection flow)

## Development Setup

```bash
# Checkout the feature branch
git checkout 005-pokemon-collection-view

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000 to test.

## Testing the Feature

### Test Case 1: Redirect from Starter Selection

1. Log in as a user who has already selected a starter
2. Navigate directly to /select-starter
3. **Expected**: Redirected to /collection page

### Test Case 2: Collection Grid Display

1. Log in as a user with a starter
2. Navigate to /collection
3. **Expected**: All Pokemon displayed in grid, ordered by Pokedex number

### Test Case 3: Type Filtering

1. On /collection page, select "Fire" type filter
2. **Expected**: Only Fire-type Pokemon displayed
3. Select "Flying" as second type
4. **Expected**: Pokemon with Fire OR Flying type displayed
5. Clear filters
6. **Expected**: All Pokemon displayed again

### Test Case 4: SR Filtering

1. On /collection page, select SR value "5" from dropdown
2. **Expected**: Only Pokemon with SR=5 displayed
3. Clear SR filter
4. **Expected**: All Pokemon displayed

### Test Case 5: Combined Filters

1. Select type "Water"
2. Select SR value "3"
3. **Expected**: Only Water-type Pokemon with SR=3 displayed

### Test Case 6: Pokemon Detail Modal

1. Click any Pokemon card in the grid
2. **Expected**: Modal opens showing:
   - Pokemon name and number
   - Sprite image
   - Types with colored badges
   - SR value
   - Stats (HP, AC, attributes)
   - Abilities list
   - Moves organized by category
3. Click outside modal or close button
4. **Expected**: Modal closes, return to grid

### Test Case 7: Empty Filter Results

1. Select an uncommon type+SR combination (e.g., Dragon + SR 0.125)
2. **Expected**: "No Pokemon found" message displayed

## File Locations

### New Files to Create

| File | Purpose |
|------|---------|
| pages/collection.js | Collection page component |
| pages/api/collection.js | GET endpoint for Pokemon data |
| components/PokemonCollectionGrid.jsx | Grid display component |
| components/PokemonCollectionCard.jsx | Individual card component |
| components/PokemonDetailModal.jsx | Detail modal component |
| components/CollectionFilterBar.jsx | Combined filter bar |
| components/SRFilterDropdown.jsx | SR value selector |

### Files to Modify

| File | Changes |
|------|---------|
| pages/select-starter.js | Add redirect if hasStarter |
| lib/pokemonData.js | Add getSRValues() helper |
| styles/globals.css | Add collection view styles |

## API Endpoints

### GET /api/collection

Returns all Pokemon with filter options.

```javascript
// Response
{
  success: true,
  pokemon: [{ id, name, number, types, sr, spriteUrl }, ...],
  types: ["bug", "dark", ...],
  srValues: [0.125, 0.25, 0.5, 1, ...],
  hasStarter: true
}
```

## Component Hierarchy

```
pages/collection.js
  └── ProtectedRoute
      └── CollectionFilterBar
          ├── TypeFilterBar (reused)
          └── SRFilterDropdown (new)
      └── PokemonCollectionGrid
          └── PokemonCollectionCard (many)
      └── PokemonDetailModal (conditional)
```

## Troubleshooting

### Pokemon not loading
- Check that Source/pokemon/pokemon.json exists
- Verify lib/pokemonData.js getAllPokemon() works

### Redirect not working
- Check /api/starters returns hasStarter correctly
- Verify player_pokemon table has user's starter

### Filters not responding
- Check React state updates in CollectionFilterBar
- Verify filter logic in PokemonCollectionGrid

### Modal not opening
- Check onClick handler on PokemonCollectionCard
- Verify selectedPokemon state management
