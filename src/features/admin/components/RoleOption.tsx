import type { ChangeEvent } from 'react';
import { STAFF_ROLE_COPY } from '@/constants';
import type { StaffRole } from '@/constants';
import { cn } from '@/utils/cn';
import './RoleOption.css';

interface RoleOptionProps {
  role: StaffRole;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function RoleOption({ role, checked, onChange }: RoleOptionProps) {
  return (
    <label className={cn('role-option', checked && 'role-option--checked')}>
      <input type="radio" name="role" value={role} checked={checked} onChange={onChange} />
      <span className="role-option__text">
        <span className="role-option__name">{role}</span>
        <span className="role-option__description">{STAFF_ROLE_COPY[role].DESCRIPTION}</span>
      </span>
    </label>
  );
}
