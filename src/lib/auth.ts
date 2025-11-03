// import { betterAuth } from "better-auth"
// import { prismaAdapter } from "better-auth/adapters/prisma"
// import { PrismaClient } from "@prisma/client"

// const prisma = new PrismaClient()

// export const auth = betterAuth({
//   database: prismaAdapter(prisma, {
//     provider: "mongodb",
//     idType: "string"
//   }),
//   baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
//   secret: process.env.BETTER_AUTH_SECRET!,
//   emailAndPassword: {
//     enabled: false
//   },
//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }
//   },
//   session: {
//     expiresIn: 60 * 60 * 24 * 7, // 7 days
//     updateAge: 60 * 60 * 24, // 1 day
//   },
//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         defaultValue: "STUDENT",
//         required: false,
//       },
//     },
//   },
// })

// export type Session = typeof auth.$Infer.Session
// export type User = typeof auth.$Infer.User



import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb", // correct for Mongo
  }),

  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    "http://localhost:3000", // adjust port if needed

  secret: process.env.BETTER_AUTH_SECRET!,

  // Disable built-in email/password — using Google only
  emailAndPassword: {
    enabled: false,
  },

  // ✅ Social login setup
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // ✅ Session settings
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh every 24 hours
  },

  // ✅ Add custom fields to the user
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        required: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];
