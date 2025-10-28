'use client'

import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { motion } from 'framer-motion'
import { Save, X, FileText, Bold, Italic, List, ListOrdered } from 'lucide-react'

interface BlogEditorProps {
  initialContent?: string
  onSave?: (content: string) => void
  onCancel?: () => void
}

export default function BlogEditor({ 
  initialContent = '', 
  onSave, 
  onCancel 
}: BlogEditorProps) {
  const [isSaving, setIsSaving] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your blog post...',
      }),
    ],
    content: initialContent || '',
  })

  const handleSave = async () => {
    if (!editor) return
    setIsSaving(true)
    const html = editor.getHTML()
    await onSave?.(html)
    setIsSaving(false)
  }

  if (!editor) {
    return null
  }

  return (
    <div className="w-full h-full relative bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create Blog Post</h2>
              <p className="text-sm text-gray-500">Start writing your next great article</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isSaving && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-500 flex items-center gap-2"
              >
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                Saving...
              </motion.span>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50 shadow-md"
            >
              <Save className="h-4 w-4" />
              Save Post
            </motion.button>
            
            {onCancel && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCancel}
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
              >
                <X className="h-4 w-4" />
                Cancel
              </motion.button>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="mt-4 flex items-center gap-2 border-t border-gray-200 pt-4">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('bold') ? 'bg-gray-200' : ''
            }`}
          >
            <Bold className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('italic') ? 'bg-gray-200' : ''
            }`}
          >
            <Italic className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('bulletList') ? 'bg-gray-200' : ''
            }`}
          >
            <List className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('orderedList') ? 'bg-gray-200' : ''
            }`}
          >
            <ListOrdered className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="px-6 py-8">
          <EditorContent 
            editor={editor}
            className="prose prose-lg max-w-none min-h-[calc(100vh-300px)] focus:outline-none [&_.tiptap]:focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}
