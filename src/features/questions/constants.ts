import type { Question } from './schema';

// Placeholder option data until the categories/clients endpoints are integrated.
export const CATEGORY_TAGS = {
  Technology: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
  Seniority: ['Junior', 'Mid', 'Senior', 'Lead'],
  'Question type': ['Coding', 'System design', 'Behavioural', 'Screening'],
} as const;

export const CATEGORY_OPTIONS = Object.keys(CATEGORY_TAGS);

export const tagsForCategory = (category: string): readonly string[] =>
  Object.entries(CATEGORY_TAGS).find(([name]) => name === category)?.[1] ?? [];

export const CLIENT_OPTIONS = ['Acme Corp', 'Globex', 'Initech', 'Umbrella'];

export const SEED_QUESTIONS = [
  {
    id: 'seed-1',
    question: 'What is the difference between useMemo and useCallback?',
    answer: 'useMemo caches a computed value; useCallback caches a function identity.',
    categories: [{ category: 'Technology', tags: ['React', 'TypeScript'] }],
    clients: [],
  },
  {
    id: 'seed-2',
    question: 'Explain how you would design a rate limiter.',
    answer: 'Token bucket vs sliding window, shared store, per-client limits, failure modes.',
    categories: [
      { category: 'Question type', tags: ['System design'] },
      { category: 'Seniority', tags: ['Senior'] },
    ],
    clients: ['Acme Corp', 'Globex'],
  },
] satisfies Question[];
