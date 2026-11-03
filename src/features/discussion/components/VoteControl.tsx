import { Icon } from '@/components';
import { DISCUSSION_COPY } from '@/constants';
import type { VoteValue } from '@/constants';
import { cn } from '@/utils/cn';
import { useVoteControl } from '../hooks/useVoteControl';
import './VoteControl.css';

interface VoteControlProps {
  score: number;
  myVote: VoteValue;
  canVote: boolean;
  authorName: string;
  onVote: (value: VoteValue) => void;
}

export function VoteControl({ score, myVote, canVote, authorName, onVote }: VoteControlProps) {
  const { isUp, isDown, tooltip, upLabel, downLabel, up, down } = useVoteControl(
    myVote,
    authorName,
    canVote,
    onVote,
  );

  return (
    <div
      className="vote"
      role="group"
      aria-label={DISCUSSION_COPY.SCORE_LABEL(score, authorName)}
      title={tooltip}
    >
      <button
        type="button"
        className={cn('vote__btn', isUp && 'vote__btn--up')}
        aria-pressed={isUp}
        aria-label={upLabel}
        disabled={!canVote}
        title={tooltip}
        onClick={up}
      >
        <Icon name="arrowUp" size={16} filled={isUp} />
      </button>
      <span className="vote__score">{score}</span>
      <button
        type="button"
        className={cn('vote__btn', isDown && 'vote__btn--down')}
        aria-pressed={isDown}
        aria-label={downLabel}
        disabled={!canVote}
        title={tooltip}
        onClick={down}
      >
        <Icon name="arrowDown" size={16} filled={isDown} />
      </button>
    </div>
  );
}
