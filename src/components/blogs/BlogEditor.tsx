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
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your blog post...',
      }),
    ],
    content: initialContent || '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg prose-gray max-w-none min-h-[500px] focus:outline-none p-6 text-gray-900',
      },
    },
  })

  const handleSave = async () => {
    if (!editor) return
    setIsSaving(true)
    const html = editor.getHTML()
    await onSave?.(html)
    setIsSaving(false)
  }

  if (!editor) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
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
            className={`p-2 rounded hover:bg-gray-100 transition-colors text-gray-900 ${
              editor.isActive('bold') ? 'bg-gray-200' : ''
            }`}
            type="button"
          >
            <Bold className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors text-gray-900 ${
              editor.isActive('italic') ? 'bg-gray-200' : ''
            }`}
            type="button"
          >
            <Italic className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors text-gray-900 ${
              editor.isActive('bulletList') ? 'bg-gray-200' : ''
            }`}
            type="button"
          >
            <List className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors text-gray-900 ${
              editor.isActive('orderedList') ? 'bg-gray-200' : ''
            }`}
            type="button"
          >
            <ListOrdered className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
