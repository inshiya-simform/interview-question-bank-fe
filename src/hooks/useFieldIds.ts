import { useId } from 'react';

export function useFieldIds() {
  const id = useId();
  return { inputId: id, errorId: `${id}-error`, hintId: `${id}-hint` };
}
