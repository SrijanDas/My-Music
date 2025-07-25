"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, User } from "lucide-react";
import { useRoom } from "@/contexts/RoomContext";

export function UserList() {
    const { room, roomUsers } = useRoom();

    const getInitials = (username: string) => {
        return username.slice(0, 2).toUpperCase();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Users ({roomUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {roomUsers.map((roomUser) => (
                        <div
                            key={roomUser.id}
                            className="flex items-center gap-3 p-2 rounded-lg"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                    {roomUser.user?.username ? (
                                        getInitials(roomUser.user.username)
                                    ) : (
                                        <User className="h-4 w-4" />
                                    )}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-sm font-medium">
                                    {roomUser.user?.username || "Unknown User"}
                                </p>
                            </div>
                            {roomUser.user_id === room?.creator_id && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
