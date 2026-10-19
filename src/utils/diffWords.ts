export type DiffSegmentType = 'same' | 'added' | 'removed';

export interface DiffSegment {
  type: DiffSegmentType;
  text: string;
}

// Whitespace stays as its own tokens so segments rejoin into the original text.
const tokenize = (value: string): string[] => value.match(/\s+|\S+/g) ?? [];

function pushSegment(segments: DiffSegment[], type: DiffSegmentType, text: string) {
  const last = segments[segments.length - 1];
  if (last?.type === type) last.text += text;
  else segments.push({ type, text });
}

// Word-level diff via longest common subsequence; inputs are short question texts.
export function diffWords(before: string, after: string): DiffSegment[] {
  const a = tokenize(before);
  const b = tokenize(after);
  const lengths: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  );

  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lengths[i][j] =
        a[i] === b[j] ? lengths[i + 1][j + 1] + 1 : Math.max(lengths[i + 1][j], lengths[i][j + 1]);
    }
  }

  const segments: DiffSegment[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      pushSegment(segments, 'same', a[i]);
      i++;
      j++;
    } else if (lengths[i + 1][j] >= lengths[i][j + 1]) {
      pushSegment(segments, 'removed', a[i++]);
    } else {
      pushSegment(segments, 'added', b[j++]);
    }
  }
  while (i < a.length) pushSegment(segments, 'removed', a[i++]);
  while (j < b.length) pushSegment(segments, 'added', b[j++]);
  return segments;
}
