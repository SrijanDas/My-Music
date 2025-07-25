declare module "yt-search" {
    interface VideoResult {
        videoId: string;
        title: string;
        description: string;
        author: {
            name: string;
            channelId: string;
        };
        duration: {
            seconds: number;
            timestamp: string;
        };
        thumbnail: string;
        views: number;
        uploaded: string;
    }

    interface SearchResult {
        videos: VideoResult[];
        playlists: unknown[];
        channels: unknown[];
        live: unknown[];
    }

    function search(query: string): Promise<SearchResult>;
    export = search;
}
