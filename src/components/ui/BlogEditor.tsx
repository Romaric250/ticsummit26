"use client"

import { useState, useEffect } from "react"
import { EditorRoot, EditorCommand, EditorCommandItem, EditorCommandEmpty, EditorContent, type JSONContent, EditorCommandList, EditorBubble } from "novel"
import { StarterKit } from "@tiptap/starter-kit"
import { Placeholder } from "@tiptap/extension-placeholder"
import { useUploadThing } from "@/lib/uploadthing"

interface NovelEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
}

export const BlogEditor = ({ content, onChange, placeholder = "Start writing your blog post..." }: NovelEditorProps) => {
  const [editorContent, setEditorContent] = useState<JSONContent | undefined>(
    content ? JSON.parse(content) : undefined
  )
  
  const { startUpload } = useUploadThing("blogImage", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url) {
        return res[0].url
      }
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error)
    },
  })

  useEffect(() => {
    if (content && content !== JSON.stringify(editorContent)) {
      try {
        setEditorContent(JSON.parse(content))
      } catch (error) {
        console.error("Error parsing content:", error)
      }
    }
  }, [content])

  const handleUpdate = (editor: any) => {
    const json = editor.getJSON()
    setEditorContent(json)
    if (onChange) {
      onChange(JSON.stringify(json))
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      const res = await startUpload([file])
      if (res?.[0]?.url) {
        return res[0].url
      }
    } catch (error) {
      console.error("Upload error:", error)
    }
    return ""
  }

  return (
    <div className="min-h-[500px] border border-gray-600 rounded-lg overflow-hidden bg-gray-700">
      <EditorRoot>
        <EditorContent
          initialContent={editorContent}
          extensions={[
            StarterKit.configure({
              bulletList: {
                keepMarks: true,
                keepAttributes: false,
              },
              orderedList: {
                keepMarks: true,
                keepAttributes: false,
              },
            }),
            Placeholder.configure({
              placeholder: placeholder,
            }),
          ]}
          className="min-h-[500px] p-4"
          editorProps={{
            attributes: {
              class: "prose prose-invert max-w-none focus:outline-none text-white",
            },
          }}
          onUpdate={({ editor }) => handleUpdate(editor)}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-gray-600 bg-gray-800 px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-gray-400">No results</EditorCommandEmpty>
            <EditorCommandList>
              <EditorCommandItem
                value="paragraph"
                onCommand={({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("paragraph")
                    .run()
                }}
                className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-600 aria-selected:bg-gray-600 text-white"
              >
                <div>
                  <p className="font-medium">Text</p>
                  <p className="text-xs text-gray-400">Just start typing with plain text.</p>
                </div>
              </EditorCommandItem>
              
              <EditorCommandItem
                value="heading1"
                onCommand={({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 1 })
                    .run()
                }}
                className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-600 aria-selected:bg-gray-600 text-white"
              >
                <div>
                  <p className="font-medium">Heading 1</p>
                  <p className="text-xs text-gray-400">Big section heading.</p>
                </div>
              </EditorCommandItem>
              
              <EditorCommandItem
                value="heading2"
                onCommand={({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 2 })
                    .run()
                }}
                className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-600 aria-selected:bg-gray-600 text-white"
              >
                <div>
                  <p className="font-medium">Heading 2</p>
                  <p className="text-xs text-gray-400">Medium section heading.</p>
                </div>
              </EditorCommandItem>
              
              <EditorCommandItem
                value="heading3"
                onCommand={({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 3 })
                    .run()
                }}
                className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-600 aria-selected:bg-gray-600 text-white"
              >
                <div>
                  <p className="font-medium">Heading 3</p>
                  <p className="text-xs text-gray-400">Small section heading.</p>
                </div>
              </EditorCommandItem>
              
              <EditorCommandItem
                value="bulletList"
                onCommand={({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleBulletList()
                    .run()
                }}
                className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-600 aria-selected:bg-gray-600 text-white"
              >
                <div>
                  <p className="font-medium">Bullet List</p>
                  <p className="text-xs text-gray-400">Create a simple bullet list.</p>
                </div>
              </EditorCommandItem>
              
              <EditorCommandItem
                value="numberedList"
                onCommand={({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleOrderedList()
                    .run()
                }}
                className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-600 aria-selected:bg-gray-600 text-white"
              >
                <div>
                  <p className="font-medium">Numbered List</p>
                  <p className="text-xs text-gray-400">Create a list with numbering.</p>
                </div>
              </EditorCommandItem>
              
              <EditorCommandItem
                value="blockquote"
                onCommand={({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleBlockquote()
                    .run()
                }}
                className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-600 aria-selected:bg-gray-600 text-white"
              >
                <div>
                  <p className="font-medium">Quote</p>
                  <p className="text-xs text-gray-400">Capture a quote.</p>
                </div>
              </EditorCommandItem>
              
              <EditorCommandItem
                value="codeBlock"
                onCommand={({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleCodeBlock()
                    .run()
                }}
                className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-600 aria-selected:bg-gray-600 text-white"
              >
                <div>
                  <p className="font-medium">Code</p>
                  <p className="text-xs text-gray-400">Capture a code snippet.</p>
                </div>
              </EditorCommandItem>
            </EditorCommandList>
          </EditorCommand>
          
          <EditorBubble
            tippyOptions={{
              placement: "top",
            }}
            className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-gray-600 bg-gray-800 shadow-xl"
          >
            <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-gray-600 bg-gray-800 px-1 py-2 shadow-md transition-all">
              <EditorCommandEmpty className="px-2 text-gray-400">No results</EditorCommandEmpty>
              <EditorCommandList>
                <EditorCommandItem
                  value="bold"
                  onCommand={({ editor, range }) => {
                    editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .setMark("bold")
                      .run()
                  }}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-600 aria-selected:bg-gray-600 text-white"
                >
                  <div>
                    <p className="font-medium">Bold</p>
                    <p className="text-xs text-gray-400">Make text bold.</p>
                  </div>
                </EditorCommandItem>
                
                <EditorCommandItem
                  value="italic"
                  onCommand={({ editor, range }) => {
                    editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .setMark("italic")
                      .run()
                  }}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-600 aria-selected:bg-gray-600 text-white"
                >
                  <div>
                    <p className="font-medium">Italic</p>
                    <p className="text-xs text-gray-400">Make text italic.</p>
                  </div>
                </EditorCommandItem>
                
                <EditorCommandItem
                  value="code"
                  onCommand={({ editor, range }) => {
                    editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .setMark("code")
                      .run()
                  }}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-600 aria-selected:bg-gray-600 text-white"
                >
                  <div>
                    <p className="font-medium">Code</p>
                    <p className="text-xs text-gray-400">Make text code.</p>
                  </div>
                </EditorCommandItem>
              </EditorCommandList>
            </EditorCommand>
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    </div>
  )
}