import { Button } from '@/components';
import { HOME_COPY, QUESTIONS_COPY } from '@/constants';
import { ImportCsvEntry } from '@/features/import';
import { ReviewNav } from '@/features/review';
import { AddQuestionButton, QuestionDrawer, QuestionList } from '@/features/questions';
import { useHomePage } from './useHomePage';
import './HomePage.css';

export function HomePage() {
  const {
    name,
    logout,
    isDrawerOpen,
    editingId,
    isSubmitting,
    openDrawer,
    openEditDrawer,
    closeDrawer,
    saveQuestion,
  } = useHomePage();

  return (
    <main className="home">
      <ReviewNav />
      <section className="home__panel" aria-label={HOME_COPY.WELCOME(name)}>
        <div className="home__actions">
          <AddQuestionButton onClick={openDrawer}>
            + {QUESTIONS_COPY.ADD_QUESTION}
          </AddQuestionButton>
          <ImportCsvEntry />
        </div>
        <div className="home__welcome">
          <h1>{HOME_COPY.WELCOME(name)}</h1>
          <p className="home__subtitle">{HOME_COPY.SUBTITLE}</p>
        </div>
        <Button variant="secondary" onClick={logout}>
          {HOME_COPY.LOGOUT}
        </Button>
      </section>
      <QuestionList onEdit={openEditDrawer} />
      <QuestionDrawer
        isOpen={isDrawerOpen}
        editingId={editingId}
        isSubmitting={isSubmitting}
        onClose={closeDrawer}
        onSubmit={saveQuestion}
      />
    </main>
  );
}
