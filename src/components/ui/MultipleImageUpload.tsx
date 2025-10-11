"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { useUploadThing } from "@/lib/uploadthing"
import { Button } from "@/components/ui/Button"

interface MultipleImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  disabled?: boolean
  maxFiles?: number
}

export const MultipleImageUpload = ({ 
  value, 
  onChange, 
  disabled = false,
  maxFiles = 10 
}: MultipleImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  
  const { startUpload } = useUploadThing("projectImages", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        const newUrls = res.map(file => file.url)
        onChange([...value, ...newUrls])
      }
      setIsUploading(false)
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error)
      setIsUploading(false)
    },
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setIsUploading(true)
      startUpload(acceptedFiles)
    }
  }, [startUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true,
    disabled: disabled || isUploading || value.length >= maxFiles
  })

  const removeImage = (indexToRemove: number) => {
    const newImages = value.filter((_, index) => index !== indexToRemove)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300">
        Project Images
      </label>
      
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-gray-500 bg-gray-800' 
            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800'
          }
          ${disabled || isUploading || value.length >= maxFiles 
            ? 'opacity-50 cursor-not-allowed' 
            : ''
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              <p className="text-gray-400">Uploading images...</p>
            </>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-gray-400" />
              <div className="text-gray-300">
                <p className="font-medium">
                  {isDragActive 
                    ? 'Drop images here' 
                    : 'Drag & drop images here, or click to select'
                  }
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  PNG, JPG, GIF, WebP up to 8MB each
                </p>
                <p className="text-sm text-gray-400">
                  {value.length}/{maxFiles} images uploaded
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Project image ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-600"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-400">
        You can upload up to {maxFiles} images. The first image will be used as the main project image.
      </p>
    </div>
  )
}
