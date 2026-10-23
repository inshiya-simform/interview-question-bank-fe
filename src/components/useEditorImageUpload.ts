import { useEffect, useRef, useState } from 'react';
import type { EditorView } from '@tiptap/pm/view';
import { toast } from 'react-toastify';
import { getImageFileError, isImageFile } from '@/utils/imageFile';

export type UploadImage = (file: File) => Promise<string>;

export function useEditorImageUpload(uploadImage: UploadImage) {
  const [pending, setPending] = useState(0);
  const uploadRef = useRef(uploadImage);
  useEffect(() => {
    uploadRef.current = uploadImage;
  }, [uploadImage]);

  // Uploads in order and inserts each returned url; API failures are already toasted centrally.
  const insertImages = async (view: EditorView, files: File[], position?: number, alt = '') => {
    let at = position ?? view.state.selection.to;
    for (const file of files) {
      const error = getImageFileError(file);
      if (error) {
        toast.error(error);
        continue;
      }
      setPending((count) => count + 1);
      try {
        const src = await uploadRef.current(file);
        const node = view.state.schema.nodes.image.create({ src, alt });
        at = Math.min(at, view.state.doc.content.size);
        view.dispatch(view.state.tr.insert(at, node));
        at += node.nodeSize;
      } catch {
        // Nothing is inserted on failure.
      } finally {
        setPending((count) => count - 1);
      }
    }
  };

  const handlePaste = (view: EditorView, event: ClipboardEvent) => {
    const files = Array.from(event.clipboardData?.files ?? []).filter(isImageFile);
    if (files.length === 0) return false;
    event.preventDefault();
    void insertImages(view, files);
    return true;
  };

  const handleDrop = (view: EditorView, event: DragEvent) => {
    const files = Array.from(event.dataTransfer?.files ?? []).filter(isImageFile);
    if (files.length === 0) return false;
    event.preventDefault();
    const position = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
    void insertImages(view, files, position);
    return true;
  };

  return { isUploading: pending > 0, insertImages, handlePaste, handleDrop };
}
