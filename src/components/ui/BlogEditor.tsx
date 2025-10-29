"use client"

import { NovelBlogEditor } from "@/components/admin/NovelBlogEditor"

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
  return (
    <div className="w-full">
      <NovelBlogEditor
        content={content}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}
