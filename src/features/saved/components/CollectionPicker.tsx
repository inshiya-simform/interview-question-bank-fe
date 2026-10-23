import type { Question } from '@/api';
import { Icon } from '@/components';
import { SAVED_COPY } from '@/constants';
import { useCollectionPicker } from '../hooks/useCollectionPicker';
import { CollectionNameForm } from './CollectionNameForm';
import './CollectionPicker.css';

interface CollectionPickerProps {
  question: Question;
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
      {showForm ? (
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
                  onChange={() => picker.select(collection)}
                />
                <span className="picker__name">{collection.name}</span>
                {collection.id === currentCollectionId && (
                  <span className="picker__current">{SAVED_COPY.CURRENT}</span>
                )}
                <span className="picker__count">{collection.questionCount}</span>
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
