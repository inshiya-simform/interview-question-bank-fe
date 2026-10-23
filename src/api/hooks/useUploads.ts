import { useMutation } from '@tanstack/react-query';
import { uploadImage } from '../service/uploads.service';

export function useUploadImageMutation() {
  return useMutation({ mutationFn: uploadImage });
}
