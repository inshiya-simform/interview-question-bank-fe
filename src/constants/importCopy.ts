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
  REQUIRED_IF: 'Only if confirm_distinct is true',
  COLUMN_DESCRIPTIONS: {
    text: `The interview question itself, in plain words. Up to ${formatLimit(IMPORT_LIMITS.TEXT_MAX)} characters.`,
    answer_notes: `What a good answer looks like. Type normal text, or leave formatting as it is if you copied it from an earlier export. Up to ${formatLimit(IMPORT_LIMITS.ANSWER_NOTES_MAX)} characters.`,
    tags: 'Labels that describe the question, written as category:tag. Join several with a semicolon (;), for example technology:docker;seniority:junior. For two tags in the same category, separate them with a vertical bar (|), for example technology:docker|kubernetes. Use "View available tags" below for the allowed names.',
    client: 'The client this question is for. Leave empty if it applies to all clients.',
    confirm_distinct:
      'Leave empty in most cases. If the import says your question looks like a duplicate but it is genuinely different, type true.',
    distinct_reason:
      'One sentence on how the question is different from the existing one. Only needed when confirm_distinct is true.',
  },
  EXAMPLE_LABEL: 'Example',
  EXAMPLE_NOTE:
    'The first row must be the column names, exactly as shown. If a cell contains a comma or a new line, put the whole cell in double quotes ("like, this"). The easiest way to start is to download the template.',

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
