import './UserChip.css';

interface UserChipProps {
  label: string;
  removeLabel: string;
  disabled?: boolean;
  onRemove: () => void;
}

export function UserChip({ label, removeLabel, disabled, onRemove }: UserChipProps) {
  return (
    <span className="chip">
      {label}
      <button
        type="button"
        className="chip__remove"
        aria-label={removeLabel}
        disabled={disabled}
        onClick={onRemove}
      >
        <span aria-hidden="true">×</span>
      </button>
    </span>
  );
}
