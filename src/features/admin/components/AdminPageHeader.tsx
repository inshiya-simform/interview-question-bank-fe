import './AdminPageHeader.css';

interface AdminPageHeaderProps {
  title: string;
  subtitle: string;
}

export function AdminPageHeader({ title, subtitle }: AdminPageHeaderProps) {
  return (
    <header className="admin-header">
      <h1 className="admin-header__title">{title}</h1>
      <p className="admin-header__subtitle">{subtitle}</p>
    </header>
  );
}
