"use client"

import { useState, useEffect, useCallback } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { useUploadThing } from "@/lib/uploadthing"

interface NovelEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
}

export const BlogEditor = ({ content, onChange, placeholder = "Type / for commands..." }: NovelEditorProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [query, setQuery] = useState("")
  
  const { startUpload } = useUploadThing("blogImage", {
    onClientUploadComplete: () => {
      // Upload complete
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error)
    },
  })

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      if (onChange) {
        onChange(html)
      }
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg prose-gray max-w-none min-h-[600px] focus:outline-none text-gray-900",
      },
      handleKeyDown: (view, event) => {
        if (event.key === '/' && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
          // Check if we're at the start of a new paragraph
          const { selection } = view.state
          const { $from } = selection
          
          // Check if slash is at the beginning of the paragraph
          if ($from.parentOffset === 0 || view.state.doc.textBetween($from.start() - 1, $from.end()).startsWith('/')) {
            setQuery('')
            setShowSuggestions(true)
            return true
          }
        }
        
        if (event.key === 'Escape') {
          setShowSuggestions(false)
          return true
        }
        
        return false
      },
    },
  })

  useEffect(() => {
    if (content) {
      editor?.commands.setContent(content)
    }
  }, [content, editor])

  const insertHeading = (level: 1 | 2 | 3) => {
    if (editor) {
      editor.chain().focus().toggleHeading({ level }).run()
      setShowSuggestions(false)
    }
  }

  const insertBulletList = () => {
    if (editor) {
      editor.chain().focus().toggleBulletList().run()
      setShowSuggestions(false)
    }
  }

  const insertOrderedList = () => {
    if (editor) {
      editor.chain().focus().toggleOrderedList().run()
      setShowSuggestions(false)
    }
  }

  const insertBlockquote = () => {
    if (editor) {
      editor.chain().focus().toggleBlockquote().run()
      setShowSuggestions(false)
    }
  }

  const insertCode = () => {
    if (editor) {
      editor.chain().focus().toggleCodeBlock().run()
      setShowSuggestions(false)
    }
  }

  const suggestions = [
    { label: 'Heading 1', command: () => insertHeading(1), shortcut: 'H1' },
    { label: 'Heading 2', command: () => insertHeading(2), shortcut: 'H2' },
    { label: 'Heading 3', command: () => insertHeading(3), shortcut: 'H3' },
    { label: 'Bullet List', command: insertBulletList, shortcut: '• List' },
    { label: 'Numbered List', command: insertOrderedList, shortcut: '1. List' },
    { label: 'Quote', command: insertBlockquote, shortcut: '" Quote' },
    { label: 'Code Block', command: insertCode, shortcut: '</> Code' },
  ]

  const filteredSuggestions = suggestions.filter(s => 
    s.label.toLowerCase().includes(query.toLowerCase()) ||
    s.shortcut.toLowerCase().includes(query.toLowerCase())
  )

  if (!editor) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="h-full w-full relative text-gray-900 bg-white">
      {showSuggestions && (
        <div className="absolute z-50 top-4 left-4 w-64 border border-gray-300 rounded-lg bg-white shadow-lg p-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2"
            autoFocus
          />
          <div className="max-h-64 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={suggestion.command}
                className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
              >
                <div className="font-medium">{suggestion.label}</div>
                <div className="text-xs text-gray-500">{suggestion.shortcut}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}
