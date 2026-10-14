import type { SelectOption } from '@/components';
import type { TagCategory } from '@/api';
import type { QuestionFilters } from '../filters';

interface UseQuestionFilterBarArgs {
  filters: QuestionFilters;
  categories: TagCategory[];
  onChange: (patch: Partial<QuestionFilters>) => void;
}

export function useQuestionFilterBar({ filters, categories, onChange }: UseQuestionFilterBarArgs) {
  const categoryOptions: SelectOption[] = categories.map(({ id, name }) => ({
    value: String(id),
    label: name,
  }));

  // Tag options come from the already-loaded categories (the tags API nests tags per category).
  const tagOptions: SelectOption[] = categories
    .filter(({ id }) => filters.categories.includes(String(id)))
    .flatMap(({ tags }) => tags.map(({ id, name }) => ({ value: String(id), label: name })));

  const changeCategories = (next: string[]) => {
    const allowed = new Set(
      categories
        .filter(({ id }) => next.includes(String(id)))
        .flatMap(({ tags }) => tags.map(({ id }) => String(id))),
    );
    onChange({ categories: next, tags: filters.tags.filter((tag) => allowed.has(tag)) });
  };

  return {
    categoryOptions,
    tagOptions,
    isTagsDisabled: filters.categories.length === 0,
    changeCategories,
    changeTags: (tags: string[]) => onChange({ tags }),
    changeClient: (clientId: string) => onChange({ clientId }),
  };
}
