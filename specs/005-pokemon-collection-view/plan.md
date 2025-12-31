# Implementation Plan: Pokemon Collection View

**Branch**: `005-pokemon-collection-view` | **Date**: 2025-12-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-pokemon-collection-view/spec.md`

## Summary

Replace the starter selection screen with a Pokemon collection view for users who have already selected a starter. The collection view displays all 1,142 Pokemon in a grid layout ordered by Pokedex number, with filters for type (18 types) and SR (rarity values 0.125-15). Clicking a Pokemon opens a detail modal showing all Pokemon information. The implementation reuses existing patterns from the starter selection feature (TypeFilterBar, StarterDetailModal, StarterCard).

## Technical Context

**Language/Version**: JavaScript (ES6+), Node.js 18.x+
**Primary Dependencies**: Next.js 14.2.0, React 18.2.0, @supabase/supabase-js 2.89.0
**Storage**: Supabase PostgreSQL (player_pokemon table), Local JSON files (Source/ folder - read-only)
**Testing**: Manual testing via dev server
**Target Platform**: Web (desktop and mobile responsive)
**Project Type**: Web application (Next.js pages router)
**Performance Goals**: Page load <3s, filter response <500ms, modal open <300ms
**Constraints**: Must work with 1,142 Pokemon dataset, responsive design for mobile/tablet/desktop
**Scale/Scope**: Single user session, full Pokemon dataset display

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status |
|-----------|-------------|--------|
| I. Source Data Authority | All Pokemon data from Source/ folder via lib/pokemonData.js | PASS |
| II. Microservices Architecture | API routes in /pages/api/, stateless, JSON responses | PASS |
| III. Security First | No credentials exposed, RLS policies exist, session validation | PASS |
| IV. Modularity and Separation | Components in /components/, pages delegate to components | PASS |
| V. Naming Conventions | PascalCase components, kebab-case APIs, camelCase utilities | PASS |

**Pre-Design Assessment**: All constitution gates pass. Feature uses existing patterns.

## Project Structure

### Documentation (this feature)

```text
specs/005-pokemon-collection-view/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
pages/
├── api/
│   ├── collection.js        # NEW: GET all Pokemon with filters
│   └── starters.js          # MODIFY: Add redirect logic check
├── index.js                 # EXISTING: Auth redirect hub
├── select-starter.js        # MODIFY: Redirect if hasStarter
├── collection.js            # NEW: Pokemon collection page
└── dashboard.js             # EXISTING: Main dashboard

components/
├── PokemonCollectionGrid.jsx    # NEW: Grid display with ordering
├── PokemonCollectionCard.jsx    # NEW: Individual card (reuse StarterCard pattern)
├── PokemonDetailModal.jsx       # NEW: Detail modal (extend StarterDetailModal)
├── CollectionFilterBar.jsx      # NEW: Combined type + SR filter
├── SRFilterDropdown.jsx         # NEW: SR value selector
├── TypeFilterBar.jsx            # EXISTING: Reusable type filter
├── StarterCard.jsx              # EXISTING: Reference for card pattern
├── StarterDetailModal.jsx       # EXISTING: Reference for modal pattern
└── ProtectedRoute.jsx           # EXISTING: Auth guard

lib/
├── pokemonData.js           # EXISTING: Add getSRValues() helper
├── supabase.js              # EXISTING: No changes
└── authContext.js           # EXISTING: No changes

styles/
└── globals.css              # MODIFY: Add collection view styles
```

**Structure Decision**: Uses existing Next.js pages router structure. New components follow existing naming (PascalCase) and patterns from 004-starter-selection feature.

## Complexity Tracking

> No constitution violations. Feature follows all established patterns.

| Aspect | Approach | Rationale |
|--------|----------|-----------|
| Data Loading | Client-side via API | Consistent with existing patterns, enables filtering |
| Filtering | Client-side filter state | Small dataset (1,142), immediate response |
| Modal | Separate component | Reuses StarterDetailModal pattern |
