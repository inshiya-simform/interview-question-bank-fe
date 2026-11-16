import { Button, TextField } from '@/components';
import { TAG_COPY } from '@/constants';
import { useAddTagForm } from '../hooks/useAddTagForm';

interface AddTagFormProps {
  categoryId: number;
  categoryName: string;
}

export function AddTagForm({ categoryId, categoryName }: AddTagFormProps) {
  const { values, errors, handleChange, handleSubmit, isPending } = useAddTagForm(
    categoryId,
    categoryName,
  );

  return (
    <form className="tag-toolbar__add" onSubmit={handleSubmit} noValidate>
      <TextField
        className="tag-toolbar__field"
        label={TAG_COPY.FIELD_ADD_TAG(categoryName)}
        name="name"
        autoComplete="off"
        placeholder={TAG_COPY.PLACEHOLDER_ADD_TAG}
        value={values.name}
        onChange={handleChange}
        error={errors.name}
      />
      <Button type="submit" className="tag-toolbar__submit" isLoading={isPending}>
        {isPending ? TAG_COPY.ADDING_TAG : TAG_COPY.ADD_TAG}
      </Button>
    </form>
  );
}
