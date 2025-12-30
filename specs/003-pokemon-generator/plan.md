# Implementation Plan: Pokemon Selector and Generation System

**Branch**: `003-pokemon-generator` | **Date**: 2025-12-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-pokemon-generator/spec.md`

## Summary

Build a Pokemon generation system that reads from the Source folder JSON files to generate random or specific Pokemon with assigned moves, abilities, and natures. The system consists of an API microservice (`/api/generate-pokemon`) and a React component (`PokemonSelector`) integrated into the dashboard.

## Technical Context

**Language/Version**: JavaScript (ES6+), Node.js 18+
**Primary Dependencies**: Next.js 14.x, React 18.x, @supabase/supabase-js ^2.89.0
**Storage**: Local JSON files in `Source/` folder (read-only), Supabase PostgreSQL (future user collection storage)
**Testing**: Manual testing via dev server, API endpoint testing
**Target Platform**: Vercel serverless deployment, Web browsers
**Project Type**: Web application (Next.js pages router)
**Performance Goals**: Pokemon generation under 2 seconds
**Constraints**: Must read all data from Source folder, no hardcoded Pokemon data
**Scale/Scope**: 1142 Pokemon, 800 moves, 328 abilities, 25 natures, 534 evolution paths

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Source Data Authority | PASS | All Pokemon data read from `Source/` folder via `lib/pokemonData.js` |
| II. Microservices Architecture | PASS | Single API route `/api/generate-pokemon.js` with focused responsibility |
| III. Security First | PASS | Route protected by auth, no service keys exposed to frontend |
| IV. Modularity and Separation | PASS | Component in `/components/`, API in `/pages/api/`, utilities in `/lib/` |
| V. Naming Conventions | PASS | Using existing conventions: `generate-pokemon.js`, `PokemonSelector.jsx` |

**Gate Result**: PASS - All principles satisfied. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/003-pokemon-generator/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
pages/
├── api/
│   ├── health.js           # Existing
│   └── generate-pokemon.js # NEW: Pokemon generation microservice
├── dashboard.js            # MODIFY: Integrate PokemonSelector component
├── login.js                # Existing
├── index.js                # Existing
└── _app.js                 # Existing

components/
├── ProtectedRoute.jsx      # Existing
├── LoginForm.jsx           # Existing
├── SignupForm.jsx          # Existing
├── AuthTabs.jsx            # Existing
├── LoadingSpinner.jsx      # Existing
└── PokemonSelector.jsx     # NEW: Main Pokemon generation UI

lib/
├── supabase.js             # Existing
├── authContext.js          # Existing
└── pokemonData.js          # MODIFY: Add natures, evolution, move details loaders

styles/
└── globals.css             # MODIFY: Add Pokemon display styles
```

**Structure Decision**: Using existing Next.js pages router structure. New files follow established patterns with kebab-case for API routes and PascalCase for React components.

## Complexity Tracking

> No constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
