import { ToastContainer } from 'react-toastify';
import { TOAST_DURATION_MS } from '@/constants';
import 'react-toastify/dist/ReactToastify.css';
import './Toaster.css';

export function Toaster() {
  return (
    <ToastContainer
      position="top-right"
      theme="dark"
      autoClose={TOAST_DURATION_MS}
      hideProgressBar
      icon={false}
      toastClassName="toast"
    />
  );
}
