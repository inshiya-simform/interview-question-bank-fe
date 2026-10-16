import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { grantClientAccessSchema } from '@/api';

export function useAddUserToClient(onAdd: (email: string) => void) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError(undefined);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = grantClientAccessSchema.safeParse({ email });
    if (result.success) onAdd(result.data.email);
    else setError(result.error.issues[0]?.message);
  };

  return { email, error, handleChange, handleSubmit };
}
