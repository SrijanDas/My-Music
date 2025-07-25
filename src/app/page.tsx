"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, Users, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/AuthForm";
import { CreateRoomDialog } from "@/components/CreateRoomDialog";
import { supabase } from "@/lib/supabase";
import { Room } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
    const { user, loading, signOut } = useAuth();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            fetchRooms();
        }
    }, [user]);

    const fetchRooms = async () => {
        setLoadingRooms(true);
        try {
            const { data, error } = await supabase
                .from("rooms")
                .select(
                    `
          *,
          creator:users(username),
          room_users(count)
        `
                )
                .order("created_at", { ascending: false });

            if (error) throw error;
            setRooms(data || []);
        } catch {
            toast.error("Failed to fetch rooms");
        } finally {
            setLoadingRooms(false);
        }
    };

    const handleJoinRoom = (roomId: string) => {
        router.push(`/room/${roomId}`);
    };

    const handleSignOut = async () => {
        await signOut();
        toast.success("Signed out successfully");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <AuthForm />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Music Rooms</h1>
                        <p className="text-muted-foreground">
                            Listen to music together in sync
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                    {user.user_metadata?.username
                                        ?.slice(0, 2)
                                        .toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                                {user.user_metadata?.username || user.email}
                            </span>
                        </div>
                        <Button variant="outline" onClick={handleSignOut}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Available Rooms</h2>
                    <CreateRoomDialog />
                </div>

                {loadingRooms ? (
                    <div className="text-center py-8">
                        <p>Loading rooms...</p>
                    </div>
                ) : rooms.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <h3 className="text-lg font-medium mb-2">
                                No rooms available
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Create the first room and start listening to
                                music with others!
                            </p>
                            <CreateRoomDialog />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rooms.map((room) => (
                            <Card
                                key={room.id}
                                className="hover:shadow-md transition-shadow"
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        {room.name}
                                        {room.creator_id === user.id && (
                                            <Crown className="h-4 w-4 text-yellow-500" />
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        Created by{" "}
                                        {room.creator?.username || "Unknown"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {room.current_song && (
                                            <div className="text-sm">
                                                <p className="font-medium">
                                                    Now Playing:
                                                </p>
                                                <p className="text-muted-foreground truncate">
                                                    {room.current_song.title} -{" "}
                                                    {room.current_song.artist}
                                                </p>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Users className="h-4 w-4" />
                                                <span>
                                                    {room.room_users?.[0]
                                                        ?.count || 0}{" "}
                                                    users
                                                </span>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    handleJoinRoom(room.id)
                                                }
                                            >
                                                Join Room
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
