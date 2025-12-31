# Tasks: Move and Ability Hover Tooltips

**Input**: Design documents from `/specs/006-move-ability-tooltips/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No automated tests requested. Manual testing via dev server.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Components**: `components/`
- **API routes**: `pages/api/`
- **Utilities**: `lib/`
- **Styles**: `styles/`

---

## Phase 1: Setup

**Purpose**: API endpoint and shared tooltip infrastructure

- [x] T001 Create tooltip data API endpoint in pages/api/tooltip-data.js
- [x] T002 [P] Create base Tooltip component with positioning logic in components/Tooltip.jsx
- [x] T003 [P] Add base tooltip styles to styles/globals.css

---

## Phase 2: Foundational

**Purpose**: Core tooltip state management and content components that all user stories depend on

- [x] T004 Create MoveTooltipContent component in components/MoveTooltipContent.jsx
- [x] T005 [P] Create AbilityTooltipContent component in components/AbilityTooltipContent.jsx
- [x] T006 Add tooltip state management hook (useTooltip) in components/PokemonDetailModal.jsx

**Checkpoint**: Foundation ready - tooltip infrastructure complete, user story implementation can begin

---

## Phase 3: User Story 1 - View Move Details on Hover (Priority: P1)

**Goal**: Users can hover over any move name in the Pokemon detail modal to see complete move details in a tooltip.

**Independent Test**: Open Pokemon detail modal, hover over any move in Starting/Level-Up moves sections, verify tooltip shows name, type badge, power, time, PP, duration, range, description, and higher levels.

### Implementation for User Story 1

- [x] T007 [US1] Wrap starting moves with tooltip triggers in components/PokemonDetailModal.jsx
- [x] T008 [US1] Wrap level-up moves with tooltip triggers in components/PokemonDetailModal.jsx
- [x] T009 [US1] Add move data fetching on hover with caching in components/PokemonDetailModal.jsx
- [x] T010 [US1] Add type badge styling for move tooltips in styles/globals.css
- [x] T011 [US1] Handle missing move data with "Details unavailable" message in components/MoveTooltipContent.jsx
- [x] T012 [US1] Add viewport boundary detection to prevent tooltip overflow in components/Tooltip.jsx

**Checkpoint**: Move tooltips fully functional - hover over any starting or level-up move shows complete details

---

## Phase 4: User Story 2 - View Ability Details on Hover (Priority: P2)

**Goal**: Users can hover over any ability name in the Pokemon detail modal to see the ability's full description.

**Independent Test**: Open Pokemon detail modal, hover over any ability in the Abilities section, verify tooltip shows name, hidden status (if applicable), and full description.

### Implementation for User Story 2

- [x] T013 [US2] Wrap ability names with tooltip triggers in components/PokemonDetailModal.jsx
- [x] T014 [US2] Add ability data fetching on hover with caching in components/PokemonDetailModal.jsx
- [x] T015 [US2] Display hidden ability indicator in tooltip in components/AbilityTooltipContent.jsx
- [x] T016 [US2] Handle missing ability data with "Details unavailable" message in components/AbilityTooltipContent.jsx
- [x] T017 [US2] Add ability-specific tooltip styles in styles/globals.css

**Checkpoint**: Ability tooltips fully functional - hover over any ability shows description and hidden status

---

## Phase 5: User Story 3 - Accessible Tooltip Interaction (Priority: P3)

**Goal**: Users can access tooltips via keyboard focus or touch tap, not just mouse hover.

**Independent Test**: Tab to a move/ability element and verify tooltip appears on focus. On touch device, tap to show tooltip.

### Implementation for User Story 3

- [x] T018 [US3] Add tabindex and focus handlers to tooltip triggers in components/PokemonDetailModal.jsx
- [x] T019 [US3] Add ARIA attributes (role="tooltip", aria-describedby) in components/Tooltip.jsx
- [x] T020 [US3] Implement tap-to-show behavior for touch devices in components/Tooltip.jsx
- [x] T021 [US3] Add tap-outside-to-close behavior in components/PokemonDetailModal.jsx
- [x] T022 [US3] Add focus indicator styles for hoverable elements in styles/globals.css

**Checkpoint**: Tooltips accessible via keyboard and touch - all users can access move/ability details

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases and refinements that affect multiple user stories

- [x] T023 Ensure only one tooltip visible at a time (dismiss on new hover) in components/PokemonDetailModal.jsx
- [x] T024 [P] Dismiss tooltip on modal scroll in components/PokemonDetailModal.jsx
- [x] T025 [P] Add 200ms delay before showing tooltip to prevent flicker in components/Tooltip.jsx
- [x] T026 Add cursor:help and dotted underline to hoverable elements in styles/globals.css
- [x] T027 Validate against quickstart.md test scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 (Move tooltips) can proceed first as P1 priority
  - US2 (Ability tooltips) can proceed after or in parallel with US1
  - US3 (Accessibility) can proceed after or in parallel with US1/US2
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Enhances US1/US2 but independently testable

### Within Each User Story

- PokemonDetailModal changes before dependent component changes
- Tooltip triggers before data fetching
- Styles can be done in parallel with logic

### Parallel Opportunities

- T002 and T003 can run in parallel (different files)
- T004 and T005 can run in parallel (different files)
- T023 and T024 and T025 can run in parallel (different concerns)
- Within each user story, styles tasks can run in parallel with logic tasks

---

## Parallel Example: User Story 1

```bash
# After T006 (tooltip state management) completes:

# These can run in parallel - different sections of the same file:
Task: "T007 [US1] Wrap starting moves with tooltip triggers"
Task: "T008 [US1] Wrap level-up moves with tooltip triggers"

# Style task can run in parallel with logic:
Task: "T010 [US1] Add type badge styling for move tooltips"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T006)
3. Complete Phase 3: User Story 1 (T007-T012)
4. **STOP and VALIDATE**: Test move tooltips independently
5. Deploy/demo if ready - users can now see move details on hover

### Incremental Delivery

1. Setup + Foundational -> Infrastructure ready
2. Add User Story 1 -> Test move tooltips -> Deploy (MVP!)
3. Add User Story 2 -> Test ability tooltips -> Deploy
4. Add User Story 3 -> Test accessibility -> Deploy
5. Polish -> Final refinements -> Deploy

### Single Developer Strategy

Execute phases sequentially:
1. Phase 1: Setup (3 tasks)
2. Phase 2: Foundational (3 tasks)
3. Phase 3: User Story 1 (6 tasks) -> Validate
4. Phase 4: User Story 2 (5 tasks) -> Validate
5. Phase 5: User Story 3 (5 tasks) -> Validate
6. Phase 6: Polish (5 tasks) -> Final validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- TM moves display TM number only (no move lookup) due to data structure limitation
