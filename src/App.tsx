import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes } from 'react-router-dom';
import { ErrorFallback, Loader } from '@/components';
import { PERMISSIONS, ROUTES } from '@/constants';
import { RequireSuperAdmin, SuperAdminHomeRedirect, SuperAdminLayout } from '@/features/admin';
import { GuestOnly, RequireAuth, RequirePermission } from '@/features/auth';
import { RoleLayout } from '@/features/shell';
import {
  LazyAddMemberPage,
  LazyAuditLogsPage,
  LazyChangePasswordPage,
  LazyClientAccessPage,
  LazyClientFolderPage,
  LazyForgotPasswordPage,
  LazyHomePage,
  LazyImportPage,
  LazyLoginPage,
  LazyMySubmissionsPage,
  LazyNotificationsPage,
  LazyNotFoundPage,
  LazyRegisterPage,
  LazyResetPasswordPage,
  LazyReviewQueuePage,
  LazySavedPage,
} from '@/pages/lazyPages';

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route element={<RoleLayout />}>
              <Route element={<SuperAdminHomeRedirect />}>
                <Route path={ROUTES.HOME} element={<LazyHomePage />} />
              </Route>
              <Route element={<RequirePermission permissions={[PERMISSIONS.QUESTION_CREATE]} />}>
                <Route path={ROUTES.MY_QUESTIONS} element={<LazyMySubmissionsPage />} />
              </Route>
              <Route path={ROUTES.NOTIFICATIONS} element={<LazyNotificationsPage />} />
              <Route path={ROUTES.CHANGE_PASSWORD} element={<LazyChangePasswordPage />} />
              <Route element={<RequirePermission permissions={[PERMISSIONS.QUESTION_READ]} />}>
                <Route path={ROUTES.SAVED} element={<LazySavedPage />} />
              </Route>
              <Route element={<RequirePermission permissions={[PERMISSIONS.QUESTION_CREATE]} />}>
                <Route path={ROUTES.IMPORT} element={<LazyImportPage />} />
              </Route>
              <Route element={<RequirePermission permissions={[PERMISSIONS.QUESTION_REVIEW]} />}>
                <Route path={ROUTES.REVIEW_QUEUE} element={<LazyReviewQueuePage />} />
              </Route>
            </Route>
            <Route element={<RequireSuperAdmin />}>
              <Route element={<SuperAdminLayout />}>
                <Route path={ROUTES.ADMIN_CLIENTS} element={<LazyClientAccessPage />} />
                <Route path={ROUTES.ADMIN_CLIENT_FOLDER} element={<LazyClientFolderPage />} />
                <Route path={ROUTES.ADMIN_MEMBERS} element={<LazyAddMemberPage />} />
                <Route element={<RequirePermission permissions={[PERMISSIONS.AUDIT_READ]} />}>
                  <Route path={ROUTES.ADMIN_AUDIT_LOGS} element={<LazyAuditLogsPage />} />
                </Route>
              </Route>
            </Route>
          </Route>
          <Route element={<GuestOnly />}>
            <Route path={ROUTES.LOGIN} element={<LazyLoginPage />} />
            <Route path={ROUTES.REGISTER} element={<LazyRegisterPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<LazyForgotPasswordPage />} />
          </Route>
          <Route path={ROUTES.RESET_PASSWORD} element={<LazyResetPasswordPage />} />
          <Route path={ROUTES.NOT_FOUND} element={<LazyNotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
