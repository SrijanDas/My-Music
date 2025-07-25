"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, SkipForward } from "lucide-react";
import { useRoom } from "@/contexts/RoomContext";

declare global {
    interface Window {
        YT: {
            Player: new (
                element: HTMLElement,
                config: Record<string, unknown>
            ) => YouTubePlayer;
            PlayerState: {
                PLAYING: number;
                ENDED: number;
            };
        };
        onYouTubeIframeAPIReady: () => void;
    }
}

interface YouTubePlayer {
    loadVideoById: (videoId: string) => void;
    playVideo: () => void;
    pauseVideo: () => void;
    stopVideo: () => void;
    seekTo: (seconds: number) => void;
    getCurrentTime: () => number;
    getPlayerState: () => number;
}

export function MusicPlayer() {
    const {
        room,
        isCreator,
        updatePlaybackState,
        updateCurrentSong,
        skipToNext,
        queueItems,
    } = useRoom();
    const [player, setPlayer] = useState<YouTubePlayer | null>(null);
    const [playerReady, setPlayerReady] = useState(false);
    const playerRef = useRef<HTMLDivElement>(null);
    const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Load YouTube API
    useEffect(() => {
        if (window.YT) return;

        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
            if (playerRef.current && room?.current_song) {
                const newPlayer = new window.YT.Player(playerRef.current, {
                    height: "200",
                    width: "100%",
                    videoId: room.current_song.youtube_id,
                    playerVars: {
                        autoplay: 0,
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                        modestbranding: 1,
                        rel: 0,
                        origin: window.location.origin,
                    },
                    events: {
                        onReady: () => {
                            setPlayerReady(true);
                            setPlayer(newPlayer);
                        },
                        onStateChange: (event: { data: number }) => {
                            if (isCreator) {
                                if (
                                    event.data === window.YT.PlayerState.ENDED
                                ) {
                                    skipToNext();
                                }
                            }
                        },
                    },
                });
            }
        };
    }, [room?.current_song, isCreator, skipToNext]);

    // Sync playback state for non-creators
    useEffect(() => {
        if (!player || !playerReady || !room || isCreator) return;

        const syncPlayback = () => {
            const currentTime = player.getCurrentTime();
            const targetTime = room.current_position;
            const timeDiff = Math.abs(currentTime - targetTime);

            // If time difference is more than 2 seconds, seek to correct position
            if (timeDiff > 2) {
                player.seekTo(targetTime);
            }

            // Sync play/pause state
            const playerState = player.getPlayerState();
            const isPlaying = playerState === window.YT.PlayerState.PLAYING;

            if (room.is_playing && !isPlaying) {
                player.playVideo();
            } else if (!room.is_playing && isPlaying) {
                player.pauseVideo();
            }
        };

        syncIntervalRef.current = setInterval(syncPlayback, 1000);

        return () => {
            if (syncIntervalRef.current) {
                clearInterval(syncIntervalRef.current);
            }
        };
    }, [player, playerReady, room, isCreator]);

    // Update room state when creator controls playback
    useEffect(() => {
        if (!player || !playerReady || !room || !isCreator) return;

        const updateInterval = setInterval(() => {
            const currentTime = player.getCurrentTime();
            const playerState = player.getPlayerState();
            const isPlaying = playerState === window.YT.PlayerState.PLAYING;

            updatePlaybackState(isPlaying, currentTime);
        }, 500);

        return () => clearInterval(updateInterval);
    }, [player, playerReady, room, isCreator, updatePlaybackState]);

    // Load new song when current song changes
    useEffect(() => {
        if (!player || !playerReady) return;

        if (room?.current_song) {
            player.loadVideoById(room.current_song.youtube_id);
            if (room.is_playing) {
                player.playVideo();
            }
        } else {
            player.stopVideo();
        }
    }, [player, playerReady, room?.current_song, room?.is_playing]);

    const handlePlayPause = () => {
        if (!player || !playerReady || !isCreator) return;

        const playerState = player.getPlayerState();
        const isPlaying = playerState === window.YT.PlayerState.PLAYING;

        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    };

    const handleSkip = () => {
        if (!isCreator) return;
        skipToNext();
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
                    <div className="aspect-video">
                        <div ref={playerRef} className="w-full h-full" />
                    </div>

                    <div className="text-center">
                        <h3 className="font-semibold">
                            {room.current_song.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {room.current_song.artist}
                        </p>
                    </div>

                    {isCreator && (
                        <div className="flex justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePlayPause}
                                disabled={!playerReady}
                            >
                                {room.is_playing ? (
                                    <Pause className="h-4 w-4" />
                                ) : (
                                    <Play className="h-4 w-4" />
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSkip}
                                disabled={queueItems.length === 0}
                            >
                                <SkipForward className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
