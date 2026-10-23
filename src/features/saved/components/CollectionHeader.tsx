import { Button, Icon } from '@/components';
import { SAVED_COPY } from '@/constants';
import { useCollectionHeader } from '../hooks/useCollectionHeader';
import type { Collection } from '../types';
import { CollectionNameForm } from './CollectionNameForm';
import { DeleteCollectionModal } from './DeleteCollectionModal';
import './CollectionHeader.css';

interface CollectionHeaderProps {
  titleId: string;
  // Undefined means the "All saved" view, which has nothing to rename or delete.
  collection?: Collection;
  totalCount: number;
  onDeleted: () => void;
}

export function CollectionHeader({
  titleId,
  collection,
  totalCount,
  onDeleted,
}: CollectionHeaderProps) {
  const header = useCollectionHeader(collection);
  const count = collection?.questionCount ?? totalCount;

  return (
    <div className="chead">
      <div className="chead__text">
        {collection && header.isRenaming ? (
          <CollectionNameForm
            initialName={collection.name}
            submitLabel={SAVED_COPY.RENAME_SUBMIT}
            onSubmit={header.rename}
            onCancel={header.stopRenaming}
          />
        ) : (
          <h2 id={titleId} className="chead__title">
            {collection?.name ?? SAVED_COPY.ALL_SAVED}
          </h2>
        )}
        <p className="chead__count" aria-live="polite">
          {SAVED_COPY.COUNT(count)}
        </p>
      </div>
      {collection && !header.isRenaming && (
        <div className="chead__actions">
          <Button variant="secondary" onClick={header.startRenaming}>
            <Icon name="edit" size={16} />
            {SAVED_COPY.RENAME}
          </Button>
          <Button variant="danger" onClick={header.openDelete}>
            <Icon name="trash" size={16} />
            {SAVED_COPY.DELETE}
          </Button>
        </div>
      )}
      {collection && (
        <DeleteCollectionModal
          collection={collection}
          isOpen={header.isDeleteOpen}
          onClose={header.closeDelete}
          onDeleted={onDeleted}
        />
      )}
    </div>
  );
}
