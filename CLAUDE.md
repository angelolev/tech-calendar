# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tech Calendar is a React + TypeScript + Vite application for managing tech events. It uses Supabase for backend services (authentication, database) and features a calendar interface where users can view events and admins can create/edit them. Users can express interest in events.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4.x with custom CSS variables
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Icons**: Lucide React
- **Auth**: Google OAuth via Supabase Auth

## Common Commands

```bash
# Development
pnpm dev              # Start dev server (default: http://localhost:5173)

# Build & Preview
pnpm build            # Type-check and build for production
pnpm preview          # Preview production build locally

# Linting
pnpm lint             # Run ESLint on all files
```

## Architecture

### Authentication & Authorization

- **AuthContext** (`src/contexts/AuthContext.tsx`): Provides authentication state throughout the app
  - Manages user, profile, and session state
  - Exposes `isAdmin` flag for role-based access control
  - Provides `signInWithGoogle()` and `signOut()` methods
- **Role-based access**: Two roles exist (`user` and `admin`)
  - Only admins can create, edit, and delete events
  - All users can view events and express interest
  - Enforced at both UI level (via `isAdmin` check) and database level (via RLS policies)

### Database Schema

The app uses three main tables in Supabase:

1. **profiles**: User profiles linked to auth.users
   - Fields: id (UUID, FK to auth.users), email, full_name, avatar_url, role
   - Automatically created via trigger when user signs up
   - Role defaults to 'user'

2. **events**: Calendar events
   - Fields: id, name, date, link, whatsapp, created_by, created_at, updated_at
   - RLS policies restrict create/update/delete to admins only

3. **event_interests**: Many-to-many relationship between users and events
   - Fields: id, user_id (FK to profiles), event_id (FK to events)
   - Users can toggle interest in events

### Data Flow

1. **Event Loading**:
   - `App.tsx` fetches events with nested `event_interests` and `profiles` using Supabase joins
   - Dates are stored as ISO strings (YYYY-MM-DD) in Supabase
   - Dates are parsed to local timezone using `parseISODateLocal()` helper to avoid UTC shifts

2. **Event Creation/Update**:
   - Uses `useEventActions` hook with `createEvent()` and `updateEvent()` methods
   - Date objects are converted to ISO strings before sending to Supabase
   - Admin-only operations (validated in both UI and RLS policies)

3. **Interest Management**:
   - Uses `useEventInterest` hook per event
   - Manages `isInterested` state and list of interested users
   - Users can toggle interest via `toggleInterest()` method

### Components Structure

- **App.tsx**: Main calendar view with month navigation
- **Navbar**: Displays user info and auth button
- **DayCard**: Individual calendar day cell showing date and event badges
- **RegistryModal**: Form to create/edit events (admin only)
- **RegistryDetailsModal**: View event details and toggle interest
- **InterestButton**: Shows interested users and allows toggling interest
- **DatePicker**: Custom date picker component
- **AuthButton**: Google sign-in/sign-out button
- **AvatarStack**: Displays stacked user avatars

### Styling

- Uses Tailwind CSS 4.x with `@tailwindcss/vite` plugin
- Custom CSS variables defined in `src/index.css` for consistent theming
- Color palette: lavender (#5a6aa8), rose, blue-mist, sage, cream, peach, lilac
- Custom animations: fadeInUp, scaleIn, shimmer
- Fonts: "Source Serif 4" for headings, "Archivo" for body text

## Environment Variables

Required in `.env` file:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key

## Database Setup

Run `supabase-setup.sql` in Supabase SQL Editor to:
1. Create tables (profiles, events, event_interests)
2. Set up RLS policies
3. Create triggers for auto-profile creation and updated_at
4. Enable Google OAuth in Supabase Auth settings

To make a user admin: `SELECT make_user_admin('email@example.com');`

## Important Patterns

1. **Date Handling**: Always use `parseISODateLocal()` when converting from Supabase ISO strings to avoid timezone issues
2. **Type Safety**: Registry type includes `interested_users: Profile[]` populated from join query
3. **Error Handling**: Operations show alerts on error (consider improving UX)
4. **Loading States**: Track loading with `isLoading`, `isDeleting`, `isUpdating`, `isCreating` flags
5. **Modal Management**: Multiple modal states managed in App.tsx (selectedDate, editingRegistry, selectedRegistry)
