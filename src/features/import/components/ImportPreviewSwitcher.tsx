import { SelectField, type SelectOption } from '@/components';
import { IMPORT_COPY, IMPORT_PREVIEW_LABELS, type ImportPreviewState } from '@/constants';
import { parsePreviewState } from '../utils';
import './ImportPreviewSwitcher.css';

const OPTIONS: readonly SelectOption[] = Object.entries(IMPORT_PREVIEW_LABELS).map(
  ([value, label]) => ({ value, label }),
);

interface ImportPreviewSwitcherProps {
  value: ImportPreviewState;
  onChange: (state: ImportPreviewState) => void;
}

export function ImportPreviewSwitcher({ value, onChange }: ImportPreviewSwitcherProps) {
  return (
    <div className="ipreview">
      <SelectField
        label={IMPORT_COPY.PREVIEW_LABEL}
        placeholder={IMPORT_COPY.PREVIEW_PLACEHOLDER}
        options={OPTIONS}
        value={value}
        onChange={(event) => {
          const state = parsePreviewState(event.target.value);
          if (state) onChange(state);
        }}
      />
      <p className="ipreview__hint">{IMPORT_COPY.PREVIEW_HINT}</p>
    </div>
  );
}
