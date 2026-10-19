import { MySubmissions, ReviewNav } from '@/features/review';
import { SubmissionEditDrawer } from '@/features/questions';
import { useMySubmissionsPage } from './useMySubmissionsPage';
import './ReviewPage.css';

export function MySubmissionsPage() {
  const { editingId, openEdit, closeEdit } = useMySubmissionsPage();

  return (
    <main className="review-page">
      <ReviewNav />
      <MySubmissions onEdit={openEdit} />
      <SubmissionEditDrawer submissionId={editingId} onClose={closeEdit} />
    </main>
  );
}
