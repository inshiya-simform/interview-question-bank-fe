import { MultiSelect, SelectField } from '@/components';
import { QUESTIONS_COPY } from '@/constants';
import { tagsForCategory } from '../constants';
import type { CategoryTags } from '../schema';
import './CategoryTagsRow.css';

interface CategoryTagsRowProps {
  row: CategoryTags;
  categoryOptions: readonly string[];
  error?: string;
  onCategoryChange: (category: string) => void;
  onTagsChange: (tags: string[]) => void;
  onRemove: () => void;
}

export function CategoryTagsRow({
  row,
  categoryOptions,
  error,
  onCategoryChange,
  onTagsChange,
  onRemove,
}: CategoryTagsRowProps) {
  const hasCategory = row.category !== '';

  return (
    <div className="cat-row">
      <SelectField
        label={QUESTIONS_COPY.FIELD_CATEGORY}
        name="category"
        options={categoryOptions}
        placeholder={QUESTIONS_COPY.PLACEHOLDER_CATEGORY}
        value={row.category}
        onChange={(event) => onCategoryChange(event.target.value)}
        error={error}
      />
      <MultiSelect
        label={QUESTIONS_COPY.FIELD_TAGS}
        options={tagsForCategory(row.category)}
        value={row.tags}
        onChange={onTagsChange}
        placeholder={
          hasCategory ? QUESTIONS_COPY.PLACEHOLDER_TAGS : QUESTIONS_COPY.PLACEHOLDER_TAGS_DISABLED
        }
        badgeVariant="tag"
        disabled={!hasCategory}
        hint={QUESTIONS_COPY.HINT_TAGS}
      />
      <button type="button" className="cat-row__remove" onClick={onRemove}>
        {QUESTIONS_COPY.REMOVE_CATEGORY}
      </button>
    </div>
  );
}
