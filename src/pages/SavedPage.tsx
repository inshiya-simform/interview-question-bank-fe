import { PageHeader } from '@/components';
import { SAVED_COPY } from '@/constants';
import { CollectionHeader, CollectionList, SavedQuestionList } from '@/features/saved';
import { useSavedPage } from './useSavedPage';
import './SavedPage.css';

const TITLE_ID = 'saved-collection-title';

export function SavedPage() {
  const saved = useSavedPage();

  return (
    <div className="saved">
      <PageHeader title={SAVED_COPY.PAGE_TITLE} subtitle={SAVED_COPY.PAGE_SUBTITLE} />
      <div className="saved__layout">
        <CollectionList
          collections={saved.collections}
          totalCount={saved.totalCount}
          selectedId={saved.collectionId}
          onCreated={saved.selectCollection}
        />
        <section className="saved__main" aria-labelledby={TITLE_ID}>
          <CollectionHeader
            titleId={TITLE_ID}
            collection={saved.selected}
            totalCount={saved.totalCount}
            onDeleted={() => saved.selectCollection()}
          />
          <SavedQuestionList
            collectionId={saved.collectionId}
            page={saved.page}
            onPageChange={saved.setPage}
          />
        </section>
      </div>
    </div>
  );
}
