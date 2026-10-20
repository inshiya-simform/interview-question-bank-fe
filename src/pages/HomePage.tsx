import { PageHeader } from '@/components';
import { HOME_COPY, QUESTIONS_COPY } from '@/constants';
import { ImportCsvEntry } from '@/features/import';
import { AddQuestionButton, QuestionDrawer, QuestionList } from '@/features/questions';
import { useHomePage } from './useHomePage';
import './HomePage.css';

export function HomePage() {
  const {
    isDrawerOpen,
    editingId,
    isSubmitting,
    openDrawer,
    openEditDrawer,
    closeDrawer,
    saveQuestion,
  } = useHomePage();

  return (
    <div className="home">
      <PageHeader title={HOME_COPY.TITLE} subtitle={HOME_COPY.SUBTITLE}>
        <ImportCsvEntry />
        <AddQuestionButton onClick={openDrawer}>+ {QUESTIONS_COPY.ADD_QUESTION}</AddQuestionButton>
      </PageHeader>
      <QuestionList onEdit={openEditDrawer} />
      <QuestionDrawer
        isOpen={isDrawerOpen}
        editingId={editingId}
        isSubmitting={isSubmitting}
        onClose={closeDrawer}
        onSubmit={saveQuestion}
      />
    </div>
  );
}
