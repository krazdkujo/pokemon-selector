# Tasks: Initial Project Setup and Structure

**Input**: Design documents from `/specs/001-nextjs-supabase-setup/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Testing is OUT OF SCOPE for this feature (per spec.md). No test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js Pages Router**: `pages/`, `components/`, `lib/`, `styles/`, `public/` at repository root
- **Source Data**: `Source/` folder at repository root (already exists)

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Next.js project and install dependencies

- [x] T001 Initialize Next.js 14 project with Pages Router using `npx create-next-app@14 . --js --no-tailwind --no-eslint --no-app --no-src-dir`
- [x] T002 Install Supabase client dependency using `npm install @supabase/supabase-js`
- [x] T003 [P] Create directory structure: `components/`, `lib/`, `styles/`, `public/`, `pages/api/`
- [x] T004 [P] Verify Source folder exists at project root with metadata.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core configuration that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create `.env.local` file with placeholder Supabase environment variables
- [x] T006 [P] Update `.gitignore` to exclude `.env.local`, `.env`, `.env.*.local`, `.next/`, `out/`, `node_modules/`
- [x] T007 [P] Create `next.config.js` with basic configuration

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Developer Deploys Application (Priority: P1)

**Goal**: Application deploys to Vercel and displays placeholder landing page without errors

**Independent Test**: Visit deployment URL and verify page loads without console errors, run `npm run dev` and `npm run build` locally

### Implementation for User Story 1

- [x] T008 [US1] Create `styles/globals.css` with minimal CSS reset and base styles
- [x] T009 [US1] Create `pages/_app.js` with global styles import and basic app wrapper
- [x] T010 [US1] Create `pages/index.js` with placeholder landing page (title, description, future login redirect note)
- [x] T011 [US1] Verify `npm run dev` starts development server within 10 seconds
- [x] T012 [US1] Verify `npm run build` completes without errors or warnings

**Checkpoint**: Application runs locally and is ready for Vercel deployment. User Story 1 is independently testable.

---

## Phase 4: User Story 2 - Application Connects to Supabase (Priority: P2)

**Goal**: Supabase client initializes successfully and can verify connection

**Independent Test**: Import Supabase client, verify no initialization errors, health endpoint returns Supabase connection status

### Implementation for User Story 2

- [x] T013 [US2] Create `lib/supabase.js` with Supabase client singleton (createClient from @supabase/supabase-js)
- [x] T014 [US2] Add environment variable validation in `lib/supabase.js` with clear error messages for missing variables
- [x] T015 [US2] Create `pages/api/health.js` serverless function per api-health.yaml contract
- [x] T016 [US2] Implement Supabase connection check in health endpoint with latency measurement
- [x] T017 [US2] Verify health endpoint returns correct JSON response structure

**Checkpoint**: Supabase connection verified via health endpoint. User Story 2 is independently testable.

---

## Phase 5: User Story 3 - Developer Accesses Pokemon Data (Priority: P3)

**Goal**: Pokemon data utility provides access to Source folder data

**Independent Test**: Import pokemonData utility, verify getAllPokemon returns 1142 records, getMetadata returns correct entity counts

### Implementation for User Story 3

- [x] T018 [US3] Create `lib/pokemonData.js` with getMetadata() function to read Source/metadata.json with try/catch error handling for missing or malformed JSON
- [x] T019 [US3] Add getAllPokemon() function to `lib/pokemonData.js` to read Source/pokemon/pokemon.json
- [x] T020 [US3] Add getPokemonById(id) function to `lib/pokemonData.js` with array find lookup
- [x] T021 [P] [US3] Add getAllMoves() function to `lib/pokemonData.js` to read Source/moves/moves.json
- [x] T022 [P] [US3] Add getAllAbilities() function to `lib/pokemonData.js` to read Source/abilities/abilities.json
- [x] T023 [US3] Add Source folder availability check to health endpoint in `pages/api/health.js`
- [x] T024 [US3] Verify getMetadata() returns entityCounts matching Source/metadata.json (1142 pokemon, 800 moves, etc.)

**Checkpoint**: Pokemon data accessible via utility. User Story 3 is independently testable.

---

## Phase 6: Polish and Cross-Cutting Concerns

**Purpose**: Finalization and verification of all acceptance criteria

- [x] T025 Run quickstart.md verification checklist (dev server, build, no console errors)
- [x] T026 Verify all success criteria from spec.md are met (SC-001 through SC-007)
- [x] T027 Test health endpoint returns complete status (Supabase + Source data)
- [x] T028 Final build and local verification before Vercel deployment

---

## Dependencies and Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1, P2, P3)
  - Some parallelization possible within stories
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Uses health endpoint from US2 for integration

### Within Each User Story

- Core files before dependent files
- Utilities before API endpoints
- Implementation before verification

### Parallel Opportunities

**Setup Phase**:
- T003 and T004 can run in parallel (different directories)

**Foundational Phase**:
- T006 and T007 can run in parallel (different files)

**User Story 3**:
- T021 and T022 can run in parallel (adding functions to same file but independent)

---

## Parallel Example: Setup Phase

```bash
# After T001 and T002 complete sequentially, launch in parallel:
Task: "Create directory structure: components/, lib/, styles/, public/, pages/api/"
Task: "Verify Source folder exists at project root with metadata.json"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Verify app runs locally without errors
5. Deploy to Vercel for production validation

### Incremental Delivery

1. Complete Setup + Foundational - Foundation ready
2. Add User Story 1 - App deploys and runs (MVP!)
3. Add User Story 2 - Supabase connection verified
4. Add User Story 3 - Pokemon data accessible
5. Polish - All success criteria verified

### Recommended Execution Order

For a single developer working sequentially:

```
T001 -> T002 -> T003+T004 (parallel) -> T005 -> T006+T007 (parallel)
-> T008 -> T009 -> T010 -> T011 -> T012
-> T013 -> T014 -> T015 -> T016 -> T017
-> T018 -> T019 -> T020 -> T021+T022 (parallel) -> T023 -> T024
-> T025 -> T026 -> T027 -> T028
```

---

## Notes

- Testing is OUT OF SCOPE per spec.md - no test tasks included
- Source folder already exists with Pokemon data - no copy/migration needed
- Vercel deployment is manual (connect GitHub or use CLI) - not automated in tasks
- Environment variables must be set in Vercel dashboard separately
- [P] tasks = different files, no dependencies between them
- [Story] label maps task to specific user story for traceability
