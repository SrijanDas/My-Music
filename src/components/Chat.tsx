"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useRoom } from "@/contexts/RoomContext";
import { useAuth } from "@/contexts/AuthContext";

export function Chat() {
    const { messages, sendMessage } = useRoom();
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop =
                scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!message.trim()) return;

        await sendMessage(message);
        setMessage("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ScrollArea className="h-64" ref={scrollAreaRef}>
                    <div className="space-y-2">
                        {messages.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">
                                No messages yet
                            </p>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`p-2 rounded-lg max-w-[80%] ${
                                        msg.user_id === user?.id
                                            ? "bg-blue-500 text-white ml-auto"
                                            : "bg-gray-100"
                                    }`}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1">
                                            {msg.user_id !== user?.id && (
                                                <p className="text-xs font-medium mb-1">
                                                    {msg.user?.username ||
                                                        "Unknown User"}
                                                </p>
                                            )}
                                            <p className="text-sm">
                                                {msg.content}
                                            </p>
                                        </div>
                                        <span className="text-xs opacity-70 flex-shrink-0">
                                            {formatTime(msg.created_at)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>

                <div className="flex gap-2">
                    <Input
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <Button onClick={handleSend} disabled={!message.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
