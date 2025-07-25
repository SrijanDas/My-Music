import SpotifyWebApi from "spotify-web-api-node";

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: Array<{
        name: string;
    }>;
    duration_ms: number;
    preview_url: string | null;
    album: {
        images: Array<{
            url: string;
            width: number;
            height: number;
        }>;
    };
    external_urls: {
        spotify: string;
    };
}

export interface SpotifySearchResult {
    id: string;
    title: string;
    artist: string;
    duration: number; // in seconds
    thumbnail: string;
    preview_url: string | null;
    spotify_url: string;
}

// Create Spotify API client
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri:
        process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI ||
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/spotify/callback`,
});

// Get client credentials access token
export async function getClientCredentialsToken() {
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body.access_token);

        // Refresh token before it expires
        setTimeout(() => {
            getClientCredentialsToken();
        }, (data.body.expires_in - 60) * 1000); // Refresh 1 minute before expiry

        return data.body.access_token;
    } catch (error) {
        console.error("Error getting Spotify client credentials:", error);
        throw new Error("Failed to authenticate with Spotify");
    }
}

// Search for tracks
export async function searchSpotifyTracks(
    query: string,
    limit: number = 10
): Promise<SpotifySearchResult[]> {
    try {
        // Ensure we have a valid token
        if (!spotifyApi.getAccessToken()) {
            await getClientCredentialsToken();
        }

        const searchResult = await spotifyApi.searchTracks(query, { limit });

        return (
            searchResult.body.tracks?.items?.map((track) => ({
                id: track.id,
                title: track.name,
                artist: track.artists.map((artist) => artist.name).join(", "),
                duration: Math.floor(track.duration_ms / 1000),
                thumbnail: track.album.images[0]?.url || "/default-album.png",
                preview_url: track.preview_url,
                spotify_url: track.external_urls.spotify,
            })) || []
        );
    } catch (error) {
        console.error("Spotify search error:", error);
        throw new Error("Failed to search Spotify tracks");
    }
}

// Get track details by ID
export async function getSpotifyTrack(
    trackId: string
): Promise<SpotifySearchResult | null> {
    try {
        // Ensure we have a valid token
        if (!spotifyApi.getAccessToken()) {
            await getClientCredentialsToken();
        }

        const track = await spotifyApi.getTrack(trackId);
        const spotifyTrack = track.body;

        return {
            id: spotifyTrack.id,
            title: spotifyTrack.name,
            artist: spotifyTrack.artists
                .map((artist: { name: string }) => artist.name)
                .join(", "),
            duration: Math.floor(spotifyTrack.duration_ms / 1000),
            thumbnail:
                spotifyTrack.album.images[0]?.url || "/default-album.png",
            preview_url: spotifyTrack.preview_url,
            spotify_url: spotifyTrack.external_urls.spotify,
        };
    } catch (error) {
        console.error("Error getting Spotify track:", error);
        return null;
    }
}

export { spotifyApi };
