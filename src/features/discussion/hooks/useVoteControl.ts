import { DISCUSSION_COPY, VOTE } from '@/constants';
import type { VoteValue } from '@/constants';
import { nextVote } from '../utils';

export function useVoteControl(
  myVote: VoteValue,
  authorName: string,
  canVote: boolean,
  onVote: (value: VoteValue) => void,
) {
  const isUp = myVote === VOTE.UP;
  const isDown = myVote === VOTE.DOWN;

  return {
    isUp,
    isDown,
    // A disabled button gets no hover events in some browsers, so the group carries the tooltip too.
    tooltip: canVote ? undefined : DISCUSSION_COPY.VOTE_DISABLED,
    upLabel: isUp ? DISCUSSION_COPY.REMOVE_UPVOTE(authorName) : DISCUSSION_COPY.UPVOTE(authorName),
    downLabel: isDown
      ? DISCUSSION_COPY.REMOVE_DOWNVOTE(authorName)
      : DISCUSSION_COPY.DOWNVOTE(authorName),
    up: () => onVote(nextVote(myVote, VOTE.UP)),
    down: () => onVote(nextVote(myVote, VOTE.DOWN)),
  };
}
