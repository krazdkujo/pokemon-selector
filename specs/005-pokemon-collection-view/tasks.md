# Tasks: Pokemon Collection View

**Input**: Design documents from `/specs/005-pokemon-collection-view/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Manual testing via dev server (no automated tests requested)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Paths use Next.js pages router structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add helper function for SR values to existing utility

- [x] T001 Add getSRValues() helper function to lib/pokemonData.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: API endpoint and page routing that all user stories depend on

- [x] T002 Create GET /api/collection endpoint in pages/api/collection.js
- [x] T003 Create collection page shell with ProtectedRoute in pages/collection.js
- [x] T004 Modify pages/select-starter.js to redirect users with starters to /collection
- [x] T005 Add collection view base styles to styles/globals.css

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - View Pokemon Collection Grid (Priority: P1)

**Goal**: Display all Pokemon in a grid layout ordered by Pokedex number, replacing starter selection for users with starters

**Independent Test**: Log in as user with starter, verify collection grid displays instead of starter selection

### Implementation for User Story 1

- [x] T006 [P] [US1] Create PokemonCollectionCard component in components/PokemonCollectionCard.jsx
- [x] T007 [P] [US1] Create PokemonCollectionGrid component in components/PokemonCollectionGrid.jsx
- [x] T008 [US1] Integrate PokemonCollectionGrid into pages/collection.js with data fetching
- [x] T009 [US1] Add grid layout styles for PokemonCollectionGrid in styles/globals.css
- [x] T010 [US1] Add card styles for PokemonCollectionCard in styles/globals.css
- [x] T011 [US1] Add loading and error states to pages/collection.js
- [x] T012 [US1] Add empty state message when no Pokemon match filters in components/PokemonCollectionGrid.jsx

**Checkpoint**: Users with starters see Pokemon collection grid ordered by number

---

## Phase 4: User Story 4 - View Pokemon Details Modal (Priority: P1)

**Goal**: Click any Pokemon card to open modal with complete Pokemon information

**Independent Test**: Click any Pokemon in grid, verify modal opens with all Pokemon data

### Implementation for User Story 4

- [x] T013 [P] [US4] Create PokemonDetailModal component in components/PokemonDetailModal.jsx
- [x] T014 [US4] Add modal open/close state management to pages/collection.js
- [x] T015 [US4] Add onClick handler to PokemonCollectionCard to trigger modal
- [x] T016 [US4] Add modal overlay and content styles to styles/globals.css
- [x] T017 [US4] Implement close on overlay click and close button in components/PokemonDetailModal.jsx
- [x] T018 [US4] Display all Pokemon data sections (stats, abilities, moves) in modal

**Checkpoint**: Pokemon detail modal fully functional with all information displayed

---

## Phase 5: User Story 2 - Filter Pokemon by Type (Priority: P2)

**Goal**: Filter Pokemon collection by type (Fire, Water, Grass, etc.)

**Independent Test**: Select Fire type, verify only Fire-type Pokemon displayed; clear filter, verify all Pokemon return

### Implementation for User Story 2

- [x] T019 [P] [US2] Create CollectionFilterBar component shell in components/CollectionFilterBar.jsx
- [x] T020 [US2] Integrate existing TypeFilterBar into CollectionFilterBar component
- [x] T021 [US2] Add type filter state management to pages/collection.js
- [x] T022 [US2] Implement type filter logic in PokemonCollectionGrid (OR logic for multiple types)
- [x] T023 [US2] Add clear filter button to CollectionFilterBar

**Checkpoint**: Type filtering works, dual-type Pokemon appear when either type selected

---

## Phase 6: User Story 3 - Filter Pokemon by SR (Priority: P2)

**Goal**: Filter Pokemon collection by SR (rarity) value

**Independent Test**: Select SR value 5, verify only SR=5 Pokemon displayed; combine with type filter

### Implementation for User Story 3

- [x] T024 [P] [US3] Create SRFilterDropdown component in components/SRFilterDropdown.jsx
- [x] T025 [US3] Add SR filter state management to pages/collection.js
- [x] T026 [US3] Integrate SRFilterDropdown into CollectionFilterBar
- [x] T027 [US3] Implement SR filter logic in PokemonCollectionGrid (exact match)
- [x] T028 [US3] Implement combined filter logic (type AND SR) in PokemonCollectionGrid
- [x] T029 [US3] Add SR filter dropdown styles to styles/globals.css

**Checkpoint**: SR filtering works alone and combined with type filter (AND logic)

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Responsive design, edge cases, and final validation

- [x] T030 [P] Add responsive grid styles for mobile/tablet in styles/globals.css
- [x] T031 [P] Add responsive modal styles for mobile in styles/globals.css
- [x] T032 Handle Pokemon with missing images gracefully in PokemonCollectionCard
- [x] T033 Add keyboard accessibility (Escape to close modal) in PokemonDetailModal
- [x] T034 Run quickstart.md test scenarios and validate all acceptance criteria
- [x] T035 Verify performance goals (page load <3s, filter <500ms, modal <300ms)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - Core grid display
- **User Story 4 (Phase 4)**: Depends on US1 (needs cards to click) - Detail modal
- **User Story 2 (Phase 5)**: Depends on Foundational - Type filtering
- **User Story 3 (Phase 6)**: Depends on US2 (integrates into filter bar) - SR filtering
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|------------|-----------------|
| US1 (Grid) | Foundational | Phase 2 complete |
| US4 (Modal) | US1 | T012 complete (needs cards) |
| US2 (Type Filter) | Foundational | Phase 2 complete |
| US3 (SR Filter) | US2 | T023 complete (integrates into filter bar) |

### Parallel Opportunities

**Within Phase 2 (Foundational)**:
- T002 and T003 can run in parallel (different files)
- T004 independent file modification

**Within Phase 3 (US1)**:
- T006 and T007 can run in parallel (different components)

**Across User Stories**:
- US1 and US2 can start in parallel after Foundational
- US4 waits for US1 cards to exist
- US3 waits for US2 filter bar to exist

---

## Parallel Example: User Story 1

```bash
# Launch card and grid components in parallel:
Task: "Create PokemonCollectionCard component in components/PokemonCollectionCard.jsx"
Task: "Create PokemonCollectionGrid component in components/PokemonCollectionGrid.jsx"
```

## Parallel Example: User Stories 1 & 2

```bash
# After Foundational phase, can work on grid and filter bar simultaneously:
Task: "[US1] Create PokemonCollectionCard component"
Task: "[US2] Create CollectionFilterBar component shell"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 4)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002-T005)
3. Complete Phase 3: User Story 1 - Grid Display (T006-T012)
4. Complete Phase 4: User Story 4 - Detail Modal (T013-T018)
5. **STOP and VALIDATE**: Grid displays, modal opens - core feature works
6. Deploy/demo MVP

### Incremental Delivery

1. Setup + Foundational -> Basic page structure
2. Add US1 (Grid) -> Pokemon displayed in order
3. Add US4 (Modal) -> Click to view details -> **MVP Complete**
4. Add US2 (Type Filter) -> Filter by type
5. Add US3 (SR Filter) -> Filter by rarity
6. Polish -> Responsive, accessible, performant

---

## Task Summary

| Phase | Story | Task Count | Parallel Tasks |
|-------|-------|------------|----------------|
| 1 - Setup | - | 1 | 0 |
| 2 - Foundational | - | 4 | 0 |
| 3 - US1 Grid | US1 | 7 | 2 |
| 4 - US4 Modal | US4 | 6 | 1 |
| 5 - US2 Type Filter | US2 | 5 | 1 |
| 6 - US3 SR Filter | US3 | 6 | 1 |
| 7 - Polish | - | 6 | 2 |
| **Total** | | **35** | **7** |

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story
- No automated tests - use quickstart.md for manual validation
- Commit after each task or logical group
- US1 + US4 form the MVP (grid + modal)
- US2 + US3 add filtering capabilities
- Stop at any checkpoint to validate story independently
