import { IMPORT_LIMITS } from './importCsv';

const formatLimit = (value: number) => value.toLocaleString('en-US');

export const IMPORT_COPY = {
  ENTRY: 'Import from CSV',
  TITLE: 'Import questions from CSV',
  SUBTITLE: 'Add many questions at once. They are sent for review like any other submission.',

  INSTRUCTIONS_TITLE: 'How to import',
  DOWNLOAD_TEMPLATE: 'Download template',
  LIMITS_LABEL: 'Import limits',
  LIMIT_FORMAT: 'CSV files only (.csv)',
  LIMIT_SIZE: 'Max file size 2 MB',
  LIMIT_ROWS: `Max ${IMPORT_LIMITS.MAX_ROWS} rows`,
  COLUMNS_SUMMARY: 'Column reference',
  COLUMN_HEADERS: { NAME: 'Column', REQUIRED: 'Required', DESCRIPTION: 'Description' },
  COLUMN_TABLE_LABEL: 'CSV columns',
  REQUIRED_YES: 'Required',
  REQUIRED_NO: 'Optional',
  REQUIRED_IF: 'If confirm_distinct is true',
  COLUMN_DESCRIPTIONS: {
    text: `The question. Up to ${formatLimit(IMPORT_LIMITS.TEXT_MAX)} characters.`,
    answer_notes: `Notes for the answer. Up to ${formatLimit(IMPORT_LIMITS.ANSWER_NOTES_MAX)} characters.`,
    tags: 'Format category:tag|tag;category:tag, for example technology:docker;seniority:junior.',
    client: 'The client name. Leave empty for all clients.',
    confirm_distinct: 'true or false. Set to true when a flagged duplicate is genuinely different.',
    distinct_reason: 'Why the question is different. Required when confirm_distinct is true.',
  },
  EXAMPLE_LABEL: 'Example',
  EXAMPLE_NOTE: 'Cells that contain commas or line breaks must be wrapped in double quotes.',

  TAGS_SUMMARY: 'View available tags',
  TAGS_COPY: 'Copy tags',
  TAGS_COPIED: 'Tags copied to clipboard',
  TAGS_COPY_FAILED: 'Could not copy. Select the text and copy it manually.',
  TAGS_LIST_LABEL: 'Available tags by category',

  DROPZONE_LABEL: 'File upload',
  DROPZONE_TITLE: 'Drag and drop a CSV file here',
  DROPZONE_ACTIVE: 'Drop the file to select it',
  DROPZONE_OR: 'or',
  BROWSE: 'Browse',
  BROWSE_LABEL: 'Browse for a CSV file',
  SELECTED_FILE: 'Selected file',
  REMOVE_FILE: (name: string) => `Remove ${name}`,
  REMOVE: 'Remove',
  IMPORT: 'Import',
  MULTIPLE_FILES_NAME: 'Multiple files',
  CLIENT_ERRORS: {
    notCsv: 'This is not a .csv file. Choose a file that ends in .csv.',
    tooLarge: 'This file is larger than 2 MB. Split it into smaller files.',
    multiple: 'Only one file can be imported at a time. Choose a single file.',
  },
  ERROR_PREFIX: 'Error:',
  REVIEW_NOTICE:
    "Imported questions are sent for review and won't appear in the question bank until approved.",

  UPLOADING: 'Checking for duplicates, this can take a few seconds',

  SUCCESS: (count: number) =>
    `${count} ${count === 1 ? 'question' : 'questions'} imported and sent for review`,
  SUCCESS_LIST_LABEL: 'Imported questions',
  SUCCESS_MORE: (count: number) => `and ${count} more`,
  MY_SUBMISSIONS: 'My submissions',
  IMPORT_ANOTHER: 'Import another file',

  FAILURE_TITLE: 'Import failed',
  RETRY: 'Try again',
  FAILURE_FALLBACK: 'Something went wrong. Please try again.',

  VALIDATION_HEADING: 'Nothing was imported. Fix the rows below and upload the file again',
  VALIDATION_SUMMARY: (problems: number, rows: number) =>
    `${problems} ${problems === 1 ? 'problem' : 'problems'} in ${rows} ${rows === 1 ? 'row' : 'rows'}`,
  TABLE_LABEL: 'Problems found in the file',
  TABLE_HEADERS: { ROW: 'Row', COLUMN: 'Column', PROBLEM: 'Problem' },
  HEADER_ROW: 'Header',
  ROW_LABEL: (row: number) => `Row ${row}`,
  CHOOSE_DIFFERENT: 'Choose a different file',
  DUPLICATE_HELP_LABEL: 'How to import a question that is genuinely different',
  DUPLICATE_HELP:
    'If this question is genuinely different, set confirm_distinct to true and add a distinct_reason in the CSV, then upload again.',
} as const;
