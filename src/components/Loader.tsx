import { COMMON_COPY } from '@/constants';
import './Loader.css';

interface LoaderProps {
  label?: string;
}

export function Loader({ label = COMMON_COPY.LOADING }: LoaderProps) {
  return (
    <div className="loader" role="status">
      <span className="loader__spinner" aria-hidden="true" />
      <span className="loader__label">{label}</span>
    </div>
  );
}
