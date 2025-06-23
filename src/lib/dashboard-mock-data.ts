export interface JoinedRoom {
  id: string;
  name: string;
  hostName: string;
  memberCount: number;
  isActive: boolean;
  lastActivity: string;
  currentSong?: {
    title: string;
    artist: string;
  };
}

export interface Notification {
  id: string;
  type: "room_invite" | "new_song" | "room_activity";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  roomId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedRoomsCount: number;
  createdRoomsCount: number;
  totalListeningTime: number; // in minutes
}

export const mockUserProfile: UserProfile = {
  id: "user_1",
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "/placeholder.svg?height=40&width=40",
  joinedRoomsCount: 12,
  createdRoomsCount: 3,
  totalListeningTime: 2847,
};

export const mockJoinedRooms: JoinedRoom[] = [
  {
    id: "room_1",
    name: "Alex's Music Room",
    hostName: "Alex Johnson",
    memberCount: 4,
    isActive: true,
    lastActivity: "2 minutes ago",
    currentSong: {
      title: "Blinding Lights",
      artist: "The Weeknd",
    },
  },
  {
    id: "room_2",
    name: "Friday Night Vibes",
    hostName: "Sarah Chen",
    memberCount: 8,
    isActive: true,
    lastActivity: "5 minutes ago",
    currentSong: {
      title: "Levitating",
      artist: "Dua Lipa",
    },
  },
  {
    id: "room_3",
    name: "Study Session",
    hostName: "Mike Rodriguez",
    memberCount: 3,
    isActive: false,
    lastActivity: "1 hour ago",
  },
  {
    id: "room_4",
    name: "Workout Playlist",
    hostName: "Emma Wilson",
    memberCount: 6,
    isActive: true,
    lastActivity: "15 minutes ago",
    currentSong: {
      title: "Good 4 U",
      artist: "Olivia Rodrigo",
    },
  },
  {
    id: "room_5",
    name: "Chill Lounge",
    hostName: "David Kim",
    memberCount: 2,
    isActive: false,
    lastActivity: "3 hours ago",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "notif_1",
    type: "room_invite",
    title: "Room Invitation",
    message: "Sarah invited you to join 'Weekend Hits'",
    timestamp: "5 minutes ago",
    isRead: false,
    roomId: "room_6",
  },
  {
    id: "notif_2",
    type: "new_song",
    title: "New Song Added",
    message: "Mike added 'Bohemian Rhapsody' to Study Session",
    timestamp: "1 hour ago",
    isRead: false,
    roomId: "room_3",
  },
  {
    id: "notif_3",
    type: "room_activity",
    title: "Room Activity",
    message: "Friday Night Vibes has 10 new songs in queue",
    timestamp: "2 hours ago",
    isRead: true,
    roomId: "room_2",
  },
  {
    id: "notif_4",
    type: "room_invite",
    title: "Room Invitation",
    message: "Emma invited you to join 'Morning Motivation'",
    timestamp: "1 day ago",
    isRead: true,
    roomId: "room_7",
  },
];
