import { ROLES } from '@/constants';
import { COMMENT_SORT, VOTE } from '../constants';
import type { CommentSort, VoteValue } from '../constants';
import { commentSchema, threadSchema } from '../schema';
import type { Comment, MentionUser, PostCommentInput, Thread } from '../schema';

// In-memory stand-in for the discussion API. Everything here is replaced by api/service calls;
// the exported functions mirror the calls the hooks will make.
const MOCK_LATENCY_MS = 250;
const MINUTE_MS = 60_000;

export const MOCK_USERS: readonly MentionUser[] = [
  { id: 'mock-user-priya', name: 'Priya Shah', handle: 'priya.shah', role: ROLES.REVIEWER },
  { id: 'mock-user-meera', name: 'Meera Iyer', handle: 'meera.iyer', role: ROLES.REVIEWER },
  { id: 'mock-user-daniel', name: 'Daniel Okafor', handle: 'daniel.okafor', role: ROLES.USER },
  { id: 'mock-user-tomas', name: 'Tomás Alvarez', handle: 'tomas.alvarez', role: ROLES.USER },
  { id: 'mock-user-sana', name: 'Sana Qureshi', handle: 'sana.qureshi', role: ROLES.USER },
];

const [priya, meera, daniel, tomas] = MOCK_USERS;

interface StoredComment {
  id: string;
  author: MentionUser;
  body: string;
  mentionIds: string[];
  createdAt: string;
  // Score without the viewer's vote, which is kept per viewer below.
  baseScore: number;
  parentId: string | null;
}

const store = new Map<string, StoredComment[]>();
const votes = new Map<string, VoteValue>();
let nextId = 1;

const delay = () => new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * MINUTE_MS).toISOString();
const voteKey = (viewerId: string, commentId: string) => `${viewerId}:${commentId}`;

function seed(questionId: string): StoredComment[] {
  if (!priya || !meera || !daniel || !tomas) return [];
  const id = (suffix: string) => `${questionId}:${suffix}`;
  return [
    {
      id: id('c1'),
      author: meera,
      body: 'Worth adding that candidates often miss the follow-up here. @priya.shah can we add a probing question to the answer notes?',
      mentionIds: [priya.id],
      createdAt: minutesAgo(2880),
      baseScore: 14,
      parentId: null,
    },
    {
      id: id('c1a'),
      author: priya,
      body: "Agreed. I'll draft it as a separate question and link it here.",
      mentionIds: [],
      createdAt: minutesAgo(2700),
      baseScore: 5,
      parentId: id('c1'),
    },
    {
      id: id('c1b'),
      author: daniel,
      body: 'I used this in my last loop and the follow-up separated strong candidates from average ones really well.',
      mentionIds: [],
      createdAt: minutesAgo(1500),
      baseScore: 3,
      parentId: id('c1'),
    },
    {
      id: id('c2'),
      author: daniel,
      body: 'With senior candidates, a good signal is whether they bring up trade-offs and edge cases without being prompted.',
      mentionIds: [],
      createdAt: minutesAgo(4320),
      baseScore: 9,
      parentId: null,
    },
    {
      id: id('c3'),
      author: tomas,
      body: 'The wording in the answer notes might confuse juniors reading it. @meera.iyer could you take a look?',
      mentionIds: [meera.id],
      createdAt: minutesAgo(7200),
      baseScore: 2,
      parentId: null,
    },
  ];
}

function commentsFor(questionId: string): StoredComment[] {
  const existing = store.get(questionId);
  if (existing) return existing;
  const created = seed(questionId);
  store.set(questionId, created);
  return created;
}

function toComment(stored: StoredComment, viewerId: string): Comment {
  const myVote = votes.get(voteKey(viewerId, stored.id)) ?? VOTE.NONE;
  return commentSchema.parse({
    id: stored.id,
    author: stored.author,
    body: stored.body,
    mentions: MOCK_USERS.filter((user) => stored.mentionIds.includes(user.id)),
    createdAt: stored.createdAt,
    score: stored.baseScore + myVote,
    myVote,
    parentId: stored.parentId,
  });
}

const byNewest = (a: Comment, b: Comment) => Date.parse(b.createdAt) - Date.parse(a.createdAt);
const byOldest = (a: Comment, b: Comment) => byNewest(b, a);
const byTop = (a: Comment, b: Comment) => b.score - a.score || byNewest(a, b);

export async function getComments(
  questionId: string,
  sort: CommentSort,
  viewerId: string,
): Promise<Thread[]> {
  await delay();
  const all = commentsFor(questionId).map((stored) => toComment(stored, viewerId));
  const topLevel = all
    .filter((comment) => comment.parentId === null)
    .sort(sort === COMMENT_SORT.TOP ? byTop : byNewest);
  return topLevel.map((comment) =>
    threadSchema.parse({
      ...comment,
      replies: all.filter((reply) => reply.parentId === comment.id).sort(byOldest),
    }),
  );
}

// The real list is everyone with platform access except the viewer.
export async function getMentionableUsers(viewerId: string): Promise<MentionUser[]> {
  await delay();
  return MOCK_USERS.filter((user) => user.id !== viewerId);
}

export async function postComment(
  input: PostCommentInput & { questionId: string; author: MentionUser },
): Promise<Comment> {
  await delay();
  const stored: StoredComment = {
    id: `${input.questionId}:new-${nextId++}`,
    author: input.author,
    body: input.body,
    mentionIds: input.mentionIds,
    createdAt: new Date().toISOString(),
    baseScore: 0,
    parentId: input.parentId,
  };
  commentsFor(input.questionId).push(stored);
  return toComment(stored, input.author.id);
}

export async function voteOnComment(input: {
  commentId: string;
  viewerId: string;
  value: VoteValue;
}): Promise<void> {
  await delay();
  votes.set(voteKey(input.viewerId, input.commentId), input.value);
}
