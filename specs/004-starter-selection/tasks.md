# Tasks: Starter Pokemon Selection

**Input**: Design documents from `/specs/004-starter-selection/`
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
- `pages/` - Next.js pages
- `components/` - React components
- `lib/` - Shared utilities
- `styles/` - CSS styles

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and database setup

- [x] T001 Verify existing auth system works (login, session management via Supabase)
- [x] T002 Verify Source folder data files exist (Source/pokemon/pokemon.json is readable)
- [x] T003 Create player_pokemon table in Supabase using SQL schema from data-model.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data loading infrastructure that MUST be complete before ANY user story

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Add getStarterPokemon() function to filter SR <= 0.5 Pokemon in lib/pokemonData.js
- [x] T005 Add getPokemonTypes() function to return all 18 type names in lib/pokemonData.js
- [x] T006 [P] Create helper function to build PlayerPokemon response object in lib/pokemonData.js

**Checkpoint**: Foundation ready - all data loaders implemented. User story implementation can now begin.

---

## Phase 3: User Story 1 - Filter and Browse Starter Pokemon (Priority: P1) MVP

**Goal**: User can see type filter bar, select 1-2 types, and view matching starter Pokemon cards

**Independent Test**: Navigate to /select-starter, click "Fire" type, verify only Fire-type Pokemon with SR <= 0.5 appear. Click "Dragon" as second type, verify union filtering works.

### Implementation for User Story 1

- [x] T007 [US1] Create GET handler in pages/api/starters.js that returns all starter Pokemon and types list
- [x] T008 [US1] Add authentication check to GET /api/starters using Supabase getUser()
- [x] T009 [US1] Add hasStarter flag to GET /api/starters response by checking player_pokemon count
- [x] T010 [P] [US1] Create TypeFilterBar.jsx component shell in components/TypeFilterBar.jsx with 18 type buttons
- [x] T011 [US1] Implement type selection logic in TypeFilterBar.jsx (max 2 types, toggle behavior)
- [x] T012 [P] [US1] Create StarterCard.jsx component in components/StarterCard.jsx showing sprite, name, types
- [x] T013 [P] [US1] Create StarterGrid.jsx component in components/StarterGrid.jsx to display filtered Pokemon cards
- [x] T014 [US1] Implement client-side type filtering in StarterGrid.jsx using union logic
- [x] T015 [US1] Create select-starter.js page in pages/select-starter.js with ProtectedRoute wrapper
- [x] T016 [US1] Integrate TypeFilterBar and StarterGrid into pages/select-starter.js
- [x] T017 [US1] Add "Select 1 or 2 types" prompt when no types selected in pages/select-starter.js
- [x] T018 [US1] Add "No Pokemon match these types" message for empty results in StarterGrid.jsx
- [x] T019 [P] [US1] Add type filter button styles to styles/globals.css (selected/unselected states)
- [x] T020 [P] [US1] Add starter card grid styles to styles/globals.css (grid layout, hover effects)

**Checkpoint**: User Story 1 complete - users can browse and filter starter Pokemon. MVP delivered.

---

## Phase 4: User Story 2 - Select Starter Pokemon (Priority: P2)

**Goal**: User can click a Pokemon card, view details in modal, and select it as their starter

**Independent Test**: Click on a Pokemon card, verify modal shows full details, click "Choose as Starter", verify redirect to dashboard with Pokemon in roster.

### Implementation for User Story 2

- [x] T021 [US2] Create POST handler in pages/api/starters.js that saves selected starter to database
- [x] T022 [US2] Add validation to POST /api/starters: check pokemon_id exists, user has no starter yet
- [x] T023 [US2] Implement slot assignment logic in POST /api/starters (assign slot 1 for starter)
- [x] T024 [US2] Add error handling for database failures in POST /api/starters with user-friendly messages
- [x] T025 [P] [US2] Create StarterDetailModal.jsx component in components/StarterDetailModal.jsx
- [x] T026 [US2] Add full Pokemon details to StarterDetailModal.jsx (stats, abilities, description)
- [x] T027 [US2] Add "Choose as Starter" button to StarterDetailModal.jsx
- [x] T028 [US2] Implement modal open/close behavior when clicking StarterCard in pages/select-starter.js
- [x] T029 [US2] Wire "Choose as Starter" button to POST /api/starters in StarterDetailModal.jsx
- [x] T030 [US2] Add redirect to /dashboard after successful starter selection
- [x] T031 [US2] Add "You already have a starter" message when hasStarter is true in pages/select-starter.js
- [x] T032 [P] [US2] Add modal overlay and content styles to styles/globals.css

**Checkpoint**: User Story 2 complete - users can select their starter Pokemon.

---

## Phase 5: User Story 3 - View Active Pokemon Roster (Priority: P3)

**Goal**: Dashboard displays 6-slot roster showing user's active Pokemon

**Independent Test**: After selecting starter, navigate to dashboard, verify roster section shows Pokemon in slot 1 with correct details.

### Implementation for User Story 3

- [x] T033 [US3] Create GET handler in pages/api/roster.js that returns user's active Pokemon
- [x] T034 [US3] Add authentication check to GET /api/roster using Supabase getUser()
- [x] T035 [US3] Format roster response as 6 slots with Pokemon data or null for empty slots
- [x] T036 [P] [US3] Create RosterSlot.jsx component in components/RosterSlot.jsx showing Pokemon or empty state
- [x] T037 [P] [US3] Create ActiveRoster.jsx component in components/ActiveRoster.jsx with 6 RosterSlot instances
- [x] T038 [US3] Add API call to GET /api/roster in ActiveRoster.jsx on component mount
- [x] T039 [US3] Integrate ActiveRoster component into pages/dashboard.js
- [x] T040 [US3] Add "Select your starter" prompt with link to /select-starter when roster is empty
- [x] T041 [P] [US3] Add roster grid styles to styles/globals.css (6-slot layout, filled/empty states)

**Checkpoint**: User Story 3 complete - dashboard shows active Pokemon roster.

---

## Phase 6: User Story 4 - Pokemon Storage System (Priority: P4)

**Goal**: Users can view stored Pokemon and swap between active roster and storage

**Independent Test**: With Pokemon in storage, navigate to storage page, verify Pokemon displays, click "Move to Active", verify it moves to roster slot.

### Implementation for User Story 4

- [x] T042 [US4] Create GET handler in pages/api/storage.js with pagination support
- [x] T043 [US4] Add authentication check to GET /api/storage using Supabase getUser()
- [x] T044 [US4] Create POST handler in pages/api/storage.js to move Pokemon to active roster
- [x] T045 [US4] Add validation to POST /api/storage: check Pokemon in storage, roster has space
- [x] T046 [US4] Create PUT handler in pages/api/roster.js for moveToStorage action
- [x] T047 [US4] Add validation to PUT /api/roster: check Pokemon owned, is active
- [x] T048 [P] [US4] Create StorageView.jsx component in components/StorageView.jsx
- [x] T049 [US4] Add pagination controls to StorageView.jsx
- [x] T050 [US4] Add "Move to Active" button to stored Pokemon cards in StorageView.jsx
- [x] T051 [US4] Add "Move to Storage" button to RosterSlot.jsx for active Pokemon
- [x] T052 [US4] Create storage.js page in pages/storage.js with ProtectedRoute wrapper
- [x] T053 [US4] Wire storage operations to APIs in components
- [x] T054 [P] [US4] Add storage view styles to styles/globals.css

**Checkpoint**: User Story 4 complete - full Pokemon collection management available.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T055 Add request timeout handling (10 second limit) to all API routes
- [x] T056 Add console logging for errors in all API routes for debugging
- [ ] T057 Verify all acceptance scenarios from spec.md work correctly
- [ ] T058 Test edge cases: no matching types, database failures, concurrent sessions
- [ ] T059 Test rapid consecutive operations for stability
- [ ] T060 Run quickstart.md validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 (needs browsing UI to select from)
- **User Story 3 (Phase 5)**: Depends on Foundational only (can proceed after Phase 2)
- **User Story 4 (Phase 6)**: Depends on User Story 3 (needs roster display first)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 (selection happens from browsing UI)
- **User Story 3 (P3)**: Can start after Foundational - Independent of US1/US2
- **User Story 4 (P4)**: Depends on User Story 3 (swap requires roster display)

### Within Each Phase

- API handlers before frontend components
- Component shells before integration logic
- Styles can be added in parallel [P] with component work

### Parallel Opportunities

**Foundational Phase (T004-T006)**: T006 can run in parallel with T004-T005

**User Story 1 (T010, T012, T013, T019, T020)**: Components and styles in parallel with API implementation

**User Story 2 (T025, T032)**: Modal component and styles in parallel with API changes

**User Story 3 (T036, T037, T041)**: Roster components and styles in parallel with API

**User Story 4 (T048, T054)**: Storage component and styles in parallel with API changes

---

## Parallel Example: User Story 1

```bash
# Launch all parallel component/style tasks together:
Task: "Create TypeFilterBar.jsx component in components/TypeFilterBar.jsx"
Task: "Create StarterCard.jsx component in components/StarterCard.jsx"
Task: "Create StarterGrid.jsx component in components/StarterGrid.jsx"
Task: "Add type filter button styles to styles/globals.css"
Task: "Add starter card grid styles to styles/globals.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup (verify auth, database)
2. Complete Phase 2: Foundational (data loaders)
3. Complete Phase 3: User Story 1 (browsing)
4. Complete Phase 4: User Story 2 (selection)
5. **STOP and VALIDATE**: Test starter selection flow end-to-end
6. Deploy/demo if ready - users can select a starter

### Incremental Delivery

1. Complete Setup + Foundational - Foundation ready
2. Add User Story 1 - Test independently - Demo (can browse starters)
3. Add User Story 2 - Test independently - Deploy/Demo (MVP: can select starter!)
4. Add User Story 3 - Test independently - Demo (can see roster)
5. Add User Story 4 - Test independently - Deploy/Demo (full collection management)
6. Each story adds value without breaking previous stories

---

## Task Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1: Setup | T001-T003 | Verify prerequisites, create database table |
| Phase 2: Foundational | T004-T006 | Data loading utilities |
| Phase 3: US1 (P1) | T007-T020 | Type filtering and browsing - MVP |
| Phase 4: US2 (P2) | T021-T032 | Starter selection with modal |
| Phase 5: US3 (P3) | T033-T041 | Dashboard roster display |
| Phase 6: US4 (P4) | T042-T054 | Storage and swap functionality |
| Phase 7: Polish | T055-T060 | Edge cases and validation |

**Total Tasks**: 60
- Setup: 3
- Foundational: 3
- User Story 1: 14
- User Story 2: 12
- User Story 3: 9
- User Story 4: 13
- Polish: 6

**Parallel Opportunities**: 15 tasks marked [P]

---

## Notes

- [P] tasks = different files or independent functions, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- MVP scope: Setup + Foundational + User Story 1 + User Story 2 (T001-T032)
