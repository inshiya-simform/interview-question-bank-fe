// Temporary in-memory data for the tag management screen while the API is not ready.
// Delete this folder when `tagManagement.service.ts` goes back to calling `apiClient`.
export interface StoredCategory {
  id: number;
  name: string;
  description: string | null;
}

export interface StoredTag {
  id: number;
  categoryId: number;
  name: string;
  questionCount: number;
}

type SeedCategory = [name: string, description: string | null, tags: [string, number][]];

const SEED: SeedCategory[] = [
  [
    'Technology',
    'Languages, frameworks and platforms a question is about.',
    [
      ['React', 42],
      ['TypeScript', 31],
      ['Node.js', 24],
      ['AWS', 9],
      ['GraphQL', 7],
      ['PostgreSQL', 12],
      ['Redis', 5],
      ['Next.js', 18],
      ['Vue', 11],
      ['Angular', 8],
      ['Java', 20],
      ['Python', 17],
      ['Go', 3],
      ['Prisma', 0],
      ['Docker', 0],
    ],
  ],
  [
    'Seniority',
    'Level of the candidate a question suits.',
    [
      ['Junior', 55],
      ['Mid', 61],
      ['Senior', 48],
      ['Lead', 14],
    ],
  ],
  [
    'Question type',
    null,
    [
      ['Behavioural', 33],
      ['Coding', 52],
      ['System design', 19],
      ['Screening', 0],
    ],
  ],
  [
    'Cloud infrastructure and platform engineering',
    null,
    [
      ['GCP', 4],
      ['Azure', 6],
      ['Vercel', 2],
    ],
  ],
  [
    'Databases',
    null,
    [
      ['MongoDB', 9],
      ['MySQL', 7],
      ['DynamoDB', 3],
    ],
  ],
  [
    'Testing',
    null,
    [
      ['Jest', 10],
      ['Cypress', 5],
      ['Playwright', 4],
    ],
  ],
  [
    'DevOps',
    null,
    [
      ['CI/CD', 8],
      ['Terraform', 3],
      ['Kubernetes', 6],
    ],
  ],
  [
    'Security',
    null,
    [
      ['OWASP', 5],
      ['OAuth', 4],
    ],
  ],
  [
    'Soft skills',
    null,
    [
      ['Communication', 12],
      ['Leadership', 9],
    ],
  ],
  [
    'Mobile',
    null,
    [
      ['React Native', 6],
      ['Flutter', 2],
    ],
  ],
  [
    'Data and AI',
    null,
    [
      ['SQL', 14],
      ['Pandas', 3],
      ['LLMs', 5],
    ],
  ],
  [
    'Domain',
    'Industry the question is aimed at.',
    [
      ['Fintech', 0],
      ['Healthcare', 0],
    ],
  ],
  ['Language', null, [['English', 0]]],
];

export const mockStore: {
  categories: StoredCategory[];
  tags: StoredTag[];
  nextCategoryId: number;
  nextTagId: number;
} = { categories: [], tags: [], nextCategoryId: 1, nextTagId: 1 };

for (const [name, description, tags] of SEED) {
  const categoryId = mockStore.nextCategoryId++;
  mockStore.categories.push({ id: categoryId, name, description });
  for (const [tagName, questionCount] of tags) {
    mockStore.tags.push({ id: mockStore.nextTagId++, categoryId, name: tagName, questionCount });
  }
}
