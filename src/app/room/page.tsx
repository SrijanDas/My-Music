"use client";

import { useState } from "react";
import { mockRoom, mockSongs, type Song } from "~/lib/mock-data";
import { MusicPlayer } from "~/components/music-player";
import { QueueManager } from "~/components/queue-manager";
import { SongBrowser } from "~/components/song-browser";
import { RoomHeader } from "~/components/room-header";
import { Button } from "~/components/ui/button";
import { List, Search } from "lucide-react";

export default function MusicRoom() {
  const [room, setRoom] = useState(mockRoom);
  const [currentUser] = useState(room.users[0]); // user_1 (Alex - the host)
  const [showSongBrowser, setShowSongBrowser] = useState(false);
  const [showQueue, setShowQueue] = useState(true);

  const addSongToQueue = (song: Song) => {
    setRoom((prev) => ({
      ...prev,
      queue: [...prev.queue, song],
    }));
    setShowSongBrowser(false);
  };

  const removeSongFromQueue = (songId: string) => {
    setRoom((prev) => ({
      ...prev,
      queue: prev.queue.filter((song) => song?.id !== songId),
    }));
  };

  const reorderQueue = (newQueue: Song[]) => {
    setRoom((prev) => ({
      ...prev,
      queue: newQueue,
    }));
  };

  const playNextSong = () => {
    if (room.queue.length > 0) {
      const nextSong = room.queue[0];
      setRoom((prev) => ({
        ...prev,
        currentSong: nextSong,
        queue: prev.queue.slice(1),
        currentTime: 0,
      }));
    }
  };

  const togglePlayPause = () => {
    setRoom((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  };

  const savePlaylist = () => {
    if (currentUser?.isHost) {
      // Mock save functionality
      alert(`Playlist saved with ${room.queue.length} songs!`);
    }
  };

  if (!currentUser) {
    return <div>No user found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto max-w-md px-4 py-6">
        <RoomHeader room={room} currentUser={currentUser} />

        <div className="space-y-6">
          {room.currentSong && (
            <MusicPlayer
              currentSong={room.currentSong}
              isPlaying={room.isPlaying}
              currentTime={room.currentTime}
              onPlayPause={togglePlayPause}
              onNext={playNextSong}
            />
          )}
          <div className="flex gap-2">
            <Button
              onClick={() => setShowSongBrowser(!showSongBrowser)}
              className="flex-1"
              variant={showSongBrowser ? "secondary" : "default"}
            >
              <Search className="mr-2 h-4 w-4" />
              Browse Songs
            </Button>
            <Button
              onClick={() => setShowQueue(!showQueue)}
              variant={showQueue ? "secondary" : "outline"}
              size="icon"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {showSongBrowser && (
            <SongBrowser
              songs={mockSongs}
              onAddSong={addSongToQueue}
              queuedSongIds={room.queue.map((s) => s?.id ?? "")}
            />
          )}

          {showQueue && (
            <QueueManager
              queue={room.queue.filter((song) => song !== null) as Song[]}
              onRemoveSong={removeSongFromQueue}
              onReorderQueue={reorderQueue}
              canSavePlaylist={currentUser.isHost}
              onSavePlaylist={savePlaylist}
            />
          )}
        </div>
      </div>
    </div>
  );
}
