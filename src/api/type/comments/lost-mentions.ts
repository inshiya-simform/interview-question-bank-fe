import { z } from 'zod';

// A 400 carries the ids of mentioned people who can no longer see the question.
export const lostMentionsBodySchema = z.looseObject({
  error: z.looseObject({
    details: z.looseObject({ mentions: z.array(z.string()) }),
  }),
});
