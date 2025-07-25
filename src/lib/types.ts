export interface User {
    id: string;
    email: string;
    username: string;
    created_at: string;
}

export interface Room {
    id: string;
    name: string;
    creator_id: string;
    current_song?: Song;
    current_position: number;
    is_playing: boolean;
    created_at: string;
    creator?: User;
    room_users?: { count: number }[];
}

export interface Song {
    id: string;
    spotify_id: string;
    title: string;
    artist: string;
    duration: number;
    thumbnail: string;
    preview_url: string | null;
    spotify_url: string;
}

export interface QueueItem {
    id: string;
    room_id: string;
    song: Song;
    position: number;
    added_by: string;
    created_at: string;
}

export interface RoomUser {
    id: string;
    room_id: string;
    user_id: string;
    joined_at: string;
    user?: User;
}

export interface Message {
    id: string;
    room_id: string;
    user_id: string;
    content: string;
    created_at: string;
    user?: User;
}

export interface Database {
    public: {
        Tables: {
            users: {
                Row: User;
                Insert: Omit<User, "id" | "created_at">;
                Update: Partial<Omit<User, "id" | "created_at">>;
            };
            rooms: {
                Row: Room;
                Insert: Omit<Room, "id" | "created_at">;
                Update: Partial<Omit<Room, "id" | "created_at">>;
            };
            songs: {
                Row: Song;
                Insert: Omit<Song, "id">;
                Update: Partial<Omit<Song, "id">>;
            };
            queue_items: {
                Row: QueueItem;
                Insert: Omit<QueueItem, "id" | "created_at">;
                Update: Partial<Omit<QueueItem, "id" | "created_at">>;
            };
            room_users: {
                Row: RoomUser;
                Insert: Omit<RoomUser, "id" | "joined_at">;
                Update: Partial<Omit<RoomUser, "id" | "joined_at">>;
            };
            messages: {
                Row: Message;
                Insert: Omit<Message, "id" | "created_at">;
                Update: Partial<Omit<Message, "id" | "created_at">>;
            };
        };
    };
}
