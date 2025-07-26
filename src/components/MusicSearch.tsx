"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus } from "lucide-react";
import { useRoom } from "@/contexts/RoomContext";
import { YTMusicSearchResult } from "@/lib/ytmusic";
import { Song } from "@/lib/types";
import { toast } from "sonner";
import { searchYTMusic } from "@/lib/ytmusic-search";

export function MusicSearch() {
    const { isCreator, addToQueue } = useRoom();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<YTMusicSearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const searchResults = await searchYTMusic(query);
            setResults(searchResults);
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Failed to search for music");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleAddToQueue = async (track: YTMusicSearchResult) => {
        if (!isCreator) {
            toast.error("Only the room creator can add songs");
            return;
        }

        try {
            const song: Song = {
                id: track.id,
                youtube_id: track.id,
                title: track.title,
                artist: track.artist,
                duration: track.duration,
                thumbnail: track.thumbnail,
                youtube_url: track.youtube_url,
            };

            await addToQueue(song);
            toast.success(`Added "${track.title}" to queue`);
        } catch (error) {
            console.error("Error adding to queue:", error);
            toast.error("Failed to add song to queue");
        }
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search for music on YouTube Music..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleSearch}
                            disabled={loading || !query.trim()}
                            size="icon"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>

                    {loading && (
                        <div className="text-center text-muted-foreground">
                            Searching YouTube Music...
                        </div>
                    )}

                    <ScrollArea className="h-[400px]">
                        <div className="space-y-2">
                            {results.map((track) => (
                                <div
                                    key={track.id}
                                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent"
                                >
                                    <Image
                                        src={track.thumbnail}
                                        alt={track.title}
                                        width={48}
                                        height={48}
                                        className="rounded"
                                        unoptimized
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium truncate">
                                            {track.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {track.artist}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDuration(track.duration)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {isCreator && (
                                            <Button
                                                size="icon"
                                                onClick={() =>
                                                    handleAddToQueue(track)
                                                }
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    {results.length === 0 && !loading && query && (
                        <div className="text-center text-muted-foreground">
                            No results found. Try a different search term.
                        </div>
                    )}

                    {!isCreator && (
                        <p className="text-sm text-muted-foreground text-center">
                            Only the room creator can add songs to the queue
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
