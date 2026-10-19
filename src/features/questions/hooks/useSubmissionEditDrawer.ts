import { toast } from 'react-toastify';
import { MESSAGES } from '@/constants';
import { resubmitSubmission, useSubmissions } from '@/features/review';
import type { QuestionFormValues } from '../schema';
import { buildInitialValues } from '../utils';
import { useQuestionOptions } from './useQuestionOptions';

// MOCK: resubmits into the local review store until the real update endpoint is wired.
export function useSubmissionEditDrawer(submissionId: string | null, onClose: () => void) {
  const submissions = useSubmissions();
  const options = useQuestionOptions();
  const submission = submissions.find((item) => item.id === submissionId);

  const resubmit = (values: QuestionFormValues, onSuccess: () => void) => {
    if (!submission) return;
    resubmitSubmission(submission.id, { text: values.question, answerNotes: values.answer });
    toast.success(MESSAGES.QUESTION_RESUBMITTED);
    onSuccess();
    onClose();
  };

  return {
    submission,
    initialValues: submission
      ? buildInitialValues(submission.content, options.categories)
      : undefined,
    // Initial values depend on the category list, so wait for it before mounting the form.
    isReady: submission !== undefined && !options.isLoading,
    resubmit,
  };
}
