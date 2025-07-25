# Spotify Integration Setup

This document explains how to set up Spotify integration for the Music Rooms application.

## Overview

The app uses Spotify Web API with the Client Credentials flow to:

-   Search for tracks
-   Get track metadata (title, artist, duration, thumbnail)
-   Access 30-second preview URLs
-   Provide direct links to Spotify

## Spotify Developer Account Setup

### 1. Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in the details:
    - **App Name**: Music Rooms (or your preferred name)
    - **App Description**: A collaborative music listening application
    - **Website**: Your website URL (can be localhost for development)
    - **Redirect URI**: `http://localhost:3000/api/auth/spotify/callback` (for development)

### 2. Get Your Credentials

After creating the app:

1. Click on your app in the dashboard
2. Go to "Settings"
3. Note down:
    - **Client ID** (visible to everyone)
    - **Client Secret** (keep this private!)

## Environment Configuration

Add these variables to your `.env.local` file:

```env
# Spotify API Configuration
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## API Usage

### Client Credentials Flow

The app uses the Client Credentials flow, which:

-   Doesn't require user login
-   Provides access to public track data
-   Has rate limits based on your app registration
-   Cannot access user-specific data (playlists, saved tracks)

### Rate Limits

Spotify API has rate limits:

-   **Requests per second**: 100
-   **Daily requests**: Varies by app
-   **Search requests**: Limited but generous for most use cases

The app handles rate limiting gracefully with:

-   Automatic token refresh
-   Fallback tracks when limits are reached
-   Error handling for failed requests

## Features & Limitations

### What Works

✅ Search tracks by name, artist, album
✅ Get track metadata (title, artist, duration)
✅ Access album artwork/thumbnails
✅ 30-second preview URLs (when available)
✅ Direct Spotify links for full tracks
✅ Real-time search results

### Limitations

❌ No full-length track playback (only 30-second previews)
❌ No user authentication features
❌ No access to user playlists
❌ Not all tracks have preview URLs
❌ Preview quality is determined by Spotify

## Upgrading to User Authentication

If you want to add user authentication in the future:

1. **Update App Settings**: Add proper redirect URIs in Spotify Dashboard
2. **Add Scopes**: Request permissions like `user-read-private`, `playlist-read-private`
3. **Implement OAuth Flow**: Use Authorization Code flow instead of Client Credentials
4. **Update API Calls**: Use user access tokens for personalized features

### Required Scopes for User Features

-   `user-read-private`: User profile information
-   `playlist-read-private`: User's private playlists
-   `playlist-read-collaborative`: User's collaborative playlists
-   `user-library-read`: User's saved tracks

## Troubleshooting

### Common Issues

**"Invalid client credentials"**

-   Check your Client ID and Client Secret
-   Make sure they're correctly set in environment variables
-   Verify the secret is not exposed in client-side code

**"Rate limit exceeded"**

-   Wait before making more requests
-   The app automatically handles token refresh
-   Consider implementing request caching

**"No preview available"**

-   This is normal - not all tracks have previews
-   The app handles this gracefully
-   Users can still see track info and open in Spotify

**"Search returns no results"**

-   Check your search query
-   Verify API credentials are working
-   Some regions may have limited track availability

### Testing Your Setup

1. Start your development server: `npm run dev`
2. Navigate to a room
3. Try searching for popular tracks like "Shape of You Ed Sheeran"
4. Verify that:
    - Search results appear
    - Track metadata loads
    - Preview URLs work (when available)
    - Spotify links open correctly

## Migration from YouTube

The app has been fully migrated from YouTube to Spotify:

### What Changed

-   **Search**: Now uses Spotify Web API instead of YouTube search
-   **Player**: HTML5 audio instead of YouTube iframe
-   **Metadata**: Spotify track data instead of YouTube video data
-   **Database**: Updated schema to store Spotify IDs and URLs

### Data Migration

-   Old YouTube data will be cleared during migration
-   Users will need to rebuild their queues
-   Room states will reset to empty

## Security Considerations

-   **Client Secret**: Never expose in client-side code
-   **Environment Variables**: Keep `.env.local` out of version control
-   **Rate Limiting**: Implement reasonable request caching
-   **CORS**: Configure properly for production deployment

## Production Deployment

When deploying to production:

1. **Update Redirect URIs**: Add your production domain to Spotify app settings
2. **Environment Variables**: Set all required env vars in your hosting platform
3. **Rate Limiting**: Monitor usage and consider implementing caching
4. **Error Handling**: Ensure graceful degradation when API is unavailable
