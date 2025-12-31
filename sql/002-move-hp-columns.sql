-- ============================================================================
-- File: 002-move-hp-columns.sql
-- Feature: 007-pokemon-move-hp-setup
-- Date: 2025-12-31
-- ============================================================================
--
-- DESCRIPTION:
-- Adds columns for move selection and HP tracking to player_pokemon table.
-- Supports 1-4 selected moves per Pokemon and HP calculation via average or roll.
--
-- WHAT THIS CREATES:
-- - selected_moves: Array of move IDs (1-4 moves)
-- - current_hp: Current HP, may be reduced by damage
-- - max_hp: Maximum HP calculated at acquisition
-- - hp_method: 'average' or 'roll' - how HP was calculated
-- - hp_rolls: Roll history for roll method, null for average
--
-- PREREQUISITES:
-- - 001-player-pokemon-table.sql must be run first
-- - Run this in Supabase SQL Editor
--
-- ============================================================================

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
  ADD CONSTRAINT check_moves_count
    CHECK (array_length(selected_moves, 1) >= 1 AND array_length(selected_moves, 1) <= 4),
  ADD CONSTRAINT check_hp_positive
    CHECK (current_hp >= 1 AND max_hp >= 1),
  ADD CONSTRAINT check_current_hp_max
    CHECK (current_hp <= max_hp),
  ADD CONSTRAINT check_hp_method
    CHECK (hp_method IN ('average', 'roll'));

-- Add column comments
COMMENT ON COLUMN player_pokemon.selected_moves IS 'Array of move IDs (1-4 moves)';
COMMENT ON COLUMN player_pokemon.current_hp IS 'Current HP, may be reduced by damage';
COMMENT ON COLUMN player_pokemon.max_hp IS 'Maximum HP calculated at acquisition';
COMMENT ON COLUMN player_pokemon.hp_method IS 'average or roll - how HP was calculated';
COMMENT ON COLUMN player_pokemon.hp_rolls IS 'Roll history for roll method, null for average';
