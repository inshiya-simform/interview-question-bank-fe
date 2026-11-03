import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  createCommentPayloadSchema,
  updateCommentPayloadSchema,
} from '../type/comments/comment-payload';
import type { CreateCommentPayload, UpdateCommentPayload } from '../type/comments/comment-payload';
import { commentListParamsSchema, commentListResponseSchema } from '../type/comments/comments-list';
import type { CommentListParams, CommentListResponse } from '../type/comments/comments-list';
import {
  mentionableUsersParamsSchema,
  mentionableUsersResponseSchema,
} from '../type/comments/mentionable-users';
import type {
  MentionableUsersParams,
  MentionableUsersResponse,
} from '../type/comments/mentionable-users';
import { replyListParamsSchema, listRepliesResponseSchema } from '../type/comments/replies-list';
import type { ListRepliesResponse, ReplyListParams } from '../type/comments/replies-list';
import { commentSchema } from '../type/comments/shared';
import type { Comment } from '../type/comments/shared';
import { voteCommentPayloadSchema, voteCommentResponseSchema } from '../type/comments/vote-comment';
import type { VoteCommentPayload, VoteCommentResponse } from '../type/comments/vote-comment';

export async function getComments(
  questionId: string,
  params: CommentListParams = {},
  signal?: AbortSignal,
): Promise<CommentListResponse> {
  const { data } = await apiClient.get(API_ENDPOINTS.QUESTIONS.COMMENTS(questionId), {
    params: commentListParamsSchema.parse(params),
    signal,
  });
  return commentListResponseSchema.parse(data);
}

export async function createComment(
  questionId: string,
  payload: CreateCommentPayload,
): Promise<Comment> {
  const { data } = await apiClient.post(
    API_ENDPOINTS.QUESTIONS.COMMENTS(questionId),
    createCommentPayloadSchema.parse(payload),
  );
  return commentSchema.parse(data);
}

export async function updateComment(
  questionId: string,
  commentId: string,
  payload: UpdateCommentPayload,
): Promise<Comment> {
  const { data } = await apiClient.patch(
    API_ENDPOINTS.QUESTIONS.COMMENT(questionId, commentId),
    updateCommentPayloadSchema.parse(payload),
  );
  return commentSchema.parse(data);
}

// Starts at the thread's oldest reply, so it supersedes the preview that came with the thread.
export async function getReplies(
  questionId: string,
  commentId: string,
  params: ReplyListParams = {},
  signal?: AbortSignal,
): Promise<ListRepliesResponse> {
  const { data } = await apiClient.get(
    API_ENDPOINTS.QUESTIONS.COMMENT_REPLIES(questionId, commentId),
    {
      params: replyListParamsSchema.parse(params),
      signal,
    },
  );
  return listRepliesResponseSchema.parse(data);
}

// 204 with no body.
export async function deleteComment(questionId: string, commentId: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.QUESTIONS.COMMENT(questionId, commentId));
}

export async function voteComment(
  questionId: string,
  commentId: string,
  payload: VoteCommentPayload,
): Promise<VoteCommentResponse> {
  const { data } = await apiClient.put(
    API_ENDPOINTS.QUESTIONS.COMMENT_VOTE(questionId, commentId),
    voteCommentPayloadSchema.parse(payload),
  );
  return voteCommentResponseSchema.parse(data);
}

export async function getMentionableUsers(
  questionId: string,
  params: MentionableUsersParams,
  signal?: AbortSignal,
): Promise<MentionableUsersResponse> {
  const { data } = await apiClient.get(API_ENDPOINTS.QUESTIONS.MENTIONABLE_USERS(questionId), {
    params: mentionableUsersParamsSchema.parse(params),
    signal,
  });
  return mentionableUsersResponseSchema.parse(data);
}
