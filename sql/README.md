# SQL Migrations

SQL files to run in the Supabase SQL Editor.

## How to Use

1. Open your Supabase project dashboard
2. Go to **SQL Editor** in the left sidebar
3. Copy and paste the contents of each file
4. Run them in numerical order (001, 002, etc.)

## Files

| File | Feature | Description |
|------|---------|-------------|
| 001-player-pokemon-table.sql | 004-starter-selection | Creates player_pokemon table for tracking owned Pokemon with roster slots and storage |

## Notes

- Files are numbered to indicate execution order
- Each file includes a header describing what it does
- Always run in a development/staging environment first before production
