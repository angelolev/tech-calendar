# Tech Calendar - Supabase Setup Instructions

## What's Been Done ✓

1. **Updated package.json** - Supabase package upgraded from 2.49.4 → 2.90.1
2. **Created SQL setup script** - `supabase-setup.sql` with database schema and RLS policies

## What You Need To Do

### Step 1: Install Dependencies
```bash
pnpm install
```
> Make sure no dev server is running and close your IDE if you get file locking errors.

### Step 2: Update Environment Variables

**Get your new Supabase credentials:**
1. Go to your Supabase Dashboard
2. Navigate to **Settings → API**
3. Copy the **Project URL** and **anon public key**

**Update `.env` file with your new credentials:**
```env
# Supabase credentials
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key-here"
```

### Step 3: Set Up Database

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the sidebar
3. Click **New Query**
4. Open `supabase-setup.sql` from this project
5. Copy all the SQL code
6. Paste it into the Supabase SQL Editor
7. Click **Run** (or press Ctrl/Cmd + Enter)

**What this script does:**
- Creates the `events` table with columns: id, name, link, whatsapp, date, created_at
- Adds an index on the date column for faster queries
- Enables Row Level Security (RLS)
- Creates policies for public read and write access

### Step 4: Verify Setup

**In Supabase Dashboard:**
1. Go to **Table Editor**
2. Verify `events` table exists
3. Check that RLS is enabled (green badge)
4. Go to **Authentication → Policies**
5. Verify two policies exist:
   - "Allow public read access"
   - "Allow public insert access"

**In Your Application:**
1. Start the dev server: `pnpm dev`
2. Open browser console (F12)
3. Check for connection errors
4. Try creating a test event
5. Verify it appears in Supabase Table Editor

## Database Schema

The `events` table maps to your `Registry` interface:

| Database Column | TypeScript Type | Description |
|----------------|-----------------|-------------|
| id             | string (UUID)   | Auto-generated unique identifier |
| name           | string          | Event name |
| link           | string          | Event URL |
| whatsapp       | string          | WhatsApp group link |
| date           | Date            | Event date |
| created_at     | Date            | Timestamp (auto-generated) |

## Security Notes

**Current Setup:**
- ✅ RLS is enabled (security feature active)
- ✅ Public read access (anyone can view events)
- ✅ Public insert access (anyone can create events)

**To Restrict Access:**

If you want only authenticated users to access the data:

1. Go to Supabase Dashboard → SQL Editor
2. Run this SQL:
```sql
-- Remove public policies
DROP POLICY IF EXISTS "Allow public read access" ON events;
DROP POLICY IF EXISTS "Allow public insert access" ON events;

-- Add authenticated-only policies
CREATE POLICY "Allow authenticated read access"
  ON events FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated insert access"
  ON events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
```

3. You'll also need to implement authentication in your app
   - See: https://supabase.com/docs/guides/auth

## Troubleshooting

**"Failed to fetch" errors:**
- Verify `.env` has correct credentials
- Check Supabase project is not paused (Dashboard shows status)
- Verify table name is `events` (not `registries`)

**"Row Level Security" errors:**
- Check policies exist in Dashboard → Authentication → Policies
- Verify policies use `USING (true)` for public access
- Try disabling RLS temporarily to test: `ALTER TABLE events DISABLE ROW LEVEL SECURITY;`

**No data showing up:**
- Check browser console for errors
- Verify data exists: Supabase Dashboard → Table Editor → events
- Check date format conversions in `src/App.tsx`

## Resources

- [Supabase JavaScript Docs](https://supabase.com/docs/reference/javascript/installing)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Latest npm package info](https://www.npmjs.com/package/@supabase/supabase-js)

---

**Need help?** Check the browser console for detailed error messages or review the verification steps in the plan file.
