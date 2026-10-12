import { z } from 'zod';
import { MESSAGES } from '@/constants';

export const emailSchema = z
  .string()
  .trim()
  .min(1, MESSAGES.EMAIL_REQUIRED)
  .pipe(z.email(MESSAGES.EMAIL_INVALID));
