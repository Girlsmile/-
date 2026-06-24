import { redirect } from "next/navigation";
import { signOutAction } from "@/app/actions/auth";
import { createEntryAction, deleteEntryAction } from "@/app/actions/entries";
import { requireUser } from "@/lib/auth/session";
import { listDataEntries } from "@/features/entries/repository";
import { StrengthDashboard } from "@/features/entries/StrengthDashboard";

export const dynamic = "force-dynamic";

/** HomePage renders the protected dashboard backed by database entries. */
export default async function HomePage() {
  const user = await requireUser();
  const entries = await listDataEntries(user.id);

  if (!user.email) {
    redirect("/login");
  }

  return (
    <StrengthDashboard
      createEntryAction={createEntryAction}
      deleteEntryAction={deleteEntryAction}
      entries={entries}
      signOutAction={signOutAction}
      userEmail={user.email}
    />
  );
}
