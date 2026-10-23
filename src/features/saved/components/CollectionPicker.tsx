import type { Question } from '@/api';
import { Alert, Button, Icon, Loader } from '@/components';
import { SAVED_COPY } from '@/constants';
import { useCollectionPicker } from '../hooks/useCollectionPicker';
import { CollectionNameForm } from './CollectionNameForm';
import './CollectionPicker.css';

interface CollectionPickerProps {
  question: Pick<Question, 'id'>;
  currentCollectionId?: string;
  title: string;
  onDone: () => void;
}

export function CollectionPicker({
  question,
  currentCollectionId,
  title,
  onDone,
}: CollectionPickerProps) {
  const picker = useCollectionPicker({ question, currentCollectionId, onDone });
  const hasCollections = picker.collections.length > 0;
  const showForm = picker.isCreating || !hasCollections;

  return (
    <div className="picker">
      <h3 className="picker__title">{title}</h3>
      {picker.isLoading ? (
        <Loader label={SAVED_COPY.LOADING} />
      ) : picker.isError ? (
        <div className="picker__form">
          <Alert>{SAVED_COPY.LOAD_ERROR}</Alert>
          <Button variant="secondary" onClick={picker.refetch}>
            {SAVED_COPY.RETRY}
          </Button>
        </div>
      ) : showForm ? (
        <div className="picker__form">
          {!hasCollections && <p className="picker__hint">{SAVED_COPY.FIRST_SAVE_HINT}</p>}
          <CollectionNameForm
            submitLabel={SAVED_COPY.CREATE_AND_SAVE}
            cancelLabel={SAVED_COPY.BACK}
            onSubmit={picker.createAndSave}
            onCancel={hasCollections ? picker.stopCreating : undefined}
          />
        </div>
      ) : (
        <>
          <fieldset className="picker__list">
            <legend className="sr-only">{SAVED_COPY.COLLECTIONS_LABEL}</legend>
            {picker.collections.map((collection) => (
              <label key={collection.id} className="picker__option">
                <input
                  type="radio"
                  name={picker.groupName}
                  checked={collection.id === currentCollectionId}
                  disabled={picker.isPending}
                  onChange={() => picker.select(collection)}
                />
                <span className="picker__name">{collection.name}</span>
                {collection.id === currentCollectionId && (
                  <span className="picker__current">{SAVED_COPY.CURRENT}</span>
                )}
                <span className="picker__count">{collection.count}</span>
              </label>
            ))}
          </fieldset>
          <div className="picker__footer">
            <button type="button" className="picker__action" onClick={picker.startCreating}>
              <Icon name="plus" size={16} />
              {SAVED_COPY.NEW_COLLECTION}
            </button>
            {picker.isMove && (
              <button
                type="button"
                className="picker__action picker__action--danger"
                disabled={picker.isPending}
                onClick={picker.remove}
              >
                <Icon name="bookmark" size={16} />
                {SAVED_COPY.REMOVE}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
