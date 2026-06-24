/** EntryType is the supported workout/data category set. */
export type EntryType = "push" | "pull" | "legs" | "mixed";

/** EntryView is the serializable shape consumed by UI components. */
export type EntryView = {
  /** Database identifier. */
  id: string;
  /** ISO date string in yyyy-mm-dd format. */
  date: string;
  /** Category used for filters and distribution charts. */
  type: EntryType;
  /** Free-form record content. */
  text: string;
};

/** ENTRY_TYPES lists valid category values. */
export const ENTRY_TYPES = ["push", "pull", "legs", "mixed"] as const;

/** TYPE_LABELS maps category values to display labels. */
export const TYPE_LABELS: Record<EntryType, string> = {
  push: "推日",
  pull: "拉日",
  legs: "腿核",
  mixed: "混合"
};

/** TYPE_SHORT_LABELS maps category values to compact calendar labels. */
export const TYPE_SHORT_LABELS: Record<EntryType, string> = {
  push: "推",
  pull: "拉",
  legs: "腿核",
  mixed: "混合"
};
