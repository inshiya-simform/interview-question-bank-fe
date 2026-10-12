import type { InputHTMLAttributes, ReactNode } from 'react';
import { useFieldIds } from '@/hooks/useFieldIds';
import { cn } from '@/utils/cn';
import './TextField.css';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  endAdornment?: ReactNode;
}

export function TextField({
  label,
  error,
  hint,
  endAdornment,
  className,
  ...rest
}: TextFieldProps) {
  const { inputId, errorId, hintId } = useFieldIds();
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={cn('field', className)}>
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <div className="field__control">
        <input
          id={inputId}
          className={cn('field__input', endAdornment ? 'field__input--with-adornment' : undefined)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {endAdornment}
      </div>
      {error ? (
        <p id={errorId} className="field__message field__message--error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="field__message">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
