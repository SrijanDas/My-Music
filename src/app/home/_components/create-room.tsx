"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import type { ModalProps } from "~/hooks/use-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "~/components/ui/form";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { createRoom } from "~/server/actions/rooms.actions";
import { useRouter } from "next-nprogress-bar";

type Props = {
    modal: ModalProps;
};

const FormSchema = z.object({
    roomName: z.string().min(1, "Room name is required"),
});

function CreateRoom({ modal }: Props) {
    const { userId } = useAuth();
    const router = useRouter();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            roomName: "",
        },
    });

    const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
        if (!userId) {
            toast.error("User not authenticated");
            return;
        }

        const { data, error } = await createRoom({
            ownerId: userId,
            roomName: formData.roomName,
        });

        if (error) {
            toast.error(error);
            return;
        }

        if (data?.id) {
            toast.success("Room created successfully!");
            router.push(`/room/${data.id}`);
        }
    };

    return (
        <Dialog {...modal}>
            <DialogContent className="border-gray-700 bg-gray-900/95 backdrop-blur-sm">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        Create New Room
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Give your music room a name and start listening with
                        friends.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="roomName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter room name..."
                                                className="border-gray-600 bg-gray-800 text-white placeholder:text-gray-500"
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting}
                                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                                >
                                    Create Room
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => modal.onOpenChange(false)}
                                    className="border-gray-600 hover:bg-gray-700"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CreateRoom;
