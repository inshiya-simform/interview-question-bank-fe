import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { tagListResponseSchema } from '../type/tags/tags-list';
import type { TagListResponse } from '../type/tags/tags-list';

export async function getTags(): Promise<TagListResponse> {
  const { data } = await apiClient.get(API_ENDPOINTS.TAGS.BASE);
  return tagListResponseSchema.parse(data);
}
