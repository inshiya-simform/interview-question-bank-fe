import { cn } from '@/utils/cn';
import './Badge.css';

export type BadgeVariant = 'category' | 'tag' | 'client';

interface BadgeProps {
  variant: BadgeVariant;
  children: string;
}

export function Badge({ variant, children }: BadgeProps) {
  return <span className={cn('badge', `badge--${variant}`)}>{children}</span>;
}
