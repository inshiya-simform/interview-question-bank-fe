import type { ReactNode } from 'react';
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
    <main className="auth">
      <div className="auth__brand">{AUTH_COPY.APP_NAME}</div>
      <section className="auth__card">
        <header className="auth__header">
          <h1 className="auth__title">{title}</h1>
          <p className="auth__subtitle">{subtitle}</p>
        </header>
        {children}
        <p className="auth__footer">{footer}</p>
      </section>
    </main>
  );
}
