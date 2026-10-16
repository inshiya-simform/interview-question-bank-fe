import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { z } from 'zod';

type FormValues<K extends string> = Record<K, string>;
type FormErrors<K extends string> = Partial<Record<K, string>>;

export function useZodForm<K extends string>(
  schema: z.ZodType<FormValues<K>, FormValues<K>>,
  initialValues: FormValues<K>,
  // `reset` lets callers clear the form once an async submit succeeds.
  onSubmit?: (values: FormValues<K>, reset: () => void) => void,
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors<K>>({});

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = schema.safeParse(values);
    if (result.success) {
      setErrors({});
      onSubmit?.(result.data, reset);
      return;
    }
    const next: FormErrors<K> = {};
    for (const issue of result.error.issues) {
      const field = String(issue.path[0]) as K;
      next[field] ??= issue.message;
    }
    setErrors(next);
  };

  return { values, errors, handleChange, handleSubmit, reset };
}
