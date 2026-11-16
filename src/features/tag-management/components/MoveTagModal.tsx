import type { ManagedCategory, ManagedTag } from '@/api';
import { Button, Combobox, Modal } from '@/components';
import { TAG_COPY } from '@/constants';
import { useMoveTagModal } from '../hooks/useMoveTagModal';

interface MoveTagModalProps {
  tag: ManagedTag;
  category: ManagedCategory;
  onClose: () => void;
}

export function MoveTagModal({ tag, category, onClose }: MoveTagModalProps) {
  const {
    options,
    targetId,
    target,
    error,
    isLoading,
    hasMore,
    isLoadingMore,
    loadMore,
    setSearch,
    select,
    handleSubmit,
    isPending,
  } = useMoveTagModal(tag, category, onClose);

  return (
    <Modal isOpen onClose={onClose} title={TAG_COPY.MOVE_TITLE(tag.name)}>
      <form className="tag-dialog" onSubmit={handleSubmit} noValidate>
        <Combobox
          label={TAG_COPY.MOVE_FIELD(category.name)}
          options={options}
          value={targetId}
          onChange={select}
          onQueryChange={setSearch}
          placeholder={TAG_COPY.MOVE_PLACEHOLDER}
          emptyText={TAG_COPY.MOVE_EMPTY}
          loadingText={TAG_COPY.MOVE_LOADING}
          isLoading={isLoading}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMore}
          autoFocus
          error={error}
        />
        <p className="tag-dialog__hint">
          {target ? TAG_COPY.MOVE_HINT(target.name) : TAG_COPY.MOVE_HINT_EMPTY}
        </p>
        <div className="tag-dialog__actions">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            {TAG_COPY.CANCEL}
          </Button>
          <Button type="submit" isLoading={isPending}>
            {TAG_COPY.MOVE_SUBMIT}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
