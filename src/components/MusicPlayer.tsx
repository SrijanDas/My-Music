"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, SkipForward, Volume2, ExternalLink } from "lucide-react";
import { useRoom } from "@/contexts/RoomContext";
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";
import Image from "next/image";

export function MusicPlayer() {
    const {
        room,
        isCreator,
        updatePlaybackState,
        updateCurrentSong,
        skipToNext,
        queueItems,
    } = useRoom();

    const [playbackError, setPlaybackError] = useState<string | null>(null);
    const [volume, setVolume] = useState(0.7);
    const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const currentSong = room?.current_song;
    const previewUrl = currentSong?.preview_url || null;

    const {
        audioRef,
        player,
        playerReady,
        isPlaying,
        currentTime,
        duration,
        error,
        play,
        pause,
        seekTo,
        setVolume: setPlayerVolume,
    } = useSpotifyPlayer({
        trackId: currentSong?.spotify_id,
        previewUrl,
        onReady: () => {
            console.log("Spotify player ready");
            setPlaybackError(null);
        },
        onStateChange: (state) => {
            console.log("Player state changed:", state);
            if (isCreator && state === "ended") {
                skipToNext();
            }
        },
        onError: (errorMessage) => {
            console.error("Spotify Player Error:", errorMessage);
            setPlaybackError(errorMessage);
        },
    });

    // Sync playback state for non-creators
    useEffect(() => {
        if (!player || !playerReady || !room || isCreator || !previewUrl)
            return;

        const syncPlayback = () => {
            const targetTime = room.current_position;
            const timeDiff = Math.abs(currentTime - targetTime);

            // If time difference is more than 2 seconds, seek to correct position
            if (timeDiff > 2) {
                seekTo(targetTime);
            }

            // Sync play/pause state
            if (room.is_playing && !isPlaying) {
                play();
            } else if (!room.is_playing && isPlaying) {
                pause();
            }
        };

        syncIntervalRef.current = setInterval(syncPlayback, 1000);

        return () => {
            if (syncIntervalRef.current) {
                clearInterval(syncIntervalRef.current);
            }
        };
    }, [
        player,
        playerReady,
        room,
        isCreator,
        previewUrl,
        currentTime,
        isPlaying,
        seekTo,
        play,
        pause,
    ]);

    // Update room state when creator controls playback
    useEffect(() => {
        if (!player || !playerReady || !room || !isCreator || !previewUrl)
            return;

        const updateInterval = setInterval(() => {
            updatePlaybackState(isPlaying, currentTime);
        }, 500);

        return () => clearInterval(updateInterval);
    }, [
        player,
        playerReady,
        room,
        isCreator,
        previewUrl,
        isPlaying,
        currentTime,
        updatePlaybackState,
    ]);

    // Start playing when room state changes and we're in sync
    useEffect(() => {
        if (!player || !playerReady || !room?.current_song || !previewUrl)
            return;

        if (room.is_playing && !isPlaying && isCreator) {
            play();
        }
    }, [
        player,
        playerReady,
        room?.current_song,
        room?.is_playing,
        previewUrl,
        isPlaying,
        isCreator,
        play,
    ]);

    // Update volume
    useEffect(() => {
        setPlayerVolume(volume);
    }, [volume, setPlayerVolume]);

    const handlePlayPause = () => {
        if (!player || !playerReady || !isCreator || !previewUrl) {
            console.warn("Cannot play/pause:", {
                player: !!player,
                playerReady,
                isCreator,
                previewUrl: !!previewUrl,
            });
            return;
        }

        try {
            if (isPlaying) {
                pause();
            } else {
                play();
            }
        } catch (error) {
            console.error("Error in play/pause:", error);
            setPlaybackError("Playback control error");
        }
    };

    const handleSkip = () => {
        if (!isCreator) return;
        skipToNext();
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    if (!room?.current_song) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                        No song currently playing
                    </p>
                    {queueItems.length > 0 && isCreator && (
                        <Button
                            onClick={() =>
                                updateCurrentSong(queueItems[0].song, 0)
                            }
                            className="mt-4"
                        >
                            Start Playing Queue
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="space-y-4">
                    {/* Song Info */}
                    <div className="flex items-center gap-4">
                        <Image
                            src={currentSong?.thumbnail || "/default-album.png"}
                            alt={currentSong?.title || "Song"}
                            width={80}
                            height={80}
                            className="rounded-lg"
                            unoptimized
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">
                                {currentSong?.title}
                            </h3>
                            <p className="text-muted-foreground truncate">
                                {currentSong?.artist}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        currentSong?.spotify_url &&
                                        window.open(
                                            currentSong.spotify_url,
                                            "_blank"
                                        )
                                    }
                                >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Open in Spotify
                                </Button>
                                {!previewUrl && (
                                    <span className="text-xs text-muted-foreground">
                                        Preview not available
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Audio Element (hidden) */}
                    <audio
                        ref={audioRef}
                        style={{ display: "none" }}
                        preload="metadata"
                    />

                    {/* Controls */}
                    {previewUrl && (
                        <div className="space-y-2">
                            {/* Progress Bar */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{formatTime(currentTime)}</span>
                                <div className="flex-1 bg-muted rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all"
                                        style={{
                                            width:
                                                duration > 0
                                                    ? `${
                                                          (currentTime /
                                                              duration) *
                                                          100
                                                      }%`
                                                    : "0%",
                                        }}
                                    />
                                </div>
                                <span>{formatTime(duration)}</span>
                            </div>

                            {/* Play Controls */}
                            <div className="flex items-center justify-center gap-4">
                                {isCreator && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handlePlayPause}
                                            disabled={!playerReady}
                                        >
                                            {isPlaying ? (
                                                <Pause className="h-4 w-4" />
                                            ) : (
                                                <Play className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleSkip}
                                        >
                                            <SkipForward className="h-4 w-4" />
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Volume Control */}
                            <div className="flex items-center gap-2">
                                <Volume2 className="h-4 w-4" />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={volume}
                                    onChange={(e) =>
                                        setVolume(parseFloat(e.target.value))
                                    }
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {(playbackError || error) && (
                        <div className="text-center text-sm text-destructive">
                            {playbackError || error}
                        </div>
                    )}

                    {!previewUrl && (
                        <div className="text-center text-sm text-muted-foreground">
                            This track doesn&apos;t have a preview available.
                            <br />
                            Click &quot;Open in Spotify&quot; to listen to the
                            full track.
                        </div>
                    )}

                    {!isCreator && (
                        <p className="text-sm text-muted-foreground text-center">
                            Only the room creator can control playback
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
