# pokemon selector Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-30

## Active Technologies
- JavaScript (Node.js 18.x+) + Next.js 14.x, React 18.x, @supabase/supabase-js 2.x (001-nextjs-supabase-setup)
- Supabase PostgreSQL (connection only), Local JSON files (Source folder) (001-nextjs-supabase-setup)
- JavaScript (ES6+), Node.js 18+ + Next.js 14, React 18, @supabase/supabase-js ^2.89.0 (002-auth-login)
- Supabase PostgreSQL (user accounts managed by Supabase Auth) (002-auth-login)
- JavaScript (ES6+), Node.js 18+ + Next.js 14.x, React 18.x, @supabase/supabase-js ^2.89.0 (003-pokemon-generator)
- Local JSON files in `Source/` folder (read-only), Supabase PostgreSQL (future user collection storage) (003-pokemon-generator)
- Supabase PostgreSQL (new `player_pokemon` table) (004-starter-selection)
- JavaScript (ES6+), Node.js 18.x+ + Next.js 14.2.0, React 18.2.0, @supabase/supabase-js 2.89.0 (005-pokemon-collection-view)
- Supabase PostgreSQL (player_pokemon table), Local JSON files (Source/ folder - read-only) (005-pokemon-collection-view)

## Project Structure

```text
pages/           # Next.js pages and API routes
components/      # React components
lib/             # Shared utilities (supabase.js, pokemonData.js, authContext.js)
styles/          # Global CSS
Source/          # Pokemon data JSON files (read-only)
```

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
```

## Code Style

- JavaScript (ES6+): Follow standard conventions
- Components: PascalCase (e.g., LoginForm.jsx)
- Utilities: camelCase (e.g., authContext.js)
- API routes: kebab-case (e.g., generate-pokemon.js)

## Recent Changes
- 006-move-ability-tooltips: Added JavaScript (ES6+), Node.js 18+ + Next.js 14.x, React 18.x, @supabase/supabase-js ^2.89.0
- 005-pokemon-collection-view: Added JavaScript (ES6+), Node.js 18.x+ + Next.js 14.2.0, React 18.2.0, @supabase/supabase-js 2.89.0
- 004-starter-selection: Added JavaScript (ES6+), Node.js 18+ + Next.js 14, React 18, @supabase/supabase-js ^2.89.0

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
