import type { EntryView } from "@/features/entries/types";
import type { CreateEntryInput } from "@/features/entries/validation";
import { prisma } from "@/lib/prisma";
import { toDatabaseDate, toIsoDate } from "@/features/entries/validation";

/** listDataEntries returns entries owned by one authenticated user. */
export async function listDataEntries(userId: string): Promise<EntryView[]> {
  const entries = await prisma.dataEntry.findMany({
    where: { userId },
    orderBy: [{ occurredOn: "desc" }, { createdAt: "desc" }]
  });

  return entries.map((entry) => ({
    id: entry.id,
    date: toIsoDate(entry.occurredOn),
    type: entry.type as EntryView["type"],
    text: entry.content
  }));
}

/** createDataEntry creates a row for the authenticated user only. */
export async function createDataEntry(userId: string, input: CreateEntryInput): Promise<void> {
  await prisma.dataEntry.create({
    data: {
      userId,
      occurredOn: toDatabaseDate(input.date),
      type: input.type,
      content: input.text
    }
  });
}

/** deleteDataEntry deletes a row only when it belongs to the authenticated user. */
export async function deleteDataEntry(userId: string, entryId: string): Promise<void> {
  if (!entryId) return;

  await prisma.dataEntry.deleteMany({
    where: {
      id: entryId,
      userId
    }
  });
}
