import { useQuestionQuery } from '@/api/hooks';
import { REVIEW_STATUS } from '@/constants';
import { useSession } from '@/features/auth';
import { buildInitialValues } from '../utils';
import { NOTICE } from '../constants';
import { useQuestionOptions } from './useQuestionOptions';

export function useQuestionDrawer(editingId: string | null) {
  const { user } = useSession();
  const questionQuery = useQuestionQuery(user?.id, editingId);
  const options = useQuestionOptions();
  const isEditing = editingId !== null;

  const question = questionQuery.data;
  // An edit awaiting review is what the submitter last wrote, so the form continues from it.
  const initialValues = question
    ? buildInitialValues(question.review?.revision ?? question, options.categories)
    : undefined;

  const decision = question?.review?.decision;
  const notice = !isEditing
    ? NOTICE.NEW
    : question?.review?.status === REVIEW_STATUS.CHANGES_REQUESTED && decision
      ? NOTICE.CHANGES
      : NOTICE.LIVE_EDIT;

  return {
    isEditing,
    notice,
    decision,
    initialValues,
    // Options load inside the form itself; only wait for the question here.
    isLoading: isEditing && questionQuery.isPending,
    isError: isEditing && questionQuery.isError,
    isReady: !isEditing || initialValues !== undefined,
    refetch: () => void questionQuery.refetch(),
  };
}
