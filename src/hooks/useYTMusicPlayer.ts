"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface YTPlayer {
    playVideo: () => void;
    pauseVideo: () => void;
    loadVideoById: (videoId: string) => void;
    seekTo: (time: number, allowSeekAhead: boolean) => void;
    setVolume: (volume: number) => void;
    getCurrentTime: () => number;
    getDuration: () => number;
}

interface YTEvent {
    target: YTPlayer;
    data: number;
}

interface UseYTMusicPlayerOptions {
    trackId?: string;
    youtubeUrl?: string;
    onReady?: () => void;
    onStateChange?: (state: "playing" | "paused" | "ended") => void;
    onError?: (error: string) => void;
}

export function useYTMusicPlayer(options: UseYTMusicPlayerOptions) {
    const [player, setPlayer] = useState<YTPlayer | null>(null);
    const [playerReady, setPlayerReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const playerRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startTimeTracking = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            if (player && isPlaying) {
                setCurrentTime(player.getCurrentTime());
            }
        }, 1000);
    }, [player, isPlaying]);

    const stopTimeTracking = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const initializePlayer = useCallback(() => {
        if (!playerRef.current || !options.trackId) {
            console.log("Cannot initialize player:", {
                playerRef: !!playerRef.current,
                trackId: options.trackId,
            });
            return;
        }

        console.log(
            "Initializing YouTube player with trackId:",
            options.trackId
        );

        try {
            // Create a unique player ID to avoid conflicts
            const playerId = `youtube-player-${Date.now()}`;
            if (playerRef.current) {
                playerRef.current.id = playerId;
            }

            const newPlayer = new window.YT.Player(playerRef.current, {
                height: "0",
                width: "0",
                videoId: options.trackId,
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    enablejsapi: 1,
                },
                events: {
                    onReady: (event: YTEvent) => {
                        console.log(
                            "YouTube player ready, setting player instance"
                        );
                        setPlayer(event.target);
                        setPlayerReady(true);
                        try {
                            const duration = event.target.getDuration();
                            setDuration(duration);
                            console.log("Player duration:", duration);
                        } catch (e) {
                            console.warn("Could not get duration:", e);
                        }
                        setError(null);
                        options.onReady?.();
                    },
                    onStateChange: (event: YTEvent) => {
                        const state = event.data;
                        console.log("Player state changed:", state, {
                            PLAYING: window.YT.PlayerState.PLAYING,
                            PAUSED: window.YT.PlayerState.PAUSED,
                            ENDED: window.YT.PlayerState.ENDED,
                        });

                        if (state === window.YT.PlayerState.PLAYING) {
                            console.log("Setting isPlaying to true");
                            setIsPlaying(true);
                            options.onStateChange?.("playing");
                            startTimeTracking();
                        } else if (state === window.YT.PlayerState.PAUSED) {
                            console.log("Setting isPlaying to false (paused)");
                            setIsPlaying(false);
                            options.onStateChange?.("paused");
                            stopTimeTracking();
                        } else if (state === window.YT.PlayerState.ENDED) {
                            console.log("Setting isPlaying to false (ended)");
                            setIsPlaying(false);
                            setCurrentTime(0);
                            options.onStateChange?.("ended");
                            stopTimeTracking();
                        }
                    },
                    onError: (event: YTEvent) => {
                        const errorMessage = `YouTube Player Error: ${event.data}`;
                        console.error(errorMessage);
                        setError(errorMessage);
                        options.onError?.(errorMessage);
                    },
                },
            });

            console.log("YouTube player created:", newPlayer);
        } catch (error) {
            console.error("Error creating YouTube player:", error);
            setError("Failed to create YouTube player");
        }
    }, [options, startTimeTracking, stopTimeTracking]);

    useEffect(() => {
        // Load YouTube IFrame API
        if (!window.YT) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                initializePlayer();
            };
        } else {
            initializePlayer();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [initializePlayer]);

    // Update player when trackId changes
    useEffect(() => {
        if (player && options.trackId) {
            player.loadVideoById(options.trackId);
            setCurrentTime(0);
        }
    }, [options.trackId, player]);

    const play = () => {
        console.log("Play function called:", {
            player: !!player,
            playerReady,
            trackId: options.trackId,
        });

        if (player && playerReady) {
            try {
                console.log("Calling player.playVideo()");
                player.playVideo();
            } catch (error) {
                console.error("Error calling playVideo:", error);
                setError("Failed to play video");
            }
        } else {
            console.warn("Cannot play: player not ready", {
                player: !!player,
                playerReady,
            });
        }
    };

    const pause = () => {
        console.log("Pause function called:", {
            player: !!player,
            playerReady,
            trackId: options.trackId,
        });

        if (player && playerReady) {
            try {
                console.log("Calling player.pauseVideo()");
                player.pauseVideo();
            } catch (error) {
                console.error("Error calling pauseVideo:", error);
                setError("Failed to pause video");
            }
        } else {
            console.warn("Cannot pause: player not ready", {
                player: !!player,
                playerReady,
            });
        }
    };

    const seekTo = (time: number) => {
        if (player && playerReady) {
            player.seekTo(time, true);
            setCurrentTime(time);
        }
    };

    const setVolume = (volume: number) => {
        if (player && playerReady) {
            player.setVolume(Math.max(0, Math.min(100, volume * 100)));
        }
    };

    return {
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
        setVolume,
    };
}

// Declare global YouTube types
declare global {
    interface Window {
        YT: {
            Player: new (
                element: HTMLElement,
                config: {
                    height: string;
                    width: string;
                    videoId: string;
                    playerVars: Record<string, number>;
                    events: {
                        onReady: (event: YTEvent) => void;
                        onStateChange: (event: YTEvent) => void;
                        onError: (event: YTEvent) => void;
                    };
                }
            ) => YTPlayer;
            PlayerState: {
                UNSTARTED: number;
                ENDED: number;
                PLAYING: number;
                PAUSED: number;
                BUFFERING: number;
                CUED: number;
            };
        };
        onYouTubeIframeAPIReady: () => void;
    }
}
