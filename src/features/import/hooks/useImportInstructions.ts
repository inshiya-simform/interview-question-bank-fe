import { IMPORT_CSV_MIME, IMPORT_EXAMPLE_ROWS, IMPORT_TEMPLATE_FILENAME } from '@/constants';
import { useFileDownload } from '@/hooks/useFileDownload';
import { toCsvText } from '@/utils/csvText';

export function useImportInstructions() {
  const download = useFileDownload();

  return {
    exampleCsv: toCsvText(IMPORT_EXAMPLE_ROWS),
    downloadTemplate: () =>
      download(
        IMPORT_TEMPLATE_FILENAME,
        toCsvText(IMPORT_EXAMPLE_ROWS.slice(0, 1)),
        IMPORT_CSV_MIME,
      ),
  };
}
