import { z } from "zod";
import { ENTRY_TYPES } from "@/features/entries/types";

/** CreateEntryInput is validated input accepted by the data layer. */
export type CreateEntryInput = {
  /** ISO date string in yyyy-mm-dd format. */
  date: string;
  /** Category value validated against supported entry types. */
  type: (typeof ENTRY_TYPES)[number];
  /** Free-form content saved to the database. */
  text: string;
};

const createEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(ENTRY_TYPES),
  text: z.string().trim().min(1).max(2000)
});

/** parseCreateEntryForm validates form data before database writes. */
export function parseCreateEntryForm(formData: FormData): CreateEntryInput {
  const parsed = createEntrySchema.parse({
    date: String(formData.get("date") ?? ""),
    type: String(formData.get("type") ?? ""),
    text: String(formData.get("text") ?? "")
  });

  return parsed;
}

/** toDatabaseDate converts yyyy-mm-dd to a stable UTC midnight Date. */
export function toDatabaseDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

/** toIsoDate converts a Date to yyyy-mm-dd for UI serialization. */
export function toIsoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}
