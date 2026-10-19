import type { ClientAccess } from '@/api';
import { Badge, Button } from '@/components';
import { ADMIN_COPY } from '@/constants';
import { useClientAccessRow } from '../hooks/useClientAccessRow';
import { AddUserToClient } from './AddUserToClient';
import { UserChip } from './UserChip';
import './ClientAccessRow.css';

interface ClientAccessRowProps {
  client: ClientAccess;
}

export function ClientAccessRow({ client }: ClientAccessRowProps) {
  const { isAdding, isPending, isGranting, openAdd, closeAdd, addUser, removeUser } =
    useClientAccessRow(client);

  return (
    <tr className="access-row">
      <th scope="row">
        <div className="access-row__client">
          <span className="access-row__name">{client.name}</span>
          <Badge variant="client">{ADMIN_COPY.USER_COUNT(client.userCount)}</Badge>
        </div>
      </th>
      <td>
        <ul className="access-row__users">
          {client.users.map((user) => (
            <li key={user.id}>
              <UserChip
                label={user.email}
                removeLabel={ADMIN_COPY.REMOVE_USER(user.email, client.name)}
                disabled={isPending}
                onRemove={() => removeUser(user.id)}
              />
            </li>
          ))}
          <li className={isAdding ? 'access-row__editor' : undefined}>
            {isAdding ? (
              <AddUserToClient
                existingUserIds={client.users.map((user) => user.id)}
                isPending={isGranting}
                onAdd={addUser}
                onCancel={closeAdd}
              />
            ) : (
              <Button variant="secondary" className="access-row__add" onClick={openAdd}>
                + {ADMIN_COPY.ADD_USER}
              </Button>
            )}
          </li>
        </ul>
      </td>
    </tr>
  );
}
