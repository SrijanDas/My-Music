import { Users, ListMusic, Shuffle, Save } from "lucide-react";

export const features = [
  {
    icon: <Users className="h-6 w-6" />,
    title: "Listen Together",
    description:
      "Join friends in real-time music rooms and enjoy synchronized listening experiences.",
  },
  {
    icon: <ListMusic className="h-6 w-6" />,
    title: "Collaborative Queue",
    description:
      "Everyone can add, remove, and reorder songs in the shared queue democratically.",
  },
  {
    icon: <Shuffle className="h-6 w-6" />,
    title: "Easy Reordering",
    description:
      "Drag and drop to rearrange the queue exactly how your group wants it.",
  },
  {
    icon: <Save className="h-6 w-6" />,
    title: "Save Playlists",
    description:
      "Room hosts can save the perfect queue as a playlist for future listening sessions.",
  },
];

export const testimonials = [
  {
    name: "Alex Chen",
    role: "Music Enthusiast",
    content:
      "Finally, a way to listen to music with friends without the chaos. Everyone gets a say!",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    role: "Party Host",
    content:
      "Perfect for parties! No more fighting over the aux cord. Everyone can contribute.",
    rating: 5,
  },
  {
    name: "Mike Rodriguez",
    role: "Remote Worker",
    content:
      "Great for virtual hangouts with colleagues. We discovered so much new music together.",
    rating: 5,
  },
];
