"use client";

import { useState } from "react";
import { mockUserProfile, mockJoinedRooms } from "~/lib/dashboard-mock-data";
import { DashboardNavbar } from "./_components/dashboard-navbar";
import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Music, Users, Plus, Search, Radio } from "lucide-react";
import Link from "next/link";

function HomePage() {
  const [userProfile] = useState(mockUserProfile);
  const [joinedRooms] = useState(mockJoinedRooms);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [newRoomName, setNewRoomName] = useState("");

  const activeRooms = joinedRooms.filter((room) => room.isActive);

  const handleCreateRoom = () => {
    setShowCreateRoom(true);
  };

  const handleJoinRoom = () => {
    setShowJoinRoom(true);
  };

  const createRoom = () => {
    alert(`Room "${newRoomName}" created successfully!`);
    setShowCreateRoom(false);
    setNewRoomName("");
  };

  const joinRoom = () => {
    alert(`Joining room with code: ${roomCode}`);
    setShowJoinRoom(false);
    setRoomCode("");
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <SidebarProvider>
        <DashboardSidebar
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
        <SidebarInset>
          <DashboardNavbar />

          <main className="flex-1 space-y-6 bg-gray-950 p-6">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {userProfile.name.split(" ")[0]}!
              </h1>
              <p className="text-gray-400">
                Ready to listen to music with friends?
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="border-gray-700/50 bg-gray-800/50 p-6 backdrop-blur-sm">
                <Button
                  onClick={handleCreateRoom}
                  className="h-16 w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <Plus className="mr-3 h-6 w-6" />
                  <div className="text-left">
                    <div className="font-semibold">Create Room</div>
                    <div className="text-sm opacity-90">
                      Start listening together
                    </div>
                  </div>
                </Button>
              </Card>

              <Card className="border-gray-700/50 bg-gray-800/50 p-6 backdrop-blur-sm">
                <Button
                  onClick={handleJoinRoom}
                  variant="outline"
                  className="h-16 w-full border-gray-600 text-white hover:bg-gray-700/50"
                >
                  <Search className="mr-3 h-6 w-6" />
                  <div className="text-left">
                    <div className="font-semibold">Join Room</div>
                    <div className="text-sm opacity-70">Enter room code</div>
                  </div>
                </Button>
              </Card>
            </div>

            {/* Active Rooms */}
            {activeRooms.length > 0 && (
              <Card className="border-gray-700/50 bg-gray-800/50 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Radio className="h-5 w-5 text-green-400" />
                  <h2 className="text-lg font-semibold text-white">
                    Active Rooms
                  </h2>
                  <Badge className="border-green-500/30 bg-green-500/20 text-green-400">
                    {activeRooms.length}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {activeRooms.slice(0, 4).map((room) => (
                    <Link key={room.id} href={`/room/${room.id}`}>
                      <Card className="cursor-pointer border-gray-600/50 bg-gray-700/30 p-4 transition-colors hover:bg-gray-700/50">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="truncate font-semibold text-white">
                            {room.name}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Users className="h-3 w-3" />
                            <span>{room.memberCount}</span>
                          </div>
                        </div>
                        {room.currentSong && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Music className="h-3 w-3" />
                            <span className="truncate">
                              {room.currentSong.title} -{" "}
                              {room.currentSong.artist}
                            </span>
                          </div>
                        )}
                      </Card>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            {/* Empty State */}
            {activeRooms.length === 0 && (
              <Card className="border-gray-700/50 bg-gray-800/50 p-8 text-center backdrop-blur-sm">
                <Music className="mx-auto mb-4 h-12 w-12 text-gray-500" />
                <h3 className="mb-2 text-lg font-semibold text-white">
                  No active rooms
                </h3>
                <p className="mb-4 text-gray-400">
                  Create a room or join one to start listening with friends
                </p>
                <div className="flex justify-center gap-2">
                  <Button
                    onClick={handleCreateRoom}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    Create Room
                  </Button>
                  <Button
                    onClick={handleJoinRoom}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-700/50"
                  >
                    Join Room
                  </Button>
                </div>
              </Card>
            )}
          </main>
        </SidebarInset>

        {/* Create Room Dialog */}
        <Dialog open={showCreateRoom} onOpenChange={setShowCreateRoom}>
          <DialogContent className="border-gray-700 bg-gray-900/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Room</DialogTitle>
              <DialogDescription className="text-gray-400">
                Give your music room a name and start listening with friends.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter room name..."
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="border-gray-600 bg-gray-800 text-white placeholder:text-gray-500"
              />
              <div className="flex gap-2">
                <Button
                  onClick={createRoom}
                  disabled={!newRoomName.trim()}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  Create Room
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateRoom(false)}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Join Room Dialog */}
        <Dialog open={showJoinRoom} onOpenChange={setShowJoinRoom}>
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
                  onClick={joinRoom}
                  disabled={!roomCode.trim()}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  Join Room
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowJoinRoom(false)}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarProvider>
    </div>
  );
}

export default HomePage;
