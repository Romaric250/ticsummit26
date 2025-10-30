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
  // Track the content that was used to initialize the editor
  // Reset when content changes (e.g., switching between blogs)
  const initialContentRef = useRef<string | undefined>(undefined)
  const lastContentKeyRef = useRef<string>("")
  
  // Generate a key based on content to detect significant changes (like switching blogs)
  const contentKey = content || ""
  
  // Reset initial content when the content key changes significantly
  // This happens when switching between different blog posts
  useEffect(() => {
    if (contentKey !== lastContentKeyRef.current) {
      initialContentRef.current = content
      lastContentKeyRef.current = contentKey
    }
  }, [contentKey, content])
  
  // Set initial content on first mount if not set
  if (initialContentRef.current === undefined) {
    initialContentRef.current = content || ""
    lastContentKeyRef.current = contentKey
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
