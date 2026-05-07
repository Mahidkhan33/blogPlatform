"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Code, 
  Image as ImageIcon,
  Link as LinkIcon,
  Underline as UnderlineIcon,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Heading1,
  Heading2,
  Highlighter
} from "lucide-react";
import { cn } from "@/lib/utils";
interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;
  const addImage = () => {
    const url = window.prompt('Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };
  const setLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };
  const btnClass = (active: boolean) => cn(
    "h-9 w-9 p-0 rounded-xl transition-all duration-200",
    active 
      ? "bg-brand-orange text-white shadow-lg shadow-orange-500/20" 
      : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
  );
  return (
    <div className="flex flex-wrap gap-1.5 p-3 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-20 backdrop-blur-xl">
      <Button variant="ghost" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive("bold"))}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive("italic"))}>
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive("underline"))}>
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-800 mx-2 self-center" />
      <Button variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive("heading", { level: 1 }))}>
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive("heading", { level: 2 }))}>
        <Heading2 className="h-4 w-4" />
      </Button>
      <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-800 mx-2 self-center" />
      <Button variant="ghost" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))}>
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))}>
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button variant="ghost" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btnClass(editor.isActive({ textAlign: 'right' }))}>
        <AlignRight className="h-4 w-4" />
      </Button>
      <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-800 mx-2 self-center" />
      <Button variant="ghost" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive("bulletList"))}>
        <List className="h-4 w-4" />
      </Button>
      <Button variant="ghost" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive("blockquote"))}>
        <Quote className="h-4 w-4" />
      </Button>
      <Button variant="ghost" onClick={() => editor.chain().focus().toggleHighlight().run()} className={btnClass(editor.isActive("highlight"))}>
        <Highlighter className="h-4 w-4" />
      </Button>
      <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-800 mx-2 self-center" />
      <Button variant="ghost" onClick={addImage} className={btnClass(false)}>
        <ImageIcon className="h-4 w-4" />
      </Button>
      <Button variant="ghost" onClick={setLink} className={btnClass(editor.isActive("link"))}>
        <LinkIcon className="h-4 w-4" />
      </Button>
      <div className="ml-auto flex gap-1.5">
        <Button variant="ghost" onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)} disabled={!editor.can().undo()}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)} disabled={!editor.can().redo()}>
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
      }),
      Image,
      Link.configure({ openOnClick: false }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Capture your vision here..." }),
      Highlight,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[600px] p-10 dark:prose-invert selection:bg-brand-orange/30",
      },
    },
  });
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);
  return (
    <div className="border border-zinc-100 dark:border-zinc-800 rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-950 shadow-2xl shadow-black/5 ring-1 ring-black/5">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
