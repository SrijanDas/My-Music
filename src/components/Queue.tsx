"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, GripVertical } from "lucide-react";
import { useRoom } from "@/contexts/RoomContext";

export function Queue() {
    const { queueItems, isCreator, removeFromQueue } = useRoom();

    const handleRemove = (queueItemId: string) => {
        removeFromQueue(queueItemId);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Queue ({queueItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
                {queueItems.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                        No songs in queue
                    </p>
                ) : (
                    <ScrollArea className="h-96">
                        <div className="space-y-2">
                            {queueItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 p-3 rounded-lg border"
                                >
                                    {isCreator && (
                                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">
                                            {item.song.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {item.song.artist}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {Math.floor(
                                                item.song.duration / 60
                                            )}
                                            :
                                            {(item.song.duration % 60)
                                                .toString()
                                                .padStart(2, "0")}
                                        </p>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        #{index + 1}
                                    </div>
                                    {isCreator && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleRemove(item.id)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}
