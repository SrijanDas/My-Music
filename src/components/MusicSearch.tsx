"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus } from "lucide-react";
import { useRoom } from "@/contexts/RoomContext";
import { searchYouTube, YouTubeSearchResult } from "@/lib/youtube";
import { Song } from "@/lib/types";
import { toast } from "sonner";

export function MusicSearch() {
    const { isCreator, addToQueue } = useRoom();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<YouTubeSearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const searchResults = await searchYouTube(query);
            setResults(searchResults);
        } catch {
            toast.error("Failed to search for music");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToQueue = async (result: YouTubeSearchResult) => {
        const song: Song = {
            id: result.id,
            youtube_id: result.id,
            title: result.title,
            artist: result.artist,
            duration: result.duration,
            thumbnail: result.thumbnail,
        };

        try {
            await addToQueue(song);
            toast.success(`Added "${result.title}" to queue`);
        } catch {
            toast.error("Failed to add song to queue");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    if (!isCreator) {
        return null;
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search for music..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <Button onClick={handleSearch} disabled={loading}>
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>

                    {results.length > 0 && (
                        <ScrollArea className="h-96">
                            <div className="space-y-2">
                                {results.map((result) => (
                                    <div
                                        key={result.id}
                                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50"
                                    >
                                        <Image
                                            src={result.thumbnail}
                                            alt={result.title}
                                            width={64}
                                            height={48}
                                            className="w-16 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">
                                                {result.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {result.artist}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {Math.floor(
                                                    result.duration / 60
                                                )}
                                                :
                                                {(result.duration % 60)
                                                    .toString()
                                                    .padStart(2, "0")}
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                handleAddToQueue(result)
                                            }
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
