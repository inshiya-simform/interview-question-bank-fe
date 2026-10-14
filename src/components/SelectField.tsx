import type { SelectHTMLAttributes } from 'react';
import { useFieldIds } from '@/hooks/useFieldIds';
import { cn } from '@/utils/cn';
import type { SelectOption } from './selectOption';
import './TextField.css';

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string;
  options: readonly SelectOption[];
  placeholder: string;
  error?: string;
}

export function SelectField({
  label,
  options,
  placeholder,
  error,
  className,
  ...rest
}: SelectFieldProps) {
  const { inputId, errorId } = useFieldIds();

  return (
    <div className={cn('field', className)}>
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <select
        id={inputId}
        className="field__input"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="field__message field__message--error">
          {error}
        </p>
      )}
    </div>
  );
}
