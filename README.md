# Music Rooms

A fullstack music listening app where users can create rooms and listen to music together in real-time sync.

## Features

-   🎵 **Real-time Music Sync**: All users listen to music in perfect synchronization
-   🏠 **Room Management**: Create and join public music rooms
-   🎮 **Creator Controls**: Room creators can play/pause, skip songs, and manage the queue
-   🔍 **Music Search**: Search and add songs from Spotify
-   💬 **Live Chat**: Chat with other users in the room
-   👥 **User Management**: See who's in the room with you
-   🎼 **Queue System**: Automatic song progression with queue management
-   🎧 **Spotify Integration**: Search tracks and play 30-second previews

## Tech Stack

-   **Frontend**: Next.js 15, TypeScript, Tailwind CSS, ShadCN UI
-   **Backend**: Supabase (Database, Authentication, Real-time)
-   **Music**: Spotify Web API for search and 30-second previews
-   **Real-time**: Supabase Realtime for live updates

## Setup Instructions

### 1. Prerequisites

-   Node.js 18+ and npm
-   A Supabase account
-   A Spotify Developer account

### 2. Spotify Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)
2. Create a new application
3. Note down your Client ID and Client Secret
4. Add `http://localhost:3000/api/auth/spotify/callback` to your Redirect URIs (if planning to implement user authentication)

### 3. Clone and Install

```bash
git clone <your-repo>
cd music-rooms
npm install
```

### 4. Spotify Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)
2. Create a new application
3. Note down your Client ID and Client Secret
4. Add `http://localhost:3000/api/auth/spotify/callback` to your Redirect URIs (if planning to implement user authentication)

### 5. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. In your Supabase dashboard, go to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql` and run it
4. Copy and paste the contents of `spotify-migration.sql` and run it to update the schema for Spotify
5. Go to Settings > API to get your project URL and anon key

### 6. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Spotify
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Authentication

-   Users must sign up/sign in to use the app
-   User accounts are managed by Supabase Auth
-   Username is stored in a custom users table

### Room Management

-   Any authenticated user can create a room
-   Rooms are public and discoverable
-   Room creators have full control over playback and queue
-   When a creator leaves, the room is deleted

### Music Playback

-   Uses Spotify Web API for music search
-   Plays 30-second previews using HTML5 audio
-   Creator controls are synchronized to all users in real-time
-   Non-creators' players automatically sync with the room state
-   Full tracks can be opened in Spotify for complete listening
-   Songs automatically advance when previews end

### Real-time Features

-   Room state (current song, play/pause, position) syncs in real-time
-   Chat messages appear instantly for all users
-   User list updates when people join/leave
-   Queue changes are reflected immediately

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page (room browser)
│   ├── room/[id]/         # Dynamic room pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # ShadCN UI components
│   ├── AuthForm.tsx      # Authentication form
│   ├── MusicPlayer.tsx   # Spotify player component
│   ├── MusicSearch.tsx   # Song search component
│   ├── Queue.tsx         # Queue management
│   ├── Chat.tsx          # Chat component
│   └── UserList.tsx      # Room user list
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Authentication state
│   └── RoomContext.tsx   # Room state management
├── lib/                  # Utilities
│   ├── supabase.ts       # Supabase client
│   ├── types.ts          # TypeScript types
│   ├── spotify.ts        # Spotify integration
│   └── spotify-search.ts # Spotify search functions
```

## Database Schema

-   **users**: User profiles extending Supabase auth
-   **rooms**: Music rooms with current playback state
-   **room_users**: Many-to-many relationship for room membership
-   **songs**: Song metadata cache
-   **queue_items**: Room queue management
-   **messages**: Chat messages

## Key Features Explained

### Real-time Synchronization

The app uses Supabase Realtime to keep all users synchronized:

-   Room state changes (play/pause, current song, position) are broadcast instantly
-   Players automatically adjust if they drift more than 2 seconds from the target time
-   Creator actions immediately update the room state for all users

### Spotify Integration

-   Uses Spotify Web API for comprehensive music search
-   Plays 30-second previews through HTML5 audio elements
-   Extracts song metadata (title, artist, duration, thumbnail, Spotify URL)
-   Automatic fallback to popular songs if search fails
-   Direct links to open full tracks in Spotify

### Permission System

-   Only room creators can control playback and manage the queue
-   Other users can only listen and chat
-   Room access is controlled through RLS (Row Level Security) policies

## Future Enhancements

-   Private rooms with invite codes
-   Playlist import/export
-   Volume controls per user
-   Song voting system
-   Mobile app with React Native
-   Full Spotify user authentication for playlist access
-   User playlists and favorites
-   DJ queue mode

## Known Issues & Solutions

### Spotify Preview Limitations

**Important Note**: Spotify only provides 30-second previews for most tracks through their Web API.

-   **Preview availability**: Not all tracks have preview URLs available
-   **Preview length**: Limited to 30 seconds maximum
-   **Full track listening**: Users need to open tracks in Spotify for complete playback

**What this means for your app:**

-   Users get a taste of songs through previews
-   Room synchronization works perfectly with available previews
-   For full listening experience, users click "Open in Spotify"

### Audio Playback

If audio doesn't play:

1. **No preview available**: Many tracks don't have preview URLs from Spotify
2. **Browser autoplay policy**: Users may need to interact with the page first
3. **Audio permissions**: Check browser audio permissions

### Spotify API Rate Limits

The app uses Spotify's client credentials flow, which has rate limits:

-   **Search requests**: Limited per hour
-   **Automatic fallback**: App provides fallback tracks if API limits are reached

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning or building your own music apps!
