import type { InputHTMLAttributes } from 'react';
import { AUTH_COPY } from '@/constants';
import { usePasswordField } from './usePasswordField';
import { TextField } from './TextField';

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
  label: string;
  name: string;
  error?: string;
  hint?: string;
}

export function PasswordField(props: PasswordFieldProps) {
  const { isVisible, toggle } = usePasswordField();

  return (
    <TextField
      {...props}
      type={isVisible ? 'text' : 'password'}
      endAdornment={
        <button
          type="button"
          className="field__toggle"
          onClick={toggle}
          aria-pressed={isVisible}
          aria-label={isVisible ? AUTH_COPY.HIDE_PASSWORD : AUTH_COPY.SHOW_PASSWORD}
        >
          {isVisible ? 'Hide' : 'Show'}
        </button>
      }
    />
  );
}
