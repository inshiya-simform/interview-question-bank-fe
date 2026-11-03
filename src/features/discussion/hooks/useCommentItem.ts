import { useState } from 'react';
import type { Comment } from '@/api';
import { formatRelativeTime } from '@/utils/relativeTime';
import type { CommentActions, CommentInput, SubmitCallbacks } from '../schema';
import { splitMentions } from '../utils';

export function useCommentItem(comment: Comment, actions: CommentActions) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const body = comment.body ?? '';

  const closeDelete = () => setIsDeleteOpen(false);

  return {
    isDeleted: comment.deleted,
    isEdited: comment.editedAt !== null,
    createdAgo: formatRelativeTime(comment.createdAt),
    parts: splitMentions(body, comment.mentions),
    isEditing,
    isDeleteOpen,
    // What an unchanged edit would send, so the composer can refuse it.
    original: { body, mentionIds: comment.mentions.map((person) => person.id) },
    startEdit: () => setIsEditing(true),
    stopEdit: () => setIsEditing(false),
    openDelete: () => setIsDeleteOpen(true),
    closeDelete,
    confirmDelete: () => actions.remove(comment, closeDelete),
    submitEdit: (input: CommentInput, callbacks: SubmitCallbacks) =>
      actions.edit(comment.id, input, {
        ...callbacks,
        onSuccess: () => setIsEditing(false),
      }),
  };
}
