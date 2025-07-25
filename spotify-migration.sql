-- Migration to update schema from YouTube to Spotify

-- Drop the existing songs table and recreate with Spotify fields
DROP TABLE IF EXISTS public.songs CASCADE;

-- Create new songs table with Spotify integration
CREATE TABLE public.songs (
  id TEXT PRIMARY KEY,
  spotify_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  duration INTEGER NOT NULL,
  thumbnail TEXT NOT NULL,
  preview_url TEXT,
  spotify_url TEXT NOT NULL
);

-- Re-enable RLS for songs table
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- Re-create songs policies
CREATE POLICY "Anyone can view songs" ON public.songs
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert songs" ON public.songs
  FOR INSERT WITH CHECK (true);

-- Update any existing queue items and room current_song to use spotify_id
-- Note: Since we're changing from youtube_id to spotify_id, existing data will need to be migrated
-- For now, we'll clear existing data to prevent issues

-- Clear existing queue items (since they reference old song structure)
DELETE FROM public.queue_items;

-- Clear current_song from rooms (since it references old song structure)
UPDATE public.rooms SET current_song = NULL;

-- Create index for better performance
CREATE INDEX idx_songs_spotify_id ON public.songs(spotify_id);
