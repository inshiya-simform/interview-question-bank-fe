import { EditorContent } from '@tiptap/react';
import { ANSWER_TEXT_MAX, RICH_TEXT_COPY } from '@/constants';
import { useFieldIds } from '@/hooks/useFieldIds';
import { cn } from '@/utils/cn';
import { RichTextToolbar } from './RichTextToolbar';
import { useRichTextEditor } from './useRichTextEditor';
import type { UploadImage } from './useEditorImageUpload';
import './TextField.css';
import './RichTextEditor.css';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
  onUploadImage: UploadImage;
  placeholder?: string;
  error?: string;
}

export function RichTextEditor({
  label,
  value,
  onChange,
  onUploadImage,
  placeholder = '',
  error,
}: RichTextEditorProps) {
  const { errorId, hintId } = useFieldIds();
  const {
    editor,
    fileInputRef,
    imageAccept,
    textLength,
    isUploading,
    openFilePicker,
    handleFileChange,
  } = useRichTextEditor({ value, onChange, placeholder, onUploadImage });

  return (
    <div className="field">
      <span className="field__label">{label}</span>
      <div
        className={cn('rte', error && 'rte--invalid')}
        aria-describedby={error ? errorId : hintId}
      >
        {editor && <RichTextToolbar editor={editor} onPickImage={openFilePicker} />}
        <EditorContent editor={editor} className="rte__content rich-content" />
        <input
          ref={fileInputRef}
          type="file"
          accept={imageAccept}
          multiple
          hidden
          onChange={handleFileChange}
        />
      </div>
      <p
        id={hintId}
        className={cn('field__message', textLength > ANSWER_TEXT_MAX && 'field__message--error')}
        aria-live="polite"
      >
        {RICH_TEXT_COPY.TEXT_COUNT(textLength)}
        {isUploading && ` · ${RICH_TEXT_COPY.IMAGE_UPLOADING}…`}
      </p>
      {error && (
        <p id={errorId} className="field__message field__message--error">
          {error}
        </p>
      )}
    </div>
  );
}
