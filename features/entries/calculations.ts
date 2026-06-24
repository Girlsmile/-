import type { EntryView, EntryType } from "@/features/entries/types";

/** DashboardStats contains summary values rendered in the dashboard metrics. */
export type DashboardStats = {
  /** Number of unique training dates. */
  totalDays: number;
  /** Number of unique dates in the selected month. */
  monthDays: number;
  /** Longest consecutive date streak. */
  bestStreak: number;
  /** Maximum parsed bench press work weight. */
  benchMax: number | null;
};

/** calculateDashboardStats derives high-level metrics from entries. */
export function calculateDashboardStats(entries: EntryView[], currentMonth: string): DashboardStats {
  const dates = uniqueDates(entries);
  const monthDays = new Set(entries.filter((entry) => entry.date.startsWith(currentMonth)).map((entry) => entry.date)).size;
  const benchWeights = entries.map(getBenchWeight).filter((value): value is number => value !== null);

  return {
    totalDays: dates.length,
    monthDays,
    bestStreak: calculateBestStreak(dates),
    benchMax: benchWeights.length ? Math.max(...benchWeights) : null
  };
}

/** uniqueDates returns sorted unique entry date strings. */
export function uniqueDates(entries: EntryView[]): string[] {
  return [...new Set(entries.map((entry) => entry.date))].sort();
}

/** getBenchWeight extracts a bench press work weight from free-form text. */
export function getBenchWeight(entry: EntryView): number | null {
  const match = entry.text.match(/(?:平板)?卧推\s*(\d+(?:\.\d+)?)\s*kg?/i);
  return match ? Number(match[1]) : null;
}

/** calculateBestStreak returns the longest consecutive-day streak. */
export function calculateBestStreak(dates: string[]): number {
  if (!dates.length) return 0;

  let best = 1;
  let current = 1;

  for (let index = 1; index < dates.length; index += 1) {
    const diffDays = Math.round((parseDate(dates[index]).getTime() - parseDate(dates[index - 1]).getTime()) / 86400000);
    if (diffDays === 1) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }

  return best;
}

/** groupEntriesByDate groups entries under their ISO date string. */
export function groupEntriesByDate(entries: EntryView[]): Record<string, EntryView[]> {
  return entries.reduce<Record<string, EntryView[]>>((groups, entry) => {
    groups[entry.date] ||= [];
    groups[entry.date].push(entry);
    return groups;
  }, {});
}

/** countEntriesByType counts entries for each supported category. */
export function countEntriesByType(entries: EntryView[]): Record<EntryType, number> {
  return entries.reduce<Record<EntryType, number>>(
    (counts, entry) => {
      counts[entry.type] += 1;
      return counts;
    },
    { push: 0, pull: 0, legs: 0, mixed: 0 }
  );
}

/** formatDate formats an ISO date string for display. */
export function formatDate(value: string): string {
  const date = parseDate(value);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/** dateKey formats a Date as yyyy-mm-dd. */
export function dateKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** parseDate creates a local Date from an ISO date string. */
export function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}
