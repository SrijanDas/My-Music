import ytsearch from "yt-search";

export interface YouTubeSearchResult {
    id: string;
    title: string;
    artist: string;
    duration: number;
    thumbnail: string;
}

export async function searchYouTube(
    query: string
): Promise<YouTubeSearchResult[]> {
    try {
        const results = await ytsearch(query);

        return results.videos.slice(0, 10).map((video) => ({
            id: video.videoId,
            title: video.title,
            artist: video.author.name,
            duration: video.duration.seconds,
            thumbnail: video.thumbnail,
        }));
    } catch (error) {
        console.error("YouTube search error:", error);
        return [];
    }
}

export function getYouTubeEmbedUrl(
    videoId: string,
    autoplay: boolean = false
): string {
    const params = new URLSearchParams({
        enablejsapi: "1",
        origin: typeof window !== "undefined" ? window.location.origin : "",
        autoplay: autoplay ? "1" : "0",
        controls: "0",
        disablekb: "1",
        fs: "0",
        modestbranding: "1",
        rel: "0",
    });

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}
