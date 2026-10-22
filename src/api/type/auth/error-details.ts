import { z } from 'zod';

// Parsed leniently: only the zod issues the API attaches to a 400 are of interest.
export const errorDetailsBodySchema = z.looseObject({
  error: z.looseObject({
    code: z.string().optional(),
    details: z
      .array(
        z.looseObject({ path: z.array(z.union([z.string(), z.number()])), message: z.string() }),
      )
      .optional(),
  }),
});
