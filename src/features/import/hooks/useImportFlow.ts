import { useEffect, useRef, useState } from 'react';
import type { ImportFailure, ImportSuccess } from '@/api';
import {
  IMPORT_CLIENT_ERROR,
  IMPORT_COPY,
  IMPORT_MOCK_DELAY_MS,
  IMPORT_PREVIEW_STATE,
  type ImportClientError,
  type ImportPreviewState,
} from '@/constants';
import {
  MOCK_AUTH_FAILURE,
  MOCK_FILE,
  MOCK_HEADER_FAILURE,
  MOCK_SIZE_FAILURE,
  MOCK_SUCCESS,
  MOCK_VALIDATION_FAILURE,
} from '../mock';
import { findClientError, isValidationFailure, type SelectedFile } from '../utils';

type Phase = 'editing' | 'uploading' | 'success' | 'failure';
type MockOutcome = ImportPreviewState;

interface FlowState {
  phase: Phase;
  file: SelectedFile | null;
  clientError: ImportClientError | null;
  success: ImportSuccess | null;
  failure: ImportFailure | null;
}

const INITIAL: FlowState = {
  phase: 'editing',
  file: null,
  clientError: null,
  success: null,
  failure: null,
};

const FAILURES: Partial<Record<ImportPreviewState, ImportFailure>> = {
  [IMPORT_PREVIEW_STATE.FAILURE_AUTH]: MOCK_AUTH_FAILURE,
  [IMPORT_PREVIEW_STATE.FAILURE_SIZE]: MOCK_SIZE_FAILURE,
  [IMPORT_PREVIEW_STATE.VALIDATION]: MOCK_VALIDATION_FAILURE,
  [IMPORT_PREVIEW_STATE.VALIDATION_HEADER]: MOCK_HEADER_FAILURE,
};

const CLIENT_ERROR_FILES: Record<ImportClientError, SelectedFile | null> = {
  [IMPORT_CLIENT_ERROR.NOT_CSV]: { name: 'questions.xlsx', size: 31_000 },
  [IMPORT_CLIENT_ERROR.TOO_LARGE]: { name: 'all-questions.csv', size: 3_400_000 },
  [IMPORT_CLIENT_ERROR.MULTIPLE]: null,
};

function resolveOutcome(outcome: MockOutcome, file: SelectedFile | null): FlowState {
  const base = { ...INITIAL, file };
  const failure = FAILURES[outcome];
  if (failure) return { ...base, phase: 'failure', failure };
  return { ...base, phase: 'success', success: MOCK_SUCCESS };
}

function previewState(state: ImportPreviewState): FlowState {
  const withFile = { ...INITIAL, file: MOCK_FILE };
  switch (state) {
    case IMPORT_PREVIEW_STATE.EMPTY:
      return INITIAL;
    case IMPORT_PREVIEW_STATE.SELECTED:
      return withFile;
    case IMPORT_PREVIEW_STATE.NOT_CSV:
    case IMPORT_PREVIEW_STATE.TOO_LARGE:
    case IMPORT_PREVIEW_STATE.MULTIPLE:
      return { ...INITIAL, file: CLIENT_ERROR_FILES[state], clientError: state };
    case IMPORT_PREVIEW_STATE.UPLOADING:
      return { ...withFile, phase: 'uploading' };
    default:
      return resolveOutcome(state, MOCK_FILE);
  }
}

function currentPreview(state: FlowState): ImportPreviewState {
  if (state.phase === 'uploading') return IMPORT_PREVIEW_STATE.UPLOADING;
  if (state.phase === 'success') return IMPORT_PREVIEW_STATE.SUCCESS;
  if (state.phase === 'failure') {
    const match = Object.values(IMPORT_PREVIEW_STATE).find(
      (preview) => FAILURES[preview] === state.failure,
    );
    return match ?? IMPORT_PREVIEW_STATE.FAILURE_AUTH;
  }
  if (state.clientError) return state.clientError;
  return state.file ? IMPORT_PREVIEW_STATE.SELECTED : IMPORT_PREVIEW_STATE.EMPTY;
}

// Spoken by a single persistent live region so each result is announced once.
function announce(state: FlowState): string {
  if (state.phase === 'uploading') return IMPORT_COPY.UPLOADING;
  if (state.phase === 'success' && state.success)
    return IMPORT_COPY.SUCCESS(state.success.imported);
  if (state.phase !== 'failure' || !state.failure) return '';
  if (!isValidationFailure(state.failure)) return state.failure.message;
  const { details } = state.failure;
  const rows = new Set(details.map((error) => error.row)).size;
  return `${IMPORT_COPY.VALIDATION_HEADING}. ${IMPORT_COPY.VALIDATION_SUMMARY(details.length, rows)}`;
}

type View = 'form' | 'success' | 'validation';

function currentView(state: FlowState): View {
  if (state.phase === 'success') return 'success';
  if (state.phase === 'failure' && state.failure && isValidationFailure(state.failure)) {
    return 'validation';
  }
  return 'form';
}

export function useImportFlow() {
  const [state, setState] = useState<FlowState>(INITIAL);
  const outcome = useRef<MockOutcome>(IMPORT_PREVIEW_STATE.SUCCESS);
  const timer = useRef<number>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const startImport = () => {
    window.clearTimeout(timer.current);
    setState((prev) => ({ ...prev, phase: 'uploading', clientError: null, failure: null }));
    timer.current = window.setTimeout(() => {
      setState((prev) => resolveOutcome(outcome.current, prev.file));
    }, IMPORT_MOCK_DELAY_MS);
  };

  const selectFiles = (files: readonly SelectedFile[]) => {
    const clientError = findClientError(files);
    setState({ ...INITIAL, file: files.length === 1 ? (files[0] ?? null) : null, clientError });
  };

  const reset = () => {
    window.clearTimeout(timer.current);
    setState(INITIAL);
  };

  const setPreview = (next: ImportPreviewState) => {
    window.clearTimeout(timer.current);
    if (FAILURES[next] || next === IMPORT_PREVIEW_STATE.SUCCESS) outcome.current = next;
    setState(previewState(next));
  };

  return {
    ...state,
    announcement: announce(state),
    preview: currentPreview(state),
    view: currentView(state),
    validationDetails:
      state.failure && isValidationFailure(state.failure) ? state.failure.details : [],
    canImport:
      (state.phase === 'editing' || state.phase === 'failure') &&
      state.file !== null &&
      state.clientError === null,
    selectFiles,
    startImport,
    reset,
    setPreview,
  };
}
