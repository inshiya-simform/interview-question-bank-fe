import { IMAGE_UPLOAD_FIELD } from '@/constants';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { uploadImagePayloadSchema, uploadImageResponseSchema } from '../type/uploads/upload-image';
import type { UploadImagePayload, UploadImageResponse } from '../type/uploads/upload-image';

export async function uploadImage(payload: UploadImagePayload): Promise<UploadImageResponse> {
  const { file } = uploadImagePayloadSchema.parse(payload);
  const body = new FormData();
  body.append(IMAGE_UPLOAD_FIELD, file);
  const { data } = await apiClient.post(API_ENDPOINTS.UPLOADS.IMAGE, body);
  return uploadImageResponseSchema.parse(data);
}
