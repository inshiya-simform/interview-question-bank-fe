import { useState } from 'react';

export function useMySubmissionsPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  return { editingId, openEdit: setEditingId, closeEdit: () => setEditingId(null) };
}
