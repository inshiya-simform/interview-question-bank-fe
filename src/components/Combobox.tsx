import { createPortal } from 'react-dom';
import { useFieldIds } from '@/hooks/useFieldIds';
import { useLoadMoreSentinel } from '@/hooks/useLoadMoreSentinel';
import { cn } from '@/utils/cn';
import type { SelectOption } from './selectOption';
import { useCombobox } from './useCombobox';
import './TextField.css';
import './Combobox.css';

interface ComboboxProps {
  label: string;
  options: readonly SelectOption[];
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  emptyText: string;
  loadingText: string;
  isLoading?: boolean;
  onQueryChange?: (query: string) => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  autoFocus?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function Combobox({
  label,
  options,
  value,
  onChange,
  placeholder,
  emptyText,
  loadingText,
  isLoading,
  onQueryChange,
  hasMore,
  isLoadingMore,
  onLoadMore,
  autoFocus,
  disabled,
  error,
  className,
}: ComboboxProps) {
  const { inputId, errorId } = useFieldIds();
  const { inputRef, ...combo } = useCombobox({ options, value, onChange, onQueryChange });
  const sentinelRef = useLoadMoreSentinel(() => onLoadMore?.(), Boolean(hasMore && !isLoadingMore));
  const showPanel = combo.isOpen && !disabled;

  return (
    <div className={cn('field combo', className)}>
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        ref={inputRef}
        className="field__input"
        role="combobox"
        autoComplete="off"
        aria-expanded={showPanel}
        aria-controls={combo.listboxId}
        aria-autocomplete="list"
        aria-activedescendant={combo.activeDescendant}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        autoFocus={autoFocus}
        disabled={disabled}
        placeholder={placeholder}
        value={combo.inputValue}
        onChange={combo.handleInputChange}
        onKeyDown={combo.handleKeyDown}
        onFocus={combo.open}
        onBlur={combo.close}
      />
      {showPanel &&
        createPortal(
          <ul
            className="combo__panel"
            id={combo.listboxId}
            role="listbox"
            aria-label={label}
            style={combo.panelStyle}
            // Keep focus in the input so blur (and closing) doesn't fire on panel clicks or scrollbar drags.
            onMouseDown={(event) => event.preventDefault()}
          >
            {isLoading && <li className="combo__status">{loadingText}</li>}
            {!isLoading && combo.filtered.length === 0 && (
              <li className="combo__status">{emptyText}</li>
            )}
            {combo.filtered.map((option, index) => (
              <li
                key={option.value}
                id={combo.optionId(index)}
                role="option"
                aria-selected={option.value === value}
                className={cn(
                  'combo__option',
                  index === combo.activeIndex && 'combo__option--active',
                )}
                onClick={() => combo.select(option)}
              >
                <span>{option.label}</span>
                {option.description && <span className="combo__hint">{option.description}</span>}
              </li>
            ))}
            {hasMore && (
              <li ref={sentinelRef} className="combo__status">
                {loadingText}
              </li>
            )}
          </ul>,
          document.body,
        )}
      {error && (
        <p id={errorId} className="field__message field__message--error">
          {error}
        </p>
      )}
    </div>
  );
}
