import { Button, SelectField, TextField } from '@/components';
import type { SelectOption } from '@/components';
import { AUDIT_COPY } from '@/constants';
import type { AuditFilters } from '../filters';

interface AuditLogFiltersProps {
  filters: AuditFilters;
  searchInput: string;
  moduleOptions: readonly SelectOption[];
  actionOptions: readonly SelectOption[];
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onModuleChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onClear: () => void;
}

export function AuditLogFilters({
  filters,
  searchInput,
  moduleOptions,
  actionOptions,
  hasActiveFilters,
  onSearchChange,
  onModuleChange,
  onActionChange,
  onFromChange,
  onToChange,
  onClear,
}: AuditLogFiltersProps) {
  return (
    <div className="audit__toolbar" role="search" aria-label={AUDIT_COPY.FILTERS_LABEL}>
      <SelectField
        className="audit__select"
        name="module"
        label={AUDIT_COPY.FIELD_MODULE}
        placeholder={AUDIT_COPY.PLACEHOLDER_MODULE}
        options={moduleOptions}
        value={filters.module ?? ''}
        onChange={(event) => onModuleChange(event.target.value)}
        clearable
      />
      <SelectField
        className="audit__select"
        name="action"
        label={AUDIT_COPY.FIELD_ACTION}
        placeholder={AUDIT_COPY.PLACEHOLDER_ACTION}
        options={actionOptions}
        value={filters.action ?? ''}
        onChange={(event) => onActionChange(event.target.value)}
        clearable
      />
      <TextField
        className="audit__search"
        type="search"
        name="search"
        label={AUDIT_COPY.FIELD_ACTOR}
        placeholder={AUDIT_COPY.PLACEHOLDER_ACTOR}
        value={searchInput}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <TextField
        className="audit__date"
        type="date"
        name="from"
        label={AUDIT_COPY.FIELD_FROM}
        max={filters.to}
        value={filters.from ?? ''}
        onChange={(event) => onFromChange(event.target.value)}
      />
      <TextField
        className="audit__date"
        type="date"
        name="to"
        label={AUDIT_COPY.FIELD_TO}
        min={filters.from}
        value={filters.to ?? ''}
        onChange={(event) => onToChange(event.target.value)}
      />
      <Button variant="secondary" disabled={!hasActiveFilters} onClick={onClear}>
        {AUDIT_COPY.CLEAR_FILTERS}
      </Button>
    </div>
  );
}
