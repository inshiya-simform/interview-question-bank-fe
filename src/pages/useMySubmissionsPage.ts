import { useState } from 'react';
import type { ReviewedQuestion } from '@/api';

// The submission is kept as the form's starting point while the drawer is open.
export function useMySubmissionsPage() {
  const [editing, setEditing] = useState<ReviewedQuestion | null>(null);
  return { editing, openEdit: setEditing, closeEdit: () => setEditing(null) };
}
