import { lazy } from 'react';

export const LazyHomePage = lazy(() => import('./HomePage').then((m) => ({ default: m.HomePage })));
export const LazyLoginPage = lazy(() =>
  import('./LoginPage').then((m) => ({ default: m.LoginPage })),
);
export const LazyRegisterPage = lazy(() =>
  import('./RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
