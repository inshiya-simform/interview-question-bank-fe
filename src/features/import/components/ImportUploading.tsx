import { IMPORT_COPY } from '@/constants';
import './ImportStatus.css';

export function ImportUploading() {
  return (
    <div className="istatus istatus--center">
      <span className="istatus__spinner" aria-hidden="true" />
      <p className="istatus__text">{IMPORT_COPY.UPLOADING}</p>
    </div>
  );
}
