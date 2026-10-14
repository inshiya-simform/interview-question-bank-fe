import { Button, MultiSelect, SelectField, TextField } from '@/components';
import type { SelectOption } from '@/components';
import type { TagCategory } from '@/api';
import { QUESTIONS_COPY } from '@/constants';
import type { QuestionFilters as Filters } from '../filters';
import { useQuestionFilterBar } from '../hooks/useQuestionFilterBar';
import './QuestionFilters.css';

interface QuestionFiltersProps {
  filters: Filters;
  searchInput: string;
  categories: TagCategory[];
  clientOptions: readonly SelectOption[];
  onSearchChange: (value: string) => void;
  onChange: (patch: Partial<Filters>) => void;
  onClear: () => void;
}

export function QuestionFilters({
  filters,
  searchInput,
  categories,
  clientOptions,
  onSearchChange,
  onChange,
  onClear,
}: QuestionFiltersProps) {
  const {
    categoryOptions,
    tagOptions,
    isTagsDisabled,
    changeCategories,
    changeTags,
    changeClient,
  } = useQuestionFilterBar({ filters, categories, onChange });

  return (
    <form
      className="qfilters"
      role="search"
      aria-label={QUESTIONS_COPY.FILTERS_LABEL}
      onSubmit={(event) => event.preventDefault()}
    >
      <TextField
        className="qfilters__search"
        type="search"
        name="search"
        label={QUESTIONS_COPY.FIELD_SEARCH}
        placeholder={QUESTIONS_COPY.PLACEHOLDER_SEARCH}
        value={searchInput}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <MultiSelect
        label={QUESTIONS_COPY.FIELD_CATEGORIES}
        options={categoryOptions}
        value={filters.categories}
        onChange={changeCategories}
        placeholder={QUESTIONS_COPY.PLACEHOLDER_FILTER_CATEGORIES}
        badgeVariant="category"
      />
      <MultiSelect
        label={QUESTIONS_COPY.FIELD_TAGS}
        options={tagOptions}
        value={filters.tags}
        onChange={changeTags}
        placeholder={QUESTIONS_COPY.PLACEHOLDER_FILTER_TAGS}
        badgeVariant="tag"
        disabled={isTagsDisabled}
        hint={isTagsDisabled ? QUESTIONS_COPY.HINT_TAGS_DISABLED : undefined}
      />
      <SelectField
        label={QUESTIONS_COPY.FIELD_CLIENT}
        name="client"
        clearable
        options={clientOptions}
        placeholder={QUESTIONS_COPY.PLACEHOLDER_FILTER_CLIENT}
        value={filters.clientId}
        onChange={(event) => changeClient(event.target.value)}
      />
      <Button variant="secondary" onClick={onClear}>
        {QUESTIONS_COPY.CLEAR_FILTERS}
      </Button>
    </form>
  );
}
