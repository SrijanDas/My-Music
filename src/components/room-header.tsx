import type { Room, User } from "~/lib/mock-data"
import { Card } from "~/components/ui/card"
import { Users, Crown } from "lucide-react"

interface RoomHeaderProps {
  room: Room
  currentUser: User
}

export function RoomHeader({ room, currentUser }: RoomHeaderProps) {
  return (
    <Card className="p-4 mb-6 bg-white/10 backdrop-blur-sm border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{room.name}</h1>
          <p className="text-white/70 text-sm">Room ID: {room.id}</p>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <Users className="w-4 h-4" />
          <span className="text-sm">{room.users.length}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center gap-1 text-white">
          {currentUser.isHost && <Crown className="w-4 h-4 text-yellow-400" />}
          <span className="text-sm font-medium">{currentUser.name}</span>
          {currentUser.isHost && <span className="text-xs text-yellow-400">(Host)</span>}
        </div>
      </div>
    </Card>
  )
}
