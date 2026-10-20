export const IMPORT_LIMITS = {
  MAX_FILE_BYTES: 2 * 1024 * 1024,
  MAX_ROWS: 500,
  EXTENSION: '.csv',
  TEXT_MAX: 2000,
  ANSWER_NOTES_MAX: 10000,
} as const;

export const IMPORT_FAILURE_CODE = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
} as const;

export type ImportFailureCode = (typeof IMPORT_FAILURE_CODE)[keyof typeof IMPORT_FAILURE_CODE];

export const IMPORT_CLIENT_ERROR = {
  NOT_CSV: 'notCsv',
  TOO_LARGE: 'tooLarge',
  MULTIPLE: 'multiple',
} as const;

export type ImportClientError = (typeof IMPORT_CLIENT_ERROR)[keyof typeof IMPORT_CLIENT_ERROR];

export const IMPORT_COLUMNS = [
  { name: 'text', required: true, limit: IMPORT_LIMITS.TEXT_MAX },
  { name: 'answer_notes', required: true, limit: IMPORT_LIMITS.ANSWER_NOTES_MAX },
  { name: 'tags', required: true },
  { name: 'client' },
  { name: 'confirm_distinct' },
  { name: 'distinct_reason', conditional: true },
] as const;

export const IMPORT_TEMPLATE_HEADER = IMPORT_COLUMNS.map((column) => column.name);

export const IMPORT_TEMPLATE_FILENAME = 'question-import-template.csv';
export const IMPORT_ERRORS_FILENAME = 'question-import-errors.csv';
export const IMPORT_CSV_MIME = 'text/csv;charset=utf-8';
export const IMPORT_MOCK_DELAY_MS = 2500;
export const IMPORT_PREVIEW_LIMIT = 5;

// Matches the API's duplicate messages so they can carry the "this is different" hint.
export const IMPORT_DUPLICATE_PATTERN = /^(Same as row \d+|Looks like an existing question)/;

export const IMPORT_EXAMPLE_ROWS = [
  [...IMPORT_TEMPLATE_HEADER],
  [
    'What is a Docker volume?',
    'Persistent storage managed by Docker, independent of the container lifecycle.',
    'technology:docker;seniority:junior',
    '',
    '',
    '',
  ],
] as const;
