import { useEffect, useRef } from 'react';

// The indeterminate state is only settable through the DOM property, not an attribute.
export function useBulkActionBar(selectedCount: number, isIndeterminate: boolean) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) checkboxRef.current.indeterminate = isIndeterminate;
  }, [isIndeterminate]);

  return { checkboxRef, hasSelection: selectedCount > 0 };
}
