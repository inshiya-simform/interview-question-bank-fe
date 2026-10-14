import { Button, MultiSelect, TextAreaField, TextField } from '@/components';
import { QUESTIONS_COPY } from '@/constants';
import { CLIENT_OPTIONS } from '../constants';
import { CategoryTagsRow } from './CategoryTagsRow';
import { useAddQuestionForm } from '../hooks/useAddQuestionForm';
import type { AddQuestionValues } from '../schema';
import './AddQuestionForm.css';

interface AddQuestionFormProps {
  onSubmit: (values: AddQuestionValues) => void;
  onCancel: () => void;
}

export function AddQuestionForm({ onSubmit, onCancel }: AddQuestionFormProps) {
  const {
    values,
    errors,
    canAddCategory,
    optionsForRow,
    setField,
    setRowCategory,
    setRowTags,
    addCategory,
    removeCategory,
    handleSubmit,
    reset,
  } = useAddQuestionForm(onSubmit);

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
          error={row.category === '' ? errors.categories : undefined}
          onCategoryChange={(category) => setRowCategory(index, category)}
          onTagsChange={(tags) => setRowTags(index, tags)}
          onRemove={() => removeCategory(index)}
        />
      ))}
      <Button variant="secondary" disabled={!canAddCategory} onClick={addCategory}>
        + {QUESTIONS_COPY.ADD_CATEGORY}
      </Button>
      <MultiSelect
        label={QUESTIONS_COPY.FIELD_CLIENTS}
        options={CLIENT_OPTIONS}
        value={values.clients}
        onChange={(clients) => setField('clients', clients)}
        placeholder={QUESTIONS_COPY.PLACEHOLDER_CLIENTS}
        badgeVariant="client"
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
        <Button type="submit">{QUESTIONS_COPY.SUBMIT}</Button>
      </div>
    </form>
  );
}
