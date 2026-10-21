const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const dateFormat = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

// Falls back to the raw value so an unexpected timestamp never throws during render.
function format(formatter: Intl.DateTimeFormat, value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : formatter.format(date);
}

export const formatDateTime = (value: string): string => format(dateTimeFormat, value);
export const formatDate = (value: string): string => format(dateFormat, value);

// Timestamps from different endpoints may differ in formatting but still be the same instant.
export const isSameInstant = (a: string, b: string): boolean =>
  new Date(a).getTime() === new Date(b).getTime();

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });
export const formatTime = (value: string): string => format(timeFormat, value);
