import { cn } from '@/utils/cn';
import { Badge } from './Badge';
import type { BadgeVariant } from './Badge';
import { useMultiSelect } from './useMultiSelect';
import './MultiSelect.css';

interface MultiSelectProps {
  label: string;
  options: readonly string[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  badgeVariant: BadgeVariant;
  disabled?: boolean;
  hint?: string;
  error?: string;
}

export function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  badgeVariant,
  disabled,
  hint,
  error,
}: MultiSelectProps) {
  const { rootRef, triggerId, panelId, expanded, toggleOpen, toggleOption, handleKeyDown } =
    useMultiSelect({ value, onChange, disabled });

  return (
    <div className="field multi" ref={rootRef} onKeyDown={handleKeyDown}>
      <span className="field__label" id={`${triggerId}-label`}>
        {label}
      </span>
      <button
        type="button"
        id={triggerId}
        className={cn('field__input multi__trigger', error && 'multi__trigger--error')}
        aria-haspopup="true"
        aria-expanded={expanded}
        aria-controls={panelId}
        aria-labelledby={`${triggerId}-label ${triggerId}`}
        aria-invalid={error ? true : undefined}
        disabled={disabled}
        onClick={toggleOpen}
      >
        {value.length === 0 ? (
          <span className="multi__placeholder">{placeholder}</span>
        ) : (
          <span className="multi__badges">
            {value.map((item) => (
              <Badge key={item} variant={badgeVariant}>
                {item}
              </Badge>
            ))}
          </span>
        )}
        <span className="multi__chevron" aria-hidden="true" />
      </button>
      {expanded && (
        <ul
          className="multi__panel"
          id={panelId}
          role="group"
          aria-labelledby={`${triggerId}-label`}
        >
          {options.map((option) => (
            <li key={option}>
              <label className="multi__option">
                <input
                  type="checkbox"
                  checked={value.includes(option)}
                  onChange={() => toggleOption(option)}
                />
                {option}
              </label>
            </li>
          ))}
        </ul>
      )}
      {error ? (
        <p className="field__message field__message--error">{error}</p>
      ) : (
        hint && <p className="field__message">{hint}</p>
      )}
    </div>
  );
}
