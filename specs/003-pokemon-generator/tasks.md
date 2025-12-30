# Tasks: Pokemon Selector and Generation System

**Input**: Design documents from `/specs/003-pokemon-generator/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested - test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project structure**: Next.js pages router at repository root
- `pages/api/` - API routes (microservices)
- `components/` - React components
- `lib/` - Shared utilities
- `styles/` - CSS styles

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and verification

- [x] T001 Verify Source folder data files exist and are readable (Source/pokemon/pokemon.json, Source/moves/moves.json, Source/abilities/abilities.json, Source/natures/natures.json, Source/evolution/evolution.json)
- [x] T002 Verify existing auth system works (login, dashboard access via ProtectedRoute)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data loading infrastructure that MUST be complete before ANY user story

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Add getAllNatures() function to load natures.json in lib/pokemonData.js
- [x] T004 Add getNatureById(id) function to get specific nature in lib/pokemonData.js
- [x] T005 Add getAllEvolutions() function to load evolution.json in lib/pokemonData.js
- [x] T006 Add getEvolutionsByPokemon(pokemonId) function to find evolution paths in lib/pokemonData.js
- [x] T007 Add getMoveById(id) function to get move details in lib/pokemonData.js
- [x] T008 Add getAbilityById(id) function to get ability details in lib/pokemonData.js

**Checkpoint**: Foundation ready - all data loaders implemented. User story implementation can now begin.

---

## Phase 3: User Story 1 - Generate Random Pokemon (Priority: P1) MVP

**Goal**: User can click a button and receive a fully-formed random Pokemon with moves, ability, and nature

**Independent Test**: Click "Generate Random Pokemon" button, verify complete Pokemon displays with name, types, stats, 4 moves, ability, and nature

### Implementation for User Story 1

- [x] T009 [US1] Create selectRandomPokemon() helper function in pages/api/generate-pokemon.js that picks random Pokemon from full dataset
- [x] T010 [US1] Create selectMovesForLevel(pokemon, level) helper function in pages/api/generate-pokemon.js that selects 4 moves from level-appropriate pool
- [x] T011 [US1] Create selectAbility(pokemon) helper function in pages/api/generate-pokemon.js with 90% normal / 10% hidden probability
- [x] T012 [US1] Create selectNature() helper function in pages/api/generate-pokemon.js that picks random nature
- [x] T013 [US1] Create applyNatureModifiers(stats, nature) helper function in pages/api/generate-pokemon.js that applies +1/-1 stat changes
- [x] T014 [US1] Create getEvolutionInfo(pokemonId) helper function in pages/api/generate-pokemon.js that looks up evolution paths
- [x] T015 [US1] Create buildGeneratedPokemon(pokemon, moves, ability, nature, evolution, level) helper function in pages/api/generate-pokemon.js that assembles the full response object
- [x] T016 [US1] Implement POST handler in pages/api/generate-pokemon.js that orchestrates random generation and returns GeneratedPokemon response per contract
- [x] T017 [US1] Add error handling for missing Source data files in pages/api/generate-pokemon.js with user-friendly messages
- [x] T018 [P] [US1] Create PokemonSelector.jsx component shell in components/PokemonSelector.jsx with "Generate Random Pokemon" button
- [x] T019 [US1] Implement API call to /api/generate-pokemon on button click in components/PokemonSelector.jsx
- [x] T020 [US1] Add loading state with LoadingSpinner during generation in components/PokemonSelector.jsx
- [x] T021 [US1] Create basic Pokemon display showing name and types after generation in components/PokemonSelector.jsx
- [x] T022 [US1] Integrate PokemonSelector component into pages/dashboard.js replacing placeholder content
- [x] T023 [P] [US1] Add basic Pokemon card styles to styles/globals.css (card container, button styles)

**Checkpoint**: User Story 1 complete - users can generate random Pokemon and see basic info. MVP delivered.

---

## Phase 4: User Story 2 - View Generated Pokemon Details (Priority: P2)

**Goal**: Display all Pokemon information including sprite, full stats, moves with descriptions, ability, nature, and evolution

**Independent Test**: Generate any Pokemon, verify all data sections are visible (sprite, 6 stats, 4 moves with details, ability with description, nature with effect, evolution path)

### Implementation for User Story 2

- [x] T024 [P] [US2] Create PokemonSprite sub-component in components/PokemonSelector.jsx that displays sprite from PokeAPI URL pattern
- [x] T025 [P] [US2] Create StatsDisplay sub-component in components/PokemonSelector.jsx showing base and modified stats (STR, DEX, CON, INT, WIS, CHA, HP, AC)
- [x] T026 [P] [US2] Create MovesDisplay sub-component in components/PokemonSelector.jsx showing 4 moves with name, type, PP, range, description
- [x] T027 [P] [US2] Create AbilityDisplay sub-component in components/PokemonSelector.jsx showing ability name, description, and hidden badge if applicable
- [x] T028 [P] [US2] Create NatureDisplay sub-component in components/PokemonSelector.jsx showing nature name and stat effect
- [x] T029 [P] [US2] Create EvolutionDisplay sub-component in components/PokemonSelector.jsx showing evolves-to/evolves-from with conditions
- [x] T030 [US2] Integrate all sub-components into PokemonSelector.jsx main display area
- [x] T031 [P] [US2] Add type badge color styles (grass green, fire red, water blue, etc.) to styles/globals.css
- [x] T032 [P] [US2] Add stats bar visualization styles to styles/globals.css
- [x] T033 [P] [US2] Add moves list styles to styles/globals.css
- [x] T034 [P] [US2] Add responsive layout styles for Pokemon card to styles/globals.css

**Checkpoint**: User Story 2 complete - full Pokemon details displayed beautifully

---

## Phase 5: User Story 3 - Generate Specific Pokemon by ID (Priority: P3)

**Goal**: User can search/enter a Pokemon name to generate that specific species

**Independent Test**: Enter "bulbasaur" in search, verify Bulbasaur is generated with correct data

### Implementation for User Story 3

- [x] T035 [US3] Add pokemonId parameter handling to POST handler in pages/api/generate-pokemon.js
- [x] T036 [US3] Add Pokemon ID validation with 404 response for invalid IDs in pages/api/generate-pokemon.js
- [x] T037 [US3] Add level parameter handling (1-20, default 5) in pages/api/generate-pokemon.js
- [x] T038 [P] [US3] Create PokemonSearch sub-component in components/PokemonSelector.jsx with text input field
- [x] T039 [US3] Implement autocomplete suggestions using getAllPokemon() data in components/PokemonSelector.jsx
- [x] T040 [US3] Wire search input to API call with pokemonId parameter in components/PokemonSelector.jsx
- [x] T041 [US3] Add error display for "Pokemon not found" responses in components/PokemonSelector.jsx
- [x] T042 [P] [US3] Add search input and autocomplete styles to styles/globals.css

**Checkpoint**: User Story 3 complete - users can generate specific Pokemon by name

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T043 Add request timeout handling (10 second limit) in pages/api/generate-pokemon.js
- [x] T044 Add console logging for errors in pages/api/generate-pokemon.js for debugging
- [x] T045 Verify all acceptance scenarios from spec.md work correctly
- [x] T046 Test edge cases: missing Source files, Pokemon with no evolution, invalid moves
- [x] T047 Test rapid consecutive generations (10+ times) for stability
- [x] T048 Run quickstart.md validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion (needs generated Pokemon to display)
- **User Story 3 (Phase 5)**: Depends on Foundational only (but should come after US1 for priority order)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 (enhances the display US1 creates)
- **User Story 3 (P3)**: Can start after Foundational - Independent of US1/US2 but should follow priority order

### Within Each Phase

- API helper functions before main handler
- Component shell before API integration
- Loading states before display components
- Styles can be added in parallel [P] with component work

### Parallel Opportunities

**Foundational Phase (T003-T008)**: All 6 data loader tasks can run in parallel (different functions, same file but independent)

**User Story 1 (T018, T023)**: Component shell and styles in parallel with API implementation

**User Story 2 (T024-T029, T031-T034)**: All sub-components can be built in parallel, all styles can be added in parallel

**User Story 3 (T038, T042)**: Search component and styles in parallel with API changes

---

## Parallel Example: User Story 2

```bash
# Launch all sub-component tasks together:
Task: "Create PokemonSprite sub-component in components/PokemonSelector.jsx"
Task: "Create StatsDisplay sub-component in components/PokemonSelector.jsx"
Task: "Create MovesDisplay sub-component in components/PokemonSelector.jsx"
Task: "Create AbilityDisplay sub-component in components/PokemonSelector.jsx"
Task: "Create NatureDisplay sub-component in components/PokemonSelector.jsx"
Task: "Create EvolutionDisplay sub-component in components/PokemonSelector.jsx"

# Launch all style tasks together:
Task: "Add type badge color styles to styles/globals.css"
Task: "Add stats bar visualization styles to styles/globals.css"
Task: "Add moves list styles to styles/globals.css"
Task: "Add responsive layout styles to styles/globals.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify data files)
2. Complete Phase 2: Foundational (data loaders)
3. Complete Phase 3: User Story 1 (random generation)
4. **STOP and VALIDATE**: Test random generation independently
5. Deploy/demo if ready - users can generate random Pokemon

### Incremental Delivery

1. Complete Setup + Foundational - Foundation ready
2. Add User Story 1 - Test independently - Deploy/Demo (MVP!)
3. Add User Story 2 - Test independently - Deploy/Demo (enhanced display)
4. Add User Story 3 - Test independently - Deploy/Demo (search feature)
5. Each story adds value without breaking previous stories

---

## Task Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1: Setup | T001-T002 | Verify prerequisites |
| Phase 2: Foundational | T003-T008 | Data loading utilities |
| Phase 3: US1 (P1) | T009-T023 | Random Pokemon generation - MVP |
| Phase 4: US2 (P2) | T024-T034 | Full details display |
| Phase 5: US3 (P3) | T035-T042 | Specific Pokemon search |
| Phase 6: Polish | T043-T048 | Edge cases and validation |

**Total Tasks**: 48
- Setup: 2
- Foundational: 6
- User Story 1: 15
- User Story 2: 11
- User Story 3: 8
- Polish: 6

**Parallel Opportunities**: 22 tasks marked [P]

---

## Notes

- [P] tasks = different files or independent functions, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- MVP scope: Setup + Foundational + User Story 1 (T001-T023)
