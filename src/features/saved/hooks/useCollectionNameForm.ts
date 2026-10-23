import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { collectionPayloadSchema } from '@/api';
import { useZodForm } from '@/hooks/useZodForm';

interface UseCollectionNameFormArgs {
  initialName: string;
  // Resolves to an error message to show under the field, or nothing on success.
  onSubmit: (name: string) => Promise<string | undefined>;
}

export function useCollectionNameForm({ initialName, onSubmit }: UseCollectionNameFormArgs) {
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useZodForm(collectionPayloadSchema, { name: initialName }, (values) => {
    setIsSubmitting(true);
    void onSubmit(values.name)
      .then((message) => setSubmitError(message ?? ''))
      .finally(() => setIsSubmitting(false));
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSubmitError('');
    form.handleChange(event);
  };

  return {
    name: form.values.name,
    error: form.errors.name ?? submitError,
    isSubmitting,
    handleChange,
    handleSubmit: form.handleSubmit,
  };
}
