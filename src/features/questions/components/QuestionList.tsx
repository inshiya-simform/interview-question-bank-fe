import { QUESTIONS_COPY } from '@/constants';
import type { Question } from '@/api';
import { QuestionItem } from './QuestionItem';
import './QuestionList.css';

interface QuestionListProps {
  questions: Question[];
}

export function QuestionList({ questions }: QuestionListProps) {
  return (
    <section aria-labelledby="questions-title">
      <h2 id="questions-title" className="qlist__title">
        {QUESTIONS_COPY.LIST_TITLE}
      </h2>
      {questions.length === 0 ? (
        <p className="qlist__empty">{QUESTIONS_COPY.EMPTY}</p>
      ) : (
        <ul className="qlist">
          {questions.map((question) => (
            <QuestionItem key={question.id} question={question} />
          ))}
        </ul>
      )}
    </section>
  );
}
