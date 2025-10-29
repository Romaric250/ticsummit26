"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { generateJSON } from "@tiptap/html";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  ImageResizer,
  type JSONContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
  AIHighlight,
  CharacterCount,
  CodeBlockLowlight,
  Color,
  CustomKeymap,
  GlobalDragHandle,
  HighlightExtension,
  HorizontalRule,
  Mathematics,
  Placeholder,
  StarterKit,
  TaskItem,
  TaskList,
  TextStyle,
  TiptapImage,
  TiptapLink,
  TiptapUnderline,
  UpdatedImage,
  UploadImagesPlugin,
  Youtube,
  Twitter,
  Command,
  createSuggestionItems,
  renderItems,
  createImageUpload,
} from "novel";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing";
import { cx } from "class-variance-authority";
import { common, createLowlight } from "lowlight";
import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  Text,
  TextQuote,
  Twitter as TwitterIcon,
  Youtube as YoutubeIcon,
} from "lucide-react";

const hljs = require("highlight.js");

// Configure extensions exactly like the reference
const placeholder = Placeholder;
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx("text-blue-600 underline underline-offset-[3px] hover:text-blue-700 transition-colors cursor-pointer"),
  },
});

const codeBlockLowlight = CodeBlockLowlight.configure({
  lowlight: createLowlight(common),
});

const aiHighlight = AIHighlight;

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx("not-prose pl-2"),
  },
});

const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx("flex gap-2 items-start my-4"),
  },
  nested: true,
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx("mt-4 mb-6 border-t border-gray-300"),
  },
});

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx("list-disc list-outside leading-3 -mt-2"),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx("list-decimal list-outside leading-3 -mt-2"),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx("leading-normal -mb-2"),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx("border-l-4 border-blue-500"),
    },
  },
  codeBlock: {
    HTMLAttributes: {
      class: cx("rounded-md bg-gray-100 text-gray-900 border border-gray-300 p-5 font-mono font-medium"),
    },
  },
  code: {
    HTMLAttributes: {
      class: cx("rounded-md bg-gray-100 px-1.5 py-1 font-mono font-medium text-gray-900"),
      spellcheck: "false",
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: "#3B82F6",
    width: 4,
  },
  gapcursor: false,
});

const youtube = Youtube.configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-gray-300"),
  },
  inline: false,
});

const twitter = Twitter.configure({
  HTMLAttributes: {
    class: cx("not-prose"),
  },
  inline: false,
});

const mathematics = Mathematics.configure({
  HTMLAttributes: {
    class: cx("text-gray-900 rounded p-1 hover:bg-gray-100 cursor-pointer"),
  },
  katexOptions: {
    throwOnError: false,
  },
});

const characterCount = CharacterCount.configure();

const updatedImage = UpdatedImage.configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-gray-300"),
  },
});

// Static extensions (without image extension that needs uploadFn)
const baseExtensions = [
  starterKit,
  placeholder,
  tiptapLink,
  updatedImage,
  taskList,
  taskItem,
  horizontalRule,
  aiHighlight,
  codeBlockLowlight,
  youtube,
  twitter,
  mathematics,
  characterCount,
  TiptapUnderline,
  HighlightExtension,
  TextStyle,
  Color,
  CustomKeymap,
  GlobalDragHandle,
];

interface NovelBlogEditorProps {
  content?: string; // HTML content
  onChange?: (content: string) => void;
  placeholder?: string;
}

export const NovelBlogEditor = ({ 
  content = "", 
  onChange, 
  placeholder = "Type / for commands..." 
}: NovelBlogEditorProps) => {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(null);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState<number>();

  const { startUpload } = useUploadThing("blogImage", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url) {
        toast.success("Image uploaded successfully");
      }
    },
    onUploadError: (error: Error) => {
      toast.error("Failed to upload image: " + error.message);
    },
  });

  // Create Novel-compatible upload function - signature: (file, view, pos) => void
  const uploadFn = useCallback(
    createImageUpload({
      onUpload: async (file: File) => {
        try {
          const uploaded = await startUpload([file]);
          if (uploaded?.[0]?.url) {
            return uploaded[0].url;
          }
          throw new Error("Upload failed");
        } catch (error) {
          console.error("Upload error:", error);
          throw error;
        }
      },
      validateFn: (file) => {
        if (!file.type.includes("image/")) {
          toast.error("File type not supported.");
          return false;
        }
        if (file.size / 1024 / 1024 > 8) {
          toast.error("File size too big (max 8MB).");
          return false;
        }
        return true;
      },
    }),
    [startUpload]
  );

  // Configure image extension with upload plugin (needs uploadFn)
  const tiptapImage = TiptapImage.extend({
    addProseMirrorPlugins() {
      return [
        UploadImagesPlugin({
          imageClass: cx("opacity-40 rounded-lg border border-gray-300"),
        }),
      ];
    },
  }).configure({
    allowBase64: true,
    HTMLAttributes: {
      class: cx("rounded-lg border border-gray-300"),
    },
  });

  // Complete extensions array with image extension
  const extensions = [...baseExtensions, tiptapImage];

  // Create suggestion items for slash commands (must be inside component to access uploadFn)
  const suggestionItems = createSuggestionItems([
    {
      title: "Text",
      description: "Just start typing with plain text.",
      searchTerms: ["p", "paragraph"],
      icon: <Text size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
      },
    },
    {
      title: "To-do List",
      description: "Track tasks with a to-do list.",
      searchTerms: ["todo", "task", "list", "check", "checkbox"],
      icon: <CheckSquare size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
    },
    {
      title: "Heading 1",
      description: "Big section heading.",
      searchTerms: ["title", "big", "large"],
      icon: <Heading1 size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
      },
    },
    {
      title: "Heading 2",
      description: "Medium section heading.",
      searchTerms: ["subtitle", "medium"],
      icon: <Heading2 size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
      },
    },
    {
      title: "Heading 3",
      description: "Small section heading.",
      searchTerms: ["subtitle", "small"],
      icon: <Heading3 size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
      },
    },
    {
      title: "Bullet List",
      description: "Create a simple bullet list.",
      searchTerms: ["unordered", "point"],
      icon: <List size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: "Numbered List",
      description: "Create a list with numbering.",
      searchTerms: ["ordered"],
      icon: <ListOrdered size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: "Quote",
      description: "Capture a quote.",
      searchTerms: ["blockquote"],
      icon: <TextQuote size={18} />,
      command: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").toggleBlockquote().run(),
    },
    {
      title: "Code",
      description: "Capture a code snippet.",
      searchTerms: ["codeblock"],
      icon: <Code size={18} />,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
      title: "Image",
      description: "Upload an image from your computer.",
      searchTerms: ["photo", "picture", "media"],
      icon: <ImageIcon size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async () => {
          if (input.files?.length) {
            const file = input.files[0];
            const pos = editor.view.state.selection.from;
            uploadFn(file, editor.view, pos);
          }
        };
        input.click();
      },
    },
    {
      title: "Youtube",
      description: "Embed a Youtube video.",
      searchTerms: ["video", "youtube", "embed"],
      icon: <YoutubeIcon size={18} />,
      command: ({ editor, range }) => {
        const videoLink = prompt("Please enter Youtube Video Link");
        const ytregex = new RegExp(
          /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/,
        );

        if (videoLink && ytregex.test(videoLink)) {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setYoutubeVideo({
              src: videoLink,
            })
            .run();
        } else {
          if (videoLink !== null) {
            toast.error("Please enter a correct Youtube Video Link");
          }
        }
      },
    },
    {
      title: "Twitter",
      description: "Embed a Tweet.",
      searchTerms: ["twitter", "embed"],
      icon: <TwitterIcon size={18} />,
      command: ({ editor, range }) => {
        const tweetLink = prompt("Please enter Twitter Link");
        const tweetRegex = new RegExp(/^https?:\/\/(www\.)?x\.com\/([a-zA-Z0-9_]{1,15})(\/status\/(\d+))?(\/\S*)?$/);

        if (tweetLink && tweetRegex.test(tweetLink)) {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setTweet({
              src: tweetLink,
            })
            .run();
        } else {
          if (tweetLink !== null) {
            toast.error("Please enter a correct Twitter Link");
          }
        }
      },
    },
  ]);

  const slashCommand = Command.configure({
    suggestion: {
      items: () => suggestionItems,
      render: renderItems,
    },
  });

  const allExtensions = [...extensions, slashCommand];

  // Apply code block highlighting
  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      // @ts-ignore
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  // Debounced updates
  const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
    const html = highlightCodeblocks(editor.getHTML());
    setCharsCount(editor.storage.characterCount.words());
    setSaveStatus("Saved");
    
    if (onChange) {
      onChange(html);
    }
  }, 500);

  // Initialize content - convert HTML to JSONContent if needed
  // Use baseExtensions for parsing (image extension not needed for parsing)
  useEffect(() => {
    if (content) {
      try {
        if (content.trim().startsWith('{')) {
          // It's already JSON
          setInitialContent(JSON.parse(content));
        } else {
          // It's HTML - convert to JSONContent using TipTap with base extensions
          // We use baseExtensions for parsing since we just need to convert, not render
          const jsonContent = generateJSON(content, baseExtensions as any);
          setInitialContent(jsonContent);
        }
      } catch (error) {
        console.error("Error parsing content:", error);
        // If parsing fails, set empty content
        setInitialContent(null);
      }
    } else {
      setInitialContent(null);
    }
    // Only run once on mount to initialize
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only initialize once

  // Show loading only if we have content but haven't converted it yet
  // If no content, we'll show empty editor (initialContent can be null/undefined)
  if (content && initialContent === null) {
    // Still initializing/converting content
    return (
      <div className="w-full min-h-[500px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="flex absolute right-5 top-5 z-10 mb-5 gap-2">
        <div className="rounded-lg bg-gray-100 px-2 py-1 text-sm text-gray-600">
          {saveStatus}
        </div>
        {charsCount !== undefined && (
          <div className="rounded-lg bg-gray-100 px-2 py-1 text-sm text-gray-600">
            {charsCount} Words
          </div>
        )}
      </div>
      <EditorRoot>
        <EditorContent
          initialContent={initialContent || undefined}
          extensions={allExtensions as any}
          className="relative min-h-[500px] w-full border-gray-300 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose prose-lg prose-headings:font-title font-default focus:outline-none max-w-full text-gray-900 p-6",
            },
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-gray-300 bg-white px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-gray-500">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => {
                    if (item.command) {
                      item.command(val);
                    }
                  }}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100 aria-selected:bg-gray-100 text-gray-900"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};
