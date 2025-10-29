"use client"

import { NovelBlogEditor } from "@/components/admin/NovelBlogEditor"
import { useRef, useEffect } from "react"

interface BlogEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
}

export const BlogEditor = ({ 
  content, 
  onChange, 
  placeholder = "Type / for commands..." 
}: BlogEditorProps) => {
  // Lock in initial content on first render - don't update after that
  // This prevents the editor from resetting when content prop changes due to onChange
  const initialContentRef = useRef<string | undefined>(undefined)
  
  // Only set initial content once on first mount
  if (initialContentRef.current === undefined) {
    initialContentRef.current = content || ""
  }

  return (
    <div className="w-full">
      <NovelBlogEditor
        content={initialContentRef.current}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}
