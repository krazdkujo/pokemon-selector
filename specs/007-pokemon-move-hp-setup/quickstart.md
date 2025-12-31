# Quickstart: Pokemon Move Selection and HP Setup

**Feature Branch**: `007-pokemon-move-hp-setup`
**Date**: 2025-12-31

## Prerequisites

- Node.js 18+ installed
- Supabase project with existing `player_pokemon` table (from feature 004)
- Environment variables configured in `.env.local`

## Database Migration

Run this SQL in Supabase Dashboard > SQL Editor:

```sql
-- Add new columns for move selection and HP
ALTER TABLE player_pokemon
  ADD COLUMN IF NOT EXISTS selected_moves TEXT[] DEFAULT ARRAY['tackle']::TEXT[],
  ADD COLUMN IF NOT EXISTS current_hp INTEGER DEFAULT 10,
  ADD COLUMN IF NOT EXISTS max_hp INTEGER DEFAULT 10,
  ADD COLUMN IF NOT EXISTS hp_method TEXT DEFAULT 'average',
  ADD COLUMN IF NOT EXISTS hp_rolls INTEGER[];

-- Update any existing records with defaults
UPDATE player_pokemon
SET
  selected_moves = ARRAY['tackle']::TEXT[],
  current_hp = 10,
  max_hp = 10,
  hp_method = 'average'
WHERE selected_moves IS NULL OR array_length(selected_moves, 1) IS NULL;

-- Set NOT NULL constraints
ALTER TABLE player_pokemon
  ALTER COLUMN selected_moves SET NOT NULL,
  ALTER COLUMN current_hp SET NOT NULL,
  ALTER COLUMN max_hp SET NOT NULL,
  ALTER COLUMN hp_method SET NOT NULL;

-- Add check constraints
ALTER TABLE player_pokemon
  ADD CONSTRAINT IF NOT EXISTS check_moves_count
    CHECK (array_length(selected_moves, 1) >= 1 AND array_length(selected_moves, 1) <= 4),
  ADD CONSTRAINT IF NOT EXISTS check_hp_positive
    CHECK (current_hp >= 1 AND max_hp >= 1),
  ADD CONSTRAINT IF NOT EXISTS check_current_hp_max
    CHECK (current_hp <= max_hp),
  ADD CONSTRAINT IF NOT EXISTS check_hp_method
    CHECK (hp_method IN ('average', 'roll'));

-- Add column comments
COMMENT ON COLUMN player_pokemon.selected_moves IS 'Array of move IDs (1-4 moves)';
COMMENT ON COLUMN player_pokemon.current_hp IS 'Current HP, may be reduced by damage';
COMMENT ON COLUMN player_pokemon.max_hp IS 'Maximum HP calculated at acquisition';
COMMENT ON COLUMN player_pokemon.hp_method IS 'average or roll - how HP was calculated';
COMMENT ON COLUMN player_pokemon.hp_rolls IS 'Roll history for roll method, null for average';
```

## Verification

After running the migration:

1. In Supabase Dashboard > Table Editor, verify `player_pokemon` has new columns
2. Check column types: selected_moves (text[]), current_hp (int4), max_hp (int4), hp_method (text), hp_rolls (int4[])
3. Any existing Pokemon should have defaults applied

## Development Setup

```bash
# Start development server
npm run dev

# Access at http://localhost:3000
```

## Testing the Feature

1. Log in to the application
2. If you have no starter, navigate to starter selection
3. Select a Pokemon type filter
4. Click on a Pokemon to open the detail modal
5. Click "Choose as Starter" - this should open the new setup modal
6. In the setup modal:
   - Select 1-4 moves from the available list
   - Choose HP calculation method (Average or Roll)
   - If Roll, verify the dice results are displayed
   - Click "Confirm" to save
7. Verify the Pokemon appears in your collection with:
   - The moves you selected
   - HP calculated according to your chosen method

## Rollback

If needed, remove the new columns:

```sql
ALTER TABLE player_pokemon
  DROP CONSTRAINT IF EXISTS check_moves_count,
  DROP CONSTRAINT IF EXISTS check_hp_positive,
  DROP CONSTRAINT IF EXISTS check_current_hp_max,
  DROP CONSTRAINT IF EXISTS check_hp_method;

ALTER TABLE player_pokemon
  DROP COLUMN IF EXISTS selected_moves,
  DROP COLUMN IF EXISTS current_hp,
  DROP COLUMN IF EXISTS max_hp,
  DROP COLUMN IF EXISTS hp_method,
  DROP COLUMN IF EXISTS hp_rolls;
```

## Key Files Modified

| File | Changes |
|------|---------|
| `components/PokemonSetupModal.jsx` | New - main setup modal |
| `components/MoveSelectionPanel.jsx` | New - move selection UI |
| `components/HPCalculationPanel.jsx` | New - HP method selection |
| `components/StarterDetailModal.jsx` | Modified - triggers setup modal |
| `lib/pokemonData.js` | Modified - adds move/HP helper functions |
| `pages/api/starters.js` | Modified - accepts moves/HP data |
| `pages/api/calculate-hp.js` | New - HP calculation endpoint |
| `pages/api/pokemon-moves.js` | New - available moves endpoint |
| `styles/globals.css` | Modified - setup modal styles |

## Troubleshooting

**"constraint check_moves_count violated"**
- Ensure at least 1 move is selected before saving

**"Move not available for level"**
- The selected move is not in the Pokemon's move pool for their current level
- For starters, only "start" moves should be available

**"HP method must be 'average' or 'roll'"**
- Ensure hpMethod is exactly "average" or "roll" (case-sensitive)

**Existing Pokemon show default moves**
- This is expected for Pokemon created before this feature
- Migration sets "tackle" as default to satisfy the constraint
