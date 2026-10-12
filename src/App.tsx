import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes } from 'react-router-dom';
import { ErrorFallback, Loader } from '@/components';
import { ROUTES } from '@/constants';
import { GuestOnly, RequireAuth } from '@/features/auth';
import { LazyHomePage, LazyLoginPage, LazyRegisterPage } from '@/pages/lazyPages';

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route path={ROUTES.HOME} element={<LazyHomePage />} />
          </Route>
          <Route element={<GuestOnly />}>
            <Route path={ROUTES.LOGIN} element={<LazyLoginPage />} />
            <Route path={ROUTES.REGISTER} element={<LazyRegisterPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
