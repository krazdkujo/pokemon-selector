# Quickstart: Pokemon Selector and Generation System

**Feature**: 003-pokemon-generator
**Date**: 2025-12-30

## Prerequisites

- Node.js 18+
- npm
- Existing project setup from Spec 1
- Working authentication from Spec 2
- Source folder with Pokemon data

## Quick Setup

```bash
# 1. Ensure you're on the feature branch
git checkout 003-pokemon-generator

# 2. Install dependencies (if needed)
npm install

# 3. Verify Source data exists
ls Source/pokemon/pokemon.json
ls Source/moves/moves.json
ls Source/abilities/abilities.json
ls Source/natures/natures.json
ls Source/evolution/evolution.json

# 4. Start development server
npm run dev
```

## Implementation Order

### Step 1: Extend Data Loading Utilities

File: `lib/pokemonData.js`

Add these functions:
- `getAllNatures()` - Load natures.json
- `getNatureById(id)` - Get specific nature
- `getAllEvolutions()` - Load evolution.json
- `getEvolutionsByPokemon(pokemonId)` - Get evolution paths for a Pokemon
- `getMoveById(id)` - Get specific move details

### Step 2: Create Generation API

File: `pages/api/generate-pokemon.js`

Implement:
1. Parse request body (pokemonId, level, random)
2. Select Pokemon (random or by ID)
3. Select 4 moves from level-appropriate pool
4. Select ability (90% normal, 10% hidden)
5. Select random nature
6. Apply nature stat modifiers
7. Lookup evolution info
8. Return GeneratedPokemon object

### Step 3: Create Pokemon Selector Component

File: `components/PokemonSelector.jsx`

Structure:
```jsx
<PokemonSelector>
  <GenerateButton />
  <SearchInput />  // For specific Pokemon (P3)
  <LoadingSpinner />
  <PokemonDisplay>
    <PokemonHeader />  // Name, number, sprite, types
    <StatsDisplay />   // Base + modified stats
    <MovesDisplay />   // 4 moves with details
    <AbilityDisplay /> // Name, description, hidden badge
    <NatureDisplay />  // Name, effect
    <EvolutionDisplay /> // Evolution path
  </PokemonDisplay>
</PokemonDisplay>
```

### Step 4: Integrate into Dashboard

File: `pages/dashboard.js`

Replace placeholder content with PokemonSelector component.

### Step 5: Add Styles

File: `styles/globals.css`

Add styles for:
- Pokemon card layout
- Type badges (color-coded)
- Stats bars
- Move list
- Responsive design

## API Testing

### Test Random Generation

```bash
curl -X POST http://localhost:3000/api/generate-pokemon \
  -H "Content-Type: application/json" \
  -d '{"random": true}'
```

### Test Specific Pokemon

```bash
curl -X POST http://localhost:3000/api/generate-pokemon \
  -H "Content-Type: application/json" \
  -d '{"pokemonId": "pikachu", "level": 10}'
```

### Expected Response Structure

```json
{
  "success": true,
  "pokemon": {
    "id": "pikachu",
    "name": "Pikachu",
    "number": 25,
    "types": ["electric"],
    "spriteUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    "level": 10,
    "baseStats": { "str": 10, "dex": 17, ... },
    "modifiedStats": { "str": 11, "dex": 17, ... },
    "nature": { "id": "adamant", "name": "Adamant", "effect": "+1 STR, -1 CHA" },
    "ability": { "id": "static", "name": "Static", "description": "...", "isHidden": false },
    "moves": [...],
    "evolution": { "evolvesTo": "raichu", "condition": "Level 14" }
  }
}
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/pokemonData.js` | Data loading utilities |
| `pages/api/generate-pokemon.js` | Generation microservice |
| `components/PokemonSelector.jsx` | Main UI component |
| `pages/dashboard.js` | Integration point |
| `styles/globals.css` | Component styles |

## Sprite URL Pattern

```
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{number}.png
```

Example: Bulbasaur (#1) = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png`

## Common Issues

### "Pokemon data unavailable"
- Check Source folder exists and contains valid JSON
- Verify file permissions

### "Pokemon not found"
- Use lowercase kebab-case IDs (e.g., "mr-mime" not "Mr. Mime")
- Check pokemon.json for valid IDs

### No moves displayed
- Verify moves.json contains move IDs referenced in Pokemon data
- Check level parameter matches available move tiers

## Next Steps

After implementation:
1. Run `/speckit.tasks` to generate task breakdown
2. Test all acceptance scenarios from spec.md
3. Verify on deployed Vercel environment
