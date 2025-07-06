/**
 * Formats a date to a human-readable string that indicates the time elapsed since that date.
 *
 * @param date - The date to format.
 */
export function formatDistanceToNowIntl(date: Date): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);

  const absSec = Math.abs(diffSec);

  if (absSec < 60) {
    return rtf.format(-diffSec, 'second');
  }

  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) {
    return rtf.format(-diffMin, 'minute');
  }

  const diffHr = Math.round(diffMin / 60);
  if (Math.abs(diffHr) < 24) {
    return rtf.format(-diffHr, 'hour');
  }

  const diffDay = Math.round(diffHr / 24);
  return rtf.format(-diffDay, 'day');
}
