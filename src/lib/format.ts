import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export function useFormatDate() {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  return (date: string | number | Date) =>
    new Intl.DateTimeFormat(currentLocale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(date));
}

export function formatReadingTime(readingTime: number): string {
  const minutes = Math.max(1, Math.ceil(readingTime || 1));
  return `${minutes} min read`;
}
