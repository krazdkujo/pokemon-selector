# Quickstart: Authentication and Login Screen

**Feature**: 002-auth-login
**Prerequisites**: Spec 001 (Project Setup) completed

## Setup Checklist

### 1. Supabase Dashboard Configuration

Before implementing, verify these settings in your Supabase project dashboard:

- [ ] **Authentication > Providers > Email**: Enabled
- [ ] **Authentication > Providers > Email > Confirm email**: DISABLED (for MVP)
- [ ] **Authentication > URL Configuration > Site URL**: Set to `http://localhost:3000`
- [ ] **Authentication > URL Configuration > Redirect URLs**: Add `http://localhost:3000/**`

### 2. Environment Variables

Verify `.env.local` has these variables (from Spec 1):

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Existing Files (from Spec 1)

These files should already exist:
- `lib/supabase.js` - Supabase client singleton
- `pages/_app.js` - App wrapper
- `pages/index.js` - Landing page
- `styles/globals.css` - Global styles

## Implementation Order

### Phase 1: Auth Context

1. Create `lib/authContext.js` with AuthProvider and useAuth hook
2. Wrap app with AuthProvider in `pages/_app.js`

### Phase 2: Components

3. Create `components/LoadingSpinner.jsx`
4. Create `components/LoginForm.jsx`
5. Create `components/SignupForm.jsx`
6. Create `components/AuthTabs.jsx`
7. Create `components/ProtectedRoute.jsx`

### Phase 3: Pages

8. Create `pages/login.js` with AuthTabs
9. Create `pages/dashboard.js` with ProtectedRoute
10. Update `pages/index.js` for auth-aware redirects

### Phase 4: Styles

11. Add auth-related styles to `styles/globals.css`

## Verification Commands

```bash
# Start development server
npm run dev

# Verify build succeeds
npm run build
```

## Manual Testing Checklist

### Signup Flow
- [ ] Navigate to `/login`
- [ ] Click "Sign Up" tab
- [ ] Enter valid email and password (6+ chars)
- [ ] Submit form
- [ ] Verify redirect to `/dashboard`
- [ ] Verify email displayed on dashboard

### Login Flow
- [ ] Log out (or use incognito)
- [ ] Navigate to `/login`
- [ ] Enter credentials from signup
- [ ] Submit form
- [ ] Verify redirect to `/dashboard`
- [ ] Refresh page - verify still logged in

### Logout Flow
- [ ] From dashboard, click "Log Out"
- [ ] Verify redirect to `/login`
- [ ] Navigate to `/dashboard` directly
- [ ] Verify redirect back to `/login`

### Error Handling
- [ ] Try signup with existing email
- [ ] Verify generic error message (no email enumeration)
- [ ] Try login with wrong password
- [ ] Verify "Invalid email or password" message
- [ ] Try login with unregistered email
- [ ] Verify same generic message

### Route Protection
- [ ] While logged out, navigate to `/dashboard`
- [ ] Verify redirect to `/login`
- [ ] While logged in, navigate to `/login`
- [ ] Verify redirect to `/dashboard`
- [ ] Navigate to `/`
- [ ] Verify redirect based on auth state

## File Structure After Implementation

```
pages/
├── _app.js              # Updated with AuthProvider
├── index.js             # Updated with auth redirects
├── login.js             # NEW
├── dashboard.js         # NEW
└── api/
    └── health.js        # Unchanged

components/
├── LoginForm.jsx        # NEW
├── SignupForm.jsx       # NEW
├── AuthTabs.jsx         # NEW
├── LoadingSpinner.jsx   # NEW
└── ProtectedRoute.jsx   # NEW

lib/
├── supabase.js          # Unchanged
├── pokemonData.js       # Unchanged
└── authContext.js       # NEW

styles/
└── globals.css          # Extended with auth styles
```

## Success Criteria Verification

| Criteria | How to Verify |
|----------|--------------|
| SC-001: Signup < 30s | Time from form load to dashboard |
| SC-002: Login < 10s | Time from credentials entered to dashboard |
| SC-003: User-friendly errors | Check error messages match contract |
| SC-004: Session persistence | Refresh page while logged in |
| SC-005: Redirect < 1s | Navigate to protected route while logged out |
| SC-006: Logout < 2s | Time from click to login page |
| SC-007: No info exposure | Verify error messages are generic |

## Troubleshooting

### "Invalid API key" error
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Restart dev server after changing `.env.local`

### Session not persisting
- Check browser localStorage for `sb-*` keys
- Verify Supabase project allows the site URL

### Redirect loops
- Clear localStorage and cookies
- Check auth state logic in index.js

### Signup not working
- Verify email provider is enabled in Supabase dashboard
- Check "Confirm email" is DISABLED for MVP
