import { cn } from '@/utils/cn';
import { useSanitizedHtml } from './useSanitizedHtml';
import './RichTextContent.css';

interface RichTextContentProps {
  html: string;
  className?: string;
}

export function RichTextContent({ html, className }: RichTextContentProps) {
  const safeHtml = useSanitizedHtml(html);

  // The only dangerouslySetInnerHTML in the app: the value is the sanitiser's output.
  return (
    <div className={cn('rich-content', className)} dangerouslySetInnerHTML={{ __html: safeHtml }} />
  );
}
