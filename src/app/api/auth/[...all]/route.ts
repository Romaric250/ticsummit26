import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Clean up expired verification tokens before processing auth requests
const cleanupExpiredTokens = async () => {
  try {
    const deleted = await prisma.verification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
    if (deleted.count > 0) {
      console.log(`Cleaned up ${deleted.count} expired verification tokens`)
    }
  } catch (error) {
    console.error("Error cleaning up expired tokens:", error)
  }
}

// Create a handler function for Better Auth
const handler = async (req: Request) => {
  // Clean up expired tokens before processing request
  await cleanupExpiredTokens()
  
  try {
    const response = await auth.handler(req)
    
    // Add CORS headers
    const headers = new Headers(response.headers)
    const origin = req.headers.get("origin")
    
    if (origin) {
      headers.set("Access-Control-Allow-Origin", origin)
      headers.set("Access-Control-Allow-Credentials", "true")
      headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
      headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    }
    
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  } catch (error: any) {
    console.error("Auth handler error:", error)
    
    // Handle Prisma unique constraint errors (P2002) for verification tokens
    if (error?.code === 'P2002' && (
      error?.meta?.target?.includes('token') || 
      error?.message?.includes('verification_tokens_token_key')
    )) {
      try {
        // Try to find and delete the conflicting token
        if (error?.meta?.target?.includes('token')) {
          // If we can identify the token from the error, try to delete it
          // Otherwise, clean all expired tokens
          await prisma.verification.deleteMany({
            where: {
              OR: [
                {
                  expiresAt: {
                    lt: new Date()
                  }
                },
                // Also delete tokens that might be causing conflicts (older than 1 hour)
                {
                  createdAt: {
                    lt: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
                  }
                }
              ]
            }
          })
        }
        
        console.log("Cleaned up conflicting verification tokens, retrying...")
        
        // Retry the auth handler after cleanup
        try {
          const response = await auth.handler(req)
          
          const headers = new Headers(response.headers)
          const origin = req.headers.get("origin")
          
          if (origin) {
            headers.set("Access-Control-Allow-Origin", origin)
            headers.set("Access-Control-Allow-Credentials", "true")
            headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
          }
          
          return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
          })
        } catch (retryError) {
          console.error("Retry failed:", retryError)
          // Fall through to error response
        }
      } catch (cleanupError) {
        console.error("Error cleaning up conflicting tokens:", cleanupError)
      }
      
      // Return a user-friendly error asking them to retry
      const origin = req.headers.get("origin")
      const headers = new Headers()
      
      if (origin) {
        headers.set("Access-Control-Allow-Origin", origin)
        headers.set("Access-Control-Allow-Credentials", "true")
        headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
      }
      
      return NextResponse.json(
        { 
          error: "Authentication temporarily unavailable. Please try again in a moment.",
          code: "AUTH_RETRY"
        },
        { 
          status: 429, // Too Many Requests - indicates retry needed
          headers 
        }
      )
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS preflight
export const OPTIONS = async (req: Request) => {
  const origin = req.headers.get("origin")
  const headers = new Headers()
  
  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin)
    headers.set("Access-Control-Allow-Credentials", "true")
    headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  }
  
  return new NextResponse(null, { status: 200, headers })
}

export const GET = handler
export const POST = handler