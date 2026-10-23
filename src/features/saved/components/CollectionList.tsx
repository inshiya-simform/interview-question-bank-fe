import { Link } from 'react-router-dom';
import { Icon } from '@/components';
import { SAVED_COPY } from '@/constants';
import { cn } from '@/utils/cn';
import { savedCollectionHref } from '../filters';
import { useCollectionList } from '../hooks/useCollectionList';
import type { Collection } from '../types';
import { CollectionNameForm } from './CollectionNameForm';
import './CollectionList.css';

interface CollectionListProps {
  collections: readonly Collection[];
  totalCount: number;
  selectedId?: string;
  onCreated: (collectionId: string) => void;
}

export function CollectionList({
  collections,
  totalCount,
  selectedId,
  onCreated,
}: CollectionListProps) {
  const list = useCollectionList(onCreated);
  const allSelected = !selectedId;

  return (
    <nav className="clist" aria-label={SAVED_COPY.COLLECTIONS_LABEL}>
      <ul className="clist__items">
        <li>
          <Link
            to={savedCollectionHref()}
            className={cn('clist__link', allSelected && 'clist__link--active')}
            aria-current={allSelected ? 'page' : undefined}
          >
            <span className="clist__name">{SAVED_COPY.ALL_SAVED}</span>
            <span className="clist__count">{totalCount}</span>
          </Link>
        </li>
        {collections.map((collection) => {
          const isSelected = collection.id === selectedId;
          return (
            <li key={collection.id}>
              <Link
                to={savedCollectionHref(collection.id)}
                className={cn('clist__link', isSelected && 'clist__link--active')}
                aria-current={isSelected ? 'page' : undefined}
              >
                <span className="clist__name">{collection.name}</span>
                <span className="clist__count">{collection.questionCount}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      {collections.length === 0 && <p className="clist__hint">{SAVED_COPY.NO_COLLECTIONS}</p>}
      <div className="clist__footer">
        {list.isCreating ? (
          <CollectionNameForm
            submitLabel={SAVED_COPY.CREATE}
            onSubmit={list.create}
            onCancel={list.stopCreating}
          />
        ) : (
          <button type="button" className="clist__new" onClick={list.startCreating}>
            <Icon name="plus" size={16} />
            {SAVED_COPY.NEW_COLLECTION}
          </button>
        )}
      </div>
    </nav>
  );
}
