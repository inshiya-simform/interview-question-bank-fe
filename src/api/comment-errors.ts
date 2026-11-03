import { HTTP_STATUS } from '@/constants';
import { ApiError } from './errors';
import { lostMentionsBodySchema } from './type/comments/lost-mentions';

// Narrowing helper, not drift handling: any other 400 simply has no lost mentions.
export function getLostMentionIds(error: unknown): string[] {
  if (!(error instanceof ApiError) || error.status !== HTTP_STATUS.BAD_REQUEST) return [];
  const parsed = lostMentionsBodySchema.safeParse(error.body);
  return parsed.success ? parsed.data.error.details.mentions : [];
}
