import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/** LoginPage shows the auth form unless a valid session already exists. */
export default async function LoginPage({
  searchParams
}: {
  /** Query parameters used to display login feedback. */
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  const params = await searchParams;

  if (user) {
    redirect("/");
  }

  return <LoginForm error={params.error} />;
}
