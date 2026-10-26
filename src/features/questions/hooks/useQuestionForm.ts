import { useState } from 'react';
import type { FormEvent } from 'react';
import { getFieldErrors, parseDuplicateConflict } from '@/api';
import type { DuplicateMatch } from '@/api';
import { useUploadImageMutation } from '@/api/hooks';
import type { SelectOption } from '@/components';
import { MESSAGES } from '@/constants';
import { isDeepEqual } from '@/utils/isDeepEqual';
import { questionFormSchema } from '../schema';
import type { CategoryTags, SubmitErrorHandler, QuestionFormValues } from '../schema';
import { editableFields } from '../utils';
import { useDuplicateCheck } from './useDuplicateCheck';
import { useQuestionOptions } from './useQuestionOptions';

// `form` is an error about the form as a whole, e.g. submitting an edit with no changes.
type Errors = Partial<Record<keyof QuestionFormValues | 'form', string>>;

const EMPTY_ROW: CategoryTags = { category: '', tags: [] };

const INITIAL_VALUES: QuestionFormValues = {
  question: '',
  answer: '',
  categories: [EMPTY_ROW],
  clientId: '',
};

export function useQuestionForm(
  onSubmit: (
    values: QuestionFormValues,
    onSuccess: () => void,
    onSubmitError?: SubmitErrorHandler,
  ) => void,
  initialValues?: QuestionFormValues,
  checkDuplicates = false,
  questionId?: string,
) {
  const startValues = initialValues ?? INITIAL_VALUES;
  const [values, setValues] = useState(startValues);
  const [errors, setErrors] = useState<Errors>({});
  // Matches from a rejected save (409); the live dry-run check is only active when adding.
  const [serverMatches, setServerMatches] = useState<DuplicateMatch[]>([]);
  // The API only checks an edit when the text or client changed, so an untouched edit is skipped.
  const isDuplicateRelevantChange =
    values.question.trim() !== initialValues?.question.trim() ||
    values.clientId !== initialValues?.clientId;
  const liveDuplicates = useDuplicateCheck({
    text: values.question,
    clientId: values.clientId,
    excludeId: questionId,
    isActive: checkDuplicates && (!initialValues || isDuplicateRelevantChange),
  });
  const duplicates =
    serverMatches.length > 0 ? { matches: serverMatches, isChecking: false } : liveDuplicates;
  const isDuplicateBlocked = duplicates.matches.length > 0 && !values.confirmDistinct;
  const upload = useUploadImageMutation();
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
    // Duplicates are per client, so changing the text or client invalidates any earlier
    // "this is different" confirmation.
    const resetsDuplicates = field === 'question' || field === 'clientId';
    setValues((current) => ({
      ...current,
      [field]: value,
      ...(resetsDuplicates && { confirmDistinct: false, distinctReason: '' }),
    }));
    if (resetsDuplicates) setServerMatches([]);
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
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
    setErrors((current) => ({ ...current, categories: undefined, form: undefined }));
  };

  // Tags belong to a single category, so changing the category clears them.
  const setRowCategory = (index: number, category: string) =>
    updateRow(index, { category, tags: [] });

  const setRowTags = (index: number, tags: string[]) =>
    updateRow(index, { category: values.categories[index]?.category ?? '', tags });

  const addCategory = () => {
    setValues((current) => ({ ...current, categories: [...current.categories, EMPTY_ROW] }));
    setErrors((current) => ({ ...current, form: undefined }));
  };

  const removeCategory = (index: number) => {
    setErrors((current) => ({ ...current, form: undefined }));
    setValues((current) => ({
      ...current,
      categories:
        current.categories.length === 1
          ? [EMPTY_ROW]
          : current.categories.filter((_, i) => i !== index),
    }));
  };

  const reset = () => {
    setValues(startValues);
    setServerMatches([]);
    setErrors({});
  };

  // Resolves to the url the API returned; rejections are toasted centrally by the query client.
  const uploadImage = async (file: File) => (await upload.mutateAsync({ file })).url;

  const showServerErrors: SubmitErrorHandler = (error) => {
    const matches = parseDuplicateConflict(error);
    if (matches) setServerMatches(matches);
    const fields = getFieldErrors(error);
    setErrors((current) => ({
      ...current,
      question: fields.text ?? current.question,
      answer: fields.answerNotes ?? current.answer,
      distinctReason: fields.distinctReason ?? current.distinctReason,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Only edits (a form started from existing values) are compared; a new question always saves.
    if (initialValues && isDeepEqual(editableFields(initialValues), editableFields(values))) {
      setErrors({ form: MESSAGES.NOTHING_TO_EDIT });
      return;
    }
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
    onSubmit(result.data, reset, showServerErrors);
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
    uploadImage,
    reset,
  };
}
