import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

// Create a handler function for Better Auth
const handler = async (req: Request) => {
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
  } catch (error) {
    console.error("Auth handler error:", error)
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