import { useState } from 'react';
import type { FormEvent } from 'react';
import type { SelectOption } from '@/components';
import { addQuestionSchema } from '../schema';
import type { AddQuestionValues, CategoryTags } from '../schema';
import { useQuestionOptions } from './useQuestionOptions';

type Errors = Partial<Record<keyof AddQuestionValues, string>>;

const EMPTY_ROW: CategoryTags = { category: '', tags: [] };

const INITIAL_VALUES: AddQuestionValues = {
  question: '',
  answer: '',
  categories: [EMPTY_ROW],
  clientId: '',
};

export function useAddQuestionForm(
  onSubmit: (values: AddQuestionValues, onSuccess: () => void) => void,
) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState<Errors>({});
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
    value: AddQuestionValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
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
    setValues(INITIAL_VALUES);
    setErrors({});
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = addQuestionSchema.safeParse(values);
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (field === 'question' || field === 'answer' || field === 'categories') {
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
