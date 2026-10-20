import { z } from 'zod';
import type { ImportFailureCode } from '@/constants';

export const importRowErrorSchema = z.object({
  // Spreadsheet row number: 1 is the header, the first data row is 2.
  row: z.number().int().min(1),
  column: z.string().optional(),
  message: z.string(),
});

export const importSuccessSchema = z.object({
  imported: z.number().int().min(0),
  questions: z.array(z.object({ id: z.string(), text: z.string() })),
});

export const importFailureSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.array(importRowErrorSchema).optional(),
});

export type ImportRowError = z.infer<typeof importRowErrorSchema>;
export type ImportSuccess = z.infer<typeof importSuccessSchema>;
export type ImportFailure = Omit<z.infer<typeof importFailureSchema>, 'code'> & {
  code: ImportFailureCode | (string & {});
};
