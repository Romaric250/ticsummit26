import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  // Profile image uploader
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // For now, allow all uploads - we can add auth later if needed
      return { userId: "anonymous" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("file url", file.url)
      
      return { uploadedBy: metadata.userId }
    }),

  // Blog post image uploader
  blogImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // For now, allow all uploads - we can add auth later if needed
      return { userId: "anonymous" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Blog image upload complete for userId:", metadata.userId)
      console.log("file url", file.url)
      
      return { uploadedBy: metadata.userId }
    }),

  // Single project image uploader
  projectImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // For now, allow all uploads - we can add auth later if needed
      return { userId: "anonymous" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Project image upload complete for userId:", metadata.userId)
      console.log("file url", file.url)
      
      return { uploadedBy: metadata.userId }
    }),

  // Project images uploader (multiple images)
  projectImages: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .middleware(async ({ req }) => {
      // For now, allow all uploads - we can add auth later if needed
      return { userId: "anonymous" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Project images upload complete for userId:", metadata.userId)
      console.log("file url", file.url)
      
      return { uploadedBy: metadata.userId }
    }),

  // Mentor profile image uploader
  mentorImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // For now, allow all uploads - we can add auth later if needed
      return { userId: "anonymous" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Mentor image upload complete for userId:", metadata.userId)
      console.log("file url", file.url)

      return { uploadedBy: metadata.userId }
    }),

  // Alumni profile image uploader
  alumniImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // For now, allow all uploads - we can add auth later if needed
      return { userId: "anonymous" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Alumni image upload complete for userId:", metadata.userId)
      console.log("file url", file.url)

      return { uploadedBy: metadata.userId }
    }),

  // Team member profile image uploader
  teamImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // For now, allow all uploads - we can add auth later if needed
      return { userId: "anonymous" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Team image upload complete for userId:", metadata.userId)
      console.log("file url", file.url)

      return { uploadedBy: metadata.userId }
    }),

  // Document uploader (for project files, resumes, etc.)
  document: f({ 
    pdf: { maxFileSize: "16MB", maxFileCount: 1 },
    "application/pdf": { maxFileSize: "16MB", maxFileCount: 1 }
  })
    .middleware(async ({ req }) => {
      // For now, allow all uploads - we can add auth later if needed
      return { userId: "anonymous" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Document upload complete for userId:", metadata.userId)
      console.log("file url", file.url)
      
      return { uploadedBy: metadata.userId }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
