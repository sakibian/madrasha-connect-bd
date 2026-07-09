
import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
}

const ToolbarButton: React.FC<{
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  label: string;
}> = ({ onClick, active, children, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`p-2 rounded-lg transition-all ${
      active ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content = '',
  onChange,
  placeholder = 'লিখুন...',
  className = '',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  const toggleBold = useCallback(() => editor?.chain().focus().toggleBold().run(), [editor]);
  const toggleItalic = useCallback(() => editor?.chain().focus().toggleItalic().run(), [editor]);
  const toggleBulletList = useCallback(() => editor?.chain().focus().toggleBulletList().run(), [editor]);
  const toggleOrderedList = useCallback(() => editor?.chain().focus().toggleOrderedList().run(), [editor]);

  if (!editor) return null;

  return (
    <div className={`border border-gray-200 rounded-2xl overflow-hidden focus-within:border-black transition-all ${className}`}>
      <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50">
        <ToolbarButton onClick={toggleBold} active={editor.isActive('bold')} label="বোল্ড">
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={toggleItalic} active={editor.isActive('italic')} label="ইটালিক">
          <Italic size={16} />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton onClick={toggleBulletList} active={editor.isActive('bulletList')} label="বুলেট লিস্ট">
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={toggleOrderedList} active={editor.isActive('orderedList')} label="অর্ডারড লিস্ট">
          <ListOrdered size={16} />
        </ToolbarButton>
      </div>
      <div className="px-4 py-3 min-h-[120px] prose prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[100px] [&_.ProseMirror_p]:text-gray-700 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-300 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
