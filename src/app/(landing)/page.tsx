import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Music, Play, Headphones, Zap } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import JoinRoomInput from "./_components/join-room-input";
import { features } from "./_components/demo-data";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
              <Music className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MusicRoom</span>
          </div>

          <form
            action={async () => {
              "use server";

              const session = await auth();

              if (!session.userId) {
                return redirect("/sign-in");
              }

              return redirect("/home");
            }}
          >
            <Button
              variant="outline"
              className="border-white/20 text-black hover:bg-white/10"
            >
              Get Started
              <Play className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="mx-auto max-w-4xl">
          <Badge className="mb-6 border-white/20 bg-white/10 text-white">
            <Zap className="mr-1 h-3 w-3" />
            Now Live
          </Badge>

          <h1 className="mb-6 text-4xl leading-tight font-bold text-white md:text-6xl">
            Listen to Music
            <br />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Together
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-xl text-white/80">
            Create shared music rooms where everyone can add songs, control the
            queue, and enjoy synchronized listening experiences with friends.
          </p>

          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <JoinRoomInput />
          </div>

          {/* Stats */}
          <div className="mx-auto grid max-w-md grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">69</div>
              <div className="text-sm text-white/60">Active Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">69</div>
              <div className="text-sm text-white/60">Songs Played</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">69%</div>
              <div className="text-sm text-white/60">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Everything You Need for Group Listening
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/70">
            Powerful features designed to make collaborative music listening
            seamless and fun.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-white/20 bg-white/10 p-6 backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              <div className="mb-4 text-purple-400">{feature.icon}</div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-white/70">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            How It Works
          </h2>
          <p className="text-lg text-white/70">
            Get started in three simple steps
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600">
              <span className="text-xl font-bold text-white">1</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              Create or Join
            </h3>
            <p className="text-white/70">
              Start a new music room or join an existing one with a room code.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-600">
              <span className="text-xl font-bold text-white">2</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">Add Songs</h3>
            <p className="text-white/70">
              Browse and add your favorite songs to the shared queue.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
              <span className="text-xl font-bold text-white">3</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              Listen Together
            </h3>
            <p className="text-white/70">
              Enjoy synchronized music with friends and discover new favorites.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* 
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            What People Are Saying
          </h2>
        </div>

       <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-white/20 bg-white/10 p-6 backdrop-blur-sm"
            >
              <div className="mb-4 flex">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-current text-yellow-400"
                  />
                ))}
              </div>
              <p className="mb-4 text-white/80 italic">
                "{testimonial.content}"
              </p>
              <div>
                <div className="font-semibold text-white">
                  {testimonial.name}
                </div>
                <div className="text-sm text-white/60">{testimonial.role}</div>
              </div>
            </Card>
          ))}
        </div> 
      </section>
      */}

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="border-white/20 bg-gradient-to-r from-pink-500/50 to-purple-600/50 p-8 text-center backdrop-blur-sm md:p-12">
          <Headphones className="mx-auto mb-6 h-16 w-16 text-white" />
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Ready to Start Listening Together?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
            Join thousands of music lovers who are already enjoying
            collaborative listening experiences.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/">
              <Button
                size="lg"
                className="w-full bg-white text-purple-900 hover:bg-white/90 sm:w-auto"
              >
                <Play className="mr-2 h-5 w-5" />
                Try Demo Room
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-white/20 text-black hover:bg-white/10 sm:w-auto"
            >
              Learn More
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto border-t border-white/10 px-4 py-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 flex items-center gap-2 md:mb-0">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-white/20">
              <Music className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-white">MusicRoom</span>
          </div>
          <div className="text-sm text-white/60">
            © 2025 MusicRoom. Made with ♪ for music lovers.
          </div>
        </div>
      </footer>
    </div>
  );
}
