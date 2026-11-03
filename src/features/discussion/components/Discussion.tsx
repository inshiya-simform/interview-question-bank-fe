import { Alert, Button } from '@/components';
import { DISCUSSION_COPY } from '@/constants';
import { useDiscussion } from '../hooks/useDiscussion';
import { CommentComposer } from './CommentComposer';
import { CommentSkeleton } from './CommentSkeleton';
import { CommentSortToggle } from './CommentSortToggle';
import { CommentThread } from './CommentThread';
import './Discussion.css';

interface DiscussionProps {
  questionId: string;
}

export function Discussion({ questionId }: DiscussionProps) {
  const {
    titleId,
    sort,
    setSort,
    actions,
    threads,
    total,
    isLoading,
    isError,
    hasData,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    loadMore,
  } = useDiscussion(questionId);

  return (
    <section className="discussion" aria-labelledby={titleId}>
      <div className="discussion__head">
        <h2 id={titleId} className="discussion__title">
          {DISCUSSION_COPY.TITLE}{' '}
          <span className="discussion__count" aria-live="polite">
            {hasData ? `· ${DISCUSSION_COPY.COUNT(total)}` : ''}
          </span>
        </h2>
        <CommentSortToggle value={sort} onChange={setSort} />
      </div>
      <CommentComposer
        questionId={questionId}
        label={DISCUSSION_COPY.COMPOSER_LABEL}
        placeholder={DISCUSSION_COPY.COMPOSER_PLACEHOLDER}
        hint={DISCUSSION_COPY.COMPOSER_HINT}
        submitLabel={actions.isPosting ? DISCUSSION_COPY.SUBMITTING : DISCUSSION_COPY.SUBMIT}
        isPending={actions.isPosting}
        onSubmit={(input, callbacks) => actions.post({ ...input, parentId: null }, callbacks)}
      />
      {isLoading && <CommentSkeleton />}
      {isError && !hasData && (
        <div className="discussion__state">
          <Alert>{DISCUSSION_COPY.LOAD_ERROR}</Alert>
          <Button variant="secondary" onClick={refetch}>
            {DISCUSSION_COPY.RETRY}
          </Button>
        </div>
      )}
      {hasData && threads.length === 0 && (
        <p className="discussion__empty">{DISCUSSION_COPY.EMPTY}</p>
      )}
      {threads.length > 0 && (
        <ul className="discussion__list">
          {threads.map((thread) => (
            <CommentThread key={thread.id} thread={thread} actions={actions} />
          ))}
        </ul>
      )}
      {hasNextPage && (
        <Button variant="secondary" isLoading={isFetchingNextPage} onClick={loadMore}>
          {isFetchingNextPage ? DISCUSSION_COPY.LOADING_MORE : DISCUSSION_COPY.LOAD_MORE}
        </Button>
      )}
    </section>
  );
}
