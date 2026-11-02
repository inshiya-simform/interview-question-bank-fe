import { z } from 'zod';
import { roleSchema } from '@/api';
import { COMMENT_MAX_LENGTH, MESSAGES } from '@/constants';
import { VOTE } from './constants';

// A person who can be mentioned; also the shape of a comment's author.
export const mentionUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  // Unique, lowercase; what follows the "@" in a comment body.
  handle: z.string(),
  role: roleSchema,
});

export const voteValueSchema = z.union([
  z.literal(VOTE.UP),
  z.literal(VOTE.DOWN),
  z.literal(VOTE.NONE),
]);

export const commentSchema = z.object({
  id: z.string(),
  author: mentionUserSchema,
  body: z.string(),
  mentions: z.array(mentionUserSchema),
  createdAt: z.string(),
  // Includes the viewer's own vote.
  score: z.number().int(),
  myVote: voteValueSchema,
  parentId: z.string().nullable(),
});

export const threadSchema = commentSchema.extend({
  replies: z.array(commentSchema),
});

export const commentFormSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, MESSAGES.COMMENT_REQUIRED)
    .max(COMMENT_MAX_LENGTH, MESSAGES.COMMENT_TOO_LONG),
});

export type MentionUser = z.infer<typeof mentionUserSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type Thread = z.infer<typeof threadSchema>;

export interface CommentInput {
  body: string;
  mentionIds: string[];
}

export interface PostCommentInput extends CommentInput {
  parentId: string | null;
}
