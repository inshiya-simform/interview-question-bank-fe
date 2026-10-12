import type { ReactNode } from 'react';
import './Alert.css';

interface AlertProps {
  children: ReactNode;
}

export function Alert({ children }: AlertProps) {
  return (
    <div className="alert" role="alert">
      {children}
    </div>
  );
}
