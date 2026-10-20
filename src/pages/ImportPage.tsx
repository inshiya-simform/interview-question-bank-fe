import { ImportScreen } from '@/features/import';
import { ReviewNav } from '@/features/review';
import './ReviewPage.css';

export function ImportPage() {
  return (
    <main className="review-page">
      <ReviewNav />
      <ImportScreen />
    </main>
  );
}
