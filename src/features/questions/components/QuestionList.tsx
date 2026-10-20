import { Alert, Button, Loader, Pagination } from '@/components';
import { QUESTIONS_COPY } from '@/constants';
import { useQuestionList } from '../hooks/useQuestionList';
import { QuestionFilters } from './QuestionFilters';
import { QuestionItem } from './QuestionItem';
import './QuestionList.css';

interface QuestionListProps {
  onEdit: (id: string) => void;
}

export function QuestionList({ onEdit }: QuestionListProps) {
  const {
    filters,
    searchInput,
    setSearchInput,
    setPage,
    updateFilters,
    clearFilters,
    options,
    questions,
    total,
    totalPages,
    isLoading,
    isError,
    hasData,
    refetch,
    exportCsv,
    isExporting,
  } = useQuestionList();

  return (
    <section className="qsection" aria-labelledby="questions-title">
      <h2 id="questions-title" className="qlist__title">
        {QUESTIONS_COPY.LIST_TITLE}
      </h2>
      <QuestionFilters
        filters={filters}
        searchInput={searchInput}
        categories={options.categories}
        clientOptions={options.clientOptions}
        onSearchChange={setSearchInput}
        onChange={updateFilters}
        onClear={clearFilters}
      />
      <div className="qlist__summary">
        <p className="qlist__count" aria-live="polite">
          {hasData ? QUESTIONS_COPY.RESULT_COUNT(total) : ''}
        </p>
        <Button variant="secondary" isLoading={isExporting} onClick={exportCsv}>
          {QUESTIONS_COPY.EXPORT}
        </Button>
      </div>
      <div className="qlist__scroll">
        {isLoading && <Loader label={QUESTIONS_COPY.LOADING} />}
        {isError && !hasData && (
          <div className="qlist__error">
            <Alert>{QUESTIONS_COPY.LOAD_ERROR}</Alert>
            <Button variant="secondary" onClick={refetch}>
              {QUESTIONS_COPY.RETRY}
            </Button>
          </div>
        )}
        {hasData && questions.length === 0 && (
          <p className="qlist__empty">{QUESTIONS_COPY.EMPTY}</p>
        )}
        {questions.length > 0 && (
          <ul className="qlist">
            {questions.map((question) => (
              <QuestionItem key={question.id} question={question} onEdit={onEdit} />
            ))}
          </ul>
        )}
        {totalPages > 1 && (
          <Pagination
            page={filters.page}
            totalPages={totalPages}
            onPageChange={setPage}
            label={QUESTIONS_COPY.PAGINATION_LABEL}
            previousLabel={QUESTIONS_COPY.PREVIOUS_PAGE}
            nextLabel={QUESTIONS_COPY.NEXT_PAGE}
            pageLabel={QUESTIONS_COPY.PAGE_NUMBER}
            statusLabel={QUESTIONS_COPY.PAGE_STATUS(filters.page, totalPages)}
          />
        )}
      </div>
    </section>
  );
}
