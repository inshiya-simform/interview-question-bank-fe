import { useState } from 'react';
import { SEED_QUESTIONS } from '../constants';
import type { AddQuestionValues, Question } from '../schema';

// In-memory only until the questions API is integrated; swap for the query/mutation hooks.
export function useQuestionsHome() {
  const [questions, setQuestions] = useState<Question[]>(SEED_QUESTIONS);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addQuestion = (values: AddQuestionValues) => {
    setQuestions((current) => [{ id: crypto.randomUUID(), ...values }, ...current]);
    closeDrawer();
  };

  return { questions, isDrawerOpen, openDrawer, closeDrawer, addQuestion };
}
