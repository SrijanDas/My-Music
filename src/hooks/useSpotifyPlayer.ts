"use client";

import { useEffect, useRef, useState } from "react";

interface UseSpotifyPlayerOptions {
    trackId?: string;
    previewUrl?: string | null;
    onReady?: () => void;
    onStateChange?: (state: "playing" | "paused" | "ended") => void;
    onError?: (error: string) => void;
}

export function useSpotifyPlayer(options: UseSpotifyPlayerOptions) {
    const [player, setPlayer] = useState<HTMLAudioElement | null>(null);
    const [playerReady, setPlayerReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;
        setPlayer(audio);

        const handleLoadedData = () => {
            setPlayerReady(true);
            setDuration(audio.duration);
            setError(null);
            options.onReady?.();
        };

        const handlePlay = () => {
            setIsPlaying(true);
            options.onStateChange?.("playing");
        };

        const handlePause = () => {
            setIsPlaying(false);
            options.onStateChange?.("paused");
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            options.onStateChange?.("ended");
        };

        const handleError = () => {
            const errorMessage = "Audio playback error";
            setError(errorMessage);
            options.onError?.(errorMessage);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        // Add event listeners
        audio.addEventListener("loadeddata", handleLoadedData);
        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("error", handleError);
        audio.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            audio.removeEventListener("loadeddata", handleLoadedData);
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("pause", handlePause);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("error", handleError);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, [options]);

    // Update audio source when trackId or previewUrl changes
    useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;

        if (options.previewUrl) {
            audio.src = options.previewUrl;
            audio.load();
        } else {
            // No preview available
            setError("No preview available for this track");
            setPlayerReady(false);
        }
    }, [options.trackId, options.previewUrl]);

    const play = () => {
        if (player && playerReady) {
            player.play().catch((error) => {
                console.error("Play error:", error);
                setError("Failed to play audio");
            });
        }
    };

    const pause = () => {
        if (player) {
            player.pause();
        }
    };

    const seekTo = (time: number) => {
        if (player && playerReady) {
            player.currentTime = time;
            setCurrentTime(time);
        }
    };

    const setVolume = (volume: number) => {
        if (player) {
            player.volume = Math.max(0, Math.min(1, volume));
        }
    };

    return {
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
        setVolume,
    };
}
