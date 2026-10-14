import { useQuestionQuery } from '@/api/hooks';
import { useSession } from '@/features/auth';
import { buildInitialValues } from '../utils';
import { useQuestionOptions } from './useQuestionOptions';

export function useQuestionDrawer(editingId: string | null) {
  const { user } = useSession();
  const questionQuery = useQuestionQuery(user?.id, editingId);
  const options = useQuestionOptions();
  const isEditing = editingId !== null;

  const initialValues = questionQuery.data
    ? buildInitialValues(questionQuery.data, options.categories)
    : undefined;

  return {
    isEditing,
    initialValues,
    // Options load inside the form itself; only wait for the question here.
    isLoading: isEditing && questionQuery.isPending,
    isError: isEditing && questionQuery.isError,
    isReady: !isEditing || initialValues !== undefined,
    refetch: () => void questionQuery.refetch(),
  };
}
