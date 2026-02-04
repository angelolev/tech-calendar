-- ===================================================================
-- MIGRATION: Fix event_interests foreign key relationship
-- ===================================================================
-- This migration fixes the PGRST200 error by changing the foreign key
-- in event_interests table from auth.users to profiles table.
--
-- Error being fixed:
-- "Could not find a relationship between 'event_interests' and 'user_id'"
--
-- Execute this in Supabase Dashboard > SQL Editor
-- ===================================================================

-- Step 1: Drop the existing foreign key constraint
ALTER TABLE event_interests
DROP CONSTRAINT IF EXISTS event_interests_user_id_fkey;

-- Step 2: Add new foreign key constraint pointing to profiles
ALTER TABLE event_interests
ADD CONSTRAINT event_interests_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- ===================================================================
-- Verification
-- ===================================================================
-- After running this migration:
-- 1. Refresh your browser
-- 2. Check the console - the PGRST200 error should be gone
-- 3. Events should load with interested users data
-- ===================================================================
