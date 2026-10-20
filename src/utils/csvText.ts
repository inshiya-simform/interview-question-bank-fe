const NEEDS_QUOTES = /[",\r\n]/;

function toCell(value: string): string {
  return NEEDS_QUOTES.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export function toCsvText(rows: readonly (readonly string[])[]): string {
  return rows.map((row) => row.map(toCell).join(',')).join('\r\n');
}
