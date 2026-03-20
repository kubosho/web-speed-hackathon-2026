const longDateFormat = new Intl.DateTimeFormat("ja", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("ja", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const relativeFormat = new Intl.RelativeTimeFormat("ja", { numeric: "always" });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["week", 7 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
  ["second", 1000],
];

export function formatLongDate(date: string): string {
  return longDateFormat.format(new Date(date));
}

export function formatTime(date: string): string {
  return timeFormat.format(new Date(date));
}

export function formatRelativeTime(date: string): string {
  const diff = new Date(date).getTime() - Date.now();
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) {
      return relativeFormat.format(Math.round(diff / ms), unit);
    }
  }
  return relativeFormat.format(0, "second");
}
