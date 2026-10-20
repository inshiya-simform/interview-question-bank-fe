import type { ImportFailure, ImportRowError, ImportSuccess } from '@/api';
import { IMPORT_FAILURE_CODE } from '@/constants';

export const MOCK_FILE = { name: 'docker-questions.csv', size: 48_200 };

export const MOCK_TAG_CATEGORIES = [
  { slug: 'technology', tags: ['docker', 'kubernetes', 'react', 'node-js', 'postgresql'] },
  { slug: 'seniority', tags: ['junior', 'mid', 'senior', 'lead'] },
  { slug: 'question-type', tags: ['coding', 'conceptual', 'behavioural', 'system-design'] },
] as const;

export const MOCK_SUCCESS: ImportSuccess = {
  imported: 7,
  questions: [
    { id: 'q-1', text: 'What is a Docker volume?' },
    { id: 'q-2', text: 'Explain the difference between an image and a container.' },
    { id: 'q-3', text: 'How does React reconcile state updates?' },
    { id: 'q-4', text: 'When would you choose a JOIN over a subquery?' },
    { id: 'q-5', text: 'Describe a time you disagreed with a teammate.' },
    { id: 'q-6', text: 'What is a Kubernetes readiness probe?' },
    { id: 'q-7', text: 'How would you design a rate limiter?' },
  ],
};

const rowErrors: ImportRowError[] = [
  { row: 3, column: 'tags', message: 'Unknown tag "nope" in category "technology"' },
  { row: 3, column: 'tags', message: 'Unknown tag category "bogus"' },
  { row: 3, column: 'client', message: 'Unknown client "Acme Corp"' },
  {
    row: 5,
    column: 'text',
    message: 'Looks like an existing question ("What is a Docker volume?")',
  },
  { row: 5, column: 'distinct_reason', message: 'Required when confirm_distinct is true' },
  { row: 7, column: 'text', message: 'Same as row 2' },
  { row: 7, column: 'tags', message: 'Unknown tag "nope" in category "technology"' },
];

const headerErrors: ImportRowError[] = [
  { row: 1, column: 'foo', message: 'Unknown column foo' },
  { row: 1, column: 'tags', message: 'Required column tags is missing' },
];

export const MOCK_VALIDATION_FAILURE: ImportFailure = {
  code: IMPORT_FAILURE_CODE.VALIDATION_FAILED,
  message: 'The file has problems.',
  details: rowErrors,
};

export const MOCK_HEADER_FAILURE: ImportFailure = {
  code: IMPORT_FAILURE_CODE.VALIDATION_FAILED,
  message: 'The file has problems.',
  details: headerErrors,
};

export const MOCK_AUTH_FAILURE: ImportFailure = {
  code: IMPORT_FAILURE_CODE.UNAUTHORIZED,
  message: 'Not authorized',
};

export const MOCK_SIZE_FAILURE: ImportFailure = {
  code: IMPORT_FAILURE_CODE.FILE_TOO_LARGE,
  message: 'File is too large',
};
