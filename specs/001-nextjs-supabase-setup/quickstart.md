# Quickstart: Initial Project Setup and Structure

**Feature Branch**: `001-nextjs-supabase-setup`
**Date**: 2025-12-30

## Prerequisites

Before starting implementation, ensure you have:

1. **Node.js** (v18.x or later) installed
2. **npm** or **yarn** package manager
3. **Git** configured
4. **Vercel account** created at https://vercel.com
5. **Supabase project** created at https://supabase.com with:
   - Project URL (found in Settings > API)
   - Anonymous key (found in Settings > API)
   - Service role key (found in Settings > API) - keep secret

## Quick Setup

### 1. Initialize Next.js Project

```bash
npx create-next-app@14 pokemon-selector --js --no-tailwind --no-eslint --no-app --no-src-dir
cd pokemon-selector
```

Flags explained:
- `--js`: JavaScript (not TypeScript)
- `--no-tailwind`: Skip Tailwind (styling deferred)
- `--no-eslint`: Skip ESLint (can add later)
- `--no-app`: Use Pages Router (not App Router)
- `--no-src-dir`: Files at root level per constitution

### 2. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 3. Create Directory Structure

```bash
mkdir -p components lib styles public pages/api
```

Resulting structure:
```
pokemon-selector/
├── Source/           # Copy Pokemon data here
├── components/       # React components
├── lib/              # Supabase client, data utilities
├── pages/
│   ├── api/          # Serverless functions
│   ├── _app.js       # App wrapper
│   └── index.js      # Landing page
├── public/           # Static assets
├── styles/           # CSS files
├── .env.local        # Environment variables
└── .gitignore        # Git exclusions
```

### 4. Configure Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key
```

### 5. Create Core Files

**lib/supabase.js** - Supabase client singleton:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**lib/pokemonData.js** - Data access utility:
```javascript
import fs from 'fs'
import path from 'path'

const SOURCE_DIR = path.join(process.cwd(), 'Source')

export function getMetadata() {
  const filePath = path.join(SOURCE_DIR, 'metadata.json')
  const data = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(data)
}

export function getAllPokemon() {
  const filePath = path.join(SOURCE_DIR, 'pokemon', 'pokemon.json')
  const data = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(data)
}

export function getPokemonById(id) {
  const pokemon = getAllPokemon()
  return pokemon.find(p => p.id === id)
}
```

### 6. Update .gitignore

Ensure these entries exist:
```gitignore
# dependencies
node_modules/

# environment variables
.env
.env.local
.env.*.local

# next.js
.next/
out/

# misc
.DS_Store
*.pem
```

### 7. Copy Source Data

Copy the `Source/` folder containing Pokemon data to the project root.

### 8. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel

# Set environment variables in Vercel dashboard
```

Or connect GitHub repository to Vercel for automatic deployments.

## Verification Checklist

After setup, verify:

- [ ] `npm run dev` starts development server within 10 seconds
- [ ] `npm run build` completes without errors
- [ ] Browser shows landing page without console errors
- [ ] Supabase client initializes (check browser console)
- [ ] Pokemon data utility returns 1142 Pokemon
- [ ] Vercel deployment succeeds
- [ ] Production URL loads without errors

## Common Issues

### Environment Variables Not Loading

- Restart dev server after adding `.env.local`
- Verify variable names match exactly (case-sensitive)
- Check for trailing whitespace in values

### Supabase Connection Errors

- Verify project URL includes `https://`
- Check anonymous key is the correct one (not service key)
- Ensure Supabase project is active (not paused)

### Source Data Not Found

- Verify `Source/` folder is at project root
- Check file permissions allow read access
- Confirm JSON files are valid (no syntax errors)

## Next Steps

After completing this setup:

1. Proceed to **Spec 2: Login Screen** for authentication
2. Add styling framework if needed
3. Implement additional API endpoints

## Reference Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Vercel Deployment](https://vercel.com/docs)
