# Research: Authentication and Login Screen

**Feature**: 002-auth-login
**Date**: 2025-12-30
**Purpose**: Resolve technical decisions and document best practices for Supabase Auth implementation

## Research Topics

### 1. Supabase Auth Client-Side Integration

**Decision**: Use `@supabase/supabase-js` client-side auth methods with React Context

**Rationale**:
- Supabase JS SDK provides `signUp()`, `signInWithPassword()`, `signOut()` methods
- `onAuthStateChange()` listener enables reactive auth state management
- Session tokens automatically managed via cookies/localStorage by SDK
- No custom API endpoints needed for basic email/password auth

**Alternatives Considered**:
- Server-side auth with API routes: Rejected - adds complexity without benefit for MVP
- NextAuth.js: Rejected - Supabase has native auth, adding NextAuth creates redundancy
- Custom JWT implementation: Rejected - reinventing wheel, security risks

**Implementation Pattern**:
```javascript
// lib/authContext.js
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

### 2. Session Persistence Strategy

**Decision**: Use Supabase default session persistence (localStorage + automatic refresh)

**Rationale**:
- Supabase SDK automatically persists sessions to localStorage
- Automatic token refresh before expiration (default 1 hour tokens)
- `getSession()` restores session on page load
- Cross-tab session sync via storage events

**Alternatives Considered**:
- Cookie-only storage: Rejected - requires server-side session management
- Custom session handling: Rejected - Supabase handles this well
- No persistence: Rejected - violates FR-007 (session persistence requirement)

**Configuration Notes**:
- Default session duration: 1 week (Supabase default)
- Token refresh: Automatic before expiration
- No additional configuration needed for MVP

### 3. Protected Route Implementation

**Decision**: Use Higher-Order Component (HOC) pattern with redirect

**Rationale**:
- HOC pattern is simple and explicit
- Works with Next.js Pages Router
- No additional dependencies required
- Easy to test and understand

**Alternatives Considered**:
- Middleware (Next.js 12+): Rejected - adds complexity, server-side session validation needed
- Route guards in _app.js: Rejected - less explicit, harder to maintain
- getServerSideProps auth check: Rejected - requires server-side session handling

**Implementation Pattern**:
```javascript
// components/ProtectedRoute.jsx
import { useAuth } from '../lib/authContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  if (loading) return <LoadingSpinner />
  if (!user) return null

  return children
}
```

### 4. Error Message Security

**Decision**: Generic error messages that do not reveal email existence

**Rationale**:
- FR-006 requires no email enumeration
- Security best practice to prevent account discovery attacks
- Supabase returns specific errors that must be mapped to generic messages

**Error Mapping**:
| Supabase Error | User-Facing Message |
|---------------|---------------------|
| Invalid login credentials | "Invalid email or password" |
| User already registered | "Unable to create account. Please try again or use a different email." |
| Email not confirmed | "Invalid email or password" (treat as invalid for MVP) |
| Network error | "Connection error. Please check your internet and try again." |

**Implementation Pattern**:
```javascript
function getAuthErrorMessage(error) {
  const message = error?.message?.toLowerCase() || ''

  if (message.includes('invalid login credentials')) {
    return 'Invalid email or password'
  }
  if (message.includes('user already registered')) {
    return 'Unable to create account. Please try again or use a different email.'
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'Connection error. Please check your internet and try again.'
  }
  return 'An error occurred. Please try again.'
}
```

### 5. Form Validation Approach

**Decision**: Client-side validation with HTML5 + minimal JavaScript

**Rationale**:
- Email format: HTML5 `type="email"` + pattern validation
- Password minimum: HTML5 `minLength` attribute
- Simple, no additional dependencies
- Immediate feedback before API call

**Alternatives Considered**:
- Form libraries (Formik, React Hook Form): Rejected - overkill for 2 simple forms
- Validation libraries (Yup, Zod): Rejected - adds dependencies for simple rules
- Server-only validation: Rejected - poor UX, unnecessary round trips

**Validation Rules**:
- Email: Required, valid email format
- Password: Required, minimum 6 characters (Supabase default)

### 6. Loading State Management

**Decision**: Component-level loading states with shared spinner component

**Rationale**:
- Each form manages its own loading state during submission
- Auth context provides global loading during session restoration
- Shared LoadingSpinner component for consistency

**Loading States**:
1. **Initial load**: AuthContext loading while checking session
2. **Form submission**: Button disabled, spinner shown during API call
3. **Route transition**: ProtectedRoute shows spinner while checking auth

## Supabase Auth Configuration

### Required Supabase Dashboard Settings

1. **Authentication > Providers > Email**:
   - Enable email provider: YES
   - Confirm email: NO (disabled for MVP)
   - Minimum password length: 6 characters

2. **Authentication > URL Configuration**:
   - Site URL: `http://localhost:3000` (dev) / production URL
   - Redirect URLs: `http://localhost:3000/**`

3. **Environment Variables** (already configured in Spec 1):
   ```
   NEXT_PUBLIC_SUPABASE_URL=<project-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
   ```

## Dependencies

No new dependencies required - using existing `@supabase/supabase-js` from Spec 1.

## Edge Case Handling

| Edge Case | Handling Strategy |
|-----------|------------------|
| Session expires on protected page | onAuthStateChange fires, redirect to login |
| Network error during auth | Show error message, allow retry |
| Supabase service unavailable | Show error message, allow retry |
| Cookies disabled | Supabase falls back to memory storage (session lost on refresh) |
| Multi-tab logout | Storage event propagates, onAuthStateChange fires in other tabs |

## References

- [Supabase Auth JavaScript Client](https://supabase.com/docs/reference/javascript/auth-signup)
- [Supabase Auth with React](https://supabase.com/docs/guides/auth/quickstarts/react)
- [Next.js Pages Router Auth Patterns](https://nextjs.org/docs/pages/building-your-application/authentication)
