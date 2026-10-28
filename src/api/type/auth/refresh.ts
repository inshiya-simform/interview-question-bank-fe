import { z } from 'zod';

// Also the logout body: the backend takes the same single field for both.
export const refreshTokenPayloadSchema = z.object({ refreshToken: z.string().min(1) });

export const refreshResponseSchema = z.object({ token: z.string(), refreshToken: z.string() });

export type RefreshTokenPayload = z.infer<typeof refreshTokenPayloadSchema>;
export type RefreshResponse = z.infer<typeof refreshResponseSchema>;
