import { ReviewNav, ReviewQueue } from '@/features/review';
import './ReviewPage.css';

export function ReviewQueuePage() {
  return (
    <main className="review-page">
      <ReviewNav />
      <ReviewQueue />
    </main>
  );
}
