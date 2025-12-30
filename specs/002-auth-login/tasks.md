# Tasks: Authentication and Login Screen

**Input**: Design documents from `/specs/002-auth-login/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Testing is MANUAL for this feature (per spec.md MVP scope). No automated test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js Pages Router**: `pages/`, `components/`, `lib/`, `styles/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project is ready and create shared components

- [x] T001 Verify Spec 1 prerequisites exist: `lib/supabase.js`, `pages/_app.js`, `pages/index.js`, `styles/globals.css`
- [x] T002 [P] Create `components/LoadingSpinner.jsx` with centered spinner and "Loading..." text per FR-011

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core auth infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create `lib/authContext.js` with AuthProvider, useAuth hook, getSession, onAuthStateChange per auth-context.yaml contract
- [x] T004 Add signIn function to authContext.js with error mapping per research.md security patterns
- [x] T005 Add signUp function to authContext.js with error mapping per research.md security patterns
- [x] T006 Add signOut function to authContext.js
- [x] T007 Update `pages/_app.js` to wrap app with AuthProvider

**Checkpoint**: Auth context ready - user story implementation can now begin

---

## Phase 3: User Story 1 - New User Signs Up (Priority: P1)

**Goal**: A new visitor creates an account with email and password

**Independent Test**: Complete signup form, verify account created in Supabase, verify redirect to dashboard

### Implementation for User Story 1

- [x] T008 [US1] Create `components/SignupForm.jsx` with email/password fields, validation (email format, 6+ char password) per data-model.md
- [x] T009 [US1] Add form submission handler calling signUp from authContext in SignupForm.jsx
- [x] T010 [US1] Add loading state and disabled submit button during signup in SignupForm.jsx
- [x] T011 [US1] Add error message display with secure messages per FR-006 in SignupForm.jsx
- [x] T012 [US1] Create `components/AuthTabs.jsx` with Login/Sign Up tab switching
- [x] T013 [US1] Create `pages/login.js` with AuthTabs, SignupForm, and LoginForm (placeholder) per pages.yaml contract

**Checkpoint**: Signup flow complete. User can create account and be redirected to dashboard.

---

## Phase 4: User Story 2 - Existing User Logs In (Priority: P1)

**Goal**: A registered user logs in with email and password to access the dashboard

**Independent Test**: Log in with valid credentials, verify redirect to dashboard, refresh page and verify session persists

### Implementation for User Story 2

- [x] T014 [US2] Create `components/LoginForm.jsx` with email/password fields per data-model.md
- [x] T015 [US2] Add form submission handler calling signIn from authContext in LoginForm.jsx
- [x] T016 [US2] Add loading state and disabled submit button during login in LoginForm.jsx
- [x] T017 [US2] Add error message display with secure generic messages per FR-006 in LoginForm.jsx
- [x] T018 [US2] Update `pages/login.js` to integrate LoginForm with AuthTabs

**Checkpoint**: Login flow complete. User can log in and session persists across refresh per FR-007.

---

## Phase 5: User Story 3 - User Logs Out (Priority: P2)

**Goal**: An authenticated user can log out to end their session

**Independent Test**: Click logout, verify redirect to login page, verify cannot access dashboard

### Implementation for User Story 3

- [x] T019 [US3] Create `pages/dashboard.js` with ProtectedRoute wrapper (placeholder until US4), user email display per FR-013, logout button
- [x] T020 [US3] Add logout button onClick handler calling signOut from authContext in dashboard.js
- [x] T021 [US3] Add redirect to /login after signOut completes in dashboard.js

**Checkpoint**: Logout flow complete. User can end session and is redirected to login.

---

## Phase 6: User Story 4 - Route Protection (Priority: P2)

**Goal**: System prevents unauthorized access and redirects appropriately

**Independent Test**: Navigate to /dashboard while logged out - verify redirect to /login. Navigate to /login while logged in - verify redirect to /dashboard.

### Implementation for User Story 4

- [x] T022 [US4] Create `components/ProtectedRoute.jsx` per protected-route.yaml contract (uses useAuth, redirects unauthenticated to /login)
- [x] T023 [US4] Update `pages/dashboard.js` to wrap content with ProtectedRoute component
- [x] T024 [US4] Update `pages/login.js` to redirect authenticated users to /dashboard per FR-010
- [x] T025 [US4] Update `pages/index.js` to redirect based on auth state (authenticated to /dashboard, unauthenticated to /login)

**Checkpoint**: Route protection complete. All acceptance scenarios for US4 pass.

---

## Phase 7: Polish and Cross-Cutting Concerns

**Purpose**: Finalization and verification of all acceptance criteria

- [x] T026 Add auth-related CSS styles to `styles/globals.css` (form styling, button states, error messages, tabs)
- [x] T027 Verify build succeeds with `npm run build`
- [x] T028 Run quickstart.md manual testing checklist (signup, login, logout, route protection)
- [x] T029 Verify all success criteria from spec.md (SC-001 through SC-007)

---

## Dependencies and Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 and US2 are both P1 and share AuthTabs - US1 creates it, US2 uses it
  - US3 depends on US1/US2 for a logged-in user to test with
  - US4 provides protection used by US3
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Creates AuthTabs and login page
- **User Story 2 (P1)**: Depends on US1 for AuthTabs and login page structure
- **User Story 3 (P2)**: Depends on US1 or US2 for a logged-in user to log out
- **User Story 4 (P2)**: Can start after Foundational - Provides ProtectedRoute used by dashboard

### Recommended Execution Order

For a single developer:

```
T001 -> T002 (parallel possible)
-> T003 -> T004 -> T005 -> T006 -> T007
-> T008 -> T009 -> T010 -> T011 -> T012 -> T013
-> T014 -> T015 -> T016 -> T017 -> T018
-> T019 -> T020 -> T021
-> T022 -> T023 -> T024 -> T025
-> T026 -> T027 -> T028 -> T029
```

### Parallel Opportunities

**Setup Phase**:
- T001 and T002 can run in parallel

**Foundational Phase**:
- T004, T005, T006 can be written in parallel (different functions in same file)

**User Story 4 + User Story 3**:
- T022 (ProtectedRoute) can be built in parallel with T019-T021 (dashboard), then integrated

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1 (Signup)
4. Complete Phase 4: User Story 2 (Login)
5. **STOP and VALIDATE**: Users can sign up and log in

### Full Feature Delivery

1. Complete Setup + Foundational - Auth context ready
2. Add User Story 1 - Signup works
3. Add User Story 2 - Login works (MVP!)
4. Add User Story 3 - Logout works
5. Add User Story 4 - Routes protected
6. Polish - All success criteria verified

---

## Notes

- Testing is MANUAL per spec.md - no automated test tasks included
- All auth functions use Supabase SDK methods (signUp, signInWithPassword, signOut)
- Error messages must be generic per FR-006 (no email enumeration)
- Session persistence handled by Supabase SDK (FR-007)
- LoadingSpinner shared across all stories
- [P] tasks = different files, no dependencies between them
- [Story] label maps task to specific user story for traceability
