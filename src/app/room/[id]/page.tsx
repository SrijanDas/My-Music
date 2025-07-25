"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoom } from "@/contexts/RoomContext";
import { MusicPlayer } from "@/components/MusicPlayer";
import { MusicSearch } from "@/components/MusicSearch";
import { Queue } from "@/components/Queue";
import { Chat } from "@/components/Chat";
import { UserList } from "@/components/UserList";
import { AuthForm } from "@/components/AuthForm";
import { toast } from "sonner";

export default function RoomPage() {
    const { user, loading } = useAuth();
    const { room, joinRoom, leaveRoom } = useRoom();
    const [joining, setJoining] = useState(false);
    const router = useRouter();
    const params = useParams();
    const roomId = params.id as string;

    useEffect(() => {
        const handleJoinRoom = async () => {
            setJoining(true);
            try {
                const success = await joinRoom(roomId);
                if (!success) {
                    toast.error("Failed to join room");
                    router.push("/");
                }
            } catch {
                toast.error("Failed to join room");
                router.push("/");
            } finally {
                setJoining(false);
            }
        };

        if (user && roomId && !room) {
            handleJoinRoom();
        }
    }, [user, roomId, room, joinRoom, router]);

    const handleLeaveRoom = async () => {
        await leaveRoom();
        router.push("/");
    };

    if (loading || joining) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <AuthForm />;
    }

    if (!room) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg mb-4">
                        Room not found or failed to join
                    </p>
                    <Button onClick={() => router.push("/")}>
                        Go Back Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" onClick={handleLeaveRoom}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Leave Room
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{room.name}</h1>
                        <p className="text-muted-foreground">
                            Room created by{" "}
                            {room.creator?.username || "Unknown"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Music Player and Search */}
                    <div className="lg:col-span-2 space-y-6">
                        <MusicPlayer />
                        <MusicSearch />
                        <Queue />
                    </div>

                    {/* Right Column - Chat and User List */}
                    <div className="space-y-6">
                        <UserList />
                        <Chat />
                    </div>
                </div>
            </div>
        </div>
    );
}
