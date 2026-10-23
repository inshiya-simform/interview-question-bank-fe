import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useZodForm } from '@/hooks/useZodForm';
import { collectionPayloadSchema } from '../schema';

interface UseCollectionNameFormArgs {
  initialName: string;
  // Returns an error message to show under the field, or nothing on success.
  onSubmit: (name: string) => string | undefined;
}

export function useCollectionNameForm({ initialName, onSubmit }: UseCollectionNameFormArgs) {
  const [submitError, setSubmitError] = useState('');
  const form = useZodForm(collectionPayloadSchema, { name: initialName }, (values) =>
    setSubmitError(onSubmit(values.name) ?? ''),
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSubmitError('');
    form.handleChange(event);
  };

  return {
    name: form.values.name,
    error: form.errors.name ?? submitError,
    handleChange,
    handleSubmit: form.handleSubmit,
  };
}
