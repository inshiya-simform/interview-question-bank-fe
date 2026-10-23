import { lazy } from 'react';

// Kept out of the barrel so the editor (and Tiptap) load only when a form opens.
export const LazyRichTextEditor = lazy(() =>
  import('./RichTextEditor').then((module) => ({ default: module.RichTextEditor })),
);
