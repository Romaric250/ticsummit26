"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn, signOut, useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/Button"
import { User, LogOut, Settings } from "lucide-react"

export function AuthButton() {
  const { data: session, isPending } = useSession()
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
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {session.user.name || "User"}
            </p>
            <p className="text-xs text-gray-500">
              {session.user.role || "Student"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <Button
        onClick={handleSignIn}
        disabled={isLoading}
        variant="outline"
        className="border-gray-300 text-gray-600 hover:bg-gray-50"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mr-2" />
        ) : (
          <User className="w-4 h-4 mr-2" />
        )}
        Sign In
      </Button>
      <Button
        onClick={handleSignIn}
        disabled={isLoading}
        className="bg-white hover:bg-white text-gray-900"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mr-2" />
        ) : (
          <User className="w-4 h-4 mr-2" />
        )}
        Sign Up
      </Button>
    </div>
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