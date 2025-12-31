-- ============================================================================
-- File: 001-player-pokemon-table.sql
-- Feature: 004-starter-selection
-- Date: 2025-12-30
-- ============================================================================
--
-- DESCRIPTION:
-- Creates the player_pokemon table for tracking Pokemon owned by players.
-- Supports both active roster (6 slots) and unlimited storage.
--
-- WHAT THIS CREATES:
-- - player_pokemon table with user ownership, slot management, and levels
-- - Indexes for fast user and roster queries
-- - Row Level Security (RLS) policies so users can only access their own Pokemon
--
-- PREREQUISITES:
-- - Supabase project with auth.users table (built-in)
-- - Run this in Supabase SQL Editor
--
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create player_pokemon table
CREATE TABLE player_pokemon (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pokemon_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  slot_number INTEGER CHECK (slot_number >= 1 AND slot_number <= 6),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 20),
  nickname TEXT,
  acquired_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  -- Ensure unique slot per user (only for non-null slots)
  CONSTRAINT unique_user_slot UNIQUE (user_id, slot_number)
);

-- Create indexes for performance
CREATE INDEX idx_player_pokemon_user_active ON player_pokemon(user_id, is_active);
CREATE INDEX idx_player_pokemon_user_id ON player_pokemon(user_id);

-- Enable Row Level Security
ALTER TABLE player_pokemon ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own Pokemon
CREATE POLICY "Users can view own pokemon"
  ON player_pokemon FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pokemon"
  ON player_pokemon FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pokemon"
  ON player_pokemon FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pokemon"
  ON player_pokemon FOR DELETE
  USING (auth.uid() = user_id);
