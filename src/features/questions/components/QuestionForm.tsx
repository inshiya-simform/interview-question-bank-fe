import { Suspense } from 'react';
import { Alert, Button, Loader, SelectField, TextField } from '@/components';
import { LazyRichTextEditor } from '@/components/lazyComponents';
import { QUESTIONS_COPY } from '@/constants';
import { CategoryTagsRow } from './CategoryTagsRow';
import { DuplicateMatches } from './DuplicateMatches';
import { useQuestionForm } from '../hooks/useQuestionForm';
import type { FieldErrorHandler, QuestionFormValues } from '../schema';
import './QuestionForm.css';

interface QuestionFormProps {
  onSubmit: (
    values: QuestionFormValues,
    onSuccess: () => void,
    onFieldErrors?: FieldErrorHandler,
  ) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  initialValues?: QuestionFormValues;
  checkDuplicates?: boolean;
}

export function QuestionForm({
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
  submittingLabel,
  initialValues,
  checkDuplicates = false,
}: QuestionFormProps) {
  const {
    values,
    errors,
    canAddCategory,
    duplicates,
    isDuplicateBlocked,
    setConfirmDistinct,
    setDistinctReason,
    clientOptions,
    isLoading,
    isError,
    refetch,
    optionsForRow,
    tagOptionsForRow,
    setField,
    setRowCategory,
    setRowTags,
    addCategory,
    removeCategory,
    handleSubmit,
    uploadImage,
    reset,
  } = useQuestionForm(onSubmit, initialValues, checkDuplicates);

  if (isLoading) return <Loader label={QUESTIONS_COPY.OPTIONS_LOADING} />;
  if (isError) {
    return (
      <div className="qform">
        <Alert>{QUESTIONS_COPY.OPTIONS_ERROR}</Alert>
        <Button variant="secondary" onClick={refetch}>
          {QUESTIONS_COPY.OPTIONS_RETRY}
        </Button>
      </div>
    );
  }

  return (
    <form className="qform" onSubmit={handleSubmit} noValidate>
      <TextField
        label={QUESTIONS_COPY.FIELD_QUESTION}
        name="question"
        placeholder={QUESTIONS_COPY.PLACEHOLDER_QUESTION}
        value={values.question}
        onChange={(event) => setField('question', event.target.value)}
        error={errors.question}
      />
      {checkDuplicates && (
        <DuplicateMatches
          matches={duplicates.matches}
          isChecking={duplicates.isChecking}
          isConfirmed={Boolean(values.confirmDistinct)}
          onConfirmChange={setConfirmDistinct}
          reason={values.distinctReason ?? ''}
          reasonError={errors.distinctReason}
          onReasonChange={setDistinctReason}
        />
      )}
      <Suspense fallback={<Loader />}>
        <LazyRichTextEditor
          label={QUESTIONS_COPY.FIELD_ANSWER}
          placeholder={QUESTIONS_COPY.PLACEHOLDER_ANSWER}
          value={values.answer}
          onChange={(html) => setField('answer', html)}
          onUploadImage={uploadImage}
          error={errors.answer}
        />
      </Suspense>
      {values.categories.map((row, index) => (
        <CategoryTagsRow
          // Rows are fully controlled and have no id; keying by category would remount on change.
          key={index}
          row={row}
          categoryOptions={optionsForRow(index)}
          tagOptions={tagOptionsForRow(row.category)}
          error={row.category === '' ? errors.categories : undefined}
          onCategoryChange={(category) => setRowCategory(index, category)}
          onTagsChange={(tags) => setRowTags(index, tags)}
          onRemove={() => removeCategory(index)}
        />
      ))}
      <Button variant="secondary" disabled={!canAddCategory} onClick={addCategory}>
        + {QUESTIONS_COPY.ADD_CATEGORY}
      </Button>
      <SelectField
        label={QUESTIONS_COPY.FIELD_CLIENT}
        name="client"
        options={clientOptions}
        placeholder={QUESTIONS_COPY.PLACEHOLDER_CLIENT}
        value={values.clientId}
        onChange={(event) => setField('clientId', event.target.value)}
      />
      <div className="qform__actions">
        <Button
          variant="secondary"
          onClick={() => {
            reset();
            onCancel();
          }}
        >
          {QUESTIONS_COPY.CANCEL}
        </Button>
        <Button type="submit" disabled={isSubmitting || isDuplicateBlocked}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
