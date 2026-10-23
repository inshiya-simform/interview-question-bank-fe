import { useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { useEditor } from '@tiptap/react';
import { IMAGE_ACCEPT, RICH_TEXT_COPY } from '@/constants';
import { htmlTextLength } from '@/utils/htmlToText';
import { buildRichTextExtensions } from './richTextExtensions';
import { useEditorImageUpload } from './useEditorImageUpload';
import type { UploadImage } from './useEditorImageUpload';

interface Options {
  value: string;
  onChange: (html: string) => void;
  placeholder: string;
  onUploadImage: UploadImage;
}

export function useRichTextEditor({ value, onChange, placeholder, onUploadImage }: Options) {
  const { isUploading, insertImages, handlePaste, handleDrop } =
    useEditorImageUpload(onUploadImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // The last HTML the editor and the form agreed on; avoids reading the editor before it mounts.
  const syncedHtml = useRef(value);

  const editor = useEditor({
    extensions: buildRichTextExtensions(placeholder),
    content: value,
    onUpdate: ({ editor: current }) => {
      syncedHtml.current = current.getHTML();
      onChange(syncedHtml.current);
    },
    editorProps: {
      attributes: {
        'aria-label': RICH_TEXT_COPY.EDITOR_LABEL,
        role: 'textbox',
        'aria-multiline': 'true',
      },
      handlePaste: (view, event) => handlePaste(view, event),
      handleDrop: (view, event) => handleDrop(view, event),
      // Pasted <img> tags point at external or inline sources the API would discard.
      transformPastedHTML: (html) => html.replace(/<img\b[^>]*>/gi, ''),
    },
  });

  // The form resets its value (e.g. on cancel); keep the editor in step without echoing back.
  useEffect(() => {
    if (!editor || value === syncedHtml.current) return;
    syncedHtml.current = value;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!editor || files.length === 0) return;
    const alt = window.prompt(RICH_TEXT_COPY.ALT_PROMPT) ?? '';
    void insertImages(editor.view, files, undefined, alt.trim());
  };

  return {
    editor,
    fileInputRef,
    imageAccept: IMAGE_ACCEPT,
    textLength: htmlTextLength(value),
    isUploading,
    openFilePicker,
    handleFileChange,
  };
}
