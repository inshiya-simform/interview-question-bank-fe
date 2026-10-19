import { REVIEW_COPY, STATUS_TAB_LABEL } from '@/constants';
import type { StatusTab } from '@/constants';
import { cn } from '@/utils/cn';
import './StatusTabs.css';

interface StatusTabsProps {
  tabs: readonly StatusTab[];
  active: StatusTab;
  counts: Record<StatusTab, number>;
  onChange: (tab: StatusTab) => void;
}

export function StatusTabs({ tabs, active, counts, onChange }: StatusTabsProps) {
  return (
    <div role="group" aria-label={REVIEW_COPY.TABS_LABEL} className="stabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={cn(
            'stabs__tab',
            tab && `stabs__tab--${tab.toLowerCase()}`,
            tab === active && 'stabs__tab--active',
          )}
          aria-pressed={tab === active}
          onClick={() => onChange(tab)}
        >
          {STATUS_TAB_LABEL[tab]}
          <span className="stabs__count">{counts[tab]}</span>
        </button>
      ))}
    </div>
  );
}
