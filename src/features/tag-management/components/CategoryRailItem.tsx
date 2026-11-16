import type { ManagedCategory } from '@/api';
import { Badge } from '@/components';
import { cn } from '@/utils/cn';

interface CategoryRailItemProps {
  category: ManagedCategory;
  isSelected: boolean;
  onSelect: (categoryId: number) => void;
}

export function CategoryRailItem({ category, isSelected, onSelect }: CategoryRailItemProps) {
  return (
    <li>
      <button
        type="button"
        className={cn('category-rail__item', isSelected && 'category-rail__item--selected')}
        aria-pressed={isSelected}
        title={category.name}
        onClick={() => onSelect(category.id)}
      >
        <span className="category-rail__name">{category.name}</span>
        <Badge variant="category">{String(category.tagCount)}</Badge>
      </button>
    </li>
  );
}
