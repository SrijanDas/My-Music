"use client"

import type { Song } from "~/lib/mock-data"
import { formatTime } from "~/lib/utils"
import { Card } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Plus, Check } from "lucide-react"
import Image from "next/image"

interface SongBrowserProps {
  songs: Song[]
  onAddSong: (song: Song) => void
  queuedSongIds: string[]
}

export function SongBrowser({ songs, onAddSong, queuedSongIds }: SongBrowserProps) {
  return (
    <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
      <h2 className="text-lg font-semibold text-white mb-4">Browse Songs</h2>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {songs.map((song) => {
          const isQueued = queuedSongIds.includes(song.id)

          return (
            <div
              key={song.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Image
                src={song.coverUrl || "/placeholder.svg"}
                alt={`${song.title} cover`}
                width={40}
                height={40}
                className="rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">{song.title}</p>
                <p className="text-white/70 text-xs truncate">
                  {song.artist} • {formatTime(song.duration)}
                </p>
              </div>
              <Button
                onClick={() => onAddSong(song)}
                size="sm"
                disabled={isQueued}
                className={isQueued ? "bg-green-600 hover:bg-green-600" : ""}
              >
                {isQueued ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </Button>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
