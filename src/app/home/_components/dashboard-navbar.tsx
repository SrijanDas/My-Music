"use client";

import { useState } from "react";
import { mockUserProfile, mockNotifications } from "~/lib/dashboard-mock-data";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Bell, Settings, LogOut, User } from "lucide-react";
import { SidebarTrigger } from "~/components/ui/sidebar";

export function DashboardNavbar() {
  const [notifications] = useState(mockNotifications);
  const [userProfile] = useState(mockUserProfile);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-700 bg-gray-900 px-4">
      <SidebarTrigger className="text-white hover:bg-gray-700" />
      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-gray-700"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 p-0 text-xs text-white">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 border-gray-600 bg-gray-800 backdrop-blur-sm"
            align="end"
          >
            <div className="space-y-3">
              <h3 className="font-semibold text-white">Notifications</h3>
              <div className="max-h-60 space-y-2 overflow-y-auto">
                {notifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-lg p-3 ${notification.isRead ? "bg-gray-700/50" : "bg-blue-500/20"}`}
                  >
                    <p className="text-sm font-medium text-white">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {notification.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={userProfile.avatar || "/placeholder.svg"}
                  alt={userProfile.name}
                />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 border-gray-600 bg-gray-800 backdrop-blur-sm"
            align="end"
          >
            <DropdownMenuLabel className="text-white">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{userProfile.name}</p>
                <p className="text-xs text-gray-400">{userProfile.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-600" />
            <DropdownMenuItem className="text-white hover:bg-gray-700">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-gray-700">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-600" />
            <DropdownMenuItem className="text-red-400 hover:bg-red-400/10">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
