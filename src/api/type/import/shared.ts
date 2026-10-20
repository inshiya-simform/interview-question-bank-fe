import { z } from 'zod';

export const importRowErrorSchema = z.object({
  // Spreadsheet row number: 1 is the header, the first data row is 2.
  row: z.number().int().min(1),
  column: z.string().optional(),
  message: z.string(),
});

export type ImportRowError = z.infer<typeof importRowErrorSchema>;
