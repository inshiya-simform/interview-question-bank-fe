import { z } from 'zod';

export const uploadImagePayloadSchema = z.object({
  file: z.instanceof(File),
});

// The url may be absolute or relative to the API host, so it is used exactly as returned.
export const uploadImageResponseSchema = z.object({
  id: z.string(),
  url: z.string().min(1),
});

export type UploadImagePayload = z.infer<typeof uploadImagePayloadSchema>;
export type UploadImageResponse = z.infer<typeof uploadImageResponseSchema>;
