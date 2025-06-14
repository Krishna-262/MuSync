"use client"
import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Music, Users, Vote, Zap, Shield, Headphones, Play, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"

const AppBar = () => {
  const session = useSession();

  return (
    <div className='flex items-center justify-between w-full'>
      <Link href="/" className="flex items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Music className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white">MuSync</span>
        </div>
      </Link>

      <nav className="pt-2 flex justify-between gap-4 sm:gap-6">
        <div className='flex gap-4 pt-2'>
          <Link href="#features" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
            How It Works
          </Link>
        </div>

        <div>
          {session.data?.user && (
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-shadow-black hover:bg-purple-500"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          )}
          {!session.data?.user && (
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-shadow-black hover:bg-purple-500  hover:text-blue-50"
              onClick={() => signIn()}
            >
              Sign-In
            </Button>
          )}
        </div>
      </nav>
    </div>


  )
}

export default AppBar