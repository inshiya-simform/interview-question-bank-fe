import type { ManagedCategory, ManagedTag } from '@/api';
import { TAG_DIALOG } from './constants';

export type TagDialogState =
  | { kind: typeof TAG_DIALOG.CREATE_CATEGORY }
  | { kind: typeof TAG_DIALOG.EDIT_CATEGORY; category: ManagedCategory }
  | { kind: typeof TAG_DIALOG.DELETE_CATEGORY; category: ManagedCategory }
  | { kind: typeof TAG_DIALOG.EDIT_TAG; tag: ManagedTag; category: ManagedCategory }
  | { kind: typeof TAG_DIALOG.MOVE_TAG; tag: ManagedTag; category: ManagedCategory }
  | { kind: typeof TAG_DIALOG.DELETE_TAG; tag: ManagedTag }
  | { kind: typeof TAG_DIALOG.BLOCKED; name: string };

export type OpenTagDialog = (dialog: TagDialogState) => void;
