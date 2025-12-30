# Research: Initial Project Setup and Structure

**Feature Branch**: `001-nextjs-supabase-setup`
**Date**: 2025-12-30

## Technical Context Decisions

### 1. Next.js Version and Router Architecture

**Decision**: Use Next.js 14.x with Pages Router (not App Router)

**Rationale**:
- Constitution specifies Pages Router architecture with `/pages/` directory structure
- Pages Router is mature, well-documented, and simpler for this project's needs
- API routes in `/pages/api/` are the required pattern per constitution's Microservices Architecture principle

**Alternatives Considered**:
- Next.js App Router: Rejected - Constitution explicitly requires `/pages/api/` serverless function structure
- Older Next.js versions: Rejected - No benefit to using outdated versions

### 2. Supabase Client Configuration

**Decision**: Use `@supabase/supabase-js` v2 with singleton pattern in `lib/supabase.js`

**Rationale**:
- Constitution specifies Supabase client configuration in `lib/supabase.js`
- Singleton pattern ensures single connection instance across the application
- Environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are publicly accessible per constitution
- `SUPABASE_SERVICE_KEY` kept server-side only per Security First principle

**Alternatives Considered**:
- `@supabase/auth-helpers-nextjs`: Deferred - Useful for auth implementation in Spec 2, not needed for initial setup
- Multiple client instances: Rejected - Wastes resources and complicates state management

### 3. Pokemon Data Access Pattern

**Decision**: Create `lib/pokemonData.js` utility with synchronous file reads for server-side, cached data for client-side

**Rationale**:
- Constitution Principle I (Source Data Authority) requires all data reads through `lib/pokemonData.js`
- Source folder contains 11 JSON files organized by entity type (pokemon, moves, abilities, etc.)
- Data is read-only and static - can be loaded at build time or server start
- File structure: Single JSON file per entity type (e.g., `Source/pokemon/pokemon.json` contains all 1142 Pokemon)

**Alternatives Considered**:
- Direct imports in components: Rejected - Violates constitution's centralized access rule
- Database migration: Out of scope - Source folder is the canonical data source per constitution
- API-only access: Partial adoption - API routes can use utility, but build-time data loading is more efficient

### 4. Project Structure

**Decision**: Standard Next.js Pages Router structure per constitution

**Rationale**:
- Constitution Principle IV (Modularity and Separation) defines exact directory responsibilities:
  - `/components/`: Presentational UI only
  - `/pages/`: Route handling and page composition
  - `/pages/api/`: Serverless functions
  - `/lib/`: Shared utilities, Supabase client, data loaders
- This is a web application without separate backend (Vercel serverless handles API)

**Directory Structure**:
```
project-root/
├── Source/                    # Pokemon data (read-only, already exists)
├── pages/
│   ├── api/                   # Serverless functions (microservices)
│   ├── _app.js                # App wrapper
│   └── index.js               # Landing page (redirect to login)
├── components/                # Presentational UI
├── lib/
│   ├── supabase.js           # Supabase client singleton
│   └── pokemonData.js        # Data access utility
├── styles/                    # CSS/styling
├── public/                    # Static assets
├── .env.local                 # Local environment variables
└── .gitignore                 # Excludes sensitive files
```

**Alternatives Considered**:
- Monorepo with separate packages: Rejected - Overengineering for this project's scope
- App Router structure: Rejected - Constitution specifies Pages Router

### 5. Testing Strategy

**Decision**: Defer testing setup (out of scope per spec), but structure supports future testing

**Rationale**:
- Spec explicitly lists "Automated testing setup" as out of scope
- Directory structure will support test addition later
- Focus on successful deployment and data access for this initial setup

**Alternatives Considered**:
- Include Jest setup: Rejected - Out of scope, unnecessary complexity for initial setup

### 6. Styling Approach

**Decision**: Minimal CSS Modules structure, no framework

**Rationale**:
- Spec lists "Styling framework selection" as out of scope beyond basic structure
- CSS Modules is Next.js built-in and requires no additional dependencies
- Can add Tailwind, styled-components, etc. in future features

**Alternatives Considered**:
- Tailwind CSS: Deferred - Could be added later, not essential for project setup
- CSS-in-JS (styled-components, Emotion): Deferred - Not needed for placeholder page

### 7. Environment Variable Handling

**Decision**: Use `.env.local` for local development, Vercel dashboard for production

**Rationale**:
- Next.js built-in support for `.env.local`
- `NEXT_PUBLIC_*` prefix makes variables available to browser (per constitution)
- `.gitignore` must exclude `.env.local` to prevent credential leakage (FR-007)
- Vercel provides secure environment variable management for deployment

**Required Variables**:
```
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SERVICE_KEY=<supabase-service-key>  # Server-side only
```

**Alternatives Considered**:
- Hardcoded configuration: Rejected - Security violation per constitution
- External secrets manager: Overkill - Vercel environment variables are sufficient

## Source Data Structure Analysis

The `Source/` folder contains Pokemon 5e data with the following structure:

| Entity | File | Count | Key Fields |
|--------|------|-------|------------|
| Pokemon | `pokemon/pokemon.json` | 1142 | id, name, number, type, stats, moves, abilities |
| Moves | `moves/moves.json` | 800 | id, name, type, damage, effects |
| Abilities | `abilities/abilities.json` | 328 | id, name, description |
| Items | `items/items.json` | 360 | id, name, description, effects |
| TMs | `tms/tms.json` | 101 | number, move reference |
| Evolution | `evolution/evolution.json` | 534 | pokemon chains, conditions |
| Natures | `natures/natures.json` | 25 | name, stat modifiers |
| Classes | `classes/classes.json` | 31 | name, features |
| Feats | `feats/feats.json` | 27 | name, prerequisites, effects |
| Rules | `rules/rules.json` | 78 | category, rule text |

All files are JSON arrays with consistent `id` field for lookups.

## Constitution Compliance Check

| Principle | Compliance Status |
|-----------|-------------------|
| I. Source Data Authority | COMPLIANT - Data loaded via `lib/pokemonData.js` |
| II. Microservices Architecture | COMPLIANT - API routes in `/pages/api/` |
| III. Security First | COMPLIANT - Env vars properly scoped, `.gitignore` configured |
| IV. Modularity and Separation | COMPLIANT - Directory structure follows specification |
| V. Naming Conventions | COMPLIANT - kebab-case for API, PascalCase for components |

## Dependencies

**Core Dependencies**:
- `next`: ^14.x - Application framework
- `react`: ^18.x - UI library (Next.js peer dependency)
- `react-dom`: ^18.x - React DOM rendering
- `@supabase/supabase-js`: ^2.x - Supabase client

**Dev Dependencies**:
- None required for initial setup (testing deferred)

## Open Questions Resolved

All technical context items have been resolved. No NEEDS CLARIFICATION markers remain.
