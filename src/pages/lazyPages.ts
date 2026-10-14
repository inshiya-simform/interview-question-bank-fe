import { lazy } from 'react';

export const LazyHomePage = lazy(() => import('./HomePage').then((m) => ({ default: m.HomePage })));
export const LazyLoginPage = lazy(() =>
  import('./LoginPage').then((m) => ({ default: m.LoginPage })),
);
export const LazyRegisterPage = lazy(() =>
  import('./RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
export const LazyClientAccessPage = lazy(() =>
  import('./ClientAccessPage').then((m) => ({ default: m.ClientAccessPage })),
);
export const LazyAddMemberPage = lazy(() =>
  import('./AddMemberPage').then((m) => ({ default: m.AddMemberPage })),
);
