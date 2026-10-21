import type { AdminUser } from '@/api';
import { ADMIN_COPY } from '@/constants';
import { ClientFolderUserRow } from './ClientFolderUserRow';
import './ClientFolderUsersTable.css';

interface ClientFolderUsersTableProps {
  clientName: string;
  users: readonly AdminUser[];
  isPending: boolean;
  onRemove: (userId: string) => void;
}

export function ClientFolderUsersTable({
  clientName,
  users,
  isPending,
  onRemove,
}: ClientFolderUsersTableProps) {
  return (
    <div className="folder-users">
      <div className="folder-users__scroll">
        <table className="folder-users__table">
          <thead>
            <tr>
              <th scope="col">{ADMIN_COPY.COLUMN_FOLDER_USER}</th>
              <th scope="col">{ADMIN_COPY.COLUMN_FOLDER_ROLE}</th>
              <th scope="col">
                <span className="sr-only">{ADMIN_COPY.COLUMN_ACTIONS}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <ClientFolderUserRow
                key={user.id}
                user={user}
                clientName={clientName}
                isPending={isPending}
                onRemove={onRemove}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
