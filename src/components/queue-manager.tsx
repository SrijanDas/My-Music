"use client";

import type React from "react";

import { useState } from "react";
import type { Song } from "~/lib/mock-data";
import { formatTime } from "~/lib/utils";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { X, GripVertical, Save } from "lucide-react";
import Image from "next/image";

interface QueueManagerProps {
  queue: Song[];
  onRemoveSong: (songId: string) => void;
  onReorderQueue: (newQueue: Song[]) => void;
  canSavePlaylist: boolean;
  onSavePlaylist: () => void;
}

export function QueueManager({
  queue,
  onRemoveSong,
  onReorderQueue,
  canSavePlaylist,
  onSavePlaylist,
}: QueueManagerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newQueue = [...queue];
    const draggedItem = newQueue[draggedIndex];
    if (!draggedItem) return;
    newQueue.splice(draggedIndex, 1);
    newQueue.splice(index, 0, draggedItem);

    onReorderQueue(newQueue);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <Card className="border-white/20 bg-white/10 p-4 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Queue ({queue.length})
        </h2>
        {canSavePlaylist && queue.length > 0 && (
          <Button
            onClick={onSavePlaylist}
            size="sm"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Playlist
          </Button>
        )}
      </div>

      {queue.length === 0 ? (
        <div className="py-8 text-center text-white/70">
          <p>Queue is empty</p>
          <p className="text-sm">Add some songs to get started!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {queue.map((song, index) => (
            <div
              key={`${song.id}-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className="flex cursor-move items-center gap-3 rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10"
            >
              <GripVertical className="h-4 w-4 text-white/50" />
              <div className="w-6 font-mono text-sm text-white/70">
                {index + 1}
              </div>
              <Image
                src={song.coverUrl || "/placeholder.svg"}
                alt={`${song.title} cover`}
                width={40}
                height={40}
                className="rounded"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {song.title}
                </p>
                <p className="truncate text-xs text-white/70">
                  {song.artist} • {formatTime(song.duration)}
                </p>
              </div>
              <Button
                onClick={() => onRemoveSong(song.id)}
                size="sm"
                variant="ghost"
                className="text-white/70 hover:bg-red-400/10 hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
