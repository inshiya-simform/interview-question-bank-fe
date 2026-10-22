import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes } from 'react-router-dom';
import { ErrorFallback, Loader } from '@/components';
import { PERMISSIONS, ROUTES } from '@/constants';
import { RequireSuperAdmin, SuperAdminHomeRedirect, SuperAdminLayout } from '@/features/admin';
import { GuestOnly, RequireAuth, RequirePermission } from '@/features/auth';
import { AppLayout } from '@/features/shell';
import {
  LazyAddMemberPage,
  LazyClientAccessPage,
  LazyClientFolderPage,
  LazyForgotPasswordPage,
  LazyHomePage,
  LazyImportPage,
  LazyLoginPage,
  LazyMySubmissionsPage,
  LazyRegisterPage,
  LazyResetPasswordPage,
  LazyReviewQueuePage,
} from '@/pages/lazyPages';

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route element={<AppLayout />}>
              <Route element={<SuperAdminHomeRedirect />}>
                <Route path={ROUTES.HOME} element={<LazyHomePage />} />
              </Route>
              <Route element={<RequirePermission permissions={[PERMISSIONS.QUESTION_CREATE]} />}>
                <Route path={ROUTES.MY_QUESTIONS} element={<LazyMySubmissionsPage />} />
              </Route>
              <Route path={ROUTES.IMPORT} element={<LazyImportPage />} />
              <Route element={<RequirePermission permissions={[PERMISSIONS.QUESTION_REVIEW]} />}>
                <Route path={ROUTES.REVIEW_QUEUE} element={<LazyReviewQueuePage />} />
              </Route>
            </Route>
            <Route element={<RequireSuperAdmin />}>
              <Route element={<SuperAdminLayout />}>
                <Route path={ROUTES.ADMIN_CLIENTS} element={<LazyClientAccessPage />} />
                <Route path={ROUTES.ADMIN_CLIENT_FOLDER} element={<LazyClientFolderPage />} />
                <Route path={ROUTES.ADMIN_MEMBERS} element={<LazyAddMemberPage />} />
              </Route>
            </Route>
          </Route>
          <Route element={<GuestOnly />}>
            <Route path={ROUTES.LOGIN} element={<LazyLoginPage />} />
            <Route path={ROUTES.REGISTER} element={<LazyRegisterPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<LazyForgotPasswordPage />} />
          </Route>
          <Route path={ROUTES.RESET_PASSWORD} element={<LazyResetPasswordPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
