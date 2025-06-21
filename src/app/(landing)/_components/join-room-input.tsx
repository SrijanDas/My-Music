"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

function JoinRoomInput() {
  const [roomCode, setRoomCode] = useState("");

  return (
    <>
      <div className="flex w-full gap-2 sm:w-auto">
        <Input
          placeholder="Enter room code..."
          value={roomCode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setRoomCode(e.target.value)
          }
          className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
        />
        <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
          Join Room
        </Button>
      </div>
      <span className="text-sm text-white/60">or</span>
      <Link href="/">
        <Button
          size="lg"
          className="w-full bg-white text-purple-900 hover:bg-white/90 sm:w-auto"
        >
          Create New Room
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </>
  );
}

export default JoinRoomInput;
