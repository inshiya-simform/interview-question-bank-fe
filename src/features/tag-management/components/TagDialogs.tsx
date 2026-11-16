import { TAG_DIALOG } from '../constants';
import type { OpenTagDialog, TagDialogState } from '../types';
import { CategoryFormModal } from './CategoryFormModal';
import { DeleteBlockedModal } from './DeleteBlockedModal';
import { DeleteCategoryModal } from './DeleteCategoryModal';
import { DeleteTagModal } from './DeleteTagModal';
import { MoveTagModal } from './MoveTagModal';
import { TagFormModal } from './TagFormModal';
import './TagDialogs.css';

interface TagDialogsProps {
  dialog: TagDialogState | undefined;
  onOpen: OpenTagDialog;
  onClose: () => void;
}

// Each modal mounts only while open, so its form state starts fresh every time.
export function TagDialogs({ dialog, onOpen, onClose }: TagDialogsProps) {
  if (!dialog) return null;
  const onBlocked = (name: string) => onOpen({ kind: TAG_DIALOG.BLOCKED, name });

  switch (dialog.kind) {
    case TAG_DIALOG.CREATE_CATEGORY:
      return <CategoryFormModal onClose={onClose} />;
    case TAG_DIALOG.EDIT_CATEGORY:
      return <CategoryFormModal category={dialog.category} onClose={onClose} />;
    case TAG_DIALOG.DELETE_CATEGORY:
      return (
        <DeleteCategoryModal category={dialog.category} onClose={onClose} onBlocked={onBlocked} />
      );
    case TAG_DIALOG.EDIT_TAG:
      return <TagFormModal tag={dialog.tag} category={dialog.category} onClose={onClose} />;
    case TAG_DIALOG.MOVE_TAG:
      return <MoveTagModal tag={dialog.tag} category={dialog.category} onClose={onClose} />;
    case TAG_DIALOG.DELETE_TAG:
      return <DeleteTagModal tag={dialog.tag} onClose={onClose} onBlocked={onBlocked} />;
    case TAG_DIALOG.BLOCKED:
      return <DeleteBlockedModal name={dialog.name} onClose={onClose} />;
    default: {
      const unreachable: never = dialog;
      return unreachable;
    }
  }
}
