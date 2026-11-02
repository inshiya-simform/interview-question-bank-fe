import { DISCUSSION_COPY } from '@/constants';
import { VOTE } from '../constants';
import type { VoteValue } from '../constants';
import { nextVote } from '../utils';

export function useVoteControl(
  myVote: VoteValue,
  authorName: string,
  onVote: (value: VoteValue) => void,
) {
  const isUp = myVote === VOTE.UP;
  const isDown = myVote === VOTE.DOWN;

  return {
    isUp,
    isDown,
    upLabel: isUp ? DISCUSSION_COPY.REMOVE_UPVOTE(authorName) : DISCUSSION_COPY.UPVOTE(authorName),
    downLabel: isDown
      ? DISCUSSION_COPY.REMOVE_DOWNVOTE(authorName)
      : DISCUSSION_COPY.DOWNVOTE(authorName),
    up: () => onVote(nextVote(myVote, VOTE.UP)),
    down: () => onVote(nextVote(myVote, VOTE.DOWN)),
  };
}
