import { useExportQuestionsMutation, useQuestionsQuery } from '@/api/hooks';
import { IMPORT_CSV_MIME, QUESTIONS_PAGE_SIZE } from '@/constants';
import { useSession } from '@/features/auth';
import { useFileDownload } from '@/hooks/useFileDownload';
import { toListParams } from '../filters';
import { useQuestionFilters } from './useQuestionFilters';
import { useQuestionOptions } from './useQuestionOptions';

export function useQuestionList() {
  const { user } = useSession();
  const filterState = useQuestionFilters();
  const options = useQuestionOptions();
  const query = useQuestionsQuery(user?.id, toListParams(filterState.filters));

  const download = useFileDownload();
  const exportMutation = useExportQuestionsMutation();

  const exportCsv = () => {
    // The export schema strips page/limit, so the whole filtered set is exported.
    exportMutation.mutate(toListParams(filterState.filters), {
      onSuccess: ({ filename, content }) => download(filename, content, IMPORT_CSV_MIME),
    });
  };

  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / QUESTIONS_PAGE_SIZE));

  return {
    ...filterState,
    options,
    questions: query.data?.questions ?? [],
    total,
    totalPages,
    isLoading: query.isPending,
    isError: query.isError,
    hasData: query.data !== undefined,
    exportCsv,
    isExporting: exportMutation.isPending,
    refetch: () => void query.refetch(),
  };
}
