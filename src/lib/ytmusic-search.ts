"use server";

import { initializeYTMusic, YTMusicSearchResult } from "./ytmusic";

export async function searchYTMusic(
    query: string
): Promise<YTMusicSearchResult[]> {
    try {
        if (!query.trim()) {
            return [];
        }

        const results = await searchYTMusicTracks(query, 10);
        return results;
    } catch (error) {
        console.error("YouTube Music search error:", error);

        // Return fallback results in case of API failure
        const fallbackResults: YTMusicSearchResult[] = [
            {
                id: "dQw4w9WgXcQ",
                title: "Never Gonna Give You Up",
                artist: "Rick Astley",
                duration: 213,
                thumbnail:
                    "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
                youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                id: "9bZkp7q19f0",
                title: "Gangnam Style",
                artist: "PSY",
                duration: 252,
                thumbnail:
                    "https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg",
                youtube_url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
            },
            {
                id: "L_jWHffIx5E",
                title: "Smells Like Teen Spirit",
                artist: "Nirvana",
                duration: 301,
                thumbnail:
                    "https://i.ytimg.com/vi/L_jWHffIx5E/maxresdefault.jpg",
                youtube_url: "https://www.youtube.com/watch?v=L_jWHffIx5E",
            },
        ];

        return fallbackResults;
    }
}

// Search for tracks
export async function searchYTMusicTracks(
    query: string,
    limit: number = 10
): Promise<YTMusicSearchResult[]> {
    try {
        if (!query.trim()) {
            return [];
        }

        const ytmusicClient = await initializeYTMusic();
        const searchResult = await ytmusicClient.search(query);

        // Filter for songs and map to our format
        const songs = searchResult
            .filter((item) => item.type === "SONG" || item.type === "VIDEO")
            .slice(0, limit);

        console.log(JSON.stringify(songs, null, 2));

        return songs.map((track) => {
            return {
                id: track.videoId,
                title: track.name,
                artist: track.artist.name,
                duration: track.duration || 0,
                thumbnail: track.thumbnails?.[0]?.url || "",
                youtube_url: `https://www.youtube.com/watch?v=${track.videoId}`,
            };
        });
    } catch (error) {
        console.error("YouTube Music search error:", error);
        throw new Error("Failed to search YouTube Music tracks");
    }
}
