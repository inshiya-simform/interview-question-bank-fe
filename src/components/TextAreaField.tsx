import type { Ref, TextareaHTMLAttributes } from 'react';
import { useFieldIds } from '@/hooks/useFieldIds';
import { cn } from '@/utils/cn';
import './TextField.css';

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  name: string;
  error?: string;
  // For fields whose purpose is obvious from context (e.g. a comment box); still read by assistive tech.
  hideLabel?: boolean;
  inputRef?: Ref<HTMLTextAreaElement>;
}

export function TextAreaField({
  label,
  error,
  hideLabel = false,
  inputRef,
  className,
  rows = 5,
  ...rest
}: TextAreaFieldProps) {
  const { inputId, errorId } = useFieldIds();

  return (
    <div className={cn('field', className)}>
      <label className={cn('field__label', hideLabel && 'sr-only')} htmlFor={inputId}>
        {label}
      </label>
      <textarea
        id={inputId}
        ref={inputRef}
        rows={rows}
        className="field__input field__input--area"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <p id={errorId} className="field__message field__message--error">
          {error}
        </p>
      )}
    </div>
  );
}
