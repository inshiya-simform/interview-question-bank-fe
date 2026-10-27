import { useState } from 'react';
import { toast } from 'react-toastify';
import { createClientSchema } from '@/api';
import { useCreateClientMutation } from '@/api/hooks';
import { ApiError, getErrorMessage } from '@/api/errors';
import { HTTP_STATUS, MESSAGES } from '@/constants';
import { useZodForm } from '@/hooks/useZodForm';

export function useAddClientForm(onDone: () => void) {
  const mutation = useCreateClientMutation();
  const [conflictError, setConflictError] = useState<string | undefined>();

  const form = useZodForm(createClientSchema, { name: '' }, (values, reset) => {
    setConflictError(undefined);
    mutation.mutate(createClientSchema.parse(values), {
      onSuccess: () => {
        toast.success(MESSAGES.CLIENT_ADDED);
        reset();
        onDone();
      },
      // The mutation is silent, so only the 409 is shown inline; anything else is toasted here.
      onError: (error) => {
        if (error instanceof ApiError && error.status === HTTP_STATUS.CONFLICT) {
          setConflictError(MESSAGES.CLIENT_NAME_TAKEN);
          return;
        }
        toast.error(getErrorMessage(error));
      },
    });
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
