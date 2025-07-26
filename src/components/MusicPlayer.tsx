"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { useRoom } from "@/contexts/RoomContext";
import { useYTMusicPlayer } from "@/hooks/useYTMusicPlayer";
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
    const userActionRef = useRef<boolean>(false);

    const currentSong = room?.current_song;

    // console.log("MusicPlayer: Current song data:", {
    //     currentSong,
    //     youtube_id: currentSong?.youtube_id,
    //     title: currentSong?.title,
    //     roomIsPlaying: room?.is_playing,
    // });

    const {
        playerRef,
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
    } = useYTMusicPlayer({
        trackId: currentSong?.youtube_id,
        onReady: () => {
            console.log("YouTube Music player ready for:", currentSong?.title);
            setPlaybackError(null);
        },
        onStateChange: (state) => {
            console.log(
                "Player state changed to:",
                state,
                "for song:",
                currentSong?.title
            );

            // Immediately update room state when player state changes
            if (isCreator) {
                if (state === "playing") {
                    updatePlaybackState(true, currentTime);
                } else if (state === "paused") {
                    updatePlaybackState(false, currentTime);
                }
            }

            if (isCreator && state === "ended") {
                skipToNext();
            }
        },
        onError: (errorMessage) => {
            console.error("YouTube Music Player Error:", errorMessage);
            setPlaybackError(errorMessage);
        },
    });

    // Sync playback state for non-creators
    useEffect(() => {
        if (
            !player ||
            !playerReady ||
            !room ||
            isCreator ||
            !currentSong?.youtube_id
        )
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
        currentSong?.youtube_id,
        currentTime,
        isPlaying,
        seekTo,
        play,
        pause,
    ]);

    // Update room state when creator controls playback
    useEffect(() => {
        if (
            !player ||
            !playerReady ||
            !room ||
            !isCreator ||
            !currentSong?.youtube_id
        )
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
        currentSong?.youtube_id,
        isPlaying,
        currentTime,
        updatePlaybackState,
    ]);

    // Start playing when room state changes and we're in sync
    useEffect(() => {
        if (
            !player ||
            !playerReady ||
            !room?.current_song ||
            !currentSong?.youtube_id ||
            !isCreator
        )
            return;

        console.log("Play sync effect triggered:", {
            roomIsPlaying: room.is_playing,
            localIsPlaying: isPlaying,
            isCreator,
            userAction: userActionRef.current,
            shouldPlay:
                room.is_playing &&
                !isPlaying &&
                isCreator &&
                !userActionRef.current,
        });

        // Only auto-play if:
        // 1. Room state says it should be playing
        // 2. We're not currently playing
        // 3. We're the creator
        // 4. This is not immediately after a user action
        if (room.is_playing && !isPlaying && !userActionRef.current) {
            const timeoutId = setTimeout(() => {
                // Double-check the conditions after a small delay
                if (
                    room.is_playing &&
                    !isPlaying &&
                    isCreator &&
                    playerReady &&
                    !userActionRef.current
                ) {
                    console.log("Auto-playing due to room state after delay");
                    play();
                }
            }, 300);

            return () => clearTimeout(timeoutId);
        }
    }, [
        player,
        playerReady,
        room?.current_song,
        room?.is_playing,
        currentSong?.youtube_id,
        isPlaying,
        isCreator,
        play,
    ]);

    // Update volume
    useEffect(() => {
        setPlayerVolume(volume);
    }, [volume, setPlayerVolume]);

    const handlePlayPause = () => {
        console.log("handlePlayPause called", {
            player: !!player,
            playerReady,
            isCreator,
            youtubeId: !!currentSong?.youtube_id,
            isPlaying,
            currentSong: currentSong?.title,
        });

        if (!player || !playerReady || !isCreator || !currentSong?.youtube_id) {
            console.warn("Cannot play/pause - missing requirements:", {
                player: !!player,
                playerReady,
                isCreator,
                youtubeId: !!currentSong?.youtube_id,
            });
            return;
        }

        try {
            console.log(
                `Attempting to ${isPlaying ? "pause" : "play"} the track`
            );

            // Mark this as a user-initiated action
            userActionRef.current = true;

            if (isPlaying) {
                pause();
            } else {
                play();
            }

            // Reset the flag after a delay
            setTimeout(() => {
                userActionRef.current = false;
            }, 1000);
        } catch (error) {
            console.error("Error in play/pause:", error);
            setPlaybackError("Playback control error");
        }
    };

    const handleSkip = () => {
        if (!isCreator) return;
        skipToNext();
    };

    const handleSkipBack = () => {
        if (!isCreator) return;
        // If we're more than 3 seconds into the song, restart it
        // Otherwise, go to previous song in queue (TODO: implement skipToPrevious in context)
        if (currentTime > 3) {
            seekTo(0);
        } else {
            // For now, just restart the song until we implement skipToPrevious
            seekTo(0);
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isCreator || !playerReady || duration === 0) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickPercentage = clickX / rect.width;
        const newTime = clickPercentage * duration;

        seekTo(Math.max(0, Math.min(newTime, duration)));
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
                                {/* Removed "Open in YouTube" button */}
                            </div>
                        </div>
                    </div>

                    {/* YouTube Player (hidden) */}
                    <div ref={playerRef} style={{ display: "none" }} />

                    {/* Controls */}
                    {currentSong?.youtube_id && (
                        <div className="space-y-2">
                            {/* Progress Bar */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{formatTime(currentTime)}</span>
                                <div
                                    className={`flex-1 bg-muted rounded-full h-2 ${
                                        isCreator ? "cursor-pointer" : ""
                                    }`}
                                    onClick={
                                        isCreator
                                            ? handleProgressClick
                                            : undefined
                                    }
                                >
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
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleSkipBack}
                                        >
                                            <SkipBack className="h-4 w-4" />
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

                    {!currentSong?.youtube_id && (
                        <div className="text-center text-sm text-muted-foreground">
                            This track is not available for playback.
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
