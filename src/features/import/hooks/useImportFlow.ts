import { useState } from 'react';
import { useImportQuestionsMutation } from '@/api/hooks';
import { IMPORT_COPY, type ImportClientError } from '@/constants';
import { findClientError, getValidationDetails } from '../utils';

// Spoken by a single persistent live region so each result is announced once.
function announce(
  isPending: boolean,
  imported: number | undefined,
  message: string,
  details: readonly { row: number }[],
): string {
  if (isPending) return IMPORT_COPY.UPLOADING;
  if (imported !== undefined) return IMPORT_COPY.SUCCESS(imported);
  if (details.length > 0) {
    const rows = new Set(details.map((error) => error.row)).size;
    return `${IMPORT_COPY.VALIDATION_HEADING}. ${IMPORT_COPY.VALIDATION_SUMMARY(details.length, rows)}`;
  }
  return message;
}

export function useImportFlow() {
  const [file, setFile] = useState<File | null>(null);
  const [clientError, setClientError] = useState<ImportClientError | null>(null);
  const { mutate, reset: resetMutation, isPending, data, error } = useImportQuestionsMutation();

  const validationDetails = getValidationDetails(error);
  const view = data ? 'success' : validationDetails.length > 0 ? 'validation' : 'form';

  const selectFiles = (files: readonly File[]) => {
    resetMutation();
    setClientError(findClientError(files));
    setFile(files.length === 1 ? (files[0] ?? null) : null);
  };

  const reset = () => {
    resetMutation();
    setClientError(null);
    setFile(null);
  };

  const startImport = () => {
    if (file) mutate({ file });
  };

  return {
    file,
    clientError,
    success: data ?? null,
    failureMessage: view === 'form' && error ? error.message || IMPORT_COPY.FAILURE_FALLBACK : null,
    isUploading: isPending,
    announcement: announce(isPending, data?.imported, error?.message ?? '', validationDetails),
    view,
    validationDetails,
    validationMessage: error?.message ?? '',
    canImport: !isPending && file !== null && clientError === null,
    selectFiles,
    startImport,
    reset,
  };
}
