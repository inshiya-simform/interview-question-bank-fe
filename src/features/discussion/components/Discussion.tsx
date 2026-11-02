import { Alert, Button, Loader } from '@/components';
import { DISCUSSION_COPY } from '@/constants';
import { useDiscussion } from '../hooks/useDiscussion';
import { CommentComposer } from './CommentComposer';
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
    threads,
    total,
    users,
    isLoading,
    isError,
    hasData,
    isPosting,
    refetch,
    postComment,
    postTopLevel,
    voteOnComment,
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
        users={users}
        label={DISCUSSION_COPY.COMPOSER_LABEL}
        placeholder={DISCUSSION_COPY.COMPOSER_PLACEHOLDER}
        hint={DISCUSSION_COPY.COMPOSER_HINT}
        submitLabel={isPosting ? DISCUSSION_COPY.SUBMITTING : DISCUSSION_COPY.SUBMIT}
        isPending={isPosting}
        onSubmit={postTopLevel}
      />
      {isLoading && <Loader label={DISCUSSION_COPY.LOADING} />}
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
            <CommentThread
              key={thread.id}
              thread={thread}
              users={users}
              isPosting={isPosting}
              onPost={postComment}
              onVote={voteOnComment}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
