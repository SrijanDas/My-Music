# Supabase Setup Guide

Follow these steps to set up your Supabase backend for the Music Rooms app.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
    - Name: "Music Rooms" (or any name you prefer)
    - Database Password: Choose a strong password
    - Region: Select the region closest to you
5. Click "Create new project"
6. Wait for the project to be set up (takes ~2 minutes)

## Step 2: Set Up the Database Schema

1. In your Supabase dashboard, go to the "SQL Editor" tab
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` from your project root
4. Paste it into the SQL editor
5. Click "Run" to execute the SQL
6. You should see "Success. No rows returned" message

## Step 3: Get Your API Keys

1. Go to Settings > API in your Supabase dashboard
2. Copy the following values:
    - Project URL (under "Project URL")
    - Anon key (under "Project API Keys" - the `anon` `public` key)

## Step 4: Configure Environment Variables

1. In your project root, create a `.env.local` file (if it doesn't exist)
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual Supabase URL and anon key.

## Step 5: Enable Realtime (Important!)

1. In your Supabase dashboard, go to Database > Replication
2. You should see tables: `rooms`, `room_users`, `queue_items`, `messages`
3. Enable realtime for each table by toggling the switch in the "Source" column
4. If the tables don't appear, make sure you ran the SQL schema in Step 2

## Step 6: Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Under "Auth Providers", make sure "Email" is enabled
3. Optionally configure email templates under Authentication > Email Templates
4. For development, you can disable email confirmation:
    - Go to Authentication > Settings
    - Scroll down to "Email Auth"
    - Turn off "Enable email confirmations"

## Step 7: Test the Setup

1. Make sure your `.env.local` file is configured correctly
2. Restart your development server: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000)
4. Try creating an account and signing in

## Troubleshooting

### Common Issues:

**"Invalid JWT" or authentication errors:**

-   Double-check your environment variables
-   Make sure there are no extra spaces in your `.env.local` file
-   Restart your development server after changing environment variables

**Tables not found errors:**

-   Make sure you ran the complete SQL schema
-   Check that all tables exist in Database > Tables
-   Verify RLS policies are in place

**Realtime not working:**

-   Ensure realtime is enabled for all tables in Database > Replication
-   Check browser console for WebSocket connection errors
-   Verify your Supabase project has realtime enabled

**User creation fails:**

-   Check that the `handle_new_user()` function was created
-   Verify the trigger `on_auth_user_created` exists
-   Look for errors in the Supabase logs

### Database Tables Created:

After running the schema, you should see these tables:

-   `users` - User profiles
-   `rooms` - Music rooms
-   `room_users` - Room memberships
-   `songs` - Song metadata cache
-   `queue_items` - Queue management
-   `messages` - Chat messages

### RLS Policies:

The schema includes Row Level Security policies that:

-   Allow users to read all public data
-   Restrict write operations based on user roles
-   Ensure room creators have full control over their rooms
-   Allow room members to participate in chat

If you encounter any issues, check the Supabase logs in your dashboard under Logs > Database or Logs > Auth.
