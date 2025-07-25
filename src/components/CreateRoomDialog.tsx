"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CreateRoomDialog() {
    const [roomName, setRoomName] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const handleCreate = async () => {
        if (!roomName.trim() || !user) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("rooms")
                .insert({
                    name: roomName.trim(),
                    creator_id: user.id,
                    current_position: 0,
                    is_playing: false,
                })
                .select()
                .single();

            if (error) throw error;

            toast.success("Room created successfully!");
            setOpen(false);
            setRoomName("");
            router.push(`/room/${data.id}`);
        } catch {
            toast.error("Failed to create room");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleCreate();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Room
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Room</DialogTitle>
                    <DialogDescription>
                        Create a new music room where you can listen to music
                        with others.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="roomName">Room Name</Label>
                        <Input
                            id="roomName"
                            placeholder="Enter room name..."
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            maxLength={50}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={!roomName.trim() || loading}
                        >
                            {loading ? "Creating..." : "Create Room"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
