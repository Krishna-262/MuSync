'use client';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, Users, Vote, Zap, Shield, Headphones, Play, Heart, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import AppBar from "./components/AppBar"
import { Redirect } from "./components/Redirect"
import { signIn } from "next-auth/react"

export default function MusicStreamingLanding() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center backdrop-blur-sm bg-black/20 border-b border-white/10">
        <AppBar />
        <Redirect />
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="bg-purple-500/20 text-purple-200 border-purple-500/30">
                  🎵 Interactive Music Streaming
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Jam Together ,
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {" "}
                    Choose the Beat
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  A shared space where friends drop YouTube links, vote for the next jam, and let the beat follow the crowd.
                </p>
              </div>
              <div className="space-x-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => signIn()}
                >
                  Start Streaming
                  <Play className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-8 text-sm text-gray-400 mt-8">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>100+ Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Music className="h-4 w-4" />
                  <span>1M+ Songs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>1K+ Votes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-black/20 backdrop-blur-sm">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Rocking The Vibe !</h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to create an interactive music experience for your audience
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                  <Vote className="h-8 w-8 text-purple-400" />
                  <CardTitle className="text-white">Real-Time Voting</CardTitle>
                  </div>
                  <CardDescription className="text-gray-300">
                    Your audience votes on the next song in real-time. Democracy meets music.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-8 w-8 text-blue-400" />
                    <CardTitle className="text-white">Creator Control</CardTitle>
                    </div>
                  <CardDescription className="text-gray-300">
                    Maintain full control with moderation tools, skip options, and custom playlists.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                  <Zap className="h-8 w-8 text-yellow-400" />
                  <CardTitle className="text-white">Platform Integration</CardTitle>
                  </div>
                  <CardDescription className="text-gray-300">
                    Seamlessly integrates with YouTube, Spotify, and other streaming platforms.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                  <Music className="h-8 w-8 text-green-400" />
                  <CardTitle className="text-white">Massive Library</CardTitle>
                  </div>
                  <CardDescription className="text-gray-300">
                    Access millions of copyright-cleared tracks perfect for streaming content.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2 ">
                  <MessageCircle className="h-8 w-8 text-pink-400" />
                  <CardTitle className="text-white">Auto Play</CardTitle>
                  </div>
                  <CardDescription className="text-gray-300">
                    Next most Upvoted stream gets played next without any manual handling .
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                 <div className="flex items-center gap-2">
                 <Headphones className="h-8 w-8 text-cyan-400" />
                  <CardTitle className="text-white">High Quality Audio</CardTitle>
                 </div>
                  <CardDescription className="text-gray-300">
                    Crystal clear audio streaming with zero latency for the perfect experience.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">How It Works</h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get started in minutes and transform your streams forever
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-white">Connect Your Stream</h3>
                <p className="text-gray-300">
                  Paste the Youtube video URL in the input field and submit the Stream easily.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-600">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-white">Audience Votes</h3>
                <p className="text-gray-300">
                  Peers / Pals / Audience can upvote the specific stream and it will be played next.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-white">Enjoy the Vibe</h3>
                <p className="text-gray-300">
                  Watch engagement soar as your community creates the perfect soundtrack together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        {/* <section className="w-full py-12 md:py-24 lg:py-32 bg-black/20 backdrop-blur-sm">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Loved by Creators Worldwide
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of creators who've transformed their streams with interactive music
                </p>
              </div>
            </div>
            <div className="grid w-full grid-cols-2 lg:grid-cols-4 items-center justify-center gap-8 lg:gap-12 py-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <Image
                    src="/placeholder.svg?height=80&width=80"
                    width="80"
                    height="80"
                    alt={`Creator ${i}`}
                    className="rounded-full border-2 border-purple-500/50"
                  />
                  <div className="text-center">
                    <p className="font-semibold text-white">Creator{i}</p>
                    <p className="text-sm text-gray-400">100K+ followers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
                  Ready to Transform Your Streams?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join the music streaming revolution. Your audience is waiting to rock with you.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <form className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="max-w-lg flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={() => signIn()}
                  >
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-gray-400">
                  Free to start. No credit card required.{" "}
                  <Link href="/" className="underline underline-offset-2 text-purple-400">
                    Terms &amp; Conditions
                  </Link>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => signIn()}
                >
                  Start Free Trial
                  <Play className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} MuSync. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-white">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-white">
            Privacy
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-white">
            Support
          </Link>
        </nav>
      </footer>
    </div>
  )
}
