import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ErrorFallback, Loader } from '@/components';
import { ROUTES } from '@/constants';
import { LazyLoginPage, LazyRegisterPage } from '@/pages/lazyPages';

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.LOGIN} replace />} />
          <Route path={ROUTES.LOGIN} element={<LazyLoginPage />} />
          <Route path={ROUTES.REGISTER} element={<LazyRegisterPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
