# Tasks: Pokemon Move Selection and HP Setup

**Input**: Design documents from `/specs/007-pokemon-move-hp-setup/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Manual testing via development server (no automated tests specified)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions (Next.js Pages Router)

- **Components**: `components/`
- **Lib/Utils**: `lib/`
- **API Routes**: `pages/api/`
- **Pages**: `pages/`
- **Styles**: `styles/`

---

## Phase 1: Setup

**Purpose**: Database schema extension and shared utility functions

- [ ] T001 Run database migration to add new columns to player_pokemon table (see quickstart.md SQL)
- [x] T002 [P] Add getAvailableMovesForLevel() function in lib/pokemonData.js
- [x] T003 [P] Add calculateHP() function in lib/pokemonData.js
- [x] T004 [P] Add getMovesWithDetails() function in lib/pokemonData.js to enrich move IDs with full details

**Checkpoint**: Database ready, utility functions available for all user stories

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: API endpoints and core modal component that ALL user stories depend on

- [x] T005 Create GET /api/pokemon-moves endpoint in pages/api/pokemon-moves.js
- [x] T006 [P] Create POST /api/calculate-hp endpoint in pages/api/calculate-hp.js
- [x] T007 Create PokemonSetupModal.jsx shell component in components/PokemonSetupModal.jsx
- [x] T008 Add modal styles to styles/globals.css for setup modal layout

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - Select Moves for New Pokemon (Priority: P1)

**Goal**: Players can select 1-4 moves from available level-appropriate moves when adding a Pokemon

**Independent Test**: Add a starter Pokemon, verify move selection UI appears with correct moves for level 1, select 2 moves, confirm selection persists to database

### Implementation for User Story 1

- [x] T009 [P] [US1] Create MoveSelectionPanel.jsx component in components/MoveSelectionPanel.jsx
- [x] T010 [P] [US1] Add move selection styles to styles/globals.css
- [x] T011 [US1] Integrate MoveSelectionPanel into PokemonSetupModal in components/PokemonSetupModal.jsx
- [x] T012 [US1] Add move validation logic (1-4 moves, valid for level) to PokemonSetupModal
- [x] T013 [US1] Integrate MoveTooltipContent for move details in MoveSelectionPanel (reuse existing component)

**Checkpoint**: Move selection UI functional - can select moves, see details, enforce 1-4 limit

---

## Phase 4: User Story 2 - Choose HP Calculation Method (Priority: P1)

**Goal**: Players choose between "Average" or "Roll" HP calculation, see results before confirming

**Independent Test**: Add a Pokemon, choose "Roll" for HP, verify dice results are displayed with breakdown, confirm HP persists correctly

### Implementation for User Story 2

- [x] T014 [P] [US2] Create HPCalculationPanel.jsx component in components/HPCalculationPanel.jsx
- [x] T015 [P] [US2] Add HP panel styles to styles/globals.css
- [x] T016 [US2] Integrate HPCalculationPanel into PokemonSetupModal in components/PokemonSetupModal.jsx
- [x] T017 [US2] Connect HPCalculationPanel to /api/calculate-hp for roll preview
- [x] T018 [US2] Display HP breakdown (per-level rolls/averages, CON modifier, total) in HPCalculationPanel

**Checkpoint**: HP calculation UI functional - can choose method, see breakdown, re-roll if desired

---

## Phase 5: User Story 3 - Level Determines Available Moves (Priority: P2)

**Goal**: System correctly filters moves based on Pokemon level using cumulative level pools

**Independent Test**: Test with a higher-level Pokemon (if possible via future capture), verify moves from all levels up to current are available

### Implementation for User Story 3

- [x] T019 [US3] Ensure getAvailableMovesForLevel() in lib/pokemonData.js handles all level keys correctly
- [x] T020 [US3] Add level parameter support to PokemonSetupModal props in components/PokemonSetupModal.jsx
- [x] T021 [US3] Verify move filtering excludes TM and egg moves in lib/pokemonData.js

**Checkpoint**: Level-based move filtering works correctly for any level 1-20

---

## Phase 6: User Story 4 - Setup Flow Integration (Priority: P2)

**Goal**: Setup modal integrates seamlessly with starter selection flow

**Independent Test**: Select a starter, verify setup modal appears before Pokemon is saved, complete setup, verify Pokemon appears in collection with moves and HP

### Implementation for User Story 4

- [x] T022 [US4] Modify StarterDetailModal.jsx to show PokemonSetupModal instead of immediate API call
- [x] T023 [US4] Pass pokemon data, level, and nickname from StarterDetailModal to PokemonSetupModal
- [x] T024 [US4] Update POST /api/starters to accept selectedMoves and hpMethod in pages/api/starters.js
- [x] T025 [US4] Add move validation to POST /api/starters (verify moves valid for level)
- [x] T026 [US4] Add HP calculation to POST /api/starters (calculate and persist HP based on method)
- [x] T027 [US4] Update buildPlayerPokemonResponse() in lib/pokemonData.js to include new fields
- [x] T028 [US4] Handle setup modal cancel (return to StarterDetailModal without saving)

**Checkpoint**: Full end-to-end flow works - starter selection triggers setup modal, data persists correctly

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T029 Test complete flow with multiple Pokemon types to verify hitDice parsing
- [x] T030 Verify modal accessibility (keyboard navigation, focus management)
- [x] T031 Test edge cases: 0 moves validation, max 4 moves enforcement, cancel flow
- [x] T032 Verify existing Pokemon in database still display correctly (backwards compatibility)
- [x] T033 Run quickstart.md validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 (needs utility functions)
- **Phase 3 (US1)**: Depends on Phase 2 (needs modal shell and API)
- **Phase 4 (US2)**: Depends on Phase 2 (needs modal shell and calculate-hp API)
- **Phase 5 (US3)**: Depends on Phase 1 (needs getAvailableMovesForLevel function)
- **Phase 6 (US4)**: Depends on Phase 3, Phase 4 (needs both panels complete)
- **Phase 7 (Polish)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational - Move selection is independent
- **User Story 2 (P1)**: Depends on Foundational - HP calculation is independent
- **User Story 3 (P2)**: Can be done in parallel with US1/US2 (utility function work)
- **User Story 4 (P2)**: Requires US1 and US2 to be complete (integrates both panels)

### Within Each User Story

- Components before integration
- Styles can be done in parallel with component logic
- API modifications after UI is ready to consume them

### Parallel Opportunities

**Phase 1** (all parallelizable after database migration):
```
Task: T002 Add getAvailableMovesForLevel() in lib/pokemonData.js
Task: T003 Add calculateHP() in lib/pokemonData.js
Task: T004 Add getMovesWithDetails() in lib/pokemonData.js
```

**Phase 2** (API endpoints parallelizable):
```
Task: T005 Create GET /api/pokemon-moves
Task: T006 Create POST /api/calculate-hp
```

**US1 + US2 Components** (different files):
```
Task: T009 Create MoveSelectionPanel.jsx
Task: T014 Create HPCalculationPanel.jsx
```

**US3** (can run in parallel with US1/US2):
```
Task: T019, T020, T021 - Level filtering work
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (database + utilities)
2. Complete Phase 2: Foundational (APIs + modal shell)
3. Complete Phase 3: User Story 1 (move selection)
4. Complete Phase 4: User Story 2 (HP calculation)
5. **STOP and VALIDATE**: Both selection interfaces work in modal
6. Complete Phase 6: User Story 4 (integration)
7. Test end-to-end with starter selection

### Suggested First Sprint

Focus on T001-T018 to get the core move/HP selection working:
- Database migration
- Utility functions
- Both API endpoints
- Both UI panels
- Integration into modal

User Story 3 (level filtering) can be refined after core functionality works.

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Reuse existing MoveTooltipContent component from feature 006
- All HP rolling happens server-side to prevent manipulation
- Cancel flow must not save any partial data
- Commit after each task or logical group
