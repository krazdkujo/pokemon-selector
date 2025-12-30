# Implementation Plan: Starter Pokemon Selection

**Branch**: `004-starter-selection` | **Date**: 2025-12-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-starter-selection/spec.md`

## Summary

Implement a starter Pokemon selection system where players can filter by 1-2 Pokemon types, view all eligible starters (SR <= 0.5), select one as their starter, and have it persisted to their account. The system tracks up to 6 active Pokemon with unlimited storage, displayed on the dashboard.

## Technical Context

**Language/Version**: JavaScript (ES6+), Node.js 18+
**Primary Dependencies**: Next.js 14, React 18, @supabase/supabase-js ^2.89.0
**Storage**: Supabase PostgreSQL (new `player_pokemon` table)
**Testing**: Manual testing (no test framework configured)
**Target Platform**: Web browser, Vercel deployment
**Project Type**: Web application (Next.js pages router)
**Performance Goals**: Filter/display within 2 seconds, full selection flow under 1 minute
**Constraints**: Must use existing Source folder data, enforce 6 active Pokemon limit at API level
**Scale/Scope**: 229 eligible starter Pokemon (SR <= 0.5), 18 Pokemon types

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Source Data Authority | PASS | Pokemon data from Source folder, filtered by `sr` field |
| II. Microservices Architecture | PASS | New endpoints in `/pages/api/` for starters and roster |
| III. Security First | PASS | Use Supabase RLS, validate inputs, server-side ownership checks |
| IV. Modularity and Separation | PASS | Components for UI, API for logic, lib for data loading |
| V. Naming Conventions | PASS | API: kebab-case, Components: PascalCase, Utilities: camelCase |
| Technology Stack | PASS | Using mandated Next.js, Supabase Auth, Supabase PostgreSQL |

**Gate Result**: PASS - All principles satisfied. Proceed with Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/004-starter-selection/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── starters.yaml    # Starter filtering API
│   ├── roster.yaml      # Roster management API
│   └── storage.yaml     # Storage management API
└── tasks.md             # Phase 2 output (separate command)
```

### Source Code (repository root)

```text
pages/
├── api/
│   ├── starters.js          # GET filtered starters, POST select starter
│   ├── roster.js            # GET/PUT active roster
│   └── storage.js           # GET storage, POST swap Pokemon
├── select-starter.js        # Starter selection page
└── dashboard.js             # Dashboard with roster display (existing, to modify)

components/
├── TypeFilterBar.jsx        # Type selection buttons
├── StarterGrid.jsx          # Pokemon card grid
├── StarterCard.jsx          # Individual Pokemon card
├── StarterDetailModal.jsx   # Full Pokemon details with select button
├── ActiveRoster.jsx         # 6-slot roster display
├── RosterSlot.jsx           # Individual roster slot
└── StorageView.jsx          # Storage list with swap buttons

lib/
├── pokemonData.js           # Existing data loaders (add getStarterPokemon)
└── supabase.js              # Existing Supabase client

styles/
└── globals.css              # Existing styles (add new component styles)
```

**Structure Decision**: Extends existing Next.js pages router structure. New API routes follow existing pattern. New components follow existing naming conventions.

## Complexity Tracking

> No constitution violations requiring justification.
