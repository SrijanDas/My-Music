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
    const { trackId, onReady, onStateChange, onError } = options;
    const [player, setPlayer] = useState<YTPlayer | null>(null);
    const [playerReady, setPlayerReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const playerRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const currentTrackIdRef = useRef<string | null>(null);

    const initializePlayer = useCallback(() => {
        if (!playerRef.current || !trackId) {
            console.log("Cannot initialize player:", {
                playerRef: !!playerRef.current,
                trackId: trackId,
            });
            return;
        }

        // Prevent re-initialization of the same track
        if (currentTrackIdRef.current === trackId && player) {
            console.log("Player already initialized for track:", trackId);
            return;
        }

        console.log("Initializing YouTube player with trackId:", trackId);

        // Clear any existing player first
        if (player) {
            try {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                setPlayer(null);
                setPlayerReady(false);
            } catch (e) {
                console.warn("Error cleaning up previous player:", e);
            }
        }

        try {
            // Create a unique player ID to avoid conflicts
            const playerId = `youtube-player-${Date.now()}`;
            if (playerRef.current) {
                playerRef.current.id = playerId;
            }

            const newPlayer = new window.YT.Player(playerRef.current, {
                height: "0",
                width: "0",
                videoId: trackId,
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
                        currentTrackIdRef.current = trackId;
                        try {
                            const duration = event.target.getDuration();
                            setDuration(duration);
                            console.log("Player duration:", duration);
                        } catch (e) {
                            console.warn("Could not get duration:", e);
                        }
                        setError(null);
                        onReady?.();
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
                            onStateChange?.("playing");
                            // Start time tracking directly here to avoid dependency issues
                            if (intervalRef.current) {
                                clearInterval(intervalRef.current);
                            }
                            intervalRef.current = setInterval(() => {
                                try {
                                    if (event.target && typeof event.target.getCurrentTime === 'function') {
                                        const time = event.target.getCurrentTime();
                                        console.log("Updating current time:", time);
                                        setCurrentTime(time);
                                    }
                                } catch (error) {
                                    console.warn("Error getting current time:", error);
                                }
                            }, 1000);
                        } else if (state === window.YT.PlayerState.PAUSED) {
                            console.log("Setting isPlaying to false (paused)");
                            setIsPlaying(false);
                            onStateChange?.("paused");
                            // Stop time tracking directly here
                            if (intervalRef.current) {
                                clearInterval(intervalRef.current);
                                intervalRef.current = null;
                            }
                        } else if (state === window.YT.PlayerState.ENDED) {
                            console.log("Setting isPlaying to false (ended)");
                            setIsPlaying(false);
                            setCurrentTime(0);
                            onStateChange?.("ended");
                            // Stop time tracking directly here
                            if (intervalRef.current) {
                                clearInterval(intervalRef.current);
                                intervalRef.current = null;
                            }
                        }
                    },
                    onError: (event: YTEvent) => {
                        const errorMessage = `YouTube Player Error: ${event.data}`;
                        console.error(errorMessage);
                        setError(errorMessage);
                        onError?.(errorMessage);
                    },
                },
            });

            console.log("YouTube player created:", newPlayer);
        } catch (error) {
            console.error("Error creating YouTube player:", error);
            setError("Failed to create YouTube player");
        }
    }, [trackId, onReady, onStateChange, onError, player]);

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
        if (player && trackId && currentTrackIdRef.current !== trackId) {
            console.log("Loading new track:", trackId);
            player.loadVideoById(trackId);
            setCurrentTime(0);
            currentTrackIdRef.current = trackId;
        }
    }, [trackId, player]);

    // Backup time tracking using player state (in case event.target becomes stale)
    useEffect(() => {
        if (!player || !playerReady || !isPlaying) {
            return;
        }

        const backupInterval = setInterval(() => {
            try {
                if (player && typeof player.getCurrentTime === 'function') {
                    const time = player.getCurrentTime();
                    setCurrentTime(time);
                }
            } catch (error) {
                console.warn("Backup time tracking error:", error);
            }
        }, 1000);

        return () => {
            clearInterval(backupInterval);
        };
    }, [player, playerReady, isPlaying]);

    const play = () => {
        console.log("Play function called:", {
            player: !!player,
            playerReady,
            trackId: trackId,
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
            trackId: trackId,
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
