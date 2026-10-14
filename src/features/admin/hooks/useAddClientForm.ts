import { toast } from 'react-toastify';
import { createClientSchema } from '@/api';
import { useCreateClientMutation } from '@/api/hooks';
import { MESSAGES } from '@/constants';
import { useZodForm } from '@/hooks/useZodForm';

export function useAddClientForm(onDone: () => void) {
  const mutation = useCreateClientMutation();

  const form = useZodForm(createClientSchema, { name: '' }, (values, reset) =>
    mutation.mutate(createClientSchema.parse(values), {
      onSuccess: () => {
        toast.success(MESSAGES.CLIENT_ADDED);
        reset();
        onDone();
      },
    }),
  );

  return { ...form, isPending: mutation.isPending };
}
