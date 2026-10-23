import { IMAGE_MAX_BYTES, IMAGE_MIME_TYPES, RICH_TEXT_COPY } from '@/constants';

// Returns a user-facing message when the file can't be uploaded, otherwise null.
export function getImageFileError(file: File): string | null {
  if (!IMAGE_MIME_TYPES.some((type) => type === file.type))
    return RICH_TEXT_COPY.IMAGE_TYPE_INVALID;
  if (file.size > IMAGE_MAX_BYTES) return RICH_TEXT_COPY.IMAGE_TOO_LARGE;
  return null;
}

export const isImageFile = (file: File) => file.type.startsWith('image/');
