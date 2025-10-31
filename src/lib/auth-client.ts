"use client"

import { createAuthClient } from "better-auth/react"

// Use BETTER_AUTH_URL as primary, fallback to current origin
const getBaseURL = () => {
  // First priority: BETTER_AUTH_URL (set in environment)
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL
  }
  // Second priority: NEXT_PUBLIC_APP_URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  // Fallback: current origin (works for both dev and production)
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  return "http://localhost:3000"
}

export const authClient = createAuthClient({
  baseURL: getBaseURL()
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession
} = authClient