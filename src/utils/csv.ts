import { CSV_SEPARATOR } from '@/constants/searchParams';

export function splitCsv(value: string | undefined): string[] {
  return value ? value.split(CSV_SEPARATOR).filter(Boolean) : [];
}

export function joinCsv(values: readonly (string | number)[]): string {
  return values.join(CSV_SEPARATOR);
}
