# Implementation Plan: Authentication and Login Screen

**Branch**: `002-auth-login` | **Date**: 2025-12-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-auth-login/spec.md`

## Summary

Implement user authentication for the Pokemon Selector application using Supabase Auth, including signup, login, logout, and session management. The implementation will use React Context for auth state management, protected route components for access control, and integrate with the existing Supabase client from Spec 1.

## Technical Context

**Language/Version**: JavaScript (ES6+), Node.js 18+
**Primary Dependencies**: Next.js 14, React 18, @supabase/supabase-js ^2.89.0
**Storage**: Supabase PostgreSQL (user accounts managed by Supabase Auth)
**Testing**: Manual testing (per MVP scope); E2E tests deferred
**Target Platform**: Web (Vercel deployment)
**Project Type**: Web application (Next.js Pages Router)
**Performance Goals**: Login < 10s, Signup < 30s, Route redirects < 1s
**Constraints**: No email confirmation for MVP, no password reset
**Scale/Scope**: Single-user sessions, standard authentication flows

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Compliance Notes |
|-----------|--------|------------------|
| I. Source Data Authority | N/A | Auth feature does not use Pokemon data |
| II. Microservices Architecture | PASS | Auth handled by Supabase service, no custom API needed for MVP |
| III. Security First | PASS | Using Supabase Auth, NEXT_PUBLIC_* keys only in client, no email enumeration |
| IV. Modularity and Separation | PASS | Auth context in lib/, UI in components/, pages for routes |
| V. Naming Conventions | PASS | camelCase for utilities (authContext.js), PascalCase for components |

**Gate Status**: PASS - No violations, proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/002-auth-login/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
# Next.js Pages Router structure (established in Spec 1)
pages/
├── _app.js              # App wrapper with AuthProvider
├── index.js             # Landing -> redirect based on auth
├── login.js             # Login/Signup page (NEW)
├── dashboard.js         # Protected dashboard (NEW)
└── api/
    └── health.js        # Existing health endpoint

components/
├── LoginForm.jsx        # Login form component (NEW)
├── SignupForm.jsx       # Signup form component (NEW)
├── AuthTabs.jsx         # Tab switcher for login/signup (NEW)
├── LoadingSpinner.jsx   # Loading indicator (NEW)
└── ProtectedRoute.jsx   # Route protection HOC (NEW)

lib/
├── supabase.js          # Existing Supabase client
├── pokemonData.js       # Existing Pokemon data utilities
└── authContext.js       # Auth state management (NEW)

styles/
└── globals.css          # Existing global styles (extend for auth)
```

**Structure Decision**: Extending existing Next.js Pages Router structure from Spec 1. Auth components added to `/components/`, auth context to `/lib/`, new pages for login and dashboard.

## Complexity Tracking

> No constitution violations - table not required.
