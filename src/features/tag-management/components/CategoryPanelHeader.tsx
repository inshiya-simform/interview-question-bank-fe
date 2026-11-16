import type { ManagedCategory } from '@/api';
import { Button, Icon } from '@/components';
import { TAG_COPY } from '@/constants';
import { TAG_DIALOG } from '../constants';
import type { OpenTagDialog } from '../types';

interface CategoryPanelHeaderProps {
  category: ManagedCategory;
  onOpenDialog: OpenTagDialog;
}

export function CategoryPanelHeader({ category, onOpenDialog }: CategoryPanelHeaderProps) {
  const isLocked = category.questionCount > 0;
  const summary = isLocked
    ? TAG_COPY.CATEGORY_SUMMARY_USED(category.questionCount)
    : TAG_COPY.CATEGORY_SUMMARY_UNUSED;

  return (
    <div className="tag-panel__head">
      <div className="tag-panel__titles">
        <h2 id="tag-panel-title" className="tag-panel__title" title={category.name}>
          {category.name}
        </h2>
        <p className="tag-panel__summary">{summary}</p>
        {category.description && <p className="tag-panel__summary">{category.description}</p>}
      </div>
      <div className="tag-panel__actions">
        <Button
          variant="secondary"
          onClick={() => onOpenDialog({ kind: TAG_DIALOG.EDIT_CATEGORY, category })}
        >
          <Icon name="edit" size={16} />
          {TAG_COPY.EDIT_CATEGORY}
        </Button>
        {isLocked ? (
          <Button variant="secondary" className="tags__action--locked" disabled>
            <Icon name="lock" size={16} />
            {TAG_COPY.DELETE_IN_USE}
          </Button>
        ) : (
          <Button
            variant="danger"
            onClick={() => onOpenDialog({ kind: TAG_DIALOG.DELETE_CATEGORY, category })}
          >
            <Icon name="trash" size={16} />
            {TAG_COPY.DELETE_CATEGORY}
          </Button>
        )}
      </div>
    </div>
  );
}
