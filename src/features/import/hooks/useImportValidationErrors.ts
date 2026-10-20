import type { ImportRowError } from '@/api';
import { IMPORT_COPY, IMPORT_CSV_MIME, IMPORT_ERRORS_FILENAME } from '@/constants';
import { useFileDownload } from '@/hooks/useFileDownload';
import { buildErrorListCsv, groupErrorsByRow } from '../utils';

export function useImportValidationErrors(details: readonly ImportRowError[]) {
  const download = useFileDownload();
  const groups = groupErrorsByRow(details);

  return {
    groups,
    summary: IMPORT_COPY.VALIDATION_SUMMARY(details.length, groups.length),
    downloadErrors: () =>
      download(IMPORT_ERRORS_FILENAME, buildErrorListCsv(details), IMPORT_CSV_MIME),
  };
}
