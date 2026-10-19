import { toast } from 'react-toastify';
import type { ReviewedQuestion } from '@/api';
import { useUpdateQuestionMutation } from '@/api/hooks';
import { MESSAGES } from '@/constants';
import type { QuestionFormValues } from '../schema';
import { buildInitialValues, buildQuestionPayload } from '../utils';
import { useQuestionOptions } from './useQuestionOptions';

// Resubmitting is a regular update; the list refetches because the update invalidates the
// questions query prefix.
export function useSubmissionEditDrawer(submission: ReviewedQuestion | null, onClose: () => void) {
  const options = useQuestionOptions();
  const update = useUpdateQuestionMutation();

  const resubmit = (values: QuestionFormValues, onSuccess: () => void) => {
    if (!submission) return;
    update.mutate(
      { id: submission.id, payload: buildQuestionPayload(values) },
      {
        onSuccess: () => {
          toast.success(MESSAGES.QUESTION_RESUBMITTED);
          onSuccess();
          onClose();
        },
      },
    );
  };

  return {
    // An edit awaiting review is what the submitter last wrote, so the form continues from it.
    initialValues: submission
      ? buildInitialValues(submission.draft ?? submission, options.categories)
      : undefined,
    // Initial values depend on the category list, so wait for it before mounting the form.
    isReady: submission !== null && !options.isLoading,
    isSubmitting: update.isPending,
    resubmit,
  };
}
