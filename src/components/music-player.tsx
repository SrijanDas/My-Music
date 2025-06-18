"use client"

import type { Song } from "~/lib/mock-data"
import { formatTime } from "~/lib/utils"
import { Card } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Slider } from "~/components/ui/slider"
import { Play, Pause, SkipForward } from "lucide-react"
import Image from "next/image"

interface MusicPlayerProps {
  currentSong: Song | null
  isPlaying: boolean
  currentTime: number
  onPlayPause: () => void
  onNext: () => void
}

export function MusicPlayer({ currentSong, isPlaying, currentTime, onPlayPause, onNext }: MusicPlayerProps) {
  if (!currentSong) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
        <div className="text-center text-white/70">
          <p>No song currently playing</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={currentSong.coverUrl || "/placeholder.svg"}
          alt={`${currentSong.title} cover`}
          width={60}
          height={60}
          className="rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{currentSong.title}</h3>
          <p className="text-white/70 text-sm truncate">{currentSong.artist}</p>
          <p className="text-white/50 text-xs truncate">{currentSong.album}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Slider value={[currentTime]} max={currentSong.duration} step={1} className="w-full" />
          <div className="flex justify-between text-xs text-white/70">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentSong.duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button onClick={onPlayPause} size="lg" className="rounded-full w-12 h-12">
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </Button>
          <Button
            onClick={onNext}
            size="lg"
            variant="outline"
            className="rounded-full w-12 h-12 border-white/20 text-white hover:bg-white/10"
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
