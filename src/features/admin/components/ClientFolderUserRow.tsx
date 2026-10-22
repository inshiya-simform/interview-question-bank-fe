import type { AdminUser } from '@/api';
import { Badge, Button } from '@/components';
import { ADMIN_COPY, ROLE_LABELS } from '@/constants';

interface ClientFolderUserRowProps {
  user: AdminUser;
  clientName: string;
  isPending: boolean;
  onRemove: (userId: string) => void;
}

export function ClientFolderUserRow({
  user,
  clientName,
  isPending,
  onRemove,
}: ClientFolderUserRowProps) {
  return (
    <tr>
      <th scope="row">
        <span className="folder-users__name">{user.name}</span>
        <span className="folder-users__email">{user.email}</span>
      </th>
      <td>
        <Badge variant="category">{ROLE_LABELS[user.role]}</Badge>
      </td>
      <td className="folder-users__actions">
        <Button
          variant="secondary"
          disabled={isPending}
          aria-label={ADMIN_COPY.REMOVE_USER(user.email, clientName)}
          onClick={() => onRemove(user.id)}
        >
          {ADMIN_COPY.REMOVE}
        </Button>
      </td>
    </tr>
  );
}
