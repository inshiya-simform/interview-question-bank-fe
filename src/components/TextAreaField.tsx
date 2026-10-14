import type { TextareaHTMLAttributes } from 'react';
import { useFieldIds } from '@/hooks/useFieldIds';
import { cn } from '@/utils/cn';
import './TextField.css';

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  name: string;
  error?: string;
}

export function TextAreaField({ label, error, className, rows = 5, ...rest }: TextAreaFieldProps) {
  const { inputId, errorId } = useFieldIds();

  return (
    <div className={cn('field', className)}>
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <textarea
        id={inputId}
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
