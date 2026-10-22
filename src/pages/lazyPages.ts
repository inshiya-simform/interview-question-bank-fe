import { lazy } from 'react';

export const LazyHomePage = lazy(() => import('./HomePage').then((m) => ({ default: m.HomePage })));
export const LazyLoginPage = lazy(() =>
  import('./LoginPage').then((m) => ({ default: m.LoginPage })),
);
export const LazyRegisterPage = lazy(() =>
  import('./RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
export const LazyForgotPasswordPage = lazy(() =>
  import('./ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
);
export const LazyResetPasswordPage = lazy(() =>
  import('./ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
);
export const LazyClientAccessPage = lazy(() =>
  import('./ClientAccessPage').then((m) => ({ default: m.ClientAccessPage })),
);
export const LazyClientFolderPage = lazy(() =>
  import('./ClientFolderPage').then((m) => ({ default: m.ClientFolderPage })),
);
export const LazyAddMemberPage = lazy(() =>
  import('./AddMemberPage').then((m) => ({ default: m.AddMemberPage })),
);
export const LazyMySubmissionsPage = lazy(() =>
  import('./MySubmissionsPage').then((m) => ({ default: m.MySubmissionsPage })),
);
export const LazyReviewQueuePage = lazy(() =>
  import('./ReviewQueuePage').then((m) => ({ default: m.ReviewQueuePage })),
);
export const LazyImportPage = lazy(() =>
  import('./ImportPage').then((m) => ({ default: m.ImportPage })),
);
