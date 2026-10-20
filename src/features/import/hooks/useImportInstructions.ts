import { useDownloadImportTemplateMutation } from '@/api/hooks';
import { IMPORT_CSV_MIME, IMPORT_EXAMPLE_ROWS } from '@/constants';
import { useFileDownload } from '@/hooks/useFileDownload';
import { toCsvText } from '@/utils/csvText';

export function useImportInstructions() {
  const download = useFileDownload();
  const { mutate, isPending } = useDownloadImportTemplateMutation();

  return {
    exampleCsv: toCsvText(IMPORT_EXAMPLE_ROWS),
    isDownloading: isPending,
    downloadTemplate: () =>
      mutate(undefined, {
        onSuccess: ({ filename, content }) => download(filename, content, IMPORT_CSV_MIME),
      }),
  };
}
