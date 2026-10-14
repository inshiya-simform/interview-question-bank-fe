import { Alert, Button, Loader, SelectField, TextAreaField, TextField } from '@/components';
import { QUESTIONS_COPY } from '@/constants';
import { CategoryTagsRow } from './CategoryTagsRow';
import { useQuestionForm } from '../hooks/useQuestionForm';
import type { QuestionFormValues } from '../schema';
import './QuestionForm.css';

interface QuestionFormProps {
  onSubmit: (values: QuestionFormValues, onSuccess: () => void) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  initialValues?: QuestionFormValues;
}

export function QuestionForm({
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
  submittingLabel,
  initialValues,
}: QuestionFormProps) {
  const {
    values,
    errors,
    canAddCategory,
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
    reset,
  } = useQuestionForm(onSubmit, initialValues);

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
      <TextAreaField
        label={QUESTIONS_COPY.FIELD_ANSWER}
        name="answer"
        placeholder={QUESTIONS_COPY.PLACEHOLDER_ANSWER}
        value={values.answer}
        onChange={(event) => setField('answer', event.target.value)}
        error={errors.answer}
      />
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
