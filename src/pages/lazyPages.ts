import { lazy } from 'react';

export const LazyLoginPage = lazy(() =>
  import('./LoginPage').then((m) => ({ default: m.LoginPage })),
);
export const LazyRegisterPage = lazy(() =>
  import('./RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
