# Database

Supabase (PostgreSQL) — replaces MongoDB in the MERN stack.

## Setup

1. Create a project at https://supabase.com
2. Open **SQL Editor** in the Supabase dashboard
3. Paste contents of `schema.sql` and run it
4. Grab keys from **Settings → API**:
   - `Project URL` → use as `SUPABASE_URL` (both backend & frontend)
   - `anon` key → use as `VITE_SUPABASE_ANON_KEY` (frontend)
   - `service_role` key → use as `SUPABASE_SERVICE_ROLE_KEY` (backend only — never expose)

## Tables

- **habits** — user-owned habit definitions (name, icon, color, category, target)
- **checkins** — one row per habit per day completed (unique on `habit_id + date`)

Both tables have **Row Level Security** enabled — users can only read/write their own rows.
