# Implementation Plan: Pokemon Move Selection and HP Setup

**Branch**: `007-pokemon-move-hp-setup` | **Date**: 2025-12-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-pokemon-move-hp-setup/spec.md`

## Summary

Implement a move selection and HP calculation flow that activates when any Pokemon is added to a player's collection. Players select 1-4 moves from level-appropriate pools and choose between "Average" or "Roll" HP calculation methods. This extends the existing `player_pokemon` table with new columns for moves, HP, and calculation metadata.

## Technical Context

**Language/Version**: JavaScript (ES6+), Node.js 18+
**Primary Dependencies**: Next.js 14.x, React 18.x, @supabase/supabase-js ^2.89.0
**Storage**: Supabase PostgreSQL (extend existing `player_pokemon` table)
**Testing**: Manual testing via development server
**Target Platform**: Web (Vercel deployment)
**Project Type**: Web application (Next.js pages router)
**Performance Goals**: Move selection modal loads in <500ms, HP calculation instant
**Constraints**: Must integrate with existing starter selection flow without breaking changes
**Scale/Scope**: Single-player game, extends existing Pokemon collection system

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Source Data Authority | PASS | Move data loaded from Source/moves/moves.json via lib/pokemonData.js |
| II. Microservices Architecture | PASS | New/modified API endpoint in pages/api/ |
| III. Security First | PASS | Uses existing auth pattern, RLS on player_pokemon |
| IV. Modularity and Separation | PASS | New component in /components/, API logic in /pages/api/ |
| V. Naming Conventions | PASS | Component: PokemonSetupModal.jsx, API: starters.js (modify existing) |

**Gate Status**: PASSED - No violations

## Project Structure

### Documentation (this feature)

```text
specs/007-pokemon-move-hp-setup/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
components/
├── PokemonSetupModal.jsx    # NEW: Combined move selection + HP setup modal
├── MoveSelectionPanel.jsx   # NEW: Move selection UI with tooltips
├── HPCalculationPanel.jsx   # NEW: HP method selection and display
├── StarterDetailModal.jsx   # MODIFY: Trigger setup modal after selection
└── MoveTooltipContent.jsx   # EXISTING: Reuse for move details

lib/
├── pokemonData.js           # MODIFY: Add getAvailableMoves(), calculateHP() helpers
└── supabase.js              # EXISTING: No changes needed

pages/api/
├── starters.js              # MODIFY: Accept moves/HP in POST, persist to DB
├── pokemon-setup.js         # NEW: Dedicated endpoint for move/HP setup (future use)
└── calculate-hp.js          # NEW: Server-side HP rolling endpoint

styles/
└── globals.css              # MODIFY: Add modal and panel styles
```

**Structure Decision**: Extends existing web application structure. New components follow established patterns. API modifications maintain backwards compatibility.

## Complexity Tracking

> No violations - table not required
