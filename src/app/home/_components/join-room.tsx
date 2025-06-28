"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { ModalProps } from "~/hooks/use-modal";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next-nprogress-bar";
import { joinRoom as joinRoomAction } from "~/server/actions/rooms.actions"; // Adjust the import path as necessary

type Props = {
    modal: ModalProps;
};

function JoinRoom({ modal }: Props) {
    const [roomCode, setRoomCode] = useState("");

    const { userId } = useAuth();
    const router = useRouter();

    const joinRoom = async () => {
        if (!userId) {
            throw new Error("User not authenticated");
        }
        const { data, error } = await joinRoomAction({
            roomCode: roomCode.trim(),
            userId: userId,
        });

        if (data) {
            router.push(`/room/${roomCode}`);
        }

        if (error) {
            throw new Error(error);
        }
    };

    const handleJoinRoom = () => {
        if (!userId) {
            toast.error("User not authenticated");
            return;
        }

        // Simulate room joining logic
        toast.promise(joinRoom, {
            loading: "joining...",
            success: () => "Successfully joined the room!",
            error: () =>
                "Failed to join the room. Please check the room code and try again.",
        });
    };

    return (
        <Dialog {...modal}>
            <DialogContent className="border-gray-700 bg-gray-900/95 backdrop-blur-sm">
                <DialogHeader>
                    <DialogTitle className="text-white">Join Room</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Enter the room code to join an existing music room.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Enter room code..."
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        className="border-gray-600 bg-gray-800 text-white placeholder:text-gray-500"
                    />
                    <div className="flex gap-2">
                        <Button
                            onClick={handleJoinRoom}
                            disabled={!roomCode.trim()}
                            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        >
                            Join Room
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => modal.onOpenChange(false)}
                            className="border-gray-600 text-black hover:bg-gray-700"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default JoinRoom;
