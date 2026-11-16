import { Alert, Button, Loader } from '@/components';
import { TAG_COPY } from '@/constants';
import { useCategoryPanel } from '../hooks/useCategoryPanel';
import type { OpenTagDialog } from '../types';
import { CategoryPanelHeader } from './CategoryPanelHeader';
import { TagsTable } from './TagsTable';
import './CategoryPanel.css';

interface CategoryPanelProps {
  onOpenDialog: OpenTagDialog;
}

export function CategoryPanel({ onOpenDialog }: CategoryPanelProps) {
  const { category, isLoading, isError, hasNoCategories, refetch } = useCategoryPanel();

  if (hasNoCategories) {
    return (
      <section className="tag-panel tag-panel--message">
        <p className="tag-panel__empty">{TAG_COPY.EMPTY_SELECTION}</p>
      </section>
    );
  }

  if (!category) {
    return (
      <section className="tag-panel tag-panel--message">
        {isLoading && <Loader label={TAG_COPY.LOADING_TAGS} />}
        {isError && (
          <>
            <Alert>{TAG_COPY.LOAD_TAGS_ERROR}</Alert>
            <Button variant="secondary" onClick={refetch}>
              {TAG_COPY.RETRY}
            </Button>
          </>
        )}
      </section>
    );
  }

  return (
    <section className="tag-panel" aria-labelledby="tag-panel-title">
      <CategoryPanelHeader category={category} onOpenDialog={onOpenDialog} />
      {category.questionCount > 0 && (
        <p className="tag-panel__notice">
          <span aria-hidden="true">{TAG_COPY.LOCKED_GLYPH} </span>
          {TAG_COPY.CATEGORY_LOCKED_NOTICE(category.questionCount)}
        </p>
      )}
      {/* Remounts per category so the tag search starts from that category's URL state. */}
      <div className="tag-panel__body" key={category.id}>
        <TagsTable category={category} onOpenDialog={onOpenDialog} />
      </div>
    </section>
  );
}
