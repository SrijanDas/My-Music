export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
}

export interface User {
  id: string;
  name: string;
  isHost: boolean;
}

export interface Room {
  id: string;
  name: string;
  currentSong: Song | null | undefined;
  queue: (Song | null | undefined)[];
  users: User[];
  isPlaying: boolean;
  currentTime: number;
}

export const mockSongs: Song[] = [
  {
    id: "song_1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 200,
    coverUrl: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "song_2",
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    duration: 174,
    coverUrl: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "song_3",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: 203,
    coverUrl: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "song_4",
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    duration: 178,
    coverUrl: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "song_5",
    title: "Stay",
    artist: "The Kid LAROI & Justin Bieber",
    album: "F*CK LOVE 3: OVER YOU",
    duration: 141,
    coverUrl: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "song_6",
    title: "Heat Waves",
    artist: "Glass Animals",
    album: "Dreamland",
    duration: 238,
    coverUrl: "/placeholder.svg?height=60&width=60",
  },
];

export const mockUsers: User[] = [
  { id: "user_1", name: "Alex", isHost: true },
  { id: "user_2", name: "Sam", isHost: false },
  { id: "user_3", name: "Jordan", isHost: false },
];

export const mockRoom: Room = {
  id: "room_1",
  name: "Alex's Music Room",
  currentSong: mockSongs[0],
  queue: [mockSongs[1], mockSongs[2], mockSongs[3]],
  users: mockUsers,
  isPlaying: true,
  currentTime: 45,
};
