import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { rejectFormSchema, requestChangesFormSchema } from '@/api';
import { REVIEW_COPY, REVIEW_NOTE_MAX_LENGTH } from '@/constants';
import { DECISION_MODE } from '../constants';
import type { DecisionMode } from '../constants';

const FORM_CONFIG = {
  [DECISION_MODE.CHANGES]: {
    schema: requestChangesFormSchema,
    label: REVIEW_COPY.CHANGES_FIELD,
    hint: REVIEW_COPY.CHANGES_HINT,
    submit: REVIEW_COPY.CHANGES_SUBMIT,
  },
  [DECISION_MODE.REJECT]: {
    schema: rejectFormSchema,
    label: REVIEW_COPY.REJECT_FIELD,
    hint: REVIEW_COPY.REJECT_HINT,
    submit: REVIEW_COPY.REJECT_SUBMIT,
  },
} as const;

export function useDecisionNoteForm(mode: DecisionMode, onSubmit: (text: string) => void) {
  const config = FORM_CONFIG[mode];
  const [text, setText] = useState('');
  const [error, setError] = useState<string>();

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    setError(undefined);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = config.schema.safeParse({ text });
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }
    onSubmit(result.data.text);
  };

  return {
    ...config,
    text,
    error,
    count: REVIEW_COPY.CHARACTER_COUNT(text.length, REVIEW_NOTE_MAX_LENGTH),
    handleChange,
    handleSubmit,
  };
}
