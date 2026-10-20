import type { ReactNode } from 'react';
import { Icon } from '@/components';
import { AUTH_COPY } from '@/constants';
import './AuthLayout.css';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="auth">
      <aside className="auth__panel">
        <div className="auth__brand">
          <span className="auth__mark">
            <Icon name="brand" />
          </span>
          {AUTH_COPY.APP_NAME}
        </div>
        <div className="auth__pitch">
          <p className="auth__headline">{AUTH_COPY.BRAND_HEADLINE}</p>
          <p className="auth__text">{AUTH_COPY.BRAND_TEXT}</p>
        </div>
      </aside>
      <main className="auth__main">
        <section className="auth__card">
          <header className="auth__header">
            <h1 className="auth__title">{title}</h1>
            <p className="auth__subtitle">{subtitle}</p>
          </header>
          {children}
          <p className="auth__footer">{footer}</p>
        </section>
      </main>
    </div>
  );
}
