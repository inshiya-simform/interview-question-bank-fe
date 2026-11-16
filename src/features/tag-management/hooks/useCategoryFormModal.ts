import { useState } from 'react';
import { toast } from 'react-toastify';
import { saveCategorySchema } from '@/api';
import type { ManagedCategory } from '@/api';
import { getErrorMessage } from '@/api/errors';
import { useCreateTagCategoryMutation, useUpdateTagCategoryMutation } from '@/api/hooks';
import { MESSAGES } from '@/constants';
import { useZodForm } from '@/hooks/useZodForm';
import { isDeepEqual } from '@/utils/isDeepEqual';
import { isConflictError } from '../errors';
import { useTagManagementParams } from './useTagManagementParams';

export function useCategoryFormModal(category: ManagedCategory | undefined, onClose: () => void) {
  const create = useCreateTagCategoryMutation();
  const update = useUpdateTagCategoryMutation();
  const { selectCategory } = useTagManagementParams();
  const [formError, setFormError] = useState<string | undefined>();
  const original = { name: category?.name ?? '', description: category?.description ?? '' };

  const fail = (error: unknown) =>
    isConflictError(error)
      ? setFormError(MESSAGES.CATEGORY_NAME_TAKEN)
      : toast.error(getErrorMessage(error));

  const form = useZodForm(saveCategorySchema, original, (values) => {
    setFormError(undefined);
    if (!category) {
      create.mutate(values, {
        onSuccess: (created) => {
          toast.success(MESSAGES.CATEGORY_CREATED);
          selectCategory(created.id);
          onClose();
        },
        onError: fail,
      });
      return;
    }
    if (isDeepEqual(values, original)) {
      setFormError(MESSAGES.NOTHING_TO_EDIT);
      return;
    }
    update.mutate(
      { categoryId: category.id, ...values },
      {
        onSuccess: () => {
          toast.success(MESSAGES.CATEGORY_UPDATED);
          onClose();
        },
        onError: fail,
      },
    );
  });

  const handleChange: typeof form.handleChange = (event) => {
    setFormError(undefined);
    form.handleChange(event);
  };

  return {
    ...form,
    handleChange,
    // A taken name belongs to the name field; "nothing to edit" is a form-level message.
    nameError: form.errors.name ?? (formError === MESSAGES.NOTHING_TO_EDIT ? undefined : formError),
    formError: formError === MESSAGES.NOTHING_TO_EDIT ? formError : undefined,
    isPending: create.isPending || update.isPending,
  };
}
