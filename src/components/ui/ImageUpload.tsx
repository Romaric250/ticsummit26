"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { useUploadThing } from "@/lib/uploadthing"
import { Button } from "@/components/ui/Button"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
  endpoint?: "blogImage" | "projectImage" | "projectImages" | "profileImage" | "mentorImage" | "alumniImage"
}

export const ImageUpload = ({ value, onChange, disabled, endpoint = "blogImage" }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  
  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url) {
        onChange(res[0].url)
      }
      setIsUploading(false)
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error)
      setIsUploading(false)
    },
  })

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setIsUploading(true)
        startUpload(acceptedFiles)
      }
    },
    [startUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: disabled || isUploading,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"]
    },
    maxFiles: 1,
    maxSize: 8 * 1024 * 1024 // 8MB
  })

  const removeImage = () => {
    onChange("")
  }

  if (value) {
    return (
      <div className="relative group">
        <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-600">
          <img
            src={value}
            alt="Image preview"
            className="w-full h-full object-cover"
          />
        </div>
        <button
          type="button"
          onClick={removeImage}
          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          disabled={disabled}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive 
          ? "border-blue-500 bg-blue-50/10" 
          : "border-gray-600 hover:border-gray-500"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input {...getInputProps()} />
      
      {isUploading ? (
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm text-gray-400">Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {isDragActive ? "Drop image here" : "Upload image"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Drag & drop or click to select (max 8MB)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
