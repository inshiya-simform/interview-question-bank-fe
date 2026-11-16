import { useState } from 'react';
import { TAG_DIALOG } from '@/features/tag-management';
import type { TagDialogState } from '@/features/tag-management';

export function useTagManagementPage() {
  const [dialog, setDialog] = useState<TagDialogState | undefined>();

  return {
    dialog,
    openDialog: setDialog,
    closeDialog: () => setDialog(undefined),
    openCreateCategory: () => setDialog({ kind: TAG_DIALOG.CREATE_CATEGORY }),
  };
}
