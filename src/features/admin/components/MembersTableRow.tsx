import type { AdminUser } from '@/api';
import { Badge, Button, Icon } from '@/components';
import { ADMIN_COPY, ROLE_LABELS } from '@/constants';

interface MembersTableRowProps {
  member: AdminUser;
  isPending: boolean;
  onSetActive: (userId: string, isActive: boolean) => void;
}

export function MembersTableRow({ member, isPending, onSetActive }: MembersTableRowProps) {
  const label = member.isActive
    ? ADMIN_COPY.MARK_INACTIVE_USER(member.email)
    : ADMIN_COPY.MARK_ACTIVE_USER(member.email);

  return (
    <tr>
      <th scope="row">
        <span className="members__name">{member.name}</span>
        <span className="members__email">{member.email}</span>
      </th>
      <td>
        <Badge variant="category">{ROLE_LABELS[member.role]}</Badge>
      </td>
      <td>
        <Badge variant={member.isActive ? 'success' : 'danger'}>
          {member.isActive ? ADMIN_COPY.STATUS_ACTIVE : ADMIN_COPY.STATUS_INACTIVE}
        </Badge>
      </td>
      <td>
        <Button
          variant="secondary"
          className="members__action"
          disabled={isPending}
          aria-label={label}
          title={label}
          onClick={() => onSetActive(member.id, !member.isActive)}
        >
          <Icon name={member.isActive ? 'power' : 'userCheck'} />
        </Button>
      </td>
    </tr>
  );
}
