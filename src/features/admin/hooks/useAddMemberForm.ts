import { toast } from 'react-toastify';
import { createStaffSchema } from '@/api';
import { useCreateStaffMutation } from '@/api/hooks';
import { MESSAGES, ROLES } from '@/constants';
import { useZodForm } from '@/hooks/useZodForm';

export function useAddMemberForm() {
  const mutation = useCreateStaffMutation();

  const form = useZodForm(createStaffSchema, { email: '', role: ROLES.AUTHOR }, (values, reset) =>
    mutation.mutate(createStaffSchema.parse(values), {
      onSuccess: () => {
        toast.success(MESSAGES.STAFF_ADDED);
        reset();
      },
    }),
  );

  return { ...form, isPending: mutation.isPending };
}
