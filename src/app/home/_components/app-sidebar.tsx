"use client";

import { useState } from "react";
import { mockJoinedRooms } from "~/lib/dashboard-mock-data";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Music, Plus, Users, Radio } from "lucide-react";
import Link from "next/link";

interface DashboardSidebarProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export default function AppSidebar({
  onCreateRoom,
  onJoinRoom,
}: DashboardSidebarProps) {
  const [joinedRooms] = useState(mockJoinedRooms);

  const activeRooms = joinedRooms.filter((room) => room.isActive);
  const recentRooms = joinedRooms.filter((room) => !room.isActive).slice(0, 4);

  return (
    <Sidebar className="border-r border-gray-700 bg-gray-900">
      <SidebarHeader className="border-b border-gray-700 bg-gray-900 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-purple-600">
            <Music className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">MusicRoom</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gray-900">
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="space-y-2 p-2">
              <Button
                onClick={onCreateRoom}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Room
              </Button>
              <Button
                onClick={onJoinRoom}
                variant="outline"
                className="w-full border-gray-600 text-white hover:bg-gray-700"
              >
                <Users className="mr-2 h-4 w-4" />
                Join Room
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {activeRooms.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 text-gray-400">
              <Radio className="h-4 w-4" />
              Active Rooms
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {activeRooms.map((room) => (
                  <SidebarMenuItem key={room.id}>
                    <SidebarMenuButton asChild className="hover:bg-gray-700">
                      <Link href={`/room/${room.id}`}>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="truncate font-medium text-white">
                              {room.name}
                            </span>
                            <Badge
                              variant="secondary"
                              className="border-green-500/30 bg-green-500/20 text-xs text-green-400"
                            >
                              {room.memberCount}
                            </Badge>
                          </div>
                          {room.currentSong && (
                            <div className="truncate text-xs text-gray-400">
                              ♪ {room.currentSong.title}
                            </div>
                          )}
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {recentRooms.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400">
              Recent
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {recentRooms.map((room) => (
                  <SidebarMenuItem key={room.id}>
                    <SidebarMenuButton asChild className="hover:bg-gray-700">
                      <Link href={`/room/${room.id}`}>
                        <div className="min-w-0 flex-1">
                          <span className="truncate text-sm font-medium text-gray-300">
                            {room.name}
                          </span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
