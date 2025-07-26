import YTMusic from "ytmusic-api";

export interface YTMusicSong {
    type: "SONG";
    name: string;
    videoId: string;
    artist: {
        artistId: string | null;
        name: string;
    };
    album: {
        name: string;
        albumId: string;
    } | null;
    duration: number | null;
    thumbnails: Array<{
        url: string;
        width: number;
        height: number;
    }>;
}

export interface YTMusicSearchResult {
    id: string;
    title: string;
    artist: string;
    duration: number; // in seconds
    thumbnail: string;
    youtube_url: string;
}

// Create YouTube Music API client
let ytmusic: YTMusic | null = null;

// Initialize YouTube Music API
export async function initializeYTMusic() {
    if (!ytmusic) {
        ytmusic = new YTMusic();
        await ytmusic.initialize();
    }
    return ytmusic;
}

// Get track details by ID
export async function getYTMusicTrack(
    videoId: string
): Promise<YTMusicSearchResult | null> {
    try {
        const ytmusicClient = await initializeYTMusic();

        // Search for the specific video ID
        const searchResult = await ytmusicClient.search(`${videoId}`);
        const track = searchResult.find((item) => {
            return (
                item.type === "SONG" &&
                "videoId" in item &&
                item.videoId === videoId
            );
        });

        if (!track || track.type !== "SONG") {
            return null;
        }

        return {
            id: track.videoId,
            title: track.name,
            artist: track.artist.name,
            duration: track.duration || 0,
            thumbnail: track.thumbnails?.[0]?.url || "/default-album.png",
            youtube_url: `https://www.youtube.com/watch?v=${track.videoId}`,
        };
    } catch (error) {
        console.error("Error getting YouTube Music track:", error);
        return null;
    }
}

export { ytmusic };
