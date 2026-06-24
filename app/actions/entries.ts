"use server";

import { revalidatePath } from "next/cache";
import { createDataEntry, deleteDataEntry } from "@/features/entries/repository";
import { parseCreateEntryForm } from "@/features/entries/validation";
import { requireUser } from "@/lib/auth/session";

/** createEntryAction validates form input and creates data for the current user. */
export async function createEntryAction(formData: FormData) {
  const user = await requireUser();
  const input = parseCreateEntryForm(formData);
  await createDataEntry(user.id, input);
  revalidatePath("/");
}

/** deleteEntryAction deletes one entry only when it belongs to the current user. */
export async function deleteEntryAction(formData: FormData) {
  const user = await requireUser();
  const entryId = String(formData.get("id") ?? "");
  await deleteDataEntry(user.id, entryId);
  revalidatePath("/");
}
