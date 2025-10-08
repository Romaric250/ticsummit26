"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn, signOut, useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/Button"
import { User, LogOut, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function AuthButton() {
  const { data: session, isPending } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/"
      })
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (isPending) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  if (session?.user) {
    return (
      <div className="relative">
        {/* User Profile Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {session.user.name?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-white transition-transform" style={{
            transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }} />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-900 text-sm">
                  {session.user.name || "User"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {session.user.email}
                </p>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      className="bg-white hover:bg-white text-gray-900 flex items-center space-x-2"
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      ) : (
        <User className="w-4 h-4" />
      )}
      <span>Sign up</span>
    </Button>
  )
}

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/"
      })
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gray-900 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to TIC Summit
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in or create your account to join the innovation journey
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              size="lg"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <User className="w-5 h-5 mr-2" />
              )}
              Sign In with Google
            </Button>
            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              size="lg"
              variant="outline"
              className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mr-2" />
              ) : (
                <User className="w-5 h-5 mr-2" />
              )}
              Sign Up with Google
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              By signing in, you agree to our{" "}
              <a href="#" className="text-gray-900 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-gray-900 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}