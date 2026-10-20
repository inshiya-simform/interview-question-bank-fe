import type { ReactNode } from 'react';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  titleId?: string;
  children?: ReactNode;
}

// Page title and intro on the left, page-level actions (children) on the right.
export function PageHeader({ title, subtitle, titleId, children }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header__text">
        <h1 id={titleId} className="page-header__title">
          {title}
        </h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {children && <div className="page-header__actions">{children}</div>}
    </header>
  );
}
