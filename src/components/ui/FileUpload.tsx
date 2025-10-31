"use client"

import { useState, useRef } from "react"
import { Upload, X, Check, AlertCircle } from "lucide-react"
import { UploadDropzone } from "@uploadthing/react"
import { OurFileRouter } from "@/app/api/uploadthing/core"
import { useUploadThing } from "@/lib/uploadthing"

interface FileUploadProps {
  endpoint: keyof OurFileRouter
  onUploadComplete?: (url: string) => void
  onUploadError?: (error: Error) => void
  className?: string
  children?: React.ReactNode
}

export function FileUpload({ 
  endpoint, 
  onUploadComplete, 
  onUploadError,
  className = "",
  children 
}: FileUploadProps) {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      if (res && res[0]?.url) {
        setUploadedUrl(res[0].url)
        onUploadComplete?.(res[0].url)
      }
      setIsUploading(false)
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error)
      onUploadError?.(error)
      setIsUploading(false)
    },
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setIsUploading(true)
      await startUpload(Array.from(files))
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  if (children) {
    return (
      <div className={className}>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        <label
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`cursor-pointer ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {children}
        </label>
        {isUploading && (
          <div className="mt-2 flex items-center space-x-2 text-gray-600">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            <span className="text-sm">Uploading...</span>
          </div>
        )}
        {uploadedUrl && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Upload successful!</span>
            </div>
            <p className="text-xs text-green-600 mt-1 break-all">
              {uploadedUrl}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      <UploadDropzone<OurFileRouter, typeof endpoint>
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          if (res && res[0]?.url) {
            setUploadedUrl(res[0].url)
            onUploadComplete?.(res[0].url)
          }
          setIsUploading(false)
        }}
        onUploadError={(error: Error) => {
          console.error("Upload error:", error)
          onUploadError?.(error)
          setIsUploading(false)
        }}
        onUploadBegin={() => {
          setIsUploading(true)
        }}
        className="ut-label:text-gray-900 ut-allowed-content:text-gray-600 ut-button:bg-gray-900 ut-button:ut-readying:bg-gray-800 ut-button:ut-uploading:bg-gray-700"
      />
      
      {isUploading && (
        <div className="mt-4 flex items-center space-x-2 text-gray-600">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          <span className="text-sm">Uploading...</span>
        </div>
      )}

      {uploadedUrl && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 text-green-800">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Upload successful!</span>
          </div>
          <p className="text-xs text-green-600 mt-1 break-all">
            {uploadedUrl}
          </p>
        </div>
      )}
    </div>
  )
}

export function ProfileImageUpload({ onUploadComplete }: { onUploadComplete?: (url: string) => void }) {
  return (
    <FileUpload
      endpoint="profileImage"
      onUploadComplete={onUploadComplete}
      className="w-full"
    >
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
        <Upload className="w-4 h-4" />
        <span>Upload Profile Image</span>
      </div>
    </FileUpload>
  )
}

export function BlogImageUpload({ onUploadComplete }: { onUploadComplete?: (url: string) => void }) {
  return (
    <FileUpload
      endpoint="blogImage"
      onUploadComplete={onUploadComplete}
      className="w-full"
    >
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
        <Upload className="w-4 h-4" />
        <span>Upload Blog Image</span>
      </div>
    </FileUpload>
  )
}

export function ProjectImageUpload({ onUploadComplete }: { onUploadComplete?: (url: string) => void }) {
  return (
    <FileUpload
      endpoint="projectImage"
      onUploadComplete={onUploadComplete}
      className="w-full"
    >
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
        <Upload className="w-4 h-4" />
        <span>Upload Project Image</span>
      </div>
    </FileUpload>
  )
}

export function DocumentUpload({ onUploadComplete }: { onUploadComplete?: (url: string) => void }) {
  return (
    <FileUpload
      endpoint="document"
      onUploadComplete={onUploadComplete}
      className="w-full"
    >
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
        <Upload className="w-4 h-4" />
        <span>Upload Document</span>
      </div>
    </FileUpload>
  )
}
