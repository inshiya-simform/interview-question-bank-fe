import { z } from 'zod';
import { COMMENT_MAX_LENGTH, MESSAGES } from '@/constants';
import type { Comment } from '@/api';
import type { VoteValue } from '@/constants';

export const commentFormSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, MESSAGES.COMMENT_REQUIRED)
    .max(COMMENT_MAX_LENGTH, MESSAGES.COMMENT_TOO_LONG),
});

export interface CommentInput {
  body: string;
  mentionIds: string[];
}

export interface PostCommentInput extends CommentInput {
  parentId: string | null;
}

export interface SubmitCallbacks {
  onSuccess: () => void;
  // Ids of mentioned people who lost access to the question since they were picked.
  onLostMentions: (ids: readonly string[]) => void;
}

// What the comment views can do, wired once in `useDiscussion`. `questionId` rides along because
// every nested composer needs it to search for people who can see this question.
export interface CommentActions {
  questionId: string;
  isPosting: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  post: (input: PostCommentInput, callbacks: SubmitCallbacks) => void;
  edit: (commentId: string, input: CommentInput, callbacks: SubmitCallbacks) => void;
  remove: (comment: Pick<Comment, 'id' | 'parentId'>, onSuccess: () => void) => void;
  vote: (commentId: string, value: VoteValue) => void;
}
