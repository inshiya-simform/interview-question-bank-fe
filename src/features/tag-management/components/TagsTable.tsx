import type { ManagedCategory } from '@/api';
import { Alert, Button, Loader, Pagination, TextField } from '@/components';
import { ADMIN_COPY, TAG_COPY } from '@/constants';
import { useTagsTable } from '../hooks/useTagsTable';
import type { OpenTagDialog } from '../types';
import { AddTagForm } from './AddTagForm';
import { TagsTableRow } from './TagsTableRow';
import './TagsTable.css';

interface TagsTableProps {
  category: ManagedCategory;
  onOpenDialog: OpenTagDialog;
}

export function TagsTable({ category, onOpenDialog }: TagsTableProps) {
  const {
    page,
    setPage,
    searchInput,
    setSearchInput,
    tags,
    total,
    totalPages,
    range,
    isLoading,
    isError,
    hasData,
    refetch,
  } = useTagsTable(category.id);

  return (
    <>
      <div className="tag-toolbar" role="search">
        <AddTagForm categoryId={category.id} categoryName={category.name} />
        <TextField
          className="tag-toolbar__search"
          type="search"
          name="tagSearch"
          label={TAG_COPY.FIELD_TAG_SEARCH}
          placeholder={TAG_COPY.PLACEHOLDER_TAG_SEARCH}
          autoComplete="off"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
      </div>
      <p className="tags__count" aria-live="polite">
        {hasData && tags.length > 0 ? TAG_COPY.TAGS_RANGE(range.start, range.end, total) : ''}
      </p>
      {isLoading && <Loader label={TAG_COPY.LOADING_TAGS} />}
      {isError && !hasData && (
        <div className="tags__error">
          <Alert>{TAG_COPY.LOAD_TAGS_ERROR}</Alert>
          <Button variant="secondary" onClick={refetch}>
            {TAG_COPY.RETRY}
          </Button>
        </div>
      )}
      {hasData && tags.length === 0 && <p className="tags__empty">{TAG_COPY.NO_TAGS}</p>}
      {tags.length > 0 && (
        <div className="tags__scroll">
          <table className="tags__table" aria-label={TAG_COPY.TAGS_LABEL(category.name)}>
            <thead>
              <tr>
                <th scope="col">{TAG_COPY.COLUMN_TAG}</th>
                <th scope="col">{TAG_COPY.COLUMN_QUESTIONS}</th>
                <th scope="col">{TAG_COPY.COLUMN_ACTIONS}</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <TagsTableRow
                  key={tag.id}
                  tag={tag}
                  category={category}
                  onOpenDialog={onOpenDialog}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 && (
        <div className="tags__pagination">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            label={TAG_COPY.TAGS_PAGINATION_LABEL}
            previousLabel={ADMIN_COPY.PREVIOUS_PAGE}
            nextLabel={ADMIN_COPY.NEXT_PAGE}
            pageLabel={ADMIN_COPY.PAGE_NUMBER}
            statusLabel={ADMIN_COPY.PAGE_STATUS(page, totalPages)}
          />
        </div>
      )}
    </>
  );
}
