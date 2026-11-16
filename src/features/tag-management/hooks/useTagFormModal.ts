import { useState } from 'react';
import { toast } from 'react-toastify';
import { saveTagSchema } from '@/api';
import type { ManagedCategory, ManagedTag } from '@/api';
import { getErrorMessage } from '@/api/errors';
import { useRenameManagedTagMutation } from '@/api/hooks';
import { MESSAGES, TAG_COPY } from '@/constants';
import { useZodForm } from '@/hooks/useZodForm';
import { isDeepEqual } from '@/utils/isDeepEqual';
import { isConflictError } from '../errors';

export function useTagFormModal(tag: ManagedTag, category: ManagedCategory, onClose: () => void) {
  const mutation = useRenameManagedTagMutation();
  const [nameError, setNameError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();

  const form = useZodForm(saveTagSchema, { name: tag.name }, (values) => {
    setNameError(undefined);
    if (isDeepEqual(values, { name: tag.name })) {
      setFormError(MESSAGES.NOTHING_TO_EDIT);
      return;
    }
    setFormError(undefined);
    mutation.mutate(
      { tagId: tag.id, name: values.name },
      {
        onSuccess: () => {
          toast.success(MESSAGES.TAG_UPDATED);
          onClose();
        },
        onError: (error) =>
          isConflictError(error)
            ? setNameError(TAG_COPY.TAG_NAME_TAKEN(values.name, category.name))
            : toast.error(getErrorMessage(error)),
      },
    );
  });

  const handleChange: typeof form.handleChange = (event) => {
    setNameError(undefined);
    setFormError(undefined);
    form.handleChange(event);
  };

  return {
    ...form,
    handleChange,
    nameError: form.errors.name ?? nameError,
    formError,
    isPending: mutation.isPending,
  };
}
