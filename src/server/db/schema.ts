import {
    int,
    bigint,
    text,
    singlestoreTable,
    timestamp,
    boolean,
} from "drizzle-orm/singlestore-core";

export const users = singlestoreTable("users", {
    id: text("id").primaryKey().notNull(),
    username: text("username"),
    email: text("email"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
    isActive: boolean("is_active").default(false),
});

export const rooms = singlestoreTable("rooms", {
    id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    lastActivity: timestamp("last_activity").onUpdateNow(),
    ownerId: text("owner_id").notNull(),
    isActive: boolean("is_active").default(false),
    memberCount: int("member_count").default(0),
    currentSongTitle: text("current_song_title")
        .$type<string | null>()
        .default(null),
    currentSongArtist: text("current_song_artist")
        .$type<string | null>()
        .default(null),
});

export const roomMembers = singlestoreTable("room_members", {
    id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
    roomId: bigint("room_id", { mode: "bigint" }).notNull(),
    userId: text("user_id").notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    isActive: boolean("is_active").default(false),
});
