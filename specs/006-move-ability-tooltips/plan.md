# Implementation Plan: Move and Ability Hover Tooltips

**Branch**: `006-move-ability-tooltips` | **Date**: 2025-12-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-move-ability-tooltips/spec.md`

## Summary

Add interactive tooltips to all move and ability names in the Pokemon detail modal. When users hover over (or focus/tap) a move name, they see complete move data including type, power, timing, PP, range, description, and higher level effects. For abilities, tooltips show the ability name, hidden status, and full description. Data is fetched from existing Source folder JSON files via a new API endpoint.

## Technical Context

**Language/Version**: JavaScript (ES6+), Node.js 18+
**Primary Dependencies**: Next.js 14.x, React 18.x, @supabase/supabase-js ^2.89.0
**Storage**: Local JSON files in `Source/` folder (read-only)
**Testing**: Manual testing via dev server
**Target Platform**: Web (desktop and mobile browsers)
**Project Type**: Web application (Next.js)
**Performance Goals**: Tooltips appear within 200ms of hover
**Constraints**: Must work within modal scroll context, single tooltip at a time
**Scale/Scope**: ~800 moves, ~300 abilities in Source data

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status |
|-----------|-------------|--------|
| I. Source Data Authority | Data from Source/ folder via lib functions | PASS |
| II. Microservices Architecture | New API endpoint in /pages/api/ | PASS |
| III. Security First | No sensitive data exposed, client-safe endpoint | PASS |
| IV. Modularity and Separation | New tooltip component, API route, lib utilities | PASS |
| V. Naming Conventions | Tooltip.jsx (component), tooltip-data.js (API) | PASS |

**All gates pass. Proceeding to Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/006-move-ability-tooltips/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
components/
├── PokemonDetailModal.jsx    # Update: wrap moves/abilities with tooltip triggers
├── Tooltip.jsx               # NEW: reusable tooltip component
├── MoveTooltipContent.jsx    # NEW: move-specific tooltip content
└── AbilityTooltipContent.jsx # NEW: ability-specific tooltip content

lib/
└── pokemonData.js            # Update: add getMoveById, getAbilityById helpers

pages/api/
└── tooltip-data.js           # NEW: API endpoint for move/ability data lookup

styles/
└── globals.css               # Update: add tooltip styles
```

**Structure Decision**: Follows existing Next.js pages router structure with components in /components/, utilities in /lib/, API routes in /pages/api/. New tooltip component is reusable for future tooltip needs.

## Complexity Tracking

> No violations identified. Design follows constitution principles.
