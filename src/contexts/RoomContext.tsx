"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import { supabase } from "@/lib/supabase";
import { Room, QueueItem, RoomUser, Message, Song } from "@/lib/types";
import { useAuth } from "./AuthContext";

interface RoomContextType {
    room: Room | null;
    queueItems: QueueItem[];
    roomUsers: RoomUser[];
    messages: Message[];
    isCreator: boolean;
    joinRoom: (roomId: string) => Promise<boolean>;
    leaveRoom: () => Promise<void>;
    updatePlaybackState: (
        isPlaying: boolean,
        position: number
    ) => Promise<void>;
    updateCurrentSong: (song: Song | null, position: number) => Promise<void>;
    addToQueue: (song: Song) => Promise<void>;
    removeFromQueue: (queueItemId: string) => Promise<void>;
    reorderQueue: (fromIndex: number, toIndex: number) => Promise<void>;
    sendMessage: (content: string) => Promise<void>;
    skipToNext: () => Promise<void>;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [room, setRoom] = useState<Room | null>(null);
    const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
    const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);

    const isCreator = room?.creator_id === user?.id;

    // Subscribe to room changes
    useEffect(() => {
        if (!room?.id) return;

        const roomChannel = supabase
            .channel(`room-${room.id}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "rooms",
                    filter: `id=eq.${room.id}`,
                },
                (payload) => {
                    if (payload.eventType === "UPDATE") {
                        setRoom((prev) =>
                            prev ? { ...prev, ...payload.new } : null
                        );
                    }
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "queue_items",
                    filter: `room_id=eq.${room.id}`,
                },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        setQueueItems((prev) =>
                            [...prev, payload.new as QueueItem].sort(
                                (a, b) => a.position - b.position
                            )
                        );
                    } else if (payload.eventType === "DELETE") {
                        setQueueItems((prev) =>
                            prev.filter((item) => item.id !== payload.old.id)
                        );
                    } else if (payload.eventType === "UPDATE") {
                        setQueueItems((prev) =>
                            prev
                                .map((item) =>
                                    item.id === payload.new.id
                                        ? (payload.new as QueueItem)
                                        : item
                                )
                                .sort((a, b) => a.position - b.position)
                        );
                    }
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "room_users",
                    filter: `room_id=eq.${room.id}`,
                },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        setRoomUsers((prev) => [
                            ...prev,
                            payload.new as RoomUser,
                        ]);
                    } else if (payload.eventType === "DELETE") {
                        setRoomUsers((prev) =>
                            prev.filter((user) => user.id !== payload.old.id)
                        );
                    }
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `room_id=eq.${room.id}`,
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new as Message]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(roomChannel);
        };
    }, [room?.id]);

    const joinRoom = useCallback(
        async (roomId: string): Promise<boolean> => {
            if (!user) return false;

            try {
                // Get room details
                const { data: roomData, error: roomError } = await supabase
                    .from("rooms")
                    .select("*")
                    .eq("id", roomId)
                    .single();

                if (roomError || !roomData) return false;

                // Join the room
                const { error: joinError } = await supabase
                    .from("room_users")
                    .insert({
                        room_id: roomId,
                        user_id: user.id,
                    });

                if (joinError && !joinError.message.includes("duplicate"))
                    return false;

                // Get queue items
                const { data: queueData } = await supabase
                    .from("queue_items")
                    .select("*")
                    .eq("room_id", roomId)
                    .order("position");

                // Get room users
                const { data: usersData } = await supabase
                    .from("room_users")
                    .select("*, user:users(*)")
                    .eq("room_id", roomId);

                // Get recent messages
                const { data: messagesData } = await supabase
                    .from("messages")
                    .select("*, user:users(*)")
                    .eq("room_id", roomId)
                    .order("created_at", { ascending: true })
                    .limit(50);

                setRoom(roomData);
                setQueueItems(queueData || []);
                setRoomUsers(usersData || []);
                setMessages(messagesData || []);

                return true;
            } catch (error) {
                console.error("Error joining room:", error);
                return false;
            }
        },
        [user]
    );

    const leaveRoom = useCallback(async () => {
        if (!room || !user) return;

        try {
            // If creator is leaving, delete the room
            if (isCreator) {
                await supabase.from("rooms").delete().eq("id", room.id);
            } else {
                // Just remove user from room
                await supabase
                    .from("room_users")
                    .delete()
                    .eq("room_id", room.id)
                    .eq("user_id", user.id);
            }

            setRoom(null);
            setQueueItems([]);
            setRoomUsers([]);
            setMessages([]);
        } catch (error) {
            console.error("Error leaving room:", error);
        }
    }, [room, user, isCreator]);

    const updatePlaybackState = useCallback(
        async (isPlaying: boolean, position: number) => {
            if (!room || !isCreator) return;

            try {
                await supabase
                    .from("rooms")
                    .update({
                        is_playing: isPlaying,
                        current_position: position,
                    })
                    .eq("id", room.id);
            } catch (error) {
                console.error("Error updating playback state:", error);
            }
        },
        [room, isCreator]
    );

    const updateCurrentSong = useCallback(
        async (song: Song | null, position: number = 0) => {
            if (!room || !isCreator) return;

            try {
                await supabase
                    .from("rooms")
                    .update({
                        current_song: song,
                        current_position: position,
                        is_playing: !!song,
                    })
                    .eq("id", room.id);
            } catch (error) {
                console.error("Error updating current song:", error);
            }
        },
        [room, isCreator]
    );

    const addToQueue = useCallback(
        async (song: Song) => {
            if (!room || !user) return;

            try {
                // First, ensure the song exists in the songs table
                const { error: songError } = await supabase
                    .from("songs")
                    .upsert(song);

                if (songError) throw songError;

                // Get the next position
                const { data: lastItem } = await supabase
                    .from("queue_items")
                    .select("position")
                    .eq("room_id", room.id)
                    .order("position", { ascending: false })
                    .limit(1)
                    .single();

                const nextPosition = (lastItem?.position || 0) + 1;

                // Add to queue
                await supabase.from("queue_items").insert({
                    room_id: room.id,
                    song: song,
                    position: nextPosition,
                    added_by: user.id,
                });
            } catch (error) {
                console.error("Error adding to queue:", error);
            }
        },
        [room, user]
    );

    const removeFromQueue = useCallback(
        async (queueItemId: string) => {
            if (!room || !isCreator) return;

            try {
                await supabase
                    .from("queue_items")
                    .delete()
                    .eq("id", queueItemId);
            } catch (error) {
                console.error("Error removing from queue:", error);
            }
        },
        [room, isCreator]
    );

    const reorderQueue = useCallback(
        async (fromIndex: number, toIndex: number) => {
            if (!room || !isCreator) return;

            try {
                const reorderedItems = [...queueItems];
                const [movedItem] = reorderedItems.splice(fromIndex, 1);
                reorderedItems.splice(toIndex, 0, movedItem);

                // Update positions
                const updates = reorderedItems.map((item, index) => ({
                    id: item.id,
                    position: index + 1,
                }));

                for (const update of updates) {
                    await supabase
                        .from("queue_items")
                        .update({ position: update.position })
                        .eq("id", update.id);
                }
            } catch (error) {
                console.error("Error reordering queue:", error);
            }
        },
        [room, isCreator, queueItems]
    );

    const sendMessage = useCallback(
        async (content: string) => {
            if (!room || !user || !content.trim()) return;

            try {
                await supabase.from("messages").insert({
                    room_id: room.id,
                    user_id: user.id,
                    content: content.trim(),
                });
            } catch (error) {
                console.error("Error sending message:", error);
            }
        },
        [room, user]
    );

    const skipToNext = useCallback(async () => {
        if (!room || !isCreator || queueItems.length === 0) return;

        try {
            // Remove the first item from queue
            const nextItem = queueItems[0];
            await supabase.from("queue_items").delete().eq("id", nextItem.id);

            // Set the next song as current
            const newCurrentSong =
                queueItems.length > 1 ? queueItems[1].song : null;
            await updateCurrentSong(newCurrentSong);
        } catch (error) {
            console.error("Error skipping to next:", error);
        }
    }, [room, isCreator, queueItems, updateCurrentSong]);

    const value = {
        room,
        queueItems,
        roomUsers,
        messages,
        isCreator,
        joinRoom,
        leaveRoom,
        updatePlaybackState,
        updateCurrentSong,
        addToQueue,
        removeFromQueue,
        reorderQueue,
        sendMessage,
        skipToNext,
    };

    return (
        <RoomContext.Provider value={value}>{children}</RoomContext.Provider>
    );
}

export function useRoom() {
    const context = useContext(RoomContext);
    if (context === undefined) {
        throw new Error("useRoom must be used within a RoomProvider");
    }
    return context;
}
