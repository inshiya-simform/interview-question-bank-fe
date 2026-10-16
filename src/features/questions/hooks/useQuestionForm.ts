import { useState } from 'react';
import type { FormEvent } from 'react';
import type { SelectOption } from '@/components';
import { questionFormSchema } from '../schema';
import type { QuestionFormValues, CategoryTags } from '../schema';
import { useDuplicateCheck } from './useDuplicateCheck';
import { useQuestionOptions } from './useQuestionOptions';

type Errors = Partial<Record<keyof QuestionFormValues, string>>;

const EMPTY_ROW: CategoryTags = { category: '', tags: [] };

const INITIAL_VALUES: QuestionFormValues = {
  question: '',
  answer: '',
  categories: [EMPTY_ROW],
  clientId: '',
};

export function useQuestionForm(
  onSubmit: (values: QuestionFormValues, onSuccess: () => void) => void,
  initialValues: QuestionFormValues = INITIAL_VALUES,
  checkDuplicates = false,
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const duplicates = useDuplicateCheck(values.question, checkDuplicates);
  const isDuplicateBlocked = duplicates.matches.length > 0 && !values.confirmDistinct;
  const { categories, clientOptions, isLoading, isError, refetch } = useQuestionOptions();

  const categoryOptions: SelectOption[] = categories.map(({ id, name }) => ({
    value: String(id),
    label: name,
  }));
  const usedCategories = values.categories.map((row) => row.category);
  const optionsForRow = (index: number) =>
    categoryOptions.filter(
      (option) =>
        option.value === values.categories[index]?.category ||
        !usedCategories.includes(option.value),
    );
  const tagOptionsForRow = (category: string): SelectOption[] =>
    (categories.find(({ id }) => String(id) === category)?.tags ?? []).map(({ id, name }) => ({
      value: String(id),
      label: name,
    }));
  const canAddCategory =
    values.categories.every((row) => row.category !== '') &&
    values.categories.length < categoryOptions.length;

  const setField = <K extends 'question' | 'answer' | 'clientId'>(
    field: K,
    value: QuestionFormValues[K],
  ) => {
    // Changing the question text invalidates any earlier "this is different" confirmation.
    setValues((current) => ({
      ...current,
      [field]: value,
      ...(field === 'question' && { confirmDistinct: false, distinctReason: '' }),
    }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const setConfirmDistinct = (confirmDistinct: boolean) => {
    setValues((current) => ({
      ...current,
      confirmDistinct,
      ...(!confirmDistinct && { distinctReason: '' }),
    }));
    setErrors((current) => ({ ...current, distinctReason: undefined }));
  };

  const setDistinctReason = (distinctReason: string) => {
    setValues((current) => ({ ...current, distinctReason }));
    setErrors((current) => ({ ...current, distinctReason: undefined }));
  };

  const updateRow = (index: number, row: CategoryTags) => {
    setValues((current) => ({
      ...current,
      categories: current.categories.map((existing, i) => (i === index ? row : existing)),
    }));
    setErrors((current) => ({ ...current, categories: undefined }));
  };

  // Tags belong to a single category, so changing the category clears them.
  const setRowCategory = (index: number, category: string) =>
    updateRow(index, { category, tags: [] });

  const setRowTags = (index: number, tags: string[]) =>
    updateRow(index, { category: values.categories[index]?.category ?? '', tags });

  const addCategory = () =>
    setValues((current) => ({ ...current, categories: [...current.categories, EMPTY_ROW] }));

  const removeCategory = (index: number) =>
    setValues((current) => ({
      ...current,
      categories:
        current.categories.length === 1
          ? [EMPTY_ROW]
          : current.categories.filter((_, i) => i !== index),
    }));

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isDuplicateBlocked) return;
    // A stale confirmation must not demand a reason once no duplicates are shown.
    const hasMatches = duplicates.matches.length > 0;
    const result = questionFormSchema.safeParse(
      hasMatches ? values : { ...values, confirmDistinct: false, distinctReason: '' },
    );
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (
          field === 'question' ||
          field === 'answer' ||
          field === 'categories' ||
          field === 'distinctReason'
        ) {
          next[field] ??= issue.message;
        }
      }
      setErrors(next);
      return;
    }
    onSubmit(result.data, reset);
  };

  return {
    values,
    errors,
    canAddCategory,
    duplicates,
    isDuplicateBlocked,
    setConfirmDistinct,
    setDistinctReason,
    clientOptions,
    isLoading,
    isError,
    refetch,
    optionsForRow,
    tagOptionsForRow,
    setField,
    setRowCategory,
    setRowTags,
    addCategory,
    removeCategory,
    handleSubmit,
    reset,
  };
}
