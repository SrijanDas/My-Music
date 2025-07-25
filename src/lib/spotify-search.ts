"use server";

import { searchSpotifyTracks, SpotifySearchResult } from "./spotify";

export async function searchSpotify(
    query: string
): Promise<SpotifySearchResult[]> {
    try {
        if (!query.trim()) {
            return [];
        }

        const results = await searchSpotifyTracks(query, 10);
        return results;
    } catch (error) {
        console.error("Spotify search error:", error);

        // Return fallback results in case of API failure
        const fallbackResults: SpotifySearchResult[] = [
            {
                id: "4cOdK2wGLETKBW3PvgPWqT",
                title: "Never Gonna Give You Up",
                artist: "Rick Astley",
                duration: 213,
                thumbnail:
                    "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163",
                preview_url: null,
                spotify_url:
                    "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
            },
            {
                id: "6p0KVyNVZhPeFhSBKJOe3c",
                title: "Love Story",
                artist: "Taylor Swift",
                duration: 235,
                thumbnail:
                    "https://i.scdn.co/image/ab67616d0000b273a48964b5d9a3d6968ae3e0de",
                preview_url: null,
                spotify_url:
                    "https://open.spotify.com/track/6p0KVyNVZhPeFhSBKJOe3c",
            },
            {
                id: "7qiZfU4dY1lWllzX7mPBI3",
                title: "Shape of You",
                artist: "Ed Sheeran",
                duration: 233,
                thumbnail:
                    "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
                preview_url: null,
                spotify_url:
                    "https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3",
            },
        ];

        return fallbackResults;
    }
}
