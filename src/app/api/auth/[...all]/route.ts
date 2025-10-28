import { auth } from "@/lib/auth"

// Create a handler function for Better Auth
const handler = async (req: Request) => {
  return auth.handler(req)
}

export const GET = handler
export const POST = handler