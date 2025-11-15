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
  endpoint?: "blogImage" | "projectImage" | "projectImages" | "profileImage" | "mentorImage" | "alumniImage" | "teamImage"
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
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        endpoint: endpoint
      })
      setIsUploading(false)
      // Show user-friendly error message
      alert(`Upload failed: ${error.message || "Please check file size (max 4MB for profile images) and try again."}`)
    },
    onUploadBegin: (name) => {
      console.log("Upload started for:", name, "endpoint:", endpoint)
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
    maxSize: endpoint === "mentorImage" || endpoint === "alumniImage" || endpoint === "profileImage" 
      ? 4 * 1024 * 1024 // 4MB for profile images
      : endpoint === "teamImage"
      ? 8 * 1024 * 1024 // 8MB for team images
      : 8 * 1024 * 1024 // 8MB for blog/project images
  })

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("")
  }

  if (value) {
    return (
      <div className="space-y-2">
        <div className="relative group">
          <div 
            {...getRootProps()}
            className="aspect-video w-full rounded-lg overflow-hidden border-2 border-gray-300 cursor-pointer hover:border-gray-500 transition-colors bg-gray-50"
          >
            <input {...getInputProps()} />
            <img
              src={value}
              alt="Image preview"
              className="w-full h-full object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
              <p className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium bg-black/50 px-3 py-1 rounded">
                Click to replace image
              </p>
            </div>
          </div>
          {/* Action buttons - positioned outside dropzone but relative to parent */}
          <div className="absolute top-2 right-2 flex gap-2 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                input.onchange = (event: Event) => {
                  const file = (event.target as HTMLInputElement).files?.[0]
                  if (file) {
                    setIsUploading(true)
                    startUpload([file])
                  }
                }
                input.click()
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-lg transition-opacity opacity-0 group-hover:opacity-100"
              disabled={disabled || isUploading}
              title="Replace image"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                removeImage(e)
              }}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-lg transition-opacity opacity-100"
              disabled={disabled || isUploading}
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center">
          Click image to replace or use buttons above
        </p>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors bg-gray-50
        ${isDragActive 
          ? "border-blue-500 bg-blue-50" 
          : "border-gray-300 hover:border-gray-400"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input {...getInputProps()} />
      
      {isUploading ? (
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm text-gray-600">Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {isDragActive ? "Drop image here" : "Upload image"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Drag & drop or click to select (max {endpoint === "teamImage" ? "8MB" : endpoint === "mentorImage" || endpoint === "alumniImage" || endpoint === "profileImage" ? "4MB" : "8MB"})
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
