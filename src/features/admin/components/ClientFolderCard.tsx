import { Link } from 'react-router-dom';
import type { Client } from '@/api';
import { Icon } from '@/components';
import { ADMIN_COPY, clientFolderPath } from '@/constants';
import './ClientFolderCard.css';

interface ClientFolderCardProps {
  client: Client;
}

export function ClientFolderCard({ client }: ClientFolderCardProps) {
  return (
    <Link
      className="folder-card"
      to={clientFolderPath(client.id)}
      state={{ clientName: client.name }}
    >
      <span className="folder-card__icon">
        <Icon name="folder" size={22} />
      </span>
      <span className="folder-card__name">{client.name}</span>
      <span className="folder-card__hint">{ADMIN_COPY.OPEN_FOLDER}</span>
    </Link>
  );
}
