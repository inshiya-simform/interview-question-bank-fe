import { ICON_PATHS } from './iconPaths';
import type { IconName } from './iconPaths';

interface IconProps {
  name: IconName;
  size?: number;
}

// Decorative only: callers label the control that contains the icon.
export function Icon({ name, size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}
