import { Button, Drawer } from '@/components';
import { HOME_COPY, QUESTIONS_COPY } from '@/constants';
import { AddQuestionForm, QuestionList } from '@/features/questions';
import { useHomePage } from './useHomePage';
import './HomePage.css';

export function HomePage() {
  const {
    name,
    logout,
    questions,
    isDrawerOpen,
    isSubmitting,
    openDrawer,
    closeDrawer,
    addQuestion,
  } = useHomePage();

  return (
    <main className="home">
      <section className="home__panel" aria-label={HOME_COPY.WELCOME(name)}>
        <Button onClick={openDrawer}>+ {QUESTIONS_COPY.ADD_QUESTION}</Button>
        <div className="home__welcome">
          <h1>{HOME_COPY.WELCOME(name)}</h1>
          <p className="home__subtitle">{HOME_COPY.SUBTITLE}</p>
        </div>
        <Button variant="secondary" onClick={logout}>
          {HOME_COPY.LOGOUT}
        </Button>
      </section>
      <QuestionList questions={questions} />
      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={QUESTIONS_COPY.DRAWER_TITLE}
        closeLabel={QUESTIONS_COPY.CLOSE}
      >
        <AddQuestionForm
          onSubmit={addQuestion}
          onCancel={closeDrawer}
          isSubmitting={isSubmitting}
        />
      </Drawer>
    </main>
  );
}
