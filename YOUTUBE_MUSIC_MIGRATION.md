# Migration from Spotify to YouTube Music API

This document outlines the complete migration from Spotify Web API to YouTube Music API.

## Changes Made

### 1. Dependencies Updated

-   **Removed**: `spotify-web-api-node`, `@types/spotify-api`, `@types/spotify-web-api-node`
-   **Kept**: `ytmusic-api` (was already installed)

### 2. Library Files

-   **Removed**: `src/lib/spotify.ts`, `src/lib/spotify-search.ts`
-   **Added**: `src/lib/ytmusic.ts`, `src/lib/ytmusic-search.ts`

### 3. Hooks

-   **Removed**: `src/hooks/useSpotifyPlayer.ts`
-   **Added**: `src/hooks/useYTMusicPlayer.ts` (uses YouTube IFrame API)

### 4. Type Definitions Updated

**File**: `src/lib/types.ts`

-   Changed `spotify_id` → `youtube_id`
-   Removed `preview_url` (YouTube provides full songs)
-   Changed `spotify_url` → `youtube_url`

### 5. Components Updated

**File**: `src/components/MusicSearch.tsx`

-   Updated imports to use YouTube Music API
-   Changed search placeholder text
-   Updated track handling to use YouTube metadata
-   Changed "Open in Spotify" → "Open in YouTube"

**File**: `src/components/MusicPlayer.tsx`

-   Updated imports to use YouTube Music player
-   Replaced HTML5 audio with YouTube embedded player
-   Updated synchronization logic for full-length tracks
-   Changed "Open in Spotify" → "Open in YouTube"

### 6. Database Schema

**File**: `youtube-music-migration.sql`

-   Added `youtube_url` column to songs table
-   Removed Spotify-specific columns if they existed
-   Updated existing records to have proper YouTube URLs

### 7. Documentation

**File**: `README.md`

-   Updated all references from Spotify to YouTube Music
-   Removed Spotify API setup instructions
-   Updated feature descriptions to reflect full song playback
-   Updated troubleshooting sections

## Key Improvements

### From Spotify Web API to YouTube Music API:

1. **Full Song Playback**: No more 30-second preview limitations
2. **Better Availability**: YouTube has a larger music catalog
3. **No API Keys Required**: YouTube Music API doesn't require client credentials
4. **Better User Experience**: Users can listen to complete songs

### Technical Benefits:

1. **Simplified Setup**: No need for Spotify Developer account
2. **Better Sync**: Full-length tracks allow for better room synchronization
3. **Embedded Player**: YouTube's embedded player provides robust playback controls
4. **Rate Limits**: YouTube Music API has generous rate limits

## Migration Steps for Existing Installations

1. **Update Dependencies**:

    ```bash
    npm uninstall spotify-web-api-node @types/spotify-api @types/spotify-web-api-node
    npm install ytmusic-api
    ```

2. **Update Environment Variables**:
   Remove Spotify-related environment variables from `.env.local`:

    ```diff
    - NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
    - SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    ```

3. **Run Database Migration**:
   Execute `youtube-music-migration.sql` in your Supabase SQL editor

4. **Update Codebase**:
   Pull the latest changes with all the updated files

5. **Test the Application**:
    - Search for songs using YouTube Music
    - Verify full song playback
    - Test room synchronization

## Files Modified

### Removed Files:

-   `src/lib/spotify.ts`
-   `src/lib/spotify-search.ts`
-   `src/hooks/useSpotifyPlayer.ts`

### Added Files:

-   `src/lib/ytmusic.ts`
-   `src/lib/ytmusic-search.ts`
-   `src/hooks/useYTMusicPlayer.ts`
-   `youtube-music-migration.sql`

### Modified Files:

-   `package.json`
-   `src/lib/types.ts`
-   `src/components/MusicSearch.tsx`
-   `src/components/MusicPlayer.tsx`
-   `README.md`

## Testing Checklist

-   [ ] Search for songs works correctly
-   [ ] Songs play full-length (not just previews)
-   [ ] Room synchronization works with full tracks
-   [ ] Multiple users can join and sync playback
-   [ ] Queue management works correctly
-   [ ] "Open in YouTube" links work
-   [ ] Error handling works properly
-   [ ] Fallback songs display when search fails

The migration is now complete and the application should work with YouTube Music API providing a much better user experience with full song playback!
