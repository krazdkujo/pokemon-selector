<!--
  SYNC IMPACT REPORT
  ==================
  Version change: N/A (initial) -> 1.0.0

  Modified principles: N/A (initial creation)

  Added sections:
  - Core Principles (5 principles)
  - Technology Stack (new section)
  - Development Workflow (new section)
  - Governance

  Removed sections: N/A

  Templates requiring updates:
  - .specify/templates/plan-template.md: OK (no constitution-specific updates needed)
  - .specify/templates/spec-template.md: OK (no constitution-specific updates needed)
  - .specify/templates/tasks-template.md: OK (no constitution-specific updates needed)
  - .specify/templates/checklist-template.md: OK (no constitution-specific updates needed)
  - .specify/templates/agent-file-template.md: OK (no constitution-specific updates needed)

  Follow-up TODOs: None
-->

# Pokemon Battle Website Constitution

## Core Principles

### I. Source Data Authority

All Pokemon-related data (species, moves, abilities, natures, items, evolutions, classes, feats, TMs, rules) MUST be read from the `Source/` folder JSON files. Implementation rules:

- NEVER hardcode Pokemon stats, moves, abilities, or any game data in application code
- Treat Source folder data as read-only; application code MUST NOT modify these files
- Validate JSON data structure before consumption to handle missing or malformed data gracefully
- Load data via utility functions in `lib/pokemon-data.js`, never inline file reads

**Rationale**: Centralizing game data in the Source folder ensures consistency, simplifies updates, and prevents data drift between hardcoded values and source-of-truth files.

### II. Microservices Architecture

All backend logic MUST be implemented as Vercel Serverless Functions in `/pages/api/`. Each microservice MUST:

- Focus on a single responsibility (e.g., `generate-pokemon.js` handles generation only)
- Return JSON responses with consistent error structures
- Be stateless; persist state via Supabase, not in-memory
- Implement input validation and rate limiting

**Rationale**: Lightweight, focused serverless functions scale automatically, reduce cold-start times, and isolate failures to specific endpoints.

### III. Security First

Security constraints are NON-NEGOTIABLE:

- NEVER expose `SUPABASE_SERVICE_KEY` in frontend code; use only in serverless functions
- `NEXT_PUBLIC_*` environment variables are the ONLY credentials permitted in client-side code
- All API inputs MUST be validated and sanitized before processing
- Implement Supabase Row Level Security (RLS) policies for all database tables
- Rate limit all public-facing API endpoints
- Never commit `.env` files or credentials to version control

**Rationale**: Pokemon applications attract automated abuse; defense-in-depth prevents data breaches and service disruption.

### IV. Modularity and Separation

Code organization MUST follow strict separation of concerns:

- **Components** (`/components/`): Presentational UI only; no API calls or business logic
- **Pages** (`/pages/`): Route handling and page composition; delegates to components
- **API** (`/pages/api/`): Serverless functions; no UI code
- **Lib** (`/lib/`): Shared utilities, Supabase client, data loaders; no framework-specific code
- Each module MUST be independently testable

**Rationale**: Clear boundaries reduce coupling, enable parallel development, and simplify debugging.

### V. Naming and File Conventions

Consistent naming MUST be enforced across the codebase:

- **Microservices** (API routes): kebab-case (e.g., `generate-pokemon.js`, `battle.js`)
- **React Components**: PascalCase files and exports (e.g., `BattleArena.jsx`)
- **Utility modules**: camelCase (e.g., `pokemonData.js`, `supabase.js`)
- **Source data files**: lowercase with hyphens or existing naming from game extraction

**Rationale**: Predictable naming reduces cognitive load and prevents import errors.

## Technology Stack

This section defines the mandatory technology choices for the project:

| Layer | Technology | Version Constraint |
|-------|------------|-------------------|
| Frontend Framework | Next.js | Latest stable |
| Hosting | Vercel | N/A |
| Authentication | Supabase Auth | Latest stable |
| Database | Supabase PostgreSQL | N/A |
| Backend | Vercel Serverless Functions | Node.js runtime |
| Data Source | Local JSON files in `Source/` | N/A |

**Required Environment Variables**:
```
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SERVICE_KEY=<supabase-service-key>
```

## Development Workflow

### Authentication Flow

1. Unauthenticated users see login page only
2. All other routes MUST be protected via Supabase session validation
3. Session tokens stored securely; no localStorage for sensitive data

### Data Loading Pattern

1. Serverless function receives request
2. Load relevant Source folder data via `lib/pokemon-data.js`
3. Process according to business rules
4. Return JSON response
5. Frontend renders result

### Code Review Requirements

- All PRs MUST verify compliance with this constitution
- Source folder data usage MUST be validated (no hardcoding)
- Security review for any authentication or API changes
- Test coverage for new serverless functions

## Governance

This constitution supersedes all other development practices for this project. Amendments require:

1. Written proposal documenting the change and rationale
2. Impact analysis on existing code
3. Migration plan for affected components
4. Version increment following semantic versioning:
   - MAJOR: Principle removal or incompatible redefinition
   - MINOR: New principle or section addition
   - PATCH: Clarifications and non-semantic refinements

All pull requests and code reviews MUST verify compliance with these principles. Complexity beyond what is specified here MUST be justified in writing.

**Version**: 1.0.0 | **Ratified**: 2025-12-30 | **Last Amended**: 2025-12-30
