import type { ImportRowError } from '@/api';
import { IMPORT_COPY } from '@/constants';
import { groupErrorsByRow } from '../utils';

export function useImportValidationErrors(details: readonly ImportRowError[]) {
  const groups = groupErrorsByRow(details);

  return {
    groups,
    summary: IMPORT_COPY.VALIDATION_SUMMARY(details.length, groups.length),
  };
}
