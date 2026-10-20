import { PERMISSIONS } from '@/constants';
import { usePermissions } from '@/hooks/usePermissions';

// Cosmetic gating only: the API enforces who may create questions.
export function useImportCsvEntry() {
  const { hasAnyPermission } = usePermissions();
  return { canImport: hasAnyPermission([PERMISSIONS.QUESTION_CREATE]) };
}
