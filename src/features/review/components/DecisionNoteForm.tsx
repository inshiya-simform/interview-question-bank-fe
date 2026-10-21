import { Button, TextAreaField } from '@/components';
import { REVIEW_COPY } from '@/constants';
import type { DecisionMode } from '../constants';
import { useDecisionNoteForm } from '../hooks/useDecisionNoteForm';
import './DecisionNoteForm.css';

interface DecisionNoteFormProps {
  mode: DecisionMode;
  isPending: boolean;
  isDisabled: boolean;
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

export function DecisionNoteForm({
  mode,
  isPending,
  isDisabled,
  onSubmit,
  onCancel,
}: DecisionNoteFormProps) {
  const { label, hint, submit, text, error, count, handleChange, handleSubmit } =
    useDecisionNoteForm(mode, onSubmit);

  return (
    <form className="dnote" onSubmit={handleSubmit} noValidate>
      <TextAreaField label={label} name="note" value={text} onChange={handleChange} error={error} />
      <p className="dnote__hint">
        <span>{hint}</span>
        <span>{count}</span>
      </p>
      <div className="dnote__actions">
        <Button variant="secondary" onClick={onCancel}>
          {REVIEW_COPY.CANCEL}
        </Button>
        <Button type="submit" isLoading={isPending} disabled={isDisabled}>
          {submit}
        </Button>
      </div>
    </form>
  );
}
