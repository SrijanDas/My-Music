// Spotify Web Playback SDK integration for full song playback
// Requires Spotify Premium subscription

interface SpotifySDK {
    Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume: number;
    }) => SpotifyPlayer;
}

interface SpotifyPlayer {
    addListener: (event: string, callback: (data: unknown) => void) => void;
    connect: () => Promise<boolean>;
    disconnect: () => void;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    seek: (position_ms: number) => Promise<void>;
    setVolume: (volume: number) => Promise<void>;
    getCurrentState: () => Promise<SpotifyPlayerState | null>;
}

interface SpotifyTrack {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    duration_ms: number;
    uri: string;
}

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify: SpotifySDK;
    }
}

export interface SpotifyPlayerState {
    device_id: string | null;
    is_premium: boolean;
    is_ready: boolean;
    is_playing: boolean;
    current_track: SpotifyTrack | null;
    position: number;
    duration: number;
}

type EventCallback = (data: unknown) => void;

interface SpotifyErrorEvent {
    message: string;
}

interface SpotifyDeviceEvent {
    device_id: string;
}

export class SpotifyWebPlayer {
    private player: SpotifyPlayer | null = null;
    private deviceId: string | null = null;
    private accessToken: string | null = null;
    private listeners: { [key: string]: EventCallback[] } = {};

    constructor() {
        this.setupSDK();
    }

    // Setup Spotify Web Playback SDK
    private setupSDK() {
        if (typeof window === "undefined") return;

        // Check if SDK is already loaded
        if (window.Spotify) {
            this.initializePlayer();
            return;
        }

        // Load SDK
        window.onSpotifyWebPlaybackSDKReady = () => {
            this.initializePlayer();
        };

        if (!document.querySelector('script[src*="sdk.scdn.co"]')) {
            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }

    // Initialize the player
    private async initializePlayer() {
        if (!window.Spotify || !this.accessToken) return;

        this.player = new window.Spotify.Player({
            name: "Music Rooms Web Player",
            getOAuthToken: (cb: (token: string) => void) => {
                cb(this.accessToken || "");
            },
            volume: 0.5,
        });

        // Error handling
        this.player.addListener("initialization_error", ({ message }: any) => {
            console.error("Failed to initialize:", message);
            this.emit("error", { type: "initialization_error", message });
        });

        this.player.addListener("authentication_error", ({ message }: any) => {
            console.error("Failed to authenticate:", message);
            this.emit("error", { type: "authentication_error", message });
        });

        this.player.addListener("account_error", ({ message }: any) => {
            console.error("Failed to validate Spotify account:", message);
            this.emit("error", { type: "account_error", message });
        });

        this.player.addListener("playback_error", ({ message }: any) => {
            console.error("Failed to perform playback:", message);
            this.emit("error", { type: "playback_error", message });
        });

        // Playback status updates
        this.player.addListener("player_state_changed", (state: any) => {
            if (!state) return;

            this.emit("state_changed", {
                is_playing: !state.paused,
                current_track: state.track_window.current_track,
                position: state.position,
                duration: state.duration,
                device_id: this.deviceId,
                is_premium: true,
                is_ready: true,
            });
        });

        // Ready
        this.player.addListener("ready", ({ device_id }: any) => {
            console.log("Ready with Device ID", device_id);
            this.deviceId = device_id;
            this.emit("ready", { device_id });
        });

        // Not Ready
        this.player.addListener("not_ready", ({ device_id }: any) => {
            console.log("Device ID has gone offline", device_id);
            this.emit("not_ready", { device_id });
        });

        // Connect to the player
        const connected = await this.player.connect();
        if (connected) {
            console.log("Successfully connected to Spotify!");
        }
    }

    // Set access token (from OAuth)
    setAccessToken(token: string) {
        this.accessToken = token;
        if (window.Spotify && !this.player) {
            this.initializePlayer();
        }
    }

    // Play a track by URI
    async playTrack(uri: string, position_ms: number = 0) {
        if (!this.deviceId || !this.accessToken) {
            throw new Error("Player not ready or no access token");
        }

        try {
            const response = await fetch(
                `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        uris: [uri],
                        position_ms,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || "Failed to play track");
            }
        } catch (error) {
            console.error("Error playing track:", error);
            throw error;
        }
    }

    // Control playback
    async pause() {
        if (this.player) {
            await this.player.pause();
        }
    }

    async resume() {
        if (this.player) {
            await this.player.resume();
        }
    }

    async seek(position_ms: number) {
        if (this.player) {
            await this.player.seek(position_ms);
        }
    }

    async setVolume(volume: number) {
        if (this.player) {
            await this.player.setVolume(volume);
        }
    }

    // Get current state
    async getCurrentState(): Promise<SpotifyPlayerState | null> {
        if (this.player) {
            return await this.player.getCurrentState();
        }
        return null;
    }

    // Event handling
    on(event: string, callback: Function) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event: string, callback: Function) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(
                (cb) => cb !== callback
            );
        }
    }

    private emit(event: string, data: any) {
        if (this.listeners[event]) {
            this.listeners[event].forEach((callback) => callback(data));
        }
    }

    // Cleanup
    disconnect() {
        if (this.player) {
            this.player.disconnect();
            this.player = null;
            this.deviceId = null;
        }
    }

    // Check if premium account
    async checkPremium(): Promise<boolean> {
        if (!this.accessToken) return false;

        try {
            const response = await fetch("https://api.spotify.com/v1/me", {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });

            if (response.ok) {
                const user = await response.json();
                return user.product === "premium";
            }
        } catch (error) {
            console.error("Error checking premium status:", error);
        }

        return false;
    }
}

// Singleton instance
let spotifyPlayer: SpotifyWebPlayer | null = null;

export function getSpotifyPlayer(): SpotifyWebPlayer {
    if (!spotifyPlayer) {
        spotifyPlayer = new SpotifyWebPlayer();
    }
    return spotifyPlayer;
}
