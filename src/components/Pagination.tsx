import { getPageItems } from '@/utils/pagination';
import { Button } from './Button';
import './Pagination.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label: string;
  previousLabel: string;
  nextLabel: string;
  pageLabel: (page: number) => string;
  statusLabel: string;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  label,
  previousLabel,
  nextLabel,
  pageLabel,
  statusLabel,
}: PaginationProps) {
  return (
    <nav className="pagination" aria-label={label}>
      <p className="pagination__status">{statusLabel}</p>
      <div className="pagination__pages">
        <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          {previousLabel}
        </Button>
        {getPageItems(page, totalPages).map((item) =>
          item.type === 'gap' ? (
            <span key={item.key} className="pagination__gap" aria-hidden="true">
              …
            </span>
          ) : (
            <Button
              key={item.page}
              variant={item.page === page ? 'primary' : 'secondary'}
              className="pagination__page"
              aria-label={pageLabel(item.page)}
              aria-current={item.page === page ? 'page' : undefined}
              onClick={() => onPageChange(item.page)}
            >
              {item.page}
            </Button>
          ),
        )}
        <Button
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          {nextLabel}
        </Button>
      </div>
    </nav>
  );
}
