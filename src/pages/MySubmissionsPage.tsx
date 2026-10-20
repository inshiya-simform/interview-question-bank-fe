import { MySubmissions } from '@/features/review';
import { SubmissionEditDrawer } from '@/features/questions';
import { useMySubmissionsPage } from './useMySubmissionsPage';
import './ReviewPage.css';

export function MySubmissionsPage() {
  const { editing, openEdit, closeEdit } = useMySubmissionsPage();

  return (
    <div className="review-page">
      <MySubmissions onEdit={openEdit} />
      <SubmissionEditDrawer submission={editing} onClose={closeEdit} />
    </div>
  );
}
