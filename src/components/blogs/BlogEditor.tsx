'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, X, FileText } from 'lucide-react'
import { BlogEditor as NovelBlogEditor } from '../ui/BlogEditor'

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
  const [content, setContent] = useState(initialContent)

  const handleSave = async () => {
    setIsSaving(true)
    await onSave?.(content)
    setIsSaving(false)
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create Blog Post</h2>
              <p className="text-sm text-gray-500">Type / for commands</p>
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
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        <div className="h-full w-full p-6">
          <NovelBlogEditor 
            content={initialContent}
            onChange={setContent}
            placeholder="Type / to see available commands..."
          />
        </div>
      </div>
    </div>
  )
}
