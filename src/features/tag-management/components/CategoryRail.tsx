import { Alert, Button, Loader, TextField } from '@/components';
import { TAG_COPY } from '@/constants';
import { useCategoryRail } from '../hooks/useCategoryRail';
import { CategoryRailItem } from './CategoryRailItem';
import './CategoryRail.css';

export function CategoryRail() {
  const {
    searchInput,
    setSearchInput,
    unusedOnly,
    setUnusedOnly,
    categories,
    total,
    selectedId,
    select,
    isLoading,
    isError,
    hasData,
    hasMore,
    sentinelRef,
    refetch,
  } = useCategoryRail();

  return (
    <section className="category-rail" aria-labelledby="category-rail-title">
      <div className="category-rail__head">
        <h2 id="category-rail-title" className="category-rail__title">
          {TAG_COPY.CATEGORIES_TITLE}
        </h2>
        <span className="category-rail__count" aria-live="polite">
          {hasData ? TAG_COPY.CATEGORIES_COUNT(categories.length, total) : ''}
        </span>
      </div>
      <TextField
        type="search"
        name="categorySearch"
        label={TAG_COPY.FIELD_CATEGORY_SEARCH}
        placeholder={TAG_COPY.PLACEHOLDER_CATEGORY_SEARCH}
        autoComplete="off"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
      />
      <label className="category-rail__unused">
        <input
          type="checkbox"
          checked={unusedOnly}
          onChange={(event) => setUnusedOnly(event.target.checked)}
        />
        {TAG_COPY.UNUSED_ONLY}
      </label>
      {isLoading && <Loader label={TAG_COPY.LOADING_CATEGORIES} />}
      {isError && !hasData && (
        <div className="category-rail__error">
          <Alert>{TAG_COPY.LOAD_CATEGORIES_ERROR}</Alert>
          <Button variant="secondary" onClick={refetch}>
            {TAG_COPY.RETRY}
          </Button>
        </div>
      )}
      {hasData && categories.length === 0 && (
        <p className="category-rail__empty">{TAG_COPY.NO_CATEGORIES}</p>
      )}
      {categories.length > 0 && (
        <ul className="category-rail__list" aria-label={TAG_COPY.CATEGORY_LIST_LABEL}>
          {categories.map((category) => (
            <CategoryRailItem
              key={category.id}
              category={category}
              isSelected={category.id === selectedId}
              onSelect={select}
            />
          ))}
          {hasMore && (
            <li ref={sentinelRef} className="category-rail__more">
              {TAG_COPY.LOADING_CATEGORIES}
            </li>
          )}
        </ul>
      )}
    </section>
  );
}
