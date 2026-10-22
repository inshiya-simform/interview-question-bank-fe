import type { ReactNode } from 'react';
import './Alert.css';

interface AlertProps {
  children: ReactNode;
  // `status` is for non-error confirmations so assistive tech announces them politely.
  role?: 'alert' | 'status';
}

export function Alert({ children, role = 'alert' }: AlertProps) {
  return (
    <div className="alert" role={role}>
      {children}
    </div>
  );
}
