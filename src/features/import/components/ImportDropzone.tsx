import { Button } from '@/components';
import { IMPORT_COPY, IMPORT_LIMITS } from '@/constants';
import { cn } from '@/utils/cn';
import { useImportDropzone } from '../hooks/useImportDropzone';
import type { SelectedFile } from '../utils';
import './ImportDropzone.css';

interface ImportDropzoneProps {
  disabled: boolean;
  onFiles: (files: readonly SelectedFile[]) => void;
}

export function ImportDropzone({ disabled, onFiles }: ImportDropzoneProps) {
  const { inputRef, isDragging, browse, onChange, onDragOver, onDragLeave, onDrop } =
    useImportDropzone(onFiles);

  return (
    <div
      role="group"
      aria-label={IMPORT_COPY.DROPZONE_LABEL}
      className={cn('dropzone', isDragging && 'dropzone--active', disabled && 'dropzone--disabled')}
      onDragOver={disabled ? undefined : onDragOver}
      onDragLeave={onDragLeave}
      onDrop={disabled ? undefined : onDrop}
    >
      <p className="dropzone__title">
        {isDragging ? IMPORT_COPY.DROPZONE_ACTIVE : IMPORT_COPY.DROPZONE_TITLE}
      </p>
      <p className="dropzone__or" aria-hidden="true">
        {IMPORT_COPY.DROPZONE_OR}
      </p>
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        tabIndex={-1}
        accept={`${IMPORT_LIMITS.EXTENSION},text/csv`}
        onChange={onChange}
      />
      <Button
        variant="secondary"
        disabled={disabled}
        aria-label={IMPORT_COPY.BROWSE_LABEL}
        onClick={browse}
      >
        {IMPORT_COPY.BROWSE}
      </Button>
    </div>
  );
}
