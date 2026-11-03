import { z } from 'zod';
import { VOTE } from '@/constants';
import { roleSchema } from '../auth/shared';

export const voteValueSchema = z.union([
  z.literal(VOTE.UP),
  z.literal(VOTE.DOWN),
  z.literal(VOTE.NONE),
]);

export const commentPersonSchema = z.object({ id: z.string(), name: z.string() });

export const commentSchema = z.object({
  id: z.string(),
  parentId: z.string().nullable(),
  // Null once the comment is deleted.
  body: z.string().nullable(),
  deleted: z.boolean(),
  author: commentPersonSchema,
  isReviewer: z.boolean(),
  mentions: z.array(commentPersonSchema),
  score: z.number().int(),
  myVote: voteValueSchema,
  createdAt: z.string(),
  editedAt: z.string().nullable(),
  canEdit: z.boolean(),
  canDelete: z.boolean(),
  canVote: z.boolean(),
});

// Top-level item of the thread list: only the first replies come with it.
export const threadSchema = commentSchema.extend({
  // Oldest first.
  replies: z.array(commentSchema),
  // Total live replies, so it can exceed `replies.length`.
  replyCount: z.number().int(),
  hasMoreReplies: z.boolean(),
});

export const mentionableUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: roleSchema,
});

export type CommentPerson = z.infer<typeof commentPersonSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type Thread = z.infer<typeof threadSchema>;
export type MentionableUser = z.infer<typeof mentionableUserSchema>;
