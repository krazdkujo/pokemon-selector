# Data Model: Authentication and Login Screen

**Feature**: 002-auth-login
**Date**: 2025-12-30

## Overview

This feature uses Supabase Auth for user management. Supabase manages the `auth.users` table internally - we do not create custom user tables for authentication. This document describes the logical entities from the application's perspective.

## Entities

### User (Supabase Managed)

Supabase Auth manages user accounts in the `auth.users` system table. Application code interacts via the Supabase Auth API, not direct database queries.

**Accessible Fields** (via `supabase.auth.getUser()`):

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique user identifier |
| email | string | User's email address |
| created_at | timestamp | Account creation time |
| last_sign_in_at | timestamp | Most recent login time |
| email_confirmed_at | timestamp | Email verification time (null for MVP) |

**Application Does NOT Access**:
- Password (hashed, stored internally by Supabase)
- Auth tokens (managed by SDK)
- Refresh tokens (managed by SDK)

### Session (Supabase Managed)

Sessions are managed entirely by the Supabase SDK. Application code observes session state via the Auth Context.

**Session Object** (via `supabase.auth.getSession()`):

| Field | Type | Description |
|-------|------|-------------|
| access_token | string | JWT for API authentication |
| refresh_token | string | Token for session refresh |
| expires_at | number | Unix timestamp of token expiration |
| user | User | Associated user object |

**Session Lifecycle**:
1. Created on successful login/signup
2. Automatically refreshed before expiration
3. Destroyed on logout or expiration
4. Persisted to localStorage by SDK

### AuthState (Application State)

Application-level authentication state managed by React Context.

**State Shape**:

```typescript
interface AuthState {
  user: User | null       // Current authenticated user or null
  loading: boolean        // True during session check/auth operations
  error: string | null    // Last error message for display
}
```

**State Transitions**:

```
[Initial] --getSession()--> [Loading]
[Loading] --session found--> [Authenticated]
[Loading] --no session--> [Unauthenticated]
[Unauthenticated] --signIn success--> [Authenticated]
[Unauthenticated] --signUp success--> [Authenticated]
[Authenticated] --signOut--> [Unauthenticated]
[Authenticated] --session expires--> [Unauthenticated]
```

## Data Flow

### Signup Flow

```
User Input (email, password)
    |
    v
Client Validation (email format, password length)
    |
    v
supabase.auth.signUp({ email, password })
    |
    +--[success]--> Session Created --> User Redirected to Dashboard
    |
    +--[error]--> Error Message Displayed
```

### Login Flow

```
User Input (email, password)
    |
    v
Client Validation (required fields)
    |
    v
supabase.auth.signInWithPassword({ email, password })
    |
    +--[success]--> Session Created --> User Redirected to Dashboard
    |
    +--[error]--> Generic Error Message Displayed
```

### Logout Flow

```
User Clicks Logout
    |
    v
supabase.auth.signOut()
    |
    v
Session Destroyed --> onAuthStateChange fires --> User Redirected to Login
```

### Session Restoration Flow

```
Page Load
    |
    v
supabase.auth.getSession()
    |
    +--[session exists]--> User set in context --> Protected routes accessible
    |
    +--[no session]--> User null --> Redirect to login if on protected route
```

## Validation Rules

### Email

| Rule | Implementation | Error Message |
|------|----------------|---------------|
| Required | HTML5 required attribute | "Email is required" |
| Valid format | HTML5 type="email" + pattern | "Please enter a valid email address" |

### Password

| Rule | Implementation | Error Message |
|------|----------------|---------------|
| Required | HTML5 required attribute | "Password is required" |
| Minimum 6 chars | HTML5 minLength="6" | "Password must be at least 6 characters" |

## Database Schema

No custom database tables are created for this feature. All authentication data is managed by Supabase Auth's internal schema.

**Future Consideration**: When user profiles or application-specific user data is needed (e.g., Pokemon teams, preferences), a `public.profiles` table would be created with:
- `id` (UUID, foreign key to auth.users.id)
- Application-specific fields

This is OUT OF SCOPE for the current feature.

## Security Considerations

1. **Password Storage**: Handled by Supabase (bcrypt hashing)
2. **Session Tokens**: JWTs with 1-hour expiration, auto-refresh
3. **Token Storage**: localStorage (Supabase SDK default)
4. **CORS**: Handled by Supabase project configuration
5. **Rate Limiting**: Handled by Supabase at infrastructure level
