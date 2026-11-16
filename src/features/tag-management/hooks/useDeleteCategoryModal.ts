import { toast } from 'react-toastify';
import type { ManagedCategory } from '@/api';
import { getErrorMessage } from '@/api/errors';
import { useDeleteTagCategoryMutation } from '@/api/hooks';
import { MESSAGES } from '@/constants';
import { isConflictError } from '../errors';
import { useTagManagementParams } from './useTagManagementParams';

interface UseDeleteCategoryModalArgs {
  category: ManagedCategory;
  onClose: () => void;
  onBlocked: (name: string) => void;
}

export function useDeleteCategoryModal({
  category,
  onClose,
  onBlocked,
}: UseDeleteCategoryModalArgs) {
  const { mutate, isPending } = useDeleteTagCategoryMutation();
  const { selectCategory } = useTagManagementParams();

  return {
    isPending,
    confirm: () =>
      mutate(category.id, {
        onSuccess: () => {
          toast.success(MESSAGES.CATEGORY_DELETED);
          // The deleted category would 404 on refetch; fall back to the first listed one.
          selectCategory(undefined);
          onClose();
        },
        // A question started using one of its tags since the list loaded.
        onError: (error) =>
          isConflictError(error) ? onBlocked(category.name) : toast.error(getErrorMessage(error)),
      }),
  };
}
