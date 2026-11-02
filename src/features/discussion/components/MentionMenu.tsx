import { DISCUSSION_COPY, ROLE_LABELS } from '@/constants';
import { cn } from '@/utils/cn';
import type { MentionUser } from '../schema';
import { mentionOptionId } from '../utils';
import { CommentAvatar } from './CommentAvatar';
import './MentionMenu.css';

interface MentionMenuProps {
  listId: string;
  users: readonly MentionUser[];
  activeIndex: number;
  onPick: (user: MentionUser) => void;
}

// Keyboard control stays in the textarea (aria-activedescendant), so options are never focused.
export function MentionMenu({ listId, users, activeIndex, onPick }: MentionMenuProps) {
  return (
    <div className="mmenu">
      {users.length === 0 ? (
        <p className="mmenu__empty" role="status">
          {DISCUSSION_COPY.MENTION_EMPTY}
        </p>
      ) : (
        <ul
          id={listId}
          role="listbox"
          aria-label={DISCUSSION_COPY.MENTION_LIST_LABEL}
          className="mmenu__list"
        >
          {users.map((user, index) => (
            <li
              key={user.id}
              id={mentionOptionId(listId, index)}
              role="option"
              aria-selected={index === activeIndex}
              aria-label={DISCUSSION_COPY.MENTION_OPTION(user.name, user.handle)}
              className={cn('mmenu__option', index === activeIndex && 'mmenu__option--active')}
              // Keeps focus (and the caret) in the textarea while picking with the mouse.
              onMouseDown={(event) => {
                event.preventDefault();
                onPick(user);
              }}
            >
              <CommentAvatar name={user.name} />
              <span className="mmenu__text">
                <span className="mmenu__name">{user.name}</span>
                <span className="mmenu__meta">
                  @{user.handle} · {ROLE_LABELS[user.role]}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
