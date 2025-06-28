"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { rooms } from "../db/schema";
import { handleError, handleSuccess } from "~/lib/action-response-handler";

export async function createRoom({
    roomName,
    ownerId,
}: {
    roomName: string;
    ownerId: string;
}) {
    try {
        const [{ insertId }] = await db.insert(rooms).values({
            name: roomName,
            ownerId: ownerId,
        });

        return handleSuccess({
            id: insertId,
        });
    } catch (error) {
        console.error("Error creating room:", error);
        return handleError(error);
    }
}

export async function joinRoom({
    roomCode,
    userId,
}: {
    roomCode: string;
    userId: string;
}) {
    try {
        // Simulate room joining logic
        // In a real application, you would check if the room exists and if the user is allowed to join
        const roomId = BigInt(roomCode);
        const [room] = await db
            .select()
            .from(rooms)
            .where(eq(rooms.id, roomId));

        if (!room) {
            throw new Error("Room not found");
        }

        // Logic to add user to the room would go here

        return handleSuccess({
            id: room.id,
            name: room.name,
        });
    } catch (error) {
        console.error("Error joining room:", error);
        return handleError(error);
    }
}
