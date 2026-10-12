// A full reload is used instead of resetting the boundary: React.lazy caches a failed chunk
// import, so a plain re-render would fail the same way.
export function useErrorFallback() {
  const reload = () => window.location.reload();
  return { reload };
}
