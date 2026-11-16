import type { ManagedCategory, ManagedTag } from '@/api';
import { Button, Icon } from '@/components';
import { TAG_COPY } from '@/constants';
import { TAG_DIALOG } from '../constants';
import type { OpenTagDialog } from '../types';

interface TagsTableRowProps {
  tag: ManagedTag;
  category: ManagedCategory;
  onOpenDialog: OpenTagDialog;
}

export function TagsTableRow({ tag, category, onOpenDialog }: TagsTableRowProps) {
  const isLocked = tag.questionCount > 0;

  return (
    <tr>
      <th scope="row">
        <span className="badge badge--tag tags__tag" title={tag.name}>
          {tag.name}
        </span>
      </th>
      <td>{tag.questionCount}</td>
      <td>
        <div className="tags__actions">
          <Button
            variant="secondary"
            className="tags__action"
            aria-label={TAG_COPY.EDIT_TAG_LABEL(tag.name)}
            onClick={() => onOpenDialog({ kind: TAG_DIALOG.EDIT_TAG, tag, category })}
          >
            {TAG_COPY.EDIT}
          </Button>
          <Button
            variant="secondary"
            className="tags__action"
            aria-label={TAG_COPY.MOVE_TAG_LABEL(tag.name)}
            onClick={() => onOpenDialog({ kind: TAG_DIALOG.MOVE_TAG, tag, category })}
          >
            {TAG_COPY.MOVE}
          </Button>
          {isLocked ? (
            <Button
              variant="secondary"
              className="tags__action tags__action--locked"
              disabled
              aria-label={TAG_COPY.TAG_LOCKED_LABEL(tag.name, tag.questionCount)}
            >
              <Icon name="lock" size={14} />
              {TAG_COPY.IN_USE}
            </Button>
          ) : (
            <Button
              variant="danger"
              className="tags__action"
              aria-label={TAG_COPY.DELETE_TAG_LABEL(tag.name)}
              onClick={() => onOpenDialog({ kind: TAG_DIALOG.DELETE_TAG, tag })}
            >
              <Icon name="trash" size={14} />
              {TAG_COPY.DELETE}
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
