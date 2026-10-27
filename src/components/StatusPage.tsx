import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from './Icon';
import type { IconName } from './iconPaths';
import './StatusPage.css';

interface StatusPageProps {
  eyebrow: string;
  codeStart: string;
  codeEnd: string;
  icon: IconName;
  title: string;
  description: string;
  compact?: boolean;
  children: ReactNode;
}

// Renders a section, not a main: it is used both standalone and inside the app layouts.
export function StatusPage({
  eyebrow,
  codeStart,
  codeEnd,
  icon,
  title,
  description,
  compact = false,
  children,
}: StatusPageProps) {
  return (
    <section className={cn('status-page', compact && 'status-page--compact')}>
      <p className="status-page__eyebrow">{eyebrow}</p>
      <div className="status-page__code" aria-hidden="true">
        <span>{codeStart}</span>
        <span className="status-page__badge">
          <Icon name={icon} size={64} />
        </span>
        <span>{codeEnd}</span>
      </div>
      <h1 className="status-page__title">{title}</h1>
      <p className="status-page__description">{description}</p>
      <div className="status-page__actions">{children}</div>
    </section>
  );
}
