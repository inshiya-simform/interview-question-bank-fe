import { useState } from 'react';
import { toast } from 'react-toastify';
import { saveTagSchema } from '@/api';
import { useCreateManagedTagMutation } from '@/api/hooks';
import { ApiError, getErrorMessage } from '@/api/errors';
import { HTTP_STATUS, MESSAGES, TAG_COPY } from '@/constants';
import { useZodForm } from '@/hooks/useZodForm';

export function useAddTagForm(categoryId: number, categoryName: string) {
  const mutation = useCreateManagedTagMutation();
  const [conflictError, setConflictError] = useState<string | undefined>();

  const form = useZodForm(saveTagSchema, { name: '' }, (values, reset) => {
    setConflictError(undefined);
    mutation.mutate(
      { categoryId, name: values.name },
      {
        onSuccess: () => {
          toast.success(MESSAGES.TAG_ADDED);
          reset();
        },
        // The mutation is silent, so only the 409 is shown inline; anything else is toasted here.
        onError: (error) => {
          if (error instanceof ApiError && error.status === HTTP_STATUS.CONFLICT) {
            setConflictError(TAG_COPY.TAG_NAME_TAKEN(values.name, categoryName));
            return;
          }
          toast.error(getErrorMessage(error));
        },
      },
    );
  });

  const handleChange: typeof form.handleChange = (event) => {
    setConflictError(undefined);
    form.handleChange(event);
  };

  return {
    ...form,
    handleChange,
    errors: { ...form.errors, name: form.errors.name ?? conflictError },
    isPending: mutation.isPending,
  };
}
