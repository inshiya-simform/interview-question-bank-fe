import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import type { SelectedFile } from '../utils';

const toSelected = (files: FileList): SelectedFile[] =>
  Array.from(files, (file) => ({ name: file.name, size: file.size }));

export function useImportDropzone(onFiles: (files: readonly SelectedFile[]) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const browse = () => inputRef.current?.click();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length > 0) onFiles(toSelected(files));
    // Clearing lets the same file be chosen again after removing it.
    event.target.value = '';
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event: DragEvent) => {
    if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget))
      return;
    setIsDragging(false);
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length > 0) onFiles(toSelected(event.dataTransfer.files));
  };

  return { inputRef, isDragging, browse, onChange, onDragOver, onDragLeave, onDrop };
}
