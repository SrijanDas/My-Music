-- Migration: Update songs table for YouTube Music API
-- This migration ensures the table has the correct YouTube Music columns

DO $$
BEGIN
    -- Add youtube_id column if it doesn't exist (for tables that only have spotify_id)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'songs' AND column_name = 'youtube_id') THEN
        ALTER TABLE public.songs ADD COLUMN youtube_id TEXT;
    END IF;
    
    -- Add youtube_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'songs' AND column_name = 'youtube_url') THEN
        ALTER TABLE public.songs ADD COLUMN youtube_url TEXT;
    END IF;
    
    -- If we have spotify_id but no youtube_id, we need to migrate the data
    -- For now, we'll just set youtube_id = id (the song ID) as a placeholder
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'songs' AND column_name = 'spotify_id') 
       AND NOT EXISTS (SELECT 1 FROM public.songs WHERE youtube_id IS NOT NULL) THEN
        UPDATE public.songs SET youtube_id = id WHERE youtube_id IS NULL;
    END IF;
    
    -- Update existing songs to have youtube_url based on youtube_id
    UPDATE public.songs 
    SET youtube_url = 'https://www.youtube.com/watch?v=' || youtube_id 
    WHERE youtube_url IS NULL AND youtube_id IS NOT NULL;
    
    -- Remove Spotify-specific columns if they exist
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'songs' AND column_name = 'spotify_id') THEN
        ALTER TABLE public.songs DROP COLUMN spotify_id;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'songs' AND column_name = 'preview_url') THEN
        ALTER TABLE public.songs DROP COLUMN preview_url;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'songs' AND column_name = 'spotify_url') THEN
        ALTER TABLE public.songs DROP COLUMN spotify_url;
    END IF;
    
    -- Make youtube_id and youtube_url NOT NULL and UNIQUE after updating existing records
    -- But only if we have data
    IF EXISTS (SELECT 1 FROM public.songs) THEN
        -- Only set NOT NULL if all records have values
        IF NOT EXISTS (SELECT 1 FROM public.songs WHERE youtube_id IS NULL) THEN
            ALTER TABLE public.songs ALTER COLUMN youtube_id SET NOT NULL;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM public.songs WHERE youtube_url IS NULL) THEN
            ALTER TABLE public.songs ALTER COLUMN youtube_url SET NOT NULL;
        END IF;
    ELSE
        -- If table is empty, we can safely set NOT NULL
        ALTER TABLE public.songs ALTER COLUMN youtube_id SET NOT NULL;
        ALTER TABLE public.songs ALTER COLUMN youtube_url SET NOT NULL;
    END IF;
    
    -- Add unique constraint on youtube_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'songs' AND constraint_type = 'UNIQUE' 
                   AND constraint_name LIKE '%youtube_id%') THEN
        ALTER TABLE public.songs ADD CONSTRAINT songs_youtube_id_unique UNIQUE (youtube_id);
    END IF;
    
END $$;
